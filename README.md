# VueRuler

![](https://static.gausszhou.top/data/image/github/vue-ruler.png)

## 任务清单

- [ ] 更新详细的使用文档
- [ ] 由于标尺本身使用canvas绘制，不能通过样式穿透修改，因此需要定义一些props

## 快速上手

```shell
yarn add  @gausszhou/vue-ruler
```

```js
import VueRuler from "@gausszhou/vue-ruler"

```

```html
<template>
  <div id="app">
    <section style="padding: 25px;height: calc(100vh - 100px);">
      <button @click="toggle">显示/隐藏标尺</button>
      <button @click="clear">清空</button>
      <button @click="reset">重置</button>
      <!-- 非业务组件，我使用kableCase -->
      <vue-ruler v-model="helperLine" :visible.sync="visible">
        <iframe src="https://www.gausszhou.top/note" width="1000" height="400" frameborder="0" />
        <img src="https://vuejs.org/images/logo.svg" style="height:200px" />
      </vue-ruler>
    </section>
  </div>
</template>

<script>
// 同样也能单个组件内引用
import VueRuler from "@gausszhou/vue-ruler"
export default {
  name: "app",
  components: {
    VueRuler
  },
  data() {
    return {
      helperLine: [
        { type: "h", value: 56 },
        { type: "h", value: 140 },
        { type: "h", value: 200 },
        { type: "h", value: 400 },
        { type: "h", value: 600 },
        { type: "v", value: 130 },
        { type: "v", value: 450 },
        { type: "v", value: 1000 },
        { type: "v", value: 1229 },
      ],
      visible: true
    };
  },
  watch: {
    helperLine(newV) {
      // do something eg. store to localStorage
      console.log(newV);
    }
  },
  methods: {
    toggle() {
      this.visible = !this.visible;
    },
    clear() {
      this.presetLine = [];
    },
    reset() {
      this.presetLine = this.$options.data().presetLine;
    }
  }
};
</script>

<style lang="scss">
body {
  background: #202233;
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
```
