import AppError from '@shared/http/errors/AppError';
import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import authConfig from '@config/auth';

//Foi uma tipagem do payload do token
interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

/*O middleware tem pelo menos 3 params:
request, response, next-> leva para o próximo middleware ou para a requsicao em si. */
export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  //vai guardar o token
  const authHeader = request.headers.authorization;
  //se não foi enviado o token, disparar um msg de erro
  if (!authHeader) {
    throw new AppError('JWT Token is missing.');
  }

  //Token foi enviado.
  //Token possui 2 partes: Bearer sdsdhfdsjfhdsj(token). O token São duas partes separadas por um espaço.
  //Fazendo um split, sendo gerado um array com 2 posições. Posição 0 vai ter o Bearer. Objetivo: a posição 1
  //Ignoro a posição 1. por isso ficou [, token]. Não quero o conteudo da posição 0, não vou usar pra nada.
  const [, token] = authHeader.split(' ');
  // como saber se o token é da aplicação ? usando uma biblioteca jsonwebtoken
  try {
    // 2 params: 1 - o token, 2 - o secret
    //Assim, verifico que esse token foi criado pela aplicação. Usando a secret para isso
    const decodedToken = verify(token, authConfig.jwt.secret);

    const { sub } = decodedToken as ITokenPayload; //TokenPayload e uma interface

    /*Com o middleware configurado dessa forma,
    todas as rotas da aplicação terá o id disponivel
    Foi feita uma sobrescrita do metodo request da bib express.
    request por padrao nao vem o id do usuario. Foi Acrescentado em
    @Types esse sobrescrita de metodo.
    Para inluir essa pasta @Types, devo importar em tsconfig.json tbm
    */
    request.user = {
      id: sub,
    };

    /*
      {
        iat: 1670755186, -> timestamp de quando o token foi criado
        exp: 1670841586, -> timestamp do momento que o token vai expirar
        sub: '3de08c16-8962-42bd-a376-47fc4abeace4' -> o id do usuário/dono do token/ fica em subject
        console.log(decodedToken);
        Ao pegar o sub, facilita as operações... Pois já vou ter em mãos o id do usuário
        iat, exp e sub foram inclusos na interface TokenPayload
      }
    */

    // se não der nada, o middleware pode seguir em frente
    return next();
  } catch {
    //Se não der certo, lanço uma exception. Assim, protegi a rota
    throw new AppError('Invalid JWT Token');
  }
}
