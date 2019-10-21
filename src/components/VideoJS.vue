<template>
  <div class="video-container">
    <h3>video.js</h3>
    <video ref="videoPlayer" class="video-js" autoplay muted controls></video>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";

@Component
export default class VideoJS extends Vue {
  player: VideoJsPlayer | null = null;
  playerOptions: VideoJsPlayerOptions = {
    aspectRatio: "16:9"
  };

  @Prop({ type: String, required: true }) readonly source!: string;

  @Watch("source")
  onChangedSource(val: string) {
    this.play(val);
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
    this.play(this.source);
  }

  play(source: string) {
    if (this.player) {
      this.player.src(source);
    }
  }
}
</script>

<style lang="scss" scoped>
@import url("~video.js/dist/video-js.css");

.video-js {
  width: 100%;
}
</style>
