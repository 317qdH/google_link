var app = getApp();
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime-module';
import api from '../../../api/api';
Page({
  data: {
    equipmentNumber: '',
    type: ''
  },
  bindEquipmentId: function(e) {
    this.setData({
      equipmentNumber: e.detail.value
    })
  },
  checkboxChange(e) {
    this.setData({
      type: e.detail.value
    })
  },
  async suggestion() {
    if (this.data.equipmentNumber == '') {
      wx.showToast({
        title: '内容不能为空'
      })
      return
    }
    var that = this;
    let res = await api.addProposal({
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      query: {
        type: this.data.type,
        content: this.data.equipmentNumber
      }
    })
    if (res.data.success) {
      wx.showModal({
        title: '提示',
        content: '是否回首页',
        confirmColor: '#66a7fe',
        success: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '../usercenter'
            })
          } else if (res.cancel) {

          }
        }
      })
    } 
  }
})