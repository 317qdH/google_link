// pages/marketing/enterprise-marketing/enterprise-marketing.js
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime-module';
import api from '../../../api/api';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //h5路径
    src:'',
    //第几套模板
    idx:'',
    //用户id
    userId:'',
    //公司名
    companyName:'',
    // base_path:'http://10.10.7.159:8083',
    base_path:'https://xcx.912688.com',
    acceptUserId:'',
    mcUserId:''
  },
  async getShhId(options){
    const idx = Number.parseInt(options.idx);
    let companyName, userId;
    var userInfoObj = wx.getStorageSync('userInfoObj');
    if (options.userId) {
      companyName = options.companyName;
      userId = options.userId;
    } else {
      let result = await api.userInfo();
      if (result.data.success) {
        userId = result.data.data.userId
        if (userInfoObj.companyName == '公司名称未填写') {
          companyName = userInfoObj.name
        } else {
          companyName = userInfoObj.companyName || userInfoObj.name;
        }

        this.setData({
          mcUserId: result.data.data.id,
          userId
        })
      }
      
    }
    var src = '';
    switch (idx) {
      case 0:
        src = this.data.base_path+'/carte/page/share/scene1?userId=' + userId;
        break;
      case 1:
        src = this.data.base_path +'/carte/page/share/scene2?userId=' + userId;
        break;
      case 2:
        src = this.data.base_path +'/carte/page/share/scene3?userId=' + userId;
        break;
      case 3:
        src = this.data.base_path +'/carte/page/share/scene4?userId=' + userId;
        break;
    }
    // if (userId && wx.getStorageSync('cookie')){
    //   let response = await api.getcardInfor({
    //     headers: {
    //       'content-type': 'application/json'
    //     }
    //   });
    //   if(response.data.success){
    //     this.setData({
    //       mcUserId:response.data.data.id
    //     })
    //   }
    // }
    this.setData({
      src,
      idx,
      userId,
      companyName
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.idx = 0;
    // options.userId = '11362090';
    // options.companyName = '胡一筒有限公司';
    // options.mcUserId = '5668'
    this.getShhId(options);
    if (options.mcUserId){
      this.setData({
        mcUserId: options.mcUserId
      })
      this.getAuthori(options.mcUserId);
    }
  },
  async getAuthori(mcUserId){
    let response = await this.authorizated();
    if (response.data.success) {
      this.setData({
        acceptUserId: response.data.data.id
      })
      let result = await api.viewScene({
        query: {
          acceptUserId: mcUserId,
          launchUserId: this.data.acceptUserId
        }
      })
      //0005 未登录，0002登录过期
    }
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
    console.log(this.data.userId);
    return {
      title: '您好！我们是' + this.data.companyName + '，期待与您的合作！',
      path: 'pages/marketing/enterprise-marketing/enterprise-marketing?idx=' + this.data.idx + '&userId=' + this.data.userId + '&companyName=' + this.data.companyName + '&mcUserId=' + this.data.mcUserId,
      imageUrl: 'https://img0.912688.com/mc-enterprise-share-bg1.jpg'
    }
  }
})