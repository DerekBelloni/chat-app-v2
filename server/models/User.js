import mongoose from 'mongoose';
const { Schema } = mongoose;
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
        // make this conditional based on 'isGoogle'
    },
    profilePic: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    isGoogle: {
        type: Boolean,
        // make this required
    },
    unreadCount: {
        type: Number,
        default: 0
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, email: this.email, isAdmin: this.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: 7200 }
    );
    return token;
}

const User = mongoose.model("User", userSchema);
export { User };