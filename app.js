//app.js
const https = require('/utils/https.js');
const utils = require('/utils/util.js');
const cache = require('/utils/cache.js');
const notice = require('/utils/notice.js');
const api = require('/utils/api.js');
const ws = require('/utils/websocket.js');
wx.cloud.init({
  env: 'random-78lbw'
})
App({
  https,
  cache,
  notice,
  utils,
  api,
  ws,
  onLaunch: function () {
    let that = this;
    this.checkEnv();

    wx.onAppShow(function(res) {
      console.log('websocket状态：', ws.status())
      ws.connect();
    });

    // 登录
    let user = wx.getStorageSync('user_info');
    if (user && wx.getStorageSync('login_token')) {
      this.globalData.userInfo = user;
      ws.connect();
      that.startRecordLocation();
    } else {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          that.loginDo({
            code: res.code,
            is_try: true,
            try_success: function() {
              that.startRecordLocation();
              // api.user.recordLocation();
            }
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
    wx.cloud.database().collection('configs').doc('2d9d2d8c5cfcb22d026de50c6412677f').get({
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
              icon: 'posts',
              path: '/pages/posts/index',
            },
            {
              key: 'favours',
              title: '配对',
              icon: 'favours',
              path: '/pages/favours/index',
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

  startRecordLocation() {
    let now_timestamp = utils.nowTimestamp();
    let times = 300000; //5分钟记录一次定位一次
    let that = this;
    let timer = wx.getStorageSync('user_location_timer')
    let next_time = wx.getStorageSync('user_location_record_next_time')

    if (timer && next_time) {
      if (next_time < now_timestamp) {
        // 已停止状态,没有按时执行
        // 删除旧的
        clearInterval(timer)
        wx.removeStorageSync('user_location_timer');
        wx.removeStorageSync('user_location_record_next_time');
      } else {
        // 正常无需处理
        return ;
      }
    }

    // 重新启动记录
    if (that.globalData.userInfo) {
      api.user.recordLocation();
      wx.setStorage({
        key: 'user_location_record_next_time',
        data: utils.nowTimestamp() + times,
      })
      // 5分钟记录一次定位
      let timer = setInterval(() => {
        api.user.recordLocation();
        wx.setStorage({
          key: 'user_location_record_next_time',
          data: utils.nowTimestamp() + times,
        })
      }, times);
      wx.setStorage({
        key: 'user_location_timer',
        data: timer,
      })
    }
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
        icon: 'posts',
        path: '/pages/posts/index',
      },
      {
        key: 'favours',
        title: '配对',
        icon: 'favours',
        path: '/pages/favours/index',
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