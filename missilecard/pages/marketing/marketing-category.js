// pages/marketing/marketing-category.js
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module';
import api from '../../api/api';
import toCardPoster from '../../utils/to-card-poster';
import xcxCommond from '../../utils/xcxCommond';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //初始化名片样式类
    cardClassName: 'user-card-template1',
    //初始化名片背景src
    cardImageSrc: '/images/business-card-bg1.png',
    toCanvasMethodName:'',
    //营销分类切换标志
    marketingTab: 5,
    //商品列表
    commodityList: [],
    //企业营销图片地址
    enterpriseImgUrl:[
      'http://img1.912688.com/mc-e-m-template1.jpg',
      'http://img1.912688.com/mc-e-m-template2.jpg',
      'http://img1.912688.com/mc-e-m-template3.jpg',
      'http://img1.912688.com/mc-e-m-template4.jpg'
    ],
    //场景营销图片地址
    sceneImgUrl: [
      'http://img0.912688.com/mc-s-m-template1.jpg',
      'http://img0.912688.com/mc-s-m-template2.jpg',
      'http://img0.912688.com/mc-s-m-template3.jpg',
      'http://img0.912688.com/mc-s-m-template4.jpg'
    ],
    //商品列表页码
    pageNum:1,
    //页码总数
    totalPage:0,
    //是否有更多
    hasMore:false,
    //商品地址
    address:'',
    //用户信息
    userInfoObj: {
      name: '名字未填写',
      mobile: '手机号码未填写',
      mail: '邮箱未填写',
      position: '职位信息未填写',
      companyName: '公司名称未填写',
      avatarPath: '/images/cie-avatar.jpg'
    },
    //防止连点
    canSave:true,
    cardStatus:99,
    //本页面的二维码
    qrcodeUrl:'',
    //用户id
    id:'',
    //是否有商品
    haveListTab:2,
    //授权窗口是否显示
    authorShowFlag:false,
    //分享者userid
    launchUserId: '',
    //接受者userid
    acceptUserId: '',
    unLogin: false
  },
  setNavTitle(tab) {
    switch (tab) {
      case 1:
        wx.setNavigationBarTitle({
          title: '企业营销'
        })
        break;
      case 2:
        wx.setNavigationBarTitle({
          title: '场景营销'
        })
        break;
      default:
        wx.setNavigationBarTitle({
          title: '商品营销'
        })
        this.getProductList();
        this.getCardClassName();
        break;
    }
  },
  checkoutcompanyfirst(e) {
    let idx = e.target.dataset.idx;
    switch(idx) {
      case 0:
        wx.navigateTo({
          url: "company-marketing/company-marketingfirst/company-marketingfirst"
        });
        break;
      case 1:
        wx.navigateTo({
          url: "company-marketing/company-marketingtwo/company-marketingtwo"
        });
        break;
      case 2:
        wx.navigateTo({
          url: "company-marketing/company-marketingthr/company-marketingthr"
        });
        break;
      case 3:
        wx.navigateTo({
          url: "company-marketing/company-marketingfour/company-marketingfour"
        });
        break;
    }

  },
  //选择场景营销H5
  checkMarketing(e){
    let idx = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: 'enterprise-marketing/enterprise-marketing?idx='+idx,
    })   
  },
  //获取产品列表
  async getProductList(pageNum){
    let params = {
      page:'20',
      pageNum: pageNum || this.data.pageNum
    };
    let response = await api.getProdList({
      query:params,
      
    });
    if (!response.data.success){
      return
    }
    pageNum = response.data.data.pageInfo.pageNum
    let totalPage = response.data.data.pageInfo.totalPage;
    if (response.data.data.pageInfo.records.length<1){
      this.setData({
        haveListTab:0
      })
      return
    }
    let commodityList = [...this.data.commodityList,...response.data.data.pageInfo.records];
    let hasMore = (totalPage>pageNum)?true:false;
    this.setData({
      totalPage,
      pageNum,
      hasMore,
      haveListTab:1,
      commodityList: commodityList,
      address:response.data.data.address
    })
  },
  getCardClassName(){
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
  imgUrlTotem(prodPic,callback){
    
  },
  //保存海报
  async saveToImage(e) {
    let authoriResult = await xcxCommond.handleSetting(this);
    if (authoriResult) {
      return
    }
    //判断用户有没有名片
    let userInfo = this.data.userInfoObj;
    if(!userInfo.id){
      wx.showModal({
        title: '提示',
        content: '创建名片后才能分享朋友圈哦',
        confirmText:'创建名片',
        cancelText:'暂不创建',
        cancelColor:'#999999',
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
        title: '异常',
        content: '获取小程序二维码失败',
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
    let commodityList = this.data.commodityList;
    let userInfoObj = {
      userName: userInfo.name,
      userOccupation: userInfo.position,
      userCompany: userInfo.companyName,
      userTelephone: userInfo.mobile,
      userEmail: userInfo.mail,
      avatarPath: userInfo.avatarPath
    };
    let goodsDetail = [];
    let companyList = commodityList;
    if (commodityList.length == 1){
      commodityList.push(commodityList[0]);
      commodityList.push(commodityList[0]);
    } else if (commodityList.length == 2){
      commodityList.push(commodityList[0]);
    }else if (commodityList.length>3){
      companyList = commodityList.slice(0, 3)
    }
    for (let i = 0; i < companyList.length;i++){
      var emptyList = {};
      await new Promise((resolve,reject)=>{
        wx.getImageInfo({
          src: companyList[i].prodPic,
          success: (res) => {
            emptyList.url = res.path;
            resolve();
          },
          fail: (e) => {
            wx.showToast({
              title: '生成图片失败',
            })
            reject();
          }
        })
      })
      emptyList.title = companyList[i].prodName;
      emptyList.companyName = companyList[i].compName;
      emptyList.address = this.data.address;
      emptyList.price = companyList[i].minPrice;
      emptyList.iconUrl = '/images/mc-commodity-address.png';
      goodsDetail.push(emptyList);
    }
    //创建绘图上下文对象
    let ctx = wx.createCanvasContext('customCanvas');
    //完成名片canvas制作
    const { rpx } = await toCardPoster.productMarketing1(this, ctx, this.data.cardImageSrc, goodsDetail, this.data.qrcodeUrl);
    await toCardPoster[this.data.toCanvasMethodName](ctx, rpx, userInfoObj);
    // await toCardPoster.cardPoster17(ctx, rpx, userInfoObj);
    // ctx.draw();
    //canvas导出为图片
    ctx.draw(false, ()=>{
      toCardPoster.canvasToImageIntro1(this);
    });
  },
  savePoster(e){
    this.saveToImage();
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
  createCard() {
    if (this.data.unLogin) {
      this.setData({
        ucInfoAuthShow: true
      })
    } else{
      wx.switchTab({
        url: '/pages/index',
      })
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
  async cardInit() {
    // if (!wx.getStorageSync('cookie')) {
    //   let res = await api.wxlogin();
    // }
    this.getcardInfor('true');
  },
  //用户点击授权
  async onGotUserInfo(e) {
    if (e.detail.authoriFlag) {
      this.getcardInfor();
      this.setData({
        ucInfoAuthShow: false
      })
    } else {
      this.setData({
        ucInfoAuthShow: false
      })
      return
    }
  },
  async getcardInfor(mycardFlag) {
    let response = await api.getcardInfor({
      headers:{
        'content-type':'application/json'
      }
    });
    let cardStatus = '', acceptUserId = this.data.acceptUserId;
    if (response.data.success) {
      if (this.data.id == response.data.data.id){
        cardStatus = 0;
      }else{
        cardStatus = 2;
      }
      wx.setStorageSync('userInfoObj', response.data.data);
      wx.setStorage({
        key: 'userInfoObj',
        data: response.data.data,
        success:(res)=>{
          console.log(res)
        }
      })
      acceptUserId = response.data.data.userId
      this.data.unLogin = false;
    } else if (response.data.code == '0005'){
      cardStatus = 1;
      this.data.unLogin = true;
    } else {
      cardStatus = 1;
    }
    this.setData({
      cardStatus,
      acceptUserId 
    })
    this.generateQRcode();
    api.viewProduct({
      query: {
        acceptUserId: this.data.launchUserId,
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
  async getDetailInfo(userId) {
    wx.showLoading();
    let response = await api.shopPdList({
      method: 'post',
      headers:{
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      query:{
        userId: userId
      }
    })
    wx.hideLoading();
    return response
  },
  toProductDetail(e){
    let prodId = e.currentTarget.dataset.prodid;
    if (this.data.id){
      wx.navigateTo({
        url: '/pages/marketing/commodity-detail?prodId=' + prodId + '&id=' + this.data.id,
      })
      
    }else{
      wx.navigateTo({
        url: '/pages/marketing/commodity-detail?prodId=' + prodId,
      })
    }
    
  },
  //生成用户二维码
  async generateQRcode(userInfoObj) {
    let response = await api.mini_qr({
      query: {
        scene: this.data.userInfoObj.id + '-' + this.data.userInfoObj.userId,
        page: 'pages/marketing/marketing-category'
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
  //获取用户信息userId是搜好货账号id
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
  async h5EnterInit(){
    let response = await this.authorizated();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // options.scene = "1";
    // options.scene="1-1";
    // options.id = "182";
    // options.userId = "93";
    let id, userId;
    if (options && options.id && options.userId) {
      id = options.id;
      userId = options.userId;
      this.data.id = id;
    } else if (options && options.scene) {
      let params = options.scene.split('-');
      // if(params[0] == 1){
      //   let marketingTab = params[0];
      //   this.setNavTitle(Number.parseInt(marketingTab))
      //   // this.setData({
      //   //   marketingTab
      //   // })
      //   this.h5EnterInit();
      // }else{
      //   id = params[0];
      //   userId = params[1];
      //   this.setData({
      //     id
      //   })
      // }
      id = params[0];
      userId = params[1];
      this.data.id = id;
    }
    if(userId){
      this.shareShopListInit(id,userId);
    }else{
      let marketingTab = options.marketingTab || this.data.marketingTab;
      this.setNavTitle(Number.parseInt(marketingTab))
      this.setData({
        marketingTab
      })
    }
    
  },
  async shareShopListInit(id, userId){
    let res = await api.carte_info({
      headers:{
        'content-type':'application/json'
      },
      query:{
        id: parseInt(id)
      }
    })
    // if (!res.data.success && res.data.code == '0002') {
    //   await api.wxlogin();
    //   res = await api.carte_info({
    //     query: {
    //       id: parseInt(id)
    //     }
    //   })
    // } else 
    if (res.data.success){
      this.setData({
        userInfoObj: res.data.data,
        launchUserId: res.data.data.userId
      })
      let res2 = await api.getCardTemplate();
      let resendFlag = true;
      this.updateCardBg(this.data.userInfoObj.templateId || 1, res2.data.data);
      let res3 = await this.getDetailInfo(parseInt(userId));
      this.setData({
        commodityList: res3.data.data.pageInfo.records,
        address: res3.data.data.address,
        haveListTab: 1
      })
      let re4 = await this.authorizated();
      if (re4.data.success) {
        this.setData({
          acceptUserId: re4.data.data.id
        })
        this.setData({
          cardStatus: 2,
        })
        this.cardInit();
      } else {
        this.setData({
          cardStatus: 1
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!this.data.id && this.data.marketingTab != 1 && this.data.marketingTab != 2){
      wx.getStorage({
        key: 'userInfoObj',
        success: (res) => {
          this.setData({
            userInfoObj: res.data,
            cardStatus:0
          })
          this.generateQRcode();
        },
      })
      // this.setData({
      //   commodityList:[]
      // })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if(this.data.hasMore){
      this.getProductList(++this.data.pageNum)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    console.log('/pages/marketing/marketing-category?id=' + this.data.userInfoObj.id+'&userId='+this.data.userInfoObj.userId)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '你感兴趣的好货都在这里！',
        path: '/pages/marketing/marketing-category?id=' + this.data.userInfoObj.id+'&userId='+this.data.userInfoObj.userId,
        imageUrl: 'https://img0.912688.com/mc-enterprise-share-bg2.jpg'
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