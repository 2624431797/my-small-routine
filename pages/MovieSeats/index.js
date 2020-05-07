import { seatData } from "../../utils/seat-data"
import initComputed from "wx-computed"

Page({
  data: {
    obj: {},
    scaleMin: 1, //h5端为解决1无法缩小问题，设为0.95
    boxWidth: 400, //屏幕宽度px
    space: "", //空格
    seatArray: [], //影院座位的二维数组,-1为非座位，0为未购座位，1为已选座位(绿色),2为已购座位(红色),一维行，二维列
    seatRow: 0, //影院座位行数
    seatCol: 0, //影院座位列数
    seatSize: 0, //座位尺寸
    SelectNum: 0, //选择座位数
    moveX: 0, //水平移动偏移量
    scale: 1, //放大倍数
    minRow: 0, //从第几行开始排座位
    minCol: 0, //从第几列开始排座位
    showTis: true, //显示选座提示
    seatList: [], //接口获取的原始位置
    mArr: [], //排数提示
    optArr: [], //选中的座位数组。
    isWXAPP: false,
    btnStatus: false,

  },
  computed: {
    aPrice() {
      return this.data.SelectNum * this.data.obj.price
    },
    rpxNum() {
      return this.data.boxWidth / 750
    },
    pxNum() {
      return 750 / this.data.boxWidth
    },
  },
  onLoad(options) {
    // 在onLoad生命周期中执行computed属性初始化
    initComputed(this)

    let obj = JSON.parse(options.obj)
    this.setData({
      obj
    })
    wx.getSystemInfo({
      success: (e) => {
        this.setData({
          boxWidth: e.screenWidth,
          scaleMin: 0.95
        })
      }
    })
    this.handlerInitData()
  },
  handlerInitData() {
    let arr = seatData
    //假数据说明：SeatCode座位编号，RowNum-行号，ColumnNum-纵号，YCoord-Y坐标，XCoord-X坐标，Status-状态
    let row = 0
    let col = 0
    let minCol = parseInt(arr[0].XCoord)
    let minRow = parseInt(arr[0].YCoord)
    for (let i of arr) {
      minRow = parseInt(i.YCoord) < minRow ? parseInt(i.YCoord) : minRow
      minCol = parseInt(i.XCoord) < minCol ? parseInt(i.XCoord) : minCol
      row = parseInt(i.YCoord) > row ? parseInt(i.YCoord) : row
      col = parseInt(i.XCoord) > col ? parseInt(i.XCoord) : col
    }
    this.setData({
      seatList: arr,
      seatRow: row - minRow + 1,
      seatCol: col - minCol + 3,
      minRow: minRow,
      minCol: minCol - 1
    })
    this.handlerInitSeatArray()
  },
  //初始座位数组
  handlerInitSeatArray() {
    let seatArray = Array(this.data.seatRow).fill(0).map(() => Array(this.data.seatCol).fill({
      type: -1,
      SeatCode: '',
      RowNum: '',
      ColumnNum: ''
    }))
    this.setData({
      seatArray: seatArray,
      seatSize: this.data.boxWidth > 0 ? parseInt(parseInt(this.data.boxWidth, 10) / (this.data.seatCol + 1), 10) : parseInt(parseInt(414, 10) / (this.data.seatCol + 1), 10)
    })
    this.handlerInitNonSeatPlace()
  },
  //初始化是座位的地方
  handlerInitNonSeatPlace() {
    let seat = this.data.seatList.slice()
    let arr = this.data.seatArray.slice()
    for (let num in seat) {
      let status = 2 //-1为非座位，0为未购座位，1为已选座位(绿色),2为已购座位(红色)
      if (seat[num].Status === 0) {
        status = 0
      } else if (seat[num].Status === -1) {
        status = -1
      }
      arr[parseInt(seat[num].YCoord) - this.data.minRow][parseInt(seat[num].XCoord) - this.data.minCol] = {
        type: status,
        SeatCode: seat[num].SeatCode,
        RowNum: seat[num].RowNum,
        ColumnNum: seat[num].ColumnNum
      }
    }
    this.setData({
      seatArray: arr.slice()
    })
    let mArr = []
    for (let i in arr) {
      let m = ''
      for (let n of arr[i]) {
        if (n.SeatCode) {
          m = n.RowNum
        }
      }
      if (m) {
        mArr.push(m)
      } else {
        mArr.push('')
      }
    }
    this.setData({
      mArr
    })
  },
  //放大缩小事件
  handlerOnScale(e) {
    this.setData({
      showTis: false,
      //moveX: -e.detail.x
    })
    let w = this.data.boxWidth * 0.5
    let s = 1 - e.detail.scale
    this.setData({
      moveX: w * s,
      scale: e.detail.scale
    })
    if (s > 0 || s === 0) {
      this.setData({
        showTis: true
      })
    }
  },
  //移动事件
  handlerOnMove(e) {
    this.setData({
      showTis: false,
      moveX: e.detail.x
    })
  },
  //重置座位
  handlerResetSeat() {
    this.setData({
      SelectNum: 0,
      optArr: []
    })
    //将所有已选座位的值变为0
    let oldArray = this.data.seatArray.slice()
    for (let i = 0; i < this.data.seatRow; i++) {
      for (let j = 0; j < this.data.seatCol; j++) {
        if (oldArray[i][j].type === 1) {
          oldArray[i][j].type = 0
        }
      }
    }
    this.setData({
      seatArray: oldArray
    })
  },
  //选定且购买座位
  handlerBuySeat() {
    if (this.data.SelectNum === 0) {
      return
    }
    let oldArray = []
    for (let i = 0; i < this.data.seatRow; i++) {
      for (let j = 0; j < this.data.seatCol; j++) {
        if (this.data.seatArray[i][j].type === 1) {
          oldArray.push(this.data.seatArray[i][j].SeatCode)
        }
      }
    }
    //确认金额
    const priceSum = oldArray.length * this.data.obj.price
    wx.showToast({
      title: '确认订单',
      icon: 'loading',
      duration: 2000,
      success: res => {
        wx.navigateTo({
          url: `/pages/AppPay/index?priceSum=${priceSum}`
        })
      }
    })
  },
  //处理座位选择逻辑
  handlerChooseSeat(e) {
    let row = e.currentTarget.dataset.index
    let {
      col
    } = e.currentTarget.dataset
    let seatValue = this.data.seatArray[row][col].type
    let newArray = this.data.seatArray
    //如果是已购座位，直接返回
    if (seatValue === 2 || seatValue === -1) return
    //如果是已选座位点击后变未选
    if (seatValue === 1) {
      newArray[row][col].type = 0
      let SelectNum = this.data.SelectNum - 1
      this.setData({
        SelectNum
      })
      this.handlerGetOptArr(newArray[row][col], 0)
    } else if (seatValue === 0) {
      newArray[row][col].type = 1
      let SelectNum = this.data.SelectNum + 1
      this.setData({
        SelectNum
      })
      this.handlerGetOptArr(newArray[row][col], 1)
    }
    //必须整体更新二维数组，Vue无法检测到数组某一项更新,必须slice复制一个数组才行
    this.setData({
      seatArray: newArray.slice()
    })
  },
  //处理已选座位数组
  handlerGetOptArr(item, type) {
    let optArr = this.data.optArr
    if (type === 1) {
      optArr.push(item)
    } else if (type === 0) {
      let arr = []
      optArr.forEach(v => {
        if (v.SeatCode !== item.SeatCode) {
          arr.push(v)
        }
      })
      optArr = arr
    }
    this.setData({
      optArr: optArr.slice()
    })
  },
  //推荐选座,参数是推荐座位数目，
  handlerSmartChoose(e) {
    let {
      num
    } = e.currentTarget.dataset
    // 先重置
    this.handlerResetSeat()
    //找到影院座位水平垂直中间位置的后一排
    let rowStart = parseInt((this.data.seatRow - 1) / 2, 10) + 1;
    //先从中间排往后排搜索
    let backResult = this.handlerSearchSeatByDirection(rowStart, this.data.seatRow - 1, num);
    if (backResult.length > 0) {
      this.handlerAuxiliaryChooseSeat(backResult)
      let SelectNum = null
      SelectNum += num
      this.setData({
        SelectNum
      })
      return
    }
    //再从中间排往前排搜索
    let forwardResult = this.handlerSearchSeatByDirection(rowStart - 1, 0, num);
    if (forwardResult.length > 0) {
      this.handlerAuxiliaryChooseSeat(forwardResult)
      let SelectNum = null
      SelectNum += num
      this.setData({
        SelectNum
      })
      return
    }
    //提示用户无合法位置可选
    wx.showModal({
      title: '提示',
      content: '无合法位置可选!',
      showCancel: false
    })
  },
  //搜索函数,参数:fromRow起始行，toRow终止行,num推荐座位数
  handlerSearchSeatByDirection(fromRow, toRow, num) {
    /*
     * 推荐座位规则
     * (1)初始状态从座位行数的一半处的后一排的中间开始向左右分别搜索，取离中间最近的，如果满足条件，
     *    记录下该结果离座位中轴线的距离，后排搜索完成后取距离最小的那个结果座位最终结果，优先向后排进行搜索，
     *    后排都没有才往前排搜，前排逻辑同上
     *
     * (2)只考虑并排且连续的座位，不能不在一排或者一排中间有分隔
     *
     * */

    /*
     * 保存当前方向搜索结果的数组,元素是对象,result是结果数组，offset代表与中轴线的偏移距离
     * {
     *   result:Array([x,y])
     *   offset:Number
     * }
     *
     */
    let currentDirectionSearchResult = []
    let largeRow = fromRow > toRow ? fromRow : toRow,
      smallRow = fromRow > toRow ? toRow : fromRow;
    for (let i = smallRow; i <= largeRow; i++) {
      //每一排的搜索,找出该排里中轴线最近的一组座位
      let tempRowResult = [],
        minDistanceToMidLine = Infinity
      for (let j = 0; j <= this.data.seatCol - num; j++) {
        //如果有合法位置
        if (this.handlerCheckRowSeatContinusAndEmpty(i, j, j + num - 1)) {
          //计算该组位置距离中轴线的距离:该组位置的中间位置到中轴线的距离
          let resultMidPos = parseInt((j + num / 2), 10);
          let distance = Math.abs(parseInt(this.data.seatCol / 2) - resultMidPos);
          //如果距离较短则更新
          if (distance < minDistanceToMidLine) {
            minDistanceToMidLine = distance
            //该行的最终结果
            tempRowResult = this.handlerGenerateRowResult(i, j, j + num - 1)
          }
        }
      }
      //保存该行的最终结果
      currentDirectionSearchResult.push({
        result: tempRowResult,
        offset: minDistanceToMidLine
      })
    }
    //处理后排的搜索结果:找到距离中轴线最短的一个
    //注意这里的逻辑需要区分前后排，对于后排是从前往后，前排则是从后往前找
    let isBackDir = fromRow < toRow;
    let finalReuslt = [],
      minDistanceToMid = Infinity;
    if (isBackDir) {
      //后排情况,从前往后
      currentDirectionSearchResult.forEach((item) => {
        if (item.offset < minDistanceToMid) {
          finalReuslt = item.result;
          minDistanceToMid = item.offset;
        }
      })
    } else {
      //前排情况，从后往前找
      currentDirectionSearchResult.reverse().forEach((item) => {
        if (item.offset < minDistanceToMid) {
          finalReuslt = item.result;
          minDistanceToMid = item.offset;
        }
      })
    }
    //直接返回结果
    return finalReuslt
  },

  /*辅助函数，判断每一行座位从i列到j列是否全部空余且连续
   *
   */
  handlerCheckRowSeatContinusAndEmpty(rowNum, startPos, endPos) {
    let isValid = true
    for (let i = startPos; i <= endPos; i++) {
      if (this.data.seatArray[rowNum][i].type !== 0) {
        isValid = false
        break
      }
    }
    return isValid
  },
  //辅助函数：返回每一行的某个合理位置的座位数组
  handlerGenerateRowResult(row, startPos, endPos) {
    let result = [];
    for (let i = startPos; i <= endPos; i++) {
      result.push([row, i])
    }
    return result
  },
  //辅助函数:智能推荐的选座操作
  handlerAuxiliaryChooseSeat(result) {
    let opt = this.data.optArr
    let oldArray = this.data.seatArray.slice()
    let newArr = []
    for (let i = 0; i < result.length; i++) {
      //选定座位
      oldArray[result[i][0]][result[i][1]].type = 1
      newArr.push(oldArray[result[i][0]][result[i][1]])
    }
    this.setData({
      optArr: newArr,
      seatArray: oldArray
    })
  },
})