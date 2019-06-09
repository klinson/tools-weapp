// pages/posts/form/index.js
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
    info: {
      title: '',
      content: "",
      images: [],
      address: '',
      point: '',
      category_id: 0,
      category_index: 0,
      point: [],
      address: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      // 编辑
      this.setData({
        id: options.id,
      }, () => {
        this.getInfo(options.id)
      })
    } else {
      // 创建
      if (options.category_id) {
        this.setData({
          'info.category_id': options.category_id,
        })
      }
      this.getCategories();
    }
  },

  getInfo: function(id) {
    let that = this;
    app.https.GET({
      url: '/api/posts/' + id,
      params: {
        include: 'category'
      },
      success: function (res) {
        that.setData({
          info: res.data,
        });
      }
    });
  },

  getCategories: function () {
    let that = this;

    app.https.GET({
      url: '/api/postCategories',
      success: function (res) {
        let list = res.data.data;
        let category_index = 0;
        if (that.data.info.category_id) {
          for (let i = 0, len = res.data.data.length; i < len; i++) {
            if (res.data.data[i].id == that.data.info.category_id) {
              category_index = i;
              break;
            }
          }
        }
        
        that.setData({
          categories: list,
          'info.category_index': category_index
        });
      }
    });
  },

  bindInputChange: function (e) {
    this.setData({
      [e.target.dataset.input]: e.detail.value
    })
  },

  ChooseImage() {
    let that = this;
    app.https.uploadImages({
      count: 9-this.data.info.images.length,
      sizeType: 2,
      success: function (res) {
        let images = that.data.info.images;
        images = images.concat(res.urls)
        that.setData({
          'info.images': images
        })
      }
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.info.images,
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

  bindSubmitDo: function (e) {
    let that = this;
    let params = {
      title: that.data.info.title,
      content: that.data.info.content,
      images: that.data.info.images,
      address: that.data.info.address,
      point: that.data.info.point,
    };
    if (that.data.id) {
      app.https.PUT({
        url: '/api/posts/' + that.data.id,
        params: params,
        success: function (res) {
          app.notice.showToast('更新成功');
          wx.navigateTo({
            url: '/pages/posts/show/index?id=' + that.data.id,
          })
        }
      });
    } else {
      params.category_id = that.data.categories[that.data.info.category_index].id;
      app.https.POST({
        url: '/api/posts',
        params: params,
        success: function (res) {
          app.notice.showToast('发布成功');
          wx.navigateTo({
            url: '/pages/posts/show/index?id=' + res.data.id,
          })
        }
      });
    }
  },
})