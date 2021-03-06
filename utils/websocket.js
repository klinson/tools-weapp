const notice = require('./notice.js');

// websocket 地址
var server = '';
server = 'ws://tools.klinson.com:10901';
// server = 'ws://192.168.66.3:10901';
// server = 'ws://192.168.66.2:10901';

// websocket 服务
var ws = null;
var status = false;

//  连接成功
wx.onSocketOpen((res) => {
  console.log('WebSocket 成功连接')
  status = true;
  // that.resMes()
  //  开始心跳
  // that.startHeartBeat()
});
//连接失败
wx.onSocketError((err) => {
  console.log('websocket连接失败', err);
  status = false;

  // 重新启动
  // connect();
});
wx.onSocketClose((res) => {
  console.log('websocket连接关闭', res);
  status = false;

  // connect();
});

wx.onSocketMessage((res) => {
  revMessage(res)
});

// 收到消息
function revMessage (res) {
  let data = JSON.parse(res.data);
  console.log('收到消息', data);
  // 消息通知，并5s后自动隐藏

  let message = '';
  switch (data.code) {
    case 4200:
      if (data.data) {
        switch (data.data.api) {
          case 'chat_message':
            // 当前页面是聊天室吗,是的话就不进行额外的通知
            let pages = getCurrentPages();
            let page = pages[pages.length - 1];
            if (page.route == 'pages/chat_rooms/show/index' && page.data.room_id == data.data.data.chat_room_id) {
              wx.vibrateLong({});
              page.addMessageToList(data.data.data)
            } else {
              if (data.data.data.fromUser) {
                message = data.data.data.fromUser.nickname + ': ';
              }
              message = message + data.data.data.content;
            }

            break;
          default:
            break;
        }
      } else if (data.message != 'success') {
        message = data.message;
      }
      message && notice.showTop(message, true);
      break;
    case 4400:
      // 正常失败
      notice.showTop(data.message);
      break;
    case 4401:
      message = '登录失效，请重新登录';
      notice.showTop(message);
      break;
    default:
      break;
  }
}


function connect(object = {}) {
  if (status) {
    console.log('不要重复连接啦！！！')
    return ;
  }
  let sessionId = wx.getStorageSync('login_token');
  ws = wx.connectSocket({
    url: server + '?_token=' + sessionId,
    success: (res) => {
      console.log(res);
      status = true;
      object.success && object.success();
    },
    fail: (err) => {
      console.log(res);
      object.fail && object.fail();
    },
    complete: (res) => {
      console.log(res);
      object.complete && object.complete();
    }
  });
}

function send(content) {
  if (status) {
    wx.sendSocketMessage({
      data: JSON.stringify(content)
    })
  }
}

function getStatus() {
  return status
}

module.exports = {
  connect: connect,
  send: send,
  status: getStatus,
}
