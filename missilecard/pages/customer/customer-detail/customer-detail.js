import api from '../../../api/api';
import toCardPoster from '../../../utils/to-card-poster';
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime-module';
var app = getApp();
Page({
  data: {
    userInfo: '', //用户信息列表
    //初始化名片样式类
    cardClassName: 'user-card-template1',
    //初始化名片背景src
    cardImageSrc: '/images/business-card-bg1.png',
    //名片切换动画对象
    showtag: false, //标签页面
    showremark: false, //备注页面
    tagarr: [], //公共标签数组
    markId: '', //公共标签ID
    id: '',
    addiy: '', //自定义标签
    diymark: '', //备注
    avatar: '/images/cie-avatar.jpg',
    navigatorText:'',
    //用户id
    hasUser:''
  },
  getChat(){
    let myId = wx.getStorageSync('userInfoObj').id;
    if (myId == this.data.userInfo.userId) {
      wx.showToast({
        title: '不能和自己发消息哦～',
        icon: 'none',
        duration: 3000
      })
      return
    }
    wx.navigateTo({
      url: '/pages/message/chat/chat?launchUserId=' + this.data.userInfo.userId + '&acceptUserId=' + myId ,
    })
  },
  //拨打电话
  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.userInfo.mobile
    })
  },
  //点击自定义标签输入框，将常用标签ID置为0，样式还原
  adddiy() {
    this.setData({
      id: '',
      markId: ''
    })
  },

  //打开备注页面
  showremark() {
    this.setData({
      showremark: true,
      proinfoWindow: true
    })
  },

  //关闭备注页面
  closeremark() {
    this.setData({
      showremark: false,
      proinfoWindow: false
    })
  },

  //关闭标签和自定义标签页面
  closetag() {
    this.setData({
      showtag: false,
      id: '',
      proinfoWindow: false
    })
  },

  //打开标签和自定义标签页面
  async requesttag() {
    this.setData({
      showtag: true,
      proinfoWindow: true
    })
    let res = await api.allList({
      method:'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
    })
    if(!res.data.success){return}
    this.setData({
      tagarr: res.data.data
    })
  },

  //点击标签，将自定义标签内容置为空
  clickitem(e) {
    var itemid = e.currentTarget.dataset.id;
    var marks = e.currentTarget.dataset.idx;
    this.setData({
      id: itemid,
      userInfoMark: marks,
      addiy: '',
      remark: this.data.userInforemark
    })

    //点击添加样式
    this.setData({
      markId: itemid
    })
    // console.log(itemid)
  },

  //监听自定义标签的输入，给自定义标签栏赋值，同时将常用标签置为空
  adddiymarket(e) {
    // console.log(e);
    this.setData({
      addiy: e.detail.value,
      id: ''
    })
  },

  //添加或修改标签
  async addremark(e) {
    // console.log(e);
    var that = this;
    let res = await api.clientUpdate({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query:{
        labelId: that.data.markId, //选择的公共标签的id
        id: that.data.optionsIds, //名片编号
        labelCustomize: this.data.addiy,
        remark: that.data.userInforemark
         //自定义标签
      }
    })
    if(!res.data.success){return}
    this.setData({
      showtag: false,
      proinfoWindow: false
    })
    if (this.data.addiy) {
      this.setData({
        userInfoMark: this.data.addiy
      })
    }
    wx.setStorageSync("havechange", "change")
    
  },

  //点击按钮，添加备注
  async formSubmit(e) {
    // console.log(e);
    this.setData({
      userInforemark: e.detail.value.diy
    })
    var that = this;
    let res = await api.clientUpdate({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        labelId: that.data.markId, //选择的公共标签的id
        id: that.data.optionsIds, //名片编号
        labelCustomize: this.data.addiy,
        remark: e.detail.value.diy
      }
    })
    if (!res.data.success) { return }
    this.setData({
      showremark: false,
      proinfoWindow: false,
    })
    wx.setStorageSync("havechange", "change")
    
  },

  //删除好友名片
  delectfriend(e) {
    wx.showModal({
      title: '是否删除好友名片',
      content: '是否删除好友名片',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: api.BASE_PATH + '/carte/client/client_del', // 仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
              carteId: this.data.optionsId
            },
            header: {
              'content-type': 'application/json', // 默认值
              'Cookie': 'JSESSIONID=' + wx.getStorageSync('cookie')
            },
            success: (res) => {
              // console.log(res);
              wx.navigateBack({})
              wx.setStorageSync("havechange", "change");
              wx.removeStorageSync("haveselect");
            },
            fail: (res) => {
              // console.log(res);
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  //切换到客户编辑页面
  changecustomer() {
    wx.navigateTo({
      url: '../../editCard/pages/change-customer/change-customer'
    })
  },

  //保存通讯录
  saveiphone() {
    wx.addPhoneContact({
      firstName: this.data.userInfo.name,
      mobilePhoneNumber: this.data.userInfo.mobile,
      success: function() {
        // console.log('添加成功')
      }
    })
  },
  //生成名片分享图片
  async saveToImage(userInfo) {
    // console.log(userInfo);
    let userInfoObj = {
      userName: userInfo.name,
      userOccupation: userInfo.position,
      userCompany: userInfo.companyName,
      userTelephone: userInfo.mobile,
      userEmail: userInfo.mail,
      avatarPath: userInfo.avatarPath
    };
    // console.log(userInfoObj);
    //创建绘图上下文对象
    let ctx = wx.createCanvasContext('customCanvas');
    //完成名片canvas制作
    const { rpx } = await this.canvasCommon(ctx, this.data.cardImageSrc);
    await toCardPoster.cardPoster1(ctx, rpx, userInfoObj);
    ctx.draw(true, () => {
      this.canvasToImage(this, rpx);
    });
    // ctx.draw(false, toCardPoster.canvasToImage(this));
  },
  async canvasCommon(ctx, cardImageSrc) {
    //当前设备缩放比
    //获取设备的宽度
    let rpx = 1;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res)
        rpx = res.windowWidth / 375;
      },
    })
    rpx = rpx * 1.29;
    const grd = ctx.createLinearGradient(0, 0, 0, 300);
    grd.addColorStop(0, '#66a6ff');
    grd.addColorStop(1, '#74c7f8');
    ctx.setFillStyle(grd);
    ctx.fillRect(0, 0, 375 * rpx, 300 * rpx);
    if (cardImageSrc == '/images/business-card-bg1.png') {
      ctx.drawImage(cardImageSrc, 25 * rpx, 40 * rpx, 249 * rpx, 152 * rpx);
    } else {
      const cardImagePath = await new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: cardImageSrc,
          success: (res) => {
            // console.log(res.path)
            resolve(res.path)
          }
        })
      })
      ctx.drawImage(cardImagePath, 25 * rpx, 40 * rpx, 249 * rpx, 152 * rpx);
    }
    return { rpx }
  },
  canvasToImage(that, rpx) {
    wx.canvasToTempFilePath({
      x: 10 * rpx,
      y: 5.5 * rpx,
      fileType: 'png',
      quality: 1,//图片质量
      canvasId: 'customCanvas',
      success: (res) => {
        // console.log(res.tempFilePath)
        app.globalData.customerShareFilePath = res.tempFilePath;
      }
    }, this)
  },
  async slientSelect(optionsIds){
    let res = await api.clientSelect({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        clientId: optionsIds
      }
    })
    if (!res.data.success) { return }
    let hasUser = false;
    if (res.data.data.userId && res.data.data.id != wx.getStorageSync('userInfoObj').id) {
      hasUser = true;
    }
    this.saveToImage(res.data.data);
    this.setData({
      userInfo: res.data.data,
      userInforemark: res.data.data.remark,
      hasUser
    })
    if (res.data.data.labelCustomize) {
      this.setData({
        userInfoMark: res.data.data.labelCustomize,
      })
    }
    wx.setStorageSync("userchange", res.data.data)
  },
  async slientSelect2(){
    let res = await api.clientSelect({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        clientId: this.data.optionsIds
      }
    })
    if (!res.data.success) { return }
    let hasUser = false;
    if (res.data.data.userId && res.data.data.id != wx.getStorageSync('userInfoObj').id){
      hasUser = true;
    }
    this.saveToImage(res.data.data);
    this.setData({
      userInfo: res.data.data,
      userInforemark: res.data.data.remark,
      hasUser
    })
    if (res.data.data.labelCustomize) {
      this.setData({
        userInfoMark: res.data.data.labelCustomize,
      })
    }
    wx.setStorageSync("userchange", res.data.data)
  },
  //初始化获取客户详情信息
  onLoad: function(options) {
    // console.log(options);
    this.setData({
      optionsId: options.id,
      optionsIds: options.clientId,
      navigatorText: options.name || '搜好货' + "的名片"
    })
    // 将用户id存入缓存，然后在客户编辑页面传给后台
    wx.setStorageSync("userId", options.id);
    var that = this;
    this.slientSelect(options.clientId);
  },

  onShow() {
    var that = this;
    //如果有变化，在进行刷新
    var havechange = wx.getStorageSync("havechange");
    // console.log(havechange);
    if (havechange) {
      this.slientSelect2();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '向您推荐了' + this.data.userInfo.name+'，海内存名片，天涯若比邻！',
        path: '/pages/usercenter/userCard/userCard?id=' + this.data.userInfo.id + '&userId=' + this.data.userInfo.userId + '&saveCardTab=true',
        imageUrl: app.globalData.customerShareFilePath
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