# MyWay

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js instalado
- Expo CLI instalado globalmente (`npm install -g expo-cli`)

### Backend (Server)

1. Navegue até a pasta do servidor:

```bash
cd server
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o banco de dados:

```bash
npx prisma migrate reset
```

Este comando irá resetar o banco de dados, aplicar todas as migrações e executar o seed com dados iniciais.

4. Inicie o servidor:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### Frontend (Mobile)

1. Navegue até a pasta do mobile:

```bash
cd mobile
```

2. Instale as dependências:

```bash
npm install
```

3. **Configure o IP do servidor:**

   Abra o arquivo `mobile/services/api.tsx` e atualize o IP para corresponder ao IP local da sua máquina:

   ```typescript
   export const baseUrlSelect = () => {
     if (useLocalhost) return `http://SEU_IP_LOCAL:3000`; // Ex: http://192.168.0.146:3000
     return "";
   };
   ```

   Para descobrir seu IP local, execute no terminal:

   ```bash
   ipconfig getifaddr en0
   ```

   ⚠️ **Importante:** O IP configurado no `api.tsx` deve ser o mesmo IP da máquina onde o servidor está rodando.

4. Inicie o aplicativo:

```bash
npm start
```

5. Escolha como visualizar o app:
   - Pressione `i` para abrir no iOS Simulator
   - Pressione `a` para abrir no Android Emulator
   - Escaneie o QR Code com o app Expo Go no seu dispositivo físico

## 📝 Comandos Úteis

### Server

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Inicia o servidor compilado
- `npx prisma migrate reset` - Reseta o banco de dados
- `npx prisma studio` - Abre interface visual do banco de dados

### Mobile

- `npm start` - Inicia o Expo
- `npm run ios` - Inicia diretamente no iOS
- `npm run android` - Inicia diretamente no Android

## Recomendações para criar login e credenciais

### Login Aluno 1
- nome: Aluno 1
- Email: aluno1@gmail.com
- RA: 202111020012
- Senha: 123456

### Login Aluno 2
- nome: Aluno 2
- Email: aluno2@gmail.com
- RA: 202111020013
- Senha: 123456

## Login Pai
- Email: pai@gmail.com
- RA: 123456789000
- Senha: 123456



### Recomendações
- criar o Login do pai com um RA diferente dos alunos para evitar conflitos. Criar login do pai primeiro depois os alunos.
