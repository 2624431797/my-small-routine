Page({
  data: {
    username: "",
    password: "",
    sms: "",
    isLoading: false
  },
  //表单提交
  handlerGetUserName(e){
    this.setData({username: e.detail})
  },
  handlerGetPassWord(e){
    this.setData({password: e.detail})
  },
  handlerFormSubmit(){
    this.setData({isLoading: true})
    const {username} = this.data
    const {password} = this.data
    const {sms} = this.data
    if(!username){
      this.setData({isLoading: false})
      wx.showModal({
        content: '请输入手机号',
        showCancel: false
      })
      return false
    }
    else if(!password){
      this.setData({isLoading: false})
      wx.showModal({
        content: '请输入密码',
        showCancel: false
      })
      return false
    }
    else if(!sms){
      this.setData({isLoading: false})
      wx.showModal({
        content: '请输入验证码',
        showCancel: false
      })
      return false
    }
    else{
      setTimeout(() => {
        this.setData({isLoading: false})
      }, 2000)
    }
  },
  onLoad(options){
    
  }
})