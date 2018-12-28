// pages/transaction/transaction.js
var app = getApp();
var common = require('../../../utils/common.js');
var WxParse = require('../../../wxParse/wxParse.js');
var search = (that) => {
  common.Post('collection/detailsProd', {
    id: that.data.id,
    currentTab: that.data.currentTab,
  }, function(res) {
    that.setData({
      data: res
    });
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filepath: app.globalData.filepath,
    navbar: ['全部', '精品', '介绍'],
    currentTab: 0,
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
    that.data.id = options.id;
    /**
     * 初始化emoji设置
     */
    WxParse.emojisInit('[]', "/wxParse/emojis/", {
      "00": "00.gif",
      "01": "01.gif",
      "02": "02.gif",
      "03": "03.gif",
      "04": "04.gif",
      "05": "05.gif",
      "06": "06.gif",
      "07": "07.gif",
      "08": "08.gif",
      "09": "09.gif",
      "09": "09.gif",
      "10": "10.gif",
      "11": "11.gif",
      "12": "12.gif",
      "13": "13.gif",
      "14": "14.gif",
      "15": "15.gif",
      "16": "16.gif",
      "17": "17.gif",
      "18": "18.gif",
      "19": "19.gif",
    });
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
    common.Post('collection/details', {
      id: that.data.id
    }, function(res) {
      WxParse.wxParse('details', 'html', res.collInfo.collection_introduce, that, 5);
      that.setData({
        collInfo: res.collInfo
      });
      wx.setNavigationBarTitle({
        title: res.collInfo.collection_name
      })
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
  CollectionDetails: function(e) {
    wx.navigateTo({
      url: "/pages/index/CollectionDetails/CollectionDetails?id=" + e.currentTarget.dataset.id,
    })
  },

})