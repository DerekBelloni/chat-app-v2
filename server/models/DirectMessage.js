import mongoose from "mongoose";
const { Schema } = mongoose;

const directMessageSchema = new Schema({
        body: {
            type: String,
            required: true
        },
        sender: {
            email: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
            }
        },
        receiver: {
            email: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
            }
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

const DirectMessage = mongoose.model("DirectMessage", directMessageSchema);
export { DirectMessage };