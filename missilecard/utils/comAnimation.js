
/* 
* 常用动画类 
*/
export default class comAnimation {

  /*
  * 隐藏效果
  */
  static hidden(that, param) {
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    });
    that.animation = animation;
    animation.opacity(0).step();
    var json = `{"${param}":""}`;
    json = JSON.parse(json)
    json[param] = animation.export()
    that.setData(json);
  }
  /*
  * 渐入渐出效果
   */
  static toggleShow(that, param, opacityStart, opacityEnd){
    const animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    });
    that.animation = animation;
    animation.opacity(opacityStart).step();
    var json = `{"${param}":""}`;
    json = JSON.parse(json)
    json[param] = animation.export()
    that.setData(json);
    setTimeout(() => {
      animation.opacity(opacityEnd).step();
      var json = `{"${param}":""}`;
      json = JSON.parse(json)
      json[param] = animation.export()
      that.setData(json);
    },400)
   }

  /*
  * 渐入效果
  */
  static fadeIn(that, param, opacityEnd) {
    const animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    });
    that.animation = animation;
    animation.opacity(opacityEnd).step();
    var json = `{"${param}":""}`;
    json = JSON.parse(json)
    json[param] = animation.export()
    that.setData(json);
    // setTimeout(() => {
    //   animation.opacity(opacityEnd).step();
    //   var json = `{"${param}":""}`;
    //   json = JSON.parse(json)
    //   json[param] = animation.export()
    //   that.setData(json);
    // }, 600)
  }

}