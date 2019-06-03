// pages/tools/character_recognition/general/index.js
const app = getApp()
const title_map = {
  'score': '颜值评分',
  'pk': '颜值PK',
  'cp': '最佳CP',
  'who_treat': '谁请客',
};
const upload_title_map = {
  'score': '上传美照评评分',
  'pk': '上传合照进行颜值大PK',
  'cp': '上传合照，谁是最佳CP',
  'who_treat': '上传合照，谁最美，谁请客！',
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    topNavBar: app.globalData.topNavBar,
    type: '',
    title: '',
    upload_title: '',
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
          url: '/api/portrait/' + that.data.type,
          params: {
            img: res.data
          },
          success: function (res) {
            that.setData({
              img: res.data.image_url,
              result: res.data,
            })
          }
        });
      }
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

  onLoad: function(options) {
    this.setData({
      type: options.type,
      title: title_map[options.type],
      upload_title: upload_title_map[options.type],
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})