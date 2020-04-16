import { requestPost } from "./services/index"

App({
  //登录逻辑
  //AppID(小程序ID)	wxbb6fb26073c1e762
  //AppSecret 9e2c58117b33f7c9e6635aa557026baf
  //GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
  AppUserLogin(){
    wx.login({
      success: res => {
        if(res.code){
          let {code} = res
          let appid = "wxbb6fb26073c1e762"
          let secret = "9e2c58117b33f7c9e6635aa557026baf"
          wx.request({
            url: "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid + "&secret=" + secret + "&js_code=" + code + "&grant_type=authorization_code",
            success: res => {
              const {openid} = res.data
              const {session_key} = res.data
              wx.setStorageSync("AppUserLogin", {
                openid,
                session_key
              })
            }
          })
        }
        else{
          wx.showModal({
            content: '授权失败',
            showCancel: false
          })
          return false
        }
      }
    })
  },
  //page共用
  handlerInitPage(){
    const oPage = Page
    Page = config => oPage(Object.assign(config, {
      requestPost
    }))
  },
  onLaunch(){
    this.AppUserLogin()
    this.handlerInitPage()
  }
})
