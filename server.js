const dotenv = require('dotenv');
dotenv.config({path:'./config.env'})

const app = require('./app');

//console.log(process.env);

app
    .listen(8000, ()=>{
        console.log('Server is running')
    });