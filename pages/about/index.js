const app = getApp()
var WxParse = require('../../utils/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,

    show_template: false,
    content: '',

    admin_openid: '',
    env: app.globalData.env,
    user_info: app.globalData.userInfo,

    now_year: '',
  },

  bindChangeEnv: function(e) {
    if (this.data.admin_openid == this.data.user_info.wxapp_openid) {
      let that = this;
      let data = {
        env: that.data.env == 'production' ? 'dev' : 'production'
      };
      wx.cloud.database().collection('configs').doc('2d9d2d8c5cfcb22d026de50c6412677f').update({
        data: data,
        success: function(res) {
          app.notice.showToast('状态切换成功');
          app.checkEnv();
          that.setData({
            env: data.env,
          })
        },
        fail: function(res) {
          app.notice.showToast('状态切换失败', 'fail');
          console.log('change-env-fail', res);
        }
      })
    }
  },

  setAdminOpenid: function() {
    let that = this;
    wx.cloud.database().collection('configs').doc('d2c62539-ead2-4628-a395-d1e8a67378c0').get({
      success: function(res) {
        that.setData({
          admin_openid: res.data.admin_openid
        })
      }, 
      fail: function (res) {
        console.log(res);
      }
    });
  },

  onLoad(options) {
    this.getData();
    this.setAdminOpenid();
    this.setData({
      env: app.globalData.env,
      user_info: app.globalData.userInfo,
      now_year: app.utils.now_year()
    })
  },

  getData() {
    let that = this;
    app.https.getConfig('wxapp_about_us', (res) => {
      if (res) {
        that.setData({
          content: res,
          show_template: false
        })
        WxParse.wxParse('article', 'html', res, that, 5);
      } else {
        that.setData({
          show_template: true
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})