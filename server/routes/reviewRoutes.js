import express from "express";
import { getReviewsByStyle, addReview } from "../controllers/reviewController.js";
import { updateReview, deleteReview } from "../controllers/reviewController.js";
import { middlewareToProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all reviews (with hijabStyle id in each review)
import { getAllReviews } from "../controllers/reviewController.js";
router.get("/", getAllReviews);
// Get reviews for a specific style
router.get("/:styleId", getReviewsByStyle);
// Add a review
router.post("/:styleId", middlewareToProtect, addReview);
// Edit a review
router.put("/edit/:reviewId", middlewareToProtect, updateReview);
// Delete a review
router.delete("/delete/:reviewId", middlewareToProtect, deleteReview);

export default router;
