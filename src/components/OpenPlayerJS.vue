<template>
  <div class="openplayer-container">
    <h3>OpenPlayerJS</h3>
    <video
      ref="opPlayer"
      id="op-player"
      class="op-player__media"
      autoplay
      controls
    ></video>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import OpenPlayer from "openplayerjs";

@Component
export default class OpenPlayerJS extends Vue {
  player: any = null;
  playerOptions: any = {
    hls: {}
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
      this.player.destroy();
    }
  }

  loadPlayer() {
    const video = this.$refs.opPlayer as HTMLVideoElement;
    this.player = new OpenPlayer(video.id, null, false, this.playerOptions);
    this.player.init();
    this.play(this.source);
  }

  play(source: string) {
    if (this.player) {
      this.player.src = source;
      this.player.load();
      this.player.play();
    }
  }
}
</script>

<style lang="scss" scoped>
@import url("~openplayerjs/dist/openplayer.css");
</style>
