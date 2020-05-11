Page({
  data: {
    showMap: false,
    userlist: null,
    longitude: 0,
    latitude: 0,
    //标记点用于在地图上显示标记的位置
    markers: [],
    //指定一系列坐标点，从数组第一项连线至最后一项
    polyline: []
  },
  onLoad(options) {
    this.handlerInitGetData(options.id)

    this.mapCtx = wx.createMapContext("map")
  },
  ToLocation() {
    wx.navigateBack({
      delta: 1
    })
  },
  handlerInitGetData(id) {
    let parms = { id }
    this.requestPost(
      `/api/c1/GetCineDetail/${id}`, parms
    ).then(res => {
      this.setData({
        userlist: res.data,
        showMap: true,
      })
      let {iLong, iLat} = res.data
      this.handlerInitMap(iLong, iLat)
    })
  },
  handlerInitMap(iLong, iLat) {
    //获取当前位置
    wx.getLocation({
      type: "wgs84",
      success: res => {
        let {longitude, latitude} = res
        //markers
        let markers = [{
          id: 0,
          iconPath: "../../assets/maps/map-position.png",
          width: 24,
          height: 24,
          longitude: iLong,
          latitude: iLat,
          callout: {
            display: "BYCLICK",
            content: "影院位置",
            color: "#1296db",
            borderRadius: 5,
            padding: 6,
            textAlign: "center",
            borderColor: "#CCC",
          }
        }]
        //polyline
        let polyline = [{
          points: [{
            longitude,
            latitude
          }, {
            longitude: iLong,
            latitude: iLat
          }],
          color: "#FF0000DD",
          width: 2,
          dottedLine: true
        }]
        //初始化数据
        this.setData({
          markers, polyline, latitude, longitude
        })
      }
    })
  },
  handlerToLocation(){
    this.mapCtx.moveToLocation()
  },
  //点击标记点时触发
  markertap(e) {
    console.log(e.detail.markerId)
  }
})