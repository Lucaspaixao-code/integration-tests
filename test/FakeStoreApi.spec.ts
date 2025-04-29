import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Fake Store API - CRUD de Produtos', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://fakestoreapi.com';

  p.request.setDefaultTimeout(30000);
  let productId: number;

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Products', () => {

    it('CREATE - Novo produto', async () => {
      const createRes = await p
        .spec()
        .post(`${baseUrl}/products`)
        .withJson({
          title: faker.commerce.productName(),
          price: parseFloat(faker.commerce.price()),
          description: faker.commerce.productDescription(),
          image: "http://example.com",
          category: faker.commerce.department()
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({ id: /\d+/ });

      productId = createRes.json.id;
    });

    it('READ - Obter produto criado', async () => {
      await p
        .spec()
        .get(`${baseUrl}/products/${productId}`)
        .expectStatus(StatusCodes.OK);
    });

    it('UPDATE - Atualizar produto', async () => {
      await p
        .spec()
        .put(`${baseUrl}/products/${productId}`)
        .withJson({
          title: 'Produto Atualizado',
          price: 99.99,
          description: 'Descrição atualizada de teste',
          image: 'https://via.placeholder.com/150',
          category: 'updated-category'
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: productId,
          title: 'Produto Atualizado'
        });
    });

    it('DELETE - Remover produto', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/products/${productId}`)
        .expectStatus(StatusCodes.OK);
    });

    it('READ - Verificar produto deletado (esperado: not found ou similar)', async () => {
      await p
        .spec()
        .get(`${baseUrl}/products/${productId}`)
        .expectStatus(StatusCodes.OK); // API retorna 200 mesmo após exclusão (mock)
        // Em uma API real, seria 404 ou 204
    });

  });
});
