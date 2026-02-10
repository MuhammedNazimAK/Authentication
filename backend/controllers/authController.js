import { User } from "../models/userModel";

export const registerUser = async (req, res) => {
    try {

        const { name, email, password, gender } = req.body;

        const file = req.file;

        if (!name || !email || !password || !gender || !file) {
            return res.status(400).json({
                message: "please provide all values"
            })
        }

        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({
                message: "User already exist"
            })
        }

        

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}