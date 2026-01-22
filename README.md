# SD Blockchain

Um projeto de blockchain distribuído com múltiplos nós sincronizados em tempo real, desenvolvido para fins educacionais.

## 📋 Visão Geral

Este projeto implementa uma rede blockchain com 3 nós independentes que se comunicam para manter uma cadeia de blocos sincronizada. Cada nó possui seu próprio frontend web para interagir com a rede.

**Recursos principais:**

- ✅ Sincronização automática de blocos entre nós
- ✅ Consensus algorithm (algoritmo de consenso)
- ✅ Interface web responsiva para cada nó
- ✅ Prova de trabalho (Proof of Work)
- ✅ Sistema de transações
- ✅ Containerização com Docker

## 🏗️ Arquitetura

```
sd-blockchain/
├── python-backend/          # Backend Flask (servidor blockchain)
│   ├── server.py           # Implementação do blockchain
│   ├── Dockerfile          # Imagem Docker
│   └── requirements.txt     # Dependências Python
├── next-frontend/          # Frontend Next.js (UI)
│   ├── app/
│   │   └── page.tsx        # Página principal
│   ├── libs/
│   │   └── api.ts          # Chamadas à API
│   ├── Dockerfile          # Imagem Docker
│   └── package.json        # Dependências
├── docker-compose.yml      # Orquestração dos containers
```

## 🚀 Como Executar

### 1. **Com Docker Compose (Recomendado)**

```bash
# Navegue até a pasta do projeto
cd sd-blockchain

# Build e inicie todos os containers
docker-compose up --build

# Acesse os frontends
- Frontend 1: http://localhost:3000 (conectado ao Server 1 - porta 5000)
- Frontend 2: http://localhost:3001 (conectado ao Server 2 - porta 5001)
- Frontend 3: http://localhost:3002 (conectado ao Server 3 - porta 5002)
```

**Parar os containers:**

```bash
docker-compose down
```

### 2. **Localmente (Desenvolvimento)**

**Backend:**

```bash
cd python-backend

# Instalar dependências
pip install -r requirements.txt

# Executar servidor (porta 5000)
python server.py
```

**Frontend:**

```bash
cd next-frontend

# Instalar dependências
npm install

# Iniciar em desenvolvimento (porta 3000)
npm run dev

# Build para produção
npm run build
npm start
```

## 🔗 API Endpoints

### `GET /chain`

Retorna a blockchain completa.

**Resposta:**

```json
{
  "chain": [...],
  "length": 5
}
```

### `POST /transactions/new`

Cria uma nova transação e mina um bloco.

**Requisição:**

```json
{
  "sender": "Alan",
  "recipient": "Bob",
  "amount": 5
}
```

**Resposta:**

```json
{
  "message": "New Block Forged",
  "index": 2,
  "transactions": [...],
  "proof": 119678,
  "previous_hash": "abc123..."
}
```

### `POST /nodes/register`

Registra novos nós na rede.

**Requisição:**

```json
{
  "nodes": ["server1:5000", "server2:5000"]
}
```

### `GET /nodes/resolve`

Executa o algoritmo de consenso para sincronizar com os outros nós.

**Resposta:**

```json
{
  "message": "Our chain was replaced",
  "new_chain": [...]
}
```

### `POST /blocks/push`

Recebe um novo bloco de outro nó.

## 🌐 Interface Web

### Funcionalidades do Frontend

1. **Formulário de Transação**
   - Campos: Sender, Recipient, Amount
   - Validação de campos obrigatórios
   - Feedback de loading

2. **Lista de Transações**
   - Exibe todas as transações (excluindo rewards de mineração)
   - Auto-atualiza a cada 2 segundos
   - Mostra informações do remetente, destinatário e quantidade

3. **Informações da Blockchain**
   - Total de blocos
   - Horário da última atualização
   - Scroll automático para transações

## 🔧 Tecnologias

### Backend

- **Python 3.11** - Linguagem
- **Flask** - Framework web
- **flask-cors** - Suporte a CORS
- **requests** - Cliente HTTP para comunicação entre nós

### Frontend

- **Next.js 16** - Framework React
- **React 19** - Biblioteca UI
- **Tailwind CSS** - Estilização
- **TypeScript** - Type safety

### DevOps

- **Docker** - Containerização
- **Docker Compose** - Orquestração

## 📦 Estrutura de Dados

### Block

```python
{
    "index": 1,
    "timestamp": 1674567890.123,
    "transactions": [...],
    "proof": 119678,
    "previous_hash": "abc123..."
}
```

### Transaction

```python
{
    "sender": "Alan",
    "recipient": "Bob",
    "amount": 5
}
```

## 🔄 Fluxo de Sincronização

1. **Node A** recebe uma transação
2. **Node A** mina um novo bloco
3. **Node A** chama `/nodes/resolve` nos **Nodes B e C**
4. **Nodes B e C** sincronizam suas cadeias
5. Todos os nós ficam com a mesma cadeia

## 📝 Exemplo de Uso

1. Abra `http://localhost:3000` em seu navegador
2. Preencha o formulário:
   - Sender: `Alice`
   - Recipient: `Bob`
   - Amount: `50`
3. Clique em "Send"
4. Veja a transação aparecer na lista automaticamente
5. Abra outro frontend (`localhost:3001` ou `localhost:3002`) para verificar a sincronização

## 👥 Autor

Desenvolvido por [Luís Carlos](https://github.com/Lucal22) como trabalho prático da disciplina de Sistemas Distribuidos - IFMG

## 📄 Licença

Este projeto é fornecido como está para fins educacionais.
