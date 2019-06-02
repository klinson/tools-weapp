//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,
    list: [
      {
        id: 'portrait',
        name: '颜值',
        pages: [
          {
            icon: 'scan',
            color: 'red',
            root_path: 'score',
            title: '颜值评分'
          }
        ],
      },
      {
        id: 'character_recognition',
        name: '文字识别',
        pages: [
          {
            icon: 'scan',
            color: 'green',
            root_path: 'general',
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
            root_path: 'who_is_leader',
            title: '群体抽奖'
          },
          {
            icon: 'send',
            color: 'red',
            root_path: 'individual_draw',
            title: '个体抽奖'
          }
        ],
      }
    ]
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

  onShareAppMessage: function () {
    // return custom share data when user share.
  }
})
