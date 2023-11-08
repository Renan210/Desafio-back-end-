const bancodedados = require('../src/bancodedados')
const { contas } = require('../src/bancodedados')

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "o numero da conta e o valor são obrigatorios" })
    }


    const conta = contas.find((conta) => conta.numero === numero_conta)

    if (!conta) {
        return res.status(404).json({ mensagem: 'conta bancaria não encontrada!' })
    }
    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'o valor do deposito deve ser maior que zero!' })
    }
    conta.saldo += valor

    const depositoRegistrado = {
        data: new Date().toISOString(),
        numero_conta: numero_conta,
        valor: valor,
    }

    bancodedados.depositos.push(depositoRegistrado)

    res.status(204).end()
}

const sacar = (req, res,) => {
    const { numero_conta, valor, senha } = req.body

    const conta = contas.find((conta) => {
        return conta.numero === numero_conta
    })

    if (!conta) {
        return res.status(404).json({ mensagem: 'conta bancaria não foi encontrada' })
    }

    if (conta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: 'senha invalida' })
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'o valor do saque deve ser maior que zero!' })
    }

    if (valor > conta.saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente' })
    }

    conta.saldo -= valor

    const saqueRegistrado = {
        data: new Date().toISOString(),
        numero_conta: numero_conta,
        valor: valor,
    }

    bancodedados.saques.push(saqueRegistrado)

    res.status(204).end()
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    //Verificar se o número da conta de origem, de destino, senha da conta de origem e valor da transferência foram informados no body
    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: "todos os campos são obrigatorios" })
    }

    //conta de origem
    let contaOrigem = contas.find((conta) => conta.numero === numero_conta_origem)
    //conta de destino 
    let contaDestino = contas.find((conta) => conta.numero === numero_conta_destino)

    //verificar se conta origem ou destino existe
    if (!contaOrigem || !contaDestino) {
        return res.status(404).json({ mensagem: 'conta bancaria de origem ou destino não encontrada' })
    }

    //verificar a senha informada 
    if (senha !== contaOrigem.usuario.senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta!' })
    }

    //verificar se o valor da transferencia é valido
    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'o valor da transferencia tem que ser maior que zero' })
    }

    //Verificar se há saldo disponível na conta de origem para a transferência
    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: ' O Saldo é insuficiente' })
    }

    contaOrigem.saldo -= valor
    contaDestino.saldo += valor

    const registrarATransferencia = {
        data: new Date().toISOString(),
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor: valor
    }

    bancodedados.transferencias.push(registrarATransferencia)
    res.status(204).end()
}

module.exports = {
    depositar, sacar, transferir
}