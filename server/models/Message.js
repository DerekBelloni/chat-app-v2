import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
        body: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        serverId: {
            type: Schema.Types.ObjectId,
            required: true
        }
    },
    { timestamps: true }
)

const Message = mongoose.model("Message", messageSchema);
export { Message };