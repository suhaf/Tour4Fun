const User = require('./../model/userModel');
const jwt = require('jsonwebtoken')
const catchAsync = require('./../util/catchAsync')
const AppError = require('./../util/AppError')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const {promisify} = require('util')
const sendEmail = require('./../util/email')

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    // generate the token
    const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN})
   
    res.json({
        status: 200,
        token,
        message: 'user created',
        newUser
    });

});

exports.login = catchAsync(async(req, res, next)=>{
    const{email, password} = req.body // usinf destructor method to get emal and password from the body
// check if email and password is provided
// if(!email || !password){
//     return next(new AppError('Please provide email and password', 400))
// }
// check if user exists and the password is correct
const user = await User.findOne({email}).select('+password')//select will help to include hidden password field
//console.log(user.password +' ' + password)
const passwordTest = 'password'
const match = await user.correctPassword(passwordTest, user.password);
console.log(match);

//console.log(`${compare} password entered - ${password} and actual password ${user.password}`)
 
if (!user ||  !match){  
 return  next(new AppError('user or password dont match', 400))
}


const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN
    })
//login the user and send the tokem
    res.json({
            status: 200,
            token,
            logged_in_User: user,
            
        });

});

exports.checkAccess = catchAsync (async(req, res, next)=>{
  // console.log(req.headers)
 //1) check and get the token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('bearer')){
        token = req.headers.authorization.split(' ')[1];
        //console.log(token)
    }  
    if(!token){ 
      return next(new AppError('you are not logged in', 401))
    }
//2) token verification
     let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
   // console.log(decoded)
//3) verify if the user still exists ( we can get id of user from the decoded.id)
     const validUser = await User.findById(decoded.id)
     if(!validUser){
            return next(new AppError('user with the token given does not exist', 401));
        }

//4) check if the password has been changed after token issued
      if(validUser.passwordChangeCheck(decoded.iat)){
          return next (new AppError('password has been changed', 401))
      }
   
 // grant access to the protected route
    req.user = validUser // saving user for the next middleware function
    next();
});

exports.rightToDelete = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.roles)){
            return next(new AppError('you are not authorized to delete the route', 403))
        }
        next();
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {

    //1) check by email if user exists
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new AppError('the user with the given email does not exist', 400))
    }
    //2) generate random reset token
   const resetToken =  user.sendPasswordResetToken();
   user.save({validateBeforeSave: false})// saving the password reset token in the DB and turning validation for email and password off
   
   //3) send token to the user through email
    const resetUrl = `${req.protocol}://${req.get('host')}
                    /app/v1/users/resetpassword/${resetToken}`
    const message = `Go through the link ${resetUrl} to change the password`
    const subject = `Password Reset`

   try{
       await sendEmail({
           email: user.email,
           subject,
           message
       });

   }catch(err){
       user.sendPasswordResetToken = undefined;
       user.passwordResetTokenExpires = undefined;
       console.log(err.message)
       next(new AppError('something went wrong, try to reset again'), 500)
   }

    res.json({
        status: 200,
        message: ` email has been send to the address ${user.email}`
       
    });


});

exports.resetPassword = catchAsync(async (req, res, next)=>{

    //1) get the token from the user and hash it to compare to the token in database
    let hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    //2) query if the user in the database using hashedToken in search field & verify if the token is expired
    let user = await User.findOne({ passwordResetToken: hashedToken, 
         passwordResetTokenExpires: { $gt: Date.now()} });
    // if user doesnt exist return error

    if(!user) {
        return next(new AppError('The user with the token does not exist', 500))
    }  
   
    //3) change the password 
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    //4) update the paswordChangedAt property - this is done in user model in pre save middleware
  

    // generate login token

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN
    })
    //login the user and send the tokem
    res.json({
        status: 200,
        token,
        logged_in_User: user,

    });

});

exports.updatePassword = catchAsync(async (req, res, next)=>{

//1. get the user from the database

    const user = await User.findById(req.user.id).select('+password');
    

//2. compare the user password in the body to that in the database
    if (! await user.correctPassword(req.body.password, user.password)) {
        console.log(`Password: ${req.body.password}  Stored Password : ${user.password}`) 
        return next(new AppError('user or password dont match', 400))
    }

//3. update the password 
    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmPassword;

//4. login the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN
    })
    res.json({
        status: 200,
        token,
        logged_in_User: user,

    });
});

//module.exports = signup;