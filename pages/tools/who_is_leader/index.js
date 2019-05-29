// pages/tools/who_is_leader/index.js
wx.cloud.init({
  env: 'random-78lbw'
})
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: '',//定时器名字
    random_number: 75, // 随机显示剩余次数
    origin_random_number: 75, //随机显示100次
    random_ms: 50, //随机跳选间隔，毫秒
    leaders: [
      {
        title: '班长',
        result: 0,
      },
      {
        title: '学习委员',
        result: 0,
      },
    ],
    max_number: 50,
    exclude_number: '',
    new_leader: '',
    hiddenModel: 1,
    all_disabled: false,

    // 保护号码和替死鬼号码
    protected_number: 0,
    target_number: 0
  },

  bindInputChange: function (e) {
    this.setData({
      [e.target.dataset.input]: e.detail.value
    })
  },

  showModel: function () {
    this.setData({
      hiddenModel: 0
    });
  },

  bindModelCancel: function () {
    this.setData({
      hiddenModel: 1
    });
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
      hiddenModel: 1
    }) 
  },

  bindAddleader: function () {
    if (this.data.all_disabled) {
      return;
    }
    this.showModel();
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
      content: '确认删除班委【' + leaders[key].title +'】',
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

  bindRandomSelect: function() {
    if (this.data.all_disabled) {
      return;
    }

    let leaders = this.data.leaders;
    let max = this.data.max_number;
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
          let res = parseInt(Math.random() * max, 10) + 1;

          // 最后一次随机的时候，作弊处理，手动替换保护号码
          if (count == 0) {
            // 保护号码和替死鬼号码
            let protected_number = that.data.protected_number;
            let target_number = that.data.target_number;

            if (protected_number && res == protected_number) {
              if (max < target_number) {
                res = max;
              } else {
                res = target_number;
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

  onShow: function () {
    let that = this;
    db.collection('configs').doc('8eaaddb7-8f4d-4a2f-aa07-ca451ce090df').get({
      success: function (res) {
        console.log('protected', res.data);
        that.setData({
          protected_number: res.data.protected_number,
          target_number: res.data.target_number
        })
      }
    })
  },

  onShareAppMessage: function () {
    // return custom share data when user share.
  }
})