// pages/ai/radar.js
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module';
import api from '../../api/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerMessList:'',
    userInforObj:{},
    nowDate:'',
    pageSize:20,
    pageNum:1,
    total:1,
    hasMore:false
  },
  checkMessageDet(e) {
    console.log(e);
    let launchUserId = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '/pages/message/chat/chat?launchUserId=' + launchUserId,
    })
  },
  //去客户详情
  toCustomerDet(e) {
    let launchUserId = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '/pages/ai/customer-detail?launchUserId=' + launchUserId,
    })
  },
  async getIndexRadarList(pageSize, pageNum) {
    console.log(pageNum)
    let response = await api.indexRadarList({
      query: {
        pageSize: pageSize,
        pageNum: pageNum
      }
    })
    if (response.data.success) {
      let res = response.data.data;
      let customerMessList = [...this.data.customerMessList, ...res.list];
      let nowDate = Date.parse(new Date());
      let pageNum = res.pageNum;
      let total = res.pages;
      let hasMore = total > pageNum?true:false;
      this.setData({
        customerMessList,
        nowDate,
        pageNum,
        total,
        hasMore
      })
    }
  },
  toEdition(){
    wx.navigateTo({
      url: '/pages/editCard/pages/create-card/create-card',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getIndexRadarList(this.data.pageSize,this.data.pageNum);
    this.userInit();
  },
  userInit(){
    let userInforObj = wx.getStorageSync('userInfoObj');
    this.setData({
      userInforObj
    })
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
    if (this.data.hasMore) {
      this.getIndexRadarList(this.data.pageSize, ++this.data.pageNum);
    }
  },  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPageScroll: function (e) {
    var totop = this.selectComponent("#totop");
    totop.carePageScroll(e)
  },
})