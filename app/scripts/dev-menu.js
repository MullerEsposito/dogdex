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

const os = require('os');

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  const candidates = [];
  
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        // Prioritiza faixas comuns de rede local (Wi-Fi/Ethernet)
        if (alias.address.startsWith('192.168.') || alias.address.startsWith('10.')) {
          return alias.address;
        }
        candidates.push(alias.address);
      }
    }
  }
  
  // Se não achou 192.168 ou 10., pega o primeiro que não seja localhost (pode ser o 172. do WSL)
  return candidates.length > 0 ? candidates[0] : '10.0.2.2';
}

const SUPABASE_PROD_URL = 'https://veditxwieotrywlaqgia.supabase.co';
const SUPABASE_PROD_KEY = 'sb_publishable_Gk-9K1-YE_8WDEvhK41rUA_JrLCMfm9';

const SUPABASE_DEV_URL = 'https://lqoszjkjfvplaqibsrcn.supabase.co';
const SUPABASE_DEV_KEY = 'sb_publishable_9AFIHB_oLj5_qCtwSf0y7w_q63uYPzp';

console.log('\n===========================================');
console.log('🚀 DogDex - Gerenciador de Ambiente');
console.log('===========================================');

const main = async () => {
  console.log('\n1. O que você deseja fazer?');
  console.log('-------------------------------------------');
  console.log('1) Gerar um Artefato (Build APK / Bundle AAB)');
  console.log('2) Iniciar Servidor de Desenvolvimento Local (Start)');
  
  const actionOption = await ask('Escolha uma opção (1 ou 2): ');

  let envContent = '';
  let command = '';

  if (actionOption.trim() === '1') {
    // FLUXO: GERAR ARTEFATO
    console.log('\n2. Qual tipo de artefato você deseja gerar?');
    console.log('-------------------------------------------');
    console.log('1) Build Dev (APK) -> Comunica com Supabase Dev');
    console.log('2) Build Prod (APK) -> Comunica com Supabase Prod e API Prod');
    console.log('3) Bundle Prod (AAB) -> Comunica com Supabase Prod e API Prod');
    
    const buildOption = await ask('Escolha uma opção (1, 2 ou 3): ');

    let targetEnv = null;

    if (buildOption.trim() === '1') {
      // BUILD DEV (Permite escolher a API)
      console.log('\n3. Com qual API o Build Dev deve se comunicar?');
      console.log('-------------------------------------------');
      console.log('1) API Local (Auto-detect IP do Computador)');
      console.log('2) API Desenvolvimento (Render: ' + API_DEVELOPMENT + ')');
      
      const apiOption = await ask('Escolha uma opção (1 ou 2): ');
      const apiUrl = apiOption.trim() === '2' ? API_DEVELOPMENT : `http://${getLocalIpAddress()}:3000`;
      
      envContent = buildEnv('development', apiUrl, SUPABASE_DEV_URL, SUPABASE_DEV_KEY);
      targetEnv = 'development';
      command = `npx expo prebuild && node -e "require('fs').writeFileSync('android/.build_env', 'development')" && cd android && .\\gradlew.bat assembleDebug`;
      console.log(`\n✅ Preparando Build Dev (APK)... (API: ${apiUrl})`);
      
    } else if (buildOption.trim() === '2' || buildOption.trim() === '3') {
      // BUILD PROD / BUNDLE PROD (Força uso da API e DB de Produção)
      envContent = buildEnv('production', API_PROD, SUPABASE_PROD_URL, SUPABASE_PROD_KEY);
      targetEnv = 'production';
      const isBundle = buildOption.trim() === '3';
      command = `npx expo prebuild && node -e "require('fs').writeFileSync('android/.build_env', 'production')" && cd android && .\\gradlew.bat ${isBundle ? 'bundleRelease' : 'assembleRelease'}`;
      console.log(`\n✅ Preparando ${isBundle ? 'Bundle Prod (AAB)' : 'Build Prod (APK)'}...`);
      console.log(`🔒 AMBIENTE TRAVADO EM PRODUÇÃO (API + Supabase)`);
    } else {
      console.log('\n❌ Opção inválida.');
      process.exit(1);
    }

    // Persiste as variáveis no .env.local antes do prebuild
    fs.writeFileSync(envLocalPath, envContent);
    console.log(`📝 Arquivo .env.local gerado com sucesso.`);

    // Prepara a pasta Android baseando-se no cache
    prepareAndroidFolder(targetEnv);

  } else if (actionOption.trim() === '2') {
    // FLUXO: INICIAR SERVIDOR
    console.log('\n2. Com qual API o servidor de dev deve se comunicar?');
    console.log('-------------------------------------------');
    console.log('1) API Local (Auto-detect IP do Computador)');
    console.log('2) API Desenvolvimento (Render: ' + API_DEVELOPMENT + ')');
    
    const apiOption = await ask('Escolha uma opção (1 ou 2): ');
    const apiUrl = apiOption.trim() === '2' ? API_DEVELOPMENT : `http://${getLocalIpAddress()}:3000`;
    
    envContent = buildEnv('development', apiUrl, SUPABASE_DEV_URL, SUPABASE_DEV_KEY);
    // Usamos -c para limpar o cache e garantir que o novo .env.local seja lido
    command = `npx expo start --dev-client -c`;
    console.log(`\n✅ Iniciando Servidor Local... (API: ${apiUrl})`);
    
    // Persiste as variáveis no .env.local
    fs.writeFileSync(envLocalPath, envContent);
    console.log(`📝 Arquivo .env.local gerado com sucesso.`);
  } else {
    console.log('\n❌ Opção inválida.');
    process.exit(1);
  }

  console.log(`\n> Executando: ${command}\n`);
  try {
    execSync(command, { stdio: 'inherit', shell: true });
  } catch {
    console.error('\n❌ Erro ao executar comando.');
  } finally {
    rl.close();
  }
};

function buildEnv(appEnv, apiUrl, supabaseUrl, supabaseKey) {
  let content = `APP_ENV=${appEnv}\n`;
  if (apiUrl) content += `EXPO_PUBLIC_API_URL=${apiUrl}\n`;
  content += `EXPO_PUBLIC_SUPABASE_URL=${supabaseUrl}\n`;
  content += `EXPO_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}\n`;
  return content;
}

function prepareAndroidFolder(targetEnv) {
  const androidPath = path.resolve(process.cwd(), 'android');
  const markerPath = path.resolve(androidPath, '.build_env');
  const devPath = path.resolve(process.cwd(), 'android_dev');
  const prodPath = path.resolve(process.cwd(), 'android_prod');

  let currentEnv = null;
  if (fs.existsSync(androidPath)) {
    if (fs.existsSync(markerPath)) {
      currentEnv = fs.readFileSync(markerPath, 'utf8').trim();
    } else {
      currentEnv = 'unknown';
    }

    if (currentEnv === targetEnv) {
      console.log(`\n♻️  Pasta android já configurada para ${targetEnv}. Aproveitando cache nativo!`);
      return; 
    }

    if (currentEnv === 'development') {
      if (fs.existsSync(devPath)) fs.rmSync(devPath, { recursive: true, force: true });
      fs.renameSync(androidPath, devPath);
      console.log(`\n📦 Guardando cache nativo de development em /android_dev...`);
    } else if (currentEnv === 'production') {
      if (fs.existsSync(prodPath)) fs.rmSync(prodPath, { recursive: true, force: true });
      fs.renameSync(androidPath, prodPath);
      console.log(`\n📦 Guardando cache nativo de production em /android_prod...`);
    } else {
      fs.rmSync(androidPath, { recursive: true, force: true });
      console.log(`\n🗑️  Limpando pasta android (build antigo sem cache)...`);
    }
  }

  const targetBackupPath = targetEnv === 'development' ? devPath : prodPath;
  if (fs.existsSync(targetBackupPath)) {
    fs.renameSync(targetBackupPath, androidPath);
    console.log(`\n♻️  Restaurando cache nativo de ${targetEnv}...`);
  }
}

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

main();
