// pages/index.js
import comAnimation from '../utils/comAnimation';
import regeneratorRuntime from '../utils/regenerator-runtime/runtime-module';
import api from '../api/api';
import toCardPoster from '../utils/to-card-poster';
import userUpdate from '../utils/xcxCommond';
// import area from 'https://style.912688.com/_resources/manager/zone/ProJson.js';
const app = getApp();
var sessionId;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardTab: 99,
    //微信初始化用户信息
    useravatar: '/images/cie-avatar.jpg',
    companyName: '公司信息未填写',
    companyIphone: '电话信息未填写',
    usEmail: '邮箱信息未填写',
    //初始化名称SS
    username: '栋栋栋',
    //初始化名片样式类
    cardClassName: 'user-card-template1',
    //初始化名片背景src
    cardImageSrc: '/images/business-card-bg1.png',
    //名片切换动画对象
    slide_card: {},
    //防疯狂点击
    canTab: true,
    //模板样式
    // templateId: 1,
    //是否第一次进入小程序
    firstEnter: true,
    userInfoObj: {
      name: '搜好货',
      mobile: '手机号码未填写',
      mail: '邮箱未填写',
      position: '职位信息未填写',
      companyName: '公司名称未填写',
      avatarPath: '',
      templateId:1
    },
    //名片模板数组
    cardTemplateList:[],
    //模板canvas方法名
    toCanvasMethodName:'',
    //名片生成
    canSave:true,
    //名片是否已经生成
    canvasFinish:true,
    //分享图片的路径
    shareFilePath:'',
    //判断是否授权
    authoriFlag:true,
    whiteMask:true,
    //小程序重启后进入（头像闪动）
    onloadEnter:false,
    //搜好货用户id
    shhId:'',
    //搜好货扫码进入弹窗
    shhBindTab:false,
    //授权弹窗
    ucInfoAuthShow:false,
    hasBindAccount:99,
    // cardFlag:true,
    isvip:'',
    //用户id
    userInforId:'',
    //创建名片
    notReadAmount:0,
    //第一次初始化
    firtInitFlag:true,
    customerMessList:'',
    nowDate:'',
    dataUpdateDate:'',
    pages:'',
    enjoyCttFlag:false,
    probationLastDays:''
  },
  cttEnjoyOverClick(){
    this.setData({
      enjoyCttFlag:false
    })
  },
  async messageLinkTo(){
    let response = await api.noReadUserList();
    if(response.data.success){
      let list = response.data.data || [];
      if(list.length>1){
        wx.switchTab({
          url: '/pages/message/message-list',
        })
      }else{
        wx.navigateTo({
          url: '/pages/message/chat/chat?launchUserId=' + list[0].launchUserId,
        })
      }
    }
  },
  checkMessageDet(e){
    // console.log(e);
    let launchUserId = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '/pages/message/chat/chat?launchUserId=' + launchUserId,
    })
  },
  //去客户详情
  toCustomerDet(e){
    let launchUserId = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '/pages/ai/customer-detail?launchUserId=' + launchUserId,
    })
  },
  toAiAnalyze(){
    wx.navigateTo({
      url: '/pages/ai/ai-analyze',
    })
  },
  authorPopupShow(){
    wx.hideTabBar();
    this.setData({
      ucInfoAuthShow:true
    })
  },
  clearNull(object) {
    if (typeof object == 'object') {
      for (let item in object) {
        if (typeof object[item] == 'string') {
          object[item] = object[item].replace('null', '');
        }

      }
    }
  },
  photoCreate() {
    wx.navigateTo({
      url: '/pages/camera',
    })
   
  },
  initCardInfor(e) {
    let cardClassName = e.detail.cardClassName;
    let cardImageSrc = e.detail.cardImageSrc;
    let toCanvasMethodName = e.detail.toCanvasMethodName;
    this.setData({
      cardClassName,
      cardImageSrc,
      toCanvasMethodName
    })
    wx.setStorage({
      key: 'BgSelection',
      data: {
        //初始化名片样式类
        cardClassName,
        //初始化名片背景src
        cardImageSrc,
        //tocanvas方法名
        toCanvasMethodName
      },
    })
  },
  getCardChange(e) {
    if (this.data.canTab == false) return
    this.setData({
      canTab: false
    })
    comAnimation.toggleShow(this, 'slide_card', 0, 1);
    setTimeout(() => {
      let cardClassName = e.detail.cardClassName;
      let cardImageSrc = e.detail.cardImageSrc;
      let templateId = e.detail.templateId;
      let toCanvasMethodName = e.detail.toCanvasMethodName;
      let userInfoObj = this.data.userInfoObj;
      userInfoObj.templateId = templateId;
      wx.setStorage({
        key: 'userInfoObj',
        data: userInfoObj,
      })
      wx.setStorage({
        key: 'BgSelection',
        data: { cardClassName, cardImageSrc, toCanvasMethodName},
      })
      this.setData({
        cardClassName,
        cardImageSrc,
        toCanvasMethodName,
        canTab: true,
        userInfoObj
      })
    }, 400)
  },
  async userInit() {
    if (!wx.getStorageSync('cookie')) {
      let res = await api.wxlogin();
    }
    // this.evedayTestDate();
    this.getcardInfor();
    
  },
  async getcardInfor() {
    let response = await api.getcardInfor({
      headers:{
        'content-type':'application/json'
      }
    });
    if (response.data.success) {
      let userInfoObj = response.data.data;
      let res = await api.getCardTemplate();
      this.updateCardBg(userInfoObj.templateId, res.data.data);
      wx.setStorage({
        key: 'userInfoObj',
        data: userInfoObj,
      })
      // userInfoObj.avatarPath = userInfoObj.avatarPath || app.globalData.userInfo.avatarUrl;
      this.setData({
        userInfoObj,
        cardTab: 2
      })
      //获取待办事项
      this.getWaitMessage();
      //雷达
      this.getIndexRadarList();
      this.setData({
        firtInitFlag: false
      })
      //判断用户有没有绑定搜好糊，是不是会员
      let result = await api.userInfo();
      if (result.data.success) {
        if (result.data.data.userId) {
          wx.setStorageSync("havelogin", "havelogin");
        } else {
          wx.removeStorage({
            key: 'havelogin',
            success: function (res) {
              // console.log(res);
            },
          })
        }
        let hasBindAccount = result.data.data.userId ? 1 : 0;
        let isvip = result.data.data.payFlag || result.data.data.probationFlag;
        //试用期还有几天到期
        let probationLastDays = Number(result.data.data.probationLastDays);
        this.setData({
          hasBindAccount,
          isvip,
          userInforId: result.data.data.id,
          probationLastDays
        })
        app.globalData.isvip = isvip;
        //如果少于等于五天，提示过期弹窗
        if (probationLastDays < 6 && result.data.data.probationFlag){
          this.evedayTestDate();
        }
      }

      this.checkShhId(true);
      this.saveToImage();
      this.generateQRcode(userInfoObj);
    } else {
      this.setData({
        cardTab:1
      })
      let cardSelect = this.selectComponent("#cardSelect");
      cardSelect.getCardList();
      new Promise((resolve, reject) => {
        wx.getUserInfo({
          success: (res) => {
            var userInfo = res.userInfo;
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            resolve(userInfo)
          }
        })
      }).then((userInfo) => {
        let userInfoObj = this.data.userInfoObj;
        userInfoObj.name = userInfo.nickName;
        userInfoObj.avatarPath = userInfo.avatarUrl;
        this.setData({
          userInfoObj
        })
        wx.setStorage({
          key: 'userInfoObj',
          data: userInfoObj,
        })
      }) 
      //判断用户有没有绑定搜好货账号
      this.checkShhId();
    }

  },
  async checkShhId(hasCardFlag){
    if (!this.data.shhId) {
      return
    }
    let result = await api.userInfo();
    wx.hideTabBar();
    let shhBindObj = {};
    if (result.data.data.userId && result.data.success) {
      let shhUserId = result.data.data.userId;
      if (shhUserId == this.data.shhId) {
        if(hasCardFlag){
          shhBindObj = {
            content: '恭喜，账号关联成功!',
            tip: '即刻开启营销之路',
            leftContent: '回首页',
            rightContent: '去营销',
            templateId: 1
          }
        }else{
          shhBindObj = {
            content: '恭喜，账号关联成功!',
            tip: '即刻开启营销之路',
            leftContent: '创建名片',
            rightContent: '去营销',
            templateId: 3
          }
        }
      } else {
        shhBindObj = {
          content: '您已绑定好货通账户',
          tip: '是否更换',
          leftContent: '否',
          rightContent: '是',
          tipStyle: 1,
          templateId: 2
        }
      }
      wx.setStorage({
        key: 'havelogin',
        data: 'havelogin',
        success: (res) => {
          console.log(res);
        }
      })
      this.setData({
        shhBindTab: true,
        shhBindObj
      })
    } else if (!result.data.data.userId && result.data.success) {
      let response = await api.updateShh({
        headers: {
          'content-type': 'application/json',
        },
        query: {
          userId: this.data.shhId
        }
      });
      if (response.data.success){
        if (hasCardFlag){
          shhBindObj = {
            content: '恭喜，账号关联成功!',
            tip: '即刻开启营销之路',
            leftContent: '回首页',
            rightContent: '去营销',
            templateId: 1
          }
        }else{
          shhBindObj = {
            content: '恭喜，账号关联成功!',
            tip: '即刻开启营销之路',
            leftContent: '创建名片',
            rightContent: '去营销',
            templateId: 3
          }
        }
        wx.setStorage({
          key: 'havelogin',
          data: 'havelogin',
          success:(res)=>{
            console.log(res);
          }
        })
      }
      this.setData({
        shhBindTab: true,
        shhBindObj
      })
    } else {
      // wx.showToast({
      //   title: '网络异常',
      // })
    }
  },
  shhBindLeftClick(){
    if (this.data.shhBindObj.templateId ==1){
      //用户点击回首页
    } else if (this.data.shhBindObj.templateId == 2){
      //用户点击否，
    } else if (this.data.shhBindObj.templateId == 3){
      //用户点击创建名片
      wx.showTabBar();
      wx.navigateTo({
        url: '/pages/editCard/pages/create-card/create-card?createtab=0',
      })
    }
    wx.showTabBar();
    this.setData({
      shhBindTab: false
    })
  },
  async shhBindRightClick(){
    if (this.data.shhBindObj.templateId == 1) {
      //用户点击去营销
      wx.switchTab({
        url: '/pages/marketing/marketing',
      })
    } else if (this.data.shhBindObj.templateId == 2) {
      //用户点击是否更换
      let response = await api.updateShh({
        headers: {
          'content-type': 'application/json',
        },
        query: {
          userId: this.data.shhId
        }
      });
      if (response.data.success){
        wx.showToast({
          title: '账号更换成功',
          icon: 'success'
        })
      }else{
        // wx.showToast({
        //   title: '网络异常',
        //   icon: 'none'
        // })
      }
    } else if (this.data.shhBindObj.templateId == 3) {
      //用户点击去营销
      wx.switchTab({
        url: '/pages/marketing/marketing',
      })
    }
    this.setData({
      shhBindTab: false
    })
    wx.showTabBar();
  },
  //更新名片
  updateCardBg(id, cardTemplateList) {
    let idx = this.contains(cardTemplateList, id, 'id');
    let viewCode = cardTemplateList[idx].viewCode;
    let cardClassName = cardTemplateList[idx].carteClassName;
    let cardImageSrc = cardTemplateList[idx].bigPicPath;
    let toCanvasMethodName = cardTemplateList[idx].poster;
    this.setData({
      cardTemplateList,
      cardClassName,
      cardImageSrc,
      toCanvasMethodName
    })
    app.globalData.shareFilePath = '';
    this.saveToImage()
    wx.setStorage({
      key: 'BgSelection',
      data: { cardClassName, cardImageSrc, toCanvasMethodName},
    })
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
  toUserCard() {
    if(this.data.cardTab == 2){
      wx.navigateTo({
        url: 'usercenter/userCard/userCard',
      })
    }
  },
  // 判断是否已经授权
  async userAuthorized() {
    try {
      let res = await new Promise((resolve, reject) => {
        wx.getSetting({
          success: data => {
            if (data.authSetting['scope.userInfo']) {
              this.userInit();
              resolve(true);
              this.setData({
                whiteMask:false
              })
            } else {
              // wx.hideTabBar();
              this.setData({
                authoriFlag:false,
                whiteMask:false,
                cardTab:3
              })
              reject(false);
            }
          }
        })
      })
      return res
    } catch (e) {
      console.log(e);
    }
  },
  //用户点击授权
  async onGotUserInfo(e) {
    if (e.detail.authoriFlag) {
      this.setData({
        authoriFlag: true,
        cardTab:1
      })
      wx.showTabBar();
      this.userInit();
    } else {
      return
    }

  },
  //生成名片分享图片
  async saveToImage(e) {
    if (app.globalData.shareFilePath != '') {
      return
    }
    if (this.data.cardTab != 2) {
      return
    }
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
    const { rpx } = await this.canvasCommon(ctx, this.data.cardImageSrc);
    await toCardPoster[this.data.toCanvasMethodName](ctx, rpx, userInfoObj, app.globalData.minSize);
    ctx.draw(true,()=>{
      this.canvasToImage(this, rpx);
    });
    // ctx.draw(false, toCardPoster.canvasToImage(this));
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

    // Fill with gradient
    ctx.setFillStyle(grd)
    ctx.fillRect(0, 0, 375 * rpx, 300 * rpx)

    // ctx.setFillStyle('#66a6ff');
    // ctx.fillRect(0, 0, 375 * rpx, 300 * rpx);

    // ctx.setStrokeStyle('#000');
    // ctx.strokeRect(11*rpx, 6*rpx, 279*rpx, 223*rpx);
    // 名片背景
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
  clearNull(object) {
    if (typeof object == 'object') {
      for (let item in object) {
        if (typeof object[item] == 'string'){
          object[item] = object[item].replace('null', '');
        }
       
      }
    }
  },
  photoAdded() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:(res)=> {
        wx.showLoading({
          title: '名片识别中...',
        })
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: api.BASE_PATH + "/carte/discern",
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
            'Cookie': 'JSESSIONID=' + wx.getStorageSync('cookie')
          },
          formData: {
            'user': 'test'
          },
          success: (res)=> {
            var data = JSON.parse(res.data);  
            if (data.success){
              var userinfo = data.data;
              this.clearNull(userinfo);
              if (userinfo.mobile && userinfo.mobile.length && userinfo.mobile.length >11){
                userinfo.mobile = userinfo.mobile.substring(userinfo.mobile.length-11, userinfo.mobile.length);
              }
              wx.setStorageSync('useradd', userinfo);
            } else if (data.code == '0001'){
              wx.showToast({
                title: '识别超时，请手动输入',
              })
            } else if (data.code == '0002'){
              wx.showToast({
                title: '识别异常，请手动输入',
              })
            }
          },
          fail: function (res) {
            console.log('fail');
            
          },
          complete(res){
            wx.hideLoading();
            wx.navigateTo({
              url: '../pages/editCard/pages/create-customer/create-customer'
            })
          }
        })
      },
      fail(res) {
      }
    })
  },
  deleteUser(){
    wx.request({
      method: 'post',
      url: api.BASE_PATH + "/carte/user/update",
      header: {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('cookie')
      },
      data: {
        delFlag:true
      },
      success: function (res) {
      }
    })
  },
  //生成用户二维码
  async generateQRcode(userInfoObj){
    let response = await api.mini_qr({
      query:{
        scene: this.data.userInfoObj.id + '-' + this.data.userInfoObj.userId + '-' + true,
        page: 'pages/usercenter/userCard/userCard'
      },
      method:'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8:' // 默认值
      },
    })
    if (response.data.success) {
      app.globalData.qrcodeUrl = response.data.data;
    }
  },
  //跳转关联 搜好货账户页面
  shhAccountAssitant(){
    wx.navigateTo({
      url: '/pages/usercenter/account/account',
    })
  },
  toCttChannel(){
    wx.navigateTo({
      url: '/pages/channel/ctt',
    })
  },
  evedayTestDate(){
    var myDate = new Date();
    var loginDay = myDate.getDate();
    let lastLoginTime = wx.getStorageSync('lastLoginTime');
    if (!lastLoginTime){
      wx.setStorage({
        key: 'lastLoginTime',
        data: loginDay,
        success:()=>{
          this.setData({
            enjoyCttFlag:true
          })
        }
      })
    }else{
      if (loginDay == lastLoginTime){
        return
      }else{
        wx.setStorage({
          key: 'lastLoginTime',
          data: loginDay,
          success: () => {
            this.setData({
              enjoyCttFlag: true
            })
          }
        })
      }
    }
    
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.scene){
      let params = options.scene.split('-');
      let shhId = params[1];
      this.setData({
        shhId
      })
    }
    this.setData({
      onloadEnter:true
    })
    if (options.indexFlag){
      this.setData({
        cardTab:2
      })
    }
    this.userAuthorized();
    //计算每一天
  },
  onShow() {
    //判断有没有绑定搜好货账号
    if (wx.getStorageSync('havelogin')) {
      this.setData({
        hasBindAccount: 1
      })
    } else {
      this.setData({
        hasBindAccount: 0
      })
    }
    this.setData({
      dataUpdateDate: Date.parse(new Date())
    })
    if(wx.getStorageSync('cookie') && !this.data.firtInitFlag){
      //获取待办事项
      this.getWaitMessage();
      //雷达
      this.getIndexRadarList();
    }
    /*用户再别的页面点击授权，名片信息初始化*/
    if (wx.getStorageSync('indexIsInit') == 1){
      this.setData({
        authoriFlag: true,
        cardTab: 1
      })
      wx.showTabBar();
      this.userInit();
      wx.removeStorage({
        key: 'indexIsInit',
        success: function(res) {},
      })
    }
    if (this.data.onloadEnter){
      this.setData({
        onloadEnter: false
      })
      return 
    }
    this.setData({
      isvip: app.globalData.isvip
    })
    let promise1 = new Promise((resolve,reject)=>{
      wx.getStorage({
        key: 'userInfoObj',
        success: (res) => {
          if (res.data.mobile != '手机号码未填写') {
            this.setData({
              cardTab: 2
            })
          }
          let newUserObj = res.data;
          let userInfoObj = this.data.userInfoObj;
          if (userUpdate.checkUserIsChange(userInfoObj, newUserObj)){
            this.setData({
              userInfoObj: res.data
            })
          }
          resolve()
        },
        fail:(e)=>{
          reject(e)
        }
      })
    })
    let promise2 = new Promise((resolve,reject)=>{
      wx.getStorage({
        key: 'BgSelection',
        success: (res) => {
          this.setData({
            cardClassName: res.data.cardClassName,
            cardImageSrc: res.data.cardImageSrc,
            toCanvasMethodName: res.data.toCanvasMethodName
          })
          resolve();
        },
        fail:(e)=>{
          reject(e);
        }
      })
    })
    Promise.all([promise1,promise2]).then((res)=>{
      this.saveToImage();
      if (app.globalData.shareFilePath == '' && this.data.userInfoObj.id) {
        this.generateQRcode();
      }
    }).catch(e=>  {
      console.log(e);
    })
    
  },
  //待办事项
  async getWaitMessage(){
    let response = await api.waitMessage();
    if (response.data.success){
      // response.data.data.notReadAmount = 2;
      if (response.data.success) {
        this.setData({
          notReadAmount: response.data.data.notReadAmount
        })
        if (response.data.data.notReadAmount == 0) {
          wx.removeTabBarBadge({
            index: 2
          })
        } else {
          let notReadAmount = this.data.notReadAmount > 99 ?'99+': this.data.notReadAmount
          wx.setTabBarBadge({
            index: 2,
            text: notReadAmount + ''
          })
        }
      }
    }
  },
  async getIndexRadarList(){
    let response = await api.indexRadarList({
      query:{
        pageSize:20,
        pageNum:1
      }
    })
    if(response.data.success){
      let customerMessList = response.data.data.list;
      let pages = response.data.data.pages
      let nowDate = Date.parse(new Date());
      this.setData({
        nowDate,
        pages
      })
      if (!this.data.customerMessList || customerMessList.length > this.data.customerMessList.length){
        this.setData({
          customerMessList
        })
      } else if (customerMessList.length == this.data.customerMessList.length){
        let oldCustomerMessList = this.data.customerMessList;
        let newCustomerMessList = JSON.stringify(customerMessList);
        let list = userUpdate.checkListIsChange(oldCustomerMessList, customerMessList);
        let fininalList = JSON.parse(newCustomerMessList)
        list.forEach((item,index)=>{
          this.setData({
            ["customerMessList[" + item + "]"]: fininalList[item]
          })
        })
      }
      // let oldList = this.data.customerMessList;
      // let newList = JSON.stringify(oldList);
      // let new2List = JSON.parse(newList)
      // new2List[0].id = '123456';
      // let obj11 = new2List[0];
      // // new2List[1].id = '48654';
      // // new2List[2].id = '987';
      // new2List = [obj11, ...new2List]
      // //oldList.length =2;
      // //customerMessList.length = 2;
      // this.getMap(oldList, new2List);
    }
  },
  getMap(arr,arr1){
    var keyMap = {}
    var agearr = []
    var schoolarr = []
    for (var i = 0; i < arr.length; i++) {
      if (typeof keyMap[arr[i].lastInteractionTime] == "undefined" || keyMap[arr[i].lastInteractionTime] == null)
        keyMap[arr[i].lastInteractionTime] = i.toString();
      else {
        var index = keyMap[arr[i].lastInteractionTime] + "," + i.toString();
        keyMap[arr[i].lastInteractionTime] = index;
      }
      //agearr[i] = arr[i].avatarPath;
      //schoolarr[i] = arr[i].school;
    }
    var result = []
    for (var i = 0; i < arr1.length; i++) {
      var name = arr1[i].lastInteractionTime;
      var nameindex = keyMap[name];
      var f = 0;
      if (nameindex === "undefined" || nameindex === null){
        result.push(i);
      }else {
        var nameindexArr = nameindex.split(",");
        for (var j = 0; j < nameindexArr.length; j++) {
          var ob = arr[nameindexArr[j]];
          var ob1 = arr1[i];
          var num = 0;
          // console.log(ob,ob1);
          for (var item in ob){
            // console.log(item)
            if(ob[item] == ob1[item]){
             // console.log(ob[item]+' === '+ ob1[item])
              // result.push(i);
              num++;
            }
          }
          if (num == Object.keys(ob).length){
            f = 1;
            break;
          }
        }
      }
      if(f == 0)
        result.push(i);
    }

    // console.log(result);

//最后把 result 不同的结果加入nameMap agearr schoolarr 
  },
  onPullDownRefresh:function(){
    if (wx.getStorageSync('cookie')) {
      //获取待办事项
      this.getWaitMessage();
      //雷达
      this.getIndexRadarList();
      setTimeout(()=>{
        wx.stopPullDownRefresh()
      },0)
      this.setData({
        dataUpdateDate: Date.parse(new Date())
      })
    }
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    api.forwardCarte({
      query: {
        acceptUserId: this.data.userInforId,
        launchUserId: this.data.userInforId
      }
    });
    // if (!app.globalData.shareFilePath){
    //   return 
    //   app.globalData.shareFilePath = 'https://img0.912688.com/mc-enterprise-share-bg1.jpg';
    // }
    // options.id = '196';
    // options.userId = '86';
    // options.saveCardTab = 'true';
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '您好！这是我的名片，希望我们合作愉快！',
        path: '/pages/usercenter/userCard/userCard?id=' + this.data.userInfoObj.id + '&userId=' + this.data.userInfoObj.userId+'&saveCardTab=true',
        imageUrl: app.globalData.shareFilePath
      }  
    }else{
      return {
        title: '还在为拓展人脉，发现商机而发愁？快来试试这款小程序吧！',
        path: '/pages/index',
        imageUrl: 'https://img0.912688.com/mc-share-right-corner.jpg'
      }
    }
    
  }
})
