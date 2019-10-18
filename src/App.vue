<template>
  <div id="app">
    <button v-if="isLoggedIn" @click="logout">sign out</button>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import authModule from "@/store/modules/auth";
import authUtils from "@/utils/auth";

@Component
export default class App extends Vue {
  get isLoggedIn() {
    return authModule.isLoggedIn;
  }

  async logout() {
    await authUtils.logout();
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
