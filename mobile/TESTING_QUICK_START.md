# 🧪 Guia Rápido de Testes - MyWay Mobile

## ⚡ Execução Rápida

```bash
# Executar todos os testes
npm test

# Ver cobertura de código
npm run test:coverage

# Modo watch (para desenvolvimento)
npm run test:watch

# Verbose (mais detalhes)
npm run test:verbose
```

## 📊 Status Atual

- ✅ **133 testes** implementados
- ✅ **18 suites** de teste
- ✅ **100%** dos testes passando
- ✅ **70%+** de cobertura nos arquivos principais

## 📁 Estrutura

```
__tests__/
├── components/      # Testes de componentes React
├── hooks/           # Testes de hooks personalizados
├── utils/           # Testes de funções utilitárias
├── requests/        # Testes de chamadas de API
├── integration/     # Testes de integração
├── services/        # Testes de serviços
└── README.md        # Documentação completa
```

## 🎯 Arquivos com 100% de Cobertura

- `components/BackButton.tsx`
- `components/Card.tsx`
- `components/Checkbox.tsx`
- `components/ProgressBar.tsx`
- `hooks/useSession.tsx`
- `utils/*` (todos os arquivos utils)
- `requests/user/*` (maioria dos arquivos)

## 🔧 Configuração

A configuração está em:

- `jest.config.js` - Configuração principal do Jest
- `jest.setup.js` - Setup global e mocks

## 📖 Documentação Completa

- **`__tests__/README.md`** - Guia detalhado de testes
- **`TESTING_SUMMARY.md`** - Resumo completo da implementação

## 🚀 Para Desenvolvedores

### Antes de fazer commit:

```bash
npm test
```

### Antes de fazer PR:

```bash
npm run test:coverage
```

### Durante desenvolvimento:

```bash
npm run test:watch
```

## 💡 Dicas

1. **Teste específico**: `npm test -- arquivo.test.ts`
2. **Por padrão**: `npm test -- --testNamePattern="nome do teste"`
3. **Limpar cache**: `npm test -- --clearCache`
4. **Debug**: Adicione `console.log` e execute com `--verbose`

## 📞 Suporte

Veja a documentação completa em `__tests__/README.md` para:

- Exemplos de código
- Troubleshooting
- Boas práticas
- Como adicionar novos testes

---

✅ **Tudo pronto para usar!**
