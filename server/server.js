import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
await connectDB();


app.use('/api/users', userRouter);
app.use('/api/image', imageRouter);



app.get('/', (req, res) => {
    res.send('API Working ');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});