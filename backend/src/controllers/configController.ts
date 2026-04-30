import { Request, Response } from 'express';
import releaseNotesData from '../config/release-notes.json';
import path from 'path';
import fs from 'fs';

// Lê a versão do próprio package.json do backend (que é sincronizado pelo script da raiz)
const getAppVersion = () => {
  try {
    const pkgPath = path.resolve(__dirname, '../../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.version;
  } catch (error) {
    return '0.4.0';
  }
};

export const getVersionConfig = async (req: Request, res: Response) => {
  try {
    const minVersion = process.env.APP_MIN_VERSION;
    const storeUrl = process.env.APP_STORE_URL;

    if (!minVersion || !storeUrl) {
      console.error('❌ ERRO: Variáveis de ambiente APP_MIN_VERSION ou APP_STORE_URL não definidas!');
      return res.status(500).json({
        success: false,
        error: 'Configuração de versão incompleta no servidor'
      });
    }

    const latestVersion = getAppVersion();
    const notes = (releaseNotesData as any)[latestVersion]?.notes || 'Novas melhorias disponíveis.';

    const config = {
      latestVersion,
      minRequiredVersion: minVersion,
      storeUrl: storeUrl,
      releaseNotes: notes,
      forceUpdate: false
    };

    return res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error fetching version config:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao buscar configurações de versão'
    });
  }
};
