var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    info: {},
    updateDate:'',
    showAthor:true,
    progress:0,
    playstate:"",
    stopstate:"",
    currentTime:"00:00",
    duration: "01:00", 
    setCurrentTime:0,
    showSlider:true
  },
  
  onLoad:function(e){
// console.log("test console log");
    var that = this
    wx.request({
      url: 'https://app3.51etang.com/article/getDetail?pid='+e.pid, 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          info: res.data.data,
          updateDate: util.formatDate(res.data.data.updateDate),
          showAthor:(res.data.data.authorName == "" ? false : true),
          showSlider: false
        });
        WxParse.wxParse("article_content", "html", res.data.data.content, that,5);   
      },
      fail:function(){
        console.log("failed request");
      }
    })
    
  },
  MusicStart: function (e) {
    var progress = parseInt((e.detail.currentTime / e.detail.duration) * 100)
    var that = this
    that.setData({
      currentTime: this.getDuration(e.detail.currentTime),
      duration: this.getDuration(e.detail.duration),
      progress: progress,
      setCurrentTime: e.detail.duration
    })
  },
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext("audio")
  },
  audioPlay: function (e) {
    // 更新收听数
    wx.request({
      url: 'https://app3.51etang.com/article/updateListentCount?pid=' + e.pid,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
      },
      fail: function () {
        console.log("failed request");
      }
    })
    this.setData({//把选中值放入判断值
      playstate:"hide",
      stopstate: "show"
    })
    this.audioCtx.setSrc(this.data.info.audioAddress)
    this.audioCtx.play()
  },
  audioPause: function () {
    this.setData({//把选中值放入判断值
      playstate: "show",
      stopstate: "hide"
    })
    this.audioCtx.pause()
  },
  MusicEnd: function () {
    var that=this;
    that.setData({
      currentTime: "00:00",
      // duration: this.getDuration(parseInt(e.detail.duration)),
      progress: 0,
      playstate: "show",
      stopstate: "hide"
    })
    this.audioCtx.seek(0)
  },
  getDuration:function(d){
    d=parseInt(d);
    var m, s;
    if(d<59){
      return "00:" + this.addZero(d);
    }else if(d>60) {
      m = parseInt(d / 60);
      s = d - m * 60;
      if (m > 10) {
        return m + ":" + this.addZero(s)
      } else {
        return this.addZero(m) + ":" + this.addZero(s)
      }
    }
  },
addZero:function(x) {
    if (x > 10) {
      return x
    } else {
      return "0" + x
    }
  },
sliderchange:function(e){
  this.audioCtx.seek(this.data.setCurrentTime*(e.detail.value/100))
  this.setData({
    progress:e.detail.value,
    showSlider:false
  })
},
onShareAppMessage: function (res) {
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res.target)
  }
  return {
    title: this.data.info.articleTitle,
    imageUrl: this.data.info.picsmall,
    path: 'pages/getinfo/getinfo?pid=' + this.data.info.pid,
    success: function (res) {
      // 转发成功
    },
    fail: function (res) {
      // 转发失败
    }
  }
}
})  
