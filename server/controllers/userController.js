import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // check if user already exists
        const existing = await userModel.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
        res.json({success: true, token, user: { name: user.name } });
    } catch (error) {
        console.error('registerUser error:', error);
        // Handle duplicate key explicitly just in case
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        return res.status(500).json({ success: false, message: "Error registering user", error: error.message });
    }

};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        console.log(error);
        res.json({ message: "Error logging in user" });
    }

}; 

export const userCredits = async (req, res) => {
  try {
    // try multiple sources for userId
    let userId = req.body?.userId || req.params?.userId || req.user?.id || req.userId;

    // if still missing, try to decode Authorization: Bearer <token>
    if (!userId) {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded?.id || decoded?._id;
        } catch (err) {
          console.log('Invalid token', err);
          return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }
      }
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId required or provide Authorization header' });
    }

    const user = await userModel.findById(userId).select('name creditBalance');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, credits: user.creditBalance || 0, user: { name: user.name } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Error fetching user credits' });
  }
};