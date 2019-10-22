<template>
  <div class="mejs-container">
    <h3>MediaElement.js</h3>
    <video
      ref="mediaElementPlayer"
      id="media-element-player"
      class="mejs__player"
      width="100%"
      autoplay
    ></video>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import "mediaelement";
const { MediaElementPlayer } = window;

@Component
export default class MediaElementJS extends Vue {
  player: any = null;
  playerOptions: any = {};

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
      if (!this.player.paused) {
        this.player.pause();
      }
      this.player.remove();
    }
  }

  loadPlayer() {
    const video = this.$refs.mediaElementPlayer as HTMLVideoElement;
    this.player = new MediaElementPlayer(video.id, this.playerOptions);
    this.play(this.source);
  }

  play(source: string) {
    if (this.player) {
      this.player.setSrc(source);
      this.player.play();
    }
  }
}
</script>

<style lang="scss" scoped>
@import url(~mediaelement/build/mediaelementplayer.css);
</style>
