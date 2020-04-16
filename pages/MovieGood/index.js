Page({
  data: {
    goodlist: null,
    stepperNum: 1,
    priceUnit: 0,
    priceSum: 0,
    mobile: ""
  },
  handlerGetInit(id){
    this.requestPost(
      `/api/v1/GetMovieGoods/${id}`, id
    ).then(res => {
      this.setData({
        goodlist: res.data.userlist,
        mobile: res.data.userlist.mobile,
        priceUnit: res.data.userlist.new,
        priceSum: res.data.userlist.new,
      })
    })
  },
  handlerStepperChange(e){
    const goodNum = e.detail
    this.setData({
      priceSum: this.data.priceUnit * goodNum
    })
  },
  handlerLinkPay(){
    let {priceSum} = this.data
    wx.showToast({
      title: '提交订单',
      icon: 'loading',
      duration: 2000
    })
    wx.navigateTo({
      url: `/pages/AppPay/index?priceSum=${priceSum}`
    })
  },
  onLoad(options) {
    this.handlerGetInit(options.id)
  }
})