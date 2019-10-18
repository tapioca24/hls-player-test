<template>
  <div id="app">
    <div class="btn-group" v-if="isLoggedIn">
      <button @click="logout">sign out</button>
      <button @click="toHome" :disabled="isHome">top</button>
    </div>
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

  get isHome() {
    return this.$route.name === "home";
  }

  async logout() {
    await authUtils.logout();
  }

  toHome() {
    if (!this.isHome) {
      this.$router.push({ name: "home" });
    }
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

.btn-group {
  button {
    margin: 2px;
  }
}
</style>
