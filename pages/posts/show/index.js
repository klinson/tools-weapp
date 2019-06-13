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
    is_login: false,

    comment: {
      images: [],
      content: '',
      to_user_id: 0,
      to_comment_id: 0
    },

    page: 1,
    pageRows: 10,
    isLastPage: 0,
    list: [],
    total_count: 0,
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
                app.notice.showToast('登录成功')
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        id: options.id,
      }, () => {
        this.getInfo(options.id)
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.updateLoginInfo();
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

  getInfo: function(id) {
    let that = this;
    app.https.GET({
      url: '/api/posts/' + id,
      params: {
        include: 'category,owner'
      },
      success: function(res) {
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

  ViewCommentListImage(e) {
    console.log(e.currentTarget.dataset.key)
    wx.previewImage({
      urls: this.data.list[e.currentTarget.dataset.key].images,
      current: e.currentTarget.dataset.url
    });
  },

  ViewToCommentImage(e) {
    wx.previewImage({
      urls: this.data.list[e.currentTarget.dataset.key].toComment.images,
      current: e.currentTarget.dataset.url
    });
  },

  bindToCreatePage: function(e) {
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
      success: (res) => {
        if (res.confirm) {
          this.deleteDo(this.data.id)
        }
      }
    })
  },

  deleteDo: function(id) {
    let that = this;
    app.https.DELETE({
      url: '/api/posts/' + id,
      success: function(res) {
        wx.navigateTo({
          url: '/pages/posts/index',
        })
      }
    });
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      'comment.to_user_id': e.currentTarget.dataset.uid || 0,
      'comment.to_comment_id': e.currentTarget.dataset.id || 0,
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  ChooseImage() {
    let that = this;
    app.https.uploadImages({
      count: 9 - this.data.comment.images.length,
      sizeType: 2,
      success: function(res) {
        let images = that.data.comment.images;
        images = images.concat(res.urls)
        that.setData({
          'comment.images': images
        })
      }
    })
  },
  ViewCommentImage(e) {
    wx.previewImage({
      urls: this.data.comment.images,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除图片',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.info.images.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            'info.images': this.data.info.images
          })
        }
      }
    })
  },

  bindInputChange: function(e) {
    this.setData({
      [e.target.dataset.input]: e.detail.value
    })
  },

  bindSubmitComment: function(e) {
    if (this.data.comment.content.length < 0) {
      app.notice.showModal('评论内容不能为空')
      return 0;
    }

    let that = this;
    app.https.POST({
      url: '/api/postComments/' + that.data.id,
      params: that.data.comment,
      success: function(res) {
        that.setData({
          comment: {
            images: [],
            content: '',
            to_user_id: 0,
            to_comment_id: 0
          }
        })
        app.notice.showToast('评论成功');
        that.hideModal();
        that.onReady();
      }
    });
  },

  getList: function(isNext) {
    let that = this;
    app.https.GET({
      url: '/api/postComments',
      params: {
        post_id: that.data.id,
        page: that.data.page,
        per_page: that.data.pageRows,
        include: 'owner,toComment,toComment.owner',
      },
      success: function(res) {
        for (let i = 0, len = res.data.data.length; i < len; i++) {
          res.data.data[i].decode_content = res.data.data[i].content.split("\n")
          if (res.data.data[i].toComment) {
            res.data.data[i].toComment.decode_content = res.data.data[i].toComment.content.split("\n");
          }
        }
        if (isNext) {
          //获取下一页
          that.setData({
            total_count: res.data.meta.pagination.total,
            list: that.data.list.concat(res.data.data),
            isLastPage: res.data.meta.pagination.total_pages > res.data.meta.pagination.current_page ? 0 : 1,
          });
        } else {
          that.setData({
            total_count: res.data.meta.pagination.total,
            list: res.data.data,
            isLastPage: res.data.meta.pagination.total_pages > res.data.meta.pagination.current_page ? 0 : 1,
          });
        }
      }
    });
  },

  bindDeleteComment: function (e) {
    let that = this;
    wx.showModal({
      title: '确定删除',
      content: '确定要删除此评论吗，无法恢复？',
      cancelText: '取消',
      confirmText: '确定',
      success: (res) => {
        if (res.confirm) {
          app.https.DELETE({
            url: '/api/postComments/' + e.currentTarget.dataset.id,
            success: function (res) {
              app.notice.showToast('删除成功', 'success', () => {
                that.onReady();
              });
            }
          });
        }
      }
    })
  },

  bindOpenMap: function() {
    let that = this;
    wx.openLocation({
      longitude: that.data.info.point[0],
      latitude: that.data.info.point[1],
      name: that.data.info.address,
      address: that.data.info.address,
      scale: 18,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getList(0);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getInfo(this.data.id);
    this.getList(0);
    this.setData({
      user_info: app.globalData.userInfo
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})