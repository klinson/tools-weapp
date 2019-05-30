// pages/tools/who_is_leader/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,

    timer: '',//定时器名字
    random_number: 75, // 随机显示剩余次数
    origin_random_number: 75, //随机显示100次
    random_ms: 50, //随机跳选间隔，毫秒
    leaders: [
      {
        title: '一等奖',
        result: 0,
      },
      {
        title: '二等奖',
        result: 0,
      },
    ],
    new_leader: '',
    hiddenModel: 1,
    all_disabled: false,
    people: [],
    people_text: '',

  },

  showModal(e) {
    if (this.data.all_disabled) {
      return;
    }
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  bindPeopleChange: function (e) {
    let people = e.detail.value.split(/[,，|/;；、 ]/)
    this.setData({
      people_text: e.detail.value,
      people: people
    })
  },

  bindInputChange: function (e) {
    this.setData({
      [e.target.dataset.input]: e.detail.value
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  bindModelConfirm: function () {
    let leaders = this.data.leaders;
    leaders.push({
      title: this.data.new_leader,
      result: 0,
    })
    this.setData({
      leaders: leaders,
      new_leader: '',
      modalName: null
    })
  },

  showModal: function (e) {
    if (this.data.all_disabled) {
      return;
    }
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  bindAddleader: function (e) {
    if (this.data.all_disabled) {
      return;
    }
    this.showModal(e);
  },

  bindDeleteleader: function (e) {
    if (this.data.all_disabled) {
      return;
    }
    let key = e.currentTarget.dataset.key;
    let leaders = this.data.leaders;
    let that = this;

    wx.showModal({
      title: '提示',
      content: '确认删除奖项【' + leaders[key].title + '】',
      success: function (res) {
        if (res.confirm) {
          leaders.splice(key, 1);
          that.setData({
            leaders: leaders,
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  bindRandomSelect: function () {
    if (this.data.all_disabled) {
      return;
    }
    if (this.data.people.length == 0) {
      return;
    }

    let leaders = this.data.leaders;
    let max = this.data.people.length;
    let that = this;

    that.setData({
      all_disabled: true
    });
    wx.showToast({
      title: '系统抽选中',
      icon: 'loading',
      duration: that.data.random_ms * that.data.origin_random_number
    });

    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        let count = that.data.random_number;
        count--;

        for (var i = 0, len = leaders.length; i < len; i++) {
          let res = parseInt(Math.random() * max, 10)+1;

          // 最后一次随机的时候，作弊处理，手动替换保护
          if (count == 0) {
            // 保护号码和替死鬼号码
            let protected1 = '黄宝儿';
            let protected2 = '宝儿';

            if (that.data.people[res - 1] == protected1 || that.data.people[res - 1] == protected2) {
              if (res-1 > 1) {
                res -= 1;
              } else if (res + 1 < max){
                res += 1;
              } else {
                // 没有得保护了
              }
            }
          }

          leaders[i].result = res
        }
        that.setData({
          leaders: leaders,
        })

        if (count == 0) {
          clearInterval(that.data.timer);
          that.setData({
            random_number: that.data.origin_random_number,
            leaders: leaders,
            all_disabled: false
          })
        } else {
          that.setData({
            random_number: count,
            leaders: leaders
          })
        }
      }, that.data.random_ms)
    });
  },

  onShareAppMessage: function () {
    // return custom share data when user share.
  }
})