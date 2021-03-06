import { Alert, Container, Table } from 'reactstrap'
import axios from 'axios'
import { Link } from "react-router-dom";

import { api } from '../../../config'
import { useEffect, useState } from 'react'

export const Item = (props) => {
  // console.log(props.match.params.id)
  const [data, setData] = useState([])

  const[id] = useState(props.match.params.id)

  const [status, setStatus] = useState({
    type: '',
    message: ''
  })

  const getItens = async () => {
    await axios
      .get(api + '/servico/'+id+'/pedidos')
      .then(response => {
        console.log(response.data.item)
        setData(response.data.item)
      })
      .catch(() => {
        setStatus({
          type: 'error',
          message: 'Erro: sem conexão com a API'
        })
        console.log('Erro: sem conexão com a API')
      })
  }

  useEffect(() => {
    getItens();
  }, [id]);

  return (
    <div>
      <Container>
        <div>
          <h1>Pedidos do serviço</h1>
        </div>
        {status.type === 'error' ? (
          <Alert color="danger">{status.message}</Alert>
        ) : (
          ''
        )}
        <Table striped>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Quantidade</th>
              <th>Valor</th>
             
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.ServicoId}>
                <td>{item.PedidoId}</td>
                <td>{item.quantidade}</td>
                <td>{item.valor}</td>
              
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  )
}