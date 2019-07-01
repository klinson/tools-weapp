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

    friend_id: 0,
    friend: null,
  },

  getInfo: function (id) {
    let that = this;
    app.api.friend.info({
      friend_id: id,
      params: {
        include: 'friend'
      },
      success: function (res) {
        that.setData({
          friend: res.data,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.friend_id) {
      this.getInfo(options.friend_id);
      this.setData({
        friend_id: options.friend_id
      })
    }
  },

  bindToChatRoom: function() {
    wx.navigateTo({
      url: '/pages/chat_rooms/show/index?friend_id=' + this.data.friend.id,
    })
  }

})