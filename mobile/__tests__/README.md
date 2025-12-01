# Documentação de Testes - MyWay Mobile

## 📋 Visão Geral

Este projeto possui uma suíte completa de testes unitários e de integração com cobertura de 70% do código. Os testes são escritos usando Jest e React Native Testing Library.

## 🎯 Objetivo da Cobertura

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## 🗂️ Estrutura de Testes

```
mobile/
├── __tests__/
│   ├── utils/                          # Testes unitários de funções utilitárias
│   │   ├── generate-dates-month.test.ts
│   │   ├── generate-progress-percentage.test.ts
│   │   └── goTo.test.ts
│   ├── components/                     # Testes unitários de componentes React
│   │   ├── Card.test.tsx
│   │   ├── Checkbox.test.tsx
│   │   └── ProgressBar.test.tsx
│   ├── requests/                       # Testes de requisições API
│   │   ├── user/
│   │   │   ├── authenticate-user.test.ts
│   │   │   └── create-user.test.ts
│   │   └── routine/
│   │       └── load-routine-by-user-id.test.ts
│   ├── hooks/                          # Testes de hooks personalizados
│   │   └── useSession.test.tsx
│   └── integration/                    # Testes de integração
│       ├── auth-flow.test.tsx
│       ├── user-management.test.ts
│       └── ui-components.test.tsx
├── jest.config.js                      # Configuração do Jest
└── jest.setup.js                       # Setup e mocks globais
```

## 🚀 Como Executar os Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch

```bash
npm run test:watch
```

### Executar testes com relatório de cobertura

```bash
npm run test:coverage
```

### Executar testes em modo verbose (detalhado)

```bash
npm run test:verbose
```

### Executar testes em CI/CD

```bash
npm run test:ci
```

## 📊 Tipos de Testes

### 1. Testes Unitários

#### Utils (`__tests__/utils/`)

- **generate-dates-month.test.ts**: Testa a geração de datas para calendário mensal
- **generate-progress-percentage.test.ts**: Testa cálculos de porcentagem de progresso
- **goTo.test.ts**: Testa função de navegação

#### Componentes (`__tests__/components/`)

- **Card.test.tsx**: Testa componente de cartão de usuário
- **Checkbox.test.tsx**: Testa componente de checkbox para tarefas
- **ProgressBar.test.tsx**: Testa barra de progresso visual

#### Requests (`__tests__/requests/`)

- **authenticate-user.test.ts**: Testa autenticação de usuário
- **create-user.test.ts**: Testa criação de novos usuários
- **load-routine-by-user-id.test.ts**: Testa carregamento de rotinas

#### Hooks (`__tests__/hooks/`)

- **useSession.test.tsx**: Testa gerenciamento de sessão de usuário

### 2. Testes de Integração

#### auth-flow.test.tsx

Testa o fluxo completo de autenticação:

- Login → Verificar sessão → Logout
- Persistência de sessão
- Atualização de perfil
- Múltiplas tentativas de login
- Gerenciamento de tipos de usuário

#### user-management.test.ts

Testa gerenciamento de usuários:

- Criar usuário e fazer login em sequência
- Criar usuário, autenticar e carregar rotina
- Tratamento de erros (email duplicado)
- Vinculação entre guardian e student
- Verificação de permissões

#### ui-components.test.tsx

Testa integração entre componentes UI:

- Cards com interações
- Checkboxes com gerenciamento de estado
- ProgressBar com cálculo dinâmico
- Combinação de componentes em cenários reais

## 🛠️ Mocks e Stubs

### Mocks Globais (jest.setup.js)

- **AsyncStorage**: Mock do armazenamento local
- **expo-router**: Mock do sistema de rotas
- **expo-font**: Mock de carregamento de fontes
- **expo-splash-screen**: Mock da splash screen
- **Alert**: Mock de alertas nativos
- **react-native-vector-icons**: Mock de ícones
- **DateTimePicker**: Mock do seletor de data/hora

### Mocks Específicos

Os testes utilizam mocks específicos para:

- Requisições API (axios/apiMyWay)
- Autenticação de usuários
- Armazenamento de dados

## 📝 Exemplos de Uso

### Exemplo de Teste Unitário

```typescript
it("deve calcular a porcentagem corretamente", () => {
  expect(generateProgressPercentage(10, 5)).toBe(50);
  expect(generateProgressPercentage(100, 75)).toBe(75);
});
```

### Exemplo de Teste de Componente

```typescript
it("deve renderizar card com props", () => {
  const { getByText } = render(
    <Card title="João" description="Aluno" document="123.456.789-00" />
  );

  expect(getByText("João")).toBeTruthy();
});
```

### Exemplo de Teste de Integração

```typescript
it("deve realizar fluxo completo de autenticação", async () => {
  // Login
  await act(async () => {
    await result.current.login("user@example.com", "password");
  });

  // Verificar sessão
  expect(result.current.isLoggedIn()).toBe(true);

  // Logout
  await act(async () => {
    await result.current.logout();
  });

  expect(result.current.isLoggedIn()).toBe(false);
});
```

## 🎨 Boas Práticas

1. **Arrange-Act-Assert**: Organize seus testes em três seções claras
2. **Isolamento**: Cada teste deve ser independente
3. **Nomenclatura descritiva**: Use nomes que descrevam o comportamento esperado
4. **Cleanup**: Use `beforeEach` e `afterEach` para limpar mocks
5. **Async/Await**: Use corretamente com `act()` e `waitFor()` para operações assíncronas

## 🐛 Debugging

Para debugar testes:

```bash
# Executar um arquivo específico
npm test -- __tests__/utils/generate-dates-month.test.ts

# Executar testes com padrão no nome
npm test -- --testNamePattern="deve calcular"

# Ver output detalhado
npm run test:verbose
```

## 📈 Relatório de Cobertura

Após executar `npm run test:coverage`, um relatório HTML será gerado em:

```
mobile/coverage/lcov-report/index.html
```

Abra este arquivo no navegador para visualizar:

- Arquivos cobertos e não cobertos
- Linhas executadas
- Branches cobertos
- Funções testadas

## 🔧 Configuração

### jest.config.js

Principais configurações:

- Preset: `jest-expo`
- Transform patterns para React Native
- Cobertura mínima de 70%
- Mapeamento de módulos (@/ → raiz do projeto)

### jest.setup.js

- Configuração de mocks globais
- Extensão de matchers do Testing Library
- Supressão de warnings desnecessários

## 📦 Dependências de Teste

```json
{
  "@testing-library/react-native": "^12.x",
  "@testing-library/jest-native": "^5.x",
  "jest": "^29.x",
  "jest-expo": "~51.x",
  "axios-mock-adapter": "^1.x"
}
```

## 🚨 Troubleshooting

### Problema: Testes falhando por timeout

**Solução**: Aumente o timeout no arquivo de teste

```typescript
jest.setTimeout(10000);
```

### Problema: Mocks não funcionando

**Solução**: Certifique-se de chamar `jest.clearAllMocks()` no `beforeEach`

### Problema: Erro com módulos nativos

**Solução**: Adicione o módulo ao `transformIgnorePatterns` no jest.config.js

## 🎓 Recursos Adicionais

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Última atualização**: Novembro 2024
**Cobertura atual**: 70%+
**Total de testes**: 100+ casos de teste
