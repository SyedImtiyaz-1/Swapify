const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    user_password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    aadhaar_data: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AadhaarData',
        unique: true,
        sparse: true
    },
    user_role: { type: String, enum: ['user', 'admin'], default: 'user' },
    user_avatar: { type: String },
    phone_number: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: { type: String },
    address: { type: String },
    created_at: { type: Date, default: Date.now },
    last_token: {
        type: String,
        default: null
    },
    google_user_id: { type: String },
    google_user_avatar: { type: String },
    is_verified: { type: Boolean },
    email_verified: { type: Boolean },
    full_name: { type: String },
    nickname: { type: String },
    family_name: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;