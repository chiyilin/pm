var app = getApp();
var common = require('../../../utils/common.js');
var number = require('../../../utils/number.js');
var request = function(that) {
  var userinfo = common.getUserInfo();
  var current = that.data.currentTab;
  common.Post('cart/cart', {
    user_id: userinfo.user_id,
    current: current
  }, function(res) {
    that.setData({
      data: res
    });
  });
}
Page({
  data: {
    navbar: ['待支付', '待发货', '待收货'],
    currentTab: 0,
    filepath: app.globalData.filepath,
    total_price: 0,
    checkedAll: false,
    isCheckAll: false,
  },
  onLoad: function(options) {
    var that = common.that = this;
    // common.style();
    common.globalData = app.globalData;
    if (!common.checkAuthLogin(true)) {
      common.login();
    }
    if (options.current) {
      that.setData({
        currentTab: options.current
      })
    }
  },
  nowpay: function(e) {
    var that = this;
    if (e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '/pages/cart/cart?id=' + e.currentTarget.dataset.id,
      });
    } else {
      var currentIndex = that.data.currentIndex;
      var data = that.data.data;
      var currentId = [];
      data.forEach((res, index) => {
        if (currentIndex.indexOf(index) > -1) {
          currentId.push(res.get_id)
        }
      });
      var currentIdStr = currentId.join(',');
      wx.navigateTo({
        url: '/pages/cart/cart?id=' + currentIdStr,
      });
    }
  },
  prodDetails: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '/pages/index/CollectionDetails/CollectionDetails?id=' + id,
    });
  },
  /**
   * 待支付全选/全不选
   */
  checkAll: function(e) {
    var that = this;
    console.log(that.data.currentTab)

    if (that.data.isCheckAll) {
      that.setData({
        checkedAll: false,
        isCheckAll: false,
        total_price: 0,
        currentIndex: []
      });
    } else {
      that.setData({
        checkedAll: that.data.checkedAll == false ? true : false,
      });
      var currentIndex = [];
      that.data.data.forEach((res, index) => {
        currentIndex.push(index)
      });
      that.totalCount(currentIndex);
      that.setData({
        isCheckAll: true
      })
    }
  },
  checkboxChange: function(e) {
    var that = this;
    var currentIndex = e.detail.value;
    var newCurrentIndex = [];
    currentIndex.forEach(e => {
      newCurrentIndex.push(Number(e))
    });
    that.totalCount(newCurrentIndex)
  },
  /**
   * 计算价格
   */
  totalCount: function(currentIndex) {
    var that = this;
    var data = that.data.data;
    var total_price = 0;
    currentIndex.forEach((res, index) => {
      total_price = number.accAdd(total_price, data[res].total_price)
    });
    that.setData({
      total_price: total_price,
      currentIndex: currentIndex
    });
  },
  /**
   * 
   */
  onShow: function() {
    var that = this;
    request(that)
  },
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    request(this)
  },
})