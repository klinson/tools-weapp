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

    comment: {
      images: [],
      content: '',
      to_user_id: 0,
      to_comment_id: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
      success: res => {
        this.deleteDo(this.data.id)
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
      modalName: e.currentTarget.dataset.target
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

    this.hideModal(e);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})