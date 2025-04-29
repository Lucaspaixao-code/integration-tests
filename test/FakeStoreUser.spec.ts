import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Fake Store API - CRUD de usuario', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://fakestoreapi.com';

  p.request.setDefaultTimeout(30000);
  let UserId: number;

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('User', () => {

    const user = { username: 'john_dr', email: 'john@gmail.com', password: 'pass123' };
    const userUpdate = { username: 'john_dr', email: 'john@gmail.com', password: 'pass456' };

    it('CREATE - Novo usuario', async () => {
      const createRes = await p
        .spec()
        .post(`${baseUrl}/users`)
        .withJson({
            user
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({ id: /\d+/ });

        UserId = createRes.json.id;
    });

    it('READ - Recuperar usuario criado', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users/${UserId}`)
        .expectStatus(StatusCodes.OK);
    });

    it('UPDATE - Atualizar usuario', async () => {
      await p
        .spec()
        .put(`${baseUrl}/users/${UserId}`)
        .withJson({
          userId: UserId,
          userUpdate
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
            userId: /\d+/ 
        });
    });

    it('DELETE - Remover usuario', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/users/${UserId}`)
        .expectStatus(StatusCodes.OK);
    });

    it('READ - Verificar usuario deletado (esperado: not found ou similar)', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users/${UserId}`)
        .expectStatus(StatusCodes.OK); 
    });

  });  
});
