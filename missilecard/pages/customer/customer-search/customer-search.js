var app = getApp();
import api from '../../../api/api';
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime-module';
Page({
  data: {
    tagarray: [], //客户标签数组
    customerList: '',
    havecustomer: '', //搜索到的客户
    searchCon: '', //搜索框value
    labelCustomize: '',//标签名
    labelId: ''//标签ID
  },
  //点击标签给搜索框赋值
  async markchoose(e) {
    // console.log(e);
   if(e.currentTarget.dataset.id) {
     this.setData({ labelId: e.currentTarget.dataset.id})
   } else if (e.currentTarget.dataset.name) {
     this.setData({ labelCustomize: e.currentTarget.dataset.name })
   }
    let res = await api.clientList({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        labelId: this.data.labelId,
        labelCustomize: this.data.labelCustomize
      }
    })
    if (!res.data.success) { return }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      customerarr: res.data.data.list
    })
    wx.setStorageSync("selectcustomer", res.data.data.list)
    wx.setStorageSync("haveselect", "haveselect")
    wx.navigateBack({})
  },
  async clientList(searchCon){
    let res = await api.clientList({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        keyWords: searchCon
      }
    })
    if (!res.data.success) { return }
    this.setData({
      havecustomer: res.data.data.list
    })
    if (res.data.data) {
      wx.setStorageSync("searchresult", this.data.havecustomer)
    } else if (res.data.data.list = '') {
      this.setData({
        havecustomer: ''
      })
    }
  },
  searchinput(e) {
    // console.log(e);
    let searchCon = e.detail.value;
    this.setData({
      searchCon
    })
    if (searchCon.length == 1) {
      this.clientList(searchCon);
    } else if (searchCon.length == 2) {
      let searchre = wx.getStorageSync("searchresult");
      let searchList = [];
      for (let i = 0; i < searchre.length; i++) {
        let n = searchre[i].name.indexOf(searchCon);
        if (n !== -1) {
          searchList.push(searchre[i]);
        }
        // console.log(searchList);
        this.setData({
          havecustomer: searchList
        })
      }
    } else if (searchCon.length == 3) {
      let searchre = wx.getStorageSync("searchresult");
      let searchList = [];
      for (let i = 0; i < searchre.length; i++) {
        let n = searchre[i].name.indexOf(searchCon);
        if (n !== -1) {
          searchList.push(searchre[i]);
        }
        // console.log(searchList);
        this.setData({
          havecustomer: searchList
        })
      }
    } else if (searchCon.length == 0){
      this.setData({
        havecustomer: ''
      })
    }
  },
  //返回
  cancel() {
    wx.navigateBack({})
  },
  //清除搜索框
  cleans() {
    this.setData({ searchCon:''})
    // console.log("1")
  },
  //点击好友切换到详情页面
  choice(e) {
    wx.navigateTo({
      url: '../customer-detail/customer-detail?id=' + e.currentTarget.dataset.id + "&clientId=" + e.currentTarget.dataset.index
    })
  },
  async getAllList(){
    let res = await api.clientAllList({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      }
    })
    if (!res.data.success) { return }
    this.setData({
      tagarray: res.data.data
    })
  },
  onLoad: function(options) {
    //缓存里面取好友列表数据，之后做筛选
    var customerlist = wx.getStorageSync("customerList");
    // console.log(customerlist.length);
    this.getAllList();
  }
})