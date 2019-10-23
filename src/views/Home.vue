<template>
  <div class="home">
    <h1>Camera list</h1>
    <p v-if="!fetched">now loading...</p>
    <ul class="list" v-if="fetched">
      <li class="list-item" v-for="camera in cameras" :key="camera.serial">
        {{ camera.serial }} - {{ camera.name }}
        <button class="btn" @click="toLive(camera.deviceid)">live</button>
        <button class="btn" @click="toPlaylist(camera.deviceid)">
          playlist
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import authUtils from "@/utils/auth";
import cameraModule from "@/store/modules/camera";

@Component
export default class Home extends Vue {
  get fetched() {
    return cameraModule.fetched;
  }

  get cameras() {
    return cameraModule.cameras;
  }

  async created() {
    if (!this.fetched) {
      const accessToken = await authUtils.getAccessToken();
      await cameraModule.fetch(accessToken);
    }
  }

  toLive(id: string) {
    this.$router.push({
      name: "live",
      params: { id }
    });
  }

  toPlaylist(id: string) {
    this.$router.push({
      name: "playlist",
      params: { id }
    });
  }
}
</script>

<style lang="scss" scoped>
.list {
  margin: 0 auto;
  width: 400px;
  text-align: left;

  .btn {
    margin: 0 2px;
  }
}
</style>
