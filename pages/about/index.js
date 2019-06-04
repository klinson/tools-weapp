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
  },

  onLoad(options) {
    this.getData();
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
  onShareAppMessage: function () {

  }
})