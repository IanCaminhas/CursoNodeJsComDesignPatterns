export default {
  jwt: {
    secret: process.env.APP_SECRET,
    experiesIn: '1d', //Por quanto tempo esse token vai estar válido ? 1 dia(24h). Ele exprira, aí o usuário vai precisar autenticar novamente para gerar um novo token
  },
};
