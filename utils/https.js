const notice = require('./notice.js');
var server = '';
server = 'https://tools.klinson.com';
// server = 'http://192.168.66.3';

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
  let sessionId = wx.getStorageSync('login_token');
  console.log('login_token', sessionId)
  wx.request({
    url: API_URL,
    data: JSON.stringify(params),
    method: method,
    header: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + sessionId,
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
          wx.removeStorage({
            key: 'user_info',
          })
          wx.removeStorage({
            key: 'login_token',
          })
          getApp().globalData.userInfo = null;
          notice.showModal('', '用户未登录，或者登录时间过长，请重新进行登录！点击确认进行登录', () => {
            wx.login({
              success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                getApp().loginDo({
                  code: res.code,
                  is_try: true,
                  try_error: function() {
                    wx.navigateTo({
                      url: '/pages/user/index',
                    })
                  }
                })
              }
            })
          });
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

function getConfig(key, callback) {
  GET({
    url: '/api/configs/' + key,
    params: {},
    success: function (res) {
      callback && callback(res.data.value);
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

// 上传文件
function uploadImages(object) {
  let sizeType, sourceType;
  // 可以指定是原图还是压缩图，默认二者都有
  switch (object.sizeType) {
    case 1:
      sizeType = ['original']
      break;
    case 2:
      sizeType = ['compressed']
      break;
    default:
      sizeType = ['original', 'compressed']
      break;
  }
  // 可以指定来源是相册还是相机，默认二者都有
  switch (object.sourceType) {
    case 1:
      sourceType = ['album']
      break;
    case 2:
      sourceType = ['camera']
      break;
    default:
      sourceType = ['album', 'camera']
      break;
  }

  wx.chooseImage({
    count: object.count || 9, // 默认9
    sizeType: sizeType, 
    sourceType: sourceType, 
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePaths = res.tempFilePaths;
      _batchUpload({
        i: 0,
        len: tempFilePaths.length,
        tempFilePaths: tempFilePaths,
        urls: [],
        files: [],
        success_func: object.success,
        error_func: object.error,
        complete_func: object.complete,
      })
    }
  })
}
// 实现批量上传文件
function _batchUpload(object) {
  wx.uploadFile({
    url: server + '/api/files/uploadImage',
    filePath: object.tempFilePaths[object.i],
    name: 'file',
    formData: {},
    success: function (res) {
      let data = JSON.parse(res.data);
      object.files.push(data);
      object.urls.push(data.url);
    },
    complete: function (res) {
      object.i = object.i + 1;
      if (object.i < object.len) {
        _batchUpload(object)
      } else {
        // 上传完毕，判断状态
        if (object.files.length > 0) {
          object.success_func && object.success_func({
            files: object.files,
            urls: object.urls
          })
        } else {
          notice.showToast('上传失败', 'fail');
          object.error_func && object.error_func('')
        }

        object.complete_func && object.complete_func({
          files: object.files,
          urls: object.urls
        })
      }
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST,
  PUT: PUT,
  DELETE: DELETE,
  CHECK: CHECK,
  uploadImages: uploadImages,
  getConfig: getConfig,
  server: server
}