# DogDex 🐾
![version](https://img.shields.io/badge/version-0.3.0-blue.svg) ![expo](https://img.shields.io/badge/expo-SDK_55-black.svg) ![tensorflow](https://img.shields.io/badge/tensorflow-JS-orange.svg)

DogDex é um ecossistema inteligente projetado para identificar raças de cachorros com extrema precisão usando o modelo de Deep Learning **EfficientNetB0**. Com um design de hardware nostálgico e tátil inspirado nos clássicos _Scanners_ (Pokedex), o app oferece uma experiência audiovisual rica para capturar e mapear informações sobre o seu pet.

## 📺 Demonstração em Vídeo

https://github.com/user-attachments/assets/ba0bfbfe-5c0b-4ed6-8766-26c82e2cbef6

## ✨ Principais Funcionalidades
- **Design de Scanner Físico:** Interface com botões táteis, molduras em relevo 3D e um background nativo com gradiente radial.
- **Efeitos Sonoros Nativos:** O app agora responde às interações graças aos bindings do `expo-av`.
- **Sincronização em Nuvem (Cloud Sync)**: Sistema robusto de sincronização que mantém seu histórico DogDex seguro no Supabase, com suporte a deduplicação inteligente e "soft delete".
- **Autenticação Híbrida**: Suporte a login social (Google) e login tradicional por e-mail/senha.
- **Perfil de Usuário**: Gerenciamento de avatar (via `expo-image`) e dados pessoais.
- **Display LDC Interativo:** Feed da câmera e diagnósticos do Scanner em tempo real.
- **Histórico DogDex:** Persistência local de capturas com geolocalização automática.
- **Narração de Voz (TTS):** Funcionalidade opcional de leitura dos resultados.
- **Nova Splash Screen**: Identidade visual premium.

## 🏗️ Estrutura do Monorepo

- **`app/`**: Aplicativo móvel (React Native/Expo) arquitetado modularmente (`components`, `screens`, `hooks` e `services`).
- **`backend/`**: Servidor de análise REST (Node.js + TensorFlow.js).
- **`shared/`**: Lógica contínua, tipos utilitários (DTOs) e dicionário genealógico de cachorros.
- **`model/`**: Pesos binários do "Cérebro" de classificação MobileNet/EfficientNet.

---

## 🚀 Como Executar Localmente

### 1. Inicializando as Tradições (Raiz do Repo)
Para começar os pacotes básicos, incluindo todas as subpastas `Workspaces`:
```bash
npm install
```

### 2. Gestão de Ambiente (Menu Interativo) 🛠️
Esqueça a edição manual de arquivos `.env`. O DogDex agora possui um menu interativo para configurar as URLs da API automaticamente:

```bash
cd app
npm run dev
```

Este comando abrirá um menu onde você pode escolher o destino da "nave-mãe":
- **Localhost (Automatic IP)**: Detecta o IP da sua máquina e configura o App para o seu backend local.
- **Production (Render)**: Aponta para a API oficial em produção.
- **Development (Dev-Server)**: Aponta para o ambiente de staging na nuvem.

O script gera um arquivo `.env.local` persistente que o Expo utiliza para injetar a variável `EXPO_PUBLIC_API_URL` sem risco de vazar segredos para o Git.

### 3. Rodando o Servidor Analítico
No diretório inicial:
```bash
npm run backend:dev
```

### 4. Rodando o Aplicativo (Development Build Personalizado)
> **⚠️ Aviso Importante:** A V1.0 consome módulos com dependência pesada de _C++_ e bibliotecas puramente iOS/Android para som e renderização matricial (SVG/AV). **O aplicativo não tem suporte básico ao visualizador generalista "Expo Go".**

Você deve construir um instalador base (Desenvolvedor) ou Compilar um APK pelo EAS na pasta `app/`:
```bash
cd app
npx eas build -p android --profile development
```
Instale aquele `.apk` no seu celular, e então inicie o Bundler passando a bandeira orientando os módulos nativos modificados pelo React:
```bash
npx expo start --dev-client
```

---

## ⚙️ Configuração de Build (Android)

Para garantir a estabilidade do build de produção em ambiente **Windows + Monorepo**, as seguintes diretrizes foram estabelecidas:

### 1. Requisitos de Ambiente
- **Android SDK**: Versão **36** (VanillaIceCream) instalada via Android Studio.
- **Build-Tools**: Versão **35.0.0**.
- **Java**: OpenJDK **17** configurado no `JAVA_HOME`.
- **Node.js**: v18+.

### 2. Estabilidade Monorepo (Windows Fix)
Devido a limitações do Windows com caminhos longos e symlinks em monorepos, o projeto utiliza:
- **Root Bridge**: Um arquivo `index.js` na raiz do repositório que serve como ponte para o `app/index.js`. **Não remova o `index.js` da raiz.**
- **Variável de Controle**: Sempre defina `EXPO_NO_METRO_WORKSPACE_ROOT=1` ao rodar builds nativos para evitar recursão infinita no scanner do Metro.

### 3. Gerando APK Localmente (Produção)
Se desejar gerar o binário de produção sem usar o EAS Cloud:
```powershell
# Na raiz do repositório
$env:EXPO_NO_METRO_WORKSPACE_ROOT=1
cd app/android
.\gradlew.bat assembleRelease
```
O APK será gerado em: `app/android/app/build/outputs/apk/release/app-release.apk`

---

## 🔐 Autenticação e Sincronização

O DogDex utiliza uma camada de persistência em nuvem altamente resiliente:

### 1. Sistema Híbrido de Auth
- **Supabase Auth**: Gerencia sessões, tokens JWT e provedores OAuth (Google).
- **PostgreSQL Profile**: Uma tabela `public.User` sincronizada no backend para gerenciar senhas customizadas (via `bcrypt`) e metadados estendidos, permitindo login tradicional mesmo em contas criadas via Social.

### 2. Motor de Sincronização (Sync Engine)
- **Persistência Local**: O app utiliza um hook customizado `useDogdexStorage` que gerencia o estado local de forma ultra-rápida.
- **Sync Automático**: Ao detectar conexão, o app sincroniza itens locais com o Supabase usando uma estratégia de "Update or Insert" baseada em `localId`.
- **Soft Delete**: Registros deletados localmente recebem um status `deleted` que é propagado para a nuvem, garantindo que itens excluídos não "ressuscitem" em outros dispositivos.

---

## ☁️ Arquitetura e Nuvem (Render & Supabase)

A estratégia do Backend foi forjada para não precisar de complexos scripts de _Docker_. Com suporte aos _Environment Variables_ corretos no painel da **Render**, siga o comportamento do _Build Command_:
```bash
cp -r shared backend/src/shared && npm install && npm run build --workspace=backend
```
**Start Command:** `node backend/dist/server.js`

> O modelo neural consome `tf.tidy()` para esterilizar lixos e restos operacionais da placa gráfica. Graças à essa diretriz, a API local atinge as respostas estáveis na métrica de ~30MB mesmo em uso intenso nos testes de estresse.

---

## 🧠 Características da Inteligência Artificial
- **Poder Analítico**: Otimizado para identificar os principais padrões morfológicos de **120 espécies/raças** do dataset de Stanford em milésimos de segundos.
- **Eficiência**: Arquitetado por _Mobile First_.
- **Pipeline Segura**: Tratamento e redimensionamento Bilinear para preservar a estrutura da foto vinda das lentes dos celulares modernos.

---
## 👨‍💻 Autor

Produzido com extrema devoção aos cachorros, café e Type-Safety por **Müller Esposito**.
- GitHub: [@MullerEsposito](https://github.com/MullerEsposito)
- LinkedIn: [Müller Esposito](https://www.linkedin.com/in/mulleresposito/)
