/**
 * Created by PatrikGlendell on 02/02/2017.
 */
 var crypto = require('crypto');
 var generator = require('generate-password');
 
 module.exports = {
     login: function (username, password) {
     },
     generatePassword: function () {
         return generator
             .generate({
                 length: 8,
                 numbers: true,
                 symbols: true,
                 strict: true,
                 excludeSimilarCharacters: true,
                 exclude: '\'()+_\\-=}{[]|:;"/?.><,`~'
             });
     },
     generateSalt: function (length) {
         return crypto.randomBytes(length);
     },
     generateHash: function (password, salt) {
         try {
             return crypto
                 .pbkdf2Sync(password, salt, 1000, 64, 'sha512');
         } catch (error) {
             return -1;
         }
     },
     validatePassword: function (password, storedPasswordHash, storedSalt) {
         console.log('salt: ', storedSalt.length);
         try {
             const generatedPasswordHash =
                 crypto
                     .pbkdf2Sync(password, storedSalt, 10000, 64, 'sha512')
                     .toString('hex')
                     .slice(0,64);
 
             console.log('generated: ' ,generatedPasswordHash.length);
             console.log('stored: ',storedPasswordHash.length);
             return generatedPasswordHash == storedPasswordHash;
         } catch (error) {
             console.log(error);
             return -1;
         }
     },
     generateSaltShield: function (length) {
          return crypto
              .randomBytes(Math.ceil(length / 2))
              .toString('hex')
              .slice(0,length);
 
     },
     generateShieldHash: function(password, salt) {
      return crypto
          .pbkdf2Sync(password,salt,10000,64,'sha512')
          .toString('hex')
          .slice(0,64);
     }
 };