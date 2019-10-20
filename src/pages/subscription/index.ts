import Interactor from "@domains/category/Interactor";

Page({
  data: {
    subscribed: [],
    unSubscribed: [],

    changed: false,
    submitting: false
  },

  // 添加订阅
  subscribe(evt: any) {
    const index = evt.currentTarget.dataset.index;
    const { subscribed, unSubscribed } = Interactor.subscribe(index);

    // 更新界面
    this.setData({ changed: true, subscribed, unSubscribed });
  },

  // 取消订阅
  unsubscribe(evt: any) {
    const index = evt.currentTarget.dataset.index;
    const { subscribed, unSubscribed } = Interactor.unSubscribe(index);

    // 更新界面
    this.setData({ changed: true, subscribed, unSubscribed });
  },

  submit() {
    const { submitting } = this.data;
    if (submitting) return;
    this.setData({ submitting: true });

    wx.showToast({ title: "订阅成功！" });

    wx.nextTick(() => {
      this.setData({ submitting: false });
      wx.navigateBack();
    });
  },

  async onShow() {
    wx.showLoading({ title: "加载中..." });

    // 这里强制更新分类列表
    const { subscribed, unSubscribed } = await Interactor.init(true);
    this.setData({ subscribed, unSubscribed });

    wx.hideLoading();
  }
});
