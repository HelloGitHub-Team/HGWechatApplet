/**
 * 文字提示框
 * @param {!string} title 标题
 * @param {?Function=} cb 提示框消失时的回调函数
 * @param {?number=} seconds 提示框持续的时间，单位（秒）
 */
function showTextToast(title, seconds, cb ) {
    showToast({
        title: title,
        icon: 'none',
        mask: true,
        callback: cb,
        seconds: seconds
    })
}

/**
 * 加载提示框
 * @param {!string} title 标题
 * @param {?Function=} cb 提示框消失时的回调函数
 * @param {?number=} seconds 提示框持续的时间，单位（秒）
 */
function showLoadingToast(title, cb, seconds) {
    showToast({
        title: title,
        icon: 'loading',
        mask: true,
        callback: cb,
        seconds: seconds
    })
}

/**
 * 成功提示框
 * @param {!string} title 标题
 * @param {?Function=} cb 提示框消失时的回调函数
 * @param {?number=} seconds 提示框持续的时间，单位（秒）
 */
function showSuccessToast(title, cb, seconds) {
    showToast({
        title: title,
        icon: 'success',
        mask: false,
        callback: cb,
        seconds: seconds
    })
}

/**
 * 错误提示框
 * @param {!string} title 标题
 * @param {?Function=} cb 提示框消失时的回调函数
 * @param {?number=} seconds 提示框持续的时间，单位（秒）
 */
function showErrorToast(title, cb, seconds) {
    showToast({
        title: title,
        // image: '../../images/base/base-toast-error.png',
        icon: 'none',
        mask: true,
        callback: cb,
        seconds: seconds
    })
}

/**
 * 文字提示框
 * @param title 标题
 * @param icon 图标
 * @param image 图片，会替换图标
 * @param mask 蒙层
 * @param callback 提示框消失时的回调函数
 * @param seconds 提示框持续的时间，单位（秒）
 */
function showToast({
    title: title,
    icon: icon,
    image: image,
    mask: mask,
    callback: callback,
    seconds: seconds
}) {
    if (!title) {
        if (callback) {
            callback()
        }
        return;
    }
    if (!seconds) {
        seconds = 1.7;
    }
    wx.showToast({
        title: title,
        icon: icon,
        image: image,
        mask: mask,
        duration: seconds * 1000
    });
    setTimeout(function () {
        if (callback) {
            callback()
        }
    }, seconds * 1000);
}

module.exports = {
    /**
     * 文字提示框
     * @param {!string} title 标题
     * @param {?Function=} cb 提示框消失时的回调函数
     * @param {?number=} seconds 提示框持续的时间，单位（秒）
     */
    showTextToast: showTextToast,
    /**
     * 加载提示框
     * @param {!string} title 标题
     * @param {?Function=} cb 提示框消失时的回调函数
     * @param {?number=} seconds 提示框持续的时间，单位（秒）
     */
    showLoadingToast: showLoadingToast,
    /**
     * 成功提示框
     * @param {!string} title 标题
     * @param {?Function=} cb 提示框消失时的回调函数
     * @param {?number=} seconds 提示框持续的时间，单位（秒）
     */
    showSuccessToast: showSuccessToast,
    /**
     * 错误提示框
     * @param {!string} title 标题
     * @param {?Function=} cb 提示框消失时的回调函数
     * @param {?number=} seconds 提示框持续的时间，单位（秒）
     */
    showErrorToast: showErrorToast
}