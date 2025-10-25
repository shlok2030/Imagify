import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";
import 'dotenv/config';
import jwt from "jsonwebtoken";


export const generateImage = async (req, res) => {
    try {
        // Use authenticated user id from middleware, not from request body
        const { prompt } = req.body;
        const userId = req.userId;

        if (!prompt || !userId) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // support both credit field names and guard against undefined
        const currentBalance = (typeof user.creditBalance !== 'undefined') 
            ? user.creditBalance 
            : (typeof user.credits !== 'undefined' ? user.credits : 0);

        if (currentBalance <= 0) {
            return res.status(400).json({ success: false, message: "Insufficient credits", creditBalance: currentBalance });
        }

        // Proceed with image generation logic
        const formData = new FormData();
        formData.append('prompt', prompt);

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
                ...formData.getHeaders?.()
            },
            responseType: 'arraybuffer'
        });

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;

        // Deduct one credit and persist
        const newBalance = currentBalance - 1;
        // update both possible fields to keep model consistent
        user.creditBalance = newBalance;
        if (typeof user.credits !== 'undefined') user.credits = newBalance;
        await user.save();

        // Return a consistent field name expected by frontend
        return res.json({
            success: true,
            message: "Image Generated",
            creditBalance: newBalance,
            image: resultImage,
            imageUrl: resultImage,   // duplicate so frontend can read imageUrl or image
            resultImage: resultImage
        });

    } catch (error) {
        console.error('generateImage error:', error);
        return res.status(500).json({ success: false, message: "Error generating image", error: error.message });
    }
};