const User = require("../models/Usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { redis } = require("../config/redisConnection");
const otpGenerator = require('otp-generator');
const { sendMail } = require("../utils/mailSender");

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

const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Error In Hashing Password!",
      });
    }

    const userDetails = JSON.stringify({
      name,
      email,
      password: hashedPassword,
      confirmPassword,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${name}`,
      Otp:otp
    });
    await sendMail(
  email,
  "Your Tasko OTP Verification Code",
  `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #4CAF50;">👋 Welcome to Tasko!</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for signing up with <strong>Tasko</strong>. To complete your registration, please use the following One-Time Password (OTP):</p>
    
    <div style="background-color: #f2f2f2; padding: 16px; text-align: center; font-size: 24px; font-weight: bold; color: #111; letter-spacing: 2px; border-radius: 8px; margin: 20px 0;">
      ${otp}
    </div>

    <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone for security reasons.</p>
    
    <p>If you didn't request this, you can safely ignore this email.</p>
    
    <p>Regards,<br/>Team Tasko</p>
    <hr/>
    <small style="color: #777;">Tasko Inc. | tasko.io | All rights reserved</small>
  </div>
  `
);


    await redis.setex(`user-${email}`,300,userDetails);

    // const newUser = await User.create({
    //   name,
    //   email,
    //   password: hashedPassword,
    //   confirmPassword,
    //   image: `https://api.dicebear.com/9.x/initials/svg?seed=${name}`,
    // });

    return res.status(200).json({
      success: true,
      message: "User Details Cached Verify Email Now!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error While Caching User Before Validation!",
      error: error.message,
    });
  }
};

exports.verifyAndCreate = async(req,res) => {
  try {
    const {email,Otp} = req.body;
    if(!email || !Otp){
      return res.status(400).json({
        success:false,
        message:"Please Provide All Details!"
      });
    }
    const userDetails = await redis.get(`user-${email}`);
    if(!userDetails){
      return res.status(403).json({
        success:false,
        message:"Otp Expired!"
      });
    }
    if(Otp !== userDetails.Otp){
      return res.status(403).json({
        success:false,
        message:"Invalid Otp!"
      });
    }


    const { otp, ...userPayload } = userDetails;

    const newUser = await User.create(userPayload);
    await redis.del(`user-${email}`)

    return res.status(201).json({
      success:true,
      message:"User Created SuccessFully!",
      newUser:newUser
    });
  } catch (error) {
    return res.status(501).json({
      success:false,
      message:"Error While User Creation!",
      error:error.message
    });
  }
}

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
//acess Token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

//refresh Token
const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
      expiresIn: "5d",
    });

 res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
});

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
});

      .json({
        success: true,
        message: "User LoggedIn SuccessFully!",
        AccessToken:accessToken,
        RefreshToken:refreshToken
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error While Logging User!",
      error: error.message,
    });
  }
};

exports.TokenRefresh = async(req,res) => {
  try{
const {refreshToken} = req.cookies;
if(!refreshToken){
  return res.status(400).json({
    success:false,
    message:'Refresh Token Expired. Kindly login again.'
  });
}

const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
if(!decoded){
return res.status(403).json({
  success:false,
  message:"Refresh Token Not Valid!"
});
}
const payload = {
  id: decoded.id,
  email: decoded.email
};
 const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

     return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        expires:new Date(Date.now() + 2 * 60 * 60 *1000),
        sameSite: "None"
      }).json({
        success:true,
        message:"Access Token Refreshed Successfully!"
      });

  }catch(error){
return res.status(501).json({
  success:false,
  message:"Error Occuerde While Refreshing Token!",
  error:error.message
})
  }
}

exports.IsUser = async(req,res) => {
  try {
    
    const {id} = req.user;
    if(!id){
        return res.status(400).json({
      success:false,
      message:"User Not Authenticated!",
      error:error.message
    });
    }

    const UserDetails = await User.findById(id).populate('tasks')
    if(!UserDetails){
        return res.status(400).json({
      success:false,
      message:"User Not Found!",
      error:error.message
    });
    }

    return res.status(200).json({
      success:true,
      message:"User Found Sucessfully!",
      user:UserDetails
    });
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"error While Getting User!",
      error:error.message
    });
  }
}
