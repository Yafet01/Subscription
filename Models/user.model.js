import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    name:{
    type: String, 
    required: [true,'Username is required'],
    trimn:true,
    minLength:4,
    maxLength:30
},
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        trim: true,
        match:[/\S+@\S+\.\S+/,'Please fill a valid email address'],
    },
    password:{
        type: String,
        required:[true,'Password is required'],
        minLength:6
    }
}, {timestamps:true} );

const User =mongoose.model('User',userSchema);

export default User;
