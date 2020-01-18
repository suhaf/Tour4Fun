class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode.toString().startsWith('4')? 'fail' : 'error'
        this.isOperational = true;
        
        console.log(this.status);

    }
    
}

module.exports = AppError;