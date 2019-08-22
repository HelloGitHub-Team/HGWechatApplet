Page({
	data: {
		tabList: []
	},
	onLoad(options) {
		this.initPageData()
	},
	initPageData() {
		const list = wx.getStorageSync('likeTag')
		this.setData({
			tabList: list
		})
	}
})