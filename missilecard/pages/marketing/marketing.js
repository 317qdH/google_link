// pages/marketing/marketing.js
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module';
import api from '../../api/api';
import userUpdate from '../../utils/xcxCommond';
const app = getApp();
Page({
  data: {
    //初始化名片样式类
    cardClassName: 'user-card-template1',
    //初始化名片背景src
    cardImageSrc: '/images/business-card-bg1.png',
    //轮播图片地址
    imgUrls: [
      'http://img1.912688.com/mc-marketing-card1.jpg',
      'http://img1.912688.com/mc-marketing-commodity1.jpg',
      'http://img0.912688.com/mc-marketing-product1.jpg',
      'http://img0.912688.com/mc-marketing-scene1.jpg'
    ],
    //轮播切换索引
    current: 0,
    //用户信息
    userInfoObj: {
      name: '名字未填写',
      mobile: '手机号码未填写',
      mail: '邮箱未填写',
      position: '职位信息未填写',
      companyName: '公司名称未填写',
      avatarPath: '/images/cie-avatar.jpg'
    },
    havelogin: '',
    unCttVipFlag:true,
    //用户没有名片
    isHaveCard:false,
    //没有名片弹窗
    unCardFlag:false
  },
  unCreateCard(){
    this.setData({
      unCardFlag:false
    })
  },
  createCard(){
    this.setData({
      unCardFlag: false
    })
    wx.navigateTo({
      url: '/pages/editCard/pages/create-card/create-card?createtab=0',
    })
  },
  marketingNavClick(e) {
    let idx = e.currentTarget.dataset.idx;
    if (!this.data.isHaveCard){
      this.setData({
        unCardFlag: true
      })
      return
    }
    else if (!app.globalData.isvip && (idx == 1 || idx == 2) ){
      this.setData({
        unCttVipFlag:false
      })
      return 
    }
    let hashList = ['/pages/marketing/marketing-category?marketingTab=1', '/pages/marketing/marketing-category?marketingTab=3', '/pages/marketing/marketing-category?marketingTab=2','/pages/share-card'];
    wx.navigateTo({
      url: hashList[idx],
    })

  },
  onGotUserInfo(e){
    if (e.detail.authoriFlag){
      wx.showTabBar();
      wx.setStorage({
        key: 'indexIsInit',
        data: '1',
      })
      wx.navigateTo({
        url: '../usercenter/account/account',
      })
    }
  },
  //去用户信息展示页面
  toUserCard() {
    wx.navigateTo({
      url: '/pages/usercenter/userCard/userCard',
    })
  },
  //点击切换账号绑定页面
  checkregister() {
    if(wx.getStorageSync('cookie')){
      wx.navigateTo({
        url: '../usercenter/account/account',
      })
    }else{
      wx.hideTabBar();
      this.setData({
        ucInfoAuthShow:true
      })
    }
    
  },
  watchCurrent(e) {
    let idx = e.detail.current
    this.setData({
      current: idx
    })
  },
  async getcardInfor() {
    let response = await api.getcardInfor({
      headers: {
        'content-type': 'application/json'
      }
    });
    if (response.data.code == "0004") {
      let userInfoObj = this.data.userInfoObj;
      userInfoObj.name = app.globalData.userInfo.name;
      userInfoObj.avatarPath = app.globalData.userInfo.avatarPath;
      this.setData({
        userInfoObj
      })
    } else {
      let userInfoObj = response.data.data;
      if (userUpdate.checkUserIsChange(this.data.userInfoObj, userInfoObj)){
        this.setData({
          userInfoObj
        })
      }
      // userInfoObj.avatarPath = userInfoObj.avatarPath || app.globalData.userInfo.avatarUrl;
      
    }
  },
  async checkshh(){
    let response = await api.userInfo();
    if(response.data.data.userId){
      this.setData({
        havelogin:true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.checkshh();
    let bgSelection = wx.getStorageSync('BgSelection');
    wx.getStorage({
      key: 'userInfoObj',
      success:(res) => {
        this.setData({
          userInfoObj: res.data,
          cardClassName: bgSelection.cardClassName,
          cardImageSrc: bgSelection.cardImageSrc
        })
      },
    })
  },
  easeInCubic(e){
    this.setData({
      current:e.detail.current
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
    var havelogin = wx.getStorageSync("havelogin");
    if(!havelogin) {
      this.setData({havelogin:false})
    } else {
      this.setData({ havelogin: true})
      // let bgSelection = wx.getStorageSync('BgSelection');
      // wx.getStorage({
      //   key: 'userInfoObj',
      //   success: (res) => {
      //     this.setData({
      //       userInfoObj: res.data,
      //       cardClassName: bgSelection.cardClassName,
      //       cardImageSrc: bgSelection.cardImageSrc
      //     })
      //   },
      // })
    }

    let bgSelection = wx.getStorageSync('BgSelection');
    wx.getStorage({
      key: 'userInfoObj',
      success: (res) => {
        if (userUpdate.checkUserIsChange(this.data.userInfoObj, res.data)) {
          this.setData({
            userInfoObj: res.data,
            cardClassName: bgSelection.cardClassName,
            cardImageSrc: bgSelection.cardImageSrc
          })
        }else{
          this.setData({
            cardClassName: bgSelection.cardClassName,
            cardImageSrc: bgSelection.cardImageSrc
          })
        }
      },
    })
    this.marketingInit();
  },
  async marketingInit(){
    let response = await api.getcardInfor({
      headers: {
        'content-type': 'application/json'
      }
    });
    if (response.data.success && response.data.data.userId > 0){
      this.setData({
        havelogin: true,
        isHaveCard: true
      })
      wx.setStorage({
        key: 'userInfoObj',
        data: response.data.data,
      })
    } else if (response.data.success){
      this.setData({
        isHaveCard: true
      })
      wx.setStorage({
        key: 'userInfoObj',
        data: response.data.data,
      })
    }else{
      this.setData({
        isHaveCard: false
      })
    }
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
    return {
      title: '还在为拓展人脉，发现商机而发愁？快来试试这款小程序吧！',
      path: '/pages/index',
      imageUrl: 'https://img0.912688.com/mc-share-right-corner.jpg'
    }
  }
})