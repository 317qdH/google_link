// components/top-nav/top-nav.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerTitle: {
      type: String,
      value: '头部标题'
    },
    isShowBack: {
      type: String,
      value: "true"
    },
    navigatorBgColor: {
      type: String,
      value: "#66a6ff"
    },
    navigatorColor: {
      type: String,
      value: "#fff"
    },
    arrowColor: {
      type: String,
      value: "white"
    },
    sharePage:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    someData: {
      statusBarHeight: app.globalData.statusBarHeight,
      titleBarHeight: app.globalData.titleBarHeight
    }
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      let pages = getCurrentPages();
      // console.log(pages);
      if (pages.length == 1) {
        this.setData({
          isShowBack: false
        })
      } else {
        this.setData({
          isShowBack: true
        })
      }
    },
    moved() { },
    detached() { }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goback: function () {
      wx.navigateBack({
        delta: 1,
      })
    },
    toIndex: function (){
      wx.switchTab({
        url: '/pages/index',
      })
    }
  }
})
