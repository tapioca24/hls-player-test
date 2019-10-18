import axios, { AxiosInstance } from "axios";
import { DateTime } from "luxon";

const createTokens = (data: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}) => {
  const tokens: QBiCAPI.Tokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: DateTime.local()
      .plus({ second: Number(data.expires_in) })
      .toMillis()
  };
  return tokens;
};

class QBiCAPI {
  private _instance: AxiosInstance;
  private _config: QBiCAPI.Config;

  constructor(options: QBiCAPI.Options) {
    this._config = {
      env: QBiCAPI.Env.Development,
      ...options
    };

    const host =
      this._config.env === QBiCAPI.Env.Production
        ? "ope000.elmocloud.com"
        : "ope01a.elmocloud.com";
    const prefix = "qbic";
    const version = "v1";
    const baseURL = `https://${host}/${prefix}/${version}/`;

    this._instance = axios.create({
      baseURL,
      timeout: 5000
    });
  }

  async login(data: QBiCAPI.Login.Request) {
    try {
      const res = await this._instance({
        url: "/login",
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Elmo-Agent": "ElmoCloud Viewer for Web",
          "Elmo-Agent-Version": "1.0.0"
        },
        data: {
          username: data.email,
          password: data.password
        }
      });
      return createTokens(res.data) as QBiCAPI.Login.Response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async refresh(data: QBiCAPI.Refresh.Request) {
    try {
      const res = await this._instance({
        url: "/token",
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          grant_type: "refresh_token",
          refresh_token: data.refreshToken
        }
      });
      return createTokens(res.data) as QBiCAPI.Login.Response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async logout(data: QBiCAPI.Logout.Request) {
    try {
      const res = await this._instance({
        url: "/logout",
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          access_token: data.accessToken,
          refresh_token: data.refreshToken
        }
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getCameraList(accessToken: string) {
    try {
      const res = await this._instance({
        url: "/user/devicelist",
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const list = res.data.list as QBiCAPI.Camera[];
      return list.map(c => {
        const { deviceid, serial, name } = c;
        return { deviceid, serial, name } as QBiCAPI.Camera;
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getLiveStream(
    accessToken: string,
    data: QBiCAPI.GetLiveStream.Request
  ) {
    try {
      const res = await this._instance({
        url: "/stream/liveurl",
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          deviceid: data.deviceid
        }
      });
      const response: QBiCAPI.GetLiveStream.Response = {
        server: res.data.liveurl.server,
        app: res.data.liveurl.appname
      };
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getVodStream(accessToken: string, data: QBiCAPI.GetVodStream.Request) {
    try {
      const res = await this._instance({
        url: "/stream/vodurl",
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          deviceid: data.deviceid
        }
      });
      const response: QBiCAPI.GetVodStream.Response = {
        app: res.data.liveurl.appname
      };
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getFileList(accessToken: string, data: QBiCAPI.GetFileList.Request) {
    try {
      const res = await this._instance({
        url: "/stream/vodurl",
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          deviceid: data.deviceid,
          since: data.since,
          until: data.until
        }
      });
      const list = res.data.list as QBiCAPI.VodFile[];
      return list.map(f => {
        const { filename, timestamp, duration, server } = f;
        return {
          filename,
          timestamp: Number(timestamp),
          duration: Number(duration),
          server
        } as QBiCAPI.VodFile;
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

namespace QBiCAPI {
  export interface Options {
    env?: Env;
  }

  export type Config = Required<Options>;

  export enum Env {
    Development = "development",
    Production = "production"
  }

  export interface Tokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }

  export interface Camera {
    deviceid: string;
    serial: string;
    name: string;
  }

  export interface VodFile {
    filename: string;
    timestamp: number;
    duration: number;
    server: string;
  }

  export namespace Login {
    export interface Request {
      email: string;
      password: string;
    }
    export type Response = Tokens;
  }

  export namespace Refresh {
    export interface Request {
      refreshToken: string;
    }
    export type Response = Tokens;
  }

  export namespace Logout {
    export interface Request {
      accessToken: string;
      refreshToken: string;
    }
  }

  export namespace GetCameraList {
    export type Response = Camera[];
  }

  export namespace GetLiveStream {
    export interface Request {
      deviceid: string;
    }
    export interface Response {
      server: string;
      app: string;
    }
  }

  export namespace GetVodStream {
    export interface Request {
      deviceid: string;
    }
    export interface Response {
      app: string;
    }
  }

  export namespace GetFileList {
    export interface Request {
      deviceid: string;
      since: number;
      until: number;
    }
    export type Response = VodFile[];
  }
}

export default QBiCAPI;
