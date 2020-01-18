const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });



/* DATABASE CONNECTION */
// console.log(`${process.env.DATABASE_PASSWORD}  ${process.env.DATABASE}`);
const db = process.env.DATABASE
    .replace('<password>', process.env.DATABASE_PASSWORD);
//console.log(db);
// const db = 'mongodb+srv://shadan:<PASSWORD>@tour4fun-pawzx.mongodb.net/Natours?retryWrites=true&w=majority'
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then
    (() => { console.log('MongoDB connected...') })
    .catch(err => console.log(err.message, 'couldnt connect'));
// creating Schema
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, ' the tour must have name'],
        unique: [true, 'tour already present']
    },
    price: {
        type: Number,
        required: [true, 'tour must have price']
    },
    rating: {
        type: Number,
        default: 4,
        max: [5, 'rating cant be above 5']

    },
    duration: {
        type: Number
    },
    maxGroupSize: {
        type: Number,
        required: [true, `tour must have group size`]
    },
    difficulty: {
        type: String,
    },
    summary:{
        type: String
    },
    images: {
        type: [String]
    },
    startDates: {
        type: [Date]
    },
    description: {
        type: String
    }

});
// creating model

const Tour = mongoose.model('Tour', tourSchema);
// using model for data CRUD

module.exports = Tour;


