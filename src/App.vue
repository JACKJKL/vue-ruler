<template>
  <div id="app">
    <section style="padding: 25px;height: calc(100vh - 100px);">
      <button @click="toggle">显示/隐藏标尺</button>
      <button @click="clear">清空</button>
      <button @click="reset">重置</button>
      <vue-ruler v-model="helperLine" :visible.sync="visible">
        <iframe src="https://www.gausszhou.top/" width="1000" height="500" frameborder="0" />
      </vue-ruler>
    </section>
     <github-badge url="https://github.com/gausszhou/vue-ruler"></github-badge>
  </div>
</template>

<script>
import GithubBadge from "@/components/github-badge";
import VueRuler from "./components/vue-ruler";
// import VueRuler from "../lib/vue-ruler";
export default {
  name: "app",
  components: {
    VueRuler,
    GithubBadge
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
      console.log(newV);
    }
  },
  methods: {
    toggle() {
      this.visible = !this.visible;
    },
    clear() {
      this.helperLine = [];
    },
    reset() {
      this.helperLine = this.$options.data().helperLine;
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
