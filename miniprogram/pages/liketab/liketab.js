const { getCategory } = require('../../srevice/liketabService')


Page({
  data: {
    list: []
  },
  onLoad(options) {
    this.initPageData()
  },
  // 初始化数据
  initPageData() {
    getCategory({
      success: list => {
        this.setData({
          list:list
        })
      }
    })
  }
})