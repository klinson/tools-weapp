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
  },

  NavChange(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })
  },

  onShareAppMessage: function () {
    // return custom share data when user share.
  }
})
