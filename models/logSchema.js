const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const logSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    feed: [
        {
            rate: {
                type: String,
                required: true
            },
            rating: {
                type: String,
                required: true
            },
            suggestions: {
                type: String,
                required: true
            }
        }
    ],
    remind: [
        {
            remindAt: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            Dec: {
                type: String,
                required: true
            },

            isRemind: {
                type: Boolean,
                required: true
            }
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})



logSchema.pre('save', async function (next) {
    // console.log("hi from inside");
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.password, 12)
    }
    next();
});

logSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this.id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}

logSchema.methods.addRemind = async function (remindAt, title, Dec,isRemind) {
    try {
        this.remind = this.remind.concat({ remindAt, title, Dec,isRemind });
        await this.save();
        return this.remind;
    } catch (error) {
        console.log(error)
    }
}
logSchema.methods.addFeed = async function (rate, rating, suggestions) {
    try {
        this.feed = this.feed.concat({ rate, rating, suggestions });
        await this.save();
        return this.feed;
    } catch (error) {
        console.log(error)
    }
}

const Login = mongoose.model('LOGIN', logSchema);

module.exports = Login;