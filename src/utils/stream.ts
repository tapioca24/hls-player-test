import queryString from "query-string";
import { DateTime } from "luxon";

const createBaseURL = (server: string, app: string) => {
  return `https://${server}.elmocloud.com/${app}`;
};

const createQuery = (accessToken: string, deviceid: string) => {
  return queryString.stringify({
    token: accessToken,
    deviceid
  });
};

interface LiveSourceParams {
  server: string;
  app: string;
  deviceid: string;
  accessToken: string;
}

interface VodSourceParams extends LiveSourceParams {
  filename: string;
  timestamp: number;
}

const createLiveSource = (data: LiveSourceParams) => {
  const baseURL = createBaseURL(data.server, data.app);
  const query = createQuery(data.accessToken, data.deviceid);
  return `${baseURL}/${data.deviceid}/playlist.m3u8?${query}`;
};

const createVodSource = (data: VodSourceParams) => {
  const baseURL = createBaseURL(data.server, data.app);
  const query = createQuery(data.accessToken, data.deviceid);
  const date = DateTime.fromMillis(data.timestamp).toFormat("yyyyMMdd");
  const path = `_definst_/mp4:${data.deviceid}/${date}/${data.filename}`;
  return `${baseURL}/${path}/playlist.m3u8?${query}`;
};

export default {
  createLiveSource,
  createVodSource
};
