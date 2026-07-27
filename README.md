Customer Address App

Aplicação full stack para cadastro de clientes com preenchimento automático de endereço por CEP.

Stack: Laravel 13 · PHP 8.3 · Next.js 16 · React 19 · TypeScript · PostgreSQL 18 · Docker

Funcionalidades

Consulta de endereço por CEP

Preenchimento automático de logradouro, bairro, cidade e UF

Cadastro e persistência de clientes

Listagem dos registros cadastrados

Atualização automática da listagem após novo cadastro

Validações no frontend e backend

Tratamento de CEP inválido, inexistente e indisponibilidade do serviço externo

Mensagens visuais de sucesso e erro

Estrutura

customer-address-app/
├── backend/              # API REST Laravel
├── frontend/             # Interface Next.js
├── docker-compose.yml    # Backend, frontend e PostgreSQL
└── README.md

Executar com Docker

Pré-requisitos

Docker Desktop

Docker Compose

Na raiz do projeto:

docker compose up --build

Acesse:

Frontend: http://localhost:3000

Backend: http://localhost:8000

API de clientes: http://localhost:8000/api/customers

As migrations são executadas automaticamente ao iniciar o backend.

Comandos úteis

docker compose up --build -d   # Executar em segundo plano
docker compose logs -f         # Exibir logs
docker compose ps              # Ver status dos serviços
docker compose down            # Parar os serviços
docker compose down -v         # Parar e apagar os volumes

docker compose down -v remove os dados do PostgreSQL criado pelo Docker.

Serviços e portas

Serviço

Tecnologia

Porta

Frontend

Next.js 16 / Node.js 24

3000

Backend

Laravel 13 / PHP 8.3

8000

Banco

PostgreSQL 18

5433

Dentro da rede Docker, o Laravel acessa o banco pelo host database e porta 5432.

Variáveis de ambiente

Backend

APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=database
DB_PORT=5432
DB_DATABASE=customer_address_app
DB_USERNAME=postgres
DB_PASSWORD=postgres

Frontend

NEXT_PUBLIC_API_URL=http://localhost:8000/api

Arquivos locais como backend/.env e frontend/.env.local não são versionados.

Executar sem Docker

Backend

cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

No PowerShell, use:

Copy-Item .env.example .env

Configure o PostgreSQL no .env:

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=customer_address_app
DB_USERNAME=postgres
DB_PASSWORD=sua_senha

Frontend

cd frontend
npm install
npm run dev

Crie frontend/.env.local:

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

Endpoints

Consultar CEP

GET /api/ceps/{cep}

Exemplo:

GET /api/ceps/80010000

Resposta:

{
  "data": {
    "cep": "80010-000",
    "logradouro": "Rua José Loureiro",
    "bairro": "Centro",
    "cidade": "Curitiba",
    "uf": "PR"
  }
}

Status

Situação

200

CEP encontrado

404

CEP não encontrado

422

Formato inválido

503

Serviço externo indisponível

Cadastrar cliente

POST /api/customers

{
  "name": "Maria da Silva",
  "email": "maria@email.com",
  "cep": "80010-000",
  "street": "Rua José Loureiro",
  "number": "100",
  "complement": "Apartamento 12",
  "neighborhood": "Centro",
  "city": "Curitiba",
  "state": "PR"
}

Resposta de sucesso: 201 Created.

Listar clientes

GET /api/customers

Os registros são retornados do mais recente para o mais antigo.

Validações

Campo

Regra

Nome

Obrigatório, até 150 caracteres

E-mail

Obrigatório e válido, até 150 caracteres

CEP

Obrigatório, oito números, com ou sem hífen

Logradouro

Obrigatório, até 200 caracteres

Número

Obrigatório, até 20 caracteres

Complemento

Opcional, até 150 caracteres

Bairro

Obrigatório, até 100 caracteres

Cidade

Obrigatória, até 100 caracteres

UF

Obrigatória, duas letras

O número do endereço é texto para aceitar valores como 123A, 12-B e S/N.

Organização do código

Backend

backend/app/
├── Http/Controllers/Api/
│   ├── CepController.php
│   └── CustomerController.php
├── Http/Requests/
│   └── StoreCustomerRequest.php
├── Models/
│   └── Customer.php
└── Services/
    └── CepService.php

CepController: recebe a consulta de CEP

CepService: acessa a ViaCEP e padroniza a resposta

CustomerController: cadastra e lista clientes

StoreCustomerRequest: valida os dados

Customer: representa a tabela customers

Frontend

frontend/src/
├── app/page.tsx
├── components/customers/
│   ├── CustomerForm.tsx
│   ├── CustomerList.tsx
│   └── CustomerManager.tsx
├── services/
│   ├── api.ts
│   ├── cepService.ts
│   └── customerService.ts
└── types/
    ├── address.ts
    └── customer.ts

CustomerForm: formulário, busca do CEP e cadastro

CustomerList: exibição dos clientes

CustomerManager: atualiza a listagem após o cadastro

services: comunicação com a API Laravel

types: contratos TypeScript

Verificações

docker compose exec frontend npm run lint
docker compose exec frontend npm run build
docker compose exec backend php artisan migrate:status
docker compose exec backend php artisan route:list --path=api

Decisões técnicas

A consulta de CEP passa pelo Laravel para evitar acoplamento direto do frontend com o provedor externo.

O backend padroniza respostas, valida dados e trata erros.

O PostgreSQL é versionado por migrations.

O Docker Compose permite iniciar todo o ambiente com um único comando.

O frontend utiliza TypeScript para melhorar segurança e legibilidade.

Repositório

https://github.com/gastaofilho/customer-address-app

Autor

Gastão BarbosaDesenvolvedor Full Stack