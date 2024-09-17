import { z } from 'zod';
import User from '../models/user-model.js';

const updateBody = z.object({
    password: z.string().optional(),
    name: z.string().optional(),
    
});
export const updateUser = async (req, res) => {
    const { success, error } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Error while updating information",
            errors: error.errors
        });
    }

    try {
        await User.updateOne({ _id: req.userId }, req.body);
        res.json({
            success: true,
            message: "Updated successfully"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update user", error: err.message });
    }
};

export const searchUsers = async(req,res) =>{
    const filter= req.query.filter || "";
    const users = await User.find({
        name:{
            "$regex":filter
        }
    })
    res.json({
        user : users.map(user =>({
            username : user.username,
            name: user.name,
            _id : user._id
        }))
    })
};