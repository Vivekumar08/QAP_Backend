const express = require('express');
const bcrypt = require('bcryptjs')
const authenticate = require('../middleware/authenticate')
const jwt = require("jsonwebtoken")
const router = express.Router();

require('../db/conn');
// const User = require('../models/feedSchema');
const Login = require('../models/logSchema');
const remindIt = require('../models/remindSchema');
const { response } = require('express');

router.get('/', (req, res) => {
    res.send(`Hello World from the server`);
});

router.post('/feed', authenticate, async (req, res) => {
    try {
        const { rate, rating, suggestions } = req.body;
        console.log(req.body);
        if (!rate || !rating || !suggestions) {
            return res.status(400).json({ error: "Fill the Feedback Form" })
        }
        const user = await Login.findOne({ _id: req.userID });
        // const user = new User({ rate, rating, suggestions });
        if (user) {
            const userFeed = await user.addFeed(rate, rating, suggestions)
            await user.save();
            res.status(201).json({ message: "Feedback Succesfull" })
        }
        // await user.save();
        // console.log("save successfully");

    } catch (err) {
        console.log(err);
    }

});

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, cpassword } = req.body
        console.log(req.body);
        if (!name || !email || !password || !cpassword) {
            return res.status(400).json({ error: "Fill the Sign Up Form Properly" })
        }
        const UserExist = await Login.findOne({ email: email })
        if (UserExist) {
            return res.status(400).json({ error: "email is already exist" });
        } else if (password != cpassword) {
            return res.status(400).json({ name, email, password, cpassword })
        } else {
            const user = new Login({ name, email, password, cpassword })
            await user.save()
            return res.status(200).json({ message: "Sign Up Successful" })
        }
    } catch (err) {
        console.log(err);
    }

})

//Sign In
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(req.body);
        if (!email || !password) {
            return res.status(400).json({ error: "Fill the Sign In Form Properly" })
        }
        const UserLogin = await Login.findOne({ email: email })
        if (UserLogin) {
            const isMatch = await bcrypt.compare(password, UserLogin.password);
            const token = await UserLogin.generateAuthToken();
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                // httpOnly: true
            })
            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credentials" })
            } else {
                res.json({ message: "user Signin Sucessfully" })
                await UserLogin.save()
            }
        } else {
            res.status(400).json({ error: "Invalid Credentials" })
        }
    } catch (err) {
        console.log(err);
    }

})

router.get('/about', authenticate, (req, res) => {
    // console.log("Hello my about");
    res.send(req.rootUser);
});
// router.get('/getReminder', async (req, res) => {
//     try {
//         const { remindAt,title, Dec,isRemind  } = req.body
//         const UserLogin = await remindIt.find({ })
//         console.log(req.body);
//         if (UserLogin) {
//             const isMatch = await remindIt.findOne({ googleId: googleId })
//             const token = await UserLogin.generateAuthToken();
//             res.cookie("jwtoken", token, {
//                 expires: new Date(Date.now() + 25892000000),
//                 // httpOnly: true
//             })
//             if (!isMatch) {
//                 res.status(400).json({ error: "Invalid Credentials" })
//             } else {
//                 res.json({ message: "user Signin Sucessfully" })
//                 await UserLogin.save()
//             }
//         } else {
//             res.status(400).json({ error: "Invalid Credentials" })
//         }
//     } catch (err) {
//         console.log(err);
//     }
//     // console.log("Hello my about");
//     // res.send(req.rootUser);
// });
router.post('/addReminder', authenticate, async(req, res) => {
    try {
        const { remindAt, title, Dec, isRemind } = req.body
        if (!remindAt || !title || !Dec || !isRemind) {
            return res.status(400).json({ error: "Fill the Todo List Properly" })
        }
        const user = await Login.findOne({ _id: req.userID });
        if (user) {
            const userFeed = await user.addRemind(remindAt, title, Dec, isRemind)
            await user.save();
            res.status(201).json({ message: "Your Todo been successful" })
        }
    } catch (err) { console.log(err); }
    // console.log("Hello my about");
    // res.send(req.rootUser);
});
router.post('/deleteReminder', async (req, res) => {
    // console.log("Hello my about");
    const { remindAt, title, Dec, isRemind } = req.body
    const user = new remindIt({ remindAt, title, Dec, isRemind })
    await user.save()
});

router.get('/logout', (req, res) => {
    res.clearCookie('jwtoken', { path: '/' })
    res.status(200).send('req.rootUser');
});


module.exports = router