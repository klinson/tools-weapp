// pages/posts/show/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,
    
    id: 0,
    info: null,

    user_info: app.globalData.userInfo,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id,
        user_info: app.globalData.userInfo
      }, () => {
        this.getInfo(options.id)
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },

  getInfo: function (id) {
    let that = this;
    app.https.GET({
      url: '/api/posts/' + id,
      params: {
        include: 'category,owner'
      },
      success: function (res) {
        res.data.decode_content = res.data.content.split("\n")
        that.setData({
          info: res.data,
        });
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.info.images,
      current: e.currentTarget.dataset.url
    });
  },

  bindToCreatePage: function (e) {
    wx.navigateTo({
      url: '/pages/posts/form/index?id=' + this.data.id,
    })
  },

  bindDeleteBtn: function(e) {
    wx.showModal({
      title: '确定删除',
      content: '确定要删除此帖子吗，无法恢复？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        this.deleteDo(this.data.id)
      }
    })
  },

  deleteDo: function (id) {
    let that = this;
    app.https.DELETE({
      url: '/api/posts/' + id,
      success: function (res) {
        wx.navigateTo({
          url: '/pages/posts/index',
        })
      }
    });
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