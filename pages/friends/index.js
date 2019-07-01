const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,

    keys: [],
    list: [],
    search: '',
    hidden: true,
  },

  getList: function () {
    let that = this;
    app.https.GET({
      url: '/api/friends',
      params: {
        q: that.data.search,
      },
      success: function (res) {
        that.setData({
          list: res.data.list,
          keys: res.data.keys,
        });
      }
    });
  },

  bindInputChange: function (e) {
    this.setData({
      [e.target.dataset.input]: e.detail.value
    })
  },

  
  bindShow: function(e) {
    let friend_user_id = e.currentTarget.dataset.friend_user_id;

    wx.navigateTo({
      url: '/pages/friends/show/index?user_id=' + friend_user_id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function (res) {
      that.setData({
        boxTop: res.top
      })
    }).exec();
    wx.createSelectorQuery().select('.indexes').boundingClientRect(function (res) {
      that.setData({
        barTop: res.top
      })
    }).exec()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  //获取文字信息
  getCur(e) {
    this.setData({
      hidden: false,
      listCur: this.data.keys[e.target.id],
    })
  },

  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.keys[num]
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let keys = this.data.keys;
    let scrollY = Math.ceil(keys.length * e.detail.y / barHeight);
    for (let i = 0; i < keys.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: keys[i],
          movableY: i * 20
        })
        return false
      }
    }
  }
})