Page({
  data: {
    priceTotal: 0
  },
  onLoad(options){
    this.setData({
      priceTotal: options.priceSum
    })
  }
})