var app = getApp();
import api from '../../../api/api';
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime-module';
Page({
  data: {
    cateItems: '',
    tabId: ''
  },
  //获取行业子类
  switchRightTab: function(e) {
    // console.log(e)
    this.setData({
      tabId: e.currentTarget.dataset.id,
      indexs: e.currentTarget.dataset.id,
      idx: ''
    })
    // console.log(this.data.tabId);
  },
  select(e) {
    // console.log(e);
    this.setData({
      itemId: e.currentTarget.dataset.id,
      idx: e.currentTarget.dataset.id
    })
  },
  async comfirmIndestry() {
    if(!this.data.itemId) {
      wx.showToast({
        title: '请选择行业',
      })
      return
    }
    var that = this;
    let res = await api.clientList({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        categoryId: that.data.itemId
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
  reset(e) {
    this.setData({
      tabId: '',
      indexs: '',
      idx: '',
      itemId: ''
    })
  },
  async categoryNum(){
    let res = await api.categoryNum({
      method: 'POST',
      headers:{
        'content-type': 'application/json',
      }
    })
    this.setData({
      cateItems: res.data.data.carteCategoryParentList,
      cateItemslist: res.data.data.carteCategorySonMap
    })
  },
  onLoad() {
    this.categoryNum();
  }
})