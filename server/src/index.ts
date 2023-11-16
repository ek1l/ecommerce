import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { userRouter } from './routes/user';
import { productRouter } from './routes/product';

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());
app.use('/user', userRouter);
mongoose.connect(
  'mongodb+srv://ek1l:ecommercepassword@ecommerce.uxtv90e.mongodb.net/ecommerce?retryWrites=true&w=majority',
);
app.use('/product', productRouter);
app.listen(port, () => {
  console.log(`SERVER STARTED FROM PORT: ${port}`);
});
