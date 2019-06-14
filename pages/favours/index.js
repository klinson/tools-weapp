const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,
    bottomNavBars: app.globalData.bottomNavBars,
    bottomNavBarKey: 'favours',

    animation: ''
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

  bindFavour: function (e) {
    let type = e.currentTarget.dataset.type;
    let anmiaton;
    if (type) {
      // 喜欢
      anmiaton = 'slide-lefts';
    } else {
      // 不喜欢
      anmiaton = 'slide-rights';
    }
    var that = this;
    that.setData({
      animation: anmiaton
    })
    setTimeout(function () {
      that.setData({
        animation: ''
      })
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})