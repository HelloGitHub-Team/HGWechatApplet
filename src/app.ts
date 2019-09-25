import baseConfig from "./config";

export interface IMyApp {
  globalData: {};
}

App<IMyApp>({
  onLaunch() {},
  globalData: {
    ...baseConfig
  }
});
