// components/cardBgSelection/cardBgSelection.js
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module';
import api from '../../api/api';
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    canTab: {
      type: Boolean,
      value: ''
    },
    //选择名片背景标识id
    templateId: {
      type: Number,
      value: 1,
      observer: function (newVal, oldVal) {
        // 属性值变化时执行
        // console.log(newVal,oldVal);
        // console.log('这里是有没有数据',this.data.cardTemplateList.length > 1);
        // console.log('有没有请求到数组啊啊',this.data.cardTemplateList.length);
        if (newVal == this.data.templateId){
          return
        }
        if (this.data.cardTemplateList.length !== 0){
          // console.log('jjjjjjjjjjjjjjjjjjjjjj', newVal, this.data.cardTemplateList);
          this.updateCardBg(newVal, this.data.cardTemplateList);
        }
      }
    }
  },
  attached(){
    
  },
  /**
   * 组件的初始数据
   */
  data: {
    // //初始化名片样式类
    // cardClassName: 'user-card-template1',
    // //初始化名片背景src
    // cardImageSrc: '/images/business-card-bg1.png',
    cardSmallBgList: [
      {
        toViewId: 'A',
        src: "/images/business-card-small-bg1.png"
      },
      {
        toViewId: 'B',
        src: "/images/business-card-small-bg2.png"
      },
      {
        toViewId: 'C',
        src: "/images/business-card-small-bg3.png"
      },
      {
        toViewId: 'D',
        src: "/images/business-card-small-bg4.png"
      },
      {
        toViewId: 'E',
        src: "/images/business-card-small-bg5.png"
      },
      {
        toViewId: 'F',
        src: "/images/business-card-small-bg6.png"
      },
      {
        toViewId: 'G',
        src: "/images/business-card-small-bg7.png"
      },
      {
        toViewId: 'H',
        src: "/images/business-card-small-bg8.png"
      },
      {
        toViewId: 'I',
        src: "/images/business-card-small-bg9.png"
      },
      {
        toViewId: 'J',
        src: "/images/business-card-small-bg10.png"
      },
      {
        toViewId: 'K',
        src: "/images/business-card-small-bg11.png"
      },
      {
        toViewId: 'L',
        src: "/images/business-card-small-bg12.png"
      },
      {
        toViewId: 'M',
        src: "/images/business-card-small-bg13.png"
      },
      {
        toViewId: 'N',
        src: "/images/business-card-small-bg14.png"
      },
      {
        toViewId: 'O',
        src: "/images/business-card-small-bg15.png"
      },
      {
        toViewId: 'P',
        src: "/images/business-card-small-bg16.png"
      },
    ],
    cardTemplateList:[],
    viewCode:'A'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //选择名片风格
    selectCardBg(e) {
      let viewCode = e.currentTarget.id
      if (viewCode === this.data.viewCode) return
      let idx = this.contains(this.data.cardTemplateList, viewCode,'viewCode');
      // if (!idx) {
      //   console.log('没有此名片id');
      //   return
      // }
      // console.log(this.data.cardTemplateList);
      let cardClassName = this.data.cardTemplateList[idx].carteClassName;
      let cardImageSrc = this.data.cardTemplateList[idx].bigPicPath;
      let toCanvasMethodName = this.data.cardTemplateList[idx].poster;
      let id = this.data.cardTemplateList[idx].id;
      // console.log(id);
      // console.log(this.data.canTab);
      if (this.data.canTab == false) return
      this.setData({
        viewCode,
        templateId: id
      })
      this.triggerEvent('selectBgEvent', { 'cardClassName': cardClassName, 'cardImageSrc': cardImageSrc, 'templateId': id, 'toCanvasMethodName': toCanvasMethodName});
    },
    contains(arrays, id,value) {
      // console.log(arrays.length)
      var i = arrays.length;
      while (i--) {
        if (arrays[i][value] == id) {
          return i;
        }
      }
      return false;
    },
    async getCardList(){
      let response = await api.getCardTemplate({}, api.getCardTemplate);
      // console.log(response);
      this.updateCardBg(this.data.templateId, response.data.data);
      
    },
    updateCardBg(id, cardTemplateList) {
      id = id || 1;
      // console.log(id);
      cardTemplateList = cardTemplateList || this.data.cardTemplateList;
      let idx = this.contains(cardTemplateList, id, 'id');
      // if(!idx){
      //   console.log('没有此名片id');
      //   return
      // }
      // console.log(idx);
      // console.log(cardTemplateList);
      let viewCode = cardTemplateList[idx].viewCode;
      this.setData({
        cardTemplateList,
        viewCode
      })
      let cardClassName = cardTemplateList[idx].carteClassName;
      let cardImageSrc = cardTemplateList[idx].bigPicPath;
      let toCanvasMethodName = cardTemplateList[idx].poster;
      // console.log(this.data.canTab);
      if (this.data.canTab == false) return
      // console.log('1111');
      this.triggerEvent('initBgEvent', { 'cardClassName': cardClassName, 'cardImageSrc': cardImageSrc, 'toCanvasMethodName': toCanvasMethodName });
    }
    // getUpdate(newVal, cardTemplateList){
    //   if (cardTemplateList.length > 0) {
    //     this.updateCardBg(newVal);
    //   } else {
    //     setTimeout(()=>{
    //       this.getUpdate(newVal);
    //     },1000)
    //   }
    // }
  }
})
