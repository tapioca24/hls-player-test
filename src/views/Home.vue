<template>
  <div class="home">
    <h1>Camera list</h1>
    <p v-if="!fetched">now loading...</p>
    <ul class="list" v-if="fetched">
      <li
        class="list-item"
        v-for="camera in cameras"
        :key="camera.serial"
        @click="toLive(camera.deviceid)"
      >
        {{ camera.serial }} - {{ camera.name }}
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
}
</script>

<style lang="scss" scoped>
.list {
  margin: 0 auto;
  width: 400px;
  text-align: left;
  .list-item {
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
