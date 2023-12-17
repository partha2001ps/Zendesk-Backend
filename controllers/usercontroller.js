const User = require("../models/user");
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken');
const { JWTPASS, EMAIL_PASS } = require("../utiles/config");
const nodemailer = require('nodemailer');

const usercontrollers = {
    signup:async (req,res)=> {
        try {
            const { name ,email, password } = req.body;
            const exitinguser = await User.findOne({ email })
            if (exitinguser) {
                return res.json({message:'this email already used .to another email try or singin account'})
            }
            const passwordHash = await bcrypt.hash(password, 10)
            
            const user = new User({
                name,email,passwordHash
            })
            await user.save()
            return res.status(200).json({ message: 'user created successfully' })
        }
        catch (e) {
            console.log('signup error', e)
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    singin:async (req,res)=>{
        try {
            const { email, password } = req.body;
        const checkEmail = await User.findOne({ email })
        if (checkEmail) {
            const passwordCheck = await bcrypt.compare(password,checkEmail.passwordHash)
            if (!passwordCheck) {
                return res.json({ message: "password is incorrect" })
            }
            const Token =await jwt.sign({
                email: email,
                id:checkEmail._id
            }, JWTPASS)
            res.json({Token,checkEmail})
            }
            res.json({ message: 'user not found!' })
            res.status(500).json({ message: "Internal Server Error" });
        }
        catch (e) {
            console.log('singin error',e)
        }
    },  resetPassword: async(req, res) =>{
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({meaasge:"Invaild User"})
        }
        const OTP = Math.random().toString(36).slice(-6);
        user.reset_OTP = OTP
        await user.save()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'parthapn2017@gmail.com',
              pass: EMAIL_PASS,
            },
          });
        const Link = `https://candid-pudding-d739b9.netlify.app/reset-password/new-password/${OTP}`
        
          const mailOptions = {
            from: 'Password_resest_noreply@gmail.com',
            to: email,
            subject: 'Reset Your Password',
            text: `you are receiving this email because you request has passwords reset for your account .\n\n please use the following Link  to  Click reset your password:${Link} \n\n if you did not request a password to ignore this email. `,
          };
        
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
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
            return res.json({ message: "please enter the new password" });
        }
        const user = await User.findOne({ reset_OTP: OTP })
        if (!user) {
            return res.json({ message: "Invalid OTP" });
        }
        const NewPass = await bcrypt.hash(password, 10);
        user.passwordHash = NewPass;
        user.reset_OTP = null;
           
        await user.save();

        res.json({meaasge:"password reset successfull"})
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    activetlikesent: async (req, res) => {
        const { email } = req.params;
        const user = await User.findOne({ email })
        console.log(user.activated)
        if (user.activated) {
            return res.json({message:'user Already Activated'})
        }
        if (!user) {
            return res.json({meaasge:"Invaild User"})
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

module.exports=usercontrollers