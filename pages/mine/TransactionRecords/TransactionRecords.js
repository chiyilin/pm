// pages/mine/TransactionRecords/TransactionRecords.js
var app = getApp();
var common = require('../../../utils/common.js');
Page({
  data: {
    isShow: true,
    currentTab: 0,
    filepath: app.globalData.filepath
  },
  onLoad: function(options) {
    var that = common.that = this;
    // common.style();
    common.globalData = app.globalData;
    if (!common.checkAuthLogin(true)) {
      common.login();
    }
  },
  onShow: function() {
    wx.showNavigationBarLoading();
    var that = this;
    var userinfo = common.getUserInfo();
    common.Post('prodlist/onHandProdList', {
      'user_id': userinfo.user_id
    }, function(res) {
      that.setData({
        onHandData: res.onHandData
      })
    });
    wx.hideNavigationBarLoading();
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
   * 选项卡切换
   */
  swichNav: function(e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var showMode = e.target.dataset.current == 0;
      this.setData({
        currentTab: e.target.dataset.current,
        isShow: showMode
      })
    }
  },
  orderDetails: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mine/order/order?id=' + id,
    })
  },
})