var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const { mailOptions } = require('../config/mailOptions')
const { secret, jwtOptions } = require('../config/jwtOptions')
const { encryptionOptions } = require('../config/encryptionOptions')

const transporter = nodemailer.createTransport({
    service: mailOptions.service,
    auth: mailOptions.auth
})

module.exports = {
    deleteItemsOnJson: function(array, items) {
        for (let i = 0; i < items.length; i++) {
            delete array[items[i]]
        }
    },

    notifyMail: function (subject, text) {
        let message = {
            from: 'Pros-Chain Notifier',
            to: mailOptions.receiver,
            subject: subject,
            text: text
        };
        return transporter.sendMail(message)
    },

    createJwtPayload: function(email, id) {
        return {
            id: id,
            email: email
        }
    },

    encryptPassword: function(password) {
        return bcrypt.hashSync(password, encryptionOptions.saltRounds)
    },

    comparePasswords: function(password, hash) {
        return bcrypt.compareSync(password, hash)
    },

    createJwtToken: function (payload) {
        return jwt.sign(payload, secret, jwtOptions)
    },

    checkToken: function (token) {
        try {
            return jwt.verify(token, secret)
        }
        catch (err) {
            return false
        }
    }
}
