Page({
  data: {
    priceTotal: 0
  },
  onLoad(options){
    this.setData({
      priceTotal: options.priceSum
    })
  },
  handlerWeChatPayWay(e){
    let {
      pricetotal
    } = e.currentTarget.dataset
    wx.showToast({
      title: '确认支付中',
      icon: 'loading',
      duration: 2000,
      success: (res) => {
        console.log(pricetotal)
        //WeChat支付
        /* 
            微信支付: https://pay.weixin.qq.com/wiki/doc/api/index.html
            微信小程序实现微信支付功能流程: https://www.jianshu.com/p/0f54dfa02688
            后台生成预支付交易单: https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1
            微信小程序-支付: http://www.cnblogs.com/jcscript/p/6126722.html
        */
      }
    })
  }
})