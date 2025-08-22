import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
         type: String,
         required: true,
        minlength: 3,
        maxlength: 20
        },
    email: {
         type: String,
         unique: true,
         required: true,
        },
    password: {
         type: String,
         required: true,
        minlength: 8
        },
    age: {
            type: Number,
            required: true,
            min:5,
            max:60
        },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    role: { type: String, enum: ["user", "admin"], default: "user" }  ,
    token: { type: String } 
},
{   
    timestamps: true,   // createdAt and updatedAt
    versionKey: false
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
