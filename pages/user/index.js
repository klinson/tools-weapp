//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,
    bottomNavBars: app.globalData.bottomNavBars,
    bottomNavBarKey: 'user',

    is_login: false,
    user_info: null,
    env: app.globalData.env,
    websocket: false,
  },

  NavChange(e) {
    wx.redirectTo({
      url: e.currentTarget.dataset.path,
    })
  },

  onLoad(options) {
    this.setData({
      bottomNavBars: app.globalData.bottomNavBars,
      env: app.globalData.env
    });
  },

  onShow() {
    this.updateLoginInfo();
    this.setData({
      websocket: app.ws.status()
    });
  },

  bindReconnectWs() {
    if (app.ws.status && app.ws.status() != this.data.websocket) {
      app.notice.showToast('连接成功', 'success')
      this.setData({
        websocket: app.ws.status()
      });
      return ;
    }
    let that = this;
    app.ws.connect({
      complete: function () {
       let status = app.ws.status();
        app.notice.showToast(status ? '连接成功' : '连接失败', status ? 'success' : 'fail')
        that.setData({
          websocket: status
        });
      }
    });
    
  },

  updateLoginInfo() {
    if (app.globalData.userInfo) {
      this.setData({
        user_info: app.globalData.userInfo,
        is_login: true
      });
    } else {
      this.setData({
        user_info: null,
        is_login: false
      });
    }
  },

  bindCheckEnv() {
    app.notice.showToast('检测中', 'loading');
    app.checkEnv((env) => {
      app.notice.showToast('刷新成功', 'success');
      this.data.env != env && this.onLoad();
    });
  },

  bindGetUserInfo: function(e) {
    let that = this;
    if (e.detail.userInfo) {
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            app.loginDo({
              code: res.code,
              user_info: e.detail.userInfo,
              success: function (res) {
                that.setData({
                  is_login: true,
                  user_info: res.data.user
                })

              },
              error: function (res) {
                that.setData({
                  is_login: false,
                  user_info: null
                })
              }
            })
          } else {
            app.notice.showToast('登录失败', 'fail')
          }
        }
      });
    } else {
      app.notice.showToast('登录失败', 'fail')
    };
  },

  onShareAppMessage: function() {
    // return custom share data when user share.
  }
})