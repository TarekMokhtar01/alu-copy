import { body } from "express-validator";

const allowedCategories = [
  "Eau de Parfum",
  "Eau de Toilette",
  "Eau de Cologne",
  "Perfume Oil",
  "Body Mist",
  "Gift Set",
  "Unisex",
  "Miniature",
];

export const createPerfumeValidator = [
  body("name").notEmpty().withMessage("Perfume name is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(allowedCategories)
    .withMessage(`Category must be one of: ${allowedCategories.join(", ")}`),
];

export const updatePerfumeValidator = [
  body("name").optional().notEmpty().withMessage("Perfume name cannot be empty"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("category")
    .optional()
    .isIn(allowedCategories)
    .withMessage(`Category must be one of: ${allowedCategories.join(", ")}`),
];
