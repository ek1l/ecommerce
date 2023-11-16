import { Router, Request, Response } from 'express';
import { ProductModel } from '../models/product';
import { verifyToken } from './user';
import { UserModel } from '../models/user';
import { ProductErrors, UserErrors } from '../errors';

const router = Router();

router.get('/', verifyToken, async (_, res: Response) => {
  try {
    const products = await ProductModel.find({});
    res.json({ products });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post('/checkout', verifyToken, async (req: Request, res: Response) => {
  const { customerID, cartItems } = req.body;
  try {
    const user = await UserModel.findById(customerID);
    const productsIDs = Object.keys(cartItems);
    const products = await ProductModel.find({ _id: { $in: productsIDs } });
    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }
    if (products.length !== productsIDs.length) {
      return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
    }
    let totalPrice = 0;
    for (const item in cartItems) {
      const product = products.find((product) => String(product._id) === item);
      if (!product) {
        return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
      }
      if (product.stockQuantity < cartItems[item]) {
        return res.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK });
      }
      totalPrice = Number(
        (totalPrice + product.price * cartItems[item]).toFixed(2),
      );
    }
    if (user.availableMoney < totalPrice) {
      return res.status(400).json({ type: ProductErrors.NO_AVAILABLE_MONEY });
    }
    user.availableMoney = Number((user.availableMoney - totalPrice).toFixed(2));
    user.purchasedItems.push(...productsIDs);
    await user.save();
    console.log(user.availableMoney);
    await ProductModel.updateMany(
      { _id: { $in: productsIDs } },
      { $inc: { stockQuantity: -1 } },
    );
    res.json({ purchasedItems: user.purchasedItems });
  } catch (error) {
    res.status(400).json(error);
  }
});

export { router as productRouter };
