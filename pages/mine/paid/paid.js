var app = getApp();
var common = require('../../../utils/common.js');
var number = require('../../../utils/number.js');
Page({
  data: {
    navbar: ['待支付', '待发货', '待收货'],
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
  checkboxChange: function(e) {
    console.log(e.detail.value)
  },
  onShow: function() {
    var that = this;
    var userinfo = common.getUserInfo();
    common.Post('cart/cart', {
      user_id: userinfo.user_id
    }, function(res) {
      console.log(res)
      that.setData({
        data: res
      })
    });
  },
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
})