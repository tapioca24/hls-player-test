<template>
  <div class="flie-list">
    <h2>File list</h2>
    <p v-if="!fetched">now loading...</p>
    <ul class="list" v-if="fetched">
      <li
        class="list-item"
        v-for="file in files"
        :key="file.timestamp"
        @click="select(file)"
      >
        {{ file.timestamp | humanized }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { DateTime } from "luxon";
import authUtils from "@/utils/auth";
import QBiCAPI from "@/QBiCAPI";
import api from "@/api";

@Component({
  filters: {
    humanized(timestamp: number) {
      return DateTime.fromMillis(timestamp).toISO();
    }
  }
})
export default class FileList extends Vue {
  files: QBiCAPI.VodFile[] = [];
  fetched = false;

  @Prop({ type: Object, required: true }) readonly camera!: QBiCAPI.Camera;

  @Emit()
  select(file: QBiCAPI.VodFile) {
    /* nop */
  }

  async created() {
    const accessToken = await authUtils.getAccessToken();
    const until = DateTime.local().minus({ minute: 30 });
    const since = until.minus({ minute: 5 });
    this.files = await api.getFileList(accessToken, {
      deviceid: this.camera.deviceid,
      since: since.toMillis(),
      until: until.toMillis()
    });
    this.fetched = true;
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
