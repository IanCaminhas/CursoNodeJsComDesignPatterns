//biblioteca para a definição de caminhos.Exemplos: encontrar, armazenar arquivos, etc
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

/*__dirname é uma variavel global -> forma de pegar
    o path do arquivo que está sendo invocado o __dirname:
    No caso é o src/config/upload
*/
/*Dessa forma, consegui pegar o path do local para armazenar as imagens, pois ele sobe
dois nives em duas oportunidades ate chegar na pasta uploads. Dessa forma, sai do nivel atual*/
const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');

export default {
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder, //a pasta onde vai ser salvo o avatar
    // file contem o nome original do arquivo enviado pelo usuario entre outras funções.
    // Dentro da funcao, o nome do arquivo sera alterado
    filename(request, file, callback) {
      //simplesmente estou criando um hash
      const fileHash = crypto.randomBytes(10).toString('hex');
      //agora vou compor o nome do arquivo. Assim, vai ser difícil existir dois arquivos com nomes iguais no servidor.
      //Em suma, nome do arquivo que vai para o servidor
      const filename = `${fileHash}-${file.originalname}`;

      //recebe 2 parâmetros: 1 - o erro(no caso do curso o null)/2 - de fato o que vai executar, no caso: a definição do nome do arquivo
      callback(null, filename);
    }, //vai definir de que forma agente vai compor o nome do arquivo
  }), //ou seja, armazenar em um disco do servidor
}
