import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
const currentDir = path.dirname(fileURLToPath(import.meta.url));

import passport from "passport";
import './config/passportGoogle.js';
passport.initialize();

// const morgan = require('morgan');
// const productRoutes = require('./routes/productRouter');
import CategoryRouter from "./routes/categoryRouter.js";
import UserRouter from "./routes/userRouter.js"; 
import ProductRouter from "./routes/productRouter.js";
import ErrorHandler from "./middlewares/errorHandler.js";
import AuthRouter from "./routes/authRouter.js";

const app = express();

app.use('/api/images', express.static(path.join(currentDir, '..', 'public', 'images')));
app.use(cors());
// app.use(morgan('dev'));
app.use(express.json({limit: '5mb'})); // parse the {req.body} of requests
// app.use('/api/products', productRoutes);
app.use('/api/categories', CategoryRouter);
app.use('/api/users', UserRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/products', ProductRouter);
app.use(ErrorHandler);

export default app;
