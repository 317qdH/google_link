// pages/message/chat/chat.js
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime-module'
import api from '../../../api/api';
var a;

// 创建全局的录音管理器
// const recorderManager = wx.getRecorderManager()
// const innerAudioContext = wx.createInnerAudioContext()
// var tempFilePath;


//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager();

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowDate: 0,
    msgList: [],
    mytitle: '',
    isMe: false,
    type: 'image',
    content: '菜心——人物Logo设计站酷：菜心 设计铺 刘辉前辈——人物字体手写设计  站酷：麦点盛世 天宇哥——封灵街logo字体手写设',
    images: 'https://img2.912688.com/310db05c-2301-43c1-8a18-a69264c97ddb.jpg#',

    unCttVipFlag: true, //非vip弹窗


    // 语音提示
    video_tip: true,
    // images:'https://img0.912688.com/9db1665d-d076-41cb-9721-4b3974ac757f.jpg'

    // scrollTop
    scrollTop: 999999,

    increase: false, //图片添加区域隐藏

    aniStyle: true, //动画效果


    previewImgList: [],

    // 输入框焦点
    focusFlag: false,


    // 定时器
    interval: '',


    radomheight: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],

    // 长按出现语音框
    video_vioce: 0,
    massage: '',

    // 长按标示
    bs_video: 0,

    // 加号点击其他区域
    add_cover: false,

    // 图片加载动画
    show: false,
    tips: '10%',


    // 声音转换
    video_show: true,
    video_tips: '',

    // 屏蔽
    isShield: false,

    // toBottom:'',

    // 聊天对象的id
    launchUserId: '',

    // 自己的id
    acceptUserId: '',

    // 聊天对象的头像
    youravatar: '',
    myavatar: '',

    // 消息总页码
    allpages: 0,

    // 当前页码
    nowpage: 1,

    // 图片是否裂开
    isErrImg: false,







    // 测试数据
    myname: 'mine',
    isVip: false,
    inputUp: false,
    inputHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //识别语音
    // //console.log(options)
    let launchUserId = options.launchUserId
    let acceptUserId = options.acceptUserId
    this.setData({
      launchUserId: launchUserId,
      acceptUserId: acceptUserId
    })
    this.initRecord();
    this.getMsgList()
    this.barTitle()
    // this.startTap()
    this.getDateNow()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //console.log('进入页面')
    if (a) {
      a = false;
      return;
    }



    // this.getMsgList()
    // this.barTitle()
    this.startTap()
    // this.getDateNow()
    // let that = this
    // setTimeout(() => {
    //   that.bottom()
    // }, 1000)

    // this.myradom();

  },

  // 获取当前时间
  getDateNow() {
    let nowDate = Date.parse(new Date())
    // //console.log(nowDate,'当前时间')
    this.setData({
      nowDate
    })
  },

  // 语音悬浮气泡 定时5秒关闭
  startTap: function() {
    var that = this
    that.init(that)
    var interval = setInterval(function() {
      that.setData({
        video_tip: false
      })
    }, 5000)
    that.setData({
      interval: interval
    })
  },

  // 初始化定时器
  init: function(that) {
    var interval = ""
    that.clearTimeInterval(that)
    that.setData({
      interval: interval,
    })
  },

  // 清除定时器
  clearTimeInterval: function(that) {
    var interval = that.data.interval;
    clearInterval(interval)
  },

  // 顶部标题
  barTitle: function() {
    wx.setNavigationBarTitle({
      title: this.data.mytitle
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var that = this;
    that.clearTimeInterval(that)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var that = this;
    that.clearTimeInterval(that)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    //console.log('下拉')
    let nowpage = this.data.nowpage
    let allpage = this.data.allpages

    this.addMessage(nowpage, allpage)

    wx.stopPullDownRefresh();
  },

  // 增加页码的分页
  async addMessage(nowpage, allpage) {
    if (allpage > nowpage) {
      let pageNum = nowpage + 1
      let nowMessageList = await api.messageDetail({
        query: {
          launchUserId: this.data.launchUserId,
          pageNum: pageNum
        }
      })
      let messageList = nowMessageList.data.data.pageInfo.list
      messageList = messageList.reverse()
      let msgList = messageList.concat(this.data.msgList)
      //console.log(pageNum)
      this.setData({
        nowpage: pageNum,
        msgList: msgList
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  // 顶部屏蔽与取消屏蔽
  async shield() {
    let messageShiled = await api.messageShiled({
      query: {
        shieldUserId: this.data.launchUserId,
      }
    })
    let isShield = this.data.isShield;
    if (messageShiled.data.code == '3043') {
      let shield = await api.isShield({
        query: {
          shieldUserId: this.data.launchUserId
        }
      })
      if (shield.data.success) {
        isShield = true
      }
    } else if (messageShiled.data.code == '3042') {
      let shield = await api.isShield({
        query: {
          shieldUserId: messageShiled.data.data.shieldUserId,
          id: messageShiled.data.data.id,
        }
      })
      if (shield.data.success) {
        isShield = false
      }
    }
    this.setData({
      isShield
    })
  },





  // input 点击获取焦点时事件
  onFoucs: function(e) {
    this.outbtn();
    //console.log(e, '键盘弹起')
    var inputHeight = 0
    if (e.detail.height) {
      inputHeight = e.detail.height
      this.setData({
        inputHeight: inputHeight + 10
      })
    }
    this.bottom()
  },
  bindkeyboardheightchange:function(e) {
    var inputHeight = 0
    if (e.detail.height) {
      inputHeight = e.detail.height
      this.setData({
        inputHeight: inputHeight + 10
      })
    }
    this.bottom()
  },
  // 键盘收起
  inputBlur() {
    //console.log('键盘收起')
    this.setData({
      inputHeight: 0
    })
  },

  // 判断条件是否输入为空
  isEmpty(str) {
    if (str === undefined) {
      return true;
    }
    else if (str == null) {
      return true;
    } else {
      var reg = /^\s*$/;
      return reg.test(str);
    }
  },

  // 键盘enter发送信息
  async onSend(e) {

    if (this.data.isShield) {
      wx.showModal({
        title: '提示',
        content: '您已屏蔽此人，请取消屏蔽后再发送消息',
        showCancel: false,
        success: function(res) {}
      })
      return
    }
    this.getDateNow()
    // //console.log('enter')
    let myvalue = e.detail.value
    let msgList = this.data.msgList

    let isNull = this.isEmpty(myvalue)
    if(isNull) {
      wx.showModal({
        title: '提示',
        content: '不可以发送空白文字哦～',
        showCancel: false,
        success: function (res) { }
      })
      this.setData({
        massage: ''
      })
      return
    }

    //console.log(isNull)


    let res = await api.sendMessage({
      query: {
        type: '1',
        content: myvalue,
        acceptUserId: this.data.launchUserId
      },
    })
    if (res.data.success) {
      if (myvalue) {
        let mymsg = {
          "createTime": this.data.nowDate,
          "type": "1",
          "content": myvalue,
          "launchUserId": this.data.acceptUserId
        }
        msgList.push(mymsg)
        // let focusFlag = true
        this.setData({
          // focusFlag,
          msgList,
          massage: ''
        })
      }
    }


    this.bottom()
    // this.toBottom()
  },



  //识别语音 -- 初始化
  initRecord: function() {
    const that = this;
    // 有新的识别内容返回，则会调用此事件
    manager.onRecognize = function(res) {
      //console.log(res)
    }
    // 正常开始录音识别时会调用此事件
    manager.onStart = function(res) {
      //console.log("成功开始录音识别", res)
    }
    // 识别错误事件
    manager.onError = function(res) {
      //console.error("error msg", res)
    }
    //识别结束事件
    manager.onStop = function(res) {
      //console.log('..............结束录音')
      //console.log('录音临时文件地址 -->' + res.tempFilePath);
      //console.log('录音总时长 -->' + res.duration + 'ms');
      //console.log('文件大小 --> ' + res.fileSize + 'B');
      //console.log('语音内容 --> ' + res.result);
      if (res.result == '') {
        wx.showModal({
          title: '提示',
          content: '听不清楚，请重新说一遍！',
          showCancel: false,
          success: function(res) {}
        })
        return;
      }
      var text = that.data.content + res.result;
      that.setData({
        content: text,
        video_vioce: 3,
        bs_video: 0
      })
    }
  },

  // 点击语音
  sendVideo: function() {
    //console.log('点击语音')

    // 播放获取的语音
    // innerAudioContext.autoplay = true
    // innerAudioContext.src = this.tempFilePath,
    //   innerAudioContext.onPlay(() => {
    //     //console.log('开始播放')
    //   })
    // innerAudioContext.onError((res) => {
    //   //console.log(res.errMsg)
    //   //console.log(res.errCode)
    // })
  },

  // 长按语音
  handleLongPress: function() {
    let that = this
    //console.log('长按')
    let video_vioce = 1;
    let bs_video = 1
    that.myradom();
    that.setData({
      video_vioce: video_vioce,
      bs_video,
      content: ''
    })

    // 语音开始识别
    manager.start({
      lang: 'zh_CN', // 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
      duration: 60000
    })



    // 开始录音
    // const options = {
    //   duration: 60000,//指定录音的时长，单位 ms
    //   sampleRate: 16000,//采样率
    //   numberOfChannels: 1,//录音通道数
    //   encodeBitRate: 96000,//编码码率
    //   format: 'mp3',//音频格式，有效值 aac/mp3
    //   frameSize: 50,//指定帧大小，单位 KB
    // }
    // //开始录音
    // recorderManager.start(options);
    // recorderManager.onStart(() => {
    //   //console.log('recorder start')
    // });
    // //错误回调
    // recorderManager.onError((res) => {
    //   //console.log(res);
    // })


    // wx.startRecord({
    //   success(res) {
    //     // that.setData({
    //     //   video_vioce:2
    //     // })
    //     const tempFilePath = res.tempFilePath
    //     //console.log(tempFilePath)
    //     // wx.downloadFile({
    //     //   url: tempFilePath, //仅为示例，并非真实的资源
    //     //   success(res) {

    //     //     //console.log('进入下载成功回调')
    //     //     // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
    //     //     if (res.statusCode === 200) {
    //     //       //console.log(res.tempFilePath)
    //     //       wx.playVoice({
    //     //         filePath: res.tempFilePath
    //     //       })
    //     //     }
    //     //   }
    //     // })

    //     // 获取的声音成功传给后台并且返回文字
    //     // 模拟成功
    //     setTimeout(()=>{
    //       that.setData({
    //         video_vioce:3
    //       })
    //     },2000)
    //   }
    // })
  },


  // 点击结束事件
  touchEnd: function() {
    //console.log('松开')

    if (this.data.bs_video == 1) {
      //console.log('长按松开')

      this.setData({
        video_vioce: 3,
        bs_video: 0
      })

      // 获取录音的文件临时地址
      // recorderManager.stop();
      // recorderManager.onStop((res) => {
      //   this.tempFilePath = res.tempFilePath;
      //   //console.log('停止录音', res.tempFilePath)
      //   const { tempFilePath } = res

      // })
      // wx.stopRecord()


      // 语音结束识别
      manager.stop();


    }
  },

  // 关闭语音转换文字
  close: function() {
    let video_vioce = 0;
    wx.stopRecord()
    this.setData({
      video_vioce: video_vioce
    })
  },

  closeVideo() {
    this.close()
  },

  // textarea 发生改变的时候触发函数
  changeText(e) {
    this.setData({
      content: e.detail.value
    })
  },

  async sendVideoText() {
    this.getDateNow()
    let myvalue = this.data.content
    let msgList = this.data.msgList

    if (!myvalue || this.isEmpty(myvalue)) {
      wx.showModal({
        title: '提示',
        content: '不可以发送空白文字哦～',
        showCancel: false,
        success: function(res) {}
      })
      return
    }

    if (this.data.isShield) {
      wx.showModal({
        title: '提示',
        content: '您已屏蔽此人，请取消屏蔽后再发送消息',
        showCancel: false,
        success: function(res) {}
      })
      return
    }

    let sendvideo = await api.sendMessage({
      query: {
        type: '1',
        content: myvalue,
        acceptUserId: this.data.launchUserId
      }
    })
    if (sendvideo.data.success) {
      let mymsg = {
        "createTime": this.data.nowDate,
        "type": "1",
        "content": myvalue,
        "launchUserId": this.data.acceptUserId
      }
      msgList.push(mymsg)


      this.setData({
        // focusFlag,
        msgList,
        massage: ''
      })
      this.bottom();
      this.close();
    }

  },

  // 点击加号
  sendAdd: function() {
    //console.log('点击加号')
    this.bottom()
    let increase = !this.data.increase
    let add_cover = true
    let inputHeight = 0
    if (increase) {
      add_cover = true
      inputHeight = 10

    } else {
      add_cover = false
      inputHeight = 0
    }
    this.setData({
      increase: increase,
      aniStyle: true,
      focusFlag: false,
      add_cover: add_cover,
      inputHeight: inputHeight
    })
  },



  // 进页面底端
  tobottom: function () {
    let that = this
    var query = wx.createSelectorQuery()
    query.select('#scroll-flag').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      //console.log(res)
      wx.pageScrollTo({
        selector: '#scroll-flag',
        duration: 0
      })
    })
  },


  //聊天消息始终显示最底端

  bottom: function() {
    let that = this

    var query = wx.createSelectorQuery()

    query.select('#scroll-flag').boundingClientRect()

    query.selectViewport().scrollOffset()

    query.exec(function(res) {
      //console.log(res)

      wx.pageScrollTo({

        //scrollTop: res[1].scrollTop + res[0].bottom + 500, // #the-id节点的下边界坐标
        selector: '#scroll-flag'

      })

      // res[1].scrollTop // 显示区域的竖直滚动位置
      // that.setData({
      //   scrollTop:9999999
      // })
    })

  },

  // toBottom:function () {
  //   let v_index = this.data.msgList.length - 1
  //   let v_id = 'bottom' + v_index
  //   this.setData({
  //     toBottom:v_id
  //   })
  // },


  // 图片显示错误
  erroeImage(e) {
    //console.log(e)
    let errorId = e.target.id
    let errorIndexList = errorId.split('-')
    let errorIndex = errorIndexList[1]
    let msgList = this.data.msgList
    // //console.log(msgList[errorIndex], '错误数组')
    msgList[errorIndex].content = "../../../images/msg/err-img.png"
    this.setData({
      msgList
    })
  },


  //图片预览

  previewImg(e) {
    // //console.log(e)

    var that = this

    //必须给对应的wxml的image标签设置data-set=“图片路径”，否则接收不到



    var res = e.target.dataset.src.length == 1 ? e.target.dataset.src[0] : e.target.dataset.src

    var list = this.data.previewImgList //页面的图片集合数组

    let msgList = that.data.msgList

    var previewImgList = []

    //判断res在数组中是否存在，不存在则push到数组中, -1表示res不存在

    if (list.indexOf(res) == -1) {

      this.data.previewImgList.push(res)
      // this.setData({
      //   previewImgList:list
      // })

    }

    a = true
    wx.previewImage({

      current: res, // 当前显示图片的http链接

      urls: that.data.previewImgList, // 需要预览的图片http链接列表
      success: function() {
        that.setData({
          msgList
        })
      }

    })

  },



  // increase() {

  //   this.setData({

  //     increase: true,

  //     aniStyle: true

  //   })

  // },

  //点击空白隐藏message下选框

  outbtn() {
    this.setData({
      increase: false,
      // aniStyle: true,
      add_cover: false
    })

  },

  // 加载 数字叠加函数
  addNumber: function() {
    console.log('1111111')
    var that = this
    let num = 10;
    let tips = num + "%";

    var a = setInterval(function() {
      //循环执行代码 
      //console.log(num + '%')
      num = num + 10
      that.setData({
        tips: num + '%'
      })
      if (num >= 90) {
        clearInterval(a)
      }
    }, 100)
    // setTimeout(()=>{
    //   if(num < 100){
    //     this.setData({
    //       tips: (num += 10) + '%'
    //     })
    //   }
    // },100)
  },


  // 点击相册
  async chooseImage() {
    var that = this
    let msgList = that.data.msgList
    wx.chooseImage({
      count: 9,
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // that.setData({

        // })
        //console.log(res)
        var tempFilePaths = res.tempFilePaths
        //console.log(tempFilePaths)
        // wx.uploadFile({
        //   url: '',
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   headers: {
        //     'Content-Type': 'form-data'
        //   },
        //   success:function(res){
        //     if(res.data) {

        //     }
        //   }
        // })

        if (that.data.isShield) {
          wx.showModal({
            title: '提示',
            content: '您已屏蔽此人，请取消屏蔽后再发送消息',
            showCancel: false,
            success: function(res) {}
          })
          return
        }

        for (let i = 0; i < tempFilePaths.length; i++) {
          // 模拟
          that.getDateNow()
          let mymsg = {
            "createTime": that.data.nowDate,
            "type": "2",
            "content": tempFilePaths[i],
            "acceptUserId": that.data.launchUserId
          }
          msgList.push(mymsg)
          // //console.log(msgList)
          that.setData({
            msgList,
            show: true
          })
          that.bottom()

          that.sendImage(tempFilePaths[i])
        }





        // let sendImage = await api.sendMessage({
        //   query : {
        //     "type": "2",
        //     "content": tempFilePaths[0],
        //     "launchUserId": that.data.acceptUserId
        //   }
        // })
        // //console.log(sendImage)
        // if(sendImage.data.success) {
        //   // 成功后的加载函数
        //   that.addNumber()
        //   setTimeout(() => {
        //     let tips = '100%';
        //     if (tips == '100%') {
        //       that.setData({
        //         tips: tips,
        //         show: false
        //       })
        //     }
        //   }, 1000)
        // }








      }
    })
  },
  async resizeLogin(url) {
    let res = await api.wxlogin();
    this.sendImage(url);
  },
  async sendImage(url) {
    let that = this
    wx.uploadFile({
      url: api.BASE_PATH + '/carte/message/send',
      filePath: url,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('cookie')
      },
      formData: {
        "type": "2",
        "acceptUserId": this.data.launchUserId
      },
      success(res) {
        // 成功后的加载函数
        console.log(JSON.parse(res.data))
        if (JSON.parse(res.data).code == '0002') {
          that.resizeLogin(url);
        } else if (JSON.parse(res.data).success){
          that.addNumber()
          setTimeout(() => {
            let tips = '100%';
            if (tips == '100%') {
              that.setData({
                tips: tips,
                show: false
              })
            }
          }, 1000)
        }
      }
    })
    // let sendImage = await api.sendMessage({
    //   query:{
    //     "type": "2",
    //     "content": url,
    //     "launchUserId": this.data.acceptUserId
    //   }
    // })
    // if (sendImage.data.success) {
    //   // 成功后的加载函数
    //   that.addNumber()
    //   setTimeout(() => {
    //     let tips = '100%';
    //     if (tips == '100%') {
    //       that.setData({
    //         tips: tips,
    //         show: false
    //       })
    //     }
    //   }, 1000)
    // }
  },


  // 唤起相机
  async chooseCamera() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // //console.log(res)
        var tempFilePaths = res.tempFilePaths
        // //console.log(tempFilePaths)


        if (that.data.isShield) {
          wx.showModal({
            title: '提示',
            content: '您已屏蔽此人，请取消屏蔽后再发送消息',
            showCancel: false,
            success: function(res) {}
          })
          return
        }

        // 模拟
        that.getDateNow()
        let msgList = that.data.msgList
        let mymsg = {
          "createTime": that.data.nowDate,
          "type": "2",
          "content": tempFilePaths[0],
          "acceptUserId": that.data.launchUserId
        }
        msgList.push(mymsg)
        that.setData({
          msgList,
          show: true
        })
        that.bottom()

        // let sendImage = api.sendMessage({
        //   query: {
        //     "type": "2",
        //     "content": tempFilePaths,
        //     "launchUserId": that.data.acceptUserId
        //   }
        // })
        // if(sendImage.data.success) {
        //   // 成功后的加载函数
        //   that.addNumber()
        //   setTimeout(() => {
        //     let tips = '100%';
        //     if (tips == '100%') {
        //       that.setData({
        //         tips: tips,
        //         show: false
        //       })
        //     }
        //   }, 1000)
        // }
        that.sendImage(tempFilePaths[0])
      }
    })
  },

  // 查看详情
  toDetails: function() {
    //console.log(app.globalData.isvip)
    let isVip = app.globalData.isvip
    if (isVip) {
      // vip用户
      wx.navigateTo({
        url: '/pages/ai/customer-detail?launchUserId=' + this.data.launchUserId,
      })
    } else {
      // 非vip
      this.setData({
        unCttVipFlag: false
      })
    }
  },


  // 获取数据
  async getMsgList() {

    // 获取头像
    let response = await api.messageAvatar({
      query: {
        id: this.data.launchUserId
      }
    })

    // 消息列表
    let res = await api.messageDetail({
      query: {
        launchUserId: this.data.launchUserId
      }
    })
    if (res.data.success) {
      let msgList = res.data.data.pageInfo.list
      msgList = msgList.reverse()
      let allpages = res.data.data.pageInfo.lastPage
      this.setData({
        msgList,
        allpages
      })
      let that = this
      that.tobottom()
      // setTimeout(() => {
      //   that.tobottom()
      // }, 100)
    }

    // 屏蔽状态
    let resshiled = await api.messageShiled({
      query: {
        shieldUserId: this.data.launchUserId,
      }
    })

    let youravatar = response.data.data.avatarPath
    let mytitle = response.data.data.weChatNickname;

    let storageUserInfo = wx.getStorageSync('userInfoObj');
    // //console.log(storageUserInfo)
    let myavatar = storageUserInfo.avatarPath
    // let msgList = res.data.data.pageInfo.list
    // msgList = msgList.reverse()

    let isShield
    if (resshiled.data.code == "3043") {
      isShield = false
    } else if (resshiled.data.code == "3042") [
      isShield = true
    ]
    // let allpages = res.data.data.pageInfo.lastPage
    this.setData({
      mytitle,
      // msgList,
      youravatar,
      myavatar,
      isShield,
      // allpages
    })
  },

  //我的随机数
  myradom: function() {
    const that = this;
    var _radomheight = that.data.radomheight;
    for (var i = 0; i < that.data.radomheight.length; i++) {
      //+1是为了避免为0
      _radomheight[i] = (30 * Math.random().toFixed(2)) + 10;
    }
    that.setData({
      radomheight: _radomheight
    });
    setTimeout(function() {
      that.myradom();
    }, 300);
  }

})