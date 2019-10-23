<template>
  <div class="videojs-playlist">
    <h3>videojs-playlist</h3>
    <video ref="videoPlayer" class="video-js" autoplay controls></video>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import videojs, {
  VideoJsPlayer,
  VideoJsPlayerOptions,
  VideoJsPlaylist
} from "video.js";
import "videojs-playlist";
import streamUtils from "@/utils/stream";
import QBiCAPI from "@/QBiCAPI";

@Component
export default class VideoJSPlaylist extends Vue {
  player: VideoJsPlayer | null = null;
  playerOptions: VideoJsPlayerOptions = {
    aspectRatio: "16:9"
  };

  @Prop({ type: String, required: true }) readonly accessToken!: string;
  @Prop({ type: String, required: true }) readonly id!: string;
  @Prop({ type: Object, required: true }) readonly stream!: QBiCAPI.VodStream;
  @Prop({ type: Array, required: true }) readonly files!: QBiCAPI.VodFile[];

  get sources() {
    return this.files.map(f => {
      const source = streamUtils.createVodSource({
        server: f.server,
        app: this.stream.app,
        deviceid: this.id,
        accessToken: this.accessToken,
        filename: f.filename,
        timestamp: f.timestamp
      });
      const item: VideoJsPlaylist.Item = {
        sources: [
          {
            src: source,
            type: "application/x-mpegURL"
          }
        ]
      };
      return item;
    });
  }

  mounted() {
    this.loadPlayer();
  }

  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }

  loadPlayer() {
    this.player = videojs(this.$refs.videoPlayer, this.playerOptions, () => {
      console.log("video.js is ready!");
    });

    this.player.playlist(this.sources);
    this.player.playlist.autoadvance(0);
  }
}
</script>

<style lang="scss" scoped>
@import url("~video.js/dist/video-js.css");

.video-js {
  width: 100%;
}
</style>
