// pages/usercenter/userCard/userCard.js
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime-module';
import api from '../../../api/api';
import toCardPoster from '../../../utils/to-card-poster';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户信息对象
    userInfoObj: {
      name: '名字未填写',
      mobile: '手机号码未填写',
      mail: '邮箱未填写',
      position: '职位信息未填写',
      companyName: '公司名称未填写',
      avatarPath: '/images/cie-avatar.jpg'
    },
    //初始化名片样式类
    cardClassName: 'user-card-template1',
    //初始化名片背景src
    cardImageSrc: '/images/business-card-bg1.png',
    //生成分享名片用
    toCanvasMethodName:'',
    cardClassName2: 'user-card-template1',
    cardImageSrc2: '/images/business-card-bg1.png',
    toCanvasMethodName2: '',
    //行业名
    categoryName:'',
    //地址名
    address:'',
    //名片状态
    cardStatus:10,
    //分享人名片模板id
    id:'',
    //分享人用户id
    userId:'',
    likeClickFlag:false,
    onLikeClick:false,
    //接受者id
    acceptUserId:'',
    //分享者id
    launchUserId:'',
    //导航栏标题
    navigatorText:'',
    //授权弹窗
    ucInfoAuthShow:false,
    //公司信息
    companyInforList:{},
    //我的名片id
    myCarteId:'',
    //shareUserId
    shareUserId:''
  },
  //用户点击授权
  async onGotUserInfo(e) {
    if (e.detail.authoriFlag) {
      this.cardInit();
    } else {
      this.setData({
        ucInfoAuthShow:false
      })
      return
    }

  },
  userAuthLogin(){
    this.setData({
      ucInfoAuthShow:true
    })
  },
  copyWeChat(){
    if (this.data.cardStatus == 4){
      this.setData({
        ucInfoAuthShow: true
      })
    }else{
      wx.setClipboardData({
        data: this.data.userInfoObj.weChat,
        success: (res) => {
          wx.showToast({
            title: '微信已复制',
            icon: 'none',
            duration: 3000
          })
        }
      })
    }
    
  },
  callPhone(){
    if(this.data.id){
      wx.makePhoneCall({
        phoneNumber: this.data.userInfoObj.mobile,
      })
    }else{
      wx.showToast({
        title: '不能和自己打电话哦～',
        icon: 'none',
        duration: 3000
      })
    }
    
  },
  async saveCustomer(){
    if(!this.data.id || this.data.id == wx.getStorageSync('userInfoObj').id){
      wx.showToast({
        title: '不能把自己存为客户哦~',
        icon: 'none',
        duration: 3000
      })
      return
    }
    let shareRes = await api.addShareCard({
      query: {
        id: this.data.id || this.data.userInfoObj.id
      },
      headers: {
        'content-type': 'application/json',
      }
    })
    if (shareRes.data.success){
      wx.showToast({
        title: '添加成功',
        icon: 'none',
        duration: 3000
      })
      if(this.data.id){
        api.saveAsCustomer({
          query: {
            carteId: this.data.id,
            acceptUserId: this.data.launchUserId,
            launchUserId: this.data.acceptUserId
          }
        })
      }
    }else{
      wx.showToast({
        title: '您已经添加过客户了',
        icon: 'none',
        duration: 3000
      })
    }
    
  },
  toMessageChat(){
    if (this.data.launchUserId == this.data.acceptUserId || !this.data.launchUserId){
      wx.showToast({
        title: '不能和自己发消息哦～',
        icon: 'none',
        duration: 3000
      })
      return
    }
    wx.navigateTo({
      url: '/pages/message/chat/chat?launchUserId='+this.data.launchUserId+'&acceptUserId='+this.data.acceptUserId,
    })
  },
  async likeClick(e){
    if (this.data.launchUserId == this.data.acceptUserId || !this.data.launchUserId){
      wx.showToast({
        title: '不能给自己点赞哦～',
        icon: 'none',
        duration: 3000
      })
      return
    }
    if (this.data.onLikeClick){
      wx.showToast({
        title: '赞过了哦，试试发消息吧',
        icon: 'none',
        duration: 3000
      })
      return
    }
    this.setData({
      likeClickFlag:true
    })
    setTimeout(()=>{
      this.setData({
        likeClickFlag:false,
      })
    },800)
    let response = await api.likeCardAdd({
      query: {
        acceptUserId: this.data.launchUserId,
        launchUserId: this.data.acceptUserId
      }
    })
    if(response.data.success){
      this.setData({
        onLikeClick: true
      })
    }
  },
  toMyCard(){
    wx.switchTab({
      url: '/pages/index',
    })
  },
  async mutualSaveCard(){
    
    if (!wx.getStorageSync('cookie')) {
      wx.showToast({
        title: '正在加载客户名片，请稍后添加',
        icon: 'none',
        duration: 1000
      })
    }
    let shareRes =await api.addShareCard({
      query:{
        id:this.data.id
      },
      headers:{
        'content-type': 'application/json',
      }
    })
    let acceptRes =await api.addAcceptCard({
      query: {
        carteId: this.data.myCarteId,
        userId: this.data.shareUserId
      }
    })
    if (acceptRes.data.success || shareRes.data.success){
      wx.showToast({
        title: '互换成功',
        icon: 'none',
        duration: 3000
      })
      api.exchangeCarte({
        query: {
          acceptUserId: this.data.launchUserId,
          launchUserId: this.data.acceptUserId
        }
      })
    } else if (acceptRes.data.code == 3041 && shareRes.data.code == 3041){

      wx.showToast({
        title: '已互换，快试试发消息吧',
        icon: 'none',
        duration: 3000
      })
    }else{
      wx.showToast({
        title: '网络竟然崩溃了，请稍后再试',
        icon: 'none',
        duration: 3000
      })
    }
    
    
  },
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.scene = "1-1-true";
    // options.scene = "13-18-true";
    // options.scene ="3445-5143-true";
    // options.id = '5';
    // options.userId = '5668';
    // options.saveCardTab = 'true';
    let id, userId, saveCardTab;
    if (options && options.scene){
      //
      let params = options.scene.split('-');
      id = params[0];
      userId = params[1];
      saveCardTab = params[2];
    }else{
      id = options.id ;
      userId = options.userId ;
      saveCardTab = options.saveCardTab;
    }
    if (saveCardTab){
      this.setData({
        saveCardTab: saveCardTab,
        userId: userId
      })
    }
    if(id){
      this.setData({
        id: id
      })
      //分享进入 初始化
      this.shareCardInit();
    }else{
      this.setData({
        cardStatus:0
      })
      this.getUserCompanyDet();
    }
  },
  async getUserCompanyDet(){
    let response = await api.getUserCompanyDet();
    if(response.data.success){
      let companyInforList = response.data.data || '';
      this.setData({
        companyInforList
      })
    }
  },
  async shareCardInit(){
    if(!wx.getStorageSync('cookie')){
      this.setData({
        cardStatus: 4
      })
    }
    let userResponse = await this.authorizated();
    if (userResponse.data.success) {
      this.setData({
        acceptUserId: userResponse.data.data.id
      })
      this.cardInit();
    } else {
      this.setData({
        cardStatus: 4
      })
    }
    let res = await this.getCarteInfo(parseInt(this.data.id));
    if (res.data.success) {
      let regionStr;
      let response = res.data.data.carte
      if (response.realAddress){
        regionStr = response.realAddress;
      }else{
        if (response.address) {
          if (response.provinceName && response.cityName && response.areaName) {
            regionStr = response.provinceName + response.cityName + response.areaName + response.address;
          } else if (response.provinceName && response.cityName && !response.areaName) {
            regionStr = response.provinceName + response.cityName + response.address;
          } else {
            regionStr = response.address;
          }
        } else {
          if (response.provinceName && response.cityName && response.areaName) {
            regionStr = response.provinceName + response.cityName + response.areaName;
          } else if (response.provinceName && response.cityName && !response.areaName) {
            regionStr = response.provinceName + response.cityName;
          } else {
            regionStr = '';
          }
        }
      }
      let categoryName = '' + response.parentCategoryName + response.categoryName;
      
      if (!response.weChat) {
        response.weChat = ''
      }
      this.setData({
        userInfoObj: response,
        address: regionStr,
        categoryName,
        launchUserId: response.userId,
        onLikeClick: response.likeFlag,
        companyInforList: res.data.data.company,
        shareUserId: response.userId
      })
      this.setData({
        navigatorText: response.name + '的名片'
      })
      let cardTemplateRes = await api.getCardTemplate({}, api.getCardTemplate);
      let resendFlag = true;
      this.updateCardBg(this.data.userInfoObj.templateId || 1, cardTemplateRes.data.data);
      this.updateCardBg(this.data.userInfoObj.templateId || 1, cardTemplateRes.data.data, resendFlag);
    } else {
      // wx.showToast({
      //   title: '服务器异常',
      // })
    }
    //添加查看记录
    let response = await api.viewCarte({
      query: {
        acceptUserId: this.data.launchUserId,
        launchUserId: this.data.acceptUserId
      }
    })
    // if (!response.data.success && response.data.code == '0002'){
    //   let res = await api.wxlogin();
    //   api.viewCarte({
    //     query: {
    //       acceptUserId: this.data.launchUserId,
    //       launchUserId: this.data.acceptUserId
    //     }
    //   })
    // }
  },
  async getCarteInfo(carteId){
    let response = await new Promise((resolve,reject)=>{
      wx.request({
        method: 'post',
        url: api.BASE_PATH + '/carte/share/carte_info_with_like', // 仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          "carte": JSON.stringify({ id: carteId }),
          "carteBehaviorTrack": JSON.stringify({ launchUserId: this.data.acceptUserId })
        },
        success: res => {
          resolve(res)
        },
        fail:(e)=>{
          reject(e)
        }
      })
    })
    return response
  },
  async cardInit(){
    this.getcardInfor();
  },
  async getcardInfor() {
    let response = await api.getcardInfor({
      headers:{
        'content-type':'application/json'
      }
    });
    // if (!response.data.success && response.data.code == '0002') {
    //   // tip.error(res.statusCode + '错误');
    //   console.log('登录态已失效');
    //   let res = await api.wxlogin();
    //   response = await api.getcardInfor({
    //     headers: {
    //       'content-type': 'application/json'
    //     }
    //   });
    // }else 
    if (response.data.success) {
      // if (mycardFlag){}
      let cardStatus = '';
      // if (this.data.saveCardTab){
      //   cardStatus = 3;
      // }else{
      //   cardStatus = 2;
      // }
      if (this.data.id == response.data.data.id) {
        cardStatus = 2;
      }else{
        cardStatus = 3;
      }
      let userInfoObj = response.data.data;
      let myCarteId = response.data.data.id;
      this.setData({
        acceptUserId: userInfoObj.userId,
        cardStatus,
        myCarteId
      })
      new Promise((resolve, reject) => {
        let response = api.getCardTemplate({}, api.getCardTemplate);
        resolve(response)
      }).then((res) => {
        let resendFlag = true;
        // this.updateCardBg(userInfoObj.templateId, res.data.data);
        // this.updateCardBg(this.data.userInfoObj.templateId || 1, res.data.data);
      })
      wx.setStorage({
        key: 'userInfoObj',
        data: userInfoObj,
      })
    } else if(!response.data.success && response.data.code == '0004'){
      this.setData({
        cardStatus: 1
      })
    }else {
      
    }

  },
  //生成名片分享图片
  async saveToImage(e) {
    if (app.globalData.shareFilePath != '') {
      return
    }
    if (!this.data.toCanvasMethodName2){
      return
    }
    // let userInfo = wx.getStorageSync('userInfoObj');
    let userInfo = this.data.userInfoObj;
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
    const { rpx } = await this.canvasCommon(ctx, this.data.cardImageSrc2);
    await toCardPoster[this.data.toCanvasMethodName2](ctx, rpx, userInfoObj, app.globalData.minSize);
    ctx.draw(false,()=>{
      this.canvasToImage(this, rpx);
    });
  },
  canvasToImage(that, rpx) {
    wx.canvasToTempFilePath({
      x: 10 * rpx,
      y: 5.5 * rpx,
      fileType: 'png',
      quality: 1,//图片质量
      canvasId: 'customCanvas',
      success: (res) => {
        app.globalData.shareFilePath = res.tempFilePath;
      }
    }, this)
  },
  async canvasCommon(ctx, cardImageSrc) {
    //当前设备缩放比
    //获取设备的宽度
    let rpx = 1;
    wx.getSystemInfo({
      success: function (res) {
        rpx = res.windowWidth / 375;
      },
    })
    rpx = rpx * 1.29;
    const grd = ctx.createLinearGradient(0, 0, 0, 300);
    grd.addColorStop(0, '#66a6ff')
    grd.addColorStop(1, '#74c7f8')
    ctx.setFillStyle(grd)
    ctx.fillRect(0, 0, 375 * rpx, 300 * rpx)
    if (cardImageSrc == '/images/business-card-bg1.png') {
      ctx.drawImage(cardImageSrc, 25 * rpx, 40 * rpx, 249 * rpx, 152 * rpx);
    } else {
      const cardImagePath = await new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: cardImageSrc,
          success: (res) => {
            resolve(res.path)
          }
        })
      })
      ctx.drawImage(cardImagePath, 25 * rpx, 40 * rpx, 249 * rpx, 152 * rpx);
    }
    return { rpx }
  },
  //更新名片
  updateCardBg(id, cardTemplateList, resendFlag) {
    let idx = this.contains(cardTemplateList, id, 'id');
    let viewCode = cardTemplateList[idx].viewCode;
    let cardClassName = cardTemplateList[idx].carteClassName;
    let cardImageSrc = cardTemplateList[idx].bigPicPath;
    let toCanvasMethodName = cardTemplateList[idx].poster;
    if(!resendFlag){
      this.setData({
        cardClassName2: cardClassName,
        cardImageSrc2: cardImageSrc,
        toCanvasMethodName2: toCanvasMethodName
      })
    }else{
      this.setData({
        cardClassName,
        cardImageSrc,
        toCanvasMethodName
      })
      app.globalData.shareFilePath = '';
      this.saveToImage()
      wx.setStorage({
        key: 'BgSelectionShare',
        data: { cardClassName, cardImageSrc, toCanvasMethodName },
      })
    }
  },
  //根据id找到索引
  contains(arrays, id, value) {
    var i = arrays.length;
    while (i--) {
      if (arrays[i][value] == id) {
        return i;
      }
    }
    return false;
  },
  async authorizated(){
    let response = await new Promise((resolve,reject)=>{
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              method: 'post',
              url: api.BASE_PATH + '/carte/authorization_by_code', // 仅为示例，并非真实的接口地址
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              data: {
                code: res.code
              },
              success: res => {
                resolve(res)
              },
              fail: (e) => {
                reject(e)
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    })
    return response
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
    if (!this.data.id){
      var that = this;
      let bgSelection = wx.getStorageSync('BgSelection');
      wx.getStorage({
        key: 'userInfoObj',
        success: (res) => {
          let regionStr;
          let categoryName = res.data.parentCategoryName  + res.data.categoryName;
          if (res.data.address){
            if (res.data.provinceName && res.data.cityName && res.data.areaName) {
              regionStr = res.data.provinceName  + res.data.cityName  + res.data.areaName + res.data.address;
            } else if (res.data.provinceName && res.data.cityName && !res.data.areaName) {
              regionStr = res.data.provinceName  + res.data.cityName + res.data.address;
            } else {
              regionStr =  res.data.address;
            }
          }else{
            if (res.data.provinceName && res.data.cityName && res.data.areaName) {
              regionStr = res.data.provinceName  + res.data.cityName +  res.data.areaName;
            } else if (res.data.provinceName && res.data.cityName && !res.data.areaName) {
              regionStr = res.data.provinceName  + res.data.cityName;
            } else {
              regionStr = '';
            }
          }
          res.data.weChat = res.data.weChat || "";
          that.setData({
            userInfoObj: res.data,
            cardClassName: bgSelection.cardClassName,
            cardImageSrc: bgSelection.cardImageSrc,
            address: regionStr,
            categoryName
          })
          console.log(bgSelection);
          this.setData({
            navigatorText: res.data.name + '的名片'
          })
        }
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
  onShareAppMessage: function (res) {
    // console.log(res);
    if (this.data.cardStatus == 2) {
      api.forwardCarte({
        query: {
          acceptUserId: this.data.acceptUserId,
          launchUserId: this.data.acceptUserId
        }
      });
    } else if (this.data.cardStatus == 3) {
      api.forwardCarte({
        query: {
          acceptUserId: this.data.launchUserId,
          launchUserId: this.data.acceptUserId
        }
      });
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
      if (this.data.cardStatus == 3){
        return {
          title: '您好，这是' + this.data.userInfoObj.name+'的名片!',
          path: '/pages/usercenter/userCard/userCard?id=' + this.data.userInfoObj.id,
          imageUrl: app.globalData.shareFilePath
        }
      } else if (this.data.cardStatus == 2){
        return {
          title: '您好，这是我的名片，在这里我们可以随时沟通！',
          path: '/pages/usercenter/userCard/userCard?id=' + this.data.userInfoObj.id,
          imageUrl: app.globalData.shareFilePath
        }
      }
      
    } else {
      return {
        title: '还在为拓展人脉，发现商机而发愁？快来试试这款小程序吧！',
        path: '/pages/index',
        imageUrl: 'https://img0.912688.com/mc-share-right-corner.jpg'
      }
    }
  }
})