
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  BACKTEND_URL : number,
  DATABASE_URL : string,
  FRONTEND_URL : string,
  SMTP_HOST : string
  SMTP_PORT : string,
  SMTP_USER : string,
  SMTP_PASSWORD : string
}

const envsSchema = joi.object({
  BACKTEND_URL : joi.number().required(),
  DATABASE_URL : joi.string().uri().required(), // Assuming you have a database URL
  FRONTEND_URL : joi.string().required(),
  SMTP_HOST : joi.string().required(),
  SMTP_PORT : joi.string().required(),
  SMTP_USER : joi.string().required(),
  SMTP_PASSWORD : joi.string().required(),
  //variables in the app
}).unknown(true);

const {error, value} = envsSchema.validate(process.env);

if (error) {
  console.log(error)
}

const envVars : EnvVars = value

export const  envs = {
  port : envVars.BACKTEND_URL,
  databaseurl : envVars.DATABASE_URL,
  frontendurl : envVars.FRONTEND_URL,
  smtpHost : envVars.SMTP_HOST,
  smtpPort : envVars.SMTP_PORT,
  smtpUser : envVars.SMTP_USER,
  smtpPassword : envVars.SMTP_PASSWORD
} 
