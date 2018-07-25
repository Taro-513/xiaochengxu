var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    list0: [],
    list1: [],
    list2: [],
    list3: [],
    list4: [],
    typeList: [],
    offset: 0,
    playstate: "",
    stopstate: "",
    defaultbg: true,
    isplay: false
  },
  onLoad: function () {
   
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 114;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    // 获取typeid
    var that = this
    wx.request({
      url: util.baseUrl+'/article/get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        var typelist1 = [];
        for (var i = 0; i < res.data.data.length; i++) {
          typelist1.push(res.data.data[i].typePid);
        }
        var result = [];
        for (var i = 0; i < res.data.data.length; i++) {
          for (var j = i + 1; j < res.data.data.length; j++) {
            if (typelist1[i] === typelist1[j]) {
              j = ++i;
            }
          }
          result.push(typelist1[i]);
        }
        that.setData({
          typeList: result,
          defaultbg: false
        });

        // console.log(e.target.dataset.current);
        that.getList(that.data.offset, that.data.typeList[(that.data.currentTab)], function (res) {
          console.log(res.data);
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].updateDate = util.formatDate(res.data.data[i].updateDate);
          }
          var listcontent = that.data.list1;
          for (var i = 0; i < res.data.dataSize; i++) {
            listcontent.push(res.data.data[i]);
          }
          that.setData({
            list0: listcontent,
            // offset: that.data.offset+1
          });
        });
      },
      fail: function () {
        console.log("failed requesttype");
      }
    })

  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current,
      offset: this.data.offset == 0 ? 1 : 0,
      list0: [],
      list1: [],
      list2: [],
      list3: [],
      list4: []
    });
    this.checkCor();
    var that = this;
    // console.log(e.target.dataset.current);
    that.getList(that.data.offset, that.data.typeList[(that.data.currentTab)], function (res) {
      console.log(res.data);
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i].updateDate = util.formatDate(res.data.data[i].updateDate);
      }
      var listcontent = that.data.list1;
      for (var i = 0; i < res.data.dataSize; i++) {
        listcontent.push(res.data.data[i]);
      }
      if (that.data.currentTab == 0) {
        that.setData({
          list0: listcontent
        });
      } else if (that.data.currentTab == 1) {
        that.setData({
          list1: listcontent
        });
      } else if (that.data.currentTab == 2) {
        that.setData({
          list2: listcontent
        });
      } else if (that.data.currentTab == 3) {
        that.setData({
          list3: listcontent
        });
      } else if (that.data.currentTab == 4) {
        that.setData({
          list4: listcontent
        });
      }
    });
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur,
        offset: 0,
        list0: [],
        list1: [],
        list2: [],
        list3: [],
        list4: []
      })
    }
    this.checkCor();
    var that = this;
    // console.log(e.target.dataset.current);
    that.getList(that.data.offset, that.data.typeList[(that.data.currentTab)], function (res) {
      console.log(res.data);
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i].updateDate = util.formatDate(res.data.data[i].updateDate);
      }
      var listcontent = that.data.list1;
      for (var i = 0; i < res.data.dataSize; i++) {
        listcontent.push(res.data.data[i]);
      }
      if (that.data.currentTab == 0) {
        that.setData({
          list0: listcontent
        });
      } else if (that.data.currentTab == 1) {
        that.setData({
          list1: listcontent
        });
      } else if (that.data.currentTab == 2) {
        that.setData({
          list2: listcontent
        });
      } else if (that.data.currentTab == 3) {
        that.setData({
          list3: listcontent
        });
      } else if (that.data.currentTab == 4) {
        that.setData({
          list4: listcontent
        });
      }
    });
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 2) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  getList: function (offset, typePid, callback) {
    wx.request({
      url: 'https://app3.51etang.com/article/getMoreList?typeId=' + typePid + "&offest=" + offset + "&pagesize=10",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == '0') {
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
    // console.log(that.data.offset + "&" + that.data.typeList);
    that.getList(that.data.offset + 1, that.data.typeList[(that.data.currentTab)], function (res) {
      console.log(res.data);
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i].updateDate = util.formatDate(res.data.data[i].updateDate);
      }
      var listcontent = that.data.list0;
      for (var i = 0; i < res.data.dataSize; i++) {
        listcontent.push(res.data.data[i]);
      }
      if (that.data.currentTab == 0) {
        that.setData({
          list0: listcontent,
          offset: that.data.offset + 1
        });
      } else if (that.data.currentTab == 1) {
        that.setData({
          list1: listcontent,
          offset: that.data.offset + 1
        });
      } else if (that.data.currentTab == 2) {
        that.setData({
          list2: listcontent,
          offset: that.data.offset + 1
        });
      } else if (that.data.currentTab == 3) {
        that.setData({
          list3: listcontent,
          offset: that.data.offset + 1
        });
      } else if (that.data.currentTab == 4) {
        that.setData({
          list4: listcontent,
          offset: that.data.offset + 1
        });
      }
    });
  },
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext(this.data.playstate)
  },
  //跳转详情页
  bindViewTap: function (event) {
    wx.navigateTo({
      url: '../getinfo/getinfo?pid=' + event.currentTarget.dataset.pid
    });
    this.audioCtx.pause()
  },
  audioPlay: function (e) {
    // 更新收听数
    wx.request({
      url: 'https://app3.51etang.com/article/updateListentCount?pid=' + (e.currentTarget.dataset.pid),
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
      },
      fail: function () {
        console.log("failed request");
      }
    })

    // this.audioCtx = wx.createAudioContext(e.currentTarget.dataset.pid)   
    if (this.data.stopstate != e.currentTarget.dataset.pid) {
      this.audioCtx.setSrc(e.currentTarget.dataset.addr)
      this.audioCtx.seek(0)
    }
    this.setData({//把选中值放入判断值
      playstate: (e.currentTarget.dataset.pid),
      stopstate: e.currentTarget.dataset.pid,
      isplay: true
    })
    this.audioCtx.play()
   
  },
  audioPause: function () {
    this.setData({//把选中值放入判断值
      playstate: "",
      isplay: false
    })
    this.audioCtx.pause()


  },
  endEvent: function () {
    var nextPid, nextAddr;
    for (var i = 0; i < this.data.list0.length; i++) {
      if (this.data.list0[i].pid == this.data.playstate) {
        nextAddr = this.data.list0[i + 1].audioAddress;
        nextPid = this.data.list0[i + 1].pid;
      }
    }
    this.audioCtx.setSrc(nextAddr);
    this.setData({//把选中值放入判断值
      playstate: nextPid,
      isplay: true
    })
    this.audioCtx.play();
    // this.audioCtx.seek(0)
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: "每天学点控糖知识，自我管理血糖健康~",
      imageUrl: '../../image/etang60s_share.jpg',
      path: 'pages/indexlist/indexlist',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  footerTap: app.footerTap
})