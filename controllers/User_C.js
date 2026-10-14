import User from '../schemas/users.js'
import Product from '../schemas/products.js';
import Order from '../schemas/orders.js';

async function getAllUsers(req, res) {
    try {
        const users = await User.find();

        if (users.length === 0)
            return res.status(404).json({message: 'No users found.'});

        return res.status(200).json({users: users});
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function getUserById(req, res) {
    try {
        let {id} = req.params;

        const user = await User.findById(id);

        if (!user)
            return res.status(404).json({message: 'No user found.'});

        return res.status(200).json({user: user});
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function addUser(req, res) {
    try {
        const values = req.body;

        const newUser = await User.create(values);

        if (!newUser)
            return res.status(404).json({message: 'user not added.'});

        return res.status(200).json({message: "user added successfully", user: newUser});
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function updateUser(req, res) {
    try {
        const {id} = req.params;
        const values = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, values, {new: true, runValidators: true})

        if (!updatedUser)
            return res.status(404).json({message: 'User not found.'});

        return res.status(200).json({message: "user updated successfully", user: updatedUser});
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function deleteUser(req, res) {
    try {
        const {id} = req.params;

        // block the delete if other documents still point to this user
        const hasProducts = await Product.exists({user_id: id});
        const hasOrders = await Order.exists({user_id: id});

        if (hasProducts || hasOrders)
            return res.status(409).json({message: 'Cannot delete user: user has products or orders.'});

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser)
            return res.status(404).json({message: 'User not found.'});

        return res.status(200).json({message: "user deleted successfully", deletedUser});
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

export {getAllUsers, getUserById, addUser , updateUser , deleteUser};