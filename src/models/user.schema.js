import mongoose from 'mongoose'

// Setup userSchema
let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name cannot be blank!"
    },
    email: {
        type: String,
        required: "Email-ID cannot be blank!"
    },
    mobile: String,
    headline: String,
    avatar: {
        type: Number,
        default: 14
    },
    password: {
        type: String,
        select: false   // Won't include in response
    },
    fcm: [{
        token: String
    }]
});

// Create and Export schema
module.exports = mongoose.model("User", userSchema);