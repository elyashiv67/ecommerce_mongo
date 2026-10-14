import User from '../schemas/users.js'

async function getAllUsers(req, res) {
    try {
        const users = await User.find();

        if(users.length === 0)
            return res.status(404).json({message: 'No users found.'});

        return res.status(200).json({users: users});
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

async function getUserById(req, res) {
    try {
        let { id } = req.params;

        const user = await User.findById(id);

        if (!user)
            return res.status(404).json({message: 'No user found.'});

        return res.status(200).json({user: user});
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
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
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

export {getAllUsers , getUserById , addUser};