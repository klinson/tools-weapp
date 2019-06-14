const https = require('./https.js');

// 获取未读信息数
function getMessageCount(object) {
  https.GET({
    url: '/api/messages/count',
    success: function(res) {
      object.success && object.success(res)
    },
    fail: function(res) {
      object.fail && object.fail(res)
    }
  });
}

// 清除未读信息记录
function clearMessageCount(object) {
  https.DELETE({
    url: '/api/messages/clearCount',
    params: {
      type: object.type
    },
    success: function (res) {
      object.success && object.success(res)
    },
    fail: function (res) {
      object.fail && object.fail(res)
    }
  });
}

// 记录用户位置
function recordLocation(object) {
  wx.getLocation({
    type: 'gcj02',
    success: function(res) {
      https.POST({
        hidden_loading: true,
        url: '/api/user/updateLocation',
        params: {
          longitude: res.longitude,
          latitude: res.latitude,
        },
        success: function (res) {
          console.log('记录定位成功', res.data);
          wx.setStorage({
            key: 'user_location',
            data: res.data,
          })
          object && object.success && object.success(res)
        },
        fail: function (res) {
          console.log('记录定位失败', res);
          object && object.fail && object.fail(res)
        }
      });
    },
  })
}

module.exports = {
  message: {
    count: getMessageCount,
    clearCount: clearMessageCount,
  },
  user: {
    recordLocation: recordLocation,
  },
}
