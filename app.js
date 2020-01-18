const express = require('express');
const app = express();
app.use(express.json());


const AppError = require('./util/AppError')
const globalErrorHandler = require('./controller/errorController')

const tourRouter = require('./router/tourRouter');
const userRouter = require('./router/userRouter');

//console.log(process.env.NODE_ENV)
//console.log(process.env)
if (process.env.NODE_ENV === 'development') {
    console.log('in the development')
}else if(process.env.NODE_ENV ==='production'){
    console.log('in the production')
}
//const morgan = require('morgan');

//app.use(morgan('dev'));

// app.get('/', (req, res)=>{
//     res.json({
//         welcome: 'this is the home page',
//         message: __dirname
//     });
// });
//const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`));

//tourRouter = express.Router();
//userRouter = express.Router();

// app.get('/app/v1/tours', getAlltours);
// app.get('/app/v1/tours/:id', getTour);
// app.delete('/app/v1/tours/:id', deleteTour);       ---  <= same as below
// app.post('/app/v1/tours', createTour);

app.use('/app/v1/tours', tourRouter); // mounting router
app.use('/app/v1/users', userRouter);
// we can use app.all also instead - this is for all the unknown routes
app.all('*', (req, res, next)=>{
    const err = new AppError(`the requested path ${req.originalUrl} is not found`, 404);
    // err.status = 'Fail';
    // err.statusCode = 404;
    next(err)   
});

app.use(globalErrorHandler)


module.exports = app;




