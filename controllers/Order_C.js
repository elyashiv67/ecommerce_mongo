import Order from "../schemas/orders.js"
import Product from "../schemas/products.js"
import User from "../schemas/users.js"

async function getAllOrders(req, res) {
    try {
        const orders = await Order.find();
        if (orders.length === 0) {
            return res.status(200).json({message: 'No orders found', orders: []});
        }

        return res.status(200).json({orders: orders});
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

async function getOrderById(req, res) {
    try {
        const id = req.params.id;
        const order = await Order.findById(id).populate('user_id').populate('products.product_id');

        if (!order) {
            return res.status(404).json({message: 'No order found'});
        }
        return res.status(200).json({order});
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

async function getOrdersByUser(req, res) {
    try {
        const userId = req.params.id;

        //check if user exist
        const isUserValid = await User.exists({_id : userId});
        if (!isUserValid)
            return res.status(404).json({message: 'User not found'});

        // newest first, with the products details
        const orders = await Order.find({user_id: userId}).sort({createdAt: -1}).populate('products.product_id');

        // an empty array already means "no orders"
        return res.status(200).json({orders: orders});
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

async function addOrder(req, res) {
    try {
        const { user_id, products } = req.body;

        //check if user exist
        const isUserValid = await User.exists({_id : user_id});
        if (!isUserValid)
            return res.status(400).json({message: 'User not exists'});

        // read all the products in one query, nothing is changed yet
        const ids = products.map(p => p.product_id);
        const dbProducts = await Product.find({ _id: { $in: ids } });

        const orderProducts = [];
        let orderTotal = 0;

        // check that every product exists and has enough stock
        for (const item of products) {
            const product = dbProducts.find(p => p._id.equals(item.product_id));

            if (!product) {
                return res.status(404).json({ message: `Product ${item.product_id} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.title}, only ${product.stock} left` });
            }

            // price comes from the db, not from the client
            const linePrice = product.price * item.quantity;
            orderTotal += linePrice;
            orderProducts.push({ product_id: product._id, quantity: item.quantity, total_price: linePrice });
        }

        // all checks passed, take the stock product by product
        const taken = [];
        for (const item of products) {
            const updated = await Product.findOneAndUpdate(
                { _id: item.product_id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } }
            );

            // another order took the stock between the check and the update
            if (!updated) {
                // give back the stock that was already taken for this order
                await Product.bulkWrite(taken.map(t => ({
                    updateOne: {
                        filter: { _id: t.product_id },
                        update: { $inc: { stock: t.quantity } }
                    }
                })));
                return res.status(409).json({ message: 'Stock changed while placing the order, please try again' });
            }
            taken.push(item);
        }

        const order = await Order.create({ user_id, products: orderProducts, total_price: orderTotal });
        return res.status(201).json({ order });
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

async function updateOrder(req, res) {
    try {
        const id = req.params.id;
        const {status} = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({message: 'No order found'});
        }

        // a finished order can't be changed
        if (order.status === 'completed' || order.status === 'canceled') {
            return res.status(400).json({message: `Order is already ${order.status} and can't be changed`});
        }

        // move to canceled only if the order is still active, so the stock is returned only once
        const updated = await Order.findOneAndUpdate(
            {_id: id, status: {$nin: ['completed', 'canceled']}},
            {status},
            {new: true, runValidators: true}
        );
        if (!updated) {
            return res.status(409).json({message: 'Order was changed by another request, please try again'});
        }

        // canceled, give the stock back to the products
        if (status === 'canceled') {
            await Product.bulkWrite(order.products.map(item => ({
                updateOne: {
                    filter: {_id: item.product_id},
                    update: {$inc: {stock: item.quantity}}
                }
            })));
        }

        return res.status(200).json({order: updated});
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

export {getAllOrders , getOrderById, getOrdersByUser, addOrder, updateOrder};
