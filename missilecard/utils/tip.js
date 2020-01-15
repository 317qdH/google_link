
/**
 * 提示与加载工具类
 */
export default class Tip {
  static isLoading = false;

  /**
   * 自定义提示框
   */
  static toast(title, icon = "success", duration = 1000, onHide) {
    setTimeout(() => {
      wx.showToast({
        title: title,
        icon: icon,
        mask: true,
        duration: duration
      });
    }, 100);

    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide();
      }, 1000);
    }
  }

  /**
   * 成功提示框
   */
  static success(title, duration = 1000) {
    setTimeout(() => {
      wx.showToast({
        title: title,
        icon: "success",
        mask: true,
        duration: duration
      });
    }, 100);
    if (duration > 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, duration);
      });
    }
  }

  /**
   * 确认窗口
   */
  static confirm(text, payload = {}, title = "提示") {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: title,
        content: text,
        success: res => {
          if (res.confirm) {
            resolve(payload);
          } else if (res.cancel) {
            reject(payload);
          }
        },
        fail: res => {
          reject(payload);
        }
      });
    });
  }

  /**
   * 叹号警告框
   */
  static alert(title, duration = 1000) {
    wx.showToast({
      title: title,
      image: "/images/alert.png",
      mask: true,
      duration: duration
    });
  }

  /**
   * 错误提示框
   */
  static error(title, onHide) {
    wx.showToast({
      title: title,
      image: "/images/error.png",
      mask: true,
      duration: 1000
    });
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide();
      }, 500);
    }
  }

  /**
   * 弹出加载提示
   */
  static loading(title = "加载中", mask = true) {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    wx.showLoading({
      title: title,
      mask: mask
    });
  }

  /**
   * 加载完毕
   */
  static loaded() {
    if (this.isLoading) {
      this.isLoading = false;
      wx.hideLoading();
    }
  }

  /**
   * 分享成功
   */
  static share() {
    this.toast("分享成功");
  }

  static setLoading() {
    this.isLoading = true;
  }
}
