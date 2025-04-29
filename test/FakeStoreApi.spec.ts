import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Fake Store API', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://fakestoreapi.com';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Products', () => {
    it('Create New Product', async () => {
      await p
        .spec()
        .post(`${baseUrl}/products`)
        .withJson({
          title: faker.commerce.productName(),
          price: parseFloat(faker.commerce.price()),
          description: faker.commerce.productDescription(),
          image:  "http://example.com",
          category: faker.commerce.department()
        })
        .expectStatus(StatusCodes.OK) // A API retorna 200 ao criar produto
        .expectJsonLike({
          id: /\d+/,
          title: /\w+/,
        });
    });

    it('Get All Products', async () => {
      await p
        .spec()
        .get(`${baseUrl}/products`)
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'title', 'price', 'category'],
          }
        });
    });
  });
});


//doc: https://fakestoreapi.com/docs#tag/Products/operation/addProduct