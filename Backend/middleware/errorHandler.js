//global error handler
const errorHandler = (err, req, res, next) => {
    
    if(err.name === "ValidationError") {
       return res.status(400).json({
          isSuccess : false,
          response : err.message
       })
    }

    res.status(err.statusCode || 500).json({
        isSuccess : false,
        response : err.message
    })
}

export default errorHandler;