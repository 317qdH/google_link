// components/totop/totop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    status: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    totop() {
      this.data.status = false;
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 500
      })
    },
    carePageScroll(e) {
      if (e.scrollTop > 100) {
        this.setData({
          status: true
        })
      } else {
        this.setData({
          status: false
        })
      }
    }
  }
})
