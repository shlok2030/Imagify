import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";
import 'dotenv/config';
import jwt from "jsonwebtoken";


export const generateImage = async (req, res) => {
    try {
        const { userId, prompt} = req.body;

        const user = await userModel.findById(userId);

        if (!user || !prompt) {
            return res.status(404).json({ success: false, message: "Missing Details" });
        }

        if(user.credits === 0 || user.credits < 0) {
            return res.status(403).json({ success: false, message: "Insufficient credits", creditBalance: user.creditBalance});
        }


        // Proceed with image generation logic here
        const formData = new FormData();
        formData.append('prompt', prompt);

        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType: 'arraybuffer'
        });

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;

        await userModel.findById(user._id, {creditBalance: user.creditBalance - 1});

        res.json({ success: true, message:"Image Generated", creditBalance: user.creditBalance - 1, image: resultImage  });
        

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error generating image" });
    }
};