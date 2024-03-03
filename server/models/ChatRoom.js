import mongoose from "mongoose";
const { Schema } = mongoose;

const chatRoomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
},
    { timestamps: true }
);

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
export { ChatRoom };