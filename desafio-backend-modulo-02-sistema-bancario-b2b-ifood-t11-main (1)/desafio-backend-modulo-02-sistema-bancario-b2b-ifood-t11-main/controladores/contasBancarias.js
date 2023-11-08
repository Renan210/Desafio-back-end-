const { contas, banco } = require("../src/bancodedados")
const { nomeBanco } = require("../src/bancodedados")
const listarContas = (req, res) => {
    const { senha_banco } = req.query
    const { senha } = banco
    if (!senha_banco) {
        return res.status(400).json({ mensagem: "O campo senha é obrigatorio" })
    }

    if (senha_banco !== senha) {
        return res.status(401).json({ mensagem: 'A senha informada é invalida!' })
    } else if (senha_banco === senha) {
        return res.status(200).json(contas)
    }
}

const criarNovaConta = (req, res) => {
    const { nome, saldo, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !email || !telefone || !senha || !data_nascimento) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
    }

    const numero = contas.length > 0 ? Math.max(...contas.map(conta => conta.numero)) + 1 : 1;

    const novaPessoa = {
        numero,
        saldo: saldo || 0,
        cliente: {
            nome, cpf, data_nascimento, telefone, email, senha
        }
    };



    if (contas.some(conta => conta.numero === numero)) {
        return res.status(400).json({ mensagem: "Desculpe, este número de conta já existe" });
    } else if (contas.some(conta => conta.usuario.cpf === cpf)) {
        return res.status(400).json({ mensagem: "Desculpe, este CPF já está registrado" });
    } else if (contas.some(conta => conta.usuario.email === email)) {
        return res.status(400).json({ mensagem: "Desculpe, este email já está registrado" });
    }

    contas.push(novaPessoa);

    return res.status(201).json({ mensagem: "Conta criada com sucesso" });
};

const atualizarUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const { numeroConta } = req.params

    const conta = contas.find((conta) => conta.numero === numeroConta)

    if (!conta) {
        return res.status(404).json({ mensagem: "conta não encontrada" })
    }

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "todos od campos são obrigatorios!" })
    }

    const cpfExiste = contas.find((conta) => conta.usuario.cpf === cpf && conta.numero !== numeroConta)

    if (cpfExiste) {
        return res.status(400).json({ mensagem: 'o CPF informado ja esta cadastrado' })
    }

    conta.usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,

    }
    res.status(204).end()
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;


    const indiceConta = contas.findIndex((conta) => conta.numero === numeroConta);

    if (indiceConta === -1) {
        return res.status(404).json({ mensagem: "Conta não encontrada" });
    }

    if (contas[indiceConta].saldo !== 0) {
        return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
    } else {
        contas.splice(indiceConta, 1);
        return res.status(201).end()

    }


};

const mostrarSaldo = (req, res) => {

    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'todos os campos são obrigatorios!' })
    }

    const conta = contas.find((conta) => {
        return numero_conta === conta.numero
    })


    if (!conta) {
        return res.status(400).json({ mensagem: 'conta inexistente' })
    }


    const senhaDaConta = contas.find((senhaConta) => {
        return senha === senhaConta
    })

    if (senha == !senhaDaConta) {
        return res.status(400).json({ mensagem: 'senha invalida' })
    }

    return res.status(200).json({ saldo: conta.saldo })
}

const exibirExtrato = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'todos os campos são obrigatorios!' })
    }

    const conta = contas.find((conta) => {
        return numero_conta === conta.numero
    })


    if (!conta) {
        return res.status(400).json({ mensagem: 'conta inexistente' })
    }


    const senhaDaConta = contas.find((senhaConta) => {
        return senha === senhaConta
    })

    if (senha == !senhaDaConta) {
        return res.status(400).json({ mensagem: 'senha invalida' })
    }

    const filtrarTransacoes = (transacoes, numeroConta) =>
        transacoes.filter((transacao) => transacao.numero_conta === numeroConta);

    const extrato = {
        depositos: filtrarTransacoes(banco.depositos, numero_conta),
        saques: filtrarTransacoes(banco.saques, numero_conta),
        transferenciasDestinadas: filtrarTransacoes(
            banco.transferencias,
            numero_conta
        ),
        transferenciasObtidas: filtrarTransacoes(
            banco.transferencias,
            numero_conta
        ),
    };

    res.status(200).json(extrato)

}
module.exports = {
    listarContas, criarNovaConta, atualizarUsuario, excluirConta, mostrarSaldo, exibirExtrato
}