// Get all reviews (with hijabStyle id in each review)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate("user", "username");
    res.status(200).json({
      success: true,
      status: 200,
      message: "All reviews fetched successfully",
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server error",
      error: error.message
    });
  }
};
// Edit (update) a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text, rating } = req.body;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Review not found"
      });
    }
    // Optionally: Only allow the user who wrote the review to update
    // if (req.user.id !== review.user.toString()) {
    //   return res.status(403).json({ success: false, message: "Unauthorized" });
    // }
    review.text = text;
    review.rating = rating;
    await review.save();
    // Update average rating for the hijab style
    const reviews = await Review.find({ hijabStyle: review.hijabStyle });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await HijabStyle.findByIdAndUpdate(review.hijabStyle, { averageRating: avgRating.toFixed(1) });
    res.status(200).json({
      success: true,
      status: 200,
      message: "Review updated successfully",
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server error",
      error: error.message
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Review not found"
      });
    }
    // Optionally: Only allow the user who wrote the review to delete
    // if (req.user.id !== review.user.toString()) {
    //   return res.status(403).json({ success: false, message: "Unauthorized" });
    // }
    const hijabStyleId = review.hijabStyle;
    await review.deleteOne();
    // Update average rating for the hijab style
    const reviews = await Review.find({ hijabStyle: hijabStyleId });
    let avgRating = 0;
    if (reviews.length > 0) {
      avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    }
    await HijabStyle.findByIdAndUpdate(hijabStyleId, { averageRating: avgRating.toFixed(1) });
    res.status(200).json({
      success: true,
      status: 200,
      message: "Review deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server error",
      error: error.message
    });
  }
};
import Review from "../models/Review.js";
import HijabStyle from "../models/HijabStyle.js";

export const getReviewsByStyle = async (req, res) => {
  try {
    const { styleId } = req.params;
    const reviews = await Review.find({ hijabStyle: styleId }).populate("user", "username");
    res.status(200).json({
      success: true,
      status: 200,
      message: "Reviews fetched successfully",
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server error",
      error: error.message
    });
  }
};

export const addReview = async (req, res) => {
  try {
    const { styleId } = req.params;
    const { text, rating } = req.body;
    const userId = req.user.id; // JWT se milta hai

    const review = await Review.create({ hijabStyle: styleId, user: userId, text, rating });

    // Average rating update
    const reviews = await Review.find({ hijabStyle: styleId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await HijabStyle.findByIdAndUpdate(styleId, { averageRating: avgRating.toFixed(1) });

    res.status(201).json({
      success: true,
      status: 201,
      message: "Review added successfully",
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Server error",
      error: error.message
    });
  }
};
