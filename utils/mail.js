/**
 * Created by PatrikGlendell on 08/03/2017.
 */

var nodemailer = require('nodemailer2');
// var types = require('../constants/types');

module.exports.sendMail = function (username, password, socket, language) {
    var transporter = nodemailer.createTransport({
        host: '',
        port: '',
        auth: {
            user: '',
            pass: ''
        },
        secureConnection: false,
        tls: {
            rejectUnauthorized: false,
            ciphers: ''
        }
    });
    var mailOptions = {
        from: '',
        to: username,
        subject: languageTitleSwitch(language),
        text: languageSwitch(language, username, password)
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            // socket.emit('action', {
            //     type: types.ERROR_ON_SEND_EMAIL,
            //     data: {code: 500, message: {error: error, info: info}}
            // });
        } else {
            // socket.emit('action', {
            //     type: types.EMAIL_TRANSMITTED,
            //     data: {code: 200, message: 'OK'}
            // });
        }
    });
};
module.exports.sendMailShield = function (username, password, socket) {
    var transporter = nodemailer.createTransport({
        host: '',
        port: '',
        auth: {
            user: '',
            pass: ''
        },
        secureConnection: false,
        tls: {
            rejectUnauthorized: false,
            ciphers: 'SSLv3'
        }
    });
    var mailOptions = {
        from: '',
        to: username,
        subject: '',
        text: ''
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            // socket.emit('action', {
            //     type: types.ERROR_ON_SEND_EMAIL,
            //     data: {code: 500, message: {error: error, info: info}}
            // });
        } else {
            // socket.emit('action', {
            //     type: types.EMAIL_TRANSMITTED,
            //     data: {code: 200, message: 'OK'}
            // });
        }
    });
};

module.exports.sendMailNew = function (username, password, language) {
    var transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOSTNAME,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
        secureConnection: false,
        tls: {
            rejectUnauthorized: false,
            ciphers: 'SSLv3'
        }
    });
    var mailOptions = {
        from: process.env.MAIL_FROM,
        to: username,
        subject: languageTitleSwitch(language),
        text: languageSwitch(language, username, password)
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error:",error);
        } else {
            console.log("info:",info);
        }
    });
};

function languageTitleSwitch(language) {
    switch (language) {
        case 'da-DK':
            return 'Geometra - Inloggningsuppgifter';
        case 'nl-NL':
            return 'Geometra - Login information';
        case 'nl-BE':
            return 'Geometra - Login information';
        case 'en-GB':
            return 'Geometra - Login information';
        case 'en-US':
            return 'Geometra - Login information';
        case 'nb-NO':
            return 'Geometra - Påloggningsinformasjon';
        case 'sv-SE':
            return 'Geometra - Inloggningsuppgifter';
    }
}

function languageSwitch(language, username, password) {
    switch (language) {
        case 'da-DK':
            return '';

        case 'nl-NL':
            return '';

        case 'nl-BE':
            return '';

        case 'en-GB':
            return '';

        case 'en-US':
            return '';

        case 'nb-NO':
            return '';

        case 'sv-SE':
            return '';
    }

}