// pages/edit-card.js
import pro from '../../../editCard/resource/utils/ProJson.js';
import city from '../../../editCard/resource/utils/CityJson.js';
import area from '../../../editCard/resource/utils/AreaJson.js';
import api from '../../../../api/api';
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime-module';
const app = getApp();
Page({
  data: {
    userId: '',
    name: '',
    position: '',
    companyName: '',
    mobile: '',
    mail: '',
    usName: 'S、栋栋栋',
    avatar: '/images/cie-avatar.jpg',
    avatarimages:'',
    companyName: '公司信息未填写',
    iphone: '电话信息未填写',
    email: '邮箱信息未填写',
    usObject: '职位信息未填写',
    mask: true, //图片蒙版
    regionStr: '',
    //传递的模板id
    toViewId: 'G',
    cardClassName: 'user-card-template1',
    //初始化名片背景src
    cardImageSrc: '/images/business-card-bg1.png',
    //地区
    region: [],
    //行业
    select: [],
    industry: '',
    //行业切换显示标识
    industryShowFlag: false,
    //名片切换动画对象
    slide_card: {},
    //防疯狂点击
    canTab: true,
    //行业筛选初始数据
    cateItems: [],
    cateItemtab: [],
    curNav: 1,
    curIndex: 0,
    // tabId: '', //子类ID,
    categoryId: '', //传输行业ID 
    provinceId: '',
    cityId: '',
    areaId: '',
    address: '',
    key: '',
    //模板样式
    templateId: 1,
    //id
    id: 3,
    key: '',
    parentCategoryName: '',
    categoryName: '',
    //父类id
    parentCategoryId: '',
    regionStr: '',
    regionArr: '',
    //遮罩展示
    maskShowFlag: false,
    // userInfoObj: {
    //   name: '名字未填写',
    //   mobile: '手机号码未填写',
    //   mail: '邮箱未填写',
    //   position: '职位信息未填写',
    //   companyName: '公司名称未填写',
    //   avatarPath: '/images/cie-avatar.jpg'
    // },
    userinfo: "",
    //选中地区数组
    regionSelectList: [{}, {}, {
      name: '请选择'
    }],
    //当前展示的地区数组
    regionShowList: pro.province,
    //地区选择器
    regionShowFlag: false,
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
    //地区id
    areaIdList: [],
    //持久化图片路劲
    enduranceAvatar:''
  },

  //获取行业子类
  async switchRightTab(e) {
    // console.log(e);
    this.setData({
      parentCategoryId: e.currentTarget.dataset.id,
      indexss: e.currentTarget.dataset.id,
      idxs: '',
      parentCategoryName: e.currentTarget.dataset.name
    })
    // console.log(this.data.parentCategoryId);
    var that = this;
    let res = await api.categorySubclass({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        parentId: that.data.parentCategoryId
      }
    })
    if (!res.data.success) { return }
    this.setData({
      cateItemtab: res.data.data
    })
  },
  select(e) {
    // console.log(e)
    this.setData({
      idxs: e.currentTarget.dataset.id,
      categoryId: e.currentTarget.dataset.id,
      industry: e.currentTarget.dataset.name,
      categoryName: e.currentTarget.dataset.name,
      industryShowFlag: false,
      maskShowFlag: false,
    })
  },

  initCardInfor(e) {
    // console.log(e);
    let cardClassName = e.detail.cardClassName;
    let cardImageSrc = e.detail.cardImageSrc;
    this.setData({
      cardClassName,
      cardImageSrc
    })
    wx.setStorage({
      key: 'BgSelection',
      data: {
        //初始化名片样式类
        cardClassName,
        //初始化名片背景src
        cardImageSrc,
      },
    })
  },
  getCardInfor(e) {
    // console.log(e.detail.toViewId);
    if (this.data.canTab == false) return
    let id = e.detail.id;
    this.setData({
      canTab: false,
      id
    })
    comAnimation.toggleShow(this, 'slide_card', 0, 1, this.getCardClassName);
    setTimeout(() => {
      let cardClassName = e.detail.cardClassName;
      let cardImageSrc = e.detail.cardImageSrc;
      this.setData({
        cardClassName,
        cardImageSrc,
        canTab: true
      })
    }, 400)
  },
  //选择头像
  chooseAvatar(e) {
    wx.setStorage({
      key: 'imgSrc',
      data: this.data.avatarimages,
      success:()=>{

      },
      fail:()=>{

      },
      complete: () => {
        wx.navigateTo({
          url: '../crop/crop?choose=' + 1
        })
      }
    })
  },

  closeIndustryPicker(e) {
    // console.log(e)
  },
  chooseRegion() {
    this.setData({
      regionShowFlag: true,
      maskShowFlag: true
    })
  },
  resetRegionClick(e) {
    let idx = e.currentTarget.dataset.idx;
    if (!this.data.regionSelectList[idx].id) {
      return
    }
    switch (idx) {
      case 0:
        this.setData({
          regionTab: idx,
          regionShowList: pro.province
        })
        break;
      case 1:
        this.setData({
          regionTab: idx,
          regionShowList: this.data.tempList2
        })
        break;
      case 2:
        this.setData({
          regionTab: idx,
          regionShowList: this.data.tempList3
        })
        break;
    }

  },
  //选择地区
  selectRegion(e) {
    let tempList1 = [],
      tempList2 = [],
      tempList3 = [];
    let obj = e.currentTarget.dataset.obj
    let regionSelectList = this.data.regionSelectList;
    if (this.data.regionTab == 0) {
      regionSelectList[0] = obj;
      regionSelectList[1] = {
        name: '请选择'
      };
      regionSelectList[2] = {};
      // console.log(regionSelectList);
      city.city.forEach(function(item, index, array) {
        if (obj.id == item.parentId) {
          tempList2.push(item)
        }
      })
      this.setData({
        regionShowList: tempList2,
        regionTab: 1,
        regionSelectList,
        tempList2
      })
    } else if (this.data.regionTab == 1) {
      regionSelectList[this.data.regionTab] = obj
      regionSelectList[1] = obj;
      regionSelectList[2] = {
        name: '请选择'
      };
      // console.log(regionSelectList);
      area.area.forEach(function(item, index, array) {
        if (obj.id == item.parentId) {
          tempList3.push(item)
        }
      })
      if (tempList3.length == 0) {
        let regionStr = '';
        let areaIdList = [];
        let regionSubmitList = this.data.regionSelectList;
        regionStr = regionSubmitList[0].name + '-' + regionSubmitList[1].name
        areaIdList.push(regionSubmitList[0].id);
        areaIdList.push(regionSubmitList[1].id);
        this.setData({
          regionSubmitList,
          regionStr,
          regionShowFlag: false,
          maskShowFlag: false,
          areaIdList
        })
      } else {
        this.setData({
          regionShowList: tempList3,
          regionTab: 2,
          regionSelectList,
          tempList3
        })
      }

    } else {
      let regionSubmitList = this.data.regionSelectList;
      regionSubmitList[this.data.regionTab] = obj;
      let regionStr = '';
      let areaIdList = [];
      let regionStrList = [];
      regionSubmitList.forEach(function(item, index, array) {
        regionStrList.push(item.name);
        areaIdList.push(item.id);
      })
      regionStr = regionStrList.join('-');
      this.setData({
        regionSubmitList,
        regionStr,
        regionShowFlag: false,
        maskShowFlag: false,
        areaIdList
      })
      // console.log(regionStrList);
      // console.log(regionStr);
    }

  },
  //关闭行业选择框
  closeIndustryPicker() {
    this.setData({
      industryShowFlag: false
    })
  },
  //打开行业选择框
  openIndustryPicker() {
    this.setData({
      industryShowFlag: true,
      maskShowFlag: true
    })
  },
  rightselect(e) {
    // console.log(e);
  },

  //提交表单
  async formSubmit(e) {
    let regName = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
    let regmobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    let mobileTest = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    let phoneTest = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    let regmail = /@+/;
    let regcompany = /^[\(\)\.\{0,}\u4e00-\u9fa5]+$/;
    if (!e.detail.value.username) {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
      })
      return;
    } else if (!e.detail.value.telephone) {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
      })
      return;
    } else if (!mobileTest.test(e.detail.value.telephone) && !phoneTest.test(e.detail.value.telephone)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确格式的电话号码',
      })
      return;
    } else if (!e.detail.value.company) {
      wx.showModal({
        title: '提示',
        content: '请输入公司名称',
      })
      return;
    } else if (!regcompany.test(e.detail.value.company)) {
      wx: wx.showModal({
        title: '提示',
        content: '请输入正确格式的公司名称'
      })
      return;
    }else if (!e.detail.value.object) {
      wx.showModal({
        title: '提示',
        content: '请输入职位信息',
      })
      return;
    } else if (e.detail.value.email && !regmail.test(e.detail.value.email)) {
      wx.showModal({
        title: '错误',
        content: '请输入正确格式的邮箱'
      })
      return;
    }else if (!this.data.industry) {
      wx.showModal({
        title: '提示',
        content: '请输入行业',
      })
      return;
    }
    let regionArr = this.data.regionStr.split('-');
    // console.log(regionArr);
    var that = this;
    // console.log(that.data.areaIdList);
    let res = await api.cartCliUpdate({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        id: that.data.userId,
        name: e.detail.value.username,
        mobile: e.detail.value.telephone,
        companyName: e.detail.value.company,
        position: e.detail.value.object,
        mail: e.detail.value.email,
        weChat: e.detail.value.wechat,
        avatarPath: that.data.enduranceAvatar || "https://img0.912688.com/mc-share-gray-corner.jpg",
        //行业父类子类ID和名字
        parentCategoryId: this.data.parentCategoryId,
        categoryId: that.data.categoryId,
        parentCategoryName: this.data.parentCategoryName,
        categoryName: this.data.categoryName,
        //地区ID和名字
        provinceId: that.data.areaIdList[0],
        cityId: that.data.areaIdList[1],
        areaId: that.data.areaIdList[2],
        provinceName: regionArr[0],
        cityName: regionArr[1],
        areaName: regionArr[2],
        address: e.detail.value.addr,
        discernPath: that.data.userinfo.discernPath
      }
    })
    if (!res.data.success) { return }
    if (res.data.message == '指定客户名片更新成功') {
      wx.setStorageSync("havechange", "havechange");
      wx.showModal({
        title: '更新客户信息成功',
        content: '是否返回',
        confirmColor: "#66a7fe",
        success: res => {
          if (res.confirm) {
            wx.navigateBack({})
          } else if (res.cancel) {

          }
        }
      })
    }
  },
  changename(e) {
    // console.log(e);
    this.setData({
      name: e.detail.value
    })
  },
  changeposition(e) {
    // console.log(e);
    this.setData({
      position: e.detail.value
    })
  },
  changecompany(e) {
    // console.log(e);
    this.setData({
      companyName: e.detail.value
    })
  },
  changemobile(e) {
    // console.log(e);
    this.setData({
      mobile: e.detail.value
    })
  },
  changemail(e) {
    // console.log(e);
    this.setData({
      mail: e.detail.value
    })
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
  //页面初始化的时候
  onLoad: function(options) {
    //初始化的时候取缓存，将名片识别完的信息赋值到表单上
    var info = wx.getStorageSync('userchange');
    this.setData({
      provinceId: info.provinceId,
      cityId: info.cityId,
      areaId: info.areaId,
      provinceName: info.provinceName,
      cityName: info.cityName,
      areaName: info.areaName,
      parentCategoryId: info.parentCategoryId,
      categoryId: info.categoryId,
      parentCategoryName: info.parentCategoryName,
      categoryName: info.categoryName,
      avatarimages: info.avatarPath,
      enduranceAvatar: info.avatarPath
    })
    if (info.provinceName && info.cityName && info.areaName) {
      var regionstr = info.provinceName + "-" + info.cityName + "-" + info.areaName
    } else if (info.provinceName && info.cityName) {
      var regionstr = info.provinceName + "-" + info.cityName
    } else if (!info.provinceName && !info.cityName && !info.areaName) {
      var regionstr = ''
    }
    if (!info.categoryName) {
      industry: ''
    }
    //用户ID
    var userId = wx.getStorageSync("userId");
    this.setData({
      userId
    })
    this.setData({
      userinfo: info,
      name: info.name,
      position: info.position,
      companyName: info.companyName,
      mobile: info.mobile,
      mail: info.mail,
      industry: info.categoryName,
      regionStr: regionstr
    })
    this.carteCateParent();
  },
  async resizeLogin() {
    let res = await api.wxlogin();
    wx.uploadFile({
      url: api.BASE_PATH + "/carte/avatar_upload",
      filePath: this.data.avatarimages,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('cookie')
      },
      success: (res) => {
        // console.log(res)
        // console.log(JSON.parse(res.data).data);
        var avatarPaths = JSON.parse(res.data).data + '&imageView2/2/w/200';
        this.setData({
          enduranceAvatar: avatarPaths
        })
        // console.log(this.data.enduranceAvatar);
      },
      fail: (res) => {
        // console.log('fail');
      },
    })
  },
  onShow() {
    let cardSelect = this.selectComponent("#cardSelect")
    // cardSelect.getCardList();
    // console.log(city);
    // console.log(area);
    var reg = RegExp(/tmp/);
    if (!this.data.avatarimages) return
    if (this.data.avatarimages.match(reg)) {
      // console.log(this.data.avatarimages);
      wx.uploadFile({
        url: api.BASE_PATH + "/carte/avatar_upload",
        filePath: this.data.avatarimages,
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",
          'accept': 'application/json',
          'Cookie': 'JSESSIONID=' + wx.getStorageSync('cookie')
        },
        success: (res) => {
          // console.log(res)
          // console.log(JSON.parse(res.data).data);
          if (JSON.parse(res.data).code == '0002'){
            this.resizeLogin();
          }
          var avatarPaths = JSON.parse(res.data).data + '&imageView2/2/w/200';
          this.setData({
            enduranceAvatar: avatarPaths
          })
          // console.log(this.data.enduranceAvatar);
        },
        fail: (res) => {
          // console.log('fail');
        },
      })
    }
  }
})