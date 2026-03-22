# DogDex 🐾

DogDex é um projeto monorepo projetado para identificar raças de cachorros a partir de fotos usando aprendizado de máquina (TensorFlow.js) e fornecer informações detalhadas sobre as raças identificadas.

## Estrutura do Projeto

Este projeto está organizado como um monorepo usando npm workspaces:

- **`app/`**: Aplicativo móvel construído com Expo e React Native.
- **`backend/`**: Servidor Node.js com Express e TensorFlow.js para análise de imagens.
- **`shared/`**: Tipos e constantes comuns usados tanto pelo mobile quanto pelo backend.
- **`ml/`**: Scripts e notebooks para treinamento do modelo.
- **`model/`**: Modelos TensorFlow.js treinados.

## Pré-requisitos

- **Node.js** (v18 ou superior recomendado)
- **npm** (para gerenciamento de workspaces)
- **Expo Go** (no seu dispositivo móvel para testes físicos)

### Nota Específica para Windows
Se você encontrar o erro `ERR_DLOPEN_FAILED` ao carregar o `@tensorflow/tfjs-node` no Windows, certifique-se de que o arquivo `tensorflow.dll` esteja presente no diretório `node_modules/@tensorflow/tfjs-node/lib/napi-v8/`.

## Primeiros Passos

### 1. Instalar Dependências
A partir do diretório raiz, execute:
```bash
npm install
```

### 2. Iniciar o Backend
O backend precisa estar rodando para analisar as imagens enviadas pelo app.
```bash
npm run backend:dev
```
O servidor iniciará em `http://localhost:3000`.

### 3. Iniciar o Aplicativo Móvel
```bash
npm run app:start
```
- Para **Web**: Pressione `w` no terminal.
- Para **Android/iOS**: Escaneie o código QR com o aplicativo Expo Go.

> [!IMPORTANT]
> Para conectar a partir de um dispositivo físico, certifique-se de que seu celular e seu computador estejam na mesma rede Wi-Fi. O app detecta automaticamente o IP local da sua máquina.

## Funcionalidades Principais

- **Câmera em Tempo Real**: Capture fotos de cachorros diretamente no aplicativo.
- **Identificação de Raças**: Identifica raças comuns como Golden Retriever, Bulldog, Poodle, entre outras.
- **Informações Detalhadas**: Exibe temperamento, níveis de energia e expectativa de vida de cada raça.
- **Limite de Confiança**: O sistema só identifica a raça se o modelo tiver pelo menos 70% de certeza.

## Tecnologias Utilizadas

- **Frontend**: React Native, Expo, Expo Router, Expo Camera.
- **Backend**: Node.js, Express, TensorFlow.js (@tensorflow/tfjs-node).
- **ML**: Python, TensorFlow/Keras (para treinamento).
