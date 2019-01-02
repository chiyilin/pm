// pages/transaction/transaction.js
var app = getApp();
var common = require('../../../utils/common.js');
var search = function(that) {
  wx.showNavigationBarLoading();
  wx.showLoading();
  var param = {
    category_id: that.data.category_id,
    currentTab: that.data.currentTab + 1
  };
  if (that.data.moreSearch) {
    var param = Object.assign(param, that.data.moreSearch);
  }
  common.Post('category/countProd', param, function(res) {
    that.setData({
      tabCount: res
    })
  })
  common.Post('category/cateProdInfo', param, function(res) {
    that.setData({
      data: res
    });
    wx.hideNavigationBarLoading();
    wx.hideLoading();
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
    currentFace: [],
    currentCate: [],
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
      category_id: options.id ? options.id : 34
    })
    console.log(that.data.category_id)
  },
  search: function(e) {
    var that = this;
    that.setData({
      moreSearch: {
        currentFace: that.data.currentFace,
        currentCate: that.data.currentCate,
        currentSort: that.data.currentSort,
        searchKey: e.detail.value.search
      }
    });
    search(that)
    that.hideRule()
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
        var currentCate = [];
        for (var i = 0; i < Object.keys(res.cateInfo).length; i++) {
          currentCate.push(res.cateInfo[i].category_id)
        }
        that.setData({
          serachBasicData: res,
          currentFace: Object.keys(res.prodFace),
          currentCate: currentCate
        })
      })
    }
    this.setData({
      isRuleTrue: true
    })
  },
  //关闭规则提示
  hideRule: function() {
    console.log(111)
    this.setData({
      isRuleTrue: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(e) {
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
    var param = e.currentTarget.dataset.id;
    var nowCurrent = that.data.currentFace;
    var index = nowCurrent.indexOf(param);
    if (index > -1) {
      nowCurrent.splice(index, 1);
    } else {
      nowCurrent.push(param)
    }
    that.setData({
      currentFace: nowCurrent
    })
  },
  /**
   * 分类选择
   */
  switchCate: function(e) {
    var that = this;
    var param = e.currentTarget.dataset.id;
    var nowCurrent = that.data.currentCate;
    var index = nowCurrent.indexOf(param);
    if (index > -1) {
      nowCurrent.splice(index, 1);
    } else {
      nowCurrent.push(param)
    }
    that.setData({
      currentCate: nowCurrent
    })
  },
  CollectionDetails: function(e) {
    wx.navigateTo({
      url: "/pages/index/CollectionDetails/CollectionDetails?id=" + e.currentTarget.dataset.id,
    })
  },
})