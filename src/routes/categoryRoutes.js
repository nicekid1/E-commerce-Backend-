const express = require("express");
const Category = require("../models/Category");
const auth = require("../middlewares/auth");
const router = express.Router();

//Add category
router.post('/',auth, async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: "Error adding category", error: err });
  }
});

//Get all categories
router.get('/',auth, async(req, res)=>{
  try {
    const categories = await Category.find()
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving categories', error: err });
  }
})
module.exports = router;
