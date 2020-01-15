// pages/usercenter/ctt-vip/ctt-vip.js
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime-module';
import api from '../../../api/api';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    someData: {
      statusBarHeight: app.globalData.statusBarHeight,
      titleBarHeight: app.globalData.titleBarHeight
    },
    isShowBack: true,
    sharePage: false,
    arrowColor:'white',
    navigatorColor:'white',
    //用户会员信息
    userCardObj: '',
    havelogin: 99,
    isVip: false,
    probationFlag: 99,
    payFlag:99
  },
  async userShowInit() {
    let response = await api.userInfo();
    let probationFlag = response.data.data.probationFlag?1:0;
    let payFlag = response.data.data.payFlag?1:0;
    if (response.data.success) {
      this.setData({
        userCardObj: response.data.data,
        payFlag,
        probationFlag
      })
    }
  },
  toCttChannel(){
    wx.navigateTo({
      url: '/pages/channel/ctt',
    })
  },
  toShhRegister(){
    wx.navigateTo({
      url: '/pages/usercenter/account/account?currentTab=1',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var havelogin = wx.getStorageSync("havelogin")?1:0;
    
    this.setData({
      havelogin,
      isVip: app.globalData.isvip
    });
    if (havelogin) {
      this.userShowInit();
    }
  },
  goback: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  toIndex: function () {
    wx.switchTab({
      url: '/pages/index',
    })
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
    let pages = getCurrentPages();
    console.log(pages);
    if (pages.length == 1) {
      this.setData({
        isShowBack: false
      })
    } else {
      this.setData({
        isShowBack: true
      })
    }
    let userInfoObj = wx.getStorageSync('userInfoObj');
    this.setData({
      userInfoObj
    })
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

  }
})