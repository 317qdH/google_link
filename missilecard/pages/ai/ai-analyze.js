// pages/ai/ai-analyze.js
import * as echarts from '../../components/ec-canvas/echarts';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module';
import api from '../../api/api';
const app = getApp();

let chart = null;

function initChart(canvas, width, height, recordData) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    // tooltip: {
    //   trigger: 'item',
    //   // formatter: "{a} <br/>{b}: {c} ({d}%)"
    // },
    legend: {
      orient: 'vertical',
      align:'left',
      x: 'right',
      itemGap:20,
      itemWidth:13,
      itemHeight:13,
      left:'40%',
      right:0,
      top:'22%',
      bottom:0,
      textStyle:{
        color: '#999999',
        fontSize:14
      },
      selectedMode: false,
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
        if(total == 0){
          return name+ ' 0%'
        }else{
          let p = (tarValue / total * 100).toFixed(2);
          return name + ' ' + p + '%';
        }
      },
      selectedMode: false
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        clickable: false,
        radius: ['32', '58'],
        avoidLabelOverlap: false,
        legendHoverLink: false,
        hoverAnimation: false,
        center:['58','50%'],
        label: {
          normal: {
            show: false,
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
        color: ['#5b7ffd', '#9bdd25','#fbda3a'],
        data: []
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
    ec: {},
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
    //用户不是会员
    isVip: '',
    //雷达客脉切换
    currentTab:0,
    //访客切换
    visitorTab:1,
    //互动下拉框
    interactiveFlag:false,
    //互动text
    interactiveText:'最新互动',
    //互动select下标
    interactiveIdx:1,
    //数据统计类型
    staticType:'累计',
    //数据总览时间
    dataTimeTab:1,
    analyzeEchartTip:false,
    //数据总览
    grandTotalList: '',
    //数据总览 日新增
    insertList: '',
    //客户兴趣占比
    interestList: '',
    //漏斗图数据
    funnel:{},
    //数据更新时间
    dataUpdateDate:'',
    customerMessList:'',
    nowDate: '',
  },
  echartInit(e) {
    // console.log(e);
    let recordData = e.target.dataset.record;
    initChart(e.detail.canvas, e.detail.width, e.detail.height, recordData);
  },
  toChannelCtt(){
    wx.navigateTo({
      url: '/pages/channel/ctt',
    })
  },
  toCustomerDt(e){
    let launchUserId = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '/pages/ai/customer-detail?launchUserId=' + launchUserId + '&visitorTab=' + this.data.visitorTab,
    })
  },
  closeAnalyzeTip(){
    this.setData({
      analyzeEchartTip: !this.data.analyzeEchartTip
    })
  },
  switchDataTime(e) {
    if(!this.data.canClickTab){
      return
    }
    let dataTimeTab = e.currentTarget.dataset.idx;
    if (dataTimeTab == this.data.dataTimeTab) {
      return
    }
    let staticType = dataTimeTab == 1 ? '累计' :'新增';
    this.setData({
      dataTimeTab,
      staticType
    })
    this.aiInit(dataTimeTab)
  },
  switchTab(e) {
    let idx = e.currentTarget.dataset.idx;
    if(idx == this.data.currentTab){
      return
    }
    this.setData({
      currentTab: idx
    })
    if(idx == 1){
      this.costomerNetInit();
    }else{
      this.aiInit(this.data.dataTimeTab);
    }
  },
  switchVisitor(e){
    let idx = e.currentTarget.dataset.idx;
    if (idx == this.data.visitorTab) return
    this.getInterRecord(this.data.interactiveIdx,idx);
    this.setData({
      visitorTab:idx
    })
  },
  showInteractivePopup(e){
    this.setData({
      interactiveFlag: !this.data.interactiveFlag
    })
  },
  selectInteractiveType(e){
    // console.log(e);
    let idx = e.currentTarget.dataset.idx;
    let hashList = ['', '最新互动', '最多互动'];
    if (this.data.interactiveIdx != idx) {
      this.getInterRecord(idx, this.data.visitorTab);
    }
    this.setData({
      interactiveText: hashList[idx],
      interactiveFlag: !this.data.interactiveFlag,
      interactiveIdx:idx
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isVip: app.globalData.isvip
    })
    if(app.globalData.isvip){
      this.aiInit(this.data.dataTimeTab);
    }
  },
  async aiInit(dataTimeTab){
    this.setData({
      canClickTab:false
    })
    let response = await api.radarAnalysis({
      query:{
        type: dataTimeTab
      }
    })
    if(response.data.success){
      if (dataTimeTab == 1){
        let recordData = this.data.recordData;
        let interestList = response.data.data.interestList;
        recordData[0].value = interestList[0];
        recordData[1].value = interestList[1];
        recordData[2].value = interestList[2];
        this.setData({
          grandTotalList: response.data.data.grandTotalList,
          insertList: response.data.data.insertList,
          recordData
        })
      }else{
        let recordData = this.data.recordData;
        let interestList = response.data.data.interestList;
        recordData[0].value = interestList[0];
        recordData[1].value = interestList[1];
        recordData[2].value = interestList[2];
        this.setData({
          grandTotalList: response.data.data.yearOnYearList,
          insertList: response.data.data.insertList,
          recordData
        })
      }
    }
    this.setData({
      canClickTab:true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  //客脉初始化数据
  async costomerNetInit(){
    this.getInterRecord(this.data.interactiveIdx, this.data.visitorTab);
    let response = await api.guestNetwork();
    if (response.data.success){
      this.setData({
        funnel: response.data.data
      })
    }
  },
  async getInterRecord(interactiveIdx, visitorTab){
    let response = await api.aiInteractiveRecord({
      query: {
        orderType: interactiveIdx,
        guestType: visitorTab
      }
    })
    if(response.data.success){
      let getInterRecord = response.data.data.list;
      let nowDate = Date.parse(new Date());
      this.setData({
        customerMessList: getInterRecord,
        nowDate
      })
    }
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      dataUpdateDate:Date.parse(new Date())
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