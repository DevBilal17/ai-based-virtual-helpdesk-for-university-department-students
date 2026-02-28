

const response = (res,statusCode = 200,success = true,message = "",data = null) => {
    return res.status(statusCode).json({
        statusCode : statusCode,
        success,
        message,
        data
    })
}

module.exports = response;