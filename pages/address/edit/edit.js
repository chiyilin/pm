// pages/address/add/add
var app = getApp();
var common = require('../../../utils/common.js');
var checkForm = function(e) {
  if (!e.more_addr) {
    var tips = "请填写详细地址~";
  }
  if (!e.addr) {
    var tips = '请填写地址~'
  }
  if (!e.address_phone) {
    var tips = "请填写电话~";
  }
  if (!e.address_name) {
    var tips = '请填写姓名~';
  }
  if (e.address_phone) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(e.address_phone)) {
      var tips = "请填写正确格式的电话号码~";
    }
  }
  if (tips) {
    common.tips(tips);
    return false;
  } else {
    return 1;
  }
}


Page({
  data: {
    currentCity: ['北京市', '北京市', '朝阳区'],
  },
  onLoad: function(options) {
    var that = common.that = this;
    // common.style();
    common.globalData = app.globalData;
    if (!common.checkAuthLogin(true)) {
      common.login();
    }
    // this.getLocation();
    that.data.id = options.id
    console.log(that.data.id)
    common.Post('user/addrInfo', {
      id: that.data.id
    }, function(res) {
      that.setData({
        data: res,
        currentCity: [res.sheng, res.shi, res.qu],
      });
    });
  },
  changeAddr: function(e) {
    this.setData({
      currentCity: e.detail.value
    });
  },
  chooseAddr: function() {
    var that = this;
    wx.chooseAddress({
      success: function(res) {
        console.log(res)
        that.setData({
          currentCity: [res.provinceName, res.cityName, res.countyName],
          data: {
            address_name: res.userName,
            more_addr: res.detailInfo,
            address_phone: res.telNumber,
          }
        })
      }
    })
  },
  /**
   * 表单提交
   */
  submit: function(e) {
    var that = this;
    var input = e.detail.value;
    console.log(input);
    var userinfo = common.getUserInfo();
    var mailDefaultIndex = that.data.mailDefaultIndex;
    //表单验证
    if (!checkForm(input)) {
      return null;
    }
    var data = {
      address_name: input.address_name,
      address_phone: input.address_phone,
      addr: input.addr,
      sheng: input.addr[0],
      shi: input.addr[1],
      qu: input.addr[2],
      more_addr: input.more_addr,
      address_default: input.address_default ? 2 : 1,
      address_id: that.data.data.address_id,
    };
    common.Post('user/editAddr', data, function(e) {
      wx.showToast({
        title: '修改成功！',
        success: function() {
          setTimeout(function() {
            wx.navigateBack({
              delta: -1
            })
          }, 500);

        }
      })
    });
  },
  /**
   * 获取城市信息
   */
  getLocation: function() {
    var page = this
    wx.getLocation({
      //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      type: 'wgs84',
      success: function(res) {
        // console.log(res.latitude);
        // console.log(res.longitude);
        // success  
        var longitude = res.longitude
        var latitude = res.latitude
        // page.loadCity(longitude, latitude);
        // page.tencentLoadCity(longitude, latitude);
      }
    })
  },
  /**
   * 腾讯地图
   */
  tencentLoadCity: function(longitude, latitude) {
    var that = this;
    common.PostMain('Invoice/location', {
      longitude: longitude,
      latitude: latitude
    }, function(e) {
      var addr = JSON.parse(e).result.ad_info.name;
      console.log(addr)
      var newAddr = addr.substr(3)
      var addrArr = newAddr.split(',');
      that.setData({
        newAddr: newAddr,
        currentCity: addrArr,
        moreAddr: JSON.parse(e).result.address
      });
    });
  },
  /**
   * 百度地图API
   * [偶尔会报错]
   */
  loadCity: function(longitude, latitude) {
    var page = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=tBBrq19tbY61YOIxTNKWGGHERGKaD5x1&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        // success  
        console.log(res.data);
        var city = res.data.result.addressComponent.city;
        page.setData({
          currentCity: city
        });
      },
      fail: function() {
        console.log('获取定位失败');
        page.setData({
          currentCity: "获取定位失败"
        });
      },

    })
  }
})