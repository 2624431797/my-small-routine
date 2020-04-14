Component({
  data: {
    nowCity: ""
  },
  ready(){
    let nowCity = wx.getStorageSync("AppCity")
    this.setData({
      nowCity
    })
  }
})
