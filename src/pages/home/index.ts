Page({
	data: {
    dalilyData: [
      {
        projectName: '项目名字1',
        projectUrl: '项目Github地址',
        projectDesc: '1项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字',
        projectImgs: [
          'https://static.mdaren.cn/test2/b0836ff57fabff524a7265f639313dfd.png'
        ]
      },
      {
        projectName: '项目名字2',
        projectUrl: '项目Github地址',
        projectDesc: '2项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字',
        projectImgs: [
          'https://static.mdaren.cn/test2/b0836ff57fabff524a7265f639313dfd.png'
        ]
      },
      {
        projectName: '项目名字3',
        projectUrl: '项目Github地址',
        projectDesc: '3项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字',
        projectImgs: [
          'https://static.mdaren.cn/test2/b0836ff57fabff524a7265f639313dfd.png'
        ]
      },
      {
        projectName: '项目名字4',
        projectUrl: '项目Github地址',
        projectDesc: '4项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字',
        projectImgs: [
          'https://static.mdaren.cn/test2/b0836ff57fabff524a7265f639313dfd.png'
        ]
      },
      {
        projectName: '项目名字5',
        projectUrl: '项目Github地址',
        projectDesc: '5项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字',
        projectImgs: [
          'https://static.mdaren.cn/test2/b0836ff57fabff524a7265f639313dfd.png'
        ]
      },
      {
        projectName: '项目名字6',
        projectUrl: '项目Github地址',
        projectDesc: '6项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字',
        projectImgs: [
          'https://static.mdaren.cn/test2/b0836ff57fabff524a7265f639313dfd.png'
        ]
      },
      {
        projectName: '项目名字7',
        projectUrl: '项目Github地址',
        projectDesc: '7项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字项目描述描述描述可能很多字可能很多字',
        projectImgs: [
          'https://static.mdaren.cn/test2/b0836ff57fabff524a7265f639313dfd.png'
        ]
      }
    ],
    style: [],
    basicdata: {
      start: {},
      end: {}
    },
    temporaryData: {
      offsetY: '',
      poswidth: 0,  // 记录位移
      posheight: 0,  // 记录位移
      lastPosWidth: '',
      lastPosHeight: '',
      lastZindex: '',
      rotate: 0,
      lastRotate: 0,
      visible: 3, // 页面最多显示几个卡片
      // tracking: false, // 是否在滑动，防止多次操作，影响体验
      animation: false, // 首图是否启用动画效果，默认为否
      currentPage: 0, // 显示第几个
      opacity: 1, // 记录首图透明度
      lastOpacity: 0,
      swipe: false,
      zIndex: 10
    },
    el: [] // 当前点击的堆叠区域内对象
  },
  onLoad() {
    const query = wx.createSelectorQuery()
    query.select('#dc-cards').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res: any) => {
      this.setData({
        el: res[0]
      })
    })
  },
  onShow() {
    this.changeStyle()
  },
  touchStart(e: any) {
    // 记录起始位置
    const to = 'temporaryData.offsetY'
    this.setData({
      // offsetY在touch事件中没有，只能自己计算
      [to]: e.touches[0].pageY - 0,
      basicdata: {
        start: {
          t: new Date().getTime(),
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        },
        end: {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        }
      }
    })
  },
  touchMove(e: any) {
    // console.log(e.touches[0].pageX, e.touches[0].pageY, 'move')
    // this.setData({
    //   style: `translate3d(${this.displacement.x}px,${this.displacement.y}px,${(this.currentIndex - index) * 60}px) rotate(${this.displacement.x / this.winWidth * -65}deg)`
    // })
    // 记录滑动位置
    if (e.type === 'touchmove') {
      const bex = 'basicdata.end.x'
      const bey = 'basicdata.end.y'
      this.setData({
        [bex]: e.touches[0].clientX,
        [bey]: e.touches[0].clientY
      })
    } else {
      const bex = 'basicdata.end.x'
      const bey = 'basicdata.end.y'
      this.setData({
        [bex]: e.clientX,
        [bey]: e.clientY
      })
    }
    // 计算滑动值
    const tpw = 'temporaryData.poswidth'
    const tph = 'temporaryData.posheight'
    const offsetWidthRatio = this.calcuOffsetWidthRatio()
    this.setData({
      [tpw]: this.data.basicdata.end.x - this.data.basicdata.start.x,
      [tph]: this.data.basicdata.end.y - this.data.basicdata.start.y
    })
    const rotateDirection = this.rotateDirection()
    const angleRatio = this.angleRatio()
    const tr = 'temporaryData.rotate'
    this.setData({
      [tr]:  rotateDirection * offsetWidthRatio * 15 * angleRatio
    })
    this.changeStyle()
  },
  touchEnd(e: any) {
    const ta = 'temporaryData.animation'
    this.setData({
      [ta]: true
    })
    // 滑动结束，触发判断
    // 判断划出面积是否大于0.4
    const tpw = 'temporaryData.poswidth'
    const tph = 'temporaryData.posheight'
    const to = 'temporaryData.opacity '
    const ts = 'temporaryData.swipe'
    const tr = 'temporaryData.rotate'
    const offsetRatio = this.calcuOffsetRatio()
    if (offsetRatio >= 0.4) {
      // 计算划出后最终位置
      const ratio = Math.abs(this.data.temporaryData.posheight / this.data.temporaryData.poswidth)
      this.setData({
        [tpw]: this.data.temporaryData.poswidth >= 0 ? this.data.temporaryData.poswidth + 200 : this.data.temporaryData.poswidth - 200,
        [tph]: this.data.temporaryData.posheight >= 0 ? Math.abs(this.data.temporaryData.poswidth * ratio) : -Math.abs(this.data.temporaryData.poswidth * ratio),
        [to]: 0,
        [ts]: true
      })
      this.nextTick()
    // 不满足条件则滑入
    } else {
      this.setData({
        [tpw]: 0,
        [tph]: 0,
        [tr]: 0,
        [ts]: false
      })
    }
    this.changeStyle()
  },
  nextTick () {
    // 记录最终滑动距离
    const tplow = 'temporaryData.lastPosWidth'
    const tplh = 'temporaryData.lastPosHeight'
    const tlr = 'temporaryData.lastRotate'
    const tlz = 'temporaryData.lastZindex'
    this.setData({
      [tplow]: this.data.temporaryData.poswidth,
      [tplh]: this.data.temporaryData.posheight,
      [tlr]: this.data.temporaryData.rotate,
      [tlz]: 20
    })
    // 循环currentPage
    const tcp = 'temporaryData.currentPage'
    this.setData({
      [tcp]: this.data.temporaryData.currentPage === this.data.dalilyData.length - 1 ? 0 : this.data.temporaryData.currentPage + 1
    })
    // currentPage切换，整体dom进行变化，把第一层滑动置最低
    const tpw = 'temporaryData.poswidth'
    const tph = 'temporaryData.posheight '
    const to = 'temporaryData.opacity'
    const tr = 'temporaryData.rotate'
    this.setData({
      [tpw]: 0,
      [tph]: 0,
      [to]: 1,
      [tr]: 0
    })
  },
  // 样式生效
  changeStyle() {
    const styleArr = this.data.style
    if (this.data.dalilyData.length > 0) {
      this.data.dalilyData.map((d: any, index: number) => {
        const style1 = this.transformIndex(index)
        const style2 = this.transform(index)
        if (style1 && style2) {
          styleArr[index] = style1 + '; ' + style2
        } else if (style1) {
          styleArr[index] = style1
        } else {
          styleArr[index] = style2
        }
      })
      this.setData({
        style: styleArr
      })
    }
    // console.log(this.data.style)
  },
  // 划出面积比例
  calcuOffsetRatio() {
    const width = this.data.el.width
    const height =  this.data.el.height
    const offsetWidth = width - Math.abs(this.data.temporaryData.poswidth)
    const offsetHeight = height - Math.abs(this.data.temporaryData.posheight)
    const ratio = 1 - (offsetWidth * offsetHeight) / (width * height) || 0
    return ratio > 1 ? 1 : ratio
  },
  // 划出宽度比例
  calcuOffsetWidthRatio() {
    const width = this.data.el.width
    const offsetWidth = width - Math.abs(this.data.temporaryData.poswidth)
    const ratio = 1 - offsetWidth / width || 0
    return ratio
  },
  // 非首页样式切换
  transform (index: number) {
    console.log('in' + index)
    const currentPage = this.data.temporaryData.currentPage
    const length = this.data.dalilyData.length
    const lastPage = currentPage === 0 ? this.data.dalilyData.length - 1 : currentPage - 1
    let style = ''
    const visible = this.data.temporaryData.visible
    const offsetRatio = this.calcuOffsetRatio()
    if (index === this.data.temporaryData.currentPage) {
      return
    }
    if (this.inStack(index, currentPage)) {
      console.log(11111)
      const perIndex = index - currentPage > 0 ? index - currentPage : index - currentPage + length
      style += 'opacity: 1; transform: translate3D(0,0,' + -1 * 30 * (perIndex - offsetRatio) + 'px' + '); z-index: ' + (visible - perIndex)
      style += '; transition-timing-function: ease; transition-duration: 300ms'
    } else if (index === lastPage) {
      console.log(22222)
      style += 'transform: translate3D(' + this.data.temporaryData.lastPosWidth + 'px' + ',' + this.data.temporaryData.lastPosHeight + 'px' + ',0px) ' + 'rotate(' + this.data.temporaryData.lastRotate + 'deg)'
      style += '; opactiy: ' + this.data.temporaryData.lastOpacity
      style += '; z-index: ' + this.data.temporaryData.lastZindex
      style += '; transition-timing-function: ease; transition-duration: 300ms'
    } else {
      console.log(33333)
      style += 'z-index: 1; display: none; opacity: 0; transform: translate3D(0,0,' + -1 * visible * 20 + 'px' + ')'
    }
    return style
  },
  // 首页样式切换
  transformIndex (index: number) {
    if (index === this.data.temporaryData.currentPage) {
      let style = ''
      style += 'transform: translate3D(' + this.data.temporaryData.poswidth + 'px' + ',' + this.data.temporaryData.posheight + 'px' + ',0px) ' + 'rotate(' + this.data.temporaryData.rotate + 'deg)'
      style += '; opacity: ' + this.data.temporaryData.opacity
      style += '; z-index: 10'
      if (this.data.temporaryData.animation) {
        style += '; transition-timing-function: ease; transition-diration: 300ms'
      }
      return style
    }
  },
  rotateDirection () {
    if (this.data.temporaryData.poswidth <= 0) {
      return -1
    } else {
      return 1
    }
  },
  angleRatio () {
    const height = this.data.el.height
    const offsetY = this.data.temporaryData.offsetY
    const ratio = -1 * (2 * offsetY / height - 1)
    return ratio || 0
  },
  inStack (index: number, currentPage: number) {
    const stack = []
    const visible = this.data.temporaryData.visible
    const length = this.data.dalilyData.length
    for (let i = 0; i < visible; i++) {
      if (currentPage + i < length) {
        stack.push(currentPage + i)
      } else {
        stack.push(currentPage + i - length)
      }
    }
    return stack.indexOf(index) >= 0
  },
  onTransitionEnd(e: any) {
    const lastPage = this.data.temporaryData.currentPage === 0 ? this.data.dalilyData.length - 1 : this.data.temporaryData.currentPage - 1
    // dom发生变化正在执行的动画滑动序列已经变为上一层
    const index = e.target.dataset.index
    if (this.data.temporaryData.swipe && index === lastPage) {
      const ta = 'temporaryData.animation'
      const tlw = 'temporaryData.lastPosWidth'
      const tlh = 'temporaryData.lastPosHeight'
      const tlo = 'temporaryData.lastOpacity'
      const tlr = 'temporaryData.lastRotate'
      const ts = 'temporaryData.swipe'
      const tlz = 'temporaryData.lastZindex'

      this.setData({
        [ta]: true,
        [tlw]: 0,
        [tlh]: 0,
        [tlo]: 0,
        [tlr]: 0,
        [ts]: false,
        [tlz]: -1
      })
      this.changeStyle()
    }
  }
})