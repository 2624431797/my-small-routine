Page({
  data: {
    filmPrice: 0,
    scaleMin: 1,      //h5端为解决1无法缩小问题，设为0.95
    boxWidth: 400,    //屏幕宽度px
    space: "",        //空格
    seatArray: [],    //影院座位的二维数组,-1为非座位，0为未购座位，1为已选座位(绿色),2为已购座位(红色),一维行，二维列
    seatRow: 0,       //影院座位行数
    seatCol: 0,       //影院座位列数
    seatSize: 0,      //座位尺寸
    SelectNum: 0,     //选择座位数
    moveX: 0,         //水平移动偏移量
    scale: 1,         //放大倍数
    minRow: 0,        //从第几行开始排座位
    minCol: 0,        //从第几列开始排座位
    showTis: true,    //显示选座提示
    seatList: [],     //接口获取的原始位置
    mArr: [],         //排数提示
    optArr: [],       //选中的座位数组。
    isWXAPP: false,
    btnStatus: false,
    
  },
  onLoad(options) {
    let obj = JSON.parse(options.obj)
    this.setData({
      filmPrice: obj.price
    })

    wx.getSystemInfo({
      success: (e) => {
        this.setData({
          boxWidth: e.screenWidth,
          scaleMin: 0.95
        })
      }
    })
  }
})