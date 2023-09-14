# blog-api

API para estudo de testes de API.

Passos para executar a API:

1. Execute o comando `npm i` ou `yarn`
2. Execute o comando `yarn start` ou `npm start`

Após executar a API, é possível acessar a documentação por meio da url:

```
http://localhost:3000/docs
```

## Otimização da API

Para otimização da api foi feita a paginação do endpoint alvo de testes de carga, também foi utilizado o recurso de multithread do node e foi feito o cache da requisição com o redis.

## Teste de carga

Para realizar o teste de carga foi utilizado o artillery com a seguinte configuração:

- duração: 10s
- Requisições por segundo 3250
- Trazendo 100 Posts por requisição

Essa configuração pode ser vista em: ./scripts/load_tests/find_posts.yaml

#### Configurações da máquina que rodou o teste

Processador: Intel(R) Core(TM) i3-6006U CPU @ 2.00GHz 4cpus x86_64
Memória RAM: DDR4 8GB + DDR3 4GB
SSD: 240GB | 500MB/s leitura e 320MB/s gravação

Obtive resposta com status 200 para todas as requisições feitas no teste de carga.

## Print do teste de carga feito

![Captura de tela de 2023-09-14 18-05-23](https://github.com/RafaelCastro1002/api-otimizada-multithread-redis/assets/38334753/61ff919a-d9f4-4338-b1f5-7812fe784916)

