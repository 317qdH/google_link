import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module';
import api from '../../api/api';
var app = getApp();
Page({
  data: {
    userInfos: {},
    unbindtab: false,
    detail: '立即绑定搜好货信息',
    showtoast: '',
    ahturiFlag:99,
    ucInfoAuthShow:false,
    //用户会员信息
    userCardObj:'',
    havelogin:false,
    isVip:false,
    probationFlag:false,
    payFlag:99
  },
  ucAuthPopupShow(){
    wx.hideTabBar();
    this.setData({
      ucInfoAuthShow: true
    })
  },
  async onGotUserInfo(e) {
    if (e.detail.authoriFlag) {
      wx.showTabBar();
      // var userInfoObj = wx.getStorageSync("userInfoObj");
      // this.setData({
      //   userInfos: userInfoObj,
      //   ahturiFlag: 1
      // });
      let response = await api.getcardInfor({
        headers: {
          'content-type': 'application/json'
        }
      });
      if (response.data.success) {
        this.setData({
          userInfos: response.data.data,
          ahturiFlag: 1
        })
        if (response.data.data.userId){
          this.setData({
            havelogin: true
          })
          wx.setStorage({
            key: 'havelogin',
            data: 'havelogin',
          })
        }
      }
      wx.setStorage({
        key: 'userInfoObj',
        data: response.data.data,
      })
      wx.setStorage({
        key: 'indexIsInit',
        data: '1',
      })
      this.userShowInit();
    }
  },
  //判断是否切换到账号关联页面
  switch () {
    if (!wx.getStorageSync('cookie')) {
      wx.hideTabBar();
      this.setData({
        ucInfoAuthShow: true
      })
      return 
    }
    if (this.data.detail == '立即绑定搜好货信息') {
      wx.navigateTo({
        url: 'account/account'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否取消绑定信息',
        confirmColor:'#66a7fe',
        success: res => {
          //点击取消绑定信息之后，将登录态删除
          if (res.confirm) {
            new Promise((resolve,reject)=>{
              let response = api.unbindShh();
              resolve(response);
            }).then((res)=>{
              if(res.data.success){
                wx.showToast({
                  icon:'success',
                  title: '解绑成功'
                })
                this.setData({ detail: '立即绑定搜好货信息',havelogin:false })
                wx.removeStorageSync("havelogin")
              }
              else{
                wx.showToast({
                  title: '网络异常',
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  switchcard() {
    if (!wx.getStorageSync('cookie')) {
      wx.hideTabBar();
      this.setData({
        ucInfoAuthShow: true
      })
      return
    }
    wx.navigateTo({
      url: '../share-card'
    })
  },
  toCttVip(){
    if (!wx.getStorageSync('cookie')) {
      wx.hideTabBar();
      this.setData({
        ucInfoAuthShow: true
      })
      return
    }
    wx.navigateTo({
      url: '/pages/usercenter/ctt-vip/ctt-vip',
    })
  },
  switchhelp() {
    wx.navigateTo({
      url: 'help/help'
    })
  },
  switchsuggestion() {
    wx.navigateTo({
      url: 'suggestion/suggestion'
    })
  },
  switchabout() {
    wx.navigateTo({
      url: 'about/about'
    })
  },
  checkoutedit() {
    wx.navigateTo({
      url: '/pages/editCard/pages/create-card/create-card'
    })
  },
  //点击回首页
  checkindex() {
    this.setData({ showtoast:''});
    wx.showTabBar();
    wx.removeStorageSync("showtoast");
    wx.switchTab({
      url: '/pages/index'
    })
  },
  //点击去营销页
  checkmarket() {
    this.setData({ showtoast: '' });
    wx.showTabBar();
    wx.removeStorageSync("showtoast")
    wx.switchTab({
      url: '../marketing/marketing'
    })
  },
  //点击空白地方隐藏弹窗
  cancelmask() {
    this.setData({ showtoast: '' });
    wx.showTabBar();
    wx.removeStorageSync("showtoast")
  },
  async userShowInit(){
    let res = await api.companyInfo({
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    })
    if (res.data.data.name) {
      this.setData({
        detail: res.data.data.name
      })
    } else {
      this.setData({
        detail: '立即绑定搜好货信息'
      })
    }
    let response = await api.userInfo();
    let payFlag = response.data.data.payFlag ? 1 : 0;
    let isVip = response.data.data.payFlag || response.data.data.probationFlag;
    app.globalData.isvip = isVip;
    if(response.data.success){
      this.setData({
        userCardObj: response.data.data,
        probationFlag: response.data.data.probationFlag,
        payFlag,
        isVip
      })
    }
  },
  onLoad: function(options) {
    var userInfo = wx.getStorageSync("userInfoObj");
    this.setData({
      userInfoObj: userInfo
    });
  },
  onShow: function(options) {
    if(wx.getStorageSync('cookie')){
      this.setData({
        ahturiFlag:1
      })
    }else{
      this.setData({
        ahturiFlag: 0
      })
    }
    var userInfoObj = wx.getStorageSync("userInfoObj");
    var havelogin = wx.getStorageSync("havelogin");
    this.setData({
      userInfos: userInfoObj,
      havelogin,
      isVip: app.globalData.isvip
    });
    //判断是否有登录状态，如果有，就去拿公司信息
    if (havelogin) {
      this.userShowInit();
    }
    var showtoast = wx.getStorageSync("showtoast");
    if(showtoast) {
      this.setData({ showtoast: true })
      // wx.hideTabBar();
      wx.removeStorageSync("showtoast")
    } else {
      this.setData({ showtoast: false })
      wx.removeStorageSync("showtoast")
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: '还在为拓展人脉，发现商机而发愁？快来试试这款小程序吧！',
      path: '/pages/index',
      imageUrl: 'https://img0.912688.com/mc-share-right-corner.jpg'
    }

  }
})