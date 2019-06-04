//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,
    bottomNavBars: app.globalData.bottomNavBars,
    bottomNavBarKey: 'tools',

    list: [
      {
        id: 'portrait',
        name: '颜值',
        pages: [
          {
            icon: 'scan',
            color: 'red',
            path: '/pages/tools/portrait/index?type=score',
            title: '颜值评分'
          },
          {
            icon: 'crown',
            color: 'red',
            path: '/pages/tools/portrait/index?type=pk',
            title: '颜值PK'
          },
          {
            icon: 'friendfill',
            color: 'red',
            path: '/pages/tools/portrait/index?type=cp',
            title: '最佳CP'
          },
          {
            icon: 'sponsor',
            color: 'red',
            path: '/pages/tools/portrait/index?type=who_treat',
            title: '谁请客'
          },
        ],
      },
      {
        id: 'character_recognition',
        name: '文字识别',
        pages: [
          {
            icon: 'scan',
            color: 'green',
            path: '/pages/tools/character_recognition/general/index',
            title: '通用文字识别'
          }
        ],
      },
      {
        id: 'random',
        name: '抽数点号',
        pages: [
          {
            icon: 'shopfill',
            color: 'red',
            path: '/pages/tools/random/who_is_leader/index',
            title: '群体抽奖'
          },
          {
            icon: 'send',
            color: 'red',
            path: '/pages/tools/random/individual_draw/index',
            title: '个体抽奖'
          }
        ],
      }
    ]
  },

  NavChange(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })
  },

  bindToolTap: function (e) {
    let path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: path,
    })
  },

  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },

  onLoad(options) {
    this.setData({
      bottomNavBars: app.globalData.bottomNavBars,
    });
  },

  onShareAppMessage: function () {
    // return custom share data when user share.
  }
})
