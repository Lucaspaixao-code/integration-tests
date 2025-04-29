import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Fake Store API - Login', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://fakestoreapi.com';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('User', () => {

    it('Auth - Login', async () => {
      const createRes = await p
        .spec()
        .post(`${baseUrl}/auth/login`)
        .withJson({
            username: 'john_dr', 
            password: 'pass456'
        })
        .expectStatus(StatusCodes.UNAUTHORIZED)
        .expectBody("username or password is incorrect");
    });

  });  
});
