Customer Address App

Aplicação full stack para cadastro de clientes com preenchimento automático de endereço a partir do CEP.

O projeto foi desenvolvido com:

Backend: PHP 8.3, Laravel e Eloquent ORM

Frontend: Next.js 16, React 19, TypeScript e Tailwind CSS

Banco de dados: PostgreSQL 18

Infraestrutura local: Docker e Docker Compose

Consulta de CEP: ViaCEP

Funcionalidades

Consulta de endereço por CEP

Preenchimento automático de:

logradouro

bairro

cidade

UF

Cadastro de clientes

Persistência dos dados no PostgreSQL

Listagem dos clientes cadastrados

Atualização automática da listagem após um novo cadastro

Validação dos dados no backend

Tratamento de:

CEP com formato inválido

CEP não encontrado

indisponibilidade do serviço externo

erros de validação no cadastro

Arquitetura

O projeto está organizado em duas aplicações independentes:

customer-address-app/
├── backend/              # API REST Laravel
├── frontend/             # Interface Next.js
├── docker-compose.yml    # Orquestração dos serviços
└── README.md

Fluxo da consulta de CEP

Next.js
   ↓
GET /api/ceps/{cep}
   ↓
Laravel
   ↓
ViaCEP
   ↓
Resposta padronizada
   ↓
Preenchimento do formulário

A consulta ao serviço externo é feita pelo backend. Dessa forma, o frontend não fica acoplado diretamente ao provedor de CEP e a integração pode ser alterada sem modificar os componentes da interface.

Fluxo do cadastro

Next.js
   ↓
POST /api/customers
   ↓
Validação com Form Request
   ↓
Model Customer / Eloquent ORM
   ↓
PostgreSQL

Pré-requisitos

Para executar com Docker:

Docker Desktop

Docker Compose

Para executar sem Docker:

PHP 8.3 ou superior

Composer 2

Node.js 22

npm

PostgreSQL

Execução com Docker

O Docker Compose inicia:

PostgreSQL na porta 5433

Laravel na porta 8000

Next.js na porta 3000

Na raiz do projeto, execute:

docker compose up --build

Depois acesse:

Frontend: http://localhost:3000

API Laravel: http://localhost:8000

Listagem da API: http://localhost:8000/api/customers

Na primeira execução, o processo pode demorar alguns minutos, pois as imagens e dependências serão baixadas.

As migrations são executadas automaticamente durante a inicialização do backend.

Executar em segundo plano

docker compose up --build -d

Visualizar os logs

docker compose logs -f

Parar os containers

docker compose down

Parar e remover também os volumes

docker compose down -v

O comando com -v apaga o banco PostgreSQL criado pelo Docker.

Variáveis de ambiente

Backend

O ambiente Docker utiliza o arquivo:

backend/.env.docker

Principais configurações:

APP_NAME="Customer Address App"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=database
DB_PORT=5432
DB_DATABASE=customer_address_app
DB_USERNAME=postgres
DB_PASSWORD=postgres

O valor de APP_KEY é gerado automaticamente na inicialização do container.

Frontend

A variável usada para acessar a API é:

NEXT_PUBLIC_API_URL=http://localhost:8000/api

Para execução local sem Docker, crie:

frontend/.env.local

com o mesmo conteúdo.

Execução sem Docker

1. Configurar o backend

Entre na pasta:

cd backend

Instale as dependências:

composer install

Crie o arquivo local de ambiente:

cp .env.example .env

No Windows PowerShell:

Copy-Item .env.example .env

Configure o PostgreSQL no .env:

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=customer_address_app
DB_USERNAME=postgres
DB_PASSWORD=sua_senha

Gere a chave:

php artisan key:generate

Execute as migrations:

php artisan migrate

Inicie a API:

php artisan serve

A API estará disponível em:

http://127.0.0.1:8000

2. Configurar o frontend

Em outro terminal:

cd frontend

Instale as dependências:

npm install

Crie o arquivo:

frontend/.env.local

Conteúdo:

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

Inicie o frontend:

npm run dev

A aplicação estará disponível em:

http://localhost:3000

Endpoints da API

Consultar CEP

GET /api/ceps/{cep}

Exemplo:

GET /api/ceps/80010000

Resposta de sucesso:

{
  "data": {
    "cep": "80010-000",
    "logradouro": "Rua José Loureiro",
    "bairro": "Centro",
    "cidade": "Curitiba",
    "uf": "PR"
  }
}

Possíveis respostas:

200: CEP encontrado

404: CEP não encontrado

422: CEP com formato inválido

503: serviço externo indisponível

Cadastrar cliente

POST /api/customers

Corpo:

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

Resposta de sucesso:

{
  "message": "Cliente cadastrado com sucesso.",
  "data": {
    "id": 1,
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
}

Código de resposta:

201 Created

Listar clientes

GET /api/customers

Resposta:

{
  "data": [
    {
      "id": 1,
      "name": "Maria da Silva",
      "email": "maria@email.com",
      "cep": "80010-000",
      "street": "Rua José Loureiro",
      "number": "100",
      "complement": "Apartamento 12",
      "neighborhood": "Centro",
      "city": "Curitiba",
      "state": "PR",
      "created_at": "2026-07-26T00:00:00.000000Z",
      "updated_at": "2026-07-26T00:00:00.000000Z"
    }
  ]
}

Os registros são retornados do mais recente para o mais antigo.

Validações do cadastro

Campo

Regra

Nome

Obrigatório, texto, até 150 caracteres

E-mail

Obrigatório, formato válido, até 150 caracteres

CEP

Obrigatório, oito números, com ou sem hífen

Logradouro

Obrigatório, até 200 caracteres

Número

Obrigatório, texto, até 20 caracteres

Complemento

Opcional, até 150 caracteres

Bairro

Obrigatório, até 100 caracteres

Cidade

Obrigatória, até 100 caracteres

UF

Obrigatória, exatamente dois caracteres

O número do endereço é armazenado como texto porque pode conter valores como 123A, 12-B ou S/N.

Organização do backend

backend/app/
├── Http/
│   ├── Controllers/Api/
│   │   ├── CepController.php
│   │   └── CustomerController.php
│   └── Requests/
│       └── StoreCustomerRequest.php
├── Models/
│   └── Customer.php
└── Services/
    └── CepService.php

Responsabilidades:

CustomerController: cadastro e listagem

CepController: entrada HTTP da consulta de CEP

StoreCustomerRequest: validação do cadastro

Customer: acesso à tabela customers

CepService: comunicação com a API externa e padronização da resposta

Organização do frontend

frontend/src/
├── app/
│   └── page.tsx
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

Responsabilidades:

CustomerForm: formulário, busca do CEP e cadastro

CustomerList: consulta e exibição dos clientes

CustomerManager: comunicação entre formulário e listagem

customerService: chamadas de cadastro e listagem

cepService: chamada ao endpoint de CEP

types: contratos TypeScript usados pela aplicação

Qualidade do código

Para verificar o frontend:

cd frontend
npm run lint

Para visualizar as rotas do backend:

cd backend
php artisan route:list --path=api

Para verificar as migrations:

php artisan migrate:status

Decisões técnicas

Laravel no backend

O Laravel foi escolhido por oferecer:

estrutura organizada para APIs REST

validação com Form Requests

integração simples com PostgreSQL

Eloquent ORM

cliente HTTP para serviços externos

migrations para versionamento do banco

Next.js no frontend

O Next.js foi escolhido por oferecer:

React com estrutura organizada

TypeScript

App Router

componentes reutilizáveis

integração simples com APIs

suporte a Tailwind CSS

Consulta de CEP pelo backend

O frontend não consulta diretamente a ViaCEP. Toda consulta passa pelo Laravel para:

reduzir o acoplamento com o provedor externo

centralizar tratamento de erros

padronizar a resposta

facilitar troca futura do serviço

permitir cache e testes automatizados posteriormente

PostgreSQL

O PostgreSQL foi utilizado para persistência dos clientes e é iniciado automaticamente pelo Docker Compose.

Melhorias futuras

Testes automatizados do backend

Testes de componentes no frontend

Cache das consultas de CEP

Paginação da listagem

Mensagens de validação por campo

CI/CD com GitHub Actions

Deploy da aplicação

Documentação com coleção Postman ou Insomnia

Repositório

https://github.com/gastaofilho/customer-address-app

Autor

Gastão Barbosa

Desenvolvedor Full Stack