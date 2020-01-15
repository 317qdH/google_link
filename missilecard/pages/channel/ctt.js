// pages/channel/joinus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popupShow: false,
    flag: 'joinus',
    source: 59,
    toindexFlag: false,
    menuShowFlag: false,
    buttonColor: 'white'
  },
  showPopup(e) {
    this.setData({
      popupShow: true
    })
  },
  //导航栏显示
  navShowInit() {
    let pages = getCurrentPages();
    if (pages.length == 1) {
      this.setData({
        toindexFlag: true
      })
    } else {
      this.setData({
        toindexFlag: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.navShowInit();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({
      menuShowFlag: false
    })
    return {
      title: '搜好货 帮助商人更成功',
      path: '/pages/channel/joinus'
    }
  }
})