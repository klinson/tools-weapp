const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,

    user_info: null,
    sexs: ['男', '女']
  },

  bindInputChange: function (e) {
    this.setData({
      [e.target.dataset.input]: e.detail.value
    })
  },
  
  bindSelectArrayChange: function (e) {
    this.setData({
      [e.target.dataset.input]: Number(e.detail.value) + 1,
    });
  },

  ChooseImage() {
    let that = this;
    app.https.uploadImages({
      count: 1,
      sizeType: 2,
      success: function(res) {
        console.log(res);
        that.setData({
          'user_info.avatar': res.urls[0]
        })
      }
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: [this.data.user_info.avatar],
      current: this.data.user_info.avatar
    });
  },

  bindSubmitDo: function (e) {
    let that = this;
    app.https.PUT({
      url: '/api/user',
      params: {
        nickname: that.data.user_info.nickname,
        name: that.data.user_info.name,
        sex: that.data.user_info.sex,
        mobile: that.data.user_info.mobile,
        avatar: that.data.user_info.avatar,
      },
      success: function (res) {
        app.notice.showToast('更新成功');
        app.globalData.userInfo = res.data
        wx.setStorage({
          key: 'user_info',
          data: res.data,
        })
      }
    });
  },

  onLoad(options) {
    if (app.globalData.userInfo) {
      this.setData({
        user_info: app.globalData.userInfo
      });
    } else {
      wx.navigateBack({
        delta: 1,
        complate: function () {
          app.notice.showToast('请登录')
        }
      });
    }
  },

  getData() {
    let that = this;
    app.https.getConfig('wxapp_about_us', (res) => {
      if (res) {
        that.setData({
          content: res,
          show_template: false
        })
        WxParse.wxParse('article', 'html', res, that, 5);
      } else {
        that.setData({
          show_template: true
        })
      }
    })
  }

})