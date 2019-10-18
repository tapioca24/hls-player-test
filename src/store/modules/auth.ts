import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import store from "@/store";
import api from "@/api";
import QBiCAPI from "@/QBiCAPI";

@Module({ dynamic: true, store, name: "auth", namespaced: true })
class Auth extends VuexModule {
  tokens: QBiCAPI.Tokens | null = null;

  @Mutation
  updateTokens(tokens: QBiCAPI.Tokens | null) {
    this.tokens = tokens;
  }

  /**
   * ログイン状態を返す
   */
  get isLoggedIn() {
    return !!this.tokens;
  }

  /**
   * ログイン
   */
  @Action({ rawError: true, commit: "updateTokens" })
  async login(data: QBiCAPI.Login.Request) {
    return api.login(data);
  }

  /**
   * トークン更新
   */
  @Action({ rawError: true, commit: "updateTokens" })
  async refresh() {
    if (!this.tokens) {
      return null;
    }
    return await api.refresh({
      refreshToken: this.tokens.refreshToken
    });
  }

  /**
   * ログアウト
   */
  @Action({ rawError: true, commit: "updateTokens" })
  async logout() {
    if (this.tokens) {
      try {
        await api.logout({
          accessToken: this.tokens.accessToken,
          refreshToken: this.tokens.refreshToken
        });
      } catch (err) {
        /* nop */
      }
    }
    return null;
  }
}

export default getModule(Auth);
