<template>
  <div class="login">
    <h1>Sign in</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="text" placeholder="email" />
      <br />
      <input v-model="password" type="password" placeholder="password" />
      <br />
      <button type="submit" :disabled="!validate">sign in</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import authModule from "@/store/modules/auth";

@Component
export default class Login extends Vue {
  email = "";
  password = "";

  get validate() {
    if (!this.email || !this.password) {
      return false;
    }
    return true;
  }

  async login() {
    await authModule.login({
      email: this.email,
      password: this.password
    });
    this.$router.push({ name: "home" });
  }
}
</script>
