import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('API REQRES', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://reqres.in';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('get', async () => {
    await p
      .spec()
      .get(`${baseUrl}/api/users/`)
      .withQueryParams('page', '2')
      .withHeaders('x-api-key', 'reqres-free-v1')
      .expectStatus(StatusCodes.OK)
  });

  it('GET - Listar usuários com paginação', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}/api/users`)
      .withQueryParams('page', '2')
      .withHeaders('x-api-key', 'reqres-free-v1')
      .expectStatus(StatusCodes.OK)
      .expectJsonMatch({
        page: 2,
        per_page: 6,
        total: 12,
        total_pages: 2
      });
  });

  it('GET - Obter usuário específico', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}/api/users/2`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .expectStatus(StatusCodes.OK)
      .expectJsonMatch({
        data: {
          id: 2,
          email: 'janet.weaver@reqres.in',
          first_name: 'Janet',
          last_name: 'Weaver'
        }
      });
  });

  it('POST - Login falha (senha ausente)', async () => {
    await p
      .spec()
      .post(`${baseUrl}/api/login`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .withJson({
        email: "eve.holt@reqres.in"
      })
      .expectStatus(StatusCodes.BAD_REQUEST)
      .expectJsonMatch({
        error: "Missing password"
      });
  });

  it('POST - Registrar usuário falha (sem senha)', async () => {
    await p
      .spec()
      .post(`${baseUrl}/api/register`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .withJson({
        email: "eve.holt@reqres.in"
      })
      .expectStatus(StatusCodes.BAD_REQUEST)
      .expectJsonMatch({
        error: "Missing password"
      });
  });

  it('PUT - Atualizar usuário', async () => {
    const updatedUser = {
      name: "Lucas Updated",
      job: "Senior QA Engineer"
    };
  
    await p
      .spec()
      .put(`${baseUrl}/api/users/2`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .withJson(updatedUser)
      .expectStatus(StatusCodes.OK)
      .expectJsonMatch(updatedUser);
  });

  it('PATCH - Atualizar parcialmente um usuário', async () => {
    const partialUpdate = {
      job: "Automation Engineer"
    };
  
    await p
      .spec()
      .patch(`${baseUrl}/api/users/2`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .withJson(partialUpdate)
      .expectStatus(StatusCodes.OK)
      .expectJsonMatch(partialUpdate);
  });

  it('DELETE - Remover usuário', async () => {
    await p
      .spec()
      .delete(`${baseUrl}/api/users/2`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .expectStatus(StatusCodes.NO_CONTENT);
  });

  it('PUT - Atualizar usuário inexistente', async () => {
    const updatedUser = {
      name: "Non-existent User",
      job: "Ghost Job"
    };
  
    await p
      .spec()
      .put(`${baseUrl}/api/users/999`)
      .withHeaders('x-api-key', 'reqres-free-v1')
      .withJson(updatedUser)
      .expectStatus(StatusCodes.OK)
      .expectJsonMatch(updatedUser);
  });
  
})


