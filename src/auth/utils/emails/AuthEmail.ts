import { envs } from 'config/envs';
import { transporter } from './config/nodemailer';

interface IEmail {
  email: string;
  name: string;
  token: string;
}

function baseEmailTemplate(content: string): string {
  return `
  <div style="background-color: #f4f4f4; padding: 30px; font-family: 'Segoe UI', sans-serif; color: #333;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background-color: #2d3748; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">JTask</h1>
      </div>
      <div style="padding: 30px;">
        ${content}
      </div>
      <div style="background-color: #edf2f7; padding: 20px; text-align: center; font-size: 13px; color: #666;">
        © ${new Date().getFullYear()} JTask. Todos los derechos reservados.
      </div>
    </div>
  </div>`;
}

function confirmationContent(user: IEmail): string {
  return `
    <h2 style="color: #2d3748;">Hola ${user.name}, ¡bienvenido a JTask!</h2>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">
      Gracias por registrarte en <strong>JTask</strong>. Solo queda un paso para activar tu cuenta.
    </p>
    <p style="font-size: 16px; color: #4a5568;">Haz clic en el botón para confirmar tu cuenta:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${envs.frontendurl}/auth/confirm-account" style="background-color: #3182ce; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold;">Confirmar Cuenta</a>
    </div>
    <p style="font-size: 15px; color: #4a5568;">O usa este código:</p>
    <div style="text-align: center; font-size: 22px; font-weight: bold; color: #2d3748; margin: 20px 0;">
      ${user.token}
    </div>
    <p style="font-size: 14px; color: #718096;"><strong>Nota:</strong> El código expira en 10 minutos.</p>
  `;
}

function passwordResetContent(user: IEmail): string {
  return `
    <h2 style="color: #444; text-align: center;">Hola, ${user.name}</h2>
    <p style="font-size: 16px; color: #555;">
      Haz solicitado restablecer tu contraseña en <strong>JTask</strong>.
    </p>
    <p style="font-size: 16px; color: #555;">Para hacerlo, visita el siguiente enlace:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${envs.frontendurl}/auth/new-password" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">Restablecer Contraseña</a>
    </div>
    <p style="font-size: 16px; color: #555;">O usa este código:</p>
    <div style="text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;">${user.token}</div>
    <p style="font-size: 16px; color: #555;"><strong>Nota:</strong> Este token expira en 10 minutos.</p>`;
}

export class AuthEmail {
  static async sendConfirmationEmail(user: IEmail) {
    const html = baseEmailTemplate(confirmationContent(user));
    const info = await transporter.sendMail({
      from: 'JTask <admin@jtask.com>',
      to: user.email,
      subject: 'JTask - Confirma tu cuenta',
      text: 'Confirma tu cuenta en JTask',
      html,
    });
    console.log('Email de confirmación enviado:', info.messageId);
  }

  static async sendPasswordForgot(user: IEmail) {
    const html = baseEmailTemplate(passwordResetContent(user));
    const info = await transporter.sendMail({
      from: 'JTask <admin@jtask.com>',
      to: user.email,
      subject: 'JTask - Restablece tu contraseña',
      text: 'Restablece tu contraseña en JTask',
      html,
    });
    console.log('Email de recuperación enviado:', info.messageId);
  }
}
