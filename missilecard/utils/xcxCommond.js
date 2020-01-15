import regeneratorRuntime from '../utils/regenerator-runtime/runtime-module';

//唤起判断用户相册有没有授权
const handleSetting =  async (that)=> {
  let response = await new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        let authorShowFlag;
        if (res.authSetting['scope.writePhotosAlbum'] !== undefined) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            authorShowFlag = true;
            that.setData({
              authorShowFlag: true
            })
          } else {
            that.setData({
              authorShowFlag: false
            })
            authorShowFlag = false;
          }
        } else {
          authorShowFlag = false;
        }
        resolve(authorShowFlag)
      },
      fail: (res) => {
        console.log(res);
      }
    })
  })
  return response
}
//检测用户对象有没有变化
const checkUserIsChange = (userInfoObj, newUserObj)=>{
    let list = [];
    let flag = false;
    let avatar1 = userInfoObj.avatarPath;
    let avatar2 = newUserObj.avatarPath;
    list = newUserObj.avatarPath.split(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
    newUserObj.avatarPath = list[0];
    list = userInfoObj.avatarPath.split(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
    userInfoObj.avatarPath = list[0];
    for (let key in userInfoObj) {
      if (newUserObj[key] != userInfoObj[key]) {
        flag = true;
      }
    }
    userInfoObj.avatarPath = avatar1;
    newUserObj.avatarPath = avatar2;
    return flag
}

const checkListIsChange = (oldCustomerMessList, newCustomerMessList)=>{
  if (Object.prototype.toString.call(oldCustomerMessList) != '[object Array]' || Object.prototype.toString.call(newCustomerMessList) != '[object Array]'){
    return
  }
  let avatarList = [];
  newCustomerMessList.forEach((item, index, array) => {
    avatarList = (item.avatarPath || "").split('?');
    item.avatarPath = avatarList[0];
  })
  oldCustomerMessList.forEach((item, index, array) => {
    avatarList = (item.avatarPath || "").split('?');
    item.avatarPath = avatarList[0];
  })
  let list = [];
  for (let i = 0; i < oldCustomerMessList.length; i++) {
    for (let key in oldCustomerMessList[i]) {
      if (oldCustomerMessList[i][key] != newCustomerMessList[i][key]) {
        list.push(i);
        break;
      }
    }
  }
  return list
}

module.exports = {
  handleSetting,
  checkUserIsChange,
  checkListIsChange
}