# DogDex 🐾

DogDex é um ecossistema inteligente projetado para identificar raças de cachorros com alta precisão usando o modelo **EfficientNetB0** (TensorFlow) e fornecer informações detalhadas sobre o comportamento e origem dos pets.

## 🏗️ Estrutura do Projeto (Monorepo)

- **`app/`**: Aplicativo móvel (Expo/React Native).
- **`backend/`**: Servidor Node.js + TensorFlow.js para inferência.
- **`shared/`**: Lógica de tipos e constantes compartilhada.
- **`model/`**: O "cérebro" do projeto (Modelo EfficientNetB0 + Labels).

---

## 🚀 Como Executar

### 1. Preparação
A partir da raiz do projeto, instale todas as dependências:
```bash
npm install
```

### 2. Configuração do App (.env)
Para que o celular consiga falar com o servidor, crie o arquivo `app/.env`:
- **Produção (Render):**
  ```env
  EXPO_PUBLIC_API_URL=https://dogdex-backend.onrender.com
  ```
- **Local:**
  ```env
  EXPO_PUBLIC_API_URL=http://<SEU_IP_LOCAL>:3000
  ```

### 3. Rodando o Backend
Você pode rodar o servidor de IA localmente:
```bash
npm run backend:dev
```
*O servidor é resiliente e encontrará a pasta `model` automaticamente tanto na raiz quanto na pasta backend.*

### 4. Rodando o App Mobile
```bash
npm run app:start
```
Escaneie o QR Code com o aplicativo **Expo Go** no seu celular.

---

## ☁️ Deploy no Render (Dica de Ouro)

Para que este monorepo funcione no Render, usamos a estratégia de **Cópia Interna** no Build Command:
```bash
cp -r shared backend/src/shared && npm install && npm run build --workspace=backend
```
**Start Command:** `node backend/dist/server.js`

---

## 🧠 Inteligência Artificial
- **Modelo**: EfficientNetB0 (Otimizado para mobile).
- **Precisão**: Treinado para identificar **120 raças** de cachorros do dataset Stanford Dogs.
- **Performance**: Inferência média de < 200ms após o carregamento inicial.

## 🛠️ Tecnologias
- **Frontend**: React Native, Expo Router.
- **Backend**: Node.js, Express, @tensorflow/tfjs-node.
- **Estilo**: Vanilla CSS (Premium Design System).

---
## 👨‍💻 Autor

**Müller Esposito**
- GitHub: [@MullerEsposito](https://github.com/MullerEsposito)
- LinkedIn: [Müller Esposito](https://www.linkedin.com/in/mulleresposito/)


