import request from 'supertest';

import '@config/config';
import '@config/mongoose';
import mongoose from 'mongoose';
import app from '../../src/app';
import { faker } from '@faker-js/faker';
import { MovieModel } from '@models/movie';
import { CreateUserDto } from '@dto/users/create-user.dto';
import { getToken } from '../test-utils/auth';
import { UserModel } from '@models/user';
import { CommentModel } from '@models/comments';

const email = faker.internet.email();
const password = faker.internet.password();

describe('GET /api/users', () => {
  beforeAll(async () => {
    // Delete all content
    await MovieModel.deleteMany({});
    await UserModel.deleteMany({});
    await CommentModel.deleteMany({});

    // Create test data
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
  });

  it('Create a user - 200 OK', async () => {
    const createUserData = new CreateUserDto();
    createUserData.email = email;
    createUserData.password = password;
    createUserData.dateOfBirth = faker.date.past();
    createUserData.name = faker.name.firstName() + ' ' + faker.name.lastName();

    await request(app)
      .post('/api/users/signup')
      .send(createUserData)
      .expect(200);
  });

  it('Login with a user - 200 OK', async () => {
    await request(app)
      .post('/api/users/login')
      .send({ email, password })
      .expect(200);
  });

  it('Login with a user - 401 Unauthorized', async () => {
    await request(app)
      .post('/api/users/login')
      .send({ email: 'aa', password: 'bb' })
      .expect(401);
  });

  it('Add movie to favorites - 200 OK', async () => {
    const token = await getToken(email, password);
    const movie = await MovieModel.findOne({});
    await request(app)
      .post('/api/users/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId: movie.id })
      .expect(200);
  });

  it('Remove movie from favorites - 200 OK', async () => {
    const token = await getToken(email, password);
    const movie = await MovieModel.findOne({});
    await request(app)
      .delete(`/api/users/favorites/${movie.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
