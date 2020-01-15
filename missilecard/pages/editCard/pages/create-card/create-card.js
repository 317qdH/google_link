// pages/edit-card.js
// import pro from '../../resource/utils/ProJson.js';
// import city from '../../resource/utils/CityJson.js';
// import area from '../../resource/utils/AreaJson.js';
import comAnimation from '../../../../utils/comAnimation';
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime-module';
import api from '../../../../api/api';
const app = getApp();
Page({
  data: {
    usName: 'S、栋栋栋',
    avatarimage: '/images/cie-avatar.jpg',
    companyName: '公司信息未填写',
    iphone: '电话信息未填写',
    email: '邮箱信息未填写',
    usObject: '职位信息未填写',
    //传递的模板id
    toViewId: 'G',
    //初始化名片样式类
    cardClassName: 'user-card-template1',
    //初始化名片背景src
    cardImageSrc: '/images/business-card-bg1.png',
    //地区
    region: [],
    //行业选择内容
    industry: '',
    //行业切换显示标识
    industryShowFlag: false,
    //行业选择数组
    industryArr: [],
    //名片切换动画对象
    slide_card: {},
    //防疯狂点击
    canTab: true,
    //行业筛选初始数据
    cateItems: [],
    cateItemtab: [],
    tabId: '', //子类ID,
    categoryId: '', //传输行业ID 
    key: '',
    createtab: '',
    //模板样式
    templateId: 1,
    //id
    id: 3,
    key: '',
    //遮罩展示
    maskShowFlag: false,
    //模板id
    templateId: 1,
    userInfoObj: {
      name: '名字未填写',
      mobile: '手机号码未填写',
      mail: '邮箱未填写',
      position: '职位信息未填写',
      companyName: '公司名称未填写',
      avatarPath: '/images/cie-avatar.jpg',
      templateId: 1
    },
    userInfoObjtext: {},
    //选中地区数组
    regionSelectList: [{}, {}, {
      name: '请选择'
    }],
    //当前展示的地区数组
    // regionShowList: pro.province,
    //地区选择器
    // regionShowFlag: false,
    //最后选择的地区
    regionStr: '',
    //用户提交的地区数组
    regionSubmitList: [],
    //地区选择器第几个标识
    regionTab: 0,
    //当前市数组
    tempList2: [],
    //当前区数组
    tempList3: [],
    //省市区id
    areaIdList: [],
    mineavatarPath: '',
    //是否首页进入
    indexFlag: '',
    //移除遮罩
    removeMask: false,
    //生成名片图片样式
    toCanvasMethodName: '',
    //头像地址
    avatarPaths: '',
    //行业选择是否已经进行完
    industryChooseFlag: false,
    //头像上传路径
    avatarUpUrl:'',
    avatar_uploadSuccess:true,
  },
  async getPhoneNumber(e){
    // console.log(e)
    // userInfoObjtext.mobile = e;
    let response = await api.authPhone({
      query:{
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
    })
    if(response.data.success){
      let userInfoObjtext = this.data.userInfoObjtext;
      userInfoObjtext.mobile = response.data.data
      this.setData({
        userInfoObjtext
      })
    }
  },
  cieGetAddress(e){
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success:(res)=> {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.chooseLocation({
          success: (res) => {
            // console.log(res.address)
            let userInfoObjtext = this.data.userInfoObjtext;
            userInfoObjtext.address = res.address;
            this.setData({
              userInfoObjtext
            })
          },
        })
      }
    })
  },
  //行业选择
  select(e) {
    let industry = e.currentTarget.dataset.name;
    let industryArr = this.data.industryArr;
    industryArr[0] = industry;
    let userInfoObjtext = this.data.userInfoObjtext;
    userInfoObjtext.categoryId = e.currentTarget.dataset.id;
    userInfoObjtext.categoryName = industry;
    industry = industryArr.join('-');
    this.setData({
      industryShowFlag: false,
      maskShowFlag: false,
      industry,
      idxs: e.currentTarget.dataset.id,
      categoryId: e.currentTarget.dataset.id,
      industryChooseFlag: true,
      userInfoObjtext
    })
  },
  //获取行业子类
  async switchRightTab (e) {
    let catevalue = e.currentTarget.dataset.catevalue;
    let industryArr = this.data.industryArr;
    industryArr[1] = catevalue;
    let userInfoObjtext = this.data.userInfoObjtext;
    userInfoObjtext.parentCategoryName = catevalue;
    userInfoObjtext.parentCategoryId = e.currentTarget.dataset.id;
    this.setData({
      tabId: e.currentTarget.dataset.id,
      indexss: e.currentTarget.dataset.id,
      idxs: '',
      industryChooseFlag: false,
      userInfoObjtext,
      industryArr
    })
    var that = this;
    let res = await api.categorySubclass({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        parentId: that.data.tabId
      }
    })
    if (!res.data.success) { return }
    this.setData({
      cateItemtab: res.data.data
    })
  },
  initCardInfor(e) {
    wx.getStorage({
      key: 'BgSelection',
      success: (res) => {
        this.setData({
          cardClassName: res.data.cardClassName,
          cardImageSrc: res.data.cardImageSrc
        })
      },
    })

  },
  getCardInfor(e) {
    if (this.data.canTab == false) return
    let templateId = e.detail.templateId;
    let userInfoObj = this.data.userInfoObj;
    userInfoObj.templateId = templateId;
    // wx.setStorage({
    //   key: 'formUserInfo',
    //   data: userInfoObj,
    // })
    this.setData({
      canTab: false,
      templateId,
      userInfoObj
    })
    comAnimation.toggleShow(this, 'slide_card', 0, 1, this.getCardClassName);
    setTimeout(() => {
      let cardClassName = e.detail.cardClassName;
      let cardImageSrc = e.detail.cardImageSrc;
      let toCanvasMethodName = e.detail.toCanvasMethodName;
      this.setData({
        cardClassName,
        cardImageSrc,
        toCanvasMethodName,
        canTab: true
      })
      //,templateId
    }, 400)
  },
  closeIndustryPicker(e) {
    this.setData({
      maskShowFlag: false
    })
  },
  //关闭行业选择框
  closeIndustryPicker() {
    this.setData({
      industryShowFlag: false,
      maskShowFlag: false
    })
  },
  openIndustryPicker() {
    this.setData({
      industryShowFlag: true,
      maskShowFlag: true
    })
  },
  comfirmIndestry() {
    if (!this.data.industryChooseFlag) {
      wx.showToast({
        title: '请选择行业',
        icon: 'none',
        duration: 2000
      })
    } else {
      let industry = this.data.industry;
      let industryArr = this.data.industryArr;
      industry = industryArr.join('-');
      this.setData({
        industryShowFlag: false,
        maskShowFlag: false,
        industry
      })
    }
  },
  rightselect(e) {
  },
  //完成一项信息输入
  completeAnInput(e) {
    let userInfoObj = this.data.userInfoObj;
    let userInfoObjtext = this.data.userInfoObjtext;
    userInfoObj[e.currentTarget.id] = e.detail.value;
    userInfoObjtext[e.currentTarget.id] = e.detail.value;
    this.setData({
      userInfoObj,
      userInfoObjtext
    })
    // wx.setStorage({
    //   key: 'formUserInfo',
    //   data: userInfoObj,
    // })
  },
  //提交表单
  async formSubmit(e) {
    // if (!this.data.avatar_uploadSuccess){
    //   return 
    // }
    //获取表单输入的内容
    let regionArr = this.data.regionStr.split('-');
    let updateUserInfo = this.data.userInfoObjtext;
    updateUserInfo.avatarPath = this.data.avatarUpUrl;
    updateUserInfo.templateId = this.data.templateId;
    updateUserInfo.provinceId = this.data.areaIdList[0];
    updateUserInfo.cityId = this.data.areaIdList[1];
    updateUserInfo.areaId = this.data.areaIdList[2];
    updateUserInfo.provinceName = regionArr[0];
    updateUserInfo.cityName = regionArr[1];
    updateUserInfo.areaName = regionArr[2];
    if (!this.testForm(updateUserInfo)) {
      return
    }
    let response;
    if (this.data.createtab) {
      response = await api.addCard({
        query: updateUserInfo,
        headers: {
          'content-type': 'application/json'
        }
      });
    } else {
      updateUserInfo.id = this.data.userInfoObj.id
      response = await api.updateCard({
        query: updateUserInfo,
        headers: {
          'content-type': 'application/json'
        }
      });
    }
    if (response.data.success) {
      app.globalData.shareFilePath = '';
      let userInfoObj;
      if (this.data.createtab) {
        userInfoObj = response.data.data
      } else {
        userInfoObj = Object.assign(this.data.userInfoObjtext, updateUserInfo);
      }
      wx.setStorage({
        key: 'userInfoObj',
        data: userInfoObj,
        success: () => {
          wx.getStorage({
            key: 'BgSelection',
            success: (res) => {
              let bgSelection = res.data;
              let toCanvasMethodName = this.data.toCanvasMethodName || res.data.toCanvasMethodName;
              Object.assign(bgSelection, { cardClassName: this.data.cardClassName, cardImageSrc: this.data.cardImageSrc, toCanvasMethodName: toCanvasMethodName });
              wx.setStorageSync('BgSelection', bgSelection);
              wx.showModal({
                title: '保存成功',
                content: '是否返回上一页',
                cancelText:'回首页',
                success: (res) => {
                  if (res.confirm) {
                    var pages = getCurrentPages();
                    if (this.data.createtab == '0') {
                      //上一个页面实例对象
                      var prePage = pages[pages.length - 2];
                      //关键在这里
                      prePage.setData({
                        cardTab: 2
                      })
                    }
                    wx.navigateBack({
                      delta: 1
                    })

                  } else if (res.cancel) {
                    wx.switchTab({
                      url: '/pages/index',
                    })
                  }
                }
              })
            },
          })
        }
      })


    } else {
      if (response.data.data && response.data.data.checkError) {
        wx.showModal({
          title: '温馨提示',
          content: response.data.data.checkError || '服务器错误请稍后重试',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '网络异常',
        })
      }

    }
  },
  stopPageScroll(){
    
  },
  //选择头像
  chooseAvatar(e) {
    wx.setStorage({
      key: 'imgSrc',
      data: this.data.userInfoObjtext.avatarPath,
      success:(e)=>{
        // wx.navigateTo({
        //   url: '../crop/crop'
        // })
      },
      fail:(e)=>{

      },
      complete:(e)=>{
        wx.navigateTo({
          url: '../crop/crop'
        })
      }
    })
  },
  //表单校验
  testForm(updateUserInfo) {
    if (updateUserInfo.name == '') {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
      })
      return false
    } else if (updateUserInfo.mobile == '') {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
      })
      return false
    } else if (updateUserInfo.companyName == '') {
      wx.showModal({
        title: '提示',
        content: '请输入公司名称',
      })
      return false
    } else if (updateUserInfo.position == '') {
      wx.showModal({
        title: '提示',
        content: '请输入职位信息',
      })
      return false
    } else if (updateUserInfo.categoryName == '') {
      wx.showModal({
        title: '提示',
        content: '请输入行业',
      })
      return false
    }else if (updateUserInfo.mail == '') {
      wx.showModal({
        title: '提示',
        content: '请输入邮箱',
      })
      return false
    }
    //

    let mobileTest = /^1\d{10}$/;
    let phoneTest = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    let mobileResult = mobileTest.test(updateUserInfo.mobile) || phoneTest.test(updateUserInfo.mobile);
    let emailTest = /@+/;
    let emailResult = emailTest.test(updateUserInfo.mail);
    let companyTest = /^[\(\)\（\）\.\{0,}\u4e00-\u9fa5]+$/;
    let companyResult = companyTest.test(updateUserInfo.companyName);
    if (!mobileResult) {
      wx.showModal({
        title: '提示',
        content: '请输入正确格式的手机号码',
      })
      return false
    }else if(!emailResult) {
      wx.showModal({
        title: '提示',
        content: '请输入正确格式的邮箱',
      })
      return false
    } else if(!companyResult){
      wx.showModal({
        title: '提示',
        content: '请输入正确格式的公司名称',
      })
      return false
    }
    return true
  },
  removeNull(object) {
    var newArr = {};
    // console.log(typeof object)
    if (typeof object == 'object') {
      for (let item in object) {
        if (object[item]) {
          newArr[item] = object[item];
        }
      }
      // console.log(newArr);
    }
    return newArr
  },
  onLoad: function (options) {
    // console.log(options);
    let cardSelect = this.selectComponent("#cardSelect")
    cardSelect.getCardList();
    //如果从首页进入编辑名片
    if (options.indexFlag) {
      let indexFlag = options.indexFlag;
      this.setData({
        indexFlag
      })
    }
    let storageUserInfo = wx.getStorageSync('userInfoObj');
    let userInfoObj = this.data.userInfoObj;
    let regionStr, industry;
    if (storageUserInfo.provinceName && storageUserInfo.cityName && storageUserInfo.areaName) {
      regionStr = storageUserInfo.provinceName + '-' + storageUserInfo.cityName + '-' + storageUserInfo.areaName;
    } else if (storageUserInfo.provinceName && storageUserInfo.cityName && !storageUserInfo.areaName) {
      regionStr = storageUserInfo.provinceName + '-' + storageUserInfo.cityName;
    } else {
      regionStr = '';
    }
    if (!storageUserInfo.categoryName) {
      industry = '';
    } else {
      industry = storageUserInfo.categoryName + '-' + storageUserInfo.parentCategoryName || '';
    }
    this.setData({
      userInfoObj: Object.assign(userInfoObj, storageUserInfo),
      templateId: Object.assign(userInfoObj, storageUserInfo).templateId || 1,
      regionStr,
      industry,
      avatarUpUrl: storageUserInfo.avatarPath
    })
    //如果用户是第一次创建名片进入
    if (options.createtab == '0') {
      var userInfoObjtext = {};
      userInfoObjtext.name = storageUserInfo.name;
      new Promise((resolve,reject)=>{
        let response = api.avatar_upload({
          query: {
            avatarUrl: storageUserInfo.avatarPath
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
        });
        // this.setData({
        //   avatar_uploadSuccess:false
        // })
        resolve(response);
      })
      .then((res)=>{
        // this.setData({
        //   avatar_uploadSuccess:true
        // })
        // wx.hideLoading();
        if (options.mineitem == "1") {
          var mineinfo = wx.getStorageSync("useradd");
          userInfoObjtext = mineinfo;
          userInfoObjtext.avatarPath = res.data.data;
          this.setData({
            userInfoObj: Object.assign(userInfoObj, this.removeNull(userInfoObjtext)),
            userInfoObjtext,
            avatarUpUrl: userInfoObjtext.avatarPath
          })
        }else{
          userInfoObjtext.avatarPath = res.data.data;
          this.setData({
            userInfoObjtext,
            avatarUpUrl: userInfoObjtext.avatarPath
          })
        }
      })
      this.setData({
        userInfoObjtext,
        createtab: options.createtab
      })
    } else {
      this.setData({
        userInfoObjtext: storageUserInfo
      })
    }
    //如果用户是拍照添加进入
    this.carteCateParent();
    
  },
  async carteCateParent(){
    let res = await api.carteCateParent({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      }
    })
    if (!res.data.success) { return }
    this.setData({
      cateItems: res.data.data
    })
  },
  onShow: function () {
    this.upImgUrl();
  },
  async resizeLogin(){
    let res = await api.wxlogin();
    this.upImgUrl();
  },
  upImgUrl(){
    let userInfoObjtext = this.data.userInfoObjtext;
    var reg = RegExp(/tmp/);
    if (!userInfoObjtext.avatarPath) return
    if (userInfoObjtext.avatarPath.match(reg)) {
      wx.showLoading({
        title: '头像上传中',
        mask: true
      })
      wx.uploadFile({
        url: api.BASE_PATH + "/carte/avatar_upload",
        filePath: userInfoObjtext.avatarPath,
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",
          'accept': 'application/json',
          'Cookie': 'JSESSIONID=' + wx.getStorageSync('cookie')
        },
        success: (res) => {
          let responseObj = JSON.parse(res.data);
          if (responseObj.success){
            var avatarPaths = responseObj.data + '&imageView2/2/w/200';
            this.setData({
              avatarUpUrl: avatarPaths
            })
            wx.hideLoading();
          } else if (responseObj.code == '0002'){
            this.resizeLogin();
          }else{
            let avatarPaths = wx.getStorageSync('userInfoObj').avatarPath;
            this.setData({
              avatarUpUrl: avatarPaths
            })
            wx.hideLoading();
          }
        },
        fail: (res) => {
          // console.log('fail');
        },
      })
    }
  },
  onUnload() {
    wx.removeStorage({
      key: 'useradd',
      success: function (res) {
        // console.log(res);
      },
    })
  }
})
