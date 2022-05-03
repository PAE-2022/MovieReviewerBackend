import { generateGravatarUrl } from './gravatar-gen';

describe('Generate gravatar image', () => {
  it('Should generate gravatar image', () => {
    // Arrange
    const imageUrl =
      'https://www.gravatar.com/avatar/aa5ca9c6426ed1a26130e4bf428d62f1?s=200';
    const email = 'alan5142@hotmail.com';
    const size = 200;

    // Act
    const image = generateGravatarUrl(email, size);

    // Assert
    expect(image).toBe(imageUrl);
  });
});
