// pages/chat_rooms/show/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,

    InputBottom: 0,

    room_id: 0,
    friend_id: 0,
    room: null,
    me: app.globalData.userInfo,
    title: '聊天室',

    // 最前的信息id
    last_id: 0,
    list: [],
    // 没有更多
    no_more: false,

    message_content: '',
    message_type: 1,
  },
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.room_id) {
      this.setData({
        room_id: options.room_id
      }, this.getInfo);
    } else if (options.friend_id) {
      this.setData({
        friend_id: options.friend_id
      }, this.getInfo);
    } else {
      app.notice.showModal('失败', '聊天房间不存在', this.back)
    }
  },

  getInfo: function () {
    let that = this;
    app.https.GET({
      url: '/api/chatRoom',
      params: {
        include: 'toUser',
        room_id: that.data.room_id,
        friend_id: that.data.friend_id
      },
      success: function (res) {
        that.setData({
          room: res.data,
          title: res.data.title ? res.data.title : res.data.toUser.nickname
        }, () => {
          that.getMessages(that.toBottom)
        });
      },
      fail: function (res) {
        this.back()
      }
    });
  },

  getMessages: function (callback) {
    let that = this;
    app.https.GET({
      url: '/api/chatRooms/'+that.data.room.id+'/messages',
      params: {
        last_id: that.data.last_id,
        include: 'fromUser'
      },
      success: function (res) {
        //获取下一页
        if (res.data.data.length > 0) {
          that.setData({
            list: res.data.data.concat(that.data.list),
            last_id: res.data.data[0] ? res.data.data[0].id : 0,
          });
          callback && callback()
        } else {
          app.notice.showToast('失败', '没有更多消息')
          that.setData({
            no_more: true,
          });
        }
      }
    });
  },

  bindInputChange: function (e) {
    this.setData({
      [e.target.dataset.input]: e.detail.value
    })
  },

  bindSubmit: function(e) {
    let that = this;
    app.https.POST({
      url: '/api/chatRooms/' + that.data.room.id + '/messages',
      params: {
        content: that.data.message_content,
        type: that.data.message_type,
        include: 'fromUser'
      },
      success: function (res) {
        let list = that.data.list;
        list.push(res.data)
        that.setData({
          list: list,
          message_content: '',
        });
      }
    });
  },

  back: function() {
    wx.navigateBack();
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
    if (app.globalData.userInfo) {
      this.setData({
        me: app.globalData.userInfo,
      });
    } else {
      this.setData({
        me: null,
      });
      app.notice.showModal('失败', '用户未登录', this.back)
    }
  },

  // 滚动到底部
  toBottom: function() {
    let query = wx.createSelectorQuery();
    query.select('#bottom-view').boundingClientRect();
    // 执行查询
    query.exec(ele => {
      let e = ele[0];
      wx.pageScrollTo({
        scrollTop: e.top,
      });
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 失效
    console.log('房间下拉');
    // this.getMessages()
  },

  bindGetHistory: function () {
    this.getMessages();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.getMessages()
  },

})