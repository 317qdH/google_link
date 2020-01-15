'use strict';

var _showdown = require('./showdown.js');

var _showdown2 = _interopRequireDefault(_showdown);

var _html2json = require('./html2json.js');

var _html2json2 = _interopRequireDefault(_html2json);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
                                                                                                                                                                                                                   * author: Di (微信小程序开发工程师)
                                                                                                                                                                                                                   * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
                                                                                                                                                                                                                   *               垂直微信小程序开发交流社区
                                                                                                                                                                                                                   * 
                                                                                                                                                                                                                   * github地址: https://github.com/icindy/wxParse
                                                                                                                                                                                                                   * 
                                                                                                                                                                                                                   * for: 微信小程序富文本解析
                                                                                                                                                                                                                   * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
                                                                                                                                                                                                                   */

/**
 * utils函数引入
 **/


/**
 * 配置及公有属性
 **/
var realWindowWidth = 0;
var realWindowHeight = 0;
wx.getSystemInfo({
  success: function success(res) {
    realWindowWidth = res.windowWidth;
    realWindowHeight = res.windowHeight;
  }
});
/**
 * 主函数入口区
 **/
function wxParse() {
  var bindName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'wxParseData';
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'html';
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '<div class="color:red;">数据不能为空</div>';
  var target = arguments[3];
  var imagePadding = arguments[4];

  var that = target;
  var transData = {}; //存放转化后的数据
  if (type == 'html') {
    transData = _html2json2.default.html2json(data, bindName);
    // console.log(JSON.stringify(transData, ' ', ' '));
  } else if (type == 'md' || type == 'markdown') {
    var converter = new _showdown2.default.Converter();
    var html = converter.makeHtml(data);
    transData = _html2json2.default.html2json(html, bindName);
    // console.log(JSON.stringify(transData, ' ', ' '));
  }
  transData.view = {};
  transData.view.imagePadding = 0;
  if (typeof imagePadding != 'undefined') {
    transData.view.imagePadding = imagePadding;
  }
  var bindData = {};
  bindData[bindName] = transData;
  that.setData(bindData);
  that.wxParseImgLoad = wxParseImgLoad;
  that.wxParseImgTap = wxParseImgTap;

  //新增
  bindData.wxParseImgLoad = wxParseImgLoad;
  bindData.wxParseImgTap = wxParseImgTap;
  return bindData;
}

// 图片点击事件
function wxParseImgTap(e, bindData) {}
// var that = this
// var nowImgUrl = e.target.dataset.src
// var tagFrom = e.target.dataset.from

// if (typeof(tagFrom) != 'undefined' && tagFrom.length > 0) {
//   wx.previewImage({
//     current: nowImgUrl, // 当前显示图片的http链接
//     urls: bindData[tagFrom].imageUrls // 需要预览的图片http链接列表
//   })
// }


/**
 * 图片视觉宽高计算函数区 
 **/
function wxParseImgLoad(e) {
  var that = this;
  var tagFrom = e.target.dataset.from;
  var idx = e.target.dataset.idx;
  if (typeof tagFrom != 'undefined' && tagFrom.length > 0) {
    calMoreImageInfo(e, idx, that, tagFrom);
  }
}

// 假循环获取计算图片视觉最佳宽高
function calMoreImageInfo(e, idx, that, bindName) {
  var _that$setData;

  var temData = that.data[bindName];
  if (!temData || temData.images.length == 0) {
    return;
  }
  var temImages = temData.images;
  //因为无法获取view宽度 需要自定义padding进行计算，稍后处理
  var recal = wxAutoImageCal(e.detail.width, e.detail.height, that, bindName);
  // temImages[idx].width = recal.imageWidth;
  // temImages[idx].height = recal.imageheight; 
  // temData.images = temImages;
  // var bindData = {};
  // bindData[bindName] = temData;
  // that.setData(bindData);
  var index = temImages[idx].index;
  var key = '' + bindName;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = index.split('.')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var i = _step.value;
      key += '.nodes[' + i + ']';
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var keyW = key + '.width';
  var keyH = key + '.height';
  that.setData((_that$setData = {}, _defineProperty(_that$setData, keyW, recal.imageWidth), _defineProperty(_that$setData, keyH, recal.imageheight), _that$setData));
}

// 计算视觉优先的图片宽高
function wxAutoImageCal(originalWidth, originalHeight, that, bindName) {
  //获取图片的原始长宽
  var windowWidth = 0,
      windowHeight = 0;
  var autoWidth = 0,
      autoHeight = 0;
  var results = {};
  var padding = that.data[bindName].view.imagePadding;
  windowWidth = realWindowWidth - 2 * padding;
  windowHeight = realWindowHeight;
  //判断按照那种方式进行缩放
  // console.log("windowWidth" + windowWidth);
  if (originalWidth > windowWidth) {
    //在图片width大于手机屏幕width时候
    autoWidth = windowWidth;
    // console.log("autoWidth" + autoWidth);
    autoHeight = autoWidth * originalHeight / originalWidth;
    // console.log("autoHeight" + autoHeight);
    results.imageWidth = autoWidth;
    results.imageheight = autoHeight;
  } else {
    //否则展示原来的数据
    results.imageWidth = originalWidth;
    results.imageheight = originalHeight;
  }
  return results;
}

function wxParseTemArray(temArrayName, bindNameReg, total, that) {
  var array = [];
  var temData = that.data;
  var obj = null;
  for (var i = 0; i < total; i++) {
    var simArr = temData[bindNameReg + i].nodes;
    array.push(simArr);
  }

  temArrayName = temArrayName || 'wxParseTemArray';
  obj = JSON.parse('{"' + temArrayName + '":""}');
  obj[temArrayName] = array;
  that.setData(obj);
}

/**
 * 配置emojis
 * 
 */

function emojisInit() {
  var reg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var baseSrc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "/wxParse/emojis/";
  var emojis = arguments[2];

  _html2json2.default.emojisInit(reg, baseSrc, emojis);
}

module.exports = {
  wxParse: wxParse,
  wxParseImgTap: wxParseImgTap,
  wxParseTemArray: wxParseTemArray,
  emojisInit: emojisInit
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInd4UGFyc2UuanMiXSwibmFtZXMiOlsicmVhbFdpbmRvd1dpZHRoIiwicmVhbFdpbmRvd0hlaWdodCIsInd4IiwiZ2V0U3lzdGVtSW5mbyIsInN1Y2Nlc3MiLCJyZXMiLCJ3aW5kb3dXaWR0aCIsIndpbmRvd0hlaWdodCIsInd4UGFyc2UiLCJiaW5kTmFtZSIsInR5cGUiLCJkYXRhIiwidGFyZ2V0IiwiaW1hZ2VQYWRkaW5nIiwidGhhdCIsInRyYW5zRGF0YSIsImh0bWwyanNvbiIsImNvbnZlcnRlciIsIkNvbnZlcnRlciIsImh0bWwiLCJtYWtlSHRtbCIsInZpZXciLCJiaW5kRGF0YSIsInNldERhdGEiLCJ3eFBhcnNlSW1nTG9hZCIsInd4UGFyc2VJbWdUYXAiLCJlIiwidGFnRnJvbSIsImRhdGFzZXQiLCJmcm9tIiwiaWR4IiwibGVuZ3RoIiwiY2FsTW9yZUltYWdlSW5mbyIsInRlbURhdGEiLCJpbWFnZXMiLCJ0ZW1JbWFnZXMiLCJyZWNhbCIsInd4QXV0b0ltYWdlQ2FsIiwiZGV0YWlsIiwid2lkdGgiLCJoZWlnaHQiLCJpbmRleCIsImtleSIsInNwbGl0IiwiaSIsImtleVciLCJrZXlIIiwiaW1hZ2VXaWR0aCIsImltYWdlaGVpZ2h0Iiwib3JpZ2luYWxXaWR0aCIsIm9yaWdpbmFsSGVpZ2h0IiwiYXV0b1dpZHRoIiwiYXV0b0hlaWdodCIsInJlc3VsdHMiLCJwYWRkaW5nIiwid3hQYXJzZVRlbUFycmF5IiwidGVtQXJyYXlOYW1lIiwiYmluZE5hbWVSZWciLCJ0b3RhbCIsImFycmF5Iiwib2JqIiwic2ltQXJyIiwibm9kZXMiLCJwdXNoIiwiSlNPTiIsInBhcnNlIiwiZW1vamlzSW5pdCIsInJlZyIsImJhc2VTcmMiLCJlbW9qaXMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQWNBOzs7O0FBQ0E7Ozs7OztrTkFmQTs7Ozs7Ozs7Ozs7QUFXQTs7Ozs7QUFLQTs7O0FBR0EsSUFBSUEsa0JBQWtCLENBQXRCO0FBQ0EsSUFBSUMs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aSAo5b6u5L+h5bCP56iL5bqP5byA5Y+R5bel56iL5biIKVxyXG4gKiBvcmdhbml6YXRpb246IFdlQXBwRGV2KOW+ruS/oeWwj+eoi+W6j+W8gOWPkeiuuuWdmykoaHR0cDovL3dlYXBwZGV2LmNvbSlcclxuICogICAgICAgICAgICAgICDlnoLnm7Tlvq7kv6HlsI/nqIvluo/lvIDlj5HkuqTmtYHnpL7ljLpcclxuICogXHJcbiAqIGdpdGh1YuWcsOWdgDogaHR0cHM6Ly9naXRodWIuY29tL2ljaW5keS93eFBhcnNlXHJcbiAqIFxyXG4gKiBmb3I6IOW+ruS/oeWwj+eoi+W6j+WvjOaWh+acrOino+aekFxyXG4gKiBkZXRhaWwgOiBodHRwOi8vd2VhcHBkZXYuY29tL3Qvd3hwYXJzZS1hbHBoYTAtMS1odG1sLW1hcmtkb3duLzE4NFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiB1dGlsc+WHveaVsOW8leWFpVxyXG4gKiovXHJcbmltcG9ydCBzaG93ZG93biBmcm9tICcuL3Nob3dkb3duLmpzJztcclxuaW1wb3J0IEh0bWxUb0pzb24gZnJvbSAnLi9odG1sMmpzb24uanMnO1xyXG4vKipcclxuICog6YWN572u5Y+K5YWs5pyJ5bGe5oCnXHJcbiAqKi9cclxudmFyIHJlYWxXaW5kb3dXaWR0aCA9IDA7XHJcbnZhciByZWFsV2luZG93SGVpZ2h0ID0gMDtcclxud3guZ2V0U3lzdGVtSW5mbyh7XHJcbiAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICByZWFsV2luZG93V2lkdGggPSByZXMud2luZG93V2lkdGg7XHJcbiAgICByZWFsV2luZG93SGVpZ2h0ID0gcmVzLndpbmRvd0hlaWdodDtcclxuICB9XHJcbn0pXHJcbi8qKlxyXG4gKiDkuLvlh73mlbDlhaXlj6PljLpcclxuICoqL1xyXG5mdW5jdGlvbiB3eFBhcnNlKGJpbmROYW1lID0gJ3d4UGFyc2VEYXRhJywgdHlwZSA9ICdodG1sJywgZGF0YSA9ICc8ZGl2IGNsYXNzPVwiY29sb3I6cmVkO1wiPuaVsOaNruS4jeiDveS4uuepujwvZGl2PicsIHRhcmdldCwgaW1hZ2VQYWRkaW5nKSB7XHJcbiAgdmFyIHRoYXQgPSB0YXJnZXQ7XHJcbiAgdmFyIHRyYW5zRGF0YSA9IHt9OyAvL+WtmOaUvui9rOWMluWQjueahOaVsOaNrlxyXG4gIGlmICh0eXBlID09ICdodG1sJykge1xyXG4gICAgdHJhbnNEYXRhID0gSHRtbFRvSnNvbi5odG1sMmpzb24oZGF0YSwgYmluZE5hbWUpO1xyXG4gICAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodHJhbnNEYXRhLCAnICcsICcgJykpO1xyXG4gIH0gZWxzZSBpZiAodHlwZSA9PSAnbWQnIHx8IHR5cGUgPT0gJ21hcmtkb3duJykge1xyXG4gICAgdmFyIGNvbnZlcnRlciA9IG5ldyBzaG93ZG93bi5Db252ZXJ0ZXIoKTtcclxuICAgIHZhciBodG1sID0gY29udmVydGVyLm1ha2VIdG1sKGRhdGEpO1xyXG4gICAgdHJhbnNEYXRhID0gSHRtbFRvSnNvbi5odG1sMmpzb24oaHRtbCwgYmluZE5hbWUpO1xyXG4gICAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodHJhbnNEYXRhLCAnICcsICcgJykpO1xyXG4gIH1cclxuICB0cmFuc0RhdGEudmlldyA9IHt9O1xyXG4gIHRyYW5zRGF0YS52aWV3LmltYWdlUGFkZGluZyA9IDA7XHJcbiAgaWYgKHR5cGVvZihpbWFnZVBhZGRpbmcpICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICB0cmFuc0RhdGEudmlldy5pbWFnZVBhZGRpbmcgPSBpbWFnZVBhZGRpbmdcclxuICB9XHJcbiAgdmFyIGJpbmREYXRhID0ge307XHJcbiAgYmluZERhdGFbYmluZE5hbWVdID0gdHJhbnNEYXRhO1xyXG4gIHRoYXQuc2V0RGF0YShiaW5kRGF0YSk7XHJcbiAgdGhhdC53eFBhcnNlSW1nTG9hZCA9IHd4UGFyc2VJbWdMb2FkO1xyXG4gIHRoYXQud3hQYXJzZUltZ1RhcCA9IHd4UGFyc2VJbWdUYXA7XHJcblxyXG4gIC8v5paw5aKeXHJcbiAgYmluZERhdGEud3hQYXJzZUltZ0xvYWQgPSB3eFBhcnNlSW1nTG9hZDtcclxuICBiaW5kRGF0YS53eFBhcnNlSW1nVGFwID0gd3hQYXJzZUltZ1RhcDtcclxuICByZXR1cm4gYmluZERhdGE7XHJcbn1cclxuXHJcbi8vIOWbvueJh+eCueWHu+S6i+S7tlxyXG5mdW5jdGlvbiB3eFBhcnNlSW1nVGFwKGUsIGJpbmREYXRhKSB7XHJcbiAgLy8gdmFyIHRoYXQgPSB0aGlzXHJcbiAgLy8gdmFyIG5vd0ltZ1VybCA9IGUudGFyZ2V0LmRhdGFzZXQuc3JjXHJcbiAgLy8gdmFyIHRhZ0Zyb20gPSBlLnRhcmdldC5kYXRhc2V0LmZyb21cclxuXHJcbiAgLy8gaWYgKHR5cGVvZih0YWdGcm9tKSAhPSAndW5kZWZpbmVkJyAmJiB0YWdGcm9tLmxlbmd0aCA+IDApIHtcclxuICAvLyAgIHd4LnByZXZpZXdJbWFnZSh7XHJcbiAgLy8gICAgIGN1cnJlbnQ6IG5vd0ltZ1VybCwgLy8g5b2T5YmN5pi+56S65Zu+54mH55qEaHR0cOmTvuaOpVxyXG4gIC8vICAgICB1cmxzOiBiaW5kRGF0YVt0YWdGcm9tXS5pbWFnZVVybHMgLy8g6ZyA6KaB6aKE6KeI55qE5Zu+54mHaHR0cOmTvuaOpeWIl+ihqFxyXG4gIC8vICAgfSlcclxuICAvLyB9XHJcbn1cclxuIFxyXG4vKipcclxuICog5Zu+54mH6KeG6KeJ5a696auY6K6h566X5Ye95pWw5Yy6IFxyXG4gKiovXHJcbmZ1bmN0aW9uIHd4UGFyc2VJbWdMb2FkKGUpIHtcclxuICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgdmFyIHRhZ0Zyb20gPSBlLnRhcmdldC5kYXRhc2V0LmZyb207XHJcbiAgdmFyIGlkeCA9IGUudGFyZ2V0LmRhdGFzZXQuaWR4O1xyXG4gIGlmICh0eXBlb2YodGFnRnJvbSkgIT0gJ3VuZGVmaW5lZCcgJiYgdGFnRnJvbS5sZW5ndGggPiAwKSB7XHJcbiAgICBjYWxNb3JlSW1hZ2VJbmZvKGUsIGlkeCwgdGhhdCwgdGFnRnJvbSlcclxuICB9XHJcbn1cclxuXHJcbi8vIOWBh+W+queOr+iOt+WPluiuoeeul+WbvueJh+inhuinieacgOS9s+WuvemrmFxyXG5mdW5jdGlvbiBjYWxNb3JlSW1hZ2VJbmZvKGUsIGlkeCwgdGhhdCwgYmluZE5hbWUpIHtcclxuICB2YXIgdGVtRGF0YSA9IHRoYXQuZGF0YVtiaW5kTmFtZV07XHJcbiAgaWYgKCF0ZW1EYXRhIHx8IHRlbURhdGEuaW1hZ2VzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciB0ZW1JbWFnZXMgPSB0ZW1EYXRhLmltYWdlcztcclxuICAvL+WboOS4uuaXoOazleiOt+WPlnZpZXflrr3luqYg6ZyA6KaB6Ieq5a6a5LmJcGFkZGluZ+i/m+ihjOiuoeeul++8jOeojeWQjuWkhOeQhlxyXG4gIHZhciByZWNhbCA9IHd4QXV0b0ltYWdlQ2FsKGUuZGV0YWlsLndpZHRoLCBlLmRldGFpbC5oZWlnaHQsIHRoYXQsIGJpbmROYW1lKTtcclxuICAvLyB0ZW1JbWFnZXNbaWR4XS53aWR0aCA9IHJlY2FsLmltYWdlV2lkdGg7XHJcbiAgLy8gdGVtSW1hZ2VzW2lkeF0uaGVpZ2h0ID0gcmVjYWwuaW1hZ2VoZWlnaHQ7IFxyXG4gIC8vIHRlbURhdGEuaW1hZ2VzID0gdGVtSW1hZ2VzO1xyXG4gIC8vIHZhciBiaW5kRGF0YSA9IHt9O1xyXG4gIC8vIGJpbmREYXRhW2JpbmROYW1lXSA9IHRlbURhdGE7XHJcbiAgLy8gdGhhdC5zZXREYXRhKGJpbmREYXRhKTtcclxuICB2YXIgaW5kZXggPSB0ZW1JbWFnZXNbaWR4XS5pbmRleFxyXG4gIHZhciBrZXkgPSBgJHtiaW5kTmFtZX1gXHJcbiAgZm9yICh2YXIgaSBvZiBpbmRleC5zcGxpdCgnLicpKSBrZXkgKz0gYC5ub2Rlc1ske2l9XWBcclxuICB2YXIga2V5VyA9IGtleSArICcud2lkdGgnXHJcbiAgdmFyIGtleUggPSBrZXkgKyAnLmhlaWdodCdcclxuICB0aGF0LnNldERhdGEoe1xyXG4gICAgW2tleVddOiByZWNhbC5pbWFnZVdpZHRoLFxyXG4gICAgW2tleUhdOiByZWNhbC5pbWFnZWhlaWdodCxcclxuICB9KVxyXG59XHJcblxyXG4vLyDorqHnrpfop4bop4nkvJjlhYjnmoTlm77niYflrr3pq5hcclxuZnVuY3Rpb24gd3hBdXRvSW1hZ2VDYWwob3JpZ2luYWxXaWR0aCwgb3JpZ2luYWxIZWlnaHQsIHRoYXQsIGJpbmROYW1lKSB7XHJcbiAgLy/ojrflj5blm77niYfnmoTljp/lp4vplb/lrr1cclxuICB2YXIgd2luZG93V2lkdGggPSAwLFxyXG4gICAgd2luZG93SGVpZ2h0ID0gMDtcclxuICB2YXIgYXV0b1dpZHRoID0gMCxcclxuICAgIGF1dG9IZWlnaHQgPSAwO1xyXG4gIHZhciByZXN1bHRzID0ge307XHJcbiAgdmFyIHBhZGRpbmcgPSB0aGF0LmRhdGFbYmluZE5hbWVdLnZpZXcuaW1hZ2VQYWRkaW5nO1xyXG4gIHdpbmRvd1dpZHRoID0gcmVhbFdpbmRvd1dpZHRoIC0gMiAqIHBhZGRpbmc7XHJcbiAgd2luZG93SGVpZ2h0ID0gcmVhbFdpbmRvd0hlaWdodDtcclxuICAvL+WIpOaWreaMieeFp+mCo+enjeaWueW8j+i/m+ihjOe8qeaUvlxyXG4gIC8vIGNvbnNvbGUubG9nKFwid2luZG93V2lkdGhcIiArIHdpbmRvd1dpZHRoKTtcclxuICBpZiAob3JpZ2luYWxXaWR0aCA+IHdpbmRvd1dpZHRoKSB7IC8v5Zyo5Zu+54mHd2lkdGjlpKfkuo7miYvmnLrlsY/luZV3aWR0aOaXtuWAmVxyXG4gICAgYXV0b1dpZHRoID0gd2luZG93V2lkdGg7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcImF1dG9XaWR0aFwiICsgYXV0b1dpZHRoKTtcclxuICAgIGF1dG9IZWlnaHQgPSAoYXV0b1dpZHRoICogb3JpZ2luYWxIZWlnaHQpIC8gb3JpZ2luYWxXaWR0aDtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwiYXV0b0hlaWdodFwiICsgYXV0b0hlaWdodCk7XHJcbiAgICByZXN1bHRzLmltYWdlV2lkdGggPSBhdXRvV2lkdGg7XHJcbiAgICByZXN1bHRzLmltYWdlaGVpZ2h0ID0gYXV0b0hlaWdodDtcclxuICB9IGVsc2UgeyAvL+WQpuWImeWxleekuuWOn+adpeeahOaVsOaNrlxyXG4gICAgcmVzdWx0cy5pbWFnZVdpZHRoID0gb3JpZ2luYWxXaWR0aDtcclxuICAgIHJlc3VsdHMuaW1hZ2VoZWlnaHQgPSBvcmlnaW5hbEhlaWdodDtcclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdHM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHd4UGFyc2VUZW1BcnJheSh0ZW1BcnJheU5hbWUsIGJpbmROYW1lUmVnLCB0b3RhbCwgdGhhdCkge1xyXG4gIHZhciBhcnJheSA9IFtdO1xyXG4gIHZhciB0ZW1EYXRhID0gdGhhdC5kYXRhO1xyXG4gIHZhciBvYmogPSBudWxsO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xyXG4gICAgdmFyIHNpbUFyciA9IHRlbURhdGFbYmluZE5hbWVSZWcgKyBpXS5ub2RlcztcclxuICAgIGFycmF5LnB1c2goc2ltQXJyKTtcclxuICB9XHJcblxyXG4gIHRlbUFycmF5TmFtZSA9IHRlbUFycmF5TmFtZSB8fCAnd3hQYXJzZVRlbUFycmF5JztcclxuICBvYmogPSBKU09OLnBhcnNlKCd7XCInICsgdGVtQXJyYXlOYW1lICsgJ1wiOlwiXCJ9Jyk7XHJcbiAgb2JqW3RlbUFycmF5TmFtZV0gPSBhcnJheTtcclxuICB0aGF0LnNldERhdGEob2JqKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIOmFjee9rmVtb2ppc1xyXG4gKiBcclxuICovXHJcblxyXG5mdW5jdGlvbiBlbW9qaXNJbml0KHJlZyA9ICcnLCBiYXNlU3JjID0gXCIvd3hQYXJzZS9lbW9qaXMvXCIsIGVtb2ppcykge1xyXG4gIEh0bWxUb0pzb24uZW1vamlzSW5pdChyZWcsIGJhc2VTcmMsIGVtb2ppcyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHd4UGFyc2U6IHd4UGFyc2UsXHJcbiAgd3hQYXJzZUltZ1RhcDogd3hQYXJzZUltZ1RhcCxcclxuICB3eFBhcnNlVGVtQXJyYXk6IHd4UGFyc2VUZW1BcnJheSxcclxuICBlbW9qaXNJbml0OiBlbW9qaXNJbml0XHJcbn1cclxuIl19