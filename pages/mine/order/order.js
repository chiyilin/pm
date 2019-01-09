const app = getApp();
var common = require('../../../utils/common.js');
var request = (that) => {
  wx.showNavigationBarLoading();
  wx.showLoading();
  common.Post('prodlist/details', {
    id: that.data.id
  }, (res) => {
    that.setData({
      data: res.data,
      config: res.config,
    });
    wx.hideNavigationBarLoading();
    wx.hideLoading();
  });
}
Page({
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    filepath: app.globalData.filepath
  },
  onLoad(options) {
    var that = this;
    that.setData({
      id: options.id ? options.id : 64
    })
  },
  onShow() {
    var that = this;
    request(that);
  },
  bindSure: function(event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    wx.showModal({
      title: '确认',
      content: '是否要确认收货？',
      success: function(e) {
        if (e.confirm) {
          var userinfo = common.getUserInfo();
          common.Post('cart/applySendOut', {
            user_id: userinfo.user_id,
            between_id: id,
            current: 2
          }, function(res) {
            wx.showToast({
              title: '操作成功！',
              success: function(res) {
                setTimeout(function() {
                  that.onShow()
                }, 1500)
              }
            })
          });
        }
      }
    })
  },
  /**
   * 复制订单编号
   */
  copy(e) {
    console.log(e.currentTarget.dataset.text)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: () => {
        wx.showToast({
          title: '复制成功',
          duration: 1500,
        });
      }
    });
  },
  product: function(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/index/CollectionDetails/CollectionDetails?id=' + e.currentTarget.dataset.id
    });
  },
  expressInfo: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mine/order/express?id=' + id,
    })
  },
  /**
   * 删除订单
   */
  close(e) {
    var that = this;
    wx.confirm({
      title: '温馨提示',
      content: '您确认要取消订单？',
      success: function(res) {
        console.log(res)
        if (res.confirm == true) {
          common.Post('ProdList/close', {
            list_id: e.currentTarget.dataset.id
          }, (e) => {
            wx.showToast({
              type: 'success',
              content: '操作成功',
              duration: 1500,
              success: () => {
                wx.redirectTo({
                  url: '/pages/list/list',
                  success: (res) => {

                  },
                });
              }
            });
          });
        }
      }
    })
  },

  /**
   * 再次拉起支付
   */
  pay(e) {
    var that = this;
    common.Post('ProdList/checkList', {
      list_id: e.currentTarget.dataset.id
    }, (result) => {
      wx.tradePay({
        tradeNO: result,
        success: (res) => {
          if (res.resultCode == 9000) {
            request(that)
          }
        },
      });
    });
  },
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
});