import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        maxLength :30
    },
    password: {
        type:String,
        required:true,
        minLength: 6 
    },
    name:{
        type:String,
        required:true,
        maxLength: 50
    }
});

const User = mongoose.model('User',userSchema);

export default User;