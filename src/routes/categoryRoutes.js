/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manage product categories
 */

const express = require("express");
const Category = require("../models/Category");
const auth = require("../middlewares/auth");
const router = express.Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Add a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *               description:
 *                 type: string
 *                 description: A brief description of the category
 *     responses:
 *       201:
 *         description: Category successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The auto-generated ID of the category
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Error adding category
 *       500:
 *         description: Internal server error
 */
router.post("/", auth, async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: "Error adding category", error: err });
  }
});

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the category
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Error retrieving categories
 */
router.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving categories", error: err });
  }
});

module.exports = router;
