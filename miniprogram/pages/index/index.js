Page({
	data: {
		projectList: []
	},
	onLoad(options) {
		this.initPageData()
	},
	initPageData() {
		const list = wx.getStorageSync('likeTag')
		list.map(item => {
			item.selected = false
		})
		list[0].selected = true
		this.setData({
			tabList: list
		})
	},
	getProjectList(e) {
		console.log('e-->', e.detail)
		this.setData({
			projectList: e.detail
		})
	}
})