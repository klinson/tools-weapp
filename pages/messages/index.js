const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,

    page: 1,
    pageRows: 10,
    isLastPage: 0,
    list: [],
    TabCur: 0,

    message_count: {
      comment_message_count: 0,
      other_count: 0
    },
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    }, () => {
      this.clearMessageCount();
    })
  },

  bindToShowPage: function (e) {
    wx.navigateTo({
      url: '/pages/posts/show/index?id=' + e.currentTarget.dataset.post_id
    })
  },

  getList: function (isNext) {
    let that = this;
    app.https.GET({
      url: '/api/postComments',
      params: {
        page: that.data.page,
        per_page: that.data.pageRows,
        include: 'owner',
      },
      success: function (res) {
        if (isNext) {
          //获取下一页
          that.setData({
            list: that.data.list.concat(res.data.data),
            isLastPage: res.data.meta.pagination.total_pages > res.data.meta.pagination.current_page ? 0 : 1,
          });
        } else {
          that.setData({
            list: res.data.data,
            isLastPage: res.data.meta.pagination.total_pages > res.data.meta.pagination.current_page ? 0 : 1,
          });
        }
      }
    });
  },

  getMessageCount: function () {
    let that = this;
    app.api.message.count({
      success: function (res) {
        that.setData({
          message_count: res.data,
        });
        that.clearMessageCount();
      }
    })
  },

  clearMessageCount: function () {
    let type, now_count;
    switch (Number(this.data.TabCur)) {
      case 0:
        now_count = this.data.message_count.comment_message_count || 0;
        type = 'comment';
        break;
      case 1:
        now_count = this.data.message_count.other_count || 0;
        type = 'other';
        break;
    }
    if (! (now_count && now_count > 0)) {
      return;
    }
    let that = this;
    app.api.message.clearCount({
      type: type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getMessageCount()
    this.getList(0);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLastPage) {
      return false;
    }
    this.setData({
      page: this.data.page + 1
    });
    this.getList(1);
  }
})