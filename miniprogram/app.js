//app.js
App({
  globalData:{
  },
  onLaunch: function () {
    wx.cloud.init({
      traceUser: true
    })
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        
        this.globalData.openId = res.result.userInfo.openId
      }
    })
  }
  
})
