import HijabStyle from "../models/HijabStyle.js";

export const getAllHijabStyles = async (req, res) => {
  try {
    const styles = await HijabStyle.find({});
    res.status(200).json({
      success: true,
      status: 200,
      message: "All hijab styles fetched successfully",
      data: styles
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

export const createHijabStyle = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const style = await HijabStyle.create({ name, description, image });
    res.status(201).json({
      success: true,
      status: 201,
      message: "Hijab style created successfully",
      data: style
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
