import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import AppError from './errors/AppError';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

/* Middleware abaixo: interceptar todas as mensagens da
aplicação para customizar a apresentação do erro no front-end.
Em suma, vai capturar o erro gerado para ser tratado e apresentado
na forma mais amigável.
error: Error já é nativo do JavaScript. Não é necessário importar.
O Middleware recebe 4 parâmetros:
error: Error, request: Request, response: Response, next: NextFunction
*/
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    //Se o error for uma instância da classe AppError(ou seja da própria aplicação), lança o status e o message.
    //exemplos de erros: validação, autenticação, página não encontrada
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }
    //se o erro não for da aplicação, ou seja, um erro desconhecido
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () =>{
  console.log('server started on port 3333!');
});
