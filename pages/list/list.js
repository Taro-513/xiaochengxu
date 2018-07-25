//index.js
//获取应用实例
var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    list: [],
    offset:0,
    typePid:''
  },
  onLoad: function (e) {
    // console.log("test console log");
    var that = this;
    var typePid=e.typePid;
    that.setData({
      typePid:typePid
    })
    that.getList(that.data.offset, that.data.typePid,function(res){
       console.log(res.data);
       for (var i = 0; i < res.data.data.length; i++) {
         res.data.data[i].updateDate = util.formatDate(res.data.data[i].updateDate);
       }
      var listcontent = that.data.list;
      for (var i = 0; i < res.data.dataSize; i++) {
        listcontent.push(res.data.data[i]);
      }
      
      that.setData({
        list: listcontent,
        // offest: that.data.offset+1
      });
    });
  },
  getList: function (offset,typePid,callback){
    wx.request({
      url: util.baseUrl+'/article/getMoreList?typeId=' + typePid + "&offest=" + offset +"&pagesize=10",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code=='0'){
      callback(res);
        }
      },
      fail: function () {
        console.log("failed request");
      }
    })
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    var that = this;
    // console.log(that.data.offset + "&" + that.data.typePid);
    that.getList(that.data.offset+1, that.data.typePid,function(res){
      console.log(res.data);
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i].updateDate = util.formatDate(res.data.data[i].updateDate);
      }
      var listcontent = that.data.list;
      for (var i = 0; i < res.data.dataSize; i++) {
        listcontent.push(res.data.data[i]);
      }
      that.setData({
        list: listcontent,
        offset: that.data.offset+1
      });
    });
  },
  //跳转详情页
  bindViewTap: function (event) {
    wx.navigateTo({
      url: '../getinfo/getinfo?pid=' + event.currentTarget.dataset.pid
    })
  }
})
