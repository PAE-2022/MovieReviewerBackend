import faker from '@faker-js/faker';
import { UserModel } from './user';

describe('User model test', () => {
  it('Should hash password', async () => {
    // Arrange
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.name.firstName() + ' ' + faker.name.lastName();
    const dateOfBirth = faker.date.past();
    const avatar = faker.image.avatar();

    // Act
    const user = new UserModel({
      email,
      password,
      name,
      dateOfBirth,
      avatar,
    });

    await user.validate();

    // Assert
    expect(user.password).not.toBe(password);
  });
});
