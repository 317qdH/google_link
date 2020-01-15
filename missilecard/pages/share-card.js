
import regeneratorRuntime from '../utils/regenerator-runtime/runtime-module';
import toCardPoster from '../utils/to-card-poster';
import api from '../api/api';
import xcxCommond from '../utils/xcxCommond';
const app = getApp();
// pages/share-card.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //初始化名片样式类
    cardClassName: 'user-card-template1',
    //初始化名片背景src
    cardImageSrc: '/images/business-card-bg1.png',
    //继续分享弹窗
    saveSuccessFlag: false,
    //名片背景切换
    currentTab:0,
    imgUrls: [
      'https://img0.912688.com/mc-share-moments-bg1.jpg',
      'https://img0.912688.com/mc-share-moments-bg7.jpg',
      'https://img0.912688.com/mc-share-moments-bg8.jpg',
      'https://img0.912688.com/mc-share-moments-bg9.jpg',
      'https://img0.912688.com/mc-share-moments-bg10.jpg',
      'https://img0.912688.com/mc-share-moments-bg11.jpg',
      'https://img0.912688.com/mc-share-moments-bg12.jpg',
      'https://img0.912688.com/mc-share-moments-bg13.jpg',
      'https://img0.912688.com/mc-share-moments-bg14.jpg',
      'https://img0.912688.com/mc-share-moments-bg15.jpg',
      'https://img0.912688.com/mc-share-moments-bg16.jpg',
      'https://img0.912688.com/mc-share-moments-bg17.jpg',
      'https://img0.912688.com/mc-share-moments-bg18.jpg',
      'https://img0.912688.com/mc-share-moments-bg19.jpg',
    ],
    //名片海报图片地址
    cardImagePath:'',
    //画canvas方法名
    toCanvasMethodName:'',
    //用户信息
    userInfoObj:{},
    //防疯狂保存
    canSave:true,
    //是否同意授权
    authorShowFlag:false,
    //用户第一次进入，不知道有没有授权相册
    isFirstEnter:true,
    //二维码
    qrcodeUrl:''
  },
  shareToMoments(e) {
    this.setData({
      saveSuccessFlag: false
    })
  },
  watchCurrent(e){
    let current = e.detail.current;
    this.setData({
      currentTab: current
    })
  },
  async saveToImage(e){
    let authoriResult = await xcxCommond.handleSetting(this);
    if (authoriResult){
      return
    }
    if (!this.data.canSave){
      return
    }else{
      wx.showLoading({
        title: '正在生成图片',
        mask:true
      })
    }
    this.setData({
      canSave:false
    })
    let userInfo = wx.getStorageSync('userInfoObj');
    let userInfoObj = {
      userName: userInfo.name,
      userOccupation: userInfo.position,
      userCompany: userInfo.companyName,
      userTelephone: userInfo.mobile,
      userEmail: userInfo.mail,
      avatarPath: userInfo.avatarPath
    };
    //创建绘图上下文对象
    let ctx = wx.createCanvasContext('customCanvas');
    //完成名片canvas制作
    const { rpx } = await toCardPoster.canvasCommon(this, ctx, this.data.cardImageSrc, this.data.imgUrls[this.data.currentTab], this.data.qrcodeUrl);
    await toCardPoster[this.data.toCanvasMethodName](ctx, rpx, userInfoObj, app.globalData.minSize);
    // ctx.draw();
    //canvas导出为图片
    // ctx.draw(false);
    // await setTimeout(() =>{
    //   toCardPoster.canvasToImage(this);
    // },200)
    ctx.draw(false, ()=>{
      toCardPoster.canvasToImage(this);
    });
  },
  async getCanvasTemplate(){
    let res = await new Promise((resolve,reject)=>{
      wx.getStorage({
        key: 'BgSelection',
        success: (res) => {
          resolve(res);
        },
        fail:(res)=>{
          reject(res)
        }
      })
    })
    this.setData({
      cardClassName: res.data.cardClassName,
      cardImageSrc: res.data.cardImageSrc,
      toCanvasMethodName: res.data.toCanvasMethodName
    })
    // this.saveToImage();
  },
  contains(arrays, content) {
    var i = arrays.length;
    while (i--) {
      if (arrays[i].carteClassName === content) {
        return i;
      }
    }
    return false;
  },
  async getcardInfor() {
    let response = await api.getcardInfor({
      headers: {
        'content-type': 'application/json'
      }
    });
    let userInfoObj = response.data.data
    this.setData({
      userInfoObj
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getcardInfor();
    // this.getCanvasTemplate();
    this.setData({
      qrcodeUrl: app.globalData.qrcodeUrl
    })
    wx.getStorage({
      key: 'userInfoObj',
      success: (res) => {
        this.setData({
          userInfoObj: res.data
        })
      },
    })
    wx.getStorage({
      key: 'BgSelection',
      success: (res) => {
        this.setData({
          cardClassName: res.data.cardClassName,
          cardImageSrc: res.data.cardImageSrc,
          toCanvasMethodName: res.data.toCanvasMethodName
        })
      },
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