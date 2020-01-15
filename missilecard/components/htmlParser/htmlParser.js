// components/htmlParser/htmlParser.js
const WxParse = require('../../plugins/wxParse/wxParse.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    parserName: {
      type: String,
      value:"htmlParserName"
    },
    parserType: {
      type: String,
      value: "html"
    },
    parserContent: {
      type: String,
      value: "<p style='font-size: 32rpx; padding: 30rpx 0; text-align: center;'>没有任何内容</p>",
      observer(newVal,oldVal,changedPath) {
        this.htmlParse()
      }
    },
    parserPadding: {
      type: Number,
      value: 0
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
    htmlParserNotice() {
      this.htmlParse();
    },
    wxParseImgLoad(image) {
      let imgInfo = image.detail;
    },
    htmlParse() {
      /**
       * WxParse.wxParse(bindName , type, data, target,imagePadding)
       * 1.bindName绑定的数据名(必填)
       * 2.type可以为html或者md(必填)
       * 3.data为传入的具体数据(必填)
       * 4.target为Page对象,一般为this(必填)
       * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
       */
      try {
        let htmlContent = WxParse.wxParse(this.data.parserName, this.data.parserType, this.data.parserContent, this, this.data.parserPadding);
        this.setData({
          htmlParserTpl: htmlContent[this.data.parserName]
        })
        //this.htmlParserTpl = this[this.parserName];
      } catch (e) {
        console.warn('kinerHtmlParser:', '没有任何内容需要转换', e);
      }
    },
    wxParseImgTap(e) {
      WxParse.wxParseImgTap(e, this.data.bindData);
    }
  }
})
