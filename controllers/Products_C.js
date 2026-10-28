import Product from '../schemas/products.js';
import Order from '../schemas/orders.js';
import User from '../schemas/users.js';
import Category from '../schemas/categories.js';

async function getAllProducts(req, res) {
    try {
        const products = await Product.find();

        // an empty array already means "no products"
        return res.status(200).json(products);
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function getAllProductsByUser(req, res) {
    try {
        const userId = req.params.id;

        const products = await Product.find({user_id: userId});

        // an empty array already means "no products"
        return res.status(200).json(products);
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function getAllProductsByCategory(req, res) {
    try {
        const categoryId = req.params.id;

        const products = await Product.find({category_id: categoryId});

        // an empty array already means "no products"
        return res.status(200).json(products);
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function getProductById(req, res) {
    try {
        const id = req.params.id;

        const product = await Product.findById(id);

        if (!product)
            return res.status(404).json({message: 'Product not found'});

        return res.status(200).json(product);
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function addProduct(req,res){
    try {
        const values = req.body;

        //check if user exist
        const isUserValid = await User.exists({_id : values.user_id});
        if (!isUserValid)
            return res.status(400).json({message: 'User not exists'});

        //check if category exist
        const isCategoryValid = await Category.exists({_id : values.category_id});
        if (!isCategoryValid)
            return res.status(400).json({message: 'Category not exists'});

        const newProduct = await Product.create(values);

        return res.status(201).json(newProduct);
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

async function updateProductById(req, res) {
    try {
        const id = req.params.id;
        const values = req.body;

        //check if user exist (only if it is being changed)
        if (values.user_id) {
            const isUserValid = await User.exists({_id : values.user_id});
            if (!isUserValid)
                return res.status(400).json({message: 'User not exists'});
        }

        //check if category exist (only if it is being changed)
        if (values.category_id) {
            const isCategoryValid = await Category.exists({_id : values.category_id});
            if (!isCategoryValid)
                return res.status(400).json({message: 'Category not exists'});
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, values, {new: true, runValidators: true});

        if (!updatedProduct)
            return res.status(404).json({message: 'Product not found'});

        return res.status(200).json(updatedProduct);
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function deleteProductById(req, res) {
    try {
        const id = req.params.id;

        //check if i have orders with this product that are open
        const hasOpenOrders = await Order.exists({
            'products.product_id': id,
            status: {$in: ['pending', 'working']},
        });
        if (hasOpenOrders)
            return res.status(409).json({message: 'Cannot delete product: it is in open orders.'});

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct)
            return res.status(404).json({message: 'Product not found.'});

        return res.status(200).json({message: 'Product deleted.', product: deletedProduct});

    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

export {addProduct, getAllProducts, getAllProductsByUser, getAllProductsByCategory,getProductById, updateProductById, deleteProductById};