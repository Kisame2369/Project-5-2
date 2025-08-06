import nodemailer from 'nodemailer';
import { getEnvVariable } from './getEnvVariable.js';

const transporter = nodemailer.createTransport({
  host: getEnvVariable('SMTP_HOST'),
  port: getEnvVariable('SMTP_PORT'),
  secure: false,
  auth: {
    user: getEnvVariable('SMTP_USER'),
    pass: getEnvVariable('SMTP_PASSWORD'),
  },
});

export async function sendMail(mail) { 
    mail.from = getEnvVariable('SMTP_FROM');
    return transporter.sendMail(mail);
};