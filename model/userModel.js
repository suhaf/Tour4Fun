const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const saltRounds = 10;

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true,' the user must have name'],
       
    },
    email: {
        type: String,
        required: [true, ' email address required'],
        unique: true,
        validate: [validator.isEmail, `Please enter the valid email address`]
    },
    roles: {
        type: String,
        enum: ['admin', 'guide', 'user'],
        default: 'user'
    },
    password: {
        type: String,
        required:[true, `password is required`],
        min: [8, `the length should be at least 8 characters`],
        lowercase: true,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, `u need to confirm password`],
        validate:{ 
        // this only works when new user is created or saved
          validator: function(el){
           return this.password === el;
          },
         message: `passwords dont match`
            
        }
    },
    passwordChangedAt:Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date

    
});

userSchema.pre('save', async function(next){
    // check if the password has been modified and run the rest of function if password is modified
    if(!this.isModified('password')) return next();

    // encrypt the password using bcrypt package
    this.password = await bcrypt.hash(this.password, saltRounds);

    // removing confirm password from database
    this.confirmPassword = undefined;
    next();
});
userSchema.pre('save', async function(next){
    // check if the password has not been modified or this is the new user then return from 
    if(!this.isModified('password') || this.isNew) return next();
    // update the passwordChangedAt property if the above is false
    this.passwordChangedAt = date.now() - 1000;
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
   
   const result = await bcrypt.compare(candidatePassword, userPassword);
   console.log(`candidatePassword: ${candidatePassword}  User Password : ${userPassword}`)
   return result;
}

userSchema.methods.passwordChangeCheck = function(jwtTimeStamp){
    if(this.passwordChangedAt){
      const dateToseconds = this.passwordChangedAt.getTime()/1000;
      console.log(dateToseconds, jwtTimeStamp)
      return dateToseconds > jwtTimeStamp
       
    }
    
    return false
}

userSchema.methods.sendPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken =
    crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log('reset token '+resetToken, 'passwordresetToken ' + this.passwordResetToken);
    this.passwordResetTokenExpires = Date.now() + 10 * 60 *1000;
    return resetToken;
}
    


const User = mongoose.model('User', userSchema);
//console.log(User.getIndexes);
module.exports = User;