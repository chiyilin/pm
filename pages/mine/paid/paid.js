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
      data: res.data,
      status: res.status,
    });
  });
}
Page({
  data: {
    navbar: ['待支付', '待发货', '待收货'],
    //默认选中的选项卡
    currentTab: 0,
    filepath: app.globalData.filepath,
    //支付总价
    total_price: 0,
    currentIndex: [],
    checkedAll: false,
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
        currentTab: options.current,
      })
    }
  },
  orderDetails: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mine/order/order?id=' + id,
    })
  },
  onShow: function() {
    var that = this;
    request(that)
  },
  /**
   * 选项卡切换
   */
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      currentIndex: [],
      checkedAll: false,
      total_price: 0
    });
    request(this);
  },
  /**
   * 跳转至支付详情
   */
  nowpay: function(e) {
    var that = this;
    if (e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '/pages/cart/cart?id=' + e.currentTarget.dataset.id,
      });
    } else {
      var currentIndex = that.data.currentIndex[0];
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
  /**
   * 待支付全选/全不选
   */
  checkAll: function(e) {
    var that = this;
    if (that.data.checkedAll) {
      that.setData({
        checkedAll: false,
        total_price: 0,
        currentIndex: []
      });
    } else {
      that.setData({
        checkedAll: that.data.checkedAll = true,
      });
      var currentIndex = [];
      that.data.data.forEach((res, index) => {
        currentIndex.push(index)
      });
      that.totalCount(currentIndex);
    }
  },
  /**
   * 单件申请发货
   */
  sendOutItem: function(event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    var current = event.currentTarget.dataset.current
    var sign = event.currentTarget.dataset.sign ? event.currentTarget.dataset.sign : null;
    that.sendOutRequest(id, current, sign)
  },
  /**
   * 批量申请发货/确认收货/一键委托
   */
  sendOutAll: function(e) {
    var that = this;
    var current = e.currentTarget.dataset.current;
    var sign = e.currentTarget.dataset.sign ? e.currentTarget.dataset.sign : null;
    var currentIndex = that.data.currentIndex[that.data.currentTab];
    if (!currentIndex || currentIndex.length == 0) {
      common.tips('请选中后操作！');
      return null;
    } else {
      var data = that.data.data;
      var currentId = [];
      data.forEach((item, index) => {
        if (currentIndex.indexOf(index) > -1) {
          currentId.push(item.between_id)
        }
      });
      that.sendOutRequest(currentId, current, sign)
    }
  },
  /**
   * 发货操作公共请求
   */
  sendOutRequest: function(currentId, current, sign) {
    var tips = {};
    tips.title = '确认';
    if (current == 1 && !sign) {
      tips.content = '确认要申请发货吗？';
    } else if (current == 1 && !sign) {
      tips.content = '确认要委托选中商品？';
    } else if (current == 2) {
      tips.content = '确认收货？';
    }
    wx.showModal({
      title: tips.title,
      content: tips.content
    });
    return null;
    var that = this;
    var userinfo = common.getUserInfo();
    var requestAddr = sign == 'weituo' ? 'cart/applyEntrust' : 'cart/applySendOut';
    common.Post(requestAddr, {
      between_id: currentId,
      current: current,
      user_id: userinfo.user_id,
    }, function(res) {
      wx.showToast({
        title: '申请已提交！',
        success: function() {
          setTimeout(function() {
            that.onShow()
          }, 1500);
        }
      });
    });
  },
  /**
   * 点击单个选中按钮
   */
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
    var curr = [];
    curr[that.data.currentTab] = currentIndex;
    console.log(curr)
    that.setData({
      total_price: total_price,
      currentIndex: curr
    });
  },
  /**
   * 跳转至产品详情
   */
  prodDetails: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '/pages/index/CollectionDetails/CollectionDetails?id=' + id,
    });
  },
})