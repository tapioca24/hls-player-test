<template>
  <div class="flowplayer-container">
    <h3>Flowplayer</h3>
    <div ref="flowPlayer" id="flow-player"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

flowplayer.conf = {
  hlsjs: {
    safari: true
  }
};

@Component
export default class Flowplayer extends Vue {
  player: any = null;

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
      this.player.unload();
    }
  }

  loadPlayer() {
    const container = this.$refs.flowPlayer as HTMLDivElement;
    const selector = `#${container.id}`;
    this.player = flowplayer(selector, {
      autoplay: true,
      customPlaylist: true,
      clip: {
        sources: [
          {
            type: "application/x-mpegURL",
            src: this.source
          }
        ]
      }
    });
  }

  play(source: string) {
    if (this.player) {
      this.player.play({
        sources: [
          {
            type: "application/x-mpegURL",
            src: source
          }
        ]
      });
    }
  }
}
</script>
