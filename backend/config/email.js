const nodemailer = require('nodemailer');

let transporter;

const createTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN,
  } = process.env;

  if (EMAIL_USER && CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
      },
    });
  } else if (EMAIL_HOST && EMAIL_PORT && EMAIL_USER && EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT),
      secure: Number(EMAIL_PORT) === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  return transporter;
};

module.exports = createTransporter;
