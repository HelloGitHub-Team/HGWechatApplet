const apiService = require('../srevice/apiService')
const config = require('../utils/config')

function getCategory({
  success: success,
  fail: fail
}) {
  apiService.request({
    url: `${config.apiBaseUrl}/category/`,
    success(res) {
      const list = res.payload
      success(list)
    },
    fail: fail
  })
}

module.exports = {
  /**
   * 获取兴趣标签
   */
  getCategory
}