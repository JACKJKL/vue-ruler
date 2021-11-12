<template>
  <div class="vue-ruler">
    <div :style="wrapperStyle" class="vue-ruler-wrapper" onselectstart="return false;">
      <section class="vue-ruler-tool" v-show="rulerVisible" style="height: 100%">
        <div class="vue-reluer-head">
          <div ref="horizontalRuler" class="vue-ruler-top" @mousedown.stop="horizontalDragRuler">
            <canvas
              id="canvas1"
              class="canvas vue-ruler-h"
              width="100"
              height="30"
              @mousedown.stop="horizontalDragRuler"
            ></canvas>
          </div>
        </div>
        <div ref="verticalRuler" class="vue-ruler-left" @mousedown.stop="verticalDragRuler">
          <canvas
            id="canvas2"
            class="canvas vue-ruler-v"
            width="30"
            height="100"
            @mousedown.stop="verticalDragRuler"
          ></canvas>
        </div>
        <!-- 拖拽时出现的线 -->
        <template v-if="isDrag">
          <div :style="{ top: verticalDottedTop + 'px' }" class="vue-ruler-ref-drag-h" />
          <div :style="{ left: horizontalDottedLeft + 'px' }" class="vue-ruler-ref-drag-v" />
          <div :style="dragDotStyle" class="vue-ruler-ref-drag-dot">
            {{ showPosition }}
          </div>
        </template>
        <!-- 拖拽后保留的线 -->
        <div
          v-for="item in lineList"
          :title="item.title"
          :style="getLineStyle(item)"
          :key="item.id"
          :class="`vue-ruler-ref-line-${item.type}`"
          @mousedown="handleDragLine(item)"
        ></div>
      </section>
      <!-- slot -->
      <section ref="content" class="vue-ruler-content">
        <slot />
      </section>
      <!-- mask -->
      <div v-show="isDrag" class="vue-ruler-content-mask"></div>
    </div>
  </div>
</template>

<script>
import { on, off } from "./event.js";
import { drawH, drawV } from "./draw.js";
export default {
  name: "VueRulerTool",
  components: {},
  props: {
    position: {
      type: String,
      default: "relative",
      validator: function(val) {
        return ["absolute", "fixed", "relative", "static", "inherit"].indexOf(val) !== -1;
      }
    },
    // 规定元素的定位类型
    isHotKey: {
      type: Boolean,
      default: true
    },
    // 热键开关
    isScaleRevise: {
      type: Boolean,
      default: false
    },
    // 刻度修正(根据content进行刻度重置)
    value: {
      type: Array,
      default: () => {
        return []; // { type: 'h', value: 50 }, { type: 'v', value: 180 }
      }
    },
    // 预置参考线
    contentLayout: {
      type: Object,
      default: () => {
        return { top: 0, left: 0 };
      }
    },
    // 内容部分布局
    parent: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      coordX: 0,
      coordY: 0,
      size: 30,
      windowWidth: 0, // 窗口宽度
      windowHeight: 0, // 窗口高度
      windowLeft: 0,
      windowTop: 0,
      topSpacing: 0, // 标尺与窗口上间距
      leftSpacing: 0, //  标尺与窗口左间距
      isDrag: false,
      dragFlag: "", // 拖动开始标记，可能值x(从水平标尺开始拖动),y(从垂直标尺开始拖动)
      horizontalDottedLeft: -999, // 水平虚线位置
      verticalDottedTop: -999, // 垂直虚线位置
      rulerWidth: 0, // 垂直标尺的宽度
      rulerHeight: 0, // 水平标尺的高度
      dragLineId: "", // 被移动线的ID
      keyCode: {
        r: 82
      }, // 快捷键参数
      rulerVisible: true // 标尺辅助线显示开关
    };
  },
  computed: {
    wrapperStyle() {
      return {
        width: this.windowWidth + "px",
        height: this.windowHeight + "px",
        position: this.position
      };
    },
    lineList() {
      let hCount = 0;
      let vCount = 0;
      return this.value.map(item => {
        const isH = item.type === "h";
        return {
          id: `${item.type}_${isH ? hCount++ : vCount++}`,
          type: item.type,
          title: item.value + "px",
          [isH ? "top" : "left"]: item.value + this.size
        };
      });
    },
    showPosition() {
      let left = this.horizontalDottedLeft;
      let top = this.verticalDottedTop;
      if (left > 30) {
        return Math.floor(left - 30) + "px";
      } else {
        return Math.floor(top - 30) + "px";
      }
    },
    dragDotStyle() {
      let left = this.horizontalDottedLeft;
      let top = this.verticalDottedTop;
      if (left > 30) {
        return {
          left: Math.floor(left) + "px",
          top: this.coordY - 30 + "px"
        };
      } else {
        return {
          left: this.coordX + "px",
          top: Math.floor(top - 30) + "px"
        };
      }
    }
  },
  watch: {
    visible: {
      handler(visible) {
        this.rulerVisible = visible;
      },
      immediate: true
    }
  },
  mounted() {
    on(document, "mousemove", this.dottedLineMove);
    on(document, "mouseup", this.dottedLineUp);
    on(document, "keyup", this.keyboard);
    on(window, "resize", this.windowResize);
    this.init();
  },
  beforeDestroy() {
    off(document, "mousemove", this.dottedLineMove);
    off(document, "mouseup", this.dottedLineUp);
    off(document, "keyup", this.keyboard);
    off(window, "resize", this.windowResize);
  },
  methods: {
    init() {
      this.box();
      this.draw();
    },
    windowResize() {
      this.init();
    },
    getLineStyle({ type, top, left }) {
      return type === "h" ? { top: top + "px" } : { left: left + "px" };
    },
    handleDragLine({ type, id }) {
      return type === "h" ? this.dragHorizontalLine(id) : this.dragVerticalLine(id);
    },
    box() {
      const style = window.getComputedStyle(this.$el.parentNode, null);
      this.windowWidth = parseInt(style.getPropertyValue("width"), 10);
      this.windowHeight = parseInt(style.getPropertyValue("height"), 10);
      this.getSpacing();
    },
    draw() {
      var canvas1 = document.getElementById("canvas1");
      var canvas2 = document.getElementById("canvas2");
      canvas1.width = this.windowWidth - 30;
      canvas2.height = this.windowHeight - 30;
      var ctx1 = canvas1.getContext("2d");
      var ctx2 = canvas2.getContext("2d");
      var config1 = {
        width: this.windowWidth,
        height: 30,
        size: 9999,
        x: 0,
        y: 30,
        w: 5,
        h: 7.5
      };
      drawH(ctx1, config1);
      var config2 = {
        width: 30,
        height: this.windowHeight,
        size: 9999,
        x: 30,
        y: 0,
        w: 7.5,
        h: 5
      };
      drawV(ctx2, config2);
    },
    // 获取窗口宽与高
    getSpacing() {
      this.rulerWidth = this.$refs.verticalRuler.clientWidth;
      this.rulerHeight = this.$refs.horizontalRuler.clientHeight;
      this.topSpacing = this.$refs.horizontalRuler.getBoundingClientRect().y;
      this.leftSpacing = this.$refs.verticalRuler.getBoundingClientRect().x;
    },
    // 获取矫正刻度方法
    newLine(val) {
      this.isDrag = true;
      this.dragFlag = val;
    },
    // 生成一个参考线
    dottedLineMove($event) {
      if (!this.isDrag) {
        return false;
      }
      this.coordX = $event.pageX - this.leftSpacing;
      this.coordY = $event.pageY - this.topSpacing;
      this.getSpacing();
      switch (this.dragFlag) {
        case "x":
          this.verticalDottedTop = this.coordY;
          break;
        case "y":
          this.horizontalDottedLeft = this.coordX;
          break;
        case "h":
          this.verticalDottedTop = this.coordY;
          break;
        case "v":
          this.horizontalDottedLeft = this.coordX;
          break;
        default:
          break;
      }
    },
    // 虚线移动结束
    dottedLineUp($event) {
      this.getSpacing();
      if (this.isDrag) {
        this.isDrag = false;
        const cloneList = JSON.parse(JSON.stringify(this.value));
        this.coordX = $event.pageX - this.leftSpacing - this.size;
        this.coordY = $event.pageY - this.topSpacing - this.size;
        switch (this.dragFlag) {
          case "x":
            cloneList.push({
              type: "h",
              value: this.coordY
            });
            this.$emit("input", cloneList);
            break;
          case "y":
            cloneList.push({
              type: "v",
              value: this.coordX
            });
            this.$emit("input", cloneList);
            break;
          case "h":
            this.dragCalc(cloneList, $event.pageY, this.topSpacing, this.rulerHeight, "h");
            this.$emit("input", cloneList);
            break;
          case "v":
            this.dragCalc(cloneList, $event.pageX, this.leftSpacing, this.rulerWidth, "v");
            this.$emit("input", cloneList);
            break;
          default:
            break;
        }
        this.verticalDottedTop = this.horizontalDottedLeft = -999;
      }
    },
    // 虚线松开
    dragCalc(list, page, spacing, ruler, type) {
      if (page - spacing < ruler) {
        // delete
        let curr, id;
        this.lineList.forEach((item, index) => {
          if (item.id === this.dragLineId) {
            curr = index;
            id = item.id;
          }
        });
        list.splice(curr, 1);
      } else {
        // change
        let curr, id;
        this.lineList.forEach((item, index) => {
          if (item.id === this.dragLineId) {
            curr = index;
            id = item.id;
          }
        });
        list[curr] = {
          type: type,
          value: page - spacing - this.size
        };
      }
    },
    // 水平标尺处按下鼠标
    horizontalDragRuler() {
      this.newLine("x");
    },
    // 垂直标尺处按下鼠标
    verticalDragRuler() {
      this.newLine("y");
    },
    // 水平线处按下鼠标
    dragHorizontalLine(id) {
      this.isDrag = true;
      this.dragFlag = "h";
      this.dragLineId = id;
    },
    // 垂直线处按下鼠标
    dragVerticalLine(id) {
      this.isDrag = true;
      this.dragFlag = "v";
      this.dragLineId = id;
    },
    // 键盘
    keyboard($event) {
      if (this.isHotKey) {
        switch ($event.keyCode) {
          case this.keyCode.r:
            this.rulerVisible = !this.rulerVisible;
            this.$emit("update:visible", this.rulerVisible);
            break;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-ruler {
  .vue-ruler-wrapper {
    left: 0;
    top: 0;
    z-index: 997;
    overflow: hidden;
    user-select: none;
  }

  .vue-ruler-top,
  .vue-ruler-left {
    position: relative;
    &:hover {
      opacity: 0.8;
    }
    &::after {
      content: "";
      background-color: #fff;
      position: absolute;
      left: 0;
      top: 0;
      width: 42px;
      height: 42px;
      transform-origin: center center;
      transform: translateX(-21px) translateY(-21px) rotate(45deg);
    }
  }
  .vue-ruler-top {
    left: 30px;
    width: calc(100% -30px);
    height: 30px;
    background-color: #fff;
  }
  .vue-ruler-left {
    height: 100%;
    width: 30px;
    background-color: #fff;
  }

  .vue-ruler-ref-line-v,
  .vue-ruler-ref-line-h,
  .vue-ruler-ref-drag-h,
  .vue-ruler-ref-drag-v,
  .vue-ruler-ref-drag-dot {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    z-index: 999;
  }

  .vue-ruler-ref-line-v,
  .vue-ruler-ref-line-h,
  .vue-ruler-ref-drag-h,
  .vue-ruler-ref-drag-v {
    z-index: 998;
  }

  .vue-ruler-ref-drag-h {
    width: 100%;
    height: 1px;
    border-top: 1px solid #409eff;
    cursor: n-resize;
    top: -10px;
    z-index: 999;
  }
  .vue-ruler-ref-drag-v {
    width: 1px;
    height: 100%;
    border-left: 1px solid #409eff;
    cursor: w-resize;
    left: -10px;
  }
  .vue-ruler-ref-line-h {
    width: 100%;
    height: 1px;
    border-top: 1px solid #dc4c3f;
    cursor: n-resize;
  }
  .vue-ruler-ref-line-v {
    width: 1px;
    height: 100%;
    border-left: 1px solid #dc4c3f;
    cursor: w-resize;
  }
  .vue-ruler-ref-drag-dot {
    color: #dc4c3f;
    padding: 0 10px;
  }
  .vue-ruler-content {
    position: absolute;
    left: 30px;
    top: 30px;
    z-index: 997;
  }
  .vue-ruler-content-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    z-index: 998;
  }
}
</style>
