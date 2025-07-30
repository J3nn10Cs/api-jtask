import * as nodemailer from 'nodemailer'
import { envs } from 'config/envs';

const config = () => {
  return {
    host: envs.smtpHost,
    port: +envs.smtpPort,
    secure: false,
    auth: {
      user: envs.smtpUser,
      pass: envs.smtpPassword
    }
  }
}

export const transporter = nodemailer.createTransport(config());