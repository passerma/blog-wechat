let COMMON_URL
const version = __wxConfig.envVersion;
// version === 'develop' ? COMMON_URL = "http://localhost:7010/api/" : COMMON_URL = "https://www.passerma.com/api/"
COMMON_URL = "https://www.passerma.com/api/"

module.exports = function (urlResult, params, callBack) {
    let url = `${COMMON_URL}${urlResult}`;
    wx.request({
      url,
      success: (res) => {
        callBack(res.data)
      }
    })
}