const app = getApp();
const notice = require('./notice.js');
var server = '';
// server = 'https://tools.klinson.com';
server = 'http://192.168.66.2';

//GET请求
function GET(requestHandler) {
  if (requestHandler.params) {
    let url = requestHandler.url;
    if (requestHandler.url.indexOf('?') > 0) {
      url = url + '&';
    } else {
      url = url + '?';
    }
    for (let p in requestHandler.params) {
      url = url + p + '=' + requestHandler.params[p] + '&';
    }
    requestHandler.url = url.substr(0, url.length - 1);
  }
  request('GET', requestHandler)
}
//POST请求
function POST(requestHandler) {
  request('POST', requestHandler)
}
//put
function PUT(requestHandler) {
  request('PUT', requestHandler)
}
//DELETE
function DELETE(requestHandler) {
  request('DELETE', requestHandler)
}
//request请求
function request(method, requestHandler) {
  let params = requestHandler.params;
  let API_URL = server + requestHandler.url;
  wx.showLoading({
    title: '加载中',
  });
  let sessionId = wx.getStorageSync('sessionId');
  console.log(sessionId)
  wx.request({
    url: API_URL,
    data: JSON.stringify(params),
    method: method,
    header: {
      'content-type': 'application/json',
      Authorization: sessionId,
    },
    success: function (res) {
      console.log(res);
      wx.hideLoading();
      let message = '操作错误';
      let status_code = res.data.status_code || res.statusCode;
      switch (status_code) {
        case 400:
          if (res.data.message) {
            message = res.data.message;
          }
          notice.showModal('', message);
          break;
        case 401:
          wx.removeStorageSync('sessionId');
          wx.removeStorageSync('userInfo');
          notice.showModal('', '用户未登录，或者登录时间过长，请重新进行登录！');
          wx.switchTab({
            url: '/pages/school/index/index'
          })
          break;
        case 403:
          notice.showToast('用户无权限', 'fail');
          break;
        case 404:
          notice.showToast('API不存在', 'fail');
          break;
        case 422:
          for (var p in res.data.errors) {
            message = res.data.errors[p][0]
            break;
          }

          notice.showModal('', message);
          break;
        case 500:
        case 501:
        case 502:
          notice.showToast('服务器异常', 'fail');
          break;
        default:
          requestHandler.success && requestHandler.success(res);
          break;
      }
    },
    fail: function (res) {
      console.log(res, 'resfali------');
      requestHandler.fail && requestHandler.fail(res);
    }
  })
}
// 检测数据是否为空
function CHECK(data, name) {
  if (!data) {
    notice.showModal('', name + '不能为空');
    return false
  } else {
    return data;
  }
}

module.exports = {
  GET: GET,
  POST: POST,
  PUT: PUT,
  DELETE: DELETE,
  CHECK: CHECK,
  server: server
}