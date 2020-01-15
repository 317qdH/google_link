Component({
  /**
   * 组件的属性列表
   */
  properties: {
    unCttVipFlag: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // unCttVipFlag: true
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeVipPopup() {
      this.setData({
        unCttVipFlag: true
      })
    },
    toCttChannel() {
      wx.navigateTo({
        url: '/pages/channel/ctt',
      })
    },
  }
})
