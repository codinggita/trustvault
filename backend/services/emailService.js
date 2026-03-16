const createTransporter = require('../config/email');

const formatAmount = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);

const sendMail = async (options) => {
  const transporter = createTransporter();
  const response = await transporter.sendMail(options);

  if (transporter.options?.jsonTransport) {
    console.log('Email payload (jsonTransport):', response.message);
  }

  return response;
};

const sendWelcomeEmail = ({ email, name, accountNumber }) =>
  sendMail({
    to: email,
    from: process.env.EMAIL_USER || 'no-reply@trustvault.local',
    subject: 'Welcome to TrustVault',
    html: `
      <div style="font-family: Arial, sans-serif; background:#0A0A0F; color:#F5F2E8; padding:32px;">
        <h1 style="color:#E8C96A; margin-bottom:8px;">Welcome to TrustVault</h1>
        <p style="font-size:16px;">Hello ${name},</p>
        <p>Your premium banking experience is now active.</p>
        <div style="margin:24px 0; padding:20px; border:1px solid rgba(232,201,106,0.35); border-radius:16px; background:#111118;">
          <p style="margin:0 0 8px;">Your account number</p>
          <p style="font-size:24px; letter-spacing:2px; margin:0; color:#E8C96A;">${accountNumber}</p>
        </div>
        <p style="margin-top:24px;">We have also credited your account with a welcome balance of ${formatAmount(
          10000
        )}.</p>
      </div>
    `,
  });

const sendTransferEmail = ({
  email,
  name,
  amount,
  date,
  referenceId,
  direction,
  counterpartyAccountNumber,
  description,
}) =>
  sendMail({
    to: email,
    from: process.env.EMAIL_USER || 'no-reply@trustvault.local',
    subject: `TrustVault transfer ${direction.toLowerCase()} confirmation`,
    html: `
      <div style="font-family: Arial, sans-serif; background:#0A0A0F; color:#F5F2E8; padding:32px;">
        <h1 style="color:#E8C96A; margin-bottom:8px;">Transfer ${direction}</h1>
        <p style="font-size:16px;">Hello ${name},</p>
        <p>Your transfer has been processed successfully.</p>
        <table style="width:100%; margin-top:24px; border-collapse:collapse;">
          <tr><td style="padding:10px 0;">Amount</td><td style="padding:10px 0; text-align:right;">${formatAmount(
            amount
          )}</td></tr>
          <tr><td style="padding:10px 0;">Date</td><td style="padding:10px 0; text-align:right;">${new Date(
            date
          ).toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding:10px 0;">Reference</td><td style="padding:10px 0; text-align:right;">${referenceId}</td></tr>
          <tr><td style="padding:10px 0;">Counterparty</td><td style="padding:10px 0; text-align:right;">${counterpartyAccountNumber}</td></tr>
          <tr><td style="padding:10px 0;">Description</td><td style="padding:10px 0; text-align:right;">${
            description || 'N/A'
          }</td></tr>
        </table>
      </div>
    `,
  });

module.exports = {
  sendWelcomeEmail,
  sendTransferEmail,
};
