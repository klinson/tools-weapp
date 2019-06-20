const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,
    bottomNavBars: app.globalData.bottomNavBars,
    bottomNavBarKey: 'favours',

    animation: '',
    reverse: true,
    disabled: false,

    list: [],
    user: null,

    cardCur: 0,
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

    this.getPoint(this.getList);
  },

  getPoint: function(callback) {
    let that = this;
    let user_location = wx.getStorageSync('user_location');

    if (!user_location) {
      wx.getLocation({
        success: function(res) {
          console.log(res)
          let location = {
            longitude: res.longitude,
            latitude: res.latitude,
          };
          callback && callback(location)
        },
        fail: function(res) {
          app.notice.showToast('定位失败', 'fail')
        }
      })
    } else {
      let location = {
        longitude: user_location.longitude,
        latitude: user_location.latitude,
      };
      callback && callback(location)
    }
  },

  getList: function(location) {
    let that = this;
    app.https.GET({
      url: '/api/nearbyUsers',
      params: location,
      success: function(res) {
        let list = that.data.list.concat(res.data.data)
        if (!that.data.user) {
          if (list.length <= 0) {
            that.setData({
              list: list,
              user: null,
            });
            app.notice.showToast('没有更多用户了', 'fail')
          } else {
            let user = list.shift();
            that.setData({
              list: list,
              user: user,
            });
          }
        } else {
          that.setData({
            list: list,
          });
        }
      }
    });
  },

  bindFavour: function(e) {
    let type = e.currentTarget.dataset.type;
    let anmiaton;
    let is_favour = true;
    if (type == 1) {
      // 喜欢
      anmiaton = 'scale-down';
      is_favour = true;
    } else {
      // 不喜欢
      anmiaton = 'slide-left';
      is_favour = false;
    }
    var that = this;
    that.setData({
      animation: anmiaton,
      reverse: true,
      disabled: true,
      cardCur: 0,
    })
    // 请求接口标记喜欢或不喜欢
    app.api.user.favour({
      favour: is_favour,
      to_user_id: this.data.user.id,
      success: function(res) {
        // 获取下个人
        let list = that.data.list;
        if (list.length <= 0) {
          that.setData({
            user: null,
            animation: 'scale-up',
            reverse: false,
            disabled: false,
          });

          app.notice.showToast('没有更多用户了', 'fail')
          return;
        }

        let user = list.shift();
        that.setData({
          list: list,
          user: user,
        });

        // 及时补充待选列表
        if (list.length <= 2) {
          that.getPoint(that.getList);
        }

        // 定时动画显示出来
        setTimeout(function() {
          that.setData({
            animation: 'scale-up',
            reverse: false,
            disabled: false,
          })
        }, 1000)
      },
      error: function (res) {
        setTimeout(function () {
          that.setData({
            animation: 'scale-up',
            reverse: false,
            disabled: false,
          })
        }, 1000)
      },
      fail: function(res) {
        setTimeout(function () {
          that.setData({
            animation: 'scale-up',
            reverse: false,
            disabled: false,
          })
        }, 1000)
      }
    })
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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

  },

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.user.images,
      current: this.data.user.images[this.data.cardCur]
    });
  },
})