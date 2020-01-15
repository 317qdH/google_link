const app = getApp();
const util = require('../../utils/throttle.js');
import api from '../../api/api';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module';
Page({
  data: {
    index: 0, //添加字体颜色标志
    dataindex: 0, //时间筛选图片标志
    industryselect: false, //行业筛选
    chooseOne: '/images/time1.png', //初始化时间筛选样式
    industry: '/images/1-offer.png', //初始化行业筛选样式
    customerarr: [],
    customer: false,
    //行业切换显示标识
    industryShowFlag: false,
    avatar: '/images/cie-avatar.jpg',
    //用户授权弹窗
    ucInfoAuthShow:false
  },
  toAiAnalyze(){
    wx.navigateTo({
      url: '/pages/ai/ai-analyze',
    })
  },
  //筛选完，查看所有客户
  async allcustomer(e) {
    this.setData({
      index: 0,
      dataindex: 0,
      chooseOne: '/images/time1.png',
      industry: '/images/1-offer.png'
    });
    let res = await api.clientList({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        order: "modify_time desc"
      }
    })
    if (!res.data.success) { return };
    wx.removeStorageSync("haveselect");
    if (!res.data.data.list) {
      this.setData({
        customerarr: ''
      });
    } else {
      this.setData({
        customerarr: res.data.data.list
      });
    }
  },
  //切换到客户详情页面
  selectcustomer(e) {
    // console.log(e);
    wx.navigateTo({
      url: 'customer-detail/customer-detail?id=' + e.currentTarget.dataset.id + "&clientId=" + e.currentTarget.dataset.index + "&name=" + e.currentTarget.dataset.name
    })
  },
  clearNull(object) {
    if (typeof object == 'object') {
      for (let item in object) {
        if (typeof object[item] == 'string') {
          object[item] = object[item].replace('null', '');
        }

      }
    }
  },
  onGotUserInfo(e) {
    if (e.detail.authoriFlag) {
      wx.showTabBar();
      wx.setStorage({
        key: 'indexIsInit',
        data: '1',
      })
    }
  },
  // 拍照识别名片
  photoAdded() {
    if (wx.getStorageSync('cookie')) {
      wx.navigateTo({
        url: '/pages/camera?createCustomer=1',
      })
    }else{
      wx.hideTabBar();
      this.setData({
        ucInfoAuthShow: true
      })
    }
    
  },
  //跳转搜索框
  changesearch() {
    if (wx.getStorageSync('cookie')) {
      wx.navigateTo({
        url: "customer-search/customer-search"
      })
    } else {
      wx.hideTabBar();
      this.setData({
        ucInfoAuthShow: true
      })
    }
    
  },
  //点击行业筛选，变化字体颜色，图标变色
  changeselect: util.throttle(function (e) {
    wx.removeStorageSync("selectcustomer");
    var that = this;
    var havechange = wx.getStorageSync("havechange");
    this.setData({
      index: e.currentTarget.dataset.id,
      dataindex: 0,
      chooseOne: '/images/time1.png',
      industry: '/images/2-offer.png',
      industryselect: true,
      industryShowFlag: true
    });
    wx.navigateTo({
      url: 'customer-select/customer-select'
    })
  }),

  //点击添加文字颜色
  async changeactive(e) {
    //点击清除筛选完的数组
    wx.removeStorageSync("selectcustomer");
    wx.removeStorageSync("haveselect");
    this.setData({
      index: e.currentTarget.dataset.id,
      dataindex: 0,
      chooseOne: '/images/time1.png',
      industry: '/images/1-offer.png'
    });
    // var havechange = wx.getStorageSync("havechange");
    //如果有改变，再去请求接口，如果没有，就取缓存
    // if (havechange) {
    let res = await api.clientList({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        order: "modify_time desc"
      }
    })
    if (!res.data.success) { return };
    wx.removeStorageSync("haveselect");
    wx.removeStorageSync("havechange");
    if (!res.data.data.list) {
      this.setData({
        customerarr: ''
      });
    } else {
      this.setData({
        customerarr: res.data.data.list
      });
    }
    
  },
  //点击切换排列图片，升序降序
  async changeactives(e) {
    var selectcustomer = wx.getStorageSync("selectcustomer");
    this.setData({
      index: e.currentTarget.dataset.id,
      industry: '/images/1-offer.png'
    });

    if (this.data.dataindex == 0) {
      this.setData({
        dataindex: 1,
        chooseOne: '/images/time3.png'
      });
      //如果有筛选到值，对他进行排序，如果没有的话再去请求接口，可以改成没改变的时候去取缓存
      if (selectcustomer) {
        var selectcustomer = selectcustomer.sort(function (b, a) {
          return b.createTime - a.createTime;
        })
        this.setData({
          customerarr: selectcustomer
        })

      } else {
        let res = await api.clientList({
          method: 'POST',
          headers: {
            'content-type': 'application/json' // 默认值
          },
          query: {
            order: "modify_time asc"
          }
        })
        if (!res.data.success) { return };
        wx.removeStorageSync("haveselect");
        if (!res.data.data.list) {
          this.setData({
            customerarr: ''
          });
        } else {
          this.setData({
            customerarr: res.data.data.list
          });
        }
      }

    } else if (this.data.dataindex == 1) {
      this.setData({
        dataindex: 2,
        chooseOne: '/images/time2.png'
      });
      if (selectcustomer) {
        var selectcustomer = selectcustomer.sort(function (b, a) {
          return a.createTime - b.createTime;
        })
        this.setData({
          customerarr: selectcustomer
        })

      } else {
        let res = await api.clientList({
          method: 'POST',
          headers: {
            'content-type': 'application/json' // 默认值
          },
          query: {
            order: "modify_time desc"
          }
        })
        if (!res.data.success) { return };
        wx.removeStorageSync("haveselect");
        if (!res.data.data.list) {
          this.setData({
            customerarr: ''
          });
        } else {
          this.setData({
            customerarr: res.data.data.list
          });
        }
      }

    } else if (this.data.dataindex == 2) {
      this.setData({
        dataindex: 1,
        chooseOne: '/images/time3.png'
      });
      if (selectcustomer) {
        var selectcustomer = selectcustomer.sort(function (b, a) {
          return b.createTime - a.createTime;
        })
        this.setData({
          customerarr: selectcustomer
        })

      } else {
        let res = await api.clientList({
          method: 'POST',
          headers: {
            'content-type': 'application/json' // 默认值
          },
          query: {
            order: "modify_time asc"
          }
        })
        if (!res.data.success) { return };
        wx.removeStorageSync("haveselect");
        if (!res.data.data.list) {
          this.setData({
            customerarr: ''
          });
        } else {
          this.setData({
            customerarr: res.data.data.list
          });
        }
      }
    }
  },
  arrayIsEqual(arr1, arr2) { //判断2个数组是否相等
    if (arr1 === arr2) { //如果2个数组对应的指针相同，那么肯定相等，同时也对比一下类型
      return true;
    } else {
      if (arr1.length != arr2.length) {
        return false;
      } else { //长度相同
        return true;
      }
    }
  },
  async initClientList(){
    let res = await api.clientList({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
    })
    if (!res.data.success) { return };
    if (!res.data.success) { return }
    wx.removeStorageSync("haveselect");
    var List = res.data.data.list;
    wx.setStorageSync("customerList", List);
    if (res.data.data.list.length == 0) {
      this.setData({
        customer: false
      });
    } else {
      if (this.arrayIsEqual(res.data.data.list, this.data.customerarr)) {
        return
      }
      this.setData({
        customerarr: res.data.data.list,
        customer: true
      });
    }
  },
  // 初始化渲染页面
  onLoad(options) {
    this.initClientList();
  },
  onShow(options) {
    //有增加客户或者添加标签才会刷新，如果行业筛选过后，添加标签完，切换完主页，不更新全部客户
    var havechange = wx.getStorageSync("havechange");
    var haveselect = wx.getStorageSync("haveselect");
    if (havechange && !haveselect) {
      this.onLoad();
      wx.removeStorageSync("havechange");
    }
    wx.getStorage({
      key: 'userInfoObj',
      success: (res) => {
        this.setData({
          userInfoObj: res.data
        })
      },
    })
    if (!haveselect) {
      this.initClientList();
    }
  },
  onShareAppMessage(res) {
    if (!this.data.userInfoObj || !this.data.userInfoObj.id){
      return {
        title: '还在为拓展人脉，发现商机而发愁？快来试试这款小程序吧！',
        path: '/pages/index',
        imageUrl: 'https://img0.912688.com/mc-share-right-corner.jpg'
      }
    }else if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: this.data.userInfoObj.name + '非常期待与您的合作，邀请您互换名片！',
        path: '/pages/usercenter/userCard/userCard?id=' + this.data.userInfoObj.id + '&userId=' + this.data.userInfoObj.userId + '&saveCardTab=1',
        imageUrl: 'https://img0.912688.com/mc-share-right-corner.jpg'
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