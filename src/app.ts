import baseConfig from "@/config";

export interface MyApp {
  globalData: {};
}

App<MyApp>({
  globalData: { ...baseConfig }
});
