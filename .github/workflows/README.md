# 🚀 CI/CD com GitHub Actions - Guia Completo

Este guia explica como configurar e usar a integração contínua (CI) e deploy contínuo (CD) no projeto MyWay usando GitHub Actions.

## 📋 Índice

- [O que é CI/CD?](#o-que-é-cicd)
- [Estrutura dos Workflows](#estrutura-dos-workflows)
- [Configuração Inicial](#configuração-inicial)
- [Workflows Disponíveis](#workflows-disponíveis)
- [Como Configurar Deploy](#como-configurar-deploy)
- [Secrets e Variáveis](#secrets-e-variáveis)
- [Troubleshooting](#troubleshooting)

## 🤔 O que é CI/CD?

**CI (Continuous Integration)** - Integração Contínua:
- Executa testes automaticamente quando você faz push ou abre um PR
- Verifica se o código compila corretamente
- Garante que a cobertura de testes seja mantida
- Identifica erros antes de mergear código

**CD (Continuous Deployment)** - Deploy Contínuo:
- Faz deploy automático quando código é mergeado na branch main
- Atualiza seu servidor/aplicativo automaticamente
- Reduz erros manuais no processo de deploy

## 📁 Estrutura dos Workflows

O projeto tem 3 workflows principais:

```
.github/workflows/
├── mobile-ci.yml    # CI para o app mobile (React Native/Expo)
├── server-ci.yml    # CI para o servidor (Node.js/Prisma)
└── deploy.yml       # Deploy automático (produção)
```

## ⚙️ Configuração Inicial

### 1. Verificar se está no GitHub

Certifique-se de que seu repositório está no GitHub:

```bash
git remote -v
```

Deve mostrar algo como:
```
origin  https://github.com/Alexandre2107/MyWay.git (fetch)
origin  https://github.com/Alexandre2107/MyWay.git (push)
```

### 2. Os Workflows Já Estão Criados!

Os arquivos em `.github/workflows/` já foram criados. Agora basta fazer push:

```bash
git add .github/workflows/
git commit -m "ci: adicionar workflows do GitHub Actions"
git push origin main
```

### 3. Verificar Execução

Acesse seu repositório no GitHub:
1. Vá em **Actions** (menu superior)
2. Você verá os workflows sendo executados
3. Clique em qualquer workflow para ver os detalhes

## 🔄 Workflows Disponíveis

### 1️⃣ Mobile CI (`mobile-ci.yml`)

**Quando executa:**
- Push na branch `main` ou `develop` que modifique arquivos em `mobile/`
- Pull Requests para `main` ou `develop` que modifiquem `mobile/`

**O que faz:**
- ✅ Instala dependências
- ✅ Executa todos os testes
- ✅ Gera relatório de cobertura
- ✅ Verifica TypeScript
- ✅ Verifica formatação do código

**Visualizar no GitHub:**
```
Actions → Mobile CI
```

### 2️⃣ Server CI (`server-ci.yml`)

**Quando executa:**
- Push na branch `main` ou `develop` que modifique arquivos em `server/`
- Pull Requests para `main` ou `develop` que modifiquem `server/`

**O que faz:**
- ✅ Cria banco de dados PostgreSQL temporário
- ✅ Executa migrations do Prisma
- ✅ Verifica TypeScript
- ✅ Executa testes (se configurados)
- ✅ Faz build do projeto

**Visualizar no GitHub:**
```
Actions → Server CI
```

### 3️⃣ Deploy (`deploy.yml`)

**Quando executa:**
- Push na branch `main` (apenas)
- Manualmente via GitHub Actions UI

**O que faz:**
- 🚀 Build do servidor
- 🚀 Deploy (quando configurado)

## 🚀 Como Configurar Deploy

O arquivo `deploy.yml` tem várias opções comentadas. Escolha uma plataforma:

### Opção 1: Heroku (Mais Fácil)

1. **Criar conta no Heroku:**
   - Acesse https://heroku.com e crie uma conta gratuita
   - Instale o Heroku CLI: `brew install heroku/brew/heroku`

2. **Criar app:**
   ```bash
   heroku create myway-server
   heroku addons:create heroku-postgresql:mini
   ```

3. **Obter API Key:**
   ```bash
   heroku authorizations:create -d "GitHub Actions"
   ```
   Copie o Token gerado

4. **Configurar Secret no GitHub:**
   - Vá em: `Settings → Secrets and variables → Actions`
   - Clique em `New repository secret`
   - Nome: `HEROKU_API_KEY`
   - Valor: Cole o token do Heroku

5. **Descomentar no deploy.yml:**
   ```yaml
   # Remova o # das linhas do Heroku (linhas 34-40)
   - name: 🚀 Deploy para Heroku
     uses: akhileshns/heroku-deploy@v3.12.14
     with:
       heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
       heroku_app_name: "myway-server"
       heroku_email: "seu-email@email.com"
       appdir: "server"
   ```

### Opção 2: Railway (Recomendado)

1. **Criar conta:**
   - Acesse https://railway.app
   - Conecte com GitHub

2. **Criar projeto:**
   - New Project → Deploy from GitHub repo
   - Selecione MyWay
   - Configure: Root Directory = `server`

3. **Obter Token:**
   - Settings → Tokens → Create Token

4. **Configurar Secret:**
   - GitHub: `Settings → Secrets → New secret`
   - Nome: `RAILWAY_TOKEN`
   - Valor: Cole o token

5. **Descomentar no deploy.yml:**
   ```yaml
   # Remova o # das linhas do Railway (linhas 45-49)
   ```

### Opção 3: VPS (Servidor Próprio)

1. **Preparar servidor:**
   ```bash
   # No seu VPS
   sudo apt update
   sudo apt install nodejs npm postgresql
   npm install -g pm2
   ```

2. **Criar chave SSH:**
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions"
   cat ~/.ssh/id_rsa.pub  # Adicionar ao servidor
   cat ~/.ssh/id_rsa      # Copiar chave privada
   ```

3. **Configurar Secrets:**
   - `VPS_HOST`: IP do servidor (ex: 192.168.1.100)
   - `VPS_USERNAME`: usuário SSH (ex: ubuntu)
   - `VPS_SSH_KEY`: chave privada copiada

4. **Descomentar no deploy.yml:**
   ```yaml
   # Remova o # das linhas do VPS (linhas 57-69)
   ```

### Opção 4: Expo EAS (Mobile)

1. **Criar conta Expo:**
   ```bash
   npx expo login
   ```

2. **Configurar EAS:**
   ```bash
   cd mobile
   npm install -g eas-cli
   eas build:configure
   ```

3. **Obter token:**
   ```bash
   expo whoami
   eas token:create
   ```

4. **Configurar Secret:**
   - Nome: `EXPO_TOKEN`
   - Valor: Token do EAS

5. **Descomentar no deploy.yml:**
   ```yaml
   # Remova o # das linhas do Expo (linhas 100-112)
   ```

## 🔐 Secrets e Variáveis

### Como Adicionar Secrets

1. Vá para seu repositório no GitHub
2. `Settings` → `Secrets and variables` → `Actions`
3. Clique em `New repository secret`
4. Adicione o nome e valor
5. Clique em `Add secret`

### Secrets Comuns

| Secret | Descrição | Onde Obter |
|--------|-----------|------------|
| `HEROKU_API_KEY` | API Key do Heroku | `heroku auth:token` |
| `RAILWAY_TOKEN` | Token do Railway | Railway Dashboard → Settings |
| `EXPO_TOKEN` | Token do Expo | `eas token:create` |
| `VPS_HOST` | IP do servidor VPS | Seu provedor de VPS |
| `VPS_SSH_KEY` | Chave SSH privada | `cat ~/.ssh/id_rsa` |
| `DATABASE_URL` | URL do banco de dados | Seu provedor de DB |

### Variáveis de Ambiente

Para adicionar variáveis de ambiente (não secretas):
1. `Settings` → `Secrets and variables` → `Actions`
2. Aba `Variables`
3. `New repository variable`

## 🎯 Como Usar

### Desenvolvimento Diário

1. **Criar branch:**
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```

2. **Fazer mudanças e commit:**
   ```bash
   git add .
   git commit -m "feat: adicionar nova funcionalidade"
   git push origin feature/nova-funcionalidade
   ```

3. **Abrir Pull Request:**
   - No GitHub, clique em "Compare & pull request"
   - Os workflows de CI executarão automaticamente
   - Aguarde ✅ verde antes de mergear

### Deploy para Produção

1. **Mergear PR na main:**
   - Após aprovação e CI passar
   - Clique em "Merge pull request"

2. **Deploy automático:**
   - O workflow `deploy.yml` executa automaticamente
   - Acompanhe em `Actions → Deploy`

3. **Deploy manual (se necessário):**
   - `Actions` → `Deploy` → `Run workflow`
   - Selecione a branch `main`
   - Clique em `Run workflow`

## 🔍 Monitorar Execuções

### Ver Logs

1. Acesse `Actions` no GitHub
2. Clique no workflow que deseja ver
3. Clique na execução específica
4. Clique no job (ex: "Run Tests")
5. Expanda os steps para ver logs detalhados

### Status dos Workflows

No README do projeto, você pode adicionar badges:

```markdown
![Mobile CI](https://github.com/Alexandre2107/MyWay/workflows/Mobile%20CI/badge.svg)
![Server CI](https://github.com/Alexandre2107/MyWay/workflows/Server%20CI/badge.svg)
```

## 🐛 Troubleshooting

### ❌ Teste falhou no CI mas passa localmente

**Problema:** Diferenças de ambiente

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm test
```

### ❌ TypeScript errors no CI

**Problema:** Tipos faltando ou versão diferente

**Solução:**
```bash
# Verificar localmente
npx tsc --noEmit

# Se passar, commitar o tsconfig.json
git add tsconfig.json
git commit -m "fix: atualizar configuração TypeScript"
```

### ❌ Deploy falha com erro de migration

**Problema:** Migrations do Prisma não aplicadas

**Solução:**
1. Verificar se `DATABASE_URL` está configurado nos secrets
2. Adicionar step antes do deploy:
   ```yaml
   - name: Run Migrations
     run: npx prisma migrate deploy
     env:
       DATABASE_URL: ${{ secrets.DATABASE_URL }}
   ```

### ❌ Workflow não está executando

**Possíveis causas:**
1. Path filters - mudanças não estão nos arquivos especificados
2. Branch incorreta - verifique se está na main/develop
3. Workflow desabilitado - vá em Actions e habilite

**Verificar:**
```bash
# Ver quais arquivos foram modificados
git diff --name-only HEAD~1

# Forçar trigger (push vazio)
git commit --allow-empty -m "ci: forçar execução do workflow"
git push
```

### 🔑 Secret não está funcionando

**Solução:**
1. Verifique se o nome está correto (case-sensitive)
2. Verifique se não tem espaços antes/depois
3. Tente recriar o secret
4. Secrets não funcionam em forks (apenas no repo principal)

## 📊 Cobertura de Testes

### Ver Relatório de Cobertura

1. Após CI executar, vá em `Actions`
2. Clique na execução do `Mobile CI`
3. Veja o summary com % de cobertura
4. Em PRs, um comentário é adicionado automaticamente

### Configurar Codecov (Opcional)

1. Acesse https://codecov.io
2. Conecte com GitHub
3. Adicione o repositório MyWay
4. Copie o token
5. Adicione secret `CODECOV_TOKEN`

Badge no README:
```markdown
[![codecov](https://codecov.io/gh/Alexandre2107/MyWay/branch/main/graph/badge.svg)](https://codecov.io/gh/Alexandre2107/MyWay)
```

## 🎓 Boas Práticas

### ✅ DO

- ✅ Sempre faça push em branches e abra PRs
- ✅ Aguarde CI passar antes de mergear
- ✅ Mantenha cobertura de testes acima de 75%
- ✅ Use mensagens de commit semânticas (feat, fix, chore)
- ✅ Revise logs de CI quando falhar

### ❌ DON'T

- ❌ Não faça push direto na main
- ❌ Não ignore erros do CI
- ❌ Não commite secrets no código
- ❌ Não desabilite workflows sem motivo
- ❌ Não use `--no-verify` para pular checks

## 📚 Recursos Adicionais

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Expo EAS Docs](https://docs.expo.dev/eas/)
- [Heroku Deployment](https://devcenter.heroku.com/categories/deployment)
- [Railway Docs](https://docs.railway.app/)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

## 🆘 Precisa de Ajuda?

1. Verifique os logs em `Actions` no GitHub
2. Consulte este guia
3. Abra uma issue no repositório
4. Entre em contato com o time

---

**Criado em:** Dezembro 2024  
**Versão:** 1.0.0  
**Autor:** Alexandre Rodrigues
