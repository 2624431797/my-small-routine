Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAuthorization: false,   //登录状态
    isLoading: false
  },
  //初始化
  onLoad(options) {
    this.handlerBindGetOnLoad()
  },
  //初始化判断
  handlerBindGetOnLoad() {
    // 查看是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              //从数据库获取用户信息
              //console.log(res)
              //修改验证
              this.setData({ 
                isAuthorization: true
              })
              wx.setStorageSync("isAuthorization", this.data.isAuthorization)
              //用户已经授权过
              wx.switchTab({
                url: "/pages/index/index"
              })
            }
          })
        }
      }
    })
  },
  handlerBindGetUserInfo(e) {
    //用户按了允许授权按钮
    if (e.detail.userInfo) {
      // 通过 wx.login() 完成微信登录
      // wx.login()
      // 通过 wx.getUserInfo() 获取用户信息
      wx.getUserInfo({
        lang: "zh_CN",
        success: function(res) {
          let {userInfo} = res
          wx.setStorageSync("AppUserInfo", userInfo)
          wx.setStorageSync("AppCity", userInfo.city)
        }
      })
      //登录状态
      this.setData({ 
        isAuthorization: true
      })
      wx.setStorageSync("isAuthorization", this.data.isAuthorization)
      //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: "/pages/index/index"
      })
    } 
    else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您选择拒绝授权, 将无法进入小程序, 请授权之后再进入',
        showCancel: false,
        confirmText: "返回授权"
      })
    }
  }
})