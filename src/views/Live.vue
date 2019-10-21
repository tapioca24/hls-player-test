<template>
  <div class="live">
    <h1>Live{{ exist ? ` ${camera.name}` : "" }}</h1>
    <p v-if="!fetched">now loading...</p>
    <p v-if="notExist">camera does not exist</p>
    <div v-if="exist">
      <FileList :camera="camera" @select="onSelectedFile" />
      <button @click="live">live</button>
    </div>
    <div v-if="source">
      <p class="source">{{ source }}</p>
      <VideoJS :source="source" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import authUtils from "@/utils/auth";
import streamUtils from "@/utils/stream";
import cameraModule from "@/store/modules/camera";
import FileList from "@/components/FileList.vue";
import VideoJS from "@/components/VideoJS.vue";
import QBiCAPI from "@/QBiCAPI";
import api from "@/api";

@Component({
  components: {
    FileList,
    VideoJS
  }
})
export default class Live extends Vue {
  liveStream: QBiCAPI.LiveStream | null = null;
  vodStream: QBiCAPI.VodStream | null = null;
  source: string | null = null;

  @Prop({ type: String, required: true }) readonly id!: string;

  @Watch("liveStream")
  onChangeLiveStream(stream: QBiCAPI.LiveStream | null) {
    this.live();
  }

  get fetched() {
    return cameraModule.fetched;
  }

  get exist() {
    return this.fetched && this.camera;
  }

  get notExist() {
    return this.fetched && !this.camera;
  }

  get camera() {
    return cameraModule.camera(this.id);
  }

  async created() {
    const accessToken = await authUtils.getAccessToken();
    if (!this.fetched) {
      await cameraModule.fetch(accessToken);
    }

    api
      .getLiveStream(accessToken, { deviceid: this.camera!.deviceid })
      .then(s => {
        this.liveStream = s;
      });

    api
      .getVodStream(accessToken, { deviceid: this.camera!.deviceid })
      .then(s => {
        this.vodStream = s;
      });
  }

  async onSelectedFile(file: QBiCAPI.VodFile) {
    this.vod(file);
  }

  async live() {
    if (!this.liveStream || !this.camera) {
      return;
    }
    const accessToken = await authUtils.getAccessToken();
    this.source = streamUtils.createLiveSource({
      ...this.liveStream,
      deviceid: this.camera.deviceid,
      accessToken
    });
  }

  async vod(file: QBiCAPI.VodFile) {
    if (!this.vodStream || !this.camera) {
      return;
    }
    const accessToken = await authUtils.getAccessToken();
    this.source = streamUtils.createVodSource({
      ...this.vodStream,
      server: file.server,
      deviceid: this.camera.deviceid,
      accessToken,
      filename: file.filename,
      timestamp: file.timestamp
    });
  }
}
</script>

<style lang="scss" scoped>
.source {
  font-size: 10px;
}

.video-container {
  width: 50%;
  margin: 0 auto;
}
</style>
