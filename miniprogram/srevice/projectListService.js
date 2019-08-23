const apiService = require('../srevice/apiService')
const config = require('../utils/config')

function getProjectList({
  id,
  page,
  success: success,
  fail: fail
}) {
  const q = {
    id,
    page
  }
  apiService.request({
    url: `${config.apiBaseUrl}/category/projects?q=${JSON.stringify(q)}`,
    success(res) {
      success(res)
    },
    fail: fail
  })
}

module.exports = {
  /**
   * 获取兴趣标签
   */
  getProjectList
}