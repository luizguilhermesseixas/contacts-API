# Contacts API

Contacts-API é um serviço RESTful para gerenciamento de contatos pessoais, construído com NestJS, TypeScript e PostgreSQL. Esta API fornece autenticação segura de usuários com JWT, suporta operações CRUD de contatos e implementa recursos avançados como Redis para armezenar tokens, como um cache.

## 🚀 Como iniciar a aplicação

### Pré-requisitos

- Node.js (versão 16 ou superior)
- Docker e Docker Compose
- npm ou yarn

### 1. Clone o repositório

```bash
git clone git@github.com:luizguilhermesseixas/contacts-API.git
cd Contacts-API
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database Configuration
DATABASE_URL="postgresql://ContactsUser:ContactsPassword@localhost:5432/contacts_db?schema=public"

# JWT Configuration
JWT_SECRET="your_jwt_secret_key_here"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_key_here"

# Redis Configuration (opcional, usa valores padrão se não especificado)
REDIS_URL="redis://localhost:6379"

# Application Configuration
PORT=3000
NODE_ENV="development"

# Prisma Configuration
PRISMA_CLI_QUERY_ENGINE_TYPE="binary"
```

**Exemplo de valores para desenvolvimento:**

```env
DATABASE_URL="postgresql://ContactsUser:ContactsPassword@localhost:5432/contacts_db?schema=public"
JWT_SECRET="minha_chave_secreta_super_forte_para_jwt_access_token_123456789"
JWT_REFRESH_SECRET="minha_chave_secreta_super_forte_para_jwt_refresh_token_987654321"
REDIS_URL="redis://localhost:6379"
```

### 4. Inicie os serviços Docker

Execute o comando para iniciar PostgreSQL e Redis:

```bash
docker-compose up -d
```

Este comando irá:

- Iniciar PostgreSQL na porta `5432`
- Iniciar Redis na porta `6379`
- Criar os volumes necessários para persistência de dados

### 5. Configure o banco de dados

Execute as migrações do Prisma:

```bash
npx prisma generate
npx prisma migrate dev
```

### 6. Inicie a aplicação

Para desenvolvimento:

```bash
npm run start:dev
```

Para produção:

```bash
npm run build
npm run start:prod
```

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI.

**Acesse a documentação em:** `http://localhost:3000/api`

A documentação inclui:

- Todos os endpoints disponíveis
- Schemas de request e response
- Exemplos de uso
- Códigos de status HTTP
- Modelos de autenticação

## 🔧 Comandos úteis

```bash
# Rodar em modo de desenvolvimento
npm run start:dev

# Rodar em modo de produção
npm run start:prod

# Executar testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Verificar linting
npm run lint

# Corrigir problemas de linting
npm run lint:fix

# Formatar código
npm run format

# Gerar cliente Prisma
npx prisma generate

# Executar migrações do banco
npx prisma migrate dev

# Visualizar banco de dados (Prisma Studio)
npx prisma studio
```

## 🏗️ Estrutura do Projeto

```
src/
├── @types/              # Definições de tipos TypeScript
├── auth/                # Módulo de autenticação
├── common/              # Utilitários compartilhados
│   ├── decorators/      # Decorators customizados
│   ├── filters/         # Filtros de exceção
│   ├── guards/          # Guards de autorização
│   └── interceptors/    # Interceptors de resposta
├── contact/             # Módulo de contatos
├── user/                # Módulo de usuários
├── prisma/              # Configuração do Prisma
└── redis/               # Configuração do Redis
```

## 🔐 Autenticação

A API utiliza JWT para autenticação com os seguintes endpoints:

- `POST /auth/signup` - Cadastro de usuário
- `POST /auth/signin` - Login
- `POST /auth/refresh` - Renovar token
- `DELETE /auth/logout` - Logout

## 📋 Endpoints Principais

### Usuários

- `POST /user` - Criar usuário
- `GET /user` - Listar todos os usuários
- `GET /user/:id` - Buscar usuário por ID
- `PATCH /user/:id` - Atualizar usuário
- `DELETE /user/:id` - Deletar usuário

### Contatos

- `POST /contact` - Criar contato (requer autenticação)
- `GET /contact` - Listar contatos do usuário (requer autenticação)
- `GET /contact/:id` - Buscar contato por ID (requer autenticação)
- `PATCH /contact/:id` - Atualizar contato (requer autenticação)
- `DELETE /contact/:id` - Deletar contato (requer autenticação)

## 🛡️ Segurança

- Autenticação JWT com tokens de acesso e refresh
- Validação de autorização (usuários só podem acessar seus próprios dados)
- Senhas criptografadas com bcrypt
- Tokens de refresh armazenados no Redis

## 🐳 Docker

O projeto inclui:

- PostgreSQL 13.5 para banco de dados
- Redis 7 para cache e gerenciamento de sessões
- Volumes Docker para persistência de dados

## 📝 Notas de Desenvolvimento

- A aplicação usa **Prisma** como ORM
- **Redis** é usado para cache e blacklist de tokens
- **Swagger** para documentação automática da API
- **ESLint** e **Prettier** para padronização de código
- **Jest** para testes unitários

---

**Desenvolvido com ❤️ usando NestJS, TypeScript e PostgreSQL**
