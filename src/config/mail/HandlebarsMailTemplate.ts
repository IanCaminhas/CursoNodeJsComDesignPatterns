import Handlebars from 'handlebars';

//criação de uma interface com propriedades dinâmicas
interface ITemplateVariable {
  /*
    o conteudo pode ser uma string ou um numero.
    [key: string] -> A chave precisa ser uma string.
    Aqui não precisa especificar a quantidade de os tipos para
    a estrutura chave-valor
  */
  [key: string]: string | number;
}

interface IParseMailTemplate {
  template: string; //vai ser o html
  //objetivo de variables -> deixar o mais genérico possível
  variables: ITemplateVariable; //não consigo prever a qtd de variables, tampouco quais variabels. Solução: criação de uma interface para valores dinâmicos
}

/*A classe vai ter um metodo que vai fazer o parser:
  Ou seja, a classe vai ter um method que vai pegar
  o template e as variáveis. Vai juntar isso e vai montar
  o conteúdo do email
*/
export default class HandlebarsMailTemplate {
  //vai pegar o conteúdo das variáveis e incluir no HTML
  //O retorno vai ser um HTML(uma string mesmo)
  /*nao consigo prever a qtd de variables.
  Posso mandar somente o token. Ou o Id e nome do usuario.
  O outro posso mandar outras informações.
  Solução: criar uma interface
  */

  public async parse({
    template,
    variables,
  }: IParseMailTemplate): Promise<string> {
    const parseTemplate = Handlebars.compile(template);

    return parseTemplate(variables);
  }
}

//ajustar a configuração do serviço e-mail. Esse ajuste foi feito no EtherealMail
