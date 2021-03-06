const express = require('express');
const cors = require('cors');

const {Sequelize} = require('./models');

const models = require('./models');

const app=express();
app.use(cors());
app.use(express.json());


let cliente=models.Cliente;
let itempedido=models.ItemPedido;
let pedido=models.Pedido;
let servico=models.Servico;
let produto=models.Produto;
let compra=models.Compra;
let itemcompra=models.ItemCompra;

app.get('/', function (req, res){
    res.send('Olá mundo');
});

 // criar serviço , clientes , pedidos e item pedidos
app.post('/servicos', async(req,res) =>{
    await servico.create(
     req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Serviço criado com sucesso'
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Foi impossível se conectar'
        })
    });
});



app.post('/clientes', async(req,res) =>{
    await cliente.create(
     req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Cliente cadastrado com sucesso'
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Foi impossível se conectar'
        })
    });
});

// app.get('/pedidos', function (req, res){
//     res.send('Seus pedidos')
// });


app.post('/pedidos', async (req, res) => {
    await pedido.create(req.body)
      .then(() => {
        return res.json({
          error: false,
          message: 'Pedido criado com sucesso.'
        })
      })
      .catch(() => {
        res.status(400).json({
          error: true,
          message: 'Não foi possível criar o pedido.'
        })
      })
    res.send('Pedido realizado com sucesso!')
  })

app.post('/cliente/:id/pedido', async (req, res) => {
    const ped = {
        dataPedido: req.body.dataPedido,
        ClienteId: req.params.id
    };

    if (!await cliente.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: "Cliente não existe."
        });
    };

    await pedido.create(ped)
        .then(order => {
            return res.json({
                error: false,
                message: "O pedido foi inserido com sucesso.",
                order
            });
        }).catch(error => {
            return res.status(400).json({
                error: true,
                message: "Não foi possível inserir o pedido."
            });
        });
});

// uma alteraçao para listagem de pedido no id 

app.get('/cliente/:id/pedido', async (req, res) => {
    await pedido
      .findAll({
        where: { ClienteId: req.params.id }
      })
      .then(item => {
        return res.json({
          error: false,
          item
        })
      })
      .catch(function (erro) {
        return res.status(400).json({
          error: true,
          message: 'Erro: Não foi possível fazer a conexão!'
        })
      })
  })
  


app.post('/itempedidos', async(req,res) =>{
    await itempedido.create(
     req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Serviço agendado com sucesso'
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Foi impossível se conectar'
        })
    });
});


// primeiro ep 


app.get('/pedidos', function (req, res){
    res.send('Seus pedidos')
});


app.get('/itempedido', function (req, res){
    res.send('Agende um serviço');
});

app.get('/servicos', function (req, res){
    res.send('Conheça nossos serviços');
});

// listar serviço , clientes , ofertas servicos , servido Id

app.get('/listaservicos', async(req,res) => {
    await servico.findAll({
        //raw: true
        order: [['nome', 'ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});

app.get('/listapedidos', async (req, res) => {
    await pedido
      .findAll({
        raw: true
      })
      .then(function (pedidos) {
        res.json({ pedidos })
      })
  })

app.get('/listaclientes', async(req,res) =>{
    await cliente.findAll({
        raw: true})
        .then(function(clientes){
            res.json({clientes})
        });
});

app.get('/ofertaservicos', async (req,res) => {
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
});

app.get('/servico/:id', async(req,res)=>{
    await servico.findByPk(req.params.id)
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
        message: "Erro: código não encontrado!"
        }); 
    });
});


app.get('/servico/:id/pedidos', async(req,res)=>{
    await itempedido.findAll({ 
        where: {ServicoId: req.params.id}})
    .then(item =>{
        return res.json({
            error: false,
            item
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
        message: "Erro: código não encontrado!"
        }); 
    });
});


app.put('/atualizaservico', async(req,res)=> {
    await servico.update(req.body, {
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviço foi alterado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Houve erro na alteraçao do serviço"
        });
    });
});

app.get('/pedidos/:id', async(req,res) =>{
    await pedido.findByPk(req.params.id, {include: [{all: true}]})
    .then(ped => {
        return res.json({ped});
    })
})
// fim do get 



// começo do edit itempedido , servico , cliente
app.put('/pedidos/:id/editarItem', async(req, res) =>{
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };
    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Pedido não foi encontrado'
        });
    };

        if(!await servico.findByPk(req.body.ServicoId)){
            return res.status(400).json({
                error: true,
                message: 'Serviço não foi encontrado'
            });
        };

            await itempedido.update(item, {
                where: Sequelize.and({ServicoId: req.body.ServicoId},
                    {PedidoId: req.params.id})
            }).then(function(itens){
                return res.json({
                    error: false,
                    message: "Pedido foi alterado com sucesso",
                    itens
                });
            }).catch(function(erro){
                return res.status(400).json({
                    error: true,
                    message: "Não foi possível aterar"
                });
            });
});

app.get('/excluircliente/:id', async(req,res) =>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente foi excluído com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o cliente."
        });
    });
});
//Parte do desafio -- ciclo 3

// Criar produtos , item compra e compra
app.post('/produtos', async(req,res) =>{
    await produto.create(
     req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Produto cadastrado com sucesso'
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Foi impossível se conectar'
        })
    });
});


app.post('/itemcompras', async(req,res) =>{
    await itemcompra.create(
     req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Compra realizada com sucesso'
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Foi impossível se conectar'
        })
    });
});

app.post('/compras', async(req,res) =>{
    await compra.create(
     req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Compra cadastrada com sucesso'
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Foi impossível se conectar'
        })
    });
});


// Listar produtos , compras e item compras 

app.get('/listaprodutos', async (req, res) => {
    await produto
      .findAll({
        raw: true
      })
      .then(function (produtos) {
        res.json({ produtos })
      })
  })
  

app.get('/listacompras', async (req, res) => {
    await compra
      .findAll({
        raw: true
      })
      .then(function (compras) {
        res.json({ compras })
      })
  })

// app.get('/listacompras', async(req,res) => {
//     await produto.findAll({
//         order: [['nome', 'ASC']]
//     }).then(function(compras){
//         res.json({compras})
//     });
// });

app.get('/cliente/:id/compra', async (req, res) => {
    await compra
      .findAll({
        where: { ClienteId: req.params.id }
      })
      .then(item => {
        return res.json({
          error: false,
          item
        })
      })
      .catch(function (erro) {
        return res.status(400).json({
          error: true,
          message: 'Erro: Não foi possível fazer a conexão!'
        })
      })
  })



  app.get('/produto/:id/compras', async (req, res) => {
    await itemcompra
      .findAll({
        where: { ProdutoId: req.params.id }
      })
      .then(item => {
        return res.json({
          error: false,
          item
        })
      })
      .catch(function (erro) {
        return res.status(400).json({
          error: true,
          message: 'Erro: Não foi possível fazer a conexão!'
        })
      })
  })

app.get('/compras/:id', async(req,res)=>{
    await compra.findByPk(req.params.id)
    .then(comp =>{
        return res.json({
            error: false,
            comp
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
        message: "Erro: código não encontrado!"
        }); 
    });
});

// atualiza produto , compra .e item compra 

app.put('/atualizaproduto', async(req,res)=> {
    await produto.update(req.body, {
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Produto foi alterado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Houve erro na alteraçao da compra"
        });
    });
});

app.put('/atualizacompra', async(req,res)=> {
    await compra.update(req.body, {
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Compra foi alterada com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Houve erro na alteraçao da compra"
        });
    });
});


app.put('/atualizaitemcompra', async(req,res)=> {
    await itemcompra.update(req.body, {
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Item da Compra foi alterado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Houve erro na alteraçao do Item da Compra"
        });
    });
});
//Metodo de excluir os produtos , compra e item produto

app.get('/excluirproduto/:id', async(req,res) =>{
    await produto.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Produto foi excluído com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o produto."
        });
    });
});

app.get('/excluircompra/:id', async(req,res) =>{
    await compra.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Compra foi excluída com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir a Compra."
        });
    });
});

app.get('/excluiritemcompra/:id', async(req,res) =>{
    await itemcompra.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Item da Compra foi excluído com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o Item da Compra."
        });
    });
});


let port=process.env.PORT || 3001;

app.listen(port, (req,res) => {
    console.log('Servidor Ativo: http://localhost:3001');
})

//npx nodemon Controller.js