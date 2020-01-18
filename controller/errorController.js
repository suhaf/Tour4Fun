const AppError = require('./../util/AppError')

const handleCastError = (err)=>{
   const message = `requested path ${err.path} with value ${err.value} is not available`;
   return new AppError(message, 404)

}
const handleDuplicateError = (err)=>{
    let errHolder = '';
    let rs;
    let duplicateTourString = err.errmsg;
    let rx = /(["'])(\\?.)*?\1/
    if(duplicateTourString.indexOf('null') === -1){
        console.log(duplicateTourString)
         rs = duplicateTourString.match(rx)[0]
         console.log(rs)
    }
   
   // console.log(rs[0]);
    duplicateTourString.indexOf('user') === -1 ? errHolder = 'tour' : errHolder ='user'

    const message = `${errHolder} with name ${rs} already exits`
    return new AppError(message, 404);
}

const handleValidationError = (err)=>{

    const message = err.message
    return new AppError(message, 404)
}
const handleTokenExpiredError = (err)=>{
    const message = err.message;
    return new AppError(message, 401)
}



const devErrorHandler = (err, res) => {
    res.status(err.statusCode).json({
        origin:' from the development',
        status: err.status,
        message: err,
        name: err.name,
        code: err.statusCode,
        stack: err.stack
    });
}

const prodErrorHandler = (err, res)=>{
// Operational Error Trusted : message sent to the client
    if(err.isOperational){
        res.status(err.statusCode).json({
            message: `Error from production `,
            status: 404,
            error: err.message
        });
    }
// Programming or other unknown error: dont leak error details to the client
    else{
// 1. Logging error to the console for reference
        console.log(err)
// 2. sending generic message to the client
        res.status(500).json({
            err: err,
            message: 'something went wrong',
            status: 500,
        });
    }
    
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        devErrorHandler(err, res);
    return

    }else if (process.env.NODE_ENV === 'production') {
        let error = {...err}
        if(error.name === 'CastError'){
            error = handleCastError(error);
        }
        if (error.code === 11000){
            error = handleDuplicateError(error);
        }
        if (error.name ==='ValidationError'){
            error = handleValidationError(error)
        }
        if (error.name ==='TokenExpiredError'){
            error = handleTokenExpiredError(error)
        }

    prodErrorHandler(error, res);
    }

};

   
     
     
