const fs = require('fs');
const path = require('path');

/**
 * Script para sincronizar a versão do package.json da raiz com todos os workspaces e arquivos de configuração.
 */

const rootPkgPath = path.resolve(__dirname, '../package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const version = rootPkg.version;

console.log(`🚀 Iniciando sincronização para a versão: ${version}`);

const targets = [
  'app/package.json',
  'backend/package.json',
  'shared/package.json',
  'ml/package.json',
  'model/package.json',
  'app/app.json' // Caso especial para o Expo
];

targets.forEach(targetPath => {
  const fullPath = path.resolve(__dirname, '..', targetPath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Arquivo não encontrado: ${targetPath}`);
    return;
  }

  try {
    const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    
    if (targetPath.endsWith('app.json')) {
      // Caso especial Expo app.json
      if (content.expo) {
        content.expo.version = version;
        // Opcional: Incrementar versionCode automaticamente para Android se necessário
        // content.expo.android.versionCode += 1;
      }
    } else {
      // package.json padrão
      content.version = version;
    }

    fs.writeFileSync(fullPath, JSON.stringify(content, null, 2) + '\n');
    console.log(`✅ Atualizado: ${targetPath}`);
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${targetPath}:`, error.message);
  }
});

console.log('\n✨ Sincronização concluída com sucesso!');
