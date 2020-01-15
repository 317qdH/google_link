var app = getApp();
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime-module';
import toCardPoster from '../../../../utils/to-card-poster';
import api from '../../../../api/api';
import xcxCommond from '../../../../utils/xcxCommond';
Page({
  data: {
    twoinfo: '',
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
    current: 0,
    form: '',
    canSave:true,
    id: 2,
    cardStatus:8,
    //当前页面的二维码
    qrcodeUrl: '',
    //分享者的名片id
    shareId:'',
    //授权窗口是否显示
    authorShowFlag: false,
    //分享者userid
    launchUserId: '',
    //接受者userid
    acceptUserId: '',
    ucInfoAuthShow:false,
    unLogin: false
  },
  shareToFriend(){
    this.saveToImage();
  },
  //保存海报
  async saveToImage(e) {
    //判断用户有没有授权
    let authoriResult = await xcxCommond.handleSetting(this);
    if (authoriResult) {
      return
    }
    let userInfo = this.data.twoinfo;
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
    const introduction = {
      profileTitle: '企业の简介',
      profileTip: 'BRIEF INTRODUCTION',
      profileContent: this.data.form.shortCut || '请填写贵公司的公司概况、主营产品、品牌、服务等内容。详细的介绍更易使买家产生信任感，建立企业形象，仔细地填写将达到事半功倍的效果哦～',
      styleTitle: '企业の风采',
      styleEnglish: 'ELEGANT DEMEANO',
      styleUrl: this.data.imageArrs[this.data.current] || 'https://img0.912688.com/mc-business-card-bg11.png',
    }
    //创建绘图上下文对象
    let ctx = wx.createCanvasContext('customCanvas');
    //完成名片canvas制作
    await toCardPoster.enterpriseMarketing2(this, ctx, userInfoObj, introduction, this.data.qrcodeUrl);
    // ctx.draw();
    //canvas导出为图片
    ctx.draw(false, ()=>{
      toCardPoster.canvasToImage(this);
    });
  },
  async getCanvasTemplate() {
    let res = await new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'BgSelection',
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
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
  //上一张
  prevImg() {
    var currents = this.data.current;
    currents = currents > 0 ? currents - 1 : this.data.imageArrs.length - 1;
    this.setData({ current: currents })
  },
  //下一张
  nextImg() {
    var currents = this.data.current;
    currents = currents < (this.data.imageArrs.length - 1) ? currents + 1 : 0;
    this.setData({ current: currents })
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
    this.setData({ current: e.detail.current })
  },
  //点击切换编辑页面
  checkoutedit() {
    wx.navigateTo({
      url: '../company-edit/company-edit?id=' + this.data.id
    })
  },
  //根据名片id获取用户信息
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
  async cardInit() {
    // if (!wx.getStorageSync('cookie')) {
    //   let res = await api.wxlogin();
    // }
    this.getcardInfor('true');
  },
  async getcardInfor(mycardFlag) {
    let response = await api.getcardInfor({
      headers: {
        'content-type': 'application/json'
      }
    });
    let cardStatus = '', acceptUserId = this.data.acceptUserId;
    if (response.data.success) {
      if (response.data.data.id == this.data.id) {
        cardStatus = 0
      } else {
        cardStatus = 2;
      }
      this.data.unLogin = false;
      acceptUserId = response.data.data.userId;
      wx.setStorageSync('userInfoObj', response.data.data);
    } else if (response.data.code == '0005') {
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
  //回首页创建名片
  createCard() {
    if (this.data.unLogin) {
      this.setData({
        ucInfoAuthShow: true
      })
    } else {
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
  toMyCard() {
    wx.switchTab({
      url: '/pages/index',
    })
  },
  toMarketing() {
    wx.switchTab({
      url: '/pages/marketing/marketing',
    })
  },
  //获取企业信息
  async getCompanyInfo(userId) {
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
  async generateQRcode(userInfoObj) {
    let response = await api.mini_qr({
      query: {
        scene: this.data.twoinfo.id + '-' + this.data.twoinfo.userId,
        page: 'pages/marketing/company-marketing/company-marketingtwo/company-marketingtwo'
      },
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8:' // 默认值
      },
    })
    if (response.data.success) {
      this.setData({
        qrcodeUrl: response.data.data
      })
    }
  },
  onLoad(options) {
    // options.scene="1-1";
    // options.id = '97';
    // options.userId = '66';
    let id, userId = '';
    if (options && options.id && options.userId) {
      id = options.id;
      userId = options.userId;
    } else if (options && options.scene) {
      let params = options.scene.split('-');
      id = params[0];
      userId = params[1];
    }
    if(id){
      this.setData({
        userId
      })
      new Promise((resolve, reject) => {
        resolve(this.getCarteInfo(parseInt(id)));
      })
      .then((res) => {
        this.setData({
          twoinfo: res.data.data,
          shareId:id,
          launchUserId:res.data.data.userId
        })
      })
      //获取企业信息
      new Promise((resolve, reject) => {
        resolve(this.getCompanyInfo(parseInt(userId)));
      })
        .then((res) => {
          if(res.data.success){
            let banner;
            if (!res.data.data.banner) {
              banner = this.data.imageArrs;
            } else {
              banner = res.data.data.banner.split(",");
            }
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
      new Promise((resolve, reject) => {
        let response = this.authorizated();
        resolve(response)
      })
      .then((res) => {
        if (res.data.success) {
          this.setData({
            acceptUserId: res.data.data.id
          })
          this.cardInit();
        } else {
          this.setData({
            cardStatus: 1
          })
        }
      })
    }else{
      this.markCominfo();
      this.setData({
        cardStatus: 0
      })
    }
    
  },
  async markCominfo() {
    let res = await api.markCominfo({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        id: 2
      }
    })
    if (res.data.success) {
      var data = res.data.data;
      var datas = res.data.data.banner;
      if (datas) {
        var imageArr = datas.split(",");
        var imageArrs = [];
        imageArr.forEach((item, index, array) => {
          imageArrs.push(item);
        })
        this.setData({ imageArrs })
      }
      this.setData({
        form: data
      })
      wx.setStorageSync('company2', data)
    } else {
      wx.showToast({
        icon: 'none',
        title: '网络异常',
      })
    }
  },
  onShow() {
    var company1change = wx.getStorageSync("company1change");
    if (company1change) {
      this.onLoad()
    }
    wx.removeStorageSync("company1change");
    if (!this.data.shareId){
      var info = wx.getStorageSync('userInfoObj');
      this.setData({
        twoinfo: info
      });
      this.generateQRcode();
      var user = wx.getStorageSync('BgSelection');
      this.setData({
        cardClassName: user.cardClassName,
        cardImageSrc: user.cardImageSrc
      })
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '您好！我们是' + this.data.twoinfo.companyName + '，期待与您的合作！',
        path: '/pages/marketing/company-marketing/company-marketingtwo/company-marketingtwo?id=' + this.data.twoinfo.id + '&userId=' + this.data.twoinfo.userId,
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