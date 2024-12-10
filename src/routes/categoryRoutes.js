const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

//Add category
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = new Category({ name, description });
    category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: "Error adding category", error: err });
  }
});

module.exports = router;
