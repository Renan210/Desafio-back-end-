const express = require('express')
const { listarContas, criarNovaConta, atualizarUsuario, excluirConta, mostrarSaldo, exibirExtrato } = require('./controladores/contasBancarias')
const { depositar, sacar, transferir } = require('./controladores/transacoes')


const rotas = express()

rotas.get('/contas', listarContas)
rotas.post('/contas', criarNovaConta)
rotas.put('/contas/:numeroConta/usuario', atualizarUsuario)
rotas.delete('/contas/:numeroConta', excluirConta)
rotas.post('/transacoes/depositar', depositar)
rotas.post('/transacoes/sacar', sacar)
rotas.post('/transacoes/transferir', transferir)
rotas.get('/contas/saldo', mostrarSaldo)
rotas.get('/contas/extrato', exibirExtrato)

module.exports = rotas
