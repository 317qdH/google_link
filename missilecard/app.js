//app.js
var sessionId = '';
var app = getApp();
import regeneratorRuntime from 'utils/regenerator-runtime/runtime-module';
import api from 'api/api';

App({
  onLaunch: function (options) {

    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          // console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                // console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }

    //获取手机顶部导航栏
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.platform = res.platform
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }
        that.globalData.statusBarHeight = res.statusBarHeight;
        that.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight;
        that.globalData.windowWidth = res.windowWidth;
        that.globalData.windowHeight = res.windowHeight;
      },
      failure() {
        that.globalData.statusBarHeight = 0;
        that.globalData.titleBarHeight = 0;
        that.globalData.windowWidth = 0;
        that.globalData.windowHeight = 0;
      }
    })
  },
  onShow() {
    // console.log('app.js执行')
  },
  globalData: {
    userInfo: null,
    //初始化名片样式类
    cardClassName: 'user-card-template1',
    //初始化名片背景src
    cardImageSrc: '/images/business-card-bg1.png',
    // http: "https://xcx.912688.com",
    // http: "http://10.10.7.159:8083",
    //测试环境
    // http:"http://10.10.7.88:8081",
    bgSelection:{
      cardClassName:"",
      cardImageSrc:'',
      toCanvasMethodName:'',
      cardTab:0
    },
    shareFilePath:'',
    customerShareFilePath:'',
    minSize:100,
    qrcodeUrl:'',
    statusBarHeight: 0,
    titleBarHeight: 0,
    windowWidth: 0,
    windowHeight: 0,
    //是不是ctt会员
    isvip:false
  }
})
