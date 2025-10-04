# Deploy no Render - Radlands App

## Pré-requisitos

- Conta no [Render](https://render.com)
- Repositório Git com o código do projeto

## Passos para Deploy

### 1. Criar Web Service no Render

1. Acesse o [Dashboard do Render](https://dashboard.render.com)
2. Clique em "New +" e selecione "Web Service"
3. Conecte seu repositório Git
4. Configure o serviço:

### 2. Configurações do Web Service

**Build & Deploy:**
- **Build Command:** `./build.sh`
- **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`

**Environment:**
- **Runtime:** `Python 3`
- **Branch:** `main` (ou sua branch principal)

### 3. Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente no Render:

- `DATABASE_URL` - URL do banco PostgreSQL (configurado automaticamente se usar Render Postgres)
- `SECRET_KEY` - Chave secreta para Flask (gere uma segura)
- `FLASK_ENV` - `production`

### 4. Criar Banco de Dados PostgreSQL

1. No dashboard do Render, clique em "New +" e selecione "PostgreSQL"
2. Configure o banco:
   - **Name:** `radlands-db`
   - **Region:** Mesma região do Web Service
3. Após criar, copie a **Internal Database URL**
4. Cole no Web Service como variável `DATABASE_URL`

### 5. Deploy

1. Clique em "Create Web Service"
2. O Render vai:
   - Instalar dependências do frontend (npm install)
   - Fazer build do frontend (npm run build → cria dist/)
   - Instalar dependências Python (pip install -r requirements.txt)
   - Iniciar o servidor Gunicorn

**Nota:** O Flask está configurado para servir os arquivos estáticos do dist/ automaticamente. A rota catch-all garante que o React Router funcione corretamente.

### 6. Verificação

Após o deploy bem-sucedido:

1. Acesse a URL fornecida pelo Render (ex: `https://radlands-app.onrender.com`)
2. Teste os endpoints:
   - `GET /api/health` - Deve retornar `{"status": "healthy"}`
   - A aplicação frontend estará servindo arquivos estáticos

## Estrutura de Arquivos para Deploy

```
.
├── backend/              # Backend Flask
│   ├── __init__.py
│   ├── models.py
│   ├── routes.py
├── src/                  # Frontend React
├── app.py               # Entry point Flask
├── build.sh             # Script de build
├── Procfile             # Comando de start
├── runtime.txt          # Versão Python
├── requirements.txt     # Dependências Python
└── package.json         # Dependências Node.js
```

## Troubleshooting

### Erro: "No module named 'psycopg2'"
- Verifique se `psycopg2-binary` está em `requirements.txt`
- Rebuild a aplicação

### Erro: "Database connection failed"
- Verifique se a variável `DATABASE_URL` está configurada
- Confirme que o banco PostgreSQL está na mesma região

### Frontend não carrega
- Verifique se `build.sh` executou `npm run build` com sucesso
- Confirme que o Gunicorn está servindo os arquivos estáticos

## Comandos Úteis

```bash
# Testar build localmente
./build.sh

# Testar servidor Gunicorn localmente
gunicorn app:app --bind 0.0.0.0:8000

# Verificar logs no Render
# Acesse: Dashboard > Seu Service > Logs
```

## Próximos Passos

1. Configurar domínio customizado (se necessário)
2. Configurar SSL/HTTPS (automático no Render)
3. Configurar backups do banco de dados
4. Monitorar performance e logs
