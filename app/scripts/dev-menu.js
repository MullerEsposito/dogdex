/* eslint-env node */
const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Caminho do .env.local na raiz da pasta app
const envLocalPath = path.resolve(process.cwd(), '.env.local');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const API_PROD = 'https://dogdex-backend.onrender.com';
const API_DEVELOPMENT = 'https://dogdex-backend-development.onrender.com';

console.log('\n===========================================');
console.log('🚀 DogDex - Gerenciador de Ambiente');
console.log('===========================================');

const main = async () => {
  // 1. Seleção de API
  console.log('\n1. Qual API você deseja utilizar?');
  console.log('-------------------------------------------');
  console.log('1) Local (Auto-detect IP / localhost)');
  console.log('2) Produção (Render: ' + API_PROD + ')');
  console.log('3) Desenvolvimento (Render: ' + API_DEVELOPMENT + ')');
  
  const apiOption = await ask('Escolha uma opção (1, 2 ou 3): ');
  
  let apiLabel = '';
  let apiUrl = '';

  if (apiOption.trim() === '3') {
    apiLabel = 'DESENVOLVIMENTO (Render)';
    apiUrl = API_DEVELOPMENT;
  } else if (apiOption.trim() === '2') {
    apiLabel = 'PRODUÇÃO (Render)';
    apiUrl = API_PROD;
  } else {
    apiLabel = 'LOCAL (Auto-detect)';
    apiUrl = ''; // Deixa vazio para o auto-detect do api.ts funcionar
  }

  // Persistir no .env.local para o Expo ler com certeza
  let envContent = `APP_ENV=development\n`;
  if (apiUrl) {
    envContent += `EXPO_PUBLIC_API_URL=${apiUrl}\n`;
  }
  
  fs.writeFileSync(envLocalPath, envContent);
  console.log(`\n✅ Arquivo .env.local atualizado para: ${apiLabel}`);

  // 2. Seleção de Ação
  console.log('\n2. O que você deseja fazer agora?');
  console.log('-------------------------------------------');
  console.log('1) Iniciar Servidor de Desenvolvimento (Start)');
  console.log('2) Gerar APK Android (Build Debug)');
  console.log('3) Apenas Prebuild (Configurar pastas nativas)');
  
  const actionOption = await ask('Escolha uma opção (1, 2 ou 3): ');

  let command = '';
  if (actionOption.trim() === '2') {
    console.log(`\n🛠️  Preparando BUILD...`);
    command = `npx expo prebuild && cd android && .\\gradlew.bat assembleDebug`;
  } else if (actionOption.trim() === '3') {
    console.log(`\n⚙️  Executando PREBUILD...`);
    command = `npx expo prebuild`;
  } else {
    console.log(`\n📡 Iniciando SERVIDOR...`);
    // Usamos -c para limpar o cache e garantir que o novo .env.local seja lido
    command = `npx expo start --dev-client -c`;
  }

  console.log(`\n> Executando: ${command}\n`);

  try {
    execSync(command, { stdio: 'inherit', shell: true });
  } catch (err) {
    console.error('\n❌ Erro ao executar comando.');
  } finally {
    rl.close();
  }
};

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

main();
