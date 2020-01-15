
import regeneratorRuntime from '../utils/regenerator-runtime/runtime-module';

const canvasCommon = async (that, ctx, cardImageSrc, cardBgSrc, qrcodeUrl) => {
  const str1 = '长按识别小程序码';
  const str2 = "名片存入通讯录，快速查看，永不丢失";
  //当前设备缩放比
  //获取设备的宽度
  let rpx = 1;
  wx.getSystemInfo({
    success: function (res) {
      
      rpx = res.windowWidth / 375;
    },
  })
  // rpx = rpx * 1.43;
  ctx.setFillStyle('#fff')
  ctx.fillRect(0, 0, 300 * rpx, 518 * rpx)
  //添加背景图
  const cardBgImageSrc = await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: cardBgSrc,
      success: (res) => {
        
        resolve(res.path)
      },
      fail:(e)=>{
        
      }
    })
  })
  ctx.drawImage(cardBgImageSrc, 10 * rpx, 10 * rpx, 280 * rpx, 498 * rpx);
  //名片背景
  if (cardImageSrc == '/images/business-card-bg1.png'){
    ctx.drawImage(cardImageSrc, 25 * rpx, 40 * rpx, 249 * rpx, 152 * rpx);
  }else{
    const cardImagePath = await new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: cardImageSrc,
        success: (res) => {
          
          resolve(res.path)
        }
      })
    })
    ctx.drawImage(cardImagePath, 25 * rpx, 40 * rpx, 249 * rpx, 152 * rpx);
  }
  //名片小程序二维码
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  ctx.arc(150 * rpx, 310 * rpx, 70 * rpx, 0, 2 * Math.PI, false); //画一个圆形裁剪圈
  ctx.setStrokeStyle('transparent');
  ctx.stroke();
  ctx.clip(); //裁剪
  
  await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: qrcodeUrl,
      success: (res) => {
        
        ctx.drawImage(res.path, 80 * rpx, 240 * rpx, 140 * rpx, 140 * rpx);
        resolve();
      },
      fail: (e) => {
        
        reject();
      }
    })
  })
  ctx.restore();  //恢复之前保存的绘图上下文
  if (cardBgSrc != 'https://img0.912688.com/mc-share-moments-bg1.jpg'){
    ctx.setFillStyle('#ffffff');
  }else{
    ctx.setFillStyle('#333333');
  }
  ctx.setFontSize(13 * rpx);
  ctx.setTextAlign('center');
  ctx.fillText(str1, 150 * rpx, 430 * rpx);
  ctx.fillText(str2, 150 * rpx, 455 * rpx);
  return { rpx }
}
const canvasToImage = (that) => {
  that.setData({
    canSave: true
  })
  wx.canvasToTempFilePath({
    x: 0,
    y: 0,
    fileType: 'png',
    quality: 1,//图片质量
    canvasId: 'customCanvas',
    success: (res) => {
      wx.hideLoading();
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(res) {
          // wx.showToast({
          //   title: '图片保存成功',
          // })
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500
          })
          that.setData({
            saveSuccessFlag:true,
            isFirstEnter:false
          })
        },
        fail(res) {
          wx.showModal({
            title: '温馨提示',
            content: '请打开授权，否则无法将图片保存在相册中！',
            showCancel: false
          })
          that.setData({
            isAuthored: false,
            isFirstEnter: false
          })
        }
      })
    }
  }, this)
}
const cardPoster1 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  ctx.arc(229 * rpx, 87 * rpx, 21 * rpx, 0, 2 * Math.PI, false); //画一个圆形裁剪圈
  ctx.setStrokeStyle('transparent');
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        
        ctx.drawImage(res.path,208 * rpx, 66 * rpx, 42 * rpx, 42 * rpx);
        resolve(res.path);
      },
      fail:(e)=>{
        
      }
    })
  })
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#666666');
  ctx.setFontSize(8 * rpx);
  ctx.setTextAlign('right');
  ctx.fillText(user.userOccupation, 200 * rpx, 100 * rpx);
  ctx.setTextAlign('left');
  ctx.fillText(user.userCompany, 60 * rpx, 127 * rpx);
  ctx.fillText(user.userTelephone, 60 * rpx, 142 * rpx);
  ctx.fillText(user.userEmail, 60 * rpx, 157 * rpx);
  //加粗字体放最后
  drawText({
    x: 200 * rpx,
    y: 85 * rpx,
    color: '#333333',
    size: 11 * rpx,
    align: 'right',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  //网络图片缓存到本地
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 0, 27, 27, 48 * rpx, 119.5 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 56, 27, 27, 48 * rpx, 134.5 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 112, 27, 27, 48 * rpx, 150 * rpx, 9 * rpx, 9 * rpx);
}
const cardPoster2 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  ctx.arc(72 * rpx, 88 * rpx, 25 * rpx, 0, 2 * Math.PI, false); //画一个圆形裁剪圈
  ctx.setStrokeStyle('transparent');
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        // 
        ctx.drawImage(res.path,48 * rpx, 65 * rpx, 48 * rpx, 48 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#666666');
  ctx.setFontSize(8.5 * rpx);
  ctx.setTextAlign('right');
  ctx.fillText(user.userOccupation, 255 * rpx, 92 * rpx);
  ctx.fillText(user.userCompany, 242 * rpx, 127 * rpx);
  ctx.fillText(user.userTelephone, 242 * rpx, 146 * rpx);
  ctx.fillText(user.userEmail, 242 * rpx, 166 * rpx);
  //加粗字体放最后
  // ctx.setFillStyle('#333333');
  // ctx.font = 'normal bold 12px sans-serif';
  // ctx.fillText(user.userName, 255 * rpx, 78 * rpx);
  drawText({
    x: 255 * rpx,
    y: 78 * rpx,
    color: '#333333',
    size: 11 * rpx,
    align: 'right',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  //画一条线
  ctx.beginPath();
  ctx.moveTo(155 * rpx, 103 * rpx);
  ctx.lineTo(256 * rpx, 103 * rpx);
  ctx.setStrokeStyle('#cccccc');
  ctx.stroke();
  //网络图片缓存到本地
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 164, 27, 27, 247 * rpx, 119 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 219, 27, 27, 247 * rpx, 138 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 272, 27, 27, 247 * rpx, 158 * rpx, 9 * rpx, 9 * rpx);
}
const cardPoster3 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  //画一个带圆角的矩形
  ctx.arc(68 * rpx, 138 * rpx, 4 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.arc(100 * rpx, 138 * rpx, 4 * rpx, 1.5 * Math.PI, 2 * Math.PI);
  ctx.arc(100 * rpx, 170 * rpx, 4 * rpx, 0, 0.5 * Math.PI);
  ctx.arc(68 * rpx, 170 * rpx, 4 * rpx, 0.5 * Math.PI, 1 * Math.PI);
  ctx.lineTo(63 * rpx, 137 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.setStrokeStyle('transparent');
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        ctx.drawImage(res.path, 64 * rpx, 134 * rpx, 40 * rpx, 40 * rpx);
        resolve(res.path)
      }
    })
  })
  // ctx.drawImage('/images/cie-avatar.jpg',198,68,42,42);
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#666666');
  ctx.setFontSize(8.5 * rpx);
  ctx.setTextAlign('left');
  ctx.fillText(user.userOccupation, 138 * rpx, 117 * rpx);
  ctx.fillText(user.userCompany, 150 * rpx, 140 * rpx);
  ctx.fillText(user.userTelephone, 150 * rpx, 157 * rpx);
  ctx.fillText(user.userEmail, 150 * rpx, 174 * rpx);
  //加粗字体放最后
  drawText({
    x: 138 * rpx,
    y: 100 * rpx,
    color: '#333333',
    size: 11 * rpx,
    align: 'left',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  //网络图片缓存到本地
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 328, 27, 27, 138 * rpx, 132 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 384, 27, 27, 138 * rpx, 150 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 436, 27, 27, 138 * rpx, 166 * rpx, 9 * rpx, 9 * rpx);
}
const cardPoster4 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  ctx.arc(85 * rpx, 121 * rpx, 25 * rpx, 0, 2 * Math.PI, false); //画一个圆形裁剪圈
  ctx.setStrokeStyle('transparent');
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        ctx.drawImage(res.path, 60 * rpx, 94 * rpx, 52 * rpx, 52 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#666666');
  ctx.setFontSize(8.5 * rpx);
  ctx.setTextAlign('right');
  ctx.fillText(user.userOccupation, 255 * rpx, 93 * rpx);
  ctx.fillText(user.userCompany, 242 * rpx, 121 * rpx);
  ctx.fillText(user.userTelephone, 242 * rpx, 140 * rpx);
  ctx.fillText(user.userEmail, 242 * rpx, 160 * rpx);
  //加粗字体放最后
  drawText({
    x: 255 * rpx,
    y: 78 * rpx,
    color: '#333333',
    size: 11 * rpx,
    align: 'right',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 492, 27, 27, 247 * rpx, 113 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 548, 27, 27, 247 * rpx, 132 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 600, 27, 27, 247 * rpx, 152 * rpx, 9 * rpx, 9 * rpx);
}
const cardPoster5 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  //画一个带圆角的矩形
  ctx.arc(32 * rpx, 48 * rpx, 4 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.lineTo(147 * rpx, 44 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.lineTo(147 * rpx, 188 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.lineTo(30 * rpx, 188 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.arc(32 * rpx, 184 * rpx, 4 * rpx, 0.5 * Math.PI, 1 * Math.PI);
  ctx.lineTo(28 * rpx, 48 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.setStrokeStyle('transparent');
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        ctx.drawImage(res.path, 27 * rpx, 40 * rpx, 152 * rpx, 152 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.restore();  //恢复之前保存的绘图上下文
  //名片背景
  const cardBgImagePath = await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-business-card-bg5.png',
      success: (res) => {
        resolve(res.path)
      }
    })
  })
  ctx.drawImage(cardBgImagePath, 25 * rpx, 40 * rpx, 249 * rpx, 152 * rpx);
  // ctx.drawImage('/images/cie-avatar.jpg',198,68,42,42);
  ctx.setFillStyle('#fff');
  ctx.setFontSize(8.5 * rpx);
  ctx.setTextAlign('right');
  ctx.fillText(user.userOccupation, 255 * rpx, 91 * rpx);
  ctx.fillText(user.userCompany, 242 * rpx, 127 * rpx);
  ctx.fillText(user.userTelephone, 242 * rpx, 146 * rpx);
  ctx.fillText(user.userEmail, 242 * rpx, 166 * rpx);
  //加粗字体放最后
  drawText({
    x: 255 * rpx,
    y: 78 * rpx,
    color: '#2dbdb7',
    size: 11 * rpx,
    align: 'right',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  // ctx.setFillStyle('#2dbdb7');
  // ctx.font = 'normal bold 12px sans-serif';
  // ctx.fillText(user.userName, 255 * rpx, 76 * rpx);
  //网络图片缓存到本地
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 656, 27, 27, 247 * rpx, 119 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 712, 27, 27, 247 * rpx, 138 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 764, 27, 27, 247 * rpx, 158 * rpx, 9 * rpx, 9 * rpx);
}
const cardPoster6 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  //画一个带圆角的矩形
  ctx.arc(222 * rpx, 60 * rpx, 4 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.arc(244 * rpx, 60 * rpx, 4 * rpx, 1.5 * Math.PI, 2 * Math.PI);
  ctx.arc(244 * rpx, 82 * rpx, 4 * rpx, 0, 0.5 * Math.PI);
  ctx.arc(222 * rpx, 82 * rpx, 4 * rpx, 0.5 * Math.PI, 1 * Math.PI);
  ctx.lineTo(218 * rpx, 60 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.setStrokeStyle('transparent');
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        ctx.drawImage(res.path, 218 * rpx, 56 * rpx, 40 * rpx, 40 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#fff');
  ctx.setFontSize(8.5 * rpx);
  ctx.setTextAlign('right');
  ctx.fillText(user.userOccupation, 245 * rpx, 119 * rpx);
  ctx.fillText(user.userCompany, 232 * rpx, 138 * rpx);
  ctx.fillText(user.userTelephone, 232 * rpx, 157 * rpx);
  ctx.fillText(user.userEmail, 232 * rpx, 174 * rpx);
  //加粗字体放最后
  drawText({
    x: 245 * rpx,
    y: 106 * rpx,
    color: '#fff',
    size: 11 * rpx,
    align: 'right',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  //网络图片缓存到本地
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 820, 27, 27, 237 * rpx, 130 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 876, 27, 27, 237 * rpx, 149 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 929, 27, 27, 237 * rpx, 166 * rpx, 9 * rpx, 9 * rpx);
}
const cardPoster7 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  //画一个带圆角的矩形
  ctx.arc(209 * rpx, 123 * rpx, 4 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.arc(244 * rpx, 123 * rpx, 4 * rpx, 1.5 * Math.PI, 2 * Math.PI);
  ctx.arc(244 * rpx, 159 * rpx, 4 * rpx, 0, 0.5 * Math.PI);
  ctx.arc(209 * rpx, 159 * rpx, 4 * rpx, 0.5 * Math.PI, 1 * Math.PI);
  ctx.lineTo(205 * rpx, 123 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.setStrokeStyle('transparent');//transparent
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        ctx.drawImage(res.path, 205 * rpx, 119 * rpx, 44 * rpx, 44 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#666666');
  ctx.setFontSize(8.5 * rpx);
  ctx.setTextAlign('left');
  ctx.fillText(user.userCompany, 60 * rpx, 125 * rpx);
  ctx.fillText(user.userTelephone, 60 * rpx, 144 * rpx);
  ctx.fillText(user.userEmail, 60 * rpx, 164 * rpx);
  ctx.setFillStyle('#fff');
  ctx.setTextAlign('right');
  ctx.fillText(user.userOccupation, 255 * rpx, 87 * rpx);

  //加粗字体放最后
  drawText({
    x: 255 * rpx,
    y: 72 * rpx,
    color: '#fff',
    size: 11 * rpx,
    align: 'right',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  //网络图片缓存到本地
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 328, 27, 27, 48 * rpx, 117 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 384, 27, 27, 48 * rpx, 136 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 436, 27, 27, 48 * rpx, 156 * rpx, 9 * rpx, 9 * rpx);
  
}
const cardPoster8 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  //画一个带圆角的矩形
  ctx.arc(56 * rpx, 94 * rpx, 4 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.arc(86 * rpx, 94 * rpx, 4 * rpx, 1.5 * Math.PI, 2 * Math.PI);
  ctx.arc(86 * rpx, 124 * rpx, 4 * rpx, 0, 0.5 * Math.PI);
  ctx.arc(56 * rpx, 124 * rpx, 4 * rpx, 0.5 * Math.PI, 1 * Math.PI);
  ctx.lineTo(52 * rpx, 94 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.setStrokeStyle('transparent');//transparent
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        
        ctx.drawImage(res.path, 52 * rpx, 90 * rpx, 38 * rpx, 38 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#c63939');
  ctx.setFontSize(8.5 * rpx);
  ctx.setTextAlign('right');
  ctx.fillText(user.userOccupation, 255 * rpx, 91 * rpx);
  ctx.fillText(user.userCompany, 242 * rpx, 127 * rpx);
  ctx.fillText(user.userTelephone, 242 * rpx, 146 * rpx);
  ctx.fillText(user.userEmail, 242 * rpx, 166 * rpx);
  //加粗字体放最后
  drawText({
    x: 255 * rpx,
    y: 76 * rpx,
    color: '#c63939',
    size: 11 * rpx,
    align: 'right',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  //网络图片缓存到本地
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 985, 27, 27, 247 * rpx, 119 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 1040, 27, 27, 247 * rpx, 138 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 1092, 27, 27, 247 * rpx, 158 * rpx, 9 * rpx, 9 * rpx);
  
}
const cardPoster9 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  ctx.arc(223 * rpx, 90 * rpx, 26 * rpx, 0, 2 * Math.PI, false); //画一个圆形裁剪圈
  ctx.setStrokeStyle('transparent');
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        
        ctx.drawImage(res.path, 196 * rpx, 64 * rpx, 52 * rpx, 52 * rpx);
        resolve(res.path)
      }
    })
  })
  // ctx.drawImage('/images/cie-avatar.jpg',198,68,42,42);
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#323845');
  ctx.setFontSize(8 * rpx);
  ctx.setTextAlign('left');
  ctx.fillText(user.userCompany, 60 * rpx, 120 * rpx);
  ctx.fillText(user.userTelephone, 60 * rpx, 137 * rpx);
  ctx.fillText(user.userEmail, 60 * rpx, 154 * rpx);
  ctx.setFillStyle('#030304');
  ctx.fillText(user.userOccupation, 48 * rpx, 88 * rpx);
  //加粗字体放最后
  drawText({
    x: 47 * rpx,
    y: 75 * rpx,
    color: '#030304',
    size: 11 * rpx,
    align: 'left',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  //网络图片缓存到本地
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 1149, 27, 27, 48 * rpx, 112.5 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 1204, 27, 27, 48 * rpx, 129.5 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 1256, 27, 27, 48 * rpx, 147 * rpx, 9 * rpx, 9 * rpx);
}
const cardPoster10 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  ctx.arc(156 * rpx, 72 * rpx, 20 * rpx, 0, 2 * Math.PI, false); //画一个圆形裁剪圈
  ctx.setStrokeStyle('transparent');
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        
        ctx.drawImage(res.path, 136 * rpx, 53 * rpx, 40 * rpx, 40 * rpx);
        resolve(res.path)
      }
    })
  })
  // ctx.drawImage('/images/cie-avatar.jpg',198,68,42,42);
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#6a7991');
  ctx.setFontSize(8.5 * rpx);
  ctx.setTextAlign('right');
  ctx.fillText(user.userCompany, 238 * rpx, 144 * rpx);
  ctx.fillText(user.userTelephone, 238 * rpx, 160 * rpx);
  ctx.fillText(user.userEmail, 238 * rpx, 177 * rpx);
  ctx.setTextAlign('left');
  ctx.fillText(user.userOccupation, 50 * rpx, 129 * rpx);
  //加粗字体放最后
  drawText({
    x: 50 * rpx,
    y: 116 * rpx,
    color: '#6a7991',
    size: 11 * rpx,
    align: 'left',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  //画一条线
  ctx.beginPath();
  ctx.moveTo(155 * rpx, 103 * rpx);
  ctx.lineTo(256 * rpx, 103 * rpx);
  ctx.setStrokeStyle('#cccccc');
  ctx.stroke();
  //网络图片缓存到本地
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 1149, 27, 27, 245 * rpx, 136 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 1204, 27, 27, 245 * rpx, 152 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 1256, 27, 27, 245 * rpx, 169 * rpx, 9 * rpx, 9 * rpx);
  
}
const cardPoster11 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  //画一个带圆角的矩形
  ctx.arc(68 * rpx, 66 * rpx, 4 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.arc(88 * rpx, 66 * rpx, 4 * rpx, 1.5 * Math.PI, 2 * Math.PI);
  ctx.arc(88 * rpx, 86 * rpx, 4 * rpx, 0, 0.5 * Math.PI);
  ctx.arc(68 * rpx, 86 * rpx, 4 * rpx, 0.5 * Math.PI, 1 * Math.PI);
  ctx.lineTo(64 * rpx,66* rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.setStrokeStyle('transparent');//transparent
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        
        ctx.drawImage(res.path, 64 * rpx, 62 * rpx, 28 * rpx, 28 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#c7000b');
  ctx.setFontSize(7.5 * rpx);
  ctx.setTextAlign('left');
  ctx.fillText(user.userCompany, 75 * rpx, 133 * rpx);
  ctx.fillText(user.userTelephone, 75 * rpx, 148 * rpx);
  ctx.fillText(user.userEmail, 75 * rpx, 164 * rpx);
  ctx.setTextAlign('right');
  ctx.fillText(user.userOccupation, 178 * rpx, 101 * rpx);

  //加粗字体放最后
  drawText({
    x: 178 * rpx,
    y: 90 * rpx,
    color: '#c7000b',
    size: 11 * rpx,
    align: 'right',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 985, 27, 27, 62 * rpx, 125 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 1040, 27, 27, 62 * rpx, 141 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 1092, 27, 27, 62 * rpx, 157 * rpx, 9 * rpx, 9 * rpx);
  
}
const cardPoster12 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  //画一个带圆角的矩形
  ctx.arc(62 * rpx, 74 * rpx, 4 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.arc(88 * rpx, 74 * rpx, 4 * rpx, 1.5 * Math.PI, 2 * Math.PI);
  ctx.arc(88 * rpx, 100 * rpx, 4 * rpx, 0, 0.5 * Math.PI);
  ctx.arc(62 * rpx, 100 * rpx, 4 * rpx, 0.5 * Math.PI, 1 * Math.PI);
  ctx.lineTo(58 * rpx, 70 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.setStrokeStyle('transparent');//transparent
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        
        ctx.drawImage(res.path,58 * rpx, 70 * rpx, 34 * rpx, 34 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#000000');
  ctx.setFontSize(8.5 * rpx);
  ctx.setTextAlign('right');
  ctx.fillText(user.userOccupation, 242 * rpx, 97 * rpx);
  ctx.fillText(user.userCompany, 242 * rpx, 127 * rpx);
  ctx.fillText(user.userTelephone, 242 * rpx, 145 * rpx);
  ctx.fillText(user.userEmail, 242 * rpx, 164 * rpx);
  //加粗字体放最后
  drawText({
    x: 242 * rpx,
    y: 82 * rpx,
    color: '#000000',
    size: 11 * rpx,
    align: 'right',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  
}
const cardPoster13 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  //画一个带圆角的矩形
  ctx.arc(60 * rpx, 126 * rpx, 4 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.arc(96 * rpx, 126 * rpx, 4 * rpx, 1.5 * Math.PI, 2 * Math.PI);
  ctx.arc(96 * rpx, 162 * rpx, 4 * rpx, 0, 0.5 * Math.PI);
  ctx.arc(60 * rpx, 162 * rpx, 4 * rpx, 0.5 * Math.PI, 1 * Math.PI);
  ctx.lineTo(56 * rpx, 126 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.setStrokeStyle('transparent');//transparent
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
         
        ctx.drawImage(res.path,56 * rpx, 122 * rpx, 44 * rpx, 44 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#030304');
  ctx.setFontSize(8.5 * rpx);
  ctx.setTextAlign('right');
  ctx.fillText(user.userOccupation, 246 * rpx, 97 * rpx);
  ctx.fillText(user.userCompany, 234 * rpx, 127 * rpx);
  ctx.fillText(user.userTelephone, 234 * rpx, 145 * rpx);
  ctx.fillText(user.userEmail, 234 * rpx, 164 * rpx);
  //加粗字体放最后
  drawText({
    x: 246 * rpx,
    y: 82 * rpx,
    color: '#030304',
    size: 11 * rpx,
    align: 'right',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 656, 27, 27, 240 * rpx, 119 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 712, 27, 27, 240 * rpx, 138 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 764, 27, 27, 240 * rpx, 157 * rpx, 9 * rpx, 9 * rpx);
  
}
const cardPoster14 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  //画一个带圆角的矩形
  ctx.arc(215 * rpx, 138 * rpx, 4 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.arc(251 * rpx, 138 * rpx, 4 * rpx, 1.5 * Math.PI, 2 * Math.PI);
  ctx.arc(251 * rpx, 174 * rpx, 4 * rpx, 0, 0.5 * Math.PI);
  ctx.arc(215 * rpx, 174 * rpx, 4 * rpx, 0.5 * Math.PI, 1 * Math.PI);
  ctx.lineTo(211 * rpx, 138 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.setStrokeStyle('transparent');//transparent
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        
        ctx.drawImage(res.path,211 * rpx, 134 * rpx, 44 * rpx, 44 * rpx);
        resolve(res.path)
      }
    })
  })
  // ctx.drawImage('/images/cie-avatar.jpg',198,68,42,42);
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#fff');
  ctx.setFontSize(8 * rpx);
  ctx.setTextAlign('left');
  ctx.fillText(user.userCompany, 62 * rpx, 126 * rpx);
  ctx.fillText(user.userTelephone, 62 * rpx, 143 * rpx);
  ctx.fillText(user.userEmail, 62 * rpx, 160 * rpx);
  ctx.fillText(user.userOccupation, 50 * rpx, 90 * rpx);
  //加粗字体放最后
  drawText({
    x: 49 * rpx,
    y: 77 * rpx,
    color: '#fff',
    size: 11 * rpx,
    align: 'left',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  //网络图片缓存到本地
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 1313, 27, 27, 50 * rpx, 118.5 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 1368, 27, 27, 50 * rpx, 135.5 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 1421, 27, 27, 50 * rpx, 153 * rpx, 9 * rpx, 9 * rpx);
}
const cardPoster15 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  //画一个带圆角的矩形
  ctx.arc(214 * rpx, 68 * rpx, 4 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.arc(250 * rpx, 68 * rpx, 4 * rpx, 1.5 * Math.PI, 2 * Math.PI);
  ctx.arc(250 * rpx, 104 * rpx, 4 * rpx, 0, 0.5 * Math.PI);
  ctx.arc(214 * rpx, 104 * rpx, 4 * rpx, 0.5 * Math.PI, 1 * Math.PI);
  ctx.lineTo(210 * rpx, 68 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.setStrokeStyle('transparent');//transparent
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        
        ctx.drawImage(res.path,210 * rpx, 64 * rpx, 44 * rpx, 44 * rpx);
        resolve(res.path)
      }
    })
  })
  // ctx.drawImage('/images/cie-avatar.jpg',198,68,42,42);
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#fff');
  ctx.setFontSize(8 * rpx);
  ctx.setTextAlign('left');
  ctx.fillText(user.userCompany, 64 * rpx, 132 * rpx);
  ctx.fillText(user.userTelephone, 66 * rpx, 159 * rpx);
  ctx.fillText(user.userEmail, 66 * rpx, 177 * rpx);
  ctx.setFillStyle('#999999');
  ctx.fillText(user.userOccupation, 50 * rpx, 90 * rpx);
  //加粗字体放最后
  drawText({
    x: 49 * rpx,
    y: 77 * rpx,
    color: '#44988b',
    size: 11 * rpx,
    align: 'left',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  //网络图片缓存到本地
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 1477, 27, 27, 50 * rpx, 124.5 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 1535, 27, 27, 50 * rpx, 150.5 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 1596, 27, 27, 50 * rpx, 169 * rpx, 9 * rpx, 9 * rpx);
}
const cardPoster16 = async (ctx, rpx, user, minSize) => {
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  //画一个带圆角的矩形
  ctx.arc(212 * rpx, 66 * rpx, 4 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.arc(250 * rpx, 66 * rpx, 4 * rpx, 1.5 * Math.PI, 2 * Math.PI);
  ctx.arc(250 * rpx, 106 * rpx, 4 * rpx, 0, 0.5 * Math.PI);
  ctx.arc(212 * rpx, 106 * rpx, 4 * rpx, 0.5 * Math.PI, 1 * Math.PI);
  ctx.lineTo(208 * rpx, 68 * rpx, 1 * Math.PI, 1.5 * Math.PI);
  ctx.setStrokeStyle('transparent');//transparent
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: user.avatarPath,
      success: (res) => {
        
        ctx.drawImage(res.path,208 * rpx, 62 * rpx, 48 * rpx, 48 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#fff');
  ctx.setFontSize(8 * rpx);
  ctx.setTextAlign('left');
  ctx.fillText(user.userCompany, 66 * rpx, 136 * rpx);
  ctx.fillText(user.userTelephone, 66 * rpx, 154 * rpx);
  ctx.fillText(user.userEmail, 66 * rpx, 172 * rpx);
  ctx.fillText(user.userOccupation,52 * rpx, 103 * rpx);
  //加粗字体放最后
  drawText({
    x: 51 * rpx,
    y: 90 * rpx,
    color: '#fff',
    size: 11 * rpx,
    align: 'left',
    baseline: 'normal',
    text: user.userName,
    bold: true
  }, ctx);
  //网络图片缓存到本地
  const cardImagePath = await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-card-bg-icons.png',
      success: (res) => {
        
        resolve(res.path)
      }
    })
  })
  //画三个小图标
  ctx.drawImage(cardImagePath, 0, 820, 27, 27, 50 * rpx, 128 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 876, 27, 27, 50 * rpx, 147 * rpx, 9 * rpx, 9 * rpx);
  ctx.drawImage(cardImagePath, 0, 929, 27, 27, 50 * rpx, 165 * rpx, 9 * rpx, 9 * rpx);
}

// 企业营销
const enterpriseMarketing1 = async (that, ctx, cardImageSrc, introduction, qrcodeUrl) => {
  //当前设备缩放比
  let rpx = 1;
  wx.getSystemInfo({
    success: function (res) {
      
      rpx = res.windowWidth / 375;
    },
  })
  //将长文字转换成短的行文字数组
  introduction.profileContent = "    " + introduction.profileContent.replace(/\s*/g, "");
  if (introduction.profileContent.length>100){
    introduction.profileContent = introduction.profileContent.substring(0, 100);
  }
  introduction.profileContent = introduction.profileContent + '...';
  let lineCount = parseInt(introduction.profileContent.length / 27) + 1;
  let textArray = [];
  for (let i = 0; i < lineCount; i++) {
    if (i == 0) {
      textArray.push(introduction.profileContent.substring(0, 28))
    } else {
      textArray.push(introduction.profileContent.substring(28 + 25 * (i - 1), 25 * i + 28))
    }
  }
  const textHeight = textArray.length*rpx*21;
  ctx.setFillStyle('#d2e0f8')
  ctx.fillRect(10 * rpx, 20 * rpx, 365 * rpx, 780 * rpx)
  //添加背景图
  const grd = ctx.createLinearGradient(0, 0, 0, 230 * rpx);
  grd.addColorStop(0, '#66a6ff');
  grd.addColorStop(1, '#7fe1f3');
  ctx.setFillStyle(grd);
  ctx.fillRect(22 * rpx, 35 * rpx, 341 * rpx, 230 * rpx);

 
  //白色背景
  ctx.setFillStyle('#fff');
  ctx.fillRect(22 * rpx, 265 * rpx, 341 * rpx, (376 * rpx + textHeight));
  //企业介绍
  drawText({
    x: 192.5*rpx,
    y: 294*rpx,
    color: '#66a6ff',
    size: 17 * rpx,
    align: 'center',
    baseline: 'middle',
    text: introduction.profileTitle,
    bold: true
  },ctx);
  // ctx.setFillStyle('#66a6ff');
  // ctx.setFontSize(19 * rpx);
  // ctx.font = 'normal bold 16px sans-serif';
  ctx.setTextAlign('center');
  ctx.setFillStyle('#999999');
  ctx.setFontSize(8 * rpx);
  ctx.fillText(introduction.profileTip, 192.5 * rpx, 320 * rpx);
  ctx.setFillStyle('#666666');
  ctx.setFontSize(12 * rpx);
  ctx.setTextAlign('left');
  textArray.forEach(function (value,index,array){
    ctx.fillText(value, 36 * rpx, (352 + 21 * index) * rpx);
  })
  ctx.setFillStyle('#f0f0f0');
  ctx.fillRect(22 * rpx, (353 * rpx + textHeight), 341 * rpx, 14 * rpx);
  //企业风采
  drawText({
    x: 192.5 * rpx,
    y: (396 * rpx + textHeight),
    color: '#66a6ff',
    size: 17 * rpx,
    align: 'center',
    baseline: 'middle',
    text: introduction.styleTitle,
    bold: true
  }, ctx);
  // ctx.setFillStyle('#66a6ff');
  // ctx.setFontSize(19 * rpx);
  // ctx.font = 'normal bold 16px sans-serif';
  ctx.setTextAlign('center');
  ctx.setFillStyle('#999999');
  ctx.setFontSize(8 * rpx);
  ctx.fillText(introduction.styleEnglish, 192.5 * rpx, (422 * rpx + textHeight));
  await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: introduction.styleUrl,
      success: (res) => {
        
        ctx.drawImage(res.path, 59 * rpx, (447 * rpx + textHeight), 267 * rpx, 194 * rpx);
        resolve(res.path);
      }
    })
  })
  ctx.drawImage('/images/mc-e-marketing-share1.jpg', 10 * rpx, (640 * rpx + textHeight), 365 * rpx, 170 * rpx);
  await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: qrcodeUrl,
      success: (res) => {
        
        ctx.drawImage(res.path, 160 * rpx, (715 * rpx + textHeight), 74 * rpx, 74 * rpx);
        resolve(res.path);
      }
    })
  })
  
  rpx = rpx * 1.29;
  //名片背景00
  if (cardImageSrc == '/images/business-card-bg1.png') {
    ctx.drawImage(cardImageSrc, 25 * rpx, 40 * rpx, 249 * rpx, 152 * rpx);
  } else {
    const cardImagePath = await new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: cardImageSrc,
        success: (res) => {
          
          resolve(res.path)
        }
      })
    })
    ctx.drawImage(cardImagePath, 25 * rpx, 40 * rpx, 249 * rpx, 152 * rpx);
  }
  //名片小程序二维码
  return { rpx }
}
const enterpriseMarketing2 = async (that, ctx, userObj, introduction, qrcodeUrl) => {
  //当前设备缩放比
  let rpx = 1;
  wx.getSystemInfo({
    success: function (res) {
      
      rpx = res.windowWidth / 375;
    },
  })
  //将长文字转换成短的行文字数组
  introduction.profileContent = "    " + introduction.profileContent.replace(/\s*/g, "");
  if (introduction.profileContent.length > 100) {
    introduction.profileContent = introduction.profileContent.substring(0, 100);
  }
  introduction.profileContent = introduction.profileContent + '...';
  let lineCount = parseInt(introduction.profileContent.length / 27) + 1;
  let textArray = [];
  for (let i = 0; i < lineCount; i++) {
    if (i == 0) {
      textArray.push(introduction.profileContent.substring(0, 28))
    } else {
      textArray.push(introduction.profileContent.substring(28 + 25 * (i - 1), 25 * i + 28))
    }
  }
  textArray = textArray.length > 7 ? textArray.slice(0, 7) : textArray;
  const textHeight = textArray.length * rpx * 21;
  //灰色背景
  ctx.setFillStyle('#d2e0f8');
  ctx.fillRect(0 * rpx, 0 * rpx, 375 * rpx, 790 * rpx);
  //白色。蓝色背景都砸这了
  ctx.setFillStyle('#fff');
  ctx.fillRect(15 * rpx, 15 * rpx, 345 * rpx, 780 * rpx);
  ctx.setFillStyle('#2a65ac')
  ctx.fillRect(15 * rpx, 245 * rpx , 345 * rpx, 46 * rpx + textHeight);
  ctx.fillRect(15 * rpx, 364 * rpx + textHeight, 345 * rpx, 273 * rpx );

  ctx.setFillStyle('#2a65ac');
  ctx.moveTo(15*rpx,15*rpx);
  ctx.lineTo(360 * rpx, 171.5*rpx);
  ctx.lineTo(15 * rpx, 171.5 * rpx);
  ctx.fill();
  //名片信息
  ctx.setTextBaseline('top')
  ctx.setFillStyle('#2a65ac');
  ctx.setFontSize(16 * rpx);
  if (userObj.userCompany.length>12){
    userObj.userCompany = userObj.userCompany.substr(0,10)+'...'
  }
  ctx.fillText(userObj.userCompany, 153 * rpx, 30 * rpx);
  //用户头像
  await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: userObj.avatarPath,
      success: (res) => {
        
        ctx.drawImage(res.path, 283 * rpx, 68 * rpx, 55 * rpx, 55 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.setFillStyle('#fff');
  ctx.setFontSize(15*rpx);
  ctx.fillText(userObj.userName,38*rpx,60*rpx);
  ctx.fillText(userObj.userTelephone, 38 * rpx, 115 * rpx);
  ctx.fillText(userObj.userEmail, 38 * rpx, 140 * rpx);
  ctx.setFontSize(13*rpx);
  ctx.fillText(userObj.userOccupation, 38 * rpx, 86 * rpx);
  //企业介绍
  ctx.setFillStyle('#2a65ac');
  ctx.setFontSize(15*rpx);
  ctx.setTextAlign('center');
  ctx.fillText(introduction.profileTip,195*rpx,187*rpx);
  ctx.fillText(introduction.profileTitle, 195 * rpx, 209 * rpx);
  ctx.drawImage('/images/mc-e-marketing-tip-icon.png',91.5*rpx,217.5*rpx,208*rpx,3.5*rpx);
  ctx.fillText(introduction.styleEnglish, 195 * rpx, 309 * rpx + textHeight);
  ctx.fillText(introduction.styleTitle, 195 * rpx, 329 * rpx + textHeight);
  ctx.drawImage('/images/mc-e-marketing-tip-icon.png', 91.5 * rpx, 337.5 * rpx + textHeight, 205 * rpx, 3.5 * rpx);
  //换行文字
  ctx.setFontSize(12 * rpx);
  ctx.setFillStyle('#fff');
  ctx.setTextAlign('left');
  textArray.forEach(function (value, index, array) {
    ctx.fillText(value, 38 * rpx, (270 + 21 * index) * rpx);
  })
  ctx.beginPath();
  ctx.setStrokeStyle('#fff');
  ctx.moveTo(46 * rpx, 391 * rpx + textHeight);
  ctx.lineTo(328 * rpx, 391 * rpx + textHeight);
  ctx.lineTo(328 * rpx, 609 * rpx + textHeight);
  ctx.lineTo(46 * rpx, 609 * rpx + textHeight);
  ctx.lineTo(46 * rpx, 391 * rpx + textHeight);
  ctx.stroke();
  await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: introduction.styleUrl,
      success: (res) => {
        
        ctx.drawImage(res.path, 56 * rpx, 401 * rpx + textHeight, 262 * rpx, 197 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.drawImage('/images/mc-e-marketing-share1.jpg', 0 * rpx, 623 * rpx + textHeight, 375 * rpx, 175 * rpx);
  await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: qrcodeUrl,
      success: (res) => {
        
        ctx.drawImage(res.path, 154 * rpx, (700.5 * rpx + textHeight), 76 * rpx, 76 * rpx);
        resolve(res.path);
      }
    })
  })
}
const enterpriseMarketing3 = async (that, ctx, userObj, introduction, qrcodeUrl) => {
  //当前设备缩放比
  let rpx = 1;
  wx.getSystemInfo({
    success: function (res) {
      
      rpx = res.windowWidth / 375;
    },
  })
  //将长文字转换成短的行文字数组
  introduction.profileContent = "    " + introduction.profileContent.replace(/\s*/g, "");
  if (introduction.profileContent.length > 100) {
    introduction.profileContent = introduction.profileContent.substring(0, 100);
  }
  introduction.profileContent = introduction.profileContent + '...';
  let lineCount = parseInt(introduction.profileContent.length / 27) + 1;
  let textArray = [];
  for (let i = 0; i < lineCount; i++) {
    if (i == 0) {
      textArray.push(introduction.profileContent.substring(0, 28))
    } else {
      textArray.push(introduction.profileContent.substring(28 + 25 * (i - 1), 25 * i + 28))
    }
  }
  textArray = textArray.length > 7 ? textArray.slice(0, 7) : textArray;
  const textHeight = textArray.length * rpx * 21;
  //灰色背景
  ctx.setFillStyle('#d2e0f8');
  ctx.fillRect(0 * rpx, 0 * rpx, 375 * rpx, 1100 * rpx);
  ctx.drawImage('/images/mc-e-marketing3-bg1.jpg',15*rpx,15*rpx,345*rpx,308*rpx);
  //名片信息
  ctx.setTextBaseline('top')
  ctx.setFillStyle('#2a65ac');
  ctx.setFontSize(16 * rpx);
  if (userObj.userCompany.length > 12) {
    userObj.userCompany = userObj.userCompany.substr(0, 10) + '...'
  }
  ctx.setFillStyle('#000');
  ctx.fillRect(15 * rpx, 308 * rpx, 345 * rpx, 760 * rpx);
  ctx.setFillStyle('#ffc575');
  ctx.setFontSize(18.5 * rpx);
  ctx.fillText(userObj.userCompany, (345 * rpx - ctx.measureText(userObj.userCompany).width) / 2+15*rpx, 270 * rpx);
  ctx.fillText(userObj.userTelephone, (345 * rpx - ctx.measureText(userObj.userTelephone).width) / 2 + 15 * rpx, 413 * rpx);
  ctx.fillText(userObj.userEmail, (345 * rpx - ctx.measureText(userObj.userEmail).width) / 2 + 15 * rpx, 443 * rpx);
  ctx.setFontSize(17.5 * rpx);
  ctx.fillText(userObj.userName, (345 * rpx - ctx.measureText(userObj.userName).width) / 2 + 15 * rpx, 337 * rpx);
  ctx.setFontSize(13.5 * rpx);
  ctx.fillText(userObj.userOccupation, (345 * rpx - ctx.measureText(userObj.userOccupation).width) / 2 + 15 * rpx, 363 * rpx);
  ctx.drawImage('/images/mc-e-marketing3-bg2.jpg',15*rpx,509*rpx,345*rpx,55*rpx);
  ctx.setFillStyle('#111111');
  ctx.setFontSize(17.5*rpx);
  //企业简介
  drawText({
    x: (350 * rpx - ctx.measureText(introduction.profileTitle).width) / 2 + 15 * rpx,
    y: 524.5 * rpx,
    color: '#111111',
    size: 16 * rpx,
    align: 'left',
    baseline: 'top',
    text: introduction.profileTitle,
    bold: true
  }, ctx);
  // ctx.fillText(introduction.profileTitle, (345 * rpx - ctx.measureText(introduction.profileTitle).width) / 2 + 15 * rpx, 523 * rpx);
  ctx.drawImage('/images/mc-e-marketing3-bg2.jpg', 15 * rpx, 596 * rpx + textHeight, 345 * rpx, 55 * rpx);
  ctx.setFillStyle('#111111');
  ctx.setFontSize(17.5 * rpx);
  drawText({
    x: (351 * rpx - ctx.measureText(introduction.profileTitle).width) / 2 + 15 * rpx,
    y: 611.5 * rpx + textHeight,
    color: '#111111',
    size: 16 * rpx,
    align: 'left',
    baseline: 'top',
    text: introduction.styleTitle,
    bold: true
  }, ctx);
  //换行文字
  ctx.setFontSize(12 * rpx);
  ctx.setFillStyle('#ffc575');
  ctx.setTextAlign('left');
  textArray.forEach(function (value, index, array) {
    ctx.fillText(value, 49 * rpx, (584 + 21 * index) * rpx);
  })
  ctx.drawImage('/images/mc-e-marketing3-bg3.png', 37 * rpx, 669 * rpx + textHeight,299*rpx,230*rpx);
  //企业风采
  await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: introduction.styleUrl,
      success: (res) => {
        ctx.drawImage(res.path, 49 * rpx, 680 * rpx + textHeight, 275 * rpx, 206.5 * rpx);
        resolve(res.path)
      }
    })
  })
  //用户头像
  //绘制圆形图片
  ctx.save(); //  保存当前的绘图上下文
  ctx.beginPath();  //开始创建一个路径
  ctx.arc(188 * rpx, 155 * rpx, 54 * rpx, 0, 2 * Math.PI, false); //画一个圆形裁剪圈
  ctx.setStrokeStyle('#fff');
  ctx.stroke();
  ctx.clip(); //裁剪
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: userObj.avatarPath,
      success: (res) => {
        
        ctx.drawImage(res.path, 134 * rpx, 100 * rpx, 108 * rpx, 108 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.restore();  
  ctx.drawImage('/images/mc-e-marketing-share1.jpg', 0 * rpx, 923 * rpx + textHeight, 375 * rpx, 175 * rpx);
  await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: qrcodeUrl,
      success: (res) => {
        
        ctx.drawImage(res.path, 154 * rpx, (1000.5 * rpx + textHeight), 76 * rpx, 76 * rpx);
        resolve(res.path);
      }
    })
  })
}
const enterpriseMarketing4 = async (that, ctx, userObj, introduction, qrcodeUrl) => {
  //当前设备缩放比
  let rpx = 1;
  wx.getSystemInfo({
    success: function (res) {
      
      rpx = res.windowWidth / 375;
    },
  })
  //将长文字转换成短的行文字数组
  introduction.profileContent = "    " + introduction.profileContent.replace(/\s*/g, "");
  if (introduction.profileContent.length > 100) {
    introduction.profileContent = introduction.profileContent.substring(0, 100);
  }
  introduction.profileContent = introduction.profileContent + '...';
  let lineCount = parseInt(introduction.profileContent.length / 27) + 1;
  let textArray = [];
  for (let i = 0; i < lineCount; i++) {
    if (i == 0) {
      textArray.push(introduction.profileContent.substring(0, 28))
    } else {
      textArray.push(introduction.profileContent.substring(28 + 25 * (i - 1), 25 * i + 28))
    }
  }
  textArray = textArray.length > 7 ? textArray.slice(0, 7) : textArray;
  const textHeight = textArray.length * rpx * 21;
  //灰色背景
  ctx.setFillStyle('#d2e0f8');
  ctx.fillRect(0 * rpx, 0 * rpx, 375 * rpx, 840 * rpx);
  ctx.setFillStyle('#333333');
  ctx.fillRect(15*rpx,15*rpx,172.5*rpx,200*rpx);
  ctx.setFillStyle('#d14d44');
  ctx.fillRect(187.5 * rpx, 15 * rpx, 172.5*rpx,200*rpx);
  ctx.setFillStyle('#fff');
  ctx.fillRect(15*rpx,215*rpx,345*rpx,660*rpx);
  ctx.drawImage('/images/mc-e-marketing4-bg1.png',84.5*rpx,66*rpx,206*rpx,4.5*rpx);
  //名片信息
  ctx.setTextBaseline('top')
  ctx.setFillStyle('#fff');
  ctx.setFontSize(15 * rpx);
  if (userObj.userCompany.length > 12) {
    userObj.userCompany = userObj.userCompany.substr(0, 10) + '...'
  }
  ctx.fillText(userObj.userCompany, (345 * rpx - ctx.measureText(userObj.userCompany).width) / 2 + 15 * rpx, 41 * rpx);
  ctx.setFontSize(17 * rpx);
  ctx.fillText(userObj.userTelephone, (345 * rpx - ctx.measureText(userObj.userTelephone).width) / 2 + 15 * rpx, 148 * rpx);
  ctx.fillText(userObj.userEmail, (345 * rpx - ctx.measureText(userObj.userEmail).width) / 2 + 15 * rpx, 170 * rpx);
  ctx.setFontSize(17.5 * rpx);
  ctx.fillText(userObj.userName, (345 * rpx - ctx.measureText(userObj.userName).width) / 2 + 15 * rpx, 90 * rpx);
  ctx.setFontSize(13 * rpx);
  ctx.fillText(userObj.userOccupation, (345 * rpx - ctx.measureText(userObj.userOccupation).width) / 2 + 15 * rpx, 115 * rpx);
  //企业介绍
  drawText({
    x: 37 * rpx,
    y: 260 * rpx,
    color: '#111111',
    size: 15 * rpx,
    align: 'left',
    baseline: 'middle',
    text: introduction.profileTip,
    bold: true
  }, ctx);
  drawText({
    x: 39 * rpx,
    y: 285 * rpx,
    color: '#111111',
    size: 15 * rpx,
    align: 'left',
    baseline: 'middle',
    text: introduction.profileTitle,
    bold: true
  }, ctx);
  ctx.setFillStyle('#cd1d0f');
  ctx.fillRect(39*rpx,272*rpx,68*rpx,2*rpx);
  ctx.setFillStyle('#d24d44');
  ctx.moveTo(311*rpx,256*rpx);
  ctx.lineTo(360*rpx,256*rpx);
  ctx.lineTo(335*rpx,294*rpx);
  ctx.lineTo(286*rpx,294*rpx);
  ctx.fill();
  ctx.beginPath();
  ctx.setFillStyle('#333333');
  ctx.moveTo(360 * rpx, 256 * rpx);
  ctx.lineTo(335 * rpx, 294 * rpx);
  ctx.lineTo(360 * rpx,294*rpx);
  ctx.fill();
  /*文字换行 */
  ctx.setFillStyle('#111111');
  ctx.setFontSize(12 * rpx);
  ctx.setTextAlign('left');
  textArray.forEach(function (value, index, array) {
    ctx.fillText(value, 37 * rpx, (330 + 21 * index) * rpx);
  })
  //企业风采
  drawText({
    x: 37 * rpx,
    y: 366 * rpx + textHeight,
    color: '#111111',
    size: 15 * rpx,
    align: 'left',
    baseline: 'middle',
    text: introduction.styleEnglish,
    bold: true
  }, ctx);
  drawText({
    x: 39 * rpx,
    y: 391 * rpx + textHeight,
    color: '#111111',
    size: 15 * rpx,
    align: 'left',
    baseline: 'middle',
    text: introduction.styleTitle,
    bold: true
  }, ctx);
  ctx.beginPath();
  ctx.setFillStyle('#cd1d0f');
  ctx.fillRect(39 * rpx, 378 * rpx + textHeight, 68 * rpx, 2 * rpx);
  ctx.setFillStyle('#d24d44');
  ctx.moveTo(311 * rpx, 362 * rpx + textHeight);
  ctx.lineTo(360 * rpx, 362 * rpx + textHeight);
  ctx.lineTo(335 * rpx, 400 * rpx + textHeight);
  ctx.lineTo(286 * rpx, 400 * rpx + textHeight);
  ctx.fill();
  ctx.beginPath();
  ctx.setFillStyle('#333333');
  ctx.moveTo(360 * rpx, 362 * rpx + textHeight);
  ctx.lineTo(335 * rpx, 400 * rpx + textHeight);
  ctx.lineTo(360 * rpx, 400 * rpx + textHeight);
  ctx.fill();
  await new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: introduction.styleUrl,
      success: (res) => {
        
        ctx.drawImage(res.path, 50 * rpx, 430 * rpx + textHeight, 275 * rpx, 206 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.drawImage('/images/mc-e-marketing-share1.jpg', 0 * rpx, 668 * rpx + textHeight, 375 * rpx, 175 * rpx)
  await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: qrcodeUrl,
      success: (res) => {
        
        ctx.drawImage(res.path, 154 * rpx, (745.5 * rpx + textHeight), 76 * rpx, 76 * rpx);
        resolve(res.path);
      }
    })
  })
}
const productMarketing1 = async (that, ctx, cardImageSrc, goodsDetailArr, qrcodeUrl) => {
  //当前设备缩放比
  let rpx = 1;
  wx.getSystemInfo({
    success: function (res) {
      
      rpx = res.windowWidth / 375;
    },
  })
  //将长文字转换成短的行文字数组
  let goodsTitleList = [];
  goodsDetailArr.forEach(function (item, index, array){
    let goodsTitleItem = transformContentToMultiLineText(ctx, item.title, 200,14, 2);
    goodsDetailArr[index].title = goodsTitleItem;
  })
  ctx.setFillStyle('#d2e0f8')
  ctx.fillRect(10 * rpx, 20 * rpx, 365 * rpx, 780 * rpx)
  const cardImagePath = await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: 'https://img0.912688.com/mc-product-marketing-bg1.jpg',
      success: (res) => {
        ctx.drawImage(res.path, 10 * rpx, 20 * rpx, 365 * rpx, 826 * rpx);
        resolve(res.path)
      }
    })
  })
  //添加背景图
  const grd = ctx.createLinearGradient(0, 0, 0, 230 * rpx);
  grd.addColorStop(0, '#66a6ff');
  grd.addColorStop(1, '#7fe1f3');
  ctx.setFillStyle(grd);
  ctx.fillRect(22 * rpx, 35 * rpx, 341 * rpx, 230 * rpx);
  //优质产品展示
  ctx.setFillStyle('#fff');
  ctx.fillRect(22 * rpx, 265 * rpx, 341 * rpx, (31 + goodsDetailArr.length*125) * rpx);
  ctx.setTextBaseline('top')
  ctx.setFillStyle('#333333');
  ctx.setFontSize(15 * rpx);
  ctx.fillText('优质产品展示', (331 * rpx - ctx.measureText('优质产品展示').width) / 2 + 22 * rpx, 274 * rpx);
  //间隔矩形
  // ctx.setFillStyle('#f0f0f0');
  // ctx.fillRect(22 * rpx, 419 * rpx, 341 * rpx, 9 * rpx);
  // ctx.fillRect(22 * rpx, 546 * rpx, 341 * rpx, 9 * rpx);
  // ctx.fillRect(22 * rpx, 670 * rpx, 341 * rpx, 6 * rpx);
  //一条细线
  ctx.setStrokeStyle('#e8e8e8');
  ctx.save();
  ctx.translate(0.5, 0.5);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40*rpx, 300*rpx);
  ctx.lineTo(355*rpx, 300*rpx);
  ctx.stroke();
  ctx.restore();
  goodsDetailArr.forEach((item, idx)=>{
    ctx.setFillStyle('#f0f0f0');
    ctx.fillRect(22 * rpx, 419 * rpx+idx*125*rpx, 341 * rpx, 9 * rpx);
    ctx.drawImage(item.url, 36 * rpx, 314 * rpx+idx * 127*rpx, 92 * rpx, 92 * rpx);
    ctx.setFillStyle('#111111')
    ctx.setFontSize(14 * rpx);
    item.title.forEach(function (value, index, array){
      ctx.fillText(value, 136 * rpx, (315 + 19 * index + idx * 127) * rpx);
    })
    ctx.setFillStyle('#777777');
    ctx.setFontSize(12*rpx);
    ctx.fillText(item.companyName, 136 * rpx, 357 * rpx + idx * 127 * rpx);
    ctx.setFillStyle('#b2b2b2');
    ctx.drawImage(item.iconUrl, 136 * rpx, 387 * rpx + idx * 127 * rpx,8.5*rpx,11*rpx);
    ctx.fillText(item.address, 151 * rpx, 384 * rpx + idx * 127 * rpx);
    ctx.setFillStyle('#d94e43');
    ctx.setFontSize(15 * rpx);
    ctx.fillText('￥', 306 * rpx, 382 * rpx + idx * 127 * rpx);
    ctx.fillText(item.price, 320 * rpx, 382 * rpx + idx * 127 * rpx);
  })
  await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: qrcodeUrl,
      success: (res) => {
        
        ctx.drawImage(res.path, 155 * rpx, 748.5 * rpx , 76 * rpx, 76 * rpx);
        resolve(res.path);
      }
    })
  })
  ctx.setTextBaseline('normal');
  rpx = rpx * 1.29;
  //名片背景00
  if (cardImageSrc == '/images/business-card-bg1.png') {
    ctx.drawImage(cardImageSrc, 25 * rpx, 40 * rpx, 249 * rpx, 152 * rpx);
  } else {
    const cardImagePath = await new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: cardImageSrc,
        success: (res) => {
          
          resolve(res.path)
        }
      })
    })
    ctx.drawImage(cardImagePath, 25 * rpx, 40 * rpx, 249 * rpx, 152 * rpx);
  }
  //名片小程序二维码
  return { rpx }
} 
const productDetail = async (that, ctx, goodsDetailObj, qrcodeUrl) => {
  //当前设备缩放比
  let rpx = 1;
  wx.getSystemInfo({
    success: function (res) {
      
      rpx = res.windowWidth / 375;
    },
  })
  //将长文字转换成短的行文字数组
  let goodsTitleItem = transformContentToMultiLineText(ctx, goodsDetailObj.title, 330, 16, 2);
  let overHeight;
  if (goodsTitleItem.length == 1){
    overHeight = 23*rpx;
  }else{
    overHeight = 0;
  }
  await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: goodsDetailObj.posterUrl,
      success: (res) => {
        ctx.drawImage(res.path,0,2*overHeight,750,1334, 0, 0, 375 * rpx, 667 * rpx);
        resolve(res.path)
      }
    })
  })
  await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: goodsDetailObj.url,
      success: (res) => {
        ctx.drawImage(res.path, 15 * rpx, 15 * rpx, 345 * rpx, 345 * rpx);
        resolve(res.path)
      }
    })
  })
  ctx.setTextBaseline('top');
  ctx.setFillStyle('#fff');
  ctx.fillRect(15 * rpx, 360 * rpx - overHeight,345*rpx,180*rpx);
  ctx.setFillStyle('#111111');
  ctx.setFontSize(15*rpx);
  goodsTitleItem.forEach(function(value,index,array){
    drawText({
      x: 28 * rpx,
      y: (370 + 23*index) * rpx,
      color: '#111111',
      size: 15 * rpx,
      align: 'left',
      baseline: 'top',
      text: value,
      bold: true
    }, ctx);
    // ctx.fillText(value, 28 * rpx, (368 + 21 * index) * rpx);
  })
  
  ctx.setFillStyle('#999999');
  ctx.setFontSize(12 * rpx);
  ctx.fillText(goodsDetailObj.tip, 28 * rpx, 420 * rpx - overHeight);
  ctx.setTextAlign('center');
  ctx.fillText('起订量', 73 * rpx, 492 * rpx - overHeight);
  ctx.fillText('总供应', 189 * rpx, 492 * rpx - overHeight);
  ctx.fillText('所在地', 303 * rpx, 492 * rpx - overHeight);
  ctx.setFillStyle('#333333');
  ctx.fillText(goodsDetailObj.beginNumber, 73 * rpx, 510 * rpx - overHeight);
  ctx.fillText(goodsDetailObj.totalNumber, 189 * rpx, 510 * rpx - overHeight);
  ctx.fillText(goodsDetailObj.address, 303 * rpx, 510 * rpx - overHeight);
  
  // //商品价格
  ctx.setTextBaseline('normal');
  ctx.setFillStyle('#d94e43');
  ctx.setFontSize(15 * rpx);
  ctx.setTextAlign('left');
  ctx.fillText('￥', 26 * rpx, 468 * rpx - overHeight);
  ctx.setFontSize(21 * rpx);
  ctx.fillText(goodsDetailObj.minPrice, 42 * rpx, 468 * rpx - overHeight);
  //一条细线
  ctx.setStrokeStyle('#e8e8e8');
  ctx.save();
  ctx.translate(0.5, 0.5);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(15 * rpx, 484 * rpx - overHeight);
  ctx.lineTo(360 * rpx, 484 * rpx - overHeight);
  ctx.stroke();
  ctx.restore();

  ctx.setTextBaseline('top');
  ctx.setTextAlign('left');
  //绘制圆形图片
  // ctx.save(); //  保存当前的绘图上下文
  // ctx.beginPath();  //开始创建一个路径
  // ctx.arc(28 * rpx, 572 * rpx - overHeight, 13 * rpx, 0, 2 * Math.PI, false); //画一个圆形裁剪圈
  // ctx.setStrokeStyle('transparent'); //transparent
  // ctx.stroke();
  // ctx.clip(); //裁剪
  // await new Promise(function (resolve, reject) {
  //   wx.getImageInfo({
  //     src: goodsDetailObj.userUrl,
  //     success: (res) => {
  //       ctx.drawImage(res.path, 15 * rpx, 559 * rpx - overHeight, 26 * rpx, 26 * rpx);
  //       resolve(res.path)
  //     }
  //   })
  // })
  // ctx.drawImage('/images/cie-avatar.jpg',198,68,42,42);
  // ctx.restore();  //恢复之前保存的绘图上下文
  ctx.setFillStyle('#fff');
  // ctx.setFontSize(11*rpx);
  // ctx.fillText(goodsDetailObj.userName + ' 为您推荐商品啦~', 50 * rpx, 564 * rpx - overHeight);
  ctx.setFontSize(19 * rpx);
  drawText({
    x: 16 * rpx,
    y: 568 * rpx - overHeight,
    color: '#fff',
    size: 18 * rpx,
    align: 'left',
    baseline: 'top',
    text: '长按识别小程序码',
    bold: true
  }, ctx);
  ctx.setFontSize(15 * rpx);
  ctx.fillText('查看更多商品详情', 16 * rpx, 618 * rpx - overHeight);
  await new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: qrcodeUrl,
      success: (res) => {
        
        ctx.drawImage(res.path, 275 * rpx, 564 * rpx - overHeight, 76 * rpx, 76 * rpx);
        resolve(res.path);
      }
    })
  })
}
/**
 * 获取文本折行
 * @param {Object} obj
 * @return {Array} arrTr
 */
const getTextLine = (obj,ctx) => {
  ctx.setFontSize(obj.size);
  let arrText = obj.text.split('');
  let line = '';
  let arrTr = [];
  for (let i = 0; i < arrText.length; i++) {
    var testLine = line + arrText[i];
    var metrics = ctx.measureText(testLine);
    var width = metrics.width;
    if (width > obj.width && i > 0) {
      arrTr.push(line);
      line = arrText[i];
    } else {
      line = testLine;
    }
    if (i == arrText.length - 1) {
      arrTr.push(line);
    }
  }
  return arrTr;
}
//超出几行省略号
const transformContentToMultiLineText = (ctx, text, contentWidth,size, lineNumber) => {
  ctx.setFontSize(size);
  var textArray = text.split(""); // 分割成字符串数组
  var temp = "";
  var row = [];

  for (var i = 0; i < textArray.length; i++) {
    if (ctx.measureText(temp).width < contentWidth) {
      temp += textArray[i];
    } else {
      i--; // 这里添加i--是为了防止字符丢失
      row.push(temp);
      temp = "";
    }
  }
  row.push(temp);

  // 如果数组长度大于2，则截取前两个
  if (row.length > lineNumber) {
    var rowCut = row.slice(0, lineNumber);
    var rowPart = rowCut[1];
    var test = "";
    var empty = [];
    for (var a = 0; a < rowPart.length; a++) {
      if (ctx.measureText(test).width < contentWidth) {
        test += rowPart[a];
      } else {
        break;
      }
    }
    empty.push(test); // 处理后面加省略号
    var group = empty[0] + '...'
    rowCut.splice(lineNumber - 1, 1, group);
    row = rowCut;
  }
  return row;
}
const drawText = (obj,ctx) => {
  ctx.save();
  ctx.setFillStyle(obj.color);
  ctx.setFontSize(obj.size);
  ctx.setTextAlign(obj.align);
  ctx.setTextBaseline(obj.baseline);
  if (obj.bold) {
    // ctx.fillText(obj.text, obj.x, obj.y - 0.5);
    // ctx.fillText(obj.text, obj.x - 0.5, obj.y);
    // ctx.fillText(obj.text, obj.x, obj.y);
    ctx.fillText(obj.text, obj.x , obj.y + 0.2);
    ctx.fillText(obj.text, obj.x + 0.2, obj.y);
  }
  ctx.restore();
}
const canvasToImageIntro1 = (that) => {
  that.setData({
    canSave: true
  })
  wx.canvasToTempFilePath({
    x: 8,
    y: 20,
    fileType: 'png',
    quality: 1,//图片质量
    canvasId: 'customCanvas',
    success: (res) => {
      wx.hideLoading();
      // that.setData({
      //   cardImagePath: res.tempFilePath
      // })
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(res) {
          wx.showToast({
            title: '图片保存成功',
          })
        },
        fail(res) {
          ;
          wx.showToast({
            title: '用户未授权',
          })
        }
      })
    }
  }, this)
}
const goodsPrice = (array,ctx,rpx) => {
  let widthx = 0;
  array.forEach(function (item, index, array) {
    if (index > 0) {
      // ctx.setFontSize(15 * rpx);
      if (index == 2 || index == 6) {
        ctx.setFontSize(21 * rpx);
        widthx = 2
      }
      else {
        widthx = 0
        ctx.setFontSize(15 * rpx);
      }
      array[index].widthx = array[index - 1].widthx + ctx.measureText(array[index - 1].text).width + widthx;
    }
  })
  ctx.setTextBaseline('normal');
  ctx.setFillStyle('#d94e43');
  ctx.setFontSize(15 * rpx);
  ctx.fillText(array[0].text, array[0].widthx * rpx, 468 * rpx);
  ctx.fillText(array[2].text, array[2].widthx * rpx, 468 * rpx);
  ctx.fillText(array[3].text, array[3].widthx * rpx - 2 * rpx, 468 * rpx);
  ctx.fillText(array[4].text, array[4].widthx * rpx, 468 * rpx);
  ctx.fillText(array[6].text, array[6].widthx * rpx, 468 * rpx);
  ctx.setTextAlign('left');
  ctx.setFontSize(21 * rpx);
  ctx.fillText(array[1].text, (array[1].widthx - 8) * rpx, 468 * rpx);
  ctx.fillText(array[5].text, (array[5].widthx - 8) * rpx, 468 * rpx);
}
module.exports = {
  canvasCommon,
  canvasToImage,
  canvasToImageIntro1,
  cardPoster1,
  cardPoster2,
  cardPoster3,
  cardPoster4,
  cardPoster5,
  cardPoster6,
  cardPoster7,
  cardPoster8,
  cardPoster9,
  cardPoster10,
  cardPoster11,
  cardPoster12,
  cardPoster13,
  cardPoster14,
  cardPoster15,
  cardPoster16,
  enterpriseMarketing1,
  enterpriseMarketing2,
  enterpriseMarketing3,
  enterpriseMarketing4,
  productMarketing1,
  productDetail,
}