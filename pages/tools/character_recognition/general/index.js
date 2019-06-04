// pages/tools/character_recognition/general/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,
    img: '',
    result: '',
    copy_disabled: true,
  },

  recognize() {
    let that = this;
    wx.getFileSystemManager().readFile({
      filePath: this.data.img,
      encoding: 'base64',
      success: (res) => {
        app.https.POST({
          url: '/api/characterRecognition/general',
          params: {
            img: res.data
          },
          success: function (res) {
            if (res.data.data.length == 0) {
              that.setData({
                recognize_disabled: true,
              })
              app.notice.showToast('识别不到文字', 'fail');
            } else {
              that.setData({
                result: res.data.data,
                copy_disabled: false,
              })
              app.notice.showToast('识别成功', 'success');
            }
          }
        });
      }
    })
  },

  copy() {
    let content = '';
    for (let i = 0, len = this.data.result.length; i < len; i++) {
      content += this.data.result[i]['words'] + "\n";
    }
    wx.setClipboardData({
      data: content
    })
  },

  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择,使用相机	

      success: (res) => {
        this.setData({
          img: res.tempFilePaths[0],
          result: [],
          copy_disabled: true,
        }, () => {
          this.recognize()
        })
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: [this.data.img],
      current: this.data.img
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})