Page({
  data: {
    noticeText: "受疫情影响，各大影院特推出优惠券百分百中活动，体验浪漫情怀，享受视听盛宴；体验时尚生活，品味精彩电影；感受影音魅力，乐享震撼视听；新视界，新天地，心享受！",
    nowCity: "",
    vanActive: 0,
    cinemalist: []
  },
  onLoad(options) {
    let para = "1"
    this.handlerInitGetList(para)
  },
  //获取城市
  onShow(){
    let nowCity = wx.getStorageSync("AppCity")
    this.setData({
      nowCity
    })
  },
  //获取数据
  handlerInitGetList(para){
    let params = {para}
    this.requestPost(
      `/api/c1/GetCineListChange`, params
    ).then(res => {
      this.setData({
        cinemalist: res.data.cinemalist
      })
    })
  },
  //切换
  handlerVanOnChange(event){
    //this.handlerInitGetList(event.detail.name)
  },
})