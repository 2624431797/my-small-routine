Page({
  data: {
    searchVal: "",
    scrollTop: null,
    hotCitys: [],
    indexCitys: [],
    indexList: [],
    searchList: [],
    nowCity: ""
  },
  //初始化
  handlerGetInit(){
    //导入json
    let citys = require("../../public/json/City")
    const arrCitys = citys.userlist
    //索引栏
    const indexList = []
    for(let i = 0; i < arrCitys.Citys.length; i++){
      indexList.push(arrCitys.Citys[i].initial)
    }
    //城市
    let nowCity = wx.getStorageSync("AppCity")
    this.setData({
      hotCitys: arrCitys.hotCitys,
      indexCitys: arrCitys.Citys,
      indexList,
      nowCity
    })
  },
  onLoad(options){
    this.handlerGetInit()
  },
  //监听用户滑动页面事件
  onPageScroll(e){
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  //监听搜索键盘
  handlerSearchKey(e){
    //导入json
    let citys = require("../../public/json/City")
    const arrCitys = citys.userlist
    //逻辑
    const keySearchVal = e.detail
    this.setData({
      searchVal: keySearchVal
    })
    //匹配逻辑
    if(this.timer){
      clearTimeout(this.timer)
    }
    if(!keySearchVal){
      this.setData({searchList: []})
      return
    }
    this.timer = setTimeout(() => {
      let result = []
      arrCitys.Citys.forEach(item => {
        item.list.forEach(val => {
          let name = val.name.substr(0, 1)
          let spell = val.pinyin.toLowerCase().substr(0, 1)
          let inVal = keySearchVal.substr(0, 1)
          if(keySearchVal.toString().length === 1){
            if(name === inVal || spell === inVal){
              result.push(val)
            }
          }
          else if(val.pinyin.toLowerCase().indexOf(keySearchVal.toString()) > -1 || val.name.indexOf(keySearchVal.toString()) > -1){
            result.push(val)
          }
        })
      })
      this.setData({
        searchList: result
      })
    }, 100)
  },
  //选择城市
  handlerSelectCity(e){
    wx.setStorageSync("AppCity", e.currentTarget.dataset.selectcity)
    wx.switchTab({
      url: "/pages/index/index"
    })
  }
})