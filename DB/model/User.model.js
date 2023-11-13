
import { Schema, Types, model } from "mongoose";


const userSchema = new Schema({

    name: {
        type: String,
        required: [true, 'userName is required'],//lw hwa md5lho4 hytl3 al error dh
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'email is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    image: {type:Object},
    DOB: Date, //date of birth 
    code:{
        type:String,
        min: [6, 'Code Length must not exceed 6'],
        max: [6, 'Code Length must not exceed 6']

    },
    favorites:[{
        type:Types.ObjectId,
        ref:'Product'

    }

    ]
       
    
}, {
    timestamps: true
})


const userModel = model('User', userSchema)
export default userModel