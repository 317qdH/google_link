// pages/message/message-list.js
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module'
import api from '../../api/api';
import userUpdate from '../../utils/xcxCommond';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowDate : 0,
    dataTime1: 1569406412000,
    dataTime2: 1569374968000,
    dataTime3: 1569364168000,
    dataTime4: 1569277768000,
    dataTime5: 1566772168000,
    dataTime6: 1440368968000,
    hasmessage:99,
    hasOrderFlag:99,
    ucInfoAuthShow:false,
    messageList:[],
    someData: {
      statusBarHeight: app.globalData.statusBarHeight,
      titleBarHeight: app.globalData.titleBarHeight
    }
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
    if(wx.getStorageSync('cookie')){
      this.getMsgList();
      //获取待办事项
      this.getWaitMessage();
      // let allmessage = this.data.messageList
      // let msgListlong = 0

      // for(let i = 0 ; i<allmessage.length ; i++) {
      //   msgListlong += allmessage[i].notReadAmount
      // }
      // if(msgListlong>0) {
      //   wx.setTabBarBadge({
      //     index: 2,
      //     text: msgListlong + ''
      //   })
      // }else {
      //   wx.removeTabBarBadge({
      //     index: 2
      //   })
      // }
    }else {
      this.setData({
        hasmessage: 3
      })
    }
    if (wx.getStorageSync('isOrder')){
      this.setData({
        hasOrderFlag:1
      })
    }
    this.getDateNow()



  },

  // 判断页面徽章
  async getWaitMessage() {
    let response = await api.waitMessage();
    if (response.data.success) {
      this.setData({
        notReadAmount: response.data.data.notReadAmount
      })
      if (response.data.data.notReadAmount == 0) {
        wx.removeTabBarBadge({
          index: 2
        })
      } else if (response.data.data.notReadAmount>=100){
        wx.setTabBarBadge({
          index: 2,
          text: 99 + '+'
        })
      }else {
        wx.setTabBarBadge({
          index: 2,
          text: this.data.notReadAmount + ''
        })
      }
    }
  },

  // 获取当前时间
  getDateNow () {
    let nowDate = Date.parse(new Date())
    this.setData({
      nowDate
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
    this.getMsgList(true)
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 0)
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

  },

  // 点击登录
  userAuthorized() {
    wx.hideTabBar();
    this.setData({
      ucInfoAuthShow:true
    })
  },

  // 点击订阅
  messageDy(e) {
    wx.requestSubscribeMessage({
      tmplIds: ['MOWqAtWwez6nEhP0TVxs7Xg_SDMEGGp8VSJlwjeL19o'],
      success:(res)=> {
        if (res.errMsg == 'requestSubscribeMessage:ok'){
          wx.setStorage({
            key: 'isOrder',
            data: 'true',
          })
          this.setData({
            hasOrderFlag:1
          })
        }else{
          wx.removeStorage({
            key: 'isOrder',
            success: function(res) {},
          })
          this.setData({
            hasOrderFlag: 0
          })
        }
      },
      fail(e) {
        console.log(e)
      }
    })
  },

  //用户点击授权
  async onGotUserInfo(e) {
    if (e.detail.authoriFlag) {
      wx.showTabBar();
      wx.setStorage({
        key: 'indexIsInit',
        data: '1',
      })
      this.setData({
        authoriFlag: true,
      })
      wx.showTabBar();
      this.getMsgList();
    } else {
      return
    }

  },

  // 获取消息列表数据
  


  // 获取数据
  async getMsgList() {
    let res = await api.messageList()
    if(res.data.code == '0002'){
      this.setData({
        hasmessage:3
      })
    } 
    else if (res.data.code == '0000') {
      let nowDate = Date.parse(new Date())
      let hasmessage = res.data.data.length == 0 ? 2 : 1;
      let newMessageList = JSON.stringify(res.data.data);
      if(this.data.messageList.length == res.data.data.length){
        let list = userUpdate.checkListIsChange(this.data.messageList, res.data.data);
        list.forEach((item, index) => {
          this.setData({
            ["messageList[" + item + "]"]: JSON.parse(newMessageList)[item]
          })
        })
        this.setData({
          nowDate,
          hasmessage
        })
      }
     else if (!this.data.messageList || res.data.data.length != this.data.messageList.length){
        let nowDate = Date.parse(new Date())
        let hasmessage = res.data.data.length == 0 ? 2 : 1;
        this.setData({
          nowDate,
          messageList: res.data.data,
          hasmessage: hasmessage
        })
      }
    }
    else {
      this.setData({
        hasmessage: 2
      })
      // wx.showToast({
      //   title: '网络错误',
      //   icon: 'none',
      //   duration: 2000
      // })
    }    
  }
})