// pages/ai/customer-detail.js
import * as echarts from '../../components/ec-canvas/echarts';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module';
import api from '../../api/api';

let chart = null;

function initChart(canvas, width, height, recordData) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    legend: {
      orient: 'vertical',
      align: 'left',
      x: 'right',
      itemGap: 20,
      itemWidth: 13,
      itemHeight: 13,
      left: '40%',
      right: 0,
      top: '22%',
      bottom: 0,
      selectedMode: false,
      textStyle: {
        color: '#999999',
        fontSize: 14
      },
      data: ['对我感兴趣', '对产品感兴趣', '对公司感兴趣'],
      // 重写legend显示样式
      formatter: function (name) {
        // 获取legend显示内容
        let data = option.series[0].data;
        let total = 0;
        let tarValue = 0;
        for (let i = 0, l = data.length; i < l; i++) {
          total += data[i].value;
          if (data[i].name == name) {
            tarValue = data[i].value;
          }
        }
        if (total == 0) {
          return name + ' 0%'
        } else {
          let p = (tarValue / total * 100).toFixed(2);
          return name + ' ' + p + '%';
        }
      },
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['32', '58'],
        avoidLabelOverlap: false,
        legendHoverLink: false,
        hoverAnimation: false,
        center: ['58', '50%'],
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        color: ['#5b7ffd', '#9bdd25', '#fbda3a'],
        data: [
          { value: 100, name: '对我感兴趣' },
          { value: 100, name: '对产品感兴趣' },
          { value: 100, name: '对公司感兴趣' }
        ]
      }
    ]
  };
  option.series[0].data = recordData;
  chart.setOption(option);
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
    },
    recordData: [{
      value: 0,
      name: '对我感兴趣'
    }, {
      value: 0,
      name: '对产品感兴趣'
    }, {
      value: 0,
      name: '对公司感兴趣'
    }],
    currentTab:0,
    createCardFlag:true,
    messageTab:0,
    visitorTab:1,
    //互动记录
    interacRecord:'',
    //AI分析
    aiAnalyzeList:'',
    //做大数量
    maxRecord:1,
    nowDate:'',
    //有无互动记录
    noExchangePerf:''
  },
  checkMessageDet(e) {
    // console.log(e);
    let launchUserId = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '/pages/message/chat/chat?launchUserId=' + launchUserId,
    })
  },
  //去客户详情
  toCustomerDet(e) {
    let launchUserId = e.currentTarget.dataset.idx;
    wx.redirectTo({
      url: '/pages/ai/customer-detail?launchUserId=' + launchUserId,
    })
    // wx.navigateTo({
    //   url: 
    // })
  },
  echartInit(e) {
    // console.log(e);
    let recordData = e.target.dataset.record;
    initChart(e.detail.canvas, e.detail.width, e.detail.height, recordData);
  },
  callPhont(){
    wx.makePhoneCall({
      phoneNumber: this.data.carteUserObj.mobile || '0571-26263777' //仅为示例，并非真实的电话号码
    })
  },
  switchTab(e){
    let idx = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: idx
    })
  },
  closePopup(){
    this.setData({
      createCardFlag:true
    })
  },
  //查看名牌
  examineCard(){
    if (this.data.carteUserObj && this.data.carteUserObj.id){
      wx.navigateTo({
        url: '/pages/usercenter/userCard/userCard?id=' + this.data.carteUserObj.id,
      })
    }else{
      this.setData({
        createCardFlag: false
      })
    }
    
  },
  //获取客户详情信息
  async getCustomerDetail(launchUserId){
    let response = await api.aiCustomerDetail({
      query:{
        launchUserId: launchUserId
      }
    })
    if(response.data.success){
      //去canvas 数据
      let recordData = this.data.recordData;
      let interestList = response.data.data.customerInteractionList;
      // interestList = [0,0,0,0,0,0,0,0,0]
      // recordData[0].value = 0;
      // recordData[1].value = 0;
      // recordData[2].value = 0;
      var noExchangePerf = interestList.every((item,index)=>{
        return  item == 0
      })
      recordData[0].value = interestList[0] + interestList[1] + interestList[2] + interestList[3] + interestList[4] + interestList[5];
      recordData[1].value = interestList[7];
      recordData[2].value = interestList[6] + interestList[8];
      //ai分析 客户互动
      let aiAnalyzeList = response.data.data.customerInteractionList;
      let interacRecord = response.data.data.pageInfo.list;
      let messageTab = interacRecord.length > 0?1:0;
      let nowDate = Date.parse(new Date());
      let carteUserObj = response.data.data.carte;
      let userInfoObj = response.data.data.carteUser;
      let visitorTab = response.data.identity;
      // let carteUserObj = {};
      let maxRecord = 1;
      aiAnalyzeList.forEach((item,index,array)=>{
        if (item > maxRecord){
          maxRecord = item;
        }
      })
      this.setData({
        carteUserObj,
        userInfoObj,
        interacRecord,
        aiAnalyzeList,
        maxRecord,
        nowDate,
        recordData,
        messageTab,
        noExchangePerf
      })
    }
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let launchUserId = options.launchUserId ;
    let visitorTab = options.visitorTab;
    this.setData({
      visitorTab
    })
    this.getCustomerDetail(launchUserId)
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

  }
})