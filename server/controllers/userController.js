const User = require("../models/Usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Please Give All Details!",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match!",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(402).json({
        success: false,
        message: "User Already Registered!",
      });
    }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Error In Hashing Password!",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      confirmPassword,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${name}`,
    });

    return res.status(200).json({
      success: true,
      message: "User Registered SuccessFully!",
      User: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error While Creating User!",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Please Give All Details!",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(403).json({
        success: false,
        message: "User Not Registered.Signup First!",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Password Not Matched. Try Again!",
      });
    }

    const payload = {
      id: existingUser._id,
      email: existingUser.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        expires:new Date(Date.now() + 6 * 60 * 60 * 1000)
      })
      .json({
        success: true,
        message: "User LoggedIn SuccessFully!",
        token,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error While Logging User!",
      error: error.message,
    });
  }
};
