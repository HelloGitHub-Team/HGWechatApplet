const { getCategory } = require('../../srevice/liketabService')
const { showTextToast } = require('../../utils/toast')


Page({
  data: {
    list: [],
    detail: '至少选择一个',
    hasTag: false,
    chooseArr: []
  },
  onLoad(options) {
    this.initPageData()
  },
  // 初始化数据
  initPageData() {
    const tagData = wx.getStorageSync('likeTag')
    getCategory({
      success: list => {
        const data = list.map((item, index) => {
          const rObj = item
          tagData.map(item => {
            if (item.id === rObj.id) {
              rObj.selected = true
            }
          })
          return rObj
        })
        if (tagData && tagData.length !== data.length) {
          this.setData({
            list: data,
            chooseArr: tagData,
            hasTag: true,
            detail: `已选择${tagData.length}/${data.length}个标签`
          })
        } else {
          this.setData({
            list: data
          })
        }
      }
    })
  },

  // 选取标签
  chooseTag(e) {
    // 选择标签
    const index = e.currentTarget.dataset.index
    const item = this.data.list[index]
    const tagArr = this.data.chooseArr
    item.selected = !item.selected
    tagArr.indexOf(item) !== -1 ? tagArr.splice(tagArr.indexOf(item), 1) : tagArr.push(item)
    if(this.data.chooseArr.length > 0) {
      this.data.hasTag = true
      this.data.detail = `已选择${tagArr.length}/${this.data.list.length}标签`
    } else {
      this.data.hasTag = false
      this.data.detail = '至少选择一个'
    }

    this.setData({
      list: this.data.list,
      hasTag: this.data.hasTag,
      detail: this.data.detail,
      chooseArr: this.data.chooseArr
    })
  },

  goClass() {
    const data = this.data.chooseArr
    if (data.length === 0) {
      showTextToast('请选择感兴趣的标签', 3)
      return
    }
    wx.setStorage({
      key: 'likeTag',
      data: data
    })
    wx.switchTab({
      url: '../index/index'
    })
  },

  jumpOver() {
    const data = this.data.list
    wx.setStorage({
      key: 'likeTag',
      data: data
    })
    wx.switchTab({
      url: '../index/index'
    })
  }
})