const express = require('express');
const crypto = require('crypto');
const twilio = require('twilio');
const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generate a random 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP via SMS using Twilio
const sendSMS = async (phoneNumber, otp) => {
  try {
    await twilioClient.messages.create({
      body: `Your Spotify Clone verification code is: ${otp}. Valid for 5 minutes.`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};

// Request OTP endpoint
router.post('/request-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database (overwrite if exists)
    await OTP.findOneAndUpdate(
      { phoneNumber },
      { phoneNumber, otp },
      { upsert: true, new: true }
    );

    // Send OTP via SMS
    const smsSent = await sendSMS(phoneNumber, otp);

    if (!smsSent) {
      throw new Error('Failed to send SMS');
    }

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error in request-otp:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    // Find the OTP document
    const otpDoc = await OTP.findOne({ phoneNumber });

    if (!otpDoc) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Find or create user
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await User.create({
        phoneNumber,
        username: `user${phoneNumber.slice(-4)}`, // Create a default username
      });
    }

    // Delete the used OTP
    await OTP.deleteOne({ phoneNumber });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Error in verify-otp:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

module.exports = router;
