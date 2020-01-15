// pages/editCard/pages/crop/crop.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    width: 250,//宽度
    height: 250,//高度
    cropUrl:'',
    canChoose:true,
    choose:0
  },
  confirmImg(){
    this.cropper = this.selectComponent("#image-cropper"); 
    // this.cropper.pushImg();
    this.cropper.getImg(this.getUrl);
    // this.backEditCard(this.data.cropUrl);
  },
  chooseImg(){
    if(!this.data.canChoose){
      // console.log('图片正在加载');
      return 
    }else{
      this.setData({
        canChoose: false
      })
      // console.log('选择图片');
      this.cropper = this.selectComponent("#image-cropper");
      this.cropper.upload(this);
    }
    
    
  },
  getUrl(e){
    let url = e.url;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var info = prevPage.data
    if (this.data.choose == '1') {
      prevPage.setData({
        avatarimages: url,
        mask: false
      })
    } else {
      let userInfoObjtext = info.userInfoObjtext;
      userInfoObjtext.avatarPath = url;
      let userInfoObj = Object.assign(info.userInfoObj, userInfoObjtext)
      prevPage.setData({
        userInfoObjtext,
        userInfoObj,
        removeMask: true
      })
    }
    wx.navigateBack({
      delta: 1
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    wx.getStorage({
      key: 'imgSrc',
      success: (res)=> {
        this.setData({
          src: res.data || "https://img0.912688.com/mc-share-gray-corner.jpg",
          choose: options.choose
        })
        wx.removeStorage({
          key: 'imgSrc',
          success: function(res) {}
        })
      },
    })
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