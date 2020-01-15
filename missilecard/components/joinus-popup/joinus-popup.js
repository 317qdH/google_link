// components/joinus-popup/joinus-popup.jsimport regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module'
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime-module';
import api from '../../api/api';
import tip from '../../utils/tip';
import regExp from '../../utils/regExp'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    popupShow: {
      type: Boolean,
      value: false
    },
    flag: {
      type: String,
      value: ''
    },
    source: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    array: ['我想了解服务内容', '我想购买服务', '请马上与我联系', '我想了解搜好货网'],
    pickerText: '我想了解服务内容',
    sendSuccess: false,
    time: '',
    yamValue: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closePopup() {
      this.setData({
        popupShow: false,
        sendSuccess: false
      })
    },
    bindPickerChange(e) {
      let idx = Number.parseInt(e.detail.value);
      let array = this.data.array;
      let pickerText = array[idx];
      this.setData({
        pickerText
      })
    },
    toggleCode() {
      this.setData({
        time: new Date().getTime()
      })
    },
    checkForm(params) {
      // 校验策略
      if (params.tel == '') {
        tip.alert('请输入联系电话', 1000);
        return false
      }
      if (!regExp.verifyFactory.phone(params.tel)) {
        tip.alert('联系电话不正确', 1000);
        return false
      }
      if (params.companyName == '') {
        tip.alert('请输入联系信息', 1000);
        return false
      }
      if (params.code == '') {
        tip.alert('请输入验证码', 1000);
        return false
      }
      return true
    },
    async formSubmit(e) {
      let params = {
        questionType: e.detail.value.questionType || 0,
        tel: e.detail.value.tel,
        companyName: e.detail.value.companyName,
        code: e.detail.value.code,
      }
      if (this.checkForm(params)) {
        let response = await api.channelMessage({
          query: {
            imagecode: params.code,
            comName: params.companyName,
            flag: this.data.flag,
            mobile: params.tel,
            source: this.data.source,
            description: this.data.array[params.questionType]
          },
          method: "POST"
        })
        if (response.data.success && response.data.code == '0000') {
          this.setData({
            sendSuccess: true
          })
        } else if (!response.data.success && response.data.code == '2020') {
          tip.alert('验证码不正确');
        } else if (!response.data.success && response.data.code == '1002') {
          tip.alert('请勿使用违禁词');
        }
        this.setData({
          yamValue: ''
        })
        this.toggleCode();
      }
    },
  }
})
