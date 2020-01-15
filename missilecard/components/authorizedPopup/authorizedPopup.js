// components/authorizedPopup/authorizedPopup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    authorShowFlag: {
      type: Boolean,
      value: false,
      observer:function(newVal,oldVal){
        // console.log(newVal, oldVal)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    noTouch() {

    },
    cancelClick() {
      this.setData({
        authorShowFlag: false
      })
      // console.log(this.data.authorShowFlag);
    },
    toAhthorClick() {
      this.setData({
        authorShowFlag: false
      })
      // console.log(this.data.authorShowFlag);
    },
  }
})
