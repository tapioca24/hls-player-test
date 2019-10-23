<template>
  <div class="playlist">
    <h1>Playlist</h1>
    <p v-if="!fetched">now loading...</p>
    <p v-if="fetched && files.length === 0">file not found</p>
    <div v-if="fetched && files.length > 0">
      <ul class="list">
        <li v-for="file in files" :key="file.timestamp">
          {{ file.timestamp | humanized }}
        </li>
      </ul>
      <VideoJSPlaylist
        :accessToken="accessToken"
        :id="id"
        :stream="vodStream"
        :files="files"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { DateTime } from "luxon";
import authUtils from "@/utils/auth";
import cameraModule from "@/store/modules/camera";
import QBiCAPI from "@/QBiCAPI";
import api from "@/api";

import VideoJSPlaylist from "@/components/VideoJSPlaylist.vue";

@Component({
  components: {
    VideoJSPlaylist
  },
  filters: {
    humanized(timestamp: number) {
      return DateTime.fromMillis(timestamp).toISO();
    }
  }
})
export default class Playlist extends Vue {
  accessToken: string | null = null;
  vodStream: QBiCAPI.VodStream | null = null;
  files: QBiCAPI.VodFile[] = [];
  fileFetched = false;

  @Prop({ type: String, required: true }) readonly id!: string;

  get fetched() {
    return (
      this.cameraFetched &&
      this.fileFetched &&
      this.vodStream &&
      this.accessToken
    );
  }

  get camera() {
    return cameraModule.camera(this.id);
  }

  get cameraFetched() {
    return cameraModule.fetched;
  }

  async created() {
    this.accessToken = await authUtils.getAccessToken();
    await this.fetchCameras();
    this.fetchVodStream();
    this.fetchFiles();
  }

  async fetchCameras() {
    if (!this.accessToken) {
      throw new Error("accessToken not found");
    }
    if (!this.cameraFetched) {
      await cameraModule.fetch(this.accessToken);
    }
  }

  async fetchVodStream() {
    if (!this.accessToken) {
      throw new Error("accessToken not found");
    }
    if (!this.camera) {
      throw new Error("camera not found");
    }
    this.vodStream = await api.getVodStream(this.accessToken, {
      deviceid: this.camera.deviceid
    });
  }

  async fetchFiles() {
    if (!this.accessToken) {
      throw new Error("accessToken not found");
    }
    if (!this.camera) {
      throw new Error("camera not found");
    }
    const until = DateTime.local().minus({ minute: 30 });
    const since = until.minus({ minute: 5 });
    this.files = await api.getFileList(this.accessToken, {
      deviceid: this.camera.deviceid,
      since: since.toMillis(),
      until: until.toMillis()
    });
    this.fileFetched = true;
  }
}
</script>

<style lang="scss" scoped>
.list {
  margin: 0 auto;
  width: 400px;
  text-align: left;
}

.videojs-playlist {
  margin: 0 auto;
  width: 50%;
}
</style>
