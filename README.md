# 🎬 Meu Cinema

Aplicação web para busca de filmes e séries, com foco em apresentar informações de forma simples e sem spoilers.

🔗 Acesse: https://meucine.netlify.app

> ⚠️ O backend está hospedado em ambiente gratuito (Render), podendo levar alguns segundos para responder após período de inatividade.

---

## 🚀 Funcionalidades

- 🔍 Busca por filmes e séries por nome  
- 🎭 Filtro por gênero, ano e tipo de conteúdo  
- 📄 Visualização de informações como sinopse, número de episódios e onde assistir  
- ⭐ Avaliação de filmes e séries (nota de 1 a 10)  
- ❤️ Sistema de favoritos por usuário  
- 👤 Cadastro e autenticação de usuários  

---

## 🧠 Tecnologias utilizadas

### Backend
- Python (Flask)
- APIs REST
- Integração com API externa (TMDB)
- Banco de dados relacional (SQL)

### Frontend
- HTML
- CSS (Bootstrap)
- JavaScript

---

## ⚙️ Como funciona

O frontend realiza requisições para o backend, que por sua vez se comunica com a API do TMDB para obter dados atualizados de filmes e séries.

O backend também é responsável por:
- autenticação de usuários  
- persistência de favoritos e avaliações  
- tratamento e organização dos dados antes de enviar ao frontend  

---

## 🗄️ Banco de dados

O sistema utiliza banco de dados relacional para armazenar:

- usuários  
- favoritos  
- avaliações  

---

## 🔐 Autenticação

- Login com email e senha  
- Senhas armazenadas com hash (Werkzeug)  
- Controle de sessão para manter usuário autenticado  

---

## 📌 Objetivo do projeto

Este projeto foi desenvolvido com o objetivo de:

- praticar desenvolvimento backend com Python  
- trabalhar com APIs externas  
- implementar autenticação e persistência de dados  
- construir uma aplicação web completa  

---

## 💡 Motivação

A ideia surgiu da necessidade de consultar informações sobre filmes e séries sem receber spoilers ou excesso de detalhes, como acontece em plataformas tradicionais.

---

## 📫 Contato

- LinkedIn: https://linkedin.com/in/pedrochame  
- Email: pedrohik@gmail.com  