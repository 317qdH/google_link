// components/ucInforAuthPopup/ucInforAuthPopup.js
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module';
import api from '../../api/api';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ucInfoAuthShow:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfoObj: {
      name: '搜好货',
      mobile: '手机号码未填写',
      mail: '邮箱未填写',
      position: '职位信息未填写',
      companyName: '公司名称未填写',
      avatarPath: '',
      templateId: 1
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //用户点击授权
    async onGotUserInfo(e) {
      // console.log(e);
      if (e.detail.userInfo) {
        this.setData({
          ucInfoAuthShow:false
        })
        let res = await api.wxlogin();
        this.triggerEvent('ucAuth', { 'authoriFlag': true });
        var userInfo = {};
        wx.getUserInfo({
          success: (res) => {
            userInfo = res.userInfo;
            let userInfoObj = this.data.userInfoObj
            userInfoObj.name = userInfo.nickName;
            userInfoObj.avatarPath = userInfo.avatarUrl;
            if (!wx.getStorageSync('userInfoObj')){
              wx.setStorageSync('userInfoObj', userInfoObj);
            }
            // console.log(userInfo)
            api.upUserNickName({
              headers: {
                'content-type': 'application/json',
              },
              query: {
                weChatNickname: userInfo.nickName,
                avatarPath:userInfo.avatarUrl
              }
            });
          }
        })
      } else {
        return
      }

    },
    unloginClick(){
      wx.showTabBar();
      this.setData({
        ucInfoAuthShow:false,
      })
      this.triggerEvent('ucAuth', { 'authoriFlag': false });
    }
  }
})
