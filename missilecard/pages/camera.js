// pages/camera.js
const app = getApp();
import api from '../api/api';
import regeneratorRuntime from '../utils/regenerator-runtime/runtime-module';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths:'',
    loadingFlag:true,
    takePhotoFlag:false
  },
  takePhoto(){
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (response) => {
        // console.log(response.tempImagePath);
        // console.log(response);
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = response.tempImagePath
        this.setData({
          takePhotoFlag:true,
          tempFilePaths: tempFilePaths
        })
        
      }
    })
  },
  async resizeLogin(){
    let res = await api.wxlogin();
    this.comfirmPhoto();
  },
  comfirmPhoto(){
    var tempFilePaths = this.data.tempFilePaths
    wx.showLoading({
      title: '正在创建名片',
    })
    wx.uploadFile({
      url: api.BASE_PATH + "/carte/discern",
      filePath: tempFilePaths,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('cookie')
      },
      formData: {
        'user': 'test'
      },
      success: (res) => {
        var data = JSON.parse(res.data);
        console.log(data);
        if (data.success) {
          var userinfo = data.data;
          this.clearNull(userinfo);
          if (userinfo.mobile && userinfo.mobile.length > 11) {
            userinfo.mobile = userinfo.mobile.substring(userinfo.mobile.length - 11, userinfo.mobile.length);
          }
          // console.log(userinfo);
          //将拍照识别完的名片信息放在缓存
          wx.setStorageSync('useradd', userinfo);
          if (this.data.createCustomer) {
            wx.redirectTo({
              url: '../../editCard/pages/create-customer/create-customer'
            })
          } else {
            wx.redirectTo({
              url: '../../editCard/pages/create-card/create-card?mineitem=' + 1 + '&createtab=0',
            })
          }
        } else if (data.code == '0001') {
          wx.showToast({
            title: '识别超时，请手动输入',
          })
          if (this.data.createCustomer) {
            wx.redirectTo({
              url: '../../editCard/pages/create-customer/create-customer'
            })
          } else {
            wx.redirectTo({
              url: '../../editCard/pages/create-card/create-card?mineitem=' + 1 + '&createtab=0',
            })
          }
        } else if (data.code == '0002') {
          this.resizeLogin();
        }else{
          if (this.data.createCustomer) {
            wx.redirectTo({
              url: '../../editCard/pages/create-customer/create-customer'
            })
          } else {
            wx.redirectTo({
              url: '../../editCard/pages/create-card/create-card?mineitem=' + 1 + '&createtab=0',
            })
          }
        }
      },
      fail: function (err) {
        // console.log('fail');
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },
  resizeCamera(){
    this.setData({
      tempFilePaths:'',
      takePhotoFlag:false
    })
  },
  goBack(){
    wx.navigateBack({
      delta: 1
    })
  },
  //唤起相册
  photoAlbum(){
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      success:(res)=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const src = res.tempFilePaths
        console.log(res.tempFilePaths);
        this.setData({
          tempFilePaths: res.tempFilePaths[0],
          takePhotoFlag: true
        })
      }
    })
  },
  clearNull(object) {
    // console.log(typeof object)
    if (typeof object == 'object') {
      for (let item in object) {
        if (typeof object[item] == 'string') {
          object[item] = object[item].replace('null', '');
        }

      }
      // console.log(object);
    }
  },
  cameraLoading(e){
    // console.log(e)
    this.setData({
      loadingFlag:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.jsDisignPattern();
    if (options && options.createCustomer){
      this.setData({
        createCustomer: options.createCustomer
      })
    }
  },
  jsDisignPattern(){
    // . 除换行符和其他终止符之外的任意字符.
    // \d 表示[0-9] 数字
    // \D 除了数字以外的任何字符.
    // \w 表示字符[a-zA-Z0-9_],别忘了下划线
    // \S 除空白符以外的所有字符
    // ？0或1个，+一个或者多个，*零个或者多个
    // 方法str.match(reg);reg.test(str),reg.exec(str);

    //字符串String支持四种使用正则表达式的方法
    //search()参数是一个正则表达式，返回index
    //replace()，第一个参数是一个正则表达式。第二个是要进行替换的字符串。
    //如果第一个参数是字符串。，将直接搜索这个字符串。，而不像search()一样先通过RegExg()转换
    // var str,reg,result;
    // str = "get-element-by-id";
    // reg =/-\w/g;
    // result = str.replace(reg,function($0){
    //   return $0.slice(1,2).toUpperCase()
    // });
    // console.log(result)
    // str = '888';
    // reg = /^[1-9][0-9]*$/g;
    // str = '1005189462111';
    // reg = /^[1-9]\d{4,13}$/
    // console.log(reg.test(str));
    // str = '0571-64842304';
    // reg = /^\d{3,4}\-\d{8,9}$/;
    // result = reg.test(str);
    // console.log(result);
    // str = "255.221.221.12";
    // str = "<a herf='www.baidu.com'>";
    // reg = /<a[^>]+>/g;
    // console.log(str.match(reg));
    // str = "12345678901";
    // reg = /(\d)(?=(\d{3})+$)/g;
    // result = str.replace(reg,"$1,")
    // console.log(result);
    // var str = "12345678901";
    // function numSplit(str) {
    //   var re = /(\d)(?=(\d{3})+$)/g;
    //   //(\d{3})+$ 的意思是连续匹配 3 个数字，且最后一次匹配以 3 个数字结尾。
    //   //要找到所有的单个字符，这些字符的后面跟随的字符的个数必须是3的倍数，并在符合条件的单个字符后面添加,
    //   return str.replace(re, '$1,');
    // }
    // console.log(numSplit(str));

    // parseUrl("http://www.xiyanghui.com/product/list?id=123456&sort=discount#title");
    // function parseUrl(url){
    //   var obj = {};
    //   var reg = /(\w+)\:\/\/([\w.]+)\/(\S+)\?(\w+)\=(\w+)\&(\w+)\=(\w+)\#(\w+)$/;
    //   var array = url.match(reg);
    //   if(array != null){
    //     console.log(array);
    //     console.log(array);
    //   }
    // }

    // obj = {
    //   protocol:"http",
    //   host:"www.xiyanghui.com",
    //   path:"/product/list",
    //   query:{
    //     id:"123456",
    //     sort:"discount"
    //   },
    //   hash:"title"
    // }
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