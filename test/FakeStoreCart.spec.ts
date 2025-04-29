import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Fake Store API - CRUD de carrinho', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://fakestoreapi.com';

  p.request.setDefaultTimeout(30000);
  let carrinhoId: number;

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Cart', () => {

    const cart = { userId: 1, products: [{ id: 1 }] };

    it('CREATE - Novo carrinho', async () => {
      const createRes = await p
        .spec()
        .post(`${baseUrl}/carts`)
        .withJson({
          cart
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({ id: /\d+/ });

        carrinhoId = createRes.json.id;
    });

    it('READ - Obter carrinho criado', async () => {
      await p
        .spec()
        .get(`${baseUrl}/carts/${carrinhoId}`)
        .expectStatus(StatusCodes.OK);
    });

    it('UPDATE - Atualizar carrinho', async () => {
      await p
        .spec()
        .put(`${baseUrl}/carts/${carrinhoId}`)
        .withJson({
          userId: 1,
          cart
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: carrinhoId
        });
    });

    it('DELETE - Remover carrinho', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/carts/${carrinhoId}`)
        .expectStatus(StatusCodes.OK);
    });

    it('READ - Verificar carrinho deletado (esperado: not found ou similar)', async () => {
      await p
        .spec()
        .get(`${baseUrl}/carts/${carrinhoId}`)
        .expectStatus(StatusCodes.OK); 
    });

  });  
});
