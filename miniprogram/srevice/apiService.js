const config = require('../utils/config')

/**
 * @const 本地错误码
 */
const localErrorCode = {
  /**
   * 微信 api 错误
   */
  requestAPIErrorCode: -10000,
  /**
   * 请求参数错误
   */
  requestParamsErrorCode: -20000,
  /**
   * 请求超过限制
   */
  requestExceedErrorCode: -30000,
}



/**
 * Http请求
 * @param {Object} req 请求参数 { url, method, header, data, dataType, success, fail, complete }
 */
function request(req) {
  if (!req.header) {
    req.header = {};
  }
  req.header = appendHeader(req.header);
  if (!req.method) {
    req.method = "GET"
  }
  const requestTask = wx.request({
    url: req.url,
    method: req.method,
    header: req.header,
    data: req.data,
    dataType: req.dataType,
    success: function(resp) {
      const httpStatusCode = resp.statusCode;
      if (200 <= httpStatusCode && httpStatusCode < 300) { // http请求成功
        const responseData = resp.data;
        if (responseData.message === 'OK') { // 业务逻辑返回成功
          if (req.success) {
            req.success(responseData);
          }
          printRequestSuccessedInfo(req);
        } else { // 业务逻辑返回失败
          let errorMessage = `操作失败(${errcode})`;
          if (req.method === "GET") {
            errorMessage = `获取失败(${errcode})`;
          }
          const error = {
            message: errorMessage,
            code: errcode,
          }
          if (req.fail) {
            req.fail(error);
          }
          printRequestFailedInfo(req, error, resp.err_msg);
        }
      } else { // http请求失败
        const error = {
          message: `网络错误(${httpStatusCode}),请稍后重试`,
          code: httpStatusCode,
        }
        if (req.fail) {
          req.fail(error);
        }
        printRequestFailedInfo(req, error, `Http Error ${httpStatusCode}`);
      }
    },
    fail: function(err) { // request接口调用失败
      const error = {
        message: "请求错误,请重试",
        code: localErrorCode.requestAPIErrorCode,
      }
      if (err.errMsg === "request:fail abort") {
        error.message = "请求频繁,请稍后";
        error.code = localErrorCode.requestExceedErrorCode;
      }
      if (req.fail) {
        req.fail(error);
      }
      printRequestFailedInfo(req, error, err.errMsg);
    },
    complete() {
      // const index = requestQueue.indexOf(requestTask);
      // requestQueue.splice(index, 1);
      if (req.complete) {
        req.complete()
      }
    }
  });
  return requestTask;
}

function appendHeader(header) {
  if (!header["content-type"]) {
    header["content-type"] = "application/json";
  }
  header["Authorization"] = config.token;
  return header;
}

function printRequestSuccessedInfo(request) {
  if (!request.hiddenLog) {
    console.log(`【Request】[${request.method}] ${request.url}`);
    if (request.data) {
      console.log("【Request】[body]", request.data);
    }
    console.log("【Request】请求成功");
  }
}

function printRequestFailedInfo(request, error, serverMessage) {
  if (!request.hiddenLog) {
    console.log(`【Request】[${request.method}] ${request.url}`);
    console.log(`【Request】code: ${error.code}, message: ${error.message}`);
    if (serverMessage) {
      console.log(`【Request】serverMessage: ${serverMessage}`);
    }
    console.log(`【Request】${(serverMessage)?'业务错误':'请求失败'}`);
  }
}


module.exports = {
  request
}