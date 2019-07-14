// 顶部通知条通知
function showTop(content, vibrate) {
  let pages = getCurrentPages();
  let page = pages[pages.length - 1];
  if (page) {
    page.setData({ _notice: content })//设置数据
    vibrate && wx.vibrateLong({});
    setTimeout(() => {
      page.setData({ _notice: '' })
    }, 5000)
  }
}

// 模态框显示数据结果
function showModal(title, content, callBack) {
  wx.showModal({
    title,
    content,
    showCancel: false,
    confirmColor: '#ff833b',
    success: function (res) {
      if (res.confirm) {
        callBack && callBack();
      }
    },
    fail: function () { }
  })
}

function showToast(title, status, callBack) {
  let options;
  switch(status) {
    case 'fail':
      options = {
        title: title,
        image: '/assets/icons/fail.png',
        duration: 2000,
        success: function (res) {
          callBack && callBack();
        }
      }
      break;
    default:
      status = 'success';
    case 'loading':
    case 'success':
      options = {
        title: title,
        icon: status,
        duration: 2000,
        success: function (res) {
          callBack && callBack();
        }
      }
      break;
  }
  wx.showToast(options);
}

module.exports = {
  showToast: showToast,
  showModal: showModal,
  showTop: showTop,
}