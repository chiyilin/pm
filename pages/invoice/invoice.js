// var common = require('../../utils/common.js');
var checkForm = function(e) {
  // console.log(e)
  if (!e.mail) {
    var tips = '请选择邮箱地址！';
  }
  if (e.head == 1) {
    if (!e.name) {
      var tips = '请填写名称！';
    }
  } else if (e.head == 2) {
    if (!e.name) {
      var tips = '请填写名称！';
    }
    if (!e.shuihao) {
      var tips = '请填写税号！';
    }
    if (!e.addr) {
      var tips = '请填写地址！'
    }
    if (!e.moreAddr) {
      var tips = "请填写详细地址！";
    }
    if (!e.phone) {
      var tips = "请填写电话！";
    }
    if (!e.bankNumber) {
      var tips = "请填写开户账号！";
    }
    if (!e.bank) {
      var tips = '请填写开户行信息！';
    }
  }
  if (tips) {
    // common.tips(tips);
    return false;
  } else {
    return 1;
  }
}
Page({
  data: {
    currentCity: ['北京市', '北京市', '朝阳区'],
    headArr: {
      1: '个人',
      2: '企业'
    },
    defaultHead: 1
  },
  onLoad: function(options) {
    var userInfo = wx.getStorageSync('userInfo');
    var that = this;
    that.data.list_id = options.list_id
    that.data.product_class_id = options.product_class_id
    that.data.list_type = options.list_type
    that.data.product_id = options.product_id
    // common.PostMain('user/getMail', {
    //   user_id: userInfo.user_id
    // }, function(res) {
    //   if (res[0]) {
    //     var mailDefaultIndex = 0;
    //     that.setData({
    //       mailDefaultIndex: mailDefaultIndex,
    //       mailDefaultdesc: res[0].mail_name + '-' + res[0].mail_addr
    //     })
    //   }
    //   var arr = [];
    //   for (var i = 0; i < res.length; i++) {
    //     arr.push(res[i].mail_name + '-' + res[i].mail_addr)
    //   }
    //   that.setData({
    //     mailInfo: arr,
    //     mailDeatilsList: res
    //   });
    // });
    this.getLocation();
  },
  /**
   * 选择邮箱地址
   */
  changeMail: function(e) {
    var mailDefaultIndex = e.detail.value;
    this.setData({
      mailDefaultIndex: mailDefaultIndex,
      mailDefaultdesc: this.data.mailDeatilsList[mailDefaultIndex].mail_name + '-' + this.data.mailDeatilsList[mailDefaultIndex].mail_addr
    });
  },
  /**
   * 抬头改变
   */
  changeHead: function(e) {
    this.setData({
      defaultHead: e.detail.value,
    })
  },
  /**
   * 表单提交
   */
  submit: function(e) {
    var that = this;
    var input = e.detail.value;
    var userInfo = wx.getStorageSync('userInfo');
    var mailDefaultIndex = that.data.mailDefaultIndex;
    //表单验证
    if (!checkForm(input)) {
      return null;
    }
    var data = {
      mail_id: that.data.mailDeatilsList[mailDefaultIndex].mail_id,
      mail_name: that.data.mailDeatilsList[mailDefaultIndex].mail_name,
      mail_addr: that.data.mailDeatilsList[mailDefaultIndex].mail_addr,
      user_id: userInfo.user_id,
      list_id: that.data.list_id,
      product_class_id: that.data.product_class_id,
      list_type: that.data.list_type,
      name: input.name,
      head: input.head,
      product_id: that.data.product_id
    };

    if (input.head == 2) {
      console.log('选择了企业')
      var str = input.addr;
      var newAddr = str.join("");
      data.shuihao = input.shuihao;
      data.addr = newAddr + input.moreAddr;
      data.phone = input.phone;
      data.bankNumber = input.bankNumber;
      data.bank = input.bank;
    }
    // `user_id` int(10) NOT NULL COMMENT '用户ID',
    // `list_id` int(10) NOT NULL COMMENT '订单ID',
    // `product_class_id` int(10) NOT NULL COMMENT '类别ID',
    // `name` varchar(50) NOT NULL COMMENT '名称',
    // `head` varchar(50) NOT NULL COMMENT '发票抬头（1、个人；2、企业）',
    // `shuihao` varchar(30) NOT NULL COMMENT '纳税人标识号',
    // `addr` varchar(100) NOT NULL COMMENT '地址',
    // `phone` char(15) NOT NULL COMMENT '电话',
    // `bank` char(150) NOT NULL COMMENT '开户行以及账号',
    // `add_time` int(10) NOT NULL COMMENT '申请时间',

    // common.PostMain('invoice/create', data, function(e) {
    //   wx.showToast({
    //     title: '提交成功！',
    //     success: function() {
    //       setTimeout(function(e) {
    //         wx.navigateBack({
    //           delta: 1
    //         })
    //       }, 2000);
    //     }
    //   })
    // })
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