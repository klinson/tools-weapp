// pages/friends/show/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,

    user_id: 0,
    user: null,
  },

  getInfo: function (id) {
    let that = this;
    app.https.GET({
      url: '/api/users/' + id,
      params: {
        include: ''
      },
      success: function (res) {
        that.setData({
          user: res.data,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.user_id) {
      this.getInfo(options.user_id);
      this.setData({
        user_id: options.user_id
      })
    }
  },

  bindToChatRoom: function() {
    wx.navigateTo({
      url: '/pages/chat_rooms/show?user_id='+this.options.user_id,
    })
  }

})