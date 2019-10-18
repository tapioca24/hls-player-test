import {
  Module,
  VuexModule,
  getModule,
  Mutation,
  Action
} from "vuex-module-decorators";
import store from "@/store";
import api from "@/api";
import QBiCAPI from "@/QBiCAPI";

@Module({ dynamic: true, store, name: "camera", namespaced: true })
class Camera extends VuexModule {
  cameras: QBiCAPI.Camera[] = [];
  fetched = false;

  @Mutation
  updateCameras(cameras: QBiCAPI.Camera[]) {
    this.cameras = cameras;
    this.fetched = true;
  }

  @Mutation
  clearCameras() {
    this.cameras = [];
    this.fetched = false;
  }

  /**
   * 指定した `id` のカメラを返す
   * なければ `null` を返す
   */
  get camera() {
    return (id: string) => {
      return this.cameras.find(c => c.deviceid === id) || null;
    };
  }

  /**
   * カメラリスト取得
   */
  @Action({ rawError: true, commit: "updateCameras" })
  async fetch(accessToken: string) {
    return await api.getCameraList(accessToken);
  }
}

export default getModule(Camera);
