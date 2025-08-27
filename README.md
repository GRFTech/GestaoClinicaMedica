# 🏥 Sistema de Gestão para Clínica Médica (Arquivos Indexados em Python)

## 📚 Descrição do Projeto

Este projeto é um **sistema de gestão para uma clínica médica**, desenvolvido como trabalho prático da disciplina de Estrutura de Arquivos. O sistema simula um banco de dados simples utilizando **arquivos indexados**, onde os dados são persistidos em disco e os índices são mantidos em memória por meio de uma **Árvore Binária de Busca (ABB)**.

## 🎯 Objetivos

- Criar uma aplicação com persistência de dados em disco.
- Implementar uma árvore binária de índices em memória.
- Simular um sistema de banco de dados com múltiplas entidades.
- Realizar operações de inclusão, consulta e exclusão utilizando índices.
- Gerar relatórios e realizar verificações consistentes entre as entidades.

---

## 🗂️ Estrutura de Dados (Tabelas)

Cada tabela é representada por um arquivo separado (formato `.txt` ou `.bin`) e um índice em árvore binária em memória.

- **Cidades**: Código, Descrição, Estado
- **Pacientes**: Código, Nome, Data Nascimento, Endereço, Telefone, Código da Cidade, Peso, Altura
- **Especialidades**: Código, Descrição, Valor da Consulta, Limite Diário
- **Médicos**: Código, Nome, Endereço, Telefone, Código da Cidade, Código da Especialidade
- **Exames**: Código, Descrição, Código da Especialidade, Valor do Exame
- **Consultas**: Código, Código do Paciente, Código do Médico, Código do Exame, Data, Hora
- **Diárias**: Código do Dia (AAAAMMDD), Código da Especialidade, Quantidade de Consultas

---

## ⚙️ Funcionalidades

### 📌 Operações Básicas
- Inserção de novos registros nas tabelas
- Consulta de registros por código (usando árvore binária)
- Exclusão de registros com atualização do índice
- Leitura exaustiva de cada tabela (listagem completa)

### 👥 Pacientes
- Mostra cidade e estado (buscando na tabela de Cidades)
- Calcula e exibe o **IMC** e o diagnóstico:
  - Abaixo do peso
  - Peso normal
  - Sobrepeso
  - Obesidade

### 🩺 Médicos
- Exibe nome da cidade e estado
- Exibe descrição da especialidade, valor da consulta e limite diário

### 🧪 Exames
- Exibe nome da especialidade e valor correspondente

### 📅 Consultas
- Exibe:
  - Nome do paciente
  - Cidade do paciente
  - Nome do médico
  - Descrição do exame
- Valida quantidade de consultas diárias com o limite da especialidade
- Mostra valor total da consulta (consulta + exame)
- Atualiza tabela **Diárias** ao adicionar/excluir consultas

### 💰 Faturamento
- Faturamento por dia
- Faturamento por período (data inicial a final)
- Faturamento por médico
- Faturamento por especialidade

### 📊 Relatórios
- Listagem ordenada por código da consulta
- Mostra:
  - Código
  - Nome do paciente
  - Cidade do paciente
  - Nome do médico
  - Descrição do exame
  - Valor total da consulta
- Exibe total de pacientes e valor total faturado

---

## 🧠 Estrutura de Índices

- A indexação é realizada por meio de uma **Árvore Binária de Busca (ABB)**.
- Cada tabela possui seu índice específico, armazenado em memória durante a execução.
- Todas as buscas, inserções e exclusões utilizam a ABB como ponto de entrada.

---

## 💾 Persistência

- Os dados são armazenados em arquivos separados por entidade.
- Os arquivos são regravados a cada alteração.
- Os índices são reconstruídos ao iniciar o sistema (a partir dos arquivos de dados).

---

## 🖥️ Interface

- Interface textual com **menus claros e organizados**
- Navegação simples para inserção, busca e relatórios
- Feedbacks interativos durante as operações

---

## 🚫 Restrições

Este projeto **não deve** utilizar ferramentas de geração automática de código (como ChatGPT, GitHub Copilot ou similares).

A avaliação será realizada **individualmente**, com base no entendimento do código, decisões de projeto, funcionamento dos arquivos indexados e árvore binária.

---

## 📎 Requisitos

- Python 3.10+
- Nenhuma biblioteca externa é necessária (apenas bibliotecas padrão)

---

## ▶️ Como Executar

```bash
python main.py
