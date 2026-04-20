const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const API_PROD = 'https://dogdex-backend.onrender.com';

console.log('\n🚀 DogDex - Build de Desenvolvimento Android');
console.log('-------------------------------------------');
console.log('Qual API você deseja utilizar neste build?');
console.log('1) Local (Detector automático de IP / http://localhost:3000)');
console.log('2) Produção (Render: ' + API_PROD + ')');
console.log('-------------------------------------------');

rl.question('Escolha uma opção (1 ou 2): ', (answer) => {
  let envVars = 'APP_ENV=development';
  
  if (answer.trim() === '2') {
    console.log('\n✅ Configurando para usar API de PRODUÇÃO...');
    envVars += ` EXPO_PUBLIC_API_URL=${API_PROD}`;
  } else {
    console.log('\n✅ Configurando para usar API LOCAL (Auto-detect)...');
  }

  // No Windows, usamos cross-env para garantir que o prebuild e o gradle recebam as envs
  const buildCmd = `cross-env ${envVars} npx expo prebuild && cd android && .\\gradlew.bat assembleDebug`;

  console.log(`\n🛠️ Iniciando build:\n> ${buildCmd}\n`);

  try {
    execSync(buildCmd, { stdio: 'inherit' });
    console.log('\n✨ Build concluído com sucesso!');
  } catch (err) {
    console.error('\n❌ Erro durante o build:', err.message);
    process.exit(1);
  } finally {
    rl.close();
  }
});
