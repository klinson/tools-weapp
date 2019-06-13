const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,
    bottomNavBars: app.globalData.bottomNavBars,
    bottomNavBarKey: 'posts',

    is_login: false,
    user_info: null,

    page: 1,
    pageRows: 10,
    isLastPage: 0,
    list: [],
    search: '',

    categories: [],
    category_id: 0,

    point: [],

    message_count: 0,
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
    this.getCategories();
  },

  getCategories: function() {
    let that = this;

    app.https.GET({
      url: '/api/postCategories',
      success: function(res) {
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

  bindSelectCategory: function(e) {
    this.setData({
      category_id: e.currentTarget.dataset.id
    }, () => {
      this.getList(0);
    });
  },

  getList: function(isNext) {
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
      },
      success: function(res) {
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
  onReady: function() {
    this.getList(0);
  },

  updateLoginInfo() {
    if (app.globalData.userInfo) {
      this.setData({
        user_info: app.globalData.userInfo,
        is_login: true
      });
    } else {
      this.setData({
        user_info: null,
        is_login: false
      });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getList(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.isLastPage) {
      return false;
    }
    this.setData({
      page: this.data.page + 1
    });
    this.getList(1);
  },

  bindInputChange: function(e) {
    this.setData({
      [e.target.dataset.input]: e.detail.value
    })
  },

  bindSutmitSearch: function(e) {
    this.getList(0);
  },

  bindToCreatePage: function(e) {
    wx.navigateTo({
      url: '/pages/posts/form/index?category_id=' + this.data.category_id,
    })
  },

  bindToShowPage: function(e) {
    wx.navigateTo({
      url: '/pages/posts/show/index?id=' + e.currentTarget.dataset.id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.updateLoginInfo();
    this.getMessageCount()
  },

  getLocation: function() {
    let that = this;

    if (that.data.point.length > 0) {
      // 关闭位置
      app.notice.showToast('关闭定位信息中', 'success', () => {
        that.setData({
          point: [],
        }, () => {
          that.getList(0);
        })
      })
    } else {
      wx.showModal({
        title: '定位',
        content: '开启定位进行距离测算？',
        cancelText: '取消',
        confirmText: '确定',
        success: (res) => {
          if (res.confirm) {
            wx.getLocation({
              type: 'gcj02',
              success: function(res) {
                // console.log(res)
                that.setData({
                  point: [res.longitude, res.latitude],
                })
              },
              complete: function() {
                that.getList(0);
              }
            })
          }
        }
      })
    }
  },

  bindToMessagesPage: function(e) {
    wx.navigateTo({
      url: '/pages/messages/index'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getMessageCount: function() {
    if (!this.data.is_login) {
      this.setData({
        message_count: 0,
      });
      return;
    }
    let that = this;
    app.api.message.count({
      success: function(res) {
        that.setData({
          message_count: Number(res.data.comment_message_count) + Number(res.data.other_count),
        });
      }
    })
  },

  bindGetUserInfo: function (e) {
    let that = this;
    if (e.detail.userInfo) {
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            app.loginDo({
              code: res.code,
              user_info: e.detail.userInfo,
              success: function (res) {
                that.setData({
                  is_login: true,
                  user_info: res.data.user
                })
                that.bindToCreatePage();
              },
              error: function (res) {
                that.setData({
                  is_login: false,
                  user_info: null
                })
                app.notice.showToast('登录失败', 'fail')
              }
            })
          } else {
            that.setData({
              is_login: false,
              user_info: null
            })
            app.notice.showToast('登录失败', 'fail')
          }
        }
      });
    } else {
      that.setData({
        is_login: false,
        user_info: null
      })
      app.notice.showToast('登录失败', 'fail')
    };
  },

})