export const getResetPasswordHTML = (token: string) => {
  const deepLink = `dogdex://reset-password?token=${token}`;

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DogDex - Redefinir Senha</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          color: #111827;
        }
        .card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          width: 90%;
        }
        h1 { font-size: 24px; margin-bottom: 16px; font-weight: 800; letter-spacing: -0.025em; }
        p { color: #4b5563; margin-bottom: 32px; line-height: 1.5; }
        .btn {
          display: inline-block;
          background-color: #000;
          color: white;
          padding: 16px 32px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
          transition: transform 0.2s, background-color 0.2s;
        }
        .btn:active { transform: scale(0.95); }
        .logo { font-size: 48px; margin-bottom: 20px; }
        .footer { margin-top: 24px; font-size: 14px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">🐕</div>
        <h1>Recuperação de Senha</h1>
        <p>Clique no botão abaixo para abrir o DogDex e definir sua nova senha.</p>
        <a href="${deepLink}" class="btn">Abrir no DogDex</a>
        <div class="footer">
          Se o app não abrir automaticamente, verifique se ele está instalado.
        </div>
      </div>
      <script>
        setTimeout(() => {
          window.location.href = "${deepLink}";
        }, 1000);
      </script>
    </body>
    </html>
  `;
};
