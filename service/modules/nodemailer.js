const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'crovote@gmail.com',
    pass: 'garlhumvvqubqpyx '
  }
});

module.exports = { transporter };