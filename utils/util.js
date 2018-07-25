const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatDate(date) {
  var time = new Date(date);
  var now = new Date();
  var year = time.getFullYear();
  var year1 = now.getFullYear();
  var month = time.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  var day = time.getDate();
  day = day < 10 ? '0' + day : day;
  var hour = time.getHours();
  hour = hour < 10 ? '0' + hour : hour;
  var minute = time.getMinutes();
  minute = minute < 10 ? '0' + minute : minute;
  var d = Math.floor((now.getTime() - time.getTime()) / (3600 * 1000 * 24));
  var h = Math.floor((now.getTime() - time.getTime()) / (3600 * 1000));
  var m = Math.floor((now.getTime() - time.getTime()) / (60 * 1000));
  if (year1 > year) {
    return year + "-" + month + "-" + day + " " + hour + ":" + minute;
  } else {
    if (m > 60 && m < 60 * 24) {
      return h + "小时前";
    }
    else if (1 < m && m <= 60) {
      return m + "分钟前";
    }
    else if (m <= 1) {
      return "1分钟内";
    } else {
      return month + "-" + day + " " + hour + ":" + minute;
    }
  }

}
 

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  baseUrl:'https://app3.51etang.com'
} 