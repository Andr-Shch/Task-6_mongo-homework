const faker = require('faker');

const generateUser = ({
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  department,
  createdAt = new Date()
} = {}) => ({
  firstName,
  lastName,
  department,
  createdAt
});

const generateArticle = ({
  name = faker.name.title(),
  description= faker.lorem.words(),
  type,
  tags=[]
} = {}) => ({
  name,
  description,
  type,
  tags
});

module.exports = {
  mapUser: generateUser,
  getRandomFirstName: () => faker.name.firstName(),
  mapArticle:generateArticle
};
