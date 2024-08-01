import express from 'express';
import mongoose from 'mongoose';
const cloudinary = require('cloudinary').v2;
import bookRoutes from './routes/bookRoute';


//DotEnv
require('dotenv').config();


//Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:  process.env.CLOUDINARY_API_SECRET
});


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes for the API
app.use('/api', bookRoutes);

// Connect to MongoDB using mongoose
process.env.PORT
mongoose.connect(`${process.env.MONGODB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully on Atlas'))
.catch(err => console.log(err));

export default app;
