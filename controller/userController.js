//const express = require('express');
const User = require('./../model/userModel');
const catchAsync = require('./../util/catchAsync')



getAllusers = (req, res) => {
    res.json({
        status: 500,
        message: 'route not yet defined'
    });
}
getUser = (req, res) => {
    res.json({
        status: 500,
        message: 'route not yet defined'
    });
}
createUser = (req, res) => {
    res.json({
        status: 500,
        message: 'route not yet defined'
    });
}
deleteUser = (req, res) => {
    res.json({
        status: 500,
        message: 'route not yet defined'
    });
}

module.exports = {
    getAllusers,
    getUser,
    createUser,
    deleteUser,
   
}
