
import { envs } from 'config/envs';
import { transporter } from './config/nodemailer'

interface IEmail {
  email : string,
  name : string,
  token : string
}

export class AuthEmail {
  static sendConfirmationEmail = async (user : IEmail) => {
    const info =  await transporter.sendMail({
      from : 'JTask <admin@jtask.com>',
      to : user.email,
      subject : 'JTask - Confirma tu contraseña',
      text : 'JTask - Confirma tu contraseña',
      html : ` 
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"> 
        <h2 style="color: #444; text-align: center;">¡Bienvenido a JTask, ${user.name}!</h2> 
        <p style="font-size: 16px; line-height: 1.5; color: #555;"> Haz creado tu cuenta en <strong>JTask</strong>, ¡ya casi está todo listo! Solo debes confirmar tu cuenta para poder comenzar a usarla. </p> 
        <p style="font-size: 16px; line-height: 1.5; color: #555;"> 
          Para confirmar tu cuenta, visita el siguiente enlace: 
        </p> 
        <div style="text-align: center; margin: 20px 0;"> 
          <a href="${envs.frontendurl}/auth/confirm-account" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">Confirmar Cuenta</a> 
        </div> 
        <p style="font-size: 16px; line-height: 1.5; color: #555;"> Ingresar el siguiente código para confirmar tu cuenta: 
        </p> 
        <div style="text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;"> ${user.token} 
        </div> 
        <p style="font-size: 16px; line-height: 1.5; color: #555;"> 
          <strong>Nota:</strong> 
          Este token expira en 10 minutos. 
        </p> 
        <p style="text-align: center; color: #999; font-size: 14px; margin-top: 20px;"> Si no has solicitado esta cuenta, puedes ignorar este mensaje. </p> 
        </div> 
      </div> `
    })
    console.log('Mensaje enviado',info.messageId)
  }
  
  static sendPasswordForgot = async (user : IEmail) => {
    const info =  await transporter.sendMail({
      from : 'JTask <admin@jtask.com>',
      to : user.email,
      subject : 'JTask - Restablece tu contraseña',
      text : 'JTask - Restablece tu contraseña',
      html : ` 
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"> 
        <h2 style="color: #444; text-align: center;">¡Bienvenido a JTask, ${user.name}!</h2> 
        <p style="font-size: 16px; line-height: 1.5; color: #555;"> Haz solicitado restablecer tu contraseña en <strong>JTask</strong>, ¡ya casi está todo listo!. </p> 
        <p style="font-size: 16px; line-height: 1.5; color: #555;"> 
          Para restablecer tu contraseña, visita el siguiente enlace: 
        </p> 
        <div style="text-align: center; margin: 20px 0;"> 
          <a href="${envs.frontendurl}/auth/new-password" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">Restablecer Contraseña</a> 
        </div> 
        <p style="font-size: 16px; line-height: 1.5; color: #555;"> También puedes ingresar el siguiente código para restablecer tu contraseña: 
        </p> 
        <div style="text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;"> ${user.token} 
        </div> 
        <p style="font-size: 16px; line-height: 1.5; color: #555;"> 
          <strong>Nota:</strong> 
          Este token expira en 10 minutos. 
        </p> 
        <p style="text-align: center; color: #999; font-size: 14px; margin-top: 20px;"> Si no has solicitado esta cuenta, puedes ignorar este mensaje. </p> 
        </div> 
      </div> `
    })
    console.log('Mensaje enviado',info.messageId)
  }
}