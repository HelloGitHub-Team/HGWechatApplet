import { ICategories } from "./entity";
import CategoryService from "@domains/category/Service";

import { SUBSCRIBED, CATEGORIES } from "@/constant/storage";

export interface ICategoryInteractor {
  ids: number[];

  categories: ICategories;
  subscribed: ICategories;
  unSubscribed: ICategories;

  initialized: boolean;
  init: (refresh: boolean) => Promise<ICategoryInteractor>;
}

class CategoryInteractor implements ICategoryInteractor {
  initialized: boolean;

  categories: ICategories;

  constructor() {
    this.categories = [];
    this.initialized = false;
  }

  /**
   * 初始化 交互中心
   * @param refresh 强制更新？ 默认否
   */
  async init(refresh = false) {
    if (!refresh && this.initialized) return this;

    let categories: ICategories = wx.getStorageSync(CATEGORIES);

    // 获取远端分类列表
    // 1. 强制刷新
    // 2. 本地无缓存
    if (refresh || categories.length === 0) {
      categories = await CategoryService.getCategories();
    }

    this.categories = categories.map(cate => {
      cate.selected = this.ids.indexOf(cate.id) > -1;
      return cate;
    });

    // 写入本地缓存
    wx.setStorageSync(CATEGORIES, categories);

    this.initialized = true;

    return this;
  }

  public get ids(): number[] {
    return wx.getStorageSync(SUBSCRIBED);
  }

  public set ids(values: number[]) {
    console.log("ids change -> ", values);
    wx.setStorageSync(SUBSCRIBED, values);
  }

  /**
   * 订阅列表
   */
  public get subscribed(): ICategories {
    return this.categories.filter(cate => cate.selected);
  }

  /**
   * 未订阅列表
   */
  public get unSubscribed(): ICategories {
    return this.categories.filter(cate => !cate.selected);
  }

  /**
   * 添加订阅
   * @param index 下标
   */
  public subscribe(index: number) {
    const item = this.unSubscribed[index];
    console.log("添加订阅 -> ", `${item.name} #${item.id}`);
    item.selected = true;
    this.ids = [...this.ids, item.id];

    return this;
  }

  /**
   * 取消订阅
   * @param index 下标
   */
  public unSubscribe(index: number) {
    const { ids, subscribed } = this;
    const item = subscribed[index];
    console.log("取消订阅 -> ", `${item.name} #${item.id}`);
    item.selected = false;
    ids.splice(ids.findIndex(i => i === item.id));
    this.ids = ids;

    return this;
  }
}

export default new CategoryInteractor();
