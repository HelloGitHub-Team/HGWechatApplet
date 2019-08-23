const projectListService = require('../../srevice/projectListService')

Component({
  properties: {
    tabList: {
      type: Object
    }
  },
  data: {
    index: 0,
    projectList: [],
    page: 1,
    hasMore: true
  },

  observers: {
    tabList (tabList) {
      // this.chooseItem()
      console.log('tabList', tabList)
      if (tabList) {
        this.getProjectList()
      }
    }
  },

  methods: {
    chooseItem(e) {
      if (e) {
        this.data.tabList[this.data.index].selected = !this.data.tabList[this.data.index].selected
        this.data.index = e.currentTarget.dataset.index
      }
      this.data.tabList[this.data.index].selected = !this.data.tabList[this.data.index].selected
      console.log('data', this.data)
      this.setData({
        index: this.data.index,
        tabList: this.data.tabList
      })
    },
    getProjectList() {
      const that = this
      projectListService.getProjectList({
        id: this.data.tabList[this.data.index].id,
        page: this.data.page,
        success: res => {
          console.log('list', res)
          that.triggerEvent('projectData', res.payload)
          this.setData({
            projectList: res.payload,
            hasMore: res.has_more
          })
        }
      })
    }
  }
})