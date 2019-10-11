import ProjectService from "@domains/project/Service";
import CategoryInteractor from "@domains/category/Interactor";

Page({
  data: {
    ready: false,

    active: 0,
    projects: [],
    categories: [],

    page: 1,
    loading: false,
    has_more: true,
    loadingmore: false,

    isReloading: false
  },

  async onPullDownRefresh() {
    this.setData({ page: 1, isReloading: true });
    await this.fetchProjects();
    wx.stopPullDownRefresh();
    this.setData({ isReloading: false });
  },

  loadMore() {
    const { page, has_more } = this.data;
    if (has_more) {
      this.setData({ page: page + 1, loadingmore: true });

      wx.nextTick(() => {
        console.log("load more -> ", page + 1);
        this.fetchProjects(true);
      });
    }
  },

  switchCategory(evt: any) {
    const index = evt.detail.index;
    this.setData({ active: index, page: 1 });

    this.fetchProjects();
  },

  showLoading(status: boolean) {
    const { loadingmore, isReloading } = this.data;
    this.setData({ loading: status });

    if (!loadingmore && !isReloading) {
      status ? wx.showLoading({ title: "加载中" }) : wx.hideLoading();
    }
  },

  async fetchProjects(loadmore = false) {
    const { loading } = this.data;

    if (loading) return;
    this.showLoading(true);

    const { active, page, categories, projects: preDatas } = this.data;
    const { id } = categories[active];

    try {
      const { projects, has_more } = await ProjectService.getProjects({
        id: id,
        page
      });

      const _projects = loadmore ? preDatas.concat(projects) : projects;

      this.setData({ projects: _projects, has_more });
    } catch (error) {
      wx.showToast({ title: error, icon: "none" });
    }

    this.showLoading(false);
  },

  gotoSubscription() {
    wx.navigateTo({ url: "/pages/subscription/index" });
  },

  async onShow() {
    const { subscribed, categories } = await CategoryInteractor.init();

    this.setData({
      active: 0,
      ready: true,
      categories: subscribed.length ? subscribed : categories
    });

    wx.nextTick(() => {
      wx.startPullDownRefresh();
    });
  }
});
