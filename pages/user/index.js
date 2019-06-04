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

    logined_list: [
      {
        key: 'user_info',
        title: '个人信息',
        path: '/pages/user/info/index',
      }
    ],
    unlogined_list: [
      {
        key: 'about',
        title: '意见反馈',
        path: '/pages/about/index',
      },
      {
        key: 'about',
        title: '关于我们',
        path: '/pages/about/index',
      }
    ],
  },

  onShow() {
    if (app.globalData.userInfo) {
      this.setData({
        user_info: app.globalData.userInfo,
        is_login: true
      });
    }
  },

  NavChange(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })
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