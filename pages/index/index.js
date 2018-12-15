//index.js
var app = getApp();
var common = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filepath: app.globalData.filepath,
    swiper: {
      autoplay: true,
      interval: 3000,
      duration: 1000,
    },
    msgList: [{
        url: "url",
        title: "多地首套房贷利率上浮 热点城市渐迎零折扣时代"
      },
      {
        url: "url",
        title: "悦如公寓三周年生日趴邀你免费吃喝欢唱"
      },
      {
        url: "url",
        title: "你想和一群有志青年一起过生日嘛？"
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    var that = common.that = this;
    // common.style();
    common.globalData = app.globalData;
    if (!common.checkAuthLogin(true)) {
      common.login();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    common.Post('index/index', {}, function(res) {
      that.setData({
        banner: res.banner,
        collection: res.collection,
      })
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  more: function() {
    wx.navigateTo({
      url: "message/message",
    })
  },
  hot: function() {
    wx.navigateTo({
      url: "HotSale/HotSale",
    })
  },
  cate: function() {
    wx.navigateTo({
      url: "category/category",
    })
  },
  CllectionDetails: function() {
    wx.navigateTo({
      url: "CllectionDetails/CllectionDetails",
    })
  },

})