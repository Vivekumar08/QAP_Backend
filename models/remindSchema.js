const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const remindSchema = new mongoose.Schema({
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
    
    // tokens: [
    //     {
    //         token: {
    //             type: String,
    //             required: true
    //         }
    //     }
    // ]
})

remindSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this.id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}

const googleLogin = mongoose.model('remind', remindSchema);

module.exports = googleLogin;
