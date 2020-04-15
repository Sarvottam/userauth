
global._handleResponse = function (req, res, err, response) {
	// logger.info(response);
	if (err) {
        return res.status(err.statusCode || 400).json({
            status: 'error',
            ok: false,
            code: err.code || "BadRequest",
            message: err.message || err,
            result: ""
        })
    }
    return res.status(200).json({
        status: 'success',
		ok: true,
		code: 200,
		message: '',
		result: response,
    })
};


// const asyncResponse = function (callbackFunc, err, data) {
// 	if (typeof callbackFunc === 'function') {
// 		callbackFunc(err, data);
// 	}
// 	if (err) {
// 		return Promise.reject(err);
// 	}
// 	return Promise.resolve(data);
// };

// module.exports = {
// 	asyncResponse,
// 	handleResponse
// }



