import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    cat_name: {
         type: String,
         required: true,
        minlength: 2,
        },
    cat_desc: { 
        type: String 
    } 
},
{   
    versionKey: false
});

const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;
