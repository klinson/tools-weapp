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
    search: '',

    categories: [],
    category_id: 0,

    point: [],
  },
  
  onLoad(options) {
    this.getCategories();
  },


  getCategories: function () {
    let that = this;

    app.https.GET({
      url: '/api/postCategories',
      success: function (res) {
        let list = res.data.data;
        list.unshift({
          id: 0,
          title: '所有'
        })
        that.setData({
          categories: list,
        });
      }
    });
  },

  bindSelectCategory: function (e) {
    this.setData({
      category_id: e.currentTarget.dataset.id
    }, () => {
      this.getList(0);
    });
  },

  getList: function (isNext) {
    let that = this;
    app.https.GET({
      url: '/api/posts',
      params: {
        page: that.data.page,
        per_page: that.data.pageRows,
        include: 'owner,category',
        category_id: that.data.category_id,
        q: that.data.search,
        point: that.data.point,
        mine: 1,
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
  },

  bindInputChange: function (e) {
    this.setData({
      [e.target.dataset.input]: e.detail.value
    })
  },

  bindSutmitSearch: function (e) {
    this.getList(0);
  },

  bindToCreatePage: function (e) {
    wx.navigateTo({
      url: '/pages/posts/form/index?category_id=' + this.data.category_id,
    })
  },

  bindToShowPage: function (e) {
    wx.navigateTo({
      url: '/pages/posts/show/index?id=' + e.currentTarget.dataset.id
    })
  },

  bindToMessagesPage: function (e) {
    wx.navigateTo({
      url: '/pages/messages/index'
    })
  }
})