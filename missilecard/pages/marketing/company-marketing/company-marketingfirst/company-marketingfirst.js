var app = getApp();
import comAnimation from '../../../../utils/comAnimation';
import toCardPoster from '../../../../utils/to-card-poster';
import api from '../../../../api/api';
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime-module';
import xcxCommond from '../../../../utils/xcxCommond';
Page({
  data: {
    firstinfo: {},
    //初始化名片样式类
    cardClassName: 'user-card-template1',
    //初始化名片背景src
    cardImageSrc: '/images/business-card-bg1.png',
    //地区
    region: [],
    //行业
    industry: '选择',
    //行业切换显示标识
    industryShowFlag: false,
    //名片切换动画对象
    slide_card: {},
    //防疯狂点击
    canTab: true,
    form: '',
    id: 1,
    imageArr: [
      "https://img1.912688.com/mc-company-style-bg1.jpg",
      "https://img1.912688.com/mc-company-style-bg2.jpg",
      "https://img1.912688.com/mc-company-style-bg3.jpg",
      "https://img1.912688.com/mc-company-style-bg4.jpg"
    ],
    imageArrs: [
      "https://img1.912688.com/mc-company-style-bg1.jpg",
      "https://img1.912688.com/mc-company-style-bg2.jpg",
      "https://img1.912688.com/mc-company-style-bg3.jpg",
      "https://img1.912688.com/mc-company-style-bg4.jpg"
    ],
    //第几张轮播图
    current: 0,
    imgUrls: [
      'https://img0.912688.com/mc-share-moments-bg1.jpg',
      'https://img0.912688.com/mc-share-moments-bg2.jpg',
      'https://img0.912688.com/mc-share-moments-bg3.jpg',
      'https://img0.912688.com/mc-share-moments-bg4.jpg',
      'https://img0.912688.com/mc-share-moments-bg5.jpg',
      'https://img0.912688.com/mc-share-moments-bg6.jpg',
      'https://img0.912688.com/mc-share-moments-bg7.jpg',
    ],
    //名片海报图片地址
    cardImagePath: '',
    //画canvas方法名
    toCanvasMethodName: 'cardPoster3',
    //分享朋友圈按钮阻止连点
    canSave:true,
    //名片状态
    cardStatus:99,
    //当前页面的二维码
    qrcodeUrl:'',
    //分享者用户id
    shareId:'',
    //授权窗口是否显示
    authorShowFlag: false,
    //分享者userid
    launchUserId:'',
    //接受者userid
    acceptUserId: '',
    ucInfoAuthShow: false,
    unLogin:false
  },
  //回首页创建名片
  createCard(){
    if(this.data.unLogin){
      this.setData({
        ucInfoAuthShow:true
      })
    }else{
      wx.switchTab({
        url: '/pages/index',
      })
    }
  },
  //用户点击授权
  async onGotUserInfo(e) {
    if (e.detail.authoriFlag) {
      this.getcardInfor();
      this.generateQRcode();
    } else {
      this.setData({
        ucInfoAuthShow: false
      })
      return
    }
  },
  toMarketing(){
    wx.switchTab({
      url: '/pages/marketing/marketing',
    })
  },
  //生成海报
  async saveToImage(e) {
    //判断用户有没有授权
    let authoriResult = await xcxCommond.handleSetting(this);
    if (authoriResult) {
      return
    }
    let userInfo = this.data.firstinfo;
    if (!userInfo.id) {
      wx.showModal({
        title: '提示',
        content: '创建名片后才能分享朋友圈哦',
        confirmText: '创建名片',
        cancelText: '暂不创建',
        cancelColor: '#999999',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/editCard/pages/create-card/create-card?createtab=0',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    if (!this.data.qrcodeUrl) {
      wx.showModal({
        title: '提示',
        content: '获取小程序二维码失败',
      })
      return
    }
    if (!this.data.form) {
      wx.showToast({
        title: '请前往搜好货网补充公司信息',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!this.data.canSave) {
      return
    } else {
      wx.showLoading({
        title: '正在生成图片',
        mask: true
      })
    }
    this.setData({
      canSave: false
    })
    const userInfoObj = {
      userName: userInfo.name,
      userOccupation: userInfo.position,
      userCompany: userInfo.companyName,
      userTelephone: userInfo.mobile,
      userEmail: userInfo.mail,
      avatarPath: userInfo.avatarPath
    };
    let form = this.data.form;
    const introduction = {
      profileTitle: '企业の简介',
      profileTip: 'BRIEF INTRODUCTION',
      profileContent: form.shortCut || '请填写贵公司的公司概况、主营产品、品牌、服务等内容。详细的介绍更易使买家产生信任感，建立企业形象，仔细地填写将达到事半功倍的效果哦～',
      styleTitle: '企业の风采',
      styleEnglish: 'ELEGANT DEMEANO',
      styleUrl: this.data.imageArrs[this.data.current] || 'https://img0.912688.com/mc-business-card-bg11.png'
    }
    //创建绘图上下文对象
    let ctx = wx.createCanvasContext('customCanvas');
    //完成名片canvas制作
    const { rpx } = await toCardPoster.enterpriseMarketing1(this, ctx, this.data.cardImageSrc, introduction, this.data.qrcodeUrl);
    await toCardPoster[this.data.toCanvasMethodName](ctx, rpx, userInfoObj);
    // ctx.draw();
    //canvas导出为图片
    ctx.draw(true, ()=>{
      toCardPoster.canvasToImageIntro1(this);
    });
  },
  shareToFriend() {
    this.saveToImage();
  },
  //点击切换编辑页面
  checkoutedit() {
    wx.navigateTo({
      url: '../company-edit/company-edit?id=' + this.data.id
    })
  },
  //上一张
  prevImg() {
    var currents = this.data.current;
    currents = currents > 0 ? currents - 1 : this.data.imageArrs.length - 1;
    this.setData({current:currents})
  },
  //下一张
  nextImg() {
    var currents = this.data.current;
    currents = currents < (this.data.imageArrs.length - 1) ? currents +1 : 0;
    this.setData({ current: currents})
  },
  // 预览图片
  previewIamge(event) {
    const nowIndex = event.currentTarget.dataset.id;
    const images = this.data.imageArrs;
    wx.previewImage({
      current: images[nowIndex], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  //滑动改变current
  bannerchange(e) {
    this.setData({ current:e.detail.current})
  },
  async getCarteInfo(carteId) {
    let response = await api.carte_info({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        id: carteId
      }
    })
    return response
  },
  async authorizated() {
    let response = await new Promise((resolve, reject) => {
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
                console.log(res);
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
  toMyCard(){
    wx.switchTab({
      url: '/pages/index',
    })
  },
  toMarketing(){
    wx.switchTab({
      url: '/pages/marketing/marketing',
    })
  },
  async cardInit(){
    // if (!wx.getStorageSync('cookie')) {
    //   let res = await api.wxlogin();
    // }
    this.getcardInfor('true');
  },
  async getcardInfor(mycardFlag) {
    let response = await api.getcardInfor({
      headers:{
        'content-type':'application/json'
      }
    });
    let cardStatus = '', acceptUserId = this.data.acceptUserId;
    if (response.data.success) {
      if(response.data.data.id == this.data.id){
        cardStatus = 0
      }else{
        cardStatus = 2;
      }
      this.data.unLogin = false;
      acceptUserId = response.data.data.userId;
      wx.setStorageSync('userInfoObj', response.data.data);
    } else if (response.data.code == '0005'){
      cardStatus = 1;
      this.data.unLogin = true;
    }else {
      cardStatus = 1;
    }
    this.setData({
      cardStatus,
      acceptUserId
    })
    api.viewCompany({
      query: {
        acceptUserId: this.data.userId,
        launchUserId: this.data.acceptUserId
      }
    })
  },
  //更新名片
  updateCardBg(id, cardTemplateList) {
    let idx = this.contains(cardTemplateList, id, 'id');
    let viewCode = cardTemplateList[idx].viewCode;
    let cardClassName = cardTemplateList[idx].carteClassName;
    let cardImageSrc = cardTemplateList[idx].bigPicPath;
    let toCanvasMethodName = cardTemplateList[idx].poster;
    this.setData({
      cardClassName,
      cardImageSrc,
      toCanvasMethodName
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
  //获取企业信息
  async getCompanyInfo(userId){
    let response = await api.comMarketInfo({
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      query: {
        templateId: 1,
        userId: userId
      }
    })
    return response
  },
  //生成用户二维码
  async generateQRcode(userInfoObj) {
    let response = await api.mini_qr({
      query: {
        scene: this.data.firstinfo.id + '-' + this.data.firstinfo.userId,
        page: 'pages/marketing/company-marketing/company-marketingfirst/company-marketingfirst'
      },
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8:' // 默认值
      },
    })
    if(response.data.success){
      this.setData({
        qrcodeUrl: response.data.data
      })
    }
  },
  onLoad: function(options) {
    // options.scene = "1-1";
    // options.id = '4478';
    // options.userId = '7001';
    let id,userId;
    if (options && options.id && options.userId){
      id = options.id;
      userId = options.userId;
    } else if (options && options.scene){
      let params = options.scene.split('-');
      id = params[0];
      userId = params[1];
    }
    //扫码或者他人分享进入带用户id
    if(id){
      this.data.id = id;
      this.data.userId = userId;
      //获取名片信息
      new Promise((resolve,reject)=>{
        resolve(this.getCarteInfo(parseInt(id)));
      })
      .then((res)=>{
        if(res.data.success){
          this.setData({
            firstinfo: res.data.data,
            shareId: id,
            launchUserId: res.data.data.userId
          })
          new Promise((resolve, reject) => {
            let response = api.getCardTemplate({}, api.getCardTemplate);
            resolve(response)
          }).then((res) => {
            let resendFlag = true;
            this.updateCardBg(this.data.firstinfo.templateId || 1, res.data.data);
          })
        }else{
          this.setData({
            cardStatus: 1
          })
          return 
        }
        
      })
      //获取企业信息
      new Promise((resolve,reject)=>{
        resolve(this.getCompanyInfo(parseInt(userId)));
      })
      .then((res)=>{
        if(res.data.success){
          var banner = res.data.data.banner.split(",");
          var imageArrs = [];
          banner.forEach((item, index, array) => {
            imageArrs.push(item);
          })
          this.setData({
            form: res.data.data,
            imageArrs
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: '网络异常',
          })
        }
      })
      //获取名片模板
      new Promise((resolve, reject) => {
        let response = this.authorizated();
        resolve(response)
      })
      .then((res) => {
        if (res.data.success) {
          this.cardInit();
        } else {
          this.setData({
            cardStatus: 1
          })
        }
      })
    }else{
      this.setData({
        cardStatus: 0
      })
      this.markCominfo();
    } 
  },
  async markCominfo(){
    let res = await api.markCominfo({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        id: 1
      }
    })
    if (res.data.success) {
      var data = res.data.data;
      if (res.data.data.banner) {
        var banner = res.data.data.banner.split(",");
        var imageArrs = [];
        banner.forEach((item, index, array) => {
          imageArrs.push(item);
        })
        this.setData({ imageArrs })
      }
      this.setData({
        form: data
      })
      wx.setStorageSync('company1', data)
    } else {
      wx.showToast({
        icon: 'none',
        title: '网络异常',
      })
    }
  },
  onShow() {
    var company1change = wx.getStorageSync("company1change");
    if(company1change) {
      this.onLoad()
    } 
    wx.removeStorageSync("company1change");
    if(!this.data.shareId){
      var info = wx.getStorageSync('userInfoObj');
      this.setData({
        firstinfo: info
      });
      this.generateQRcode();
      var user = wx.getStorageSync('BgSelection');
      this.setData({
        cardClassName: user.cardClassName,
        cardImageSrc: user.cardImageSrc,
        toCanvasMethodName: user.toCanvasMethodName
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '您好！我们是' + this.data.firstinfo.companyName + '，期待与您的合作！',
        path: '/pages/marketing/company-marketing/company-marketingfirst/company-marketingfirst?id=' + this.data.firstinfo.id + '&userId=' + this.data.firstinfo.userId,
        imageUrl: 'https://img0.912688.com/mc-enterprise-share-bg1.jpg'
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