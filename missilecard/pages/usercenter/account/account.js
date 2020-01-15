var app = getApp();
var CryptoJS = require('../../../utils/CryptoJS/CryptoJS');
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime-module';
import api from '../../../api/api';
var interval = null;
Page({
  data: {
    index: 0,
    codetext: '获取验证码',
    currentTime: 61,
    show: false,
    info: '',
    mobile: '',
    code: ''
  },
  //点击切换样式
  changeTabbar(e) {
    this.setData({
      index: e.currentTarget.dataset.id
    });
  },
  changeTabbars(e) {
    this.setData({
      index: e.currentTarget.dataset.id
    });
  },
  //获取验证码
  getCode: function(options) {
    this.setData({
      show: true
    })
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function() {
      currentTime--;
      that.setData({
        codetext: currentTime + 'S',
        currentTime
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          codetext: '重新发送',
          currentTime: 61,
          disabled: false,
          show: false
        })
      }
    }, 1000)
  },
  //监听手机输入事件
  checkiphone(e) {
    this.setData({
      mobile: e.detail.value
    });
  },
  isPoneAvailable: function (pone) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(pone)) {
      return false;
    }
  },
  //获取验证码
  async getVerificationCode() {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!this.data.mobile) {
      wx.showToast({
        title: '手机号不能为空',
        icon:'none'
      })
      return;
    } else if (this.data.mobile.length < 11) {
      wx:wx.showToast({
        title: '手机号长度有误',
        icon: 'none'
      })
      return;
    } else if (!myreg.test(this.data.mobile)) {
      wx:wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return;
    }
    var that = this;
    let res = await api.smsVeriCode({
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      query:{
        mobile: that.data.mobile
      }
    })
    if (res.data.success) {
      this.setData({ code: true })
      this.getCode();
    }
    that.setData({
      disabled: true
    })
  },
  //已有搜好货账号，登录
  getusername(e) {
    this.setData({
      username: e.detail.value
    })
  },
  getcode(e) {
    this.setData({
      havepassword: e.detail.value
    })
  },
  async login() {
    if (!this.data.username) {
      wx.showToast({
        title: '账号不能为空',
        icon: 'none'
      })
      return
    } else if (!this.data.havepassword) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    let result = await api.accountBind({
      query:{
        mobile: this.data.username,
        password: (CryptoJS.MD5(this.data.havepassword) + "").toUpperCase()
      }
    })
    if(result.data.success){
      wx.setStorageSync("havelogin", "havelogin")
      wx.setStorageSync("showtoast", "showtoast")
      app.globalData.isvip = result.data.data.payFlag || result.data.data.probationFlag;
      wx.switchTab({
        url: '/pages/usercenter/usercenter',
      })
    }else{
      wx.showToast({
        title: '账号密码不正确',
        icon: 'none'
      })
      return;
    }
  },

  //注册搜好货账号
  async formSubmit(e) {
    var that = this;
    let cpnameReg = /^[\u4e00-\u9fa5\(\)（）]{2,}$/;
    if (!e.detail.value.companyName) {
      wx.showToast({
        title: '公司信息不能为空',
        icon: 'none'
      })
      return;
    } else if (!cpnameReg.test(e.detail.value.companyName)) {
      wx.showToast({
        title: '公司名称格式不正确',
        icon: 'none'
      })
      return;
    } else if (!e.detail.value.nohavepassword) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    } else if (!e.detail.value.iphone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    } else if (!e.detail.value.message) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none'
      })
      return;
    } 
    let res = await api.registAccount({
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      query: {
        comName: e.detail.value.companyName,
        password: (CryptoJS.MD5(e.detail.value.nohavepassword) + "").toUpperCase(),
        mobile: e.detail.value.iphone,
        messCheckCode: e.detail.value.message
      }
    })
    if (res.data.code == "0001") {
      wx.showModal({
        title: '账号已注册',
        content: '请前往登录',
        confirmColor: "#66a7fe",
        success: res => {
          if (res.confirm) {
            this.setData({
              index: 0,
              code: ''
            })
          } else if (res.cancel) {
            this.setData({
              index: 1,
              code: ''
            })
          }
        }
      })
      return;
    } else if (res.data.code == "0002") {
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none'
      })
    } else if (res.data.success) {
      wx.setStorageSync("havelogin", "havelogin")
      wx.setStorageSync("showtoast", "showtoast")
      wx.switchTab({
        url: '../usercenter'
      })
    } else {
      wx.showToast({
        title: '网络异常'
      })
    }
  },
  onLoad:function(options){
    let index = options.currentTab || 0;
    this.setData({
      index
    })
  }
})