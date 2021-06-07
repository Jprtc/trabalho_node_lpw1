//Aluno: João Pedro de Rossi Tambasco Calazans
//Matrícula: 202010405


const express = require('express')
const app = express()
app.use(express.json())//informar que recebe requisições em .json

//pacote uuid
const uuid = require('uuid')


let funcionarios = [
    {id: uuid.v4(), nome: 'João Pedro de Rossi',funcao:'Programador de Sistemas',departamento: 'DI',email: 'joaopedro1234@hotmail.com',telefone: '24-992548548'},
    {id: uuid.v4(), nome: 'Maria das Flores',funcao:'Gestora de Recursos Humanos',departamento: 'RH',email: 'mariaflor2341@outlook.com',telefone: '24-99354804'}
]

//Middlewares:

//Checando se ID existe:
const checkIDExists = (request,response,next) => {
    const {id} = request.params
    const funcID = funcionarios.find(func => func.id === id)

    if(!funcID){
        return response
            .status(400)
            .json({error: 'Id inexistente.'})
    }
    return next()
}

//Checando se o corpo da requisicao esta com todos os dados necessários:
const verificaFunc = (request,response,next) => {
    const {nome,funcao,departamento,email,telefone} = request.body

    if (!nome || !funcao || !departamento || !email || !telefone){
        return response
                .status(400)
                .json({Error: 'Um ou mais campos não existem, favor preenche-los!'})
    }
    return next()
}

//listar funcionarios
app.get('/funcionarios/',(request,response) =>{
    return response
            .status(200)
            .json(funcionarios)
})


//criar novo funcionario, id gerado automaticamente.
app.post('/funcionarios', verificaFunc,(request,response) => {
    const {nome,funcao,departamento,email,telefone} = request.body;
    const dadosFunc = {
        id: uuid.v4(),
        nome,
        funcao,
        departamento,
        email,
        telefone
    }
    funcionarios = [...funcionarios, dadosFunc]
    return response
            .status(200)
            .json(dadosFunc)
})

//Listar funcionário por ID
app.get('/funcionarios/:id', checkIDExists,(request,response) => {
    const {id} = request.params
    const funcId = funcionarios.filter(func => func.id === id)
    return response
            .status(200)
            .json(funcId)
})

//Deletar funcionário pelo ID
app.delete('/funcionarios/:id', checkIDExists, (request,response) => {
    const {id} = request.params
    let funcId = funcionarios.findIndex(func => func.id === id)

    funcionarios.splice(funcId,1)
    return response
            .status(200)
            .json({message:`Funcionário com o ID: ${id} Excluido com sucesso!`})
}) 

//Alterar dados do funcionário pelo ID
app.put('/funcionarios/:id', checkIDExists, verificaFunc, (request,response) => {
    const {nome,funcao,departamento,email,telefone} = request.body;
    const {id} = request.params
    let funcId = funcionarios.findIndex(func => func.id === id)

    const dadosFunc = {
        id,
        nome,
        funcao,
        departamento,
        email,
        telefone
    }

    funcionarios.splice(funcId,1,dadosFunc)
        return response
            .status(200)
            .json(dadosFunc)
    
}) 


app.listen(3333,() => {
    console.log('Servidor Rodando...')
})