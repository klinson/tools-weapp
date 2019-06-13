const https = require('./https.js');

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


module.exports = {
  message: {
    count: getMessageCount,
    clearCount: clearMessageCount
  }
}
