<template>
  <div class="clappr-container">
    <h3>clappr</h3>
    <div ref="clapprPlayer" class="clappr-player"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Clappr from "clappr";

@Component
export default class ClapprPlayer extends Vue {
  player: any = null;

  @Prop({ type: String, required: true }) readonly source!: string;

  @Watch("source")
  onChangedSource(val: string) {
    this.play(val);
  }

  mounted() {
    this.loadPlayer();
  }

  loadPlayer() {
    this.player = new Clappr.Player({
      source: this.source,
      autoPlay: true,
      width: "100%"
    });
    const wrapper = this.$refs.clapprPlayer as HTMLDivElement;
    this.player.attachTo(wrapper);
  }

  play(source: string) {
    if (this.player) {
      this.player.load(source, "application/vnd.apple.mpegurl", true);
    }
  }
}
</script>
