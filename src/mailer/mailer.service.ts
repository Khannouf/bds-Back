import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private async transporter() {
    const testAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return transport;
  }

  async sendSignupConfirmation(userEmail: string) {
    (await this.transporter()).sendMail({
      from: 'app@localhost.com',
      to: userEmail,
      subject: 'Incription',
      html: "<h3> Confirmation de l'inscription </h3>",
    });
  }

  async sendResetPassword(userEmail: string, url: string, code: string) {
    (await this.transporter()).sendMail({
      from: 'app@localhost.com',
      to: userEmail,
      subject: 'Reset Password',
      html: `<a href="${url}"> Reset password
      <p> Secret code: <strong>${code}</strong></p>`
    });
  }
}
