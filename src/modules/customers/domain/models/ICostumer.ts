/*
  Toda implementação feita de uma entidade/modelo de dados da
  estrutura de um cliente, vou ter que implementar a interface abaixo.
*/

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}
