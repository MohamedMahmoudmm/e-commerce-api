import categoryModel from "../models/categoryModel.js";
import {asyncHandler} from "../middleWare/errorHandler.js"

const createCategory =asyncHandler( async (req, res) => {

        const { cat_name, cat_desc } = req.body
        if (!cat_name) {
            return res.status(400).send({ status: "fail", message: "Category cat_name is required" })
        }

        const category = new categoryModel({ cat_name, cat_desc })
        await category.save()
        res.status(201).send({ status: "success", message: "Category created successfully", data: category })
   
})


const getAllCategories =asyncHandler(  async (req, res) => {
   
        const categories = await categoryModel.find()
        res.status(200).send({ status: "success", data: categories })
   
})

const updateCategory =asyncHandler(  async (req, res) => {
    
        const { id } = req.params
        const { cat_name, cat_desc } = req.body
        if (!cat_name && !cat_desc) {
            return res.status(400).send({ status: "fail", message: "Category cat_name and cat_description are required" })
        }
        const category = await categoryModel.findByIdAndUpdate(id, {...req.body}, { new: true })
        if (!category) {
            return res.status(404).send({ status: "fail", message: "Category not found" })
        }
        res.status(200).send({ status: "success", message: "Category updated successfully", data: category })
    
})

const deleteCategory =asyncHandler(  async (req, res) => {
   
        const { id } = req.params
        const category = await categoryModel.findByIdAndDelete(id)
        if (!category) {
            return res.status(404).send({ status: "fail", message: "Category not found" })
        }
        res.status(200).send({ status: "success", message: "Category deleted successfully" })
    
})

const categoryController = { createCategory, getAllCategories, updateCategory, deleteCategory }
export default categoryController;