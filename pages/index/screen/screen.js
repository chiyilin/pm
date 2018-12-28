// pages/transaction/transaction.js
var app = getApp();
var common = require('../../../utils/common.js');
var search = function(that) {
  var param = {
    category_id: that.data.category_id,
    currentTab: that.data.currentTab + 1
  };
  common.Post('category/cateProdInfo', param, function(res) {
    that.setData({
      data: res
    });
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['竞价', '预览', '一口价', '成交'],
    currentTab: 0,
    filepath: app.globalData.filepath,
    currentSort: 1,
    currentNotFace: [],
    currentNotCate: [],
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
    that.setData({
      category_id: options.id
    })
  },
  /**
   * 展开筛选
   */
  showRule: function() {
    var that = this;
    if (!that.data.serachBasicData) {
      common.Post('category/serachData', {
        category_id: that.data.category_id
      }, function(res) {
        that.setData({
          serachBasicData: res
        })
      })
    }
    this.setData({
      isRuleTrue: true
    })
  },
  //关闭规则提示
  hideRule: function() {
    this.setData({
      isRuleTrue: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    search(that);
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
  navbarTap: function(e) {
    var that = this;
    // if (e.currentTarget.dataset.idx === that.data.currentTab) {
    that.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    search(that);
    // }
  },
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
  /**
   * 排序切换
   */
  switchOrder: function(e) {
    var that = this;
    that.setData({
      currentSort: e.currentTarget.dataset.id
    });
  },
  /**
   * 品相选择
   */
  switchFace: function(e) {
    var that = this;
    that.setData({
      currentFace: e.currentTarget.dataset.id
    });
  },
  CollectionDetails: function(e) {
    wx.navigateTo({
      url: "/pages/index/CollectionDetails/CollectionDetails?id=" + e.currentTarget.dataset.id,
    })
  },
})