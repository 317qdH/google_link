// pages/marketing/commodity-detail.js
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
    imgUrls: [
      'https://img0.912688.com/mc-paper-card1.jpg',
      'https://img0.912688.com/mc-paper-card2.jpg'
    ],
    //产品参数悬浮框
    productParamFlag:0,
    //选择产品规格
    specificationFlag:false,
    //发送低价成功
    sendPriceFlag: false,
    //商品信息对象
    productDetailObj:{},
    //html模板名
    hotParseName: 'hotParse1',
    //html内容
    hotParse: '',
    //产品参数数组
    attrValueList:[],
    //产品参数前三条数组
    lessAttrValueList:[],
    //报价方式
    priveWay:0,
    //规格报价
    rangePriceFlag:false,
    //选择商品类别
    spec1Name:'',
    //面议 产品规格对象
    negotiableList:[],
    //用户信息
    userInfoObj:{},
    //采购数量
    purchaseNumber:10,
    //商品详情canvas对象
    goodsDetailObj:{},
    //商品图片索引
    productImgIdx:0,
    cardStatus:2,
    //快速
    canSave:true,
    //被分享的人有没有名片
    hasCard:false,
    //小程序二维码
    qrcodeUrl:'',
    id:'',
    //授权窗口是否显示
    authorShowFlag: false,
    //分享者userid
    launchUserId: '',
    //接受者userid
    acceptUserId: '',
    unLogin:false
  },
  //查看规格及数量
  checkProduct(e) {
    let idx = e.currentTarget.dataset.idx
    this.setData({
      productParamFlag: idx
    })
  },
  comfirmProduct() {
    this.setData({
      productParamFlag: false,
      sendPriceFlag:false
    })
  },
  selectSpecification(e){
    let spec1Name = e.currentTarget.dataset.spec1name;
    this.setData({
      spec1Name
    })
  },
  //增加采购数量
  addNumber(e){
    let purchaseNumber = this.data.purchaseNumber;
    ++purchaseNumber
    this.setData({
      purchaseNumber
    })
  },
  //减少采购数量
  minusNumber(){
    let purchaseNumber = this.data.purchaseNumber;
    if (purchaseNumber >1){
      --purchaseNumber
      this.setData({
        purchaseNumber
      })
    }
  },
  //监听键盘输入
  inputNumber(e){
    var purchaseNumber = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      purchaseNumber
    });
  },
  closeMask(){
    this.setData({
      productParamFlag:0
    })
  },
  async sendPrice(e){
    // this.setData({
    //   sendPriceFlag: true
    // })
    let mobileTest = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    let phoneTest = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    if (!e.detail.value.buyNum){
      wx.showModal({
        title: '提示',
        content: '请输入采购数量',
      })
      return false
    } else if (!e.detail.value.buyerName){
      wx.showModal({
        title: '提示',
        content: '请输入联系信息',
      })
      return false
    } else if (!e.detail.value.buyerMobile){
      wx.showModal({
        title: '提示',
        content: '请输入手机号码',
      })
      return false
    }
    if (!mobileTest.test(e.detail.value.buyerMobile) && !phoneTest.test(e.detail.value.buyerMobile)){
      wx.showModal({
        title: '提示',
        content: '请输入正确格式的手机号码',
      })
      return false
    }
    let sendPriceObj = {}
    sendPriceObj.buyNum = e.detail.value.buyNum;
    sendPriceObj.buyerName = e.detail.value.buyerName;
    sendPriceObj.buyerMobile = e.detail.value.buyerMobile;
    sendPriceObj.buyerComp = e.detail.value.buyerComp;
    sendPriceObj.remark = e.detail.value.remark;
    sendPriceObj.prodId = this.data.productDetailObj.product.id;
    sendPriceObj.prodName = this.data.productDetailObj.product.categoryName;
    sendPriceObj.compId = this.data.productDetailObj.company.id;
    sendPriceObj.unit = '个';
    // sendPriceObj.unit = e.detail.value.unit;
    let response = await api.goodsSendPrice({
      query: sendPriceObj
    })
    if (response.data.success){
      this.setData({
        sendPriceFlag:true
      })
    }
  },
  async getProductDetail(prodId) {
    let response = await api.getProddetail({
      query: {
        prodId: prodId
      }
    })
    let productDetailObj = response.data.data;
    let hotParse = productDetailObj.product.productDetail
    let attrValueList = productDetailObj.product.attrValueList
    let lessAttrValueList = []
    if (attrValueList.length >= 3) {
      lessAttrValueList = attrValueList.slice(0, 3);
    }

    //规格
    let priceList = response.data.data.product.priceList;
    let spec1Name = productDetailObj.spec1List[0];
    this.setData({
      productDetailObj,
      hotParse,
      attrValueList,
      lessAttrValueList,
      spec1Name
    })
    const priceWay = Number.parseInt(productDetailObj.product.priceWay); 
    let priceRange = productDetailObj.product.priceRangeList;
    let priceObj = {};
    let negotiableList = productDetailObj.product.priceList
    switch (priceWay) {
      case 1:
        // priceObj = productDetailObj.product.minPrice
        break;
      case 2:
        this.setData({
          rangePriceFlag: true
        })
        break;
      case 3:
        break;
      default:
    }
    if (negotiableList[0].specName1 && negotiableList[0].specName2 && negotiableList[0].specName1 != 'undefined' && negotiableList[0].specName2 != 'undefined'){
      this.setData({
        rangePriceFlag: true
      })
    } else{
      negotiableList.forEach(function(item,index,array){
        item.specValue1 = item.specValue1 ||'无规格'
        if(item.sPrice == "0.00"){
          item.sPrice = '面议'
        } 
      })
      this.setData({
        rangePriceFlag: false
      })
    }
    //canvas产品详情对象
    let goodsDetailObj = {
      url: productDetailObj.product.imgs[this.data.productImgIdx],
      title: productDetailObj.product.productName,
      tip: productDetailObj.title,
      address: productDetailObj.company.addrDetail,
      totalNumber: productDetailObj.product.supplyNum+'个',
      beginNumber: '≥'+productDetailObj.product.minOrderNum+'个',
      minPrice: productDetailObj.product.minPrice,
      userUrl: this.data.userInfoObj.avatarPath,
      userName: this.data.userInfoObj.name,
      posterUrl: 'https://img0.912688.com/mc-product-detail-bg1.jpg',
      canvasReady:true
    }
    this.setData({
      negotiableList,
      priceWay,
      goodsDetailObj
    })
  },
  //保存海报
  async saveToImage(e) {
    let authoriResult = await xcxCommond.handleSetting(this);
    if (authoriResult) {
      return
    }
    if (!this.data.userInfoObj.id) {
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
    //创建绘图上下文对象
    let ctx = wx.createCanvasContext('customCanvas');
    //完成名片canvas制作
    await toCardPoster.productDetail(this, ctx, this.data.goodsDetailObj, this.data.qrcodeUrl);
    // ctx.draw();
    //canvas导出为图片
    await ctx.draw(false);
    setTimeout(() => {
      toCardPoster.canvasToImage(this);
    }, 200)
    // ctx.draw(true, toCardPoster.canvasToImage(this));
  },
  contactMerchant(e){
    let idx = e.currentTarget.dataset.idx;
    this.setData({
      productParamFlag:4
    })
  },
  sharePoster(){
    this.saveToImage();
  },
  async getcardInfor(){
    let response = await api.getcardInfor({
      headers:{
        'content-type':'application/json'
      }
    });
    if(response.data.success){
      let userInfoObj = response.data.data;
      this.setData({
        userInfoObj
      })
    }
    
  },
  //用户点击授权
  async onGotUserInfo(e) {
    if (e.detail.authoriFlag) {
      this.generateQRcode();
      this.getAuthori();
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
  createCard(){
    if(this.data.unLogin){
      this.setData({
        ucInfoAuthShow:true
      })
    } else if(this.data.hasCard){
      wx.switchTab({
        url: '/pages/marketing/marketing',
      })
    }else{
      wx.switchTab({
        url: '/pages/index',
      })
    }
  },
  toMyCard(){
    wx.navigateTo({
      url: '/pages/marketing/company-marketing/company-marketingfirst/company-marketingfirst',
    })
  },
  //用户打电话
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.userInfoObj.mobile //仅为示例，并非真实的电话号码
    })
  },
  //生成用户二维码
  async generateQRcode(userInfoObj) {
    console.log('正在生成图片二维码');
    let response = await api.mini_qr({
      query: {
        scene: this.data.userInfoObj.id + '-' + this.data.prodId,
        page: 'pages/marketing/commodity-detail'
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
      this.data.unLogin = false;
    } else if (!response.data.success && response.data.code == '0002'){
      let res = await api.wxlogin();
      this.generateQRcode();
    } else if (response.data.code == '0005'){
      this.data.unLogin = true;
    }
  },
  /**
   * 生命周期函数--监听页面 加载
   */
  onLoad: function (options) {
    // options.scene ="113-333040368";
    // options.id = '203';
    // options.prodId = '312687294';
    let id, prodId;
    if (options && options.id && options.prodId) {
      id = options.id;
      prodId = options.prodId;
    } else if (options && options.scene) {
      let params = options.scene.split('-');
      id = params[0];
      prodId = params[1];
    } else if (options && options.prodId){
      prodId = options.prodId
    }
    this.setData({
      prodId
    })
    if (id){
      this.getProductDetail(prodId);
      new Promise((resolve, reject) => {
        resolve(this.getCarteInfo(id));
      })
        .then((res) => {
          const localUser = wx.getStorageSync('userInfoObj');
          if (localUser.id == id){
            this.setData({
              userInfoObj: res.data.data,
              prodId,
              cardStatus: 0,
              id:id,
              launchUserId:res.data.data.userId
            })
          }else{
            this.setData({
              userInfoObj: res.data.data,
              prodId,
              cardStatus: 1,
              id: id,
              launchUserId: res.data.data.userId
            })
          }
          this.getAuthori();
          // this.getcardInfor();
        })
    } else if (prodId){
      this.getProductDetail(prodId);
      this.setData({
        cardStatus:0
      })
    }
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
  getAuthori(){
    new Promise((resolve, reject) => {
      let response = this.authorizated();
      resolve(response)
    })
      .then((res) => {
        if (res.data.success) {
          wx.setStorageSync('userInfoObj', res.data.data)
          this.setData({
            acceptUserId: res.data.data.id
          })
          setTimeout(()=>{
            api.viewProduct({
              query: {
                acceptUserId: this.data.launchUserId,
                launchUserId: this.data.acceptUserId
              }
            })
          },1000)
        }
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
    if(!this.data.id){
      const userInfoObj = wx.getStorageSync('userInfoObj');
      this.setData({
        userInfoObj,
      })
      this.generateQRcode();
    }else{
      
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
    let primaryProd = this.data.productDetailObj.majorProd || "主营产品";
    // console.log('Id = ' + this.data.userInfoObj.id+ ' & prodId=' + this.data.prodId )
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '您好！我公司主营' + primaryProd + '，希望您能喜欢！',
        path: '/pages/marketing/commodity-detail?id=' + this.data.userInfoObj.id+ '&prodId=' + this.data.prodId ,
        imageUrl: this.data.productDetailObj.product.imgs[0]
      }
    } else {
      return {
        title: '还在为拓展人脉，发现商机而发愁？快来试试这款小程序吧！',
        path: '/pages/index',
        imageUrl: 'https://img0.912688.com/mc-share-right-corner.jpg'
      }
    }
  },
})