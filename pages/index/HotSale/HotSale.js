// pages/transaction/transaction.js
var app = getApp();
var common = require('../../../utils/common.js');
var search = (that) => {
  var data = that.data;
  console.log(data.cate);
  common.Post('collection/getData', {
    current_tab: data.currentTab,
    category_id: data.cate[data.cateTab].category_id
  }, function(res) {
    that.setData({
      data: res.data
    });
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filepath: app.globalData.filepath,
    navbar: ['开售', '展览', '成交'],
    currentTab: 0,
    cateTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    wx.showNavigationBarLoading();
    var that = this;
    common.Post('category/oneCate', {}, function(res) {
      that.setData({
        cate: res
      });
      search(that)
    });
    wx.hideNavigationBarLoading();

  },
  /**
   * 选项卡切换
   */
  navbarTap: function(e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx
    });
    search(that)
  },
  /**
   * 分类切换
   */
  clickTab: function(e) {
    // e.currentTarget.dataset.id
    var that = this;
    that.setData({
      cateTab: e.currentTarget.dataset.current
    })
    search(that)
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

})