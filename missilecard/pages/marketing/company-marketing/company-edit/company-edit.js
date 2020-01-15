var app = getApp();
import api from '../../../../api/api';
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime-module';
Page({
  data: {
    images: [],
    imageslength:'',
    templateid:''
  },
  // 图片操作的具体函数
  ImageOperator() {
    var that = this;
    wx.chooseImage({
      count: 6,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // 上传的图片数据
        const imgList = res.tempFilePaths;
        for (var i = 0; i < imgList.length; i++) {
          wx.uploadFile({
            url: api.BASE_PATH + "/carte/avatar_upload",
            filePath: imgList[i],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data",
              'accept': 'application/json',
              'Cookie': 'JSESSIONID=' + wx.getStorageSync('cookie')
            },
            formData: {
              'user': 'test'
            },
            success: res => {
              // console.log(res);
              var mineImage = JSON.parse(res.data).data;
              let data = that.data.images;
              let imageLength = data.length;
              if (imageLength < 6) {
                data = data.concat(mineImage);
                this.setData({
                  images: data,
                  imageslength: data.length
                })
              }
            },
            fail: function (res) {
              console.log('fail');
            },
          })
        }
      }
    })
  },
  // 删除图片
  deleteImage(event) {
    //获取数据绑定的data-id的数据
    const nowIndex = event.currentTarget.dataset.id;
    let images = this.data.images;
    images.splice(nowIndex, 1);
    this.setData({
      images
    })
  },
  // 预览图片
  previewIamge(event) {
    const nowIndex = event.currentTarget.dataset.id;
    const images = this.data.images;
    wx.previewImage({
      current: images[nowIndex], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  // 图片获取
  chooseImage() {
    if (this.data.images.length == 0) {
      // wx.showToast({
      //   title: '',
      //   icon: 'none',
      //   duration: 2000,
      //   success: res => {
          
      //   }
      // })
      this.ImageOperator()
    } else {
      this.ImageOperator()
    }
  },
  numbers(e) {
    var value = e.detail.value;
    var len = parseInt(value.length);
    if (len > this.data.max) return;
    this.setData({
      currentWordNumber: len
    })
  },
  async formSubmit(e) {
    if (e.detail.value.introduction.length<50) {
      wx.showToast({
        title: '不能少于50字'
      })
      return;
    }
    let response = await api.companyAddUpdate({
      method: 'POST',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      query: {
        shortcut: e.detail.value.introduction,
        banner: this.data.images.join(),
        templateId: this.data.template,
        id: this.data.templateid
      }
    })
    if (!response.data.success){return}
    wx.setStorageSync("company1change", "company1change");
    wx.removeStorageSync("company1", "company2", "company3", "company4");
    wx.navigateBack({});
  },
  onLoad: function (options) {
    if (options.id == 1) {
      var user = wx.getStorageSync('company1');
    } else if (options.id == 2) {
      var user = wx.getStorageSync('company2');
    } else if (options.id == 3) {
      var user = wx.getStorageSync('company3');
    } else if (options.id == 4) {
      var user = wx.getStorageSync('company4');
    }
    this.setData({
      template: options.id
    })
    let imagesArr;
    if (user.banner){
      imagesArr = user.banner.split(',');
    }
    else{
      imagesArr = []
    }
    this.setData({
      companyName: user.name,
      offerclass: user.bussScope,
      mode: user.managemodel,
      bussness: user.corporation,
      time: user.establishDate,
      web: user.companyWeb,
      addr: user.addrDetail,
      trade: user.majorIndustry,
      product: user.majorProd,
      templateid: user.id,
      short:user.shortcut,
      images: imagesArr,
      imageslength: imagesArr.length,
      currentWordNumber: user.shortcut.length
    })
  }
})