const e = require("express");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, required: false },
  displayName: { type: String, required: false },
  subscription: [{
    payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    payment_Status: {
      type: String,
      // enum: ["pending", "success", "failed", "refunded"],
      // default: "pending",
    },
    course_enrolled: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    is_subscription_active: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  }],
  photo_url: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        // Regex to validate image URL
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
      },
      message: "Invalid image URL format",
    },
    default: "https://mankavit.blob.core.windows.net/profile/60111.jpg",
  }, // URL for photo
  role: {
    type: String,
    enum: ["user", "admin"],
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (email) {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      message: "Invalid email format",
    },
  },
  wishList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  password: { type: String, required: true },
  otp: { type: String },
  otpExpiration: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  refreshToken: { type: String },
  loginOtp: { type: String },
  loginOtpExpiration: { type: Date },
  kycRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "KycDetails",
    default: null,
  },
  kyc_status: {
    type: String,
    enum: ["pending", "approved", "rejected", "not-applied"],
    default: "not-applied",
  },
});

// Create and export the User model
module.exports = mongoose.model("User", userSchema);
