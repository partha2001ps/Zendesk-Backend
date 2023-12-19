const User = require("../models/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { JWTPASS, EMAIL_PASS } = require("../utiles/config");
const nodemailer = require('nodemailer');
const Mentee = require("../models/mentee");

const usercontrollers = {
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ message: 'This email is already in use. Try another email or sign in to your account.' });
      }
      const passwordHash = await bcrypt.hash(password, 10);

      const user = new User({
        name, email, passwordHash
      });
      await user.save();
      return res.status(200).json({ message: 'User created successfully' });
    } catch (e) {
      console.log('Signup error', e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  signin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkEmail = await User.findOne({ email });
      const mentee = await Mentee.findOne({ email });

      if (checkEmail) {
        if (checkEmail.activated) {
          const passwordCheck = await bcrypt.compare(password, checkEmail.passwordHash);

          if (!passwordCheck) {
            return res.json({ message: "Password is incorrect" });
          }

          const Token = await jwt.sign({
            email: email,
            id: checkEmail._id
          }, JWTPASS);

          return res.json({ Token,user:'student',checkEmail });
        } else {
          return res.json({ message: 'Go to your email and click the activation link to login.' });
        }
      } else if (mentee) {
        const passwordCheck = await bcrypt.compare(password, mentee.passwordHash);

        if (!passwordCheck) {
          return res.json({ message: "Password is incorrect" });
        }

        const Token = await jwt.sign({
          email: email,
          id: mentee._id
        }, JWTPASS);

        return res.json({ Token,user:'mentee', mentee });
      } else {
        return res.json({ message: 'User not found!' });
      }
    } catch (e) {
      console.log('Signin error', e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  resetPassword: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      const mentee = await Mentee.findOne({ email });

      if (user) {
        const OTP = Math.random().toString(36).slice(-6);
        user.reset_OTP = OTP;
        await user.save();
        usercontrollers.sendResetEmail(email, OTP, res);
      } else if (mentee) {
        const OTP = Math.random().toString(36).slice(-6);
        mentee.reset_OTP = OTP;
        await mentee.save();
        usercontrollers.sendResetEmail(email, OTP, res);
      } else {
        return res.json({ message: 'User or Mentee not found with the given email' });
      }
    } catch (error) {
      console.error(error);
      return res.json({ message: 'Error during password reset' });
    }
  },

  sendResetEmail: (email, OTP, res) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'parthapn2017@gmail.com',
        pass: EMAIL_PASS,
      },
    });

    const link = `https://candid-pudding-d739b9.netlify.app/reset-password/new-password/${OTP}`;

    const mailOptions = {
      from: 'Password_reset_noreply@gmail.com',
      to: email,
      subject: 'Reset Your Password',
      text: `You are receiving this email because you requested a password reset for your account.\n\n Please use the following link to reset your password: ${link} \n\n If you did not request a password reset, please ignore this email.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.json({ message: 'Error sending reset email' });
      } else {
        return res.json({ message: 'Reset email sent successfully' });
      }
    });
  },

  newpassword: async (req, res) => {
    try {
      const { OTP } = req.params;
      const { password } = req.body;
      if (!password) {
        return res.json({ message: "Please enter the new password" });
      }
      const user = await User.findOne({ reset_OTP: OTP });
      const mentee = await Mentee.findOne({ reset_OTP: OTP });
  
      if (user) {
        const NewPass = await bcrypt.hash(password, 10);
        user.passwordHash = NewPass;
        user.reset_OTP = null;
        await user.save();
        res.json({ message: "Password reset successfully" });
      } else if (mentee) {
        const NewPass = await bcrypt.hash(password, 10);
        mentee.passwordHash = NewPass;
        mentee.reset_OTP = null;
        await mentee.save();
        res.json({ message: "Password reset successfully" });
      } else {
        return res.json({ message: "Invalid OTP" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  

  activetlikesent: async (req, res) => {
    const { email } = req.params;
    const user = await User.findOne({ email });
    console.log(user.activated)
    if (user.activated) {
      return res.json({ message: 'User Already Activated' });
    }
    if (!user) {
      return res.json({ message: "Invalid User" });
    }
    const activationToken = Math.random().toString(36).slice(-10);
    user.activationToken = activationToken;
    await user.save()
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'parthapn2017@gmail.com',
        pass: EMAIL_PASS,
      },
    });

    const activationLink = ` https://candid-pudding-d739b9.netlify.app/activate-account/${activationToken}`;
    const mailOptions = {
      from: 'noreply@example.com',
      to: email,
      subject: 'Activate Your Account',
      text: `Welcome to the site! Please click the following link to activate your account: ${activationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.json({ message: 'Error sending activation email' });
      } else {
        return res.json({ message: 'Activation email sent successfully' });
      }
    });

  },

  activateAccount: async (req, res) => {
    try {
      const { activationToken } = req.params;
      const user = await User.findOne({ activationToken, activated: false });

      if (user) {
        user.activated = true;
        user.activationToken = null;
        await user.save();

        return res.json({ message: 'Account activated successfully' });
      } else {
        return res.json({ message: 'Invalid activation token or account already activated' });
      }
    } catch (error) {
      console.error("Error activating account:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = usercontrollers;
