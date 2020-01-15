import regeneratorRuntime from '../utils/regenerator-runtime/runtime-module';
import tip from '../utils/tip';

// const BASE_PATH = 'http://10.10.7.159:8083';
const BASE_PATH = 'https://xcx.912688.com';
//测试环境
// const BASE_PATH = 'http://10.10.7.88:8081';

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []
const wxRequest = async (params = {}, url) => {
  // if (params.offLoading) {
    
  //   if (params.offMask) {
  //     tip.loading("加载中", false);
  //   } else {
  //     tip.loading();
  //   }
  // }
  let data = params.query || {};
  let headers = params.headers || {
    'content-type': 'application/x-www-form-urlencoded' // 默认值
  };
  let token = wx.getStorageSync('cookie') || '';
  try {
    let res = await new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: params.method || 'POST',
        data: data,
        header: Object.assign({
          // set something global
          'Cookie': 'JSESSIONID=' + token
        }, headers),
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(res)
        },
        complete: (e) => {
          // wx.hideLoading();
          // tip.loaded();
        }
      })
    })
    if (res.data.code == '0002' && !res.data.success) {
      if (!isRefreshing) {
        isRefreshing = true;
        let sessionId = await wxlogin();
        isRefreshing = false;
        if (sessionId) {
          requests.forEach(item => item());
          requests = [];
          return wxRequest(params, url)
        } else {
          // wx.navigateTo({
          //   url: '/pages/login/login'
          // });
        }
      } else {
        return new Promise((resolve) => {
          requests.push(() => {
            resolve(wxRequest(params, url));
          })
        })

      }
    }
    return res;

  } catch (e) {
    tip.loaded();
    if (e.errMsg == 'request:fail timeout') {
      tip.error('请求超时，请重试');
    } else {
      tip.error('未知错误，请重试');
    }
    // wx.showToast({
    //   title: 'request:fail timeout',
    //   icon: 'none',
    //   duration: 2000
    // })
  }
}

const wxlogin = async (params = {}, url, callback) => {
  try {
    let res = await new Promise((resolve, reject) => {
      wx.login({
        success(response) {
          if (response.code) {
            wx.request({
              method: 'post',
              // url: "https://xcx.912688.com/carte/login",
              url: BASE_PATH + "/carte/login",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                code: response.code || '', //临时登录凭证
                // rawData: res.rawData || '', //用户非敏感信息
                // signature: res.signature || '', //签名
                // encrypteData: res.encryptedData || '', //用户敏感信息
                // iv: res.iv || '' //解密算法的向量
              },
              success: function (res) {
                let sessionId = res.data.data;
                try {
                  wx.setStorageSync('cookie', sessionId)
                } catch (e) { }
                resolve(sessionId);
              }
            })
            
          } else {
            // console.log('登录失败！' + res.errMsg)
            reject();
          }
        }
      })
    })
    return res
  } catch (e) {
    // tip.loaded();
    // if (e.errMsg == 'request:fail timeout') {
    //   tip.error('请求超时，请重试');
    // } else {
    //   tip.error('未知错误，请重试');
    // }
  }
}


//登录
const getsessionId = (params) => wxRequest(params, BASE_PATH + "/carte/login");

//上传用户信息
const upUserNickName = (params) => wxRequest(params, BASE_PATH + "/carte/user/update");

//商品营销商品列表
const getProdList = (params) => wxRequest(params, BASE_PATH + "/carte/market/shop_product_list");

//商品营销商品详情
const getProddetail = (params) => wxRequest(params, BASE_PATH + "/carte/market/prod_detail");

//获取名片模板列表
const getCardTemplate = (params, callback) => wxRequest(params, BASE_PATH + "/carte/template/select");

//商品详情 添加询盘
const goodsSendPrice = (params) => wxRequest(params, BASE_PATH + "/carte/market/ask_add");

//获取名片详情
const getcardInfor = (params, callback) => wxRequest(params, BASE_PATH + "/carte/select");

//更新名片
const updateCard = (params) => wxRequest(params, BASE_PATH + "/carte/update");

//新增名片
const addCard = (params) => wxRequest(params, BASE_PATH + "/carte/add");

//小程序二维码
const mini_qr = (params) => wxRequest(params, BASE_PATH + "/carte/we_chat/get_carte_mini_qr");

//根据名片id获取名片信息
const carte_info = (params) => wxRequest(params, BASE_PATH + "/carte/share/carte_info");

//头像上传
const avatar_upload = (params) => wxRequest(params, BASE_PATH + "/carte/avatar_upload_url");

//添加分享者的名片
const addShareCard = (params) => wxRequest(params, BASE_PATH + "/carte/client/client_add");

//邀请者添加接受者的名片
const addAcceptCard = (params) => wxRequest(params, BASE_PATH + "/carte/client/client_add_user_id");

//用户信息,判断是不是搜好货用户
const userInfo = (params) => wxRequest(params, BASE_PATH + "/carte/user/current_info");

//用户解绑搜好货
const unbindShh = (params) => wxRequest(params, BASE_PATH + "/carte/user/unbind_account");

//用户更新搜好货
const updateShh = (params) => wxRequest(params, BASE_PATH + "/carte/user/bind_account");


//一期接口整合
//账号绑定
const accountBind = (params) => wxRequest(params, BASE_PATH + "/carte/mine/associate_account");

const allList = (params) => wxRequest(params, BASE_PATH + "/carte/label/all_list");

const clientUpdate = (params) => wxRequest(params, BASE_PATH + "/carte/client/client_update");

const clientSelect = (params) => wxRequest(params, BASE_PATH + "/carte/client_select");

const clientList = (params) => wxRequest(params, BASE_PATH + "/carte/client/client_list");

const clientAllList = (params) => wxRequest(params, BASE_PATH + "/carte/client/all_list");

const categoryNum = (params) => wxRequest(params, BASE_PATH + "/carte/client/category_and_num");

const categorySubclass = (params) => wxRequest(params, BASE_PATH + "/carte/category/subclass");

const cartCliUpdate = (params) => wxRequest(params, BASE_PATH + "/carte/client_update");

const carteCateParent = (params) => wxRequest(params, BASE_PATH + "/carte/category/parent");

const clientAdd = (params) => wxRequest(params, BASE_PATH + "/carte/client_add");

const companyAddUpdate = (params) => wxRequest(params, BASE_PATH + "/carte/market/company_add_update");

const comMarketInfo = (params) => wxRequest(params, BASE_PATH + "/carte/share/company_marketing_info");

const markCominfo = (params) => wxRequest(params, BASE_PATH + "/carte/market/company_marketing_info");

const shopPdList = (params) => wxRequest(params, BASE_PATH + "/carte/share/shop_product_list");

const smsVeriCode = (params) => wxRequest(params, BASE_PATH + "/carte/mine/sms_verification_code");

const registAccount = (params) => wxRequest(params, BASE_PATH + "/carte/mine/registered_associate_account");

const addProposal = (params) => wxRequest(params, BASE_PATH + "/carte/mine/add_proposal");

const companyInfo = (params) => wxRequest(params, BASE_PATH + "/carte/market/company_info");

//''
/*
  导弹名片二期接口
*/
//名片-获取公司信息
const getUserCompanyDet = (params) => wxRequest(params, BASE_PATH + "/carte/user/company_info");

//名片-获取手机号码
const authPhone = (params) => wxRequest(params, BASE_PATH + "/carte/user/auth_phone");

//添加“查看名片”后的行为跟踪记录
const viewCarte = (params) => wxRequest(params, BASE_PATH + "/carte/behavior_track/view_carte");

//添加点赞名片后的行为跟踪记录
const likeCardAdd = (params) => wxRequest(params, BASE_PATH + "/carte/behavior_track/like_add");

//添加转发个人名片后的行为跟踪记录
const forwardCarte = (params) => wxRequest(params, BASE_PATH + "/carte/behavior_track/forward_carte");

//添加保存为客户
const saveAsCustomer = (params) => wxRequest(params, BASE_PATH + "/carte/behavior_track/save_as_customer");

//添加互换名片
const exchangeCarte = (params) => wxRequest(params, BASE_PATH + "/carte/behavior_track/exchange_carte");

//查看企业营销
const viewCompany = (params) => wxRequest(params, BASE_PATH + "/carte/behavior_track/view_company");

//查看产品营销
const viewProduct = (params) => wxRequest(params, BASE_PATH + "/carte/behavior_track/view_product");

//查看场景营销
const viewScene = (params) => wxRequest(params, BASE_PATH + "/carte/behavior_track/view_scene");

//频道页-采神宝、采通通、直飞宝
const channelMessage = (params) => wxRequest(params, BASE_PATH + "/applets/zfb_message_add");


//AI-雷达-全部雷达线索
const radarList = (params) => wxRequest(params, BASE_PATH + "/carte/analysis/guest/detail");

//AI-雷达-数据总览
const radarAnalysis = (params) => wxRequest(params, BASE_PATH + "/carte/analysis/radar/analysis");

//AI-客脉-数据总览
const guestNetwork = (params) => wxRequest(params, BASE_PATH + "/carte/analysis/guest");

//AI-客脉-互动记录
const aiInteractiveRecord = (params) => wxRequest(params, BASE_PATH + "/carte/analysis/guest/page");

//AI-客脉-客户详情
const aiCustomerDetail = (params) => wxRequest(params, BASE_PATH + "/carte/analysis/guest/detail");

//首页-雷达-列表
const indexRadarList = (params) => wxRequest(params, BASE_PATH + "/carte/home/radar_list");

//首页-雷达-待办事项
const waitMessage = (params) => wxRequest(params, BASE_PATH + "/carte/home/to_do_list");

//首页-雷达-待办事项
const noReadUserList = (params) => wxRequest(params, BASE_PATH + "/carte/message/not_read_user_list");



// 消息列表
const messageList = (params) => wxRequest(params, BASE_PATH + "/carte/message/record_list");

// 发送消息
const sendMessage = (params) => wxRequest(params, BASE_PATH + "/carte/message/send");

// 聊天内容获取 头像
const messageDetail = (params) => wxRequest(params, BASE_PATH + "/carte/message/detail"); 

const messageAvatar = (params) => wxRequest(params, BASE_PATH + "/carte/user/info_by_user_id");

// 屏蔽状态
const messageShiled = (params) => wxRequest(params, BASE_PATH + "/carte/message/shield_info");

// // 消息屏蔽
// const messageShield = (params) => wxRequest(params, BASE_PATH + "/carte/message/shield");

// // 取消屏蔽
// const messageUnShield = (params) => wxRequest(params, BASE_PATH + "/carte/message/cancel_shield");

// 是否屏蔽接口
const isShield = (params) => wxRequest(params, BASE_PATH + "/carte/message/update_shield");

module.exports = {
  BASE_PATH,
  getProdList,
  getProddetail,
  getCardTemplate,
  getcardInfor,
  goodsSendPrice,
  getsessionId,
  wxlogin,
  updateCard,
  addCard,
  mini_qr,
  carte_info,
  avatar_upload,
  addShareCard,
  addAcceptCard,
  userInfo,
  upUserNickName,
  unbindShh,
  updateShh,
  accountBind,
  //一期接口整合
  allList,
  clientUpdate,
  clientSelect,
  clientList,
  clientAllList,
  categoryNum,
  cartCliUpdate,
  carteCateParent,
  categorySubclass,
  clientAdd,
  companyAddUpdate,
  comMarketInfo,
  markCominfo,
  shopPdList,
  smsVeriCode,
  registAccount,
  addProposal,
  companyInfo,
  //导弹名片二期
  viewCarte,
  likeCardAdd,
  forwardCarte,
  saveAsCustomer,
  exchangeCarte,
  viewCompany,
  viewProduct,
  viewScene,
  channelMessage,
  radarList,
  radarAnalysis,
  guestNetwork,
  aiInteractiveRecord,
  aiCustomerDetail,
  messageList,
  sendMessage,
  messageDetail,
  messageAvatar,
  messageShiled,
  isShield,
  indexRadarList,
  waitMessage,
  noReadUserList,
  getUserCompanyDet,
  authPhone
}
