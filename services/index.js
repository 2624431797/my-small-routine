//封装service
const service = "http://rap2api.taobao.org/app/mock/248071"

//Post方法
export function requestPost(apiUrl, params){
  return new Promise((resolve, reject) => {
    wx.request({
      url: service + apiUrl,
      data: params,
      method: 'POST',
      header: { 'content-Type': 'application/x-www-form-urlencoded', },
      success: res => {
        resolve(res.data)
      },
      fail: err => {
        reject(res.error)
      }
    })
  })
}