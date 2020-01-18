const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('./../../model/tourModel');

// const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`, 'utf-8')) 
// const db = process.env.DATABASE
//     .replace('<password>', process.env.DATABASE_PASSWORD);

// mongoose
//     .connect(db, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: false,
//         useUnifiedTopology: true
//     })
//     .then
//     (() => { console.log('MongoDB connected... from import-data') })
//     .catch(err => console.log('couldnt connect'));



const importData = async()=>{
try{
    await Tour.create(tours)
    console.log(`wow data imported`)
}catch(err){
    console.log(`${err} oops couldnt import`)
}
   
};

const deleteData = async()=>{
try{
    await Tour.deleteMany()
    console.log(`data is deleted`);
}catch(err){
    console.log(`coudnt delete`)
}

};

if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}




//console.log(process.argv);