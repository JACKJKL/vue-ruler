# VueRuler

![](./images/head.png)

## 安装与基本用法

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
      <vue-ruler v-model="presetLine" :visible.sync="visible">
        <iframe src="https://www.gausszhou.top/note" width="1000" height="400" frameborder="0" />
        <img src="https://vuejs.org/images/logo.svg" style="height:200px" />
      </vue-ruler>
    </section>
  </div>
</template>

<script>
import VueRuler from "@gausszhou/vue-ruler"

export default {
  name: "app",
  components: {
    VueRuler
  },
  data() {
    return {
      presetLine: [
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
    presetLine(newV) {
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
