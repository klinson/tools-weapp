//app.js
const https = require('/utils/https.js');
const cache = require('/utils/cache.js');
const notice = require('/utils/notice.js');
wx.cloud.init({
  env: 'random-78lbw'
})
App({
  https,
  cache,
  notice,
  onLaunch: function () {
    let that = this;
    this.checkEnv()

    // 登录
    let user = wx.getStorageSync('user_info');
    if (user && wx.getStorageSync('login_token')) {
      this.globalData.userInfo = user;
    } else {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          that.loginDo({
            code: res.code,
            is_try: true,
          })
        }
      })
    }
    
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },

  checkEnv: function (success, error) {
    let that = this;
    wx.cloud.database().collection('configs').doc('f1ae76a4-7180-4544-83d6-e176e2e616bb').get({
      success: function (res) {
        console.log('env:', res.data.env);
        that.globalData.env = res.data.env;
        if (res.data.env != 'production') {
          that.globalData.bottomNavBars = [
            {
              key: 'tools',
              title: '工具',
              icon: 'tools',
              path: '/pages/tools/index',
            },
            {
              key: 'user',
              title: '个人中心',
              icon: 'about',
              path: '/pages/user/index',
            }
          ]
        } else {
          that.globalData.bottomNavBars = [
            {
              key: 'posts',
              title: '论坛',
              icon: 'tools',
              path: '/pages/tools/index',
            },
            {
              key: 'tools',
              title: '工具',
              icon: 'tools',
              path: '/pages/tools/index',
            },
            {
              key: 'user',
              title: '个人中心',
              icon: 'about',
              path: '/pages/user/index',
            }
          ]
        }

        if (success) {
          success(res.data.env);
        } else {
          // 刷新页面
          getCurrentPages()[getCurrentPages().length - 1].onLoad()
        }
      },
      error: function(res) {
        error && error(res);
      }
    })
  },

  loginDo: function (object) {
    let params;
    let that = this;
    if (object.user_info) {
      // 用户通过登录按钮进行登录
      params = {
        code: object.code,
        user: object.user_info
      }
    } else if (object.is_try) {
      params = {
        code: object.code,
        type: 'try'
      }
    } else {
      params = {
        code: object.code
      }
    }
    https.POST({
      url: '/api/auth/wxappLogin',
      params: params,
      success: function (res) {
        if (res.data.token) {
          wx.setStorage({
            key: 'user_info',
            data: res.data.user
          })
          wx.setStorage({
            key: 'login_token',
            data: res.data.token
          })
          that.globalData.userInfo = res.data.user;
          
          if (object.is_try) {
            object.try_success && object.try_success(res);
          } else {
            object.success && object.success(res)
          }
        } else {
          if (object.is_try) {
            object.try_error && object.try_error(res);
          }
        }
      },
      error: function (res) {
        wx.setStorage({
          key: 'user_info',
          data: null
        })
        wx.setStorage({
          key: 'login_token',
          data: null
        })
        that.globalData.userInfo = null

        object.error && object.error(res)
      }
    })
  },
  globalData: {
    env: 'production',
    userInfo: null,
    topNavBar: {
      bgColor: 'bg-gradual-blue'
    },
    bottomNavBars: [
      {
        key: 'posts',
        title: '论坛',
        icon: 'tools',
        path: '/pages/tools/index',
      },
      {
        key: 'tools',
        title: '工具',
        icon: 'tools',
        path: '/pages/tools/index',
      },
      {
        key: 'user',
        title: '个人中心',
        icon: 'about',
        path: '/pages/user/index',
      }
    ],
  }
})