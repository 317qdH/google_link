// pages/login.js
import regeneratorRuntime from '../utils/regenerator-runtime/runtime-module';
import api from '../api/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfoObj: {
      name: '名字未填写',
      mobile: '手机号码未填写',
      mail: '邮箱未填写',
      position: '职位信息未填写',
      companyName: '公司名称未填写',
      avatarPath: '/images/cie-avatar.jpg',
      templateId: 1
    }
  },
  
  onGotUserInfo(e) {
    // console.log(e);
    if (e.detail.userInfo) {
      let userInfoObj = this.data.userInfoObj
      userInfoObj.name = e.detail.userInfo.nickName;
      userInfoObj.avatarPath = e.detail.userInfo.avatarUrl;
      // console.log(userInfoObj);
      wx.setStorageSync('userInfoObj', userInfoObj);
      wx.switchTab({
        url: './index',
      })

    } else {
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.wxlogin();
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

  }
})