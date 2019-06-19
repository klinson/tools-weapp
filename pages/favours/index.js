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
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }],
  },

  NavChange(e) {
    wx.redirectTo({
      url: e.currentTarget.dataset.path,
    })
  },

  onLoad(options) {
    this.towerSwiper('swiperList');

    this.setData({
      bottomNavBars: app.globalData.bottomNavBars,
      env: app.globalData.env
    });

    this.getPoint(this.getList);
  },

  getPoint: function (callback) {
    let that = this;
    let user_location = wx.getStorageSync('user_location');

    if (!user_location) {
      wx.getLocation({
        success: function (res) {
          console.log(res)
          let location = {
            longitude: res.longitude,
            latitude: res.latitude,
          };
          callback && callback(location)
        },
        fail: function (res) {
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

  getList: function (location) {
    let that = this;
    app.https.GET({
      url: '/api/nearbyUsers',
      params: location,
      success: function (res) {
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

  bindFavour: function (e) {
    let type = e.currentTarget.dataset.type;
    let anmiaton;
    if (type == 1) {
      // 喜欢
      anmiaton = 'scale-down';
    } else {
      // 不喜欢
      anmiaton = 'slide-left';
    }
    var that = this;
    that.setData({
      animation: anmiaton,
      reverse: true,
      disabled: true,
    })
    // 请求接口标记喜欢或不喜欢

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
    setTimeout(function () {
      that.setData({
        animation: 'scale-up',
        reverse: false,
        disabled: false,
      })
    }, 1000)
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  },

  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }
})