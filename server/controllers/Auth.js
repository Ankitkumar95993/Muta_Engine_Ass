const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const axios = require('axios');

const jwt = require("jsonwebtoken");

require("dotenv").config();

// Signup Controller for Registering USers

exports.signup = async (req, res, next) => {
    try {
        // Destructure fields from the request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            captchaValue,
        } = req.body;

        // Check if All Details are there or not
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !captchaValue
        ) {
            return res.status(403).send({
                success: false,
                message: "All Fields are required",
            });
        }

        // Verify reCAPTCHA
        const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY; // Store this in your environment variables
        const recaptchaResponse = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${captchaValue}`
        );

        if (!recaptchaResponse.data.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid reCAPTCHA. Please try again.",
            });
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Password and Confirm Password do not match. Please try again.",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        let approved = accountType === "Instructor" ? false : true;

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};

// Login controller for authenticating users

exports.login = async (req, res, next) => {
	try {
		// Destructure email, password, and captchaValue from request body
		const { email, password, captchaValue } = req.body;

		// Check if email, password, or captchaValue is missing
		if (!email || !password || !captchaValue) {
			return res.status(400).json({
				success: false,
				message: "Please fill in all the required fields",
			});
		}

		// Verify reCAPTCHA
		const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY; // Store this in your environment variables
		const recaptchaResponse = await axios.post(
			`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${captchaValue}`
		);

		if (!recaptchaResponse.data.success) {
			return res.status(400).json({
				success: false,
				message: "Invalid reCAPTCHA. Please try again.",
			});
		}

		// Find user by email
		const user = await User.findOne({ email });

		// If user not found
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User is not registered with us. Please sign up to continue.",
			});
		}

		// Compare password with hashed password in the database
		if (await bcrypt.compare(password, user.password)) {
			// Generate JWT token
			const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);

			// Save token to user document and return success response
			user.token = token;
			user.password = undefined;

			// Set cookie options and return response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
				httpOnly: true,
			};
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: "User login successful",
			});
		} else {
			// If password is incorrect
			return res.status(401).json({
				success: false,
				message: "Password is incorrect",
			});
		}
	} catch (error) {
		console.error(error);
		// Handle server errors
		return res.status(500).json({
			success: false,
			message: "Login failure, please try again",
		});
	}
};


exports.google = async(req,res,next)=>{
	try{
	  const user = await User.findOne({email:req.body.email});
	  if(user)
	  {
		const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
		const {password:pass, ...rest}=user._doc;
		res.cookie('access_token',token,{httpOnly:true})
		.status(200)
		.json(rest);
  
	  }else{
		const generatePassword = Math.random().toString(36).slice(-8) +  Math.random().toString(36).slice(-8);
		const hashedPassword = bcrypt.hashSync(generatePassword,10);
		const newUser = new User({username:req.body.name.split(" ").join("").toLowerCase()+ Math.random().toString(36).slice(-4),
		password:hashedPassword,email:req.body.email,avatar:req.body.photo});
		await newUser.save();
		const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
		const {password:pass,...rest} = newUser._doc;
		res.cookie('access_token',token,{httpOnly:true})
		.status(200).json(rest);
	  }
  
	}catch(error){
	  next(error);
	}
  }
  


  