import request from 'supertest';

import '@config/config';
import '@config/mongoose';
import app from '../../src/app';
import { faker } from '@faker-js/faker';
import { MovieModel } from '@models/movie';
import mongoose from 'mongoose';
import { CreateUserDto } from '@dto/users/create-user.dto';
import { CreateCommentDto } from '@dto/movies/create-comment.dto';
import { UserModel } from '@models/user';
import { CommentModel } from '@models/comments';

async function getToken(email: string, password: string): Promise<string> {
  return await request(app)
    .post('/api/users/login')
    .send({ email, password })
    .then((res) => res.body.token);
}
const email = faker.internet.email();
const password = faker.internet.password();

describe('GET /api/movies', () => {
  beforeAll(async () => {
    const movieCount = 10;

    // Create test data
    for (let i = 0; i < movieCount; i++) {
      await MovieModel.create({
        name: faker.name.jobTitle(),
        releaseDate: faker.date.recent(),
        synopsis: faker.lorem.sentence(),
        cover: faker.image.imageUrl(),
        trailer: faker.internet.url(),
        genres: [faker.lorem.word(), faker.lorem.word()],
        cast: [faker.name.firstName(), faker.name.firstName()],
        score: faker.datatype.number({ min: 1, max: 5, precision: 0.01 }),
        screenwriters: [faker.name.firstName(), faker.name.firstName()],
        platforms: [
          {
            name: faker.lorem.word(),
            url: faker.internet.url(),
          },
        ],
      });
    }

    // Create a user
    const createUserData = new CreateUserDto();
    createUserData.email = email;
    createUserData.password = password;
    createUserData.dateOfBirth = faker.date.past();
    createUserData.name = faker.name.firstName() + ' ' + faker.name.lastName();
    await request(app).post('/api/users/signup').send(createUserData);
  });

  it('Return a list of movies - 200 OK', async () => {
    await request(app).get('/api/movies').expect(200);
  });

  it('Create a comment - 201 Created', async () => {
    const token = await getToken(email, password);
    const movie = await MovieModel.findOne({});
    const comment: CreateCommentDto = {
      comment: faker.lorem.sentence(),
    };

    await request(app)
      .post(`/api/movies/${movie.id}/comment`)
      .set('Authorization', `Bearer ${token}`)
      .send(comment)
      .expect(201);
  });

  it('Get movie details - 200 OK', async () => {
    const token = await getToken(email, password);
    const movie = await MovieModel.findOne({});

    await request(app)
      .get(`/api/movies/${movie.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await MovieModel.deleteMany({});
    await UserModel.deleteMany({});
    await CommentModel.deleteMany({});
    await mongoose.connection.close();
  });
});
