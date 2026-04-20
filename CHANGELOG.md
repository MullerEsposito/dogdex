# Changelog - DogDex

Acompanhe todas as mudanças, correções e melhorias introduzidas em cada versão do projeto DogDex.

## [0.2.0] - Em Desenvolvimento

### Added
- **Identificação de Usuário**: Suporte a envio de Nome e E-mail em relatos de erro e sugestões.
- **Estrutura de Testes E2E**: Implementação de suíte de testes automatizados com Playwright para garantir a estabilidade do fluxo de suporte.
- **Testes de Integração**: Testes JUnit-style no backend para validar lógica de envio de e-mails e segurança.

### Fixed
- **Segurança (XSS)**: Implementada sanitização de inputs com escape de caracteres HTML para prevenir injeção de scripts nos e-mails de suporte.
- **Header Injection**: Correção de vulnerabilidade que permitia manipulação de cabeçalhos SMTP via campo de e-mail.

### Security
- **Rate Limiting**: Limitação de 5 requisições por 15 minutos por IP na rota de suporte para evitar spam.
- **Upload Hardening**: Restrição de uploads para arquivos de no máximo 1MB e validação estrita de formatos (apenas JPG/PNG).

---

## [0.1.0] - 2026-04-19

### Added
- **DogDex App**: Lançamento da primeira versão funcional construída com Expo e React Native.
- **Mecanismo de IA**: Integração com modelo TensorFlow.js para classificação de raças de cães em tempo real.
- **Câmera**: Funcionalidade para captura de fotos de cães para análise via IA.
- **Galeria (Suporte)**: Possibilidade de selecionar imagens da biblioteca para anexar a relatos técnicos.
- **Sistema de Suporte**: Criação de formulário básico para envio de relatos técnicos.
- **Backend API**: Servidor Express configurado para processamento de imagens e relatórios.
- **Shared Package**: Biblioteca compartilhada de interfaces TypeScript para garantir consistência entre frontend e backend.
- **Design Premium**: Interface moderna com suporte nativo a Dark Mode e animações fluídas.
