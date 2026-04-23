import nodemailer from 'nodemailer';

class EmailService {
  private async createTransporter() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (SMTP_USER && SMTP_PASS) {
      const isGmail = (SMTP_HOST || '').includes('gmail') || SMTP_USER.includes('gmail.com');
      
      const config: any = isGmail ? {
        service: 'gmail',
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      } : {
        host: SMTP_HOST || 'smtp.gmail.com',
        port: Number(SMTP_PORT) || 587,
        secure: SMTP_PORT === '465',
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      };

      return nodemailer.createTransport(config);
    }

    // Fallback para conta de teste do Ethereal
    const testAccount = await nodemailer.createTestAccount();
    console.log('--- USANDO CONTA DE TESTE NODEMAILER ---');
    console.log('User:', testAccount.user);
    console.log('Pass:', testAccount.pass);
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  async sendMail(options: nodemailer.SendMailOptions) {
    const transporter = await this.createTransporter();
    const info = await transporter.sendMail({
      from: '"DogDex Support" <support@dogdex.app>',
      ...options
    });
    
    console.log('Message sent: %s', info.messageId);
    const previewUrl = nodemailer.getTestMessageUrl(info as any);
    if (previewUrl) {
      console.log('Preview URL: %s', previewUrl);
    }
    return { info, previewUrl };
  }

  async sendPasswordResetEmail(email: string, token: string) {
    // Em produção, isso seria um link para o seu site/app
    // Por enquanto, enviamos apenas o código/link simbólico
    const resetLink = `dogdex://reset-password?token=${token}`;
    
    await this.sendMail({
      to: email,
      subject: '[DogDex] Recuperação de Senha',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #000; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">DogDex</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #111827; font-size: 18px;">Recuperação de Senha</h2>
            <p style="color: #374151; line-height: 1.5;">Você solicitou a recuperação de senha para sua conta no DogDex.</p>
            <p style="color: #374151; line-height: 1.5;">Se você não solicitou isso, ignore este e-mail.</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${resetLink}" style="background-color: #000; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Definir Nova Senha
              </a>
            </div>
            <p style="color: #6b7280; font-size: 12px;">Ou copie o link: ${resetLink}</p>
          </div>
        </div>
      `
    });
  }
}

export const emailService = new EmailService();
