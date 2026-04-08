# DogDex 🐾
![version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![expo](https://img.shields.io/badge/expo-SDK_55-black.svg) ![tensorflow](https://img.shields.io/badge/tensorflow-JS-orange.svg)

DogDex é um ecossistema inteligente projetado para identificar raças de cachorros com extrema precisão usando o modelo de Deep Learning **EfficientNetB0**. Com um design de hardware nostálgico e tátil inspirado nos clássicos _Scanners_ (Pokedex), o app oferece uma experiência audiovisual rica para capturar e mapear informações sobre o seu pet.

## ✨ Novidades da V1.0 (Pokedex UI Edition)
- **Design de Scanner Físico:** Interface com botões táteis, molduras em relevo 3D e um background nativo com gradiente radial.
- **Efeitos Sonoros Nativos:** O app agora responde às interações graças aos bindings do `expo-av`, reproduzindo notificações sonoras para os cenários de _Boot, Target Found e Scanning Fail_.
- **Display LDC Interativo:** Feed da câmera e diagnósticos do Scanner expostos numa representação estética retrô.
- **Histórico DogDex:** Persistência local de capturas com geolocalização automática (Lat/Long) e armazenamento permanente de imagens.
- **Narração de Voz (TTS):** Funcionalidade opcional de leitura dos resultados para maior acessibilidade, com narração natural em português.
- **Nova Splash Screen**: Uma identidade visual premium e focada no momento que você clica no APP.

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

### 2. O Roteador (`app/.env`)
Conecte o App à nave-mãe.
- **Produção (Cloud):**
  ```env
  EXPO_PUBLIC_API_URL=https://dogdex-backend.onrender.com
  ```
- **Local (Seu PC):**
  ```env
  EXPO_PUBLIC_API_URL=http://<SEU_IP_LOCAL>:3000
  ```

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

## ☁️ Arquitetura e Nuvem (Render)

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
