import request from 'supertest';
import app from '../../src/app';

export async function getToken(
  email: string,
  password: string,
): Promise<string> {
  return await request(app)
    .post('/api/users/login')
    .send({ email, password })
    .then((res) => res.body.token);
}
