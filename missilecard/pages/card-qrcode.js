// pages/card-qrcode.js
const app = getApp();
import regeneratorRuntime from '../utils/regenerator-runtime/runtime-module';
import xcxCommond from '../utils/xcxCommond';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls:[
      'http://img0.912688.com/mc-paper-card1.jpg',
      'http://img0.912688.com/mc-paper-card2.jpg'
    ],
    current:0,
    //名片二维码
    qrcodeUrl:'',
    //是否可以生成二维码
    canSave:true,
    //是否同意授权
    authorShowFlag: false
  },
  watchCurrent(e){
    let current = e.detail.current
    this.setData({
      current
    })
  },
  async saveQrcode(e){
    let authoriResult = await xcxCommond.handleSetting(this);
    // console.log(authoriResult);
    if (authoriResult) {
      return
    }
    if (!this.data.canSave) {
      // console.log(this.data.canSave)
      return
    } else {
      wx.showLoading({
        title: '正在生成图片',
        mask: true
      })
    }
    this.setData({
      canSave: false
    });
    let qrImgUrl = app.globalData.qrcodeUrl
    wx.downloadFile({
      url: qrImgUrl, //仅为示例，并非真实的资源
      success:(res)=> {
        // console.log(res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res)=> {
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function (err) {
            // console.log(err)
            wx.showModal({
              title: '温馨提示',
              content: '请打开授权，否则无法将图片保存在相册中！',
              showCancel: false
            })
          },
          complete:()=>{
            this.setData({
              canSave: true
            })
            wx.hideLoading();
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData.qrcodeUrl);
    this.setData({
      qrcodeUrl: app.globalData.qrcodeUrl
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

  }
})