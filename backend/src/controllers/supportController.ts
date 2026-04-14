import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { SupportReport } from '@dogdex/shared';
import fs from 'fs';

class SupportController {
  private async createTransporter() {
    // Para simplificar, usamos variáveis de ambiente
    // Se não houver credenciais, usamos uma conta de teste do Ethereal
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

  async handle(req: Request, res: Response) {
    console.log('--- NOVO RELATO DE SUPORTE ---');
    console.log('Body:', req.body);
    console.log('File:', req.file ? req.file.filename : 'Nenhum');

    try {
      const { type, text, deviceInfo } = req.body;
      
      if (!type || !text) {
        return res.status(400).json({ 
          success: false, 
          error: 'Tipo e texto são obrigatórios.' 
        });
      }

      let parsedDeviceInfo = deviceInfo;
      if (typeof deviceInfo === 'string') {
        try {
          parsedDeviceInfo = JSON.parse(deviceInfo);
        } catch (e) {
          console.warn('Falha ao parsear deviceInfo, usando como string');
        }
      }

      const report: SupportReport = {
        type,
        text,
        deviceInfo: parsedDeviceInfo,
        timestamp: new Date().toISOString(),
      };

      const file = req.file;
      const transporter = await this.createTransporter();

      const isBug = type.toLowerCase() === 'bug';
      const badgeColor = isBug ? '#ef4444' : '#3b82f6';
      
      const mailOptions: any = {
        from: '"DogDex Support" <support@dogdex.app>',
        to: process.env.SUPPORT_EMAIL || 'admin@example.com',
        subject: `[DogDex ${(type || 'info').toUpperCase()}] Novo Relato Recebido`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #000; padding: 20px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 24px;">DogDex Support</h1>
            </div>
            
            <div style="padding: 20px;">
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <span style="background-color: ${badgeColor}; color: white; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; text-transform: uppercase;">
                  ${type}
                </span>
                <span style="margin-left: auto; color: #6b7280; font-size: 14px;">
                  ${new Date(report.timestamp).toLocaleString('pt-BR')}
                </span>
              </div>

              <h2 style="color: #111827; font-size: 18px; margin-bottom: 8px;">Relato do Usuário:</h2>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid ${badgeColor}; color: #374151; line-height: 1.5; margin-bottom: 24px;">
                ${text.replace(/\n/g, '<br>')}
              </div>

              <h2 style="color: #111827; font-size: 16px; margin-bottom: 12px;">Informações do Dispositivo:</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 8px 0; color: #6b7280;">Modelo:</td>
                  <td style="padding: 8px 0; font-weight: 500; text-align: right;">${report.deviceInfo?.brand} ${report.deviceInfo?.modelName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 8px 0; color: #6b7280;">Sistema:</td>
                  <td style="padding: 8px 0; font-weight: 500; text-align: right;">${report.deviceInfo?.osName} (v${report.deviceInfo?.osVersion})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Plataforma:</td>
                  <td style="padding: 8px 0; font-weight: 500; text-align: right; text-transform: capitalize;">${report.deviceInfo?.platform}</td>
                </tr>
              </table>

              ${file ? `<p style="color: #6b7280; font-size: 12px; margin-top: 20px;">📎 1 Captura de tela anexada</p>` : ''}
            </div>
            
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #9ca3af; font-size: 12px;">
              Este é um e-mail automático gerado pelo App DogDex.
            </div>
          </div>
        `,
        attachments: []
      };

      if (file) {
        mailOptions.attachments.push({
          filename: file.originalname || 'screenshot.jpg',
          path: file.path
        });
      }

      const info = await transporter.sendMail(mailOptions);
      
      console.log('Message sent: %s', info.messageId);
      // Link para visualizar e-mail se for Ethereal
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('Preview URL: %s', previewUrl);
      }

      // Se enviou o e-mail, podemos apagar o arquivo temporário se desejar
      // Mas o multer salva em uploads/, vamos manter por enquanto ou apagar depois de enviar.
      // if (file) fs.unlinkSync(file.path);

      return res.status(200).json({ 
        success: true, 
        message: 'Relatório enviado com sucesso!',
        previewUrl 
      });

    } catch (error: any) {
      console.error('Erro ao processar suporte:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Falha ao enviar relatório. Tente novamente mais tarde.' 
      });
    }
  }
}

export const supportController = new SupportController();
