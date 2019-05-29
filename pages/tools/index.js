//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    list: [
      {
        id: 'random',
        name: '抽数点号',
        open: false,
        pages: [
          {
            root_path: 'who_is_leader',
            title: '谁是班委'
          }
        ]
      }
    ]
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
