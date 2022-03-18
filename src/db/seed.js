/* eslint-disable no-console */

const { Author, Post } = require('./models');
const db = require('./db');

const SEED_PW = '123456';

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');

  const thomas = await Author.create({
    username: 'thomas',
    password: SEED_PW,
  });

  const santiago = await Author.create({
    username: 'santiago',
    password: SEED_PW,
  });

  await Promise.all([
    Post.create({
      text: 'Excepteur occaecat minim reprehenderit cupidatat dolore voluptate velit labore pariatur culpa esse mollit. Veniam ipsum amet eu dolor reprehenderit quis tempor pariatur labore. Tempor excepteur velit dolor commodo aute. Proident aute cillum dolor sint laborum tempor cillum voluptate minim. Amet qui eiusmod duis est labore cupidatat excepteur occaecat nulla.',
      likes: 12,
      reads: 5,
      tags: 'food,recipes,baking',
      popularity: 0.19,
      authorId: santiago.id,
    }),
    Post.create({
      text: 'Ea cillum incididunt consequat ullamco nisi aute labore cupidatat exercitation et sunt nostrud. Occaecat elit tempor ex anim non nulla sit culpa ipsum aliquip. In amet in Lorem ut enim. Consectetur ea officia reprehenderit pariatur magna eiusmod voluptate. Nostrud labore id adipisicing culpa sunt veniam qui deserunt magna sint mollit. Cillum irure pariatur occaecat amet reprehenderit nisi qui proident aliqua.',
      likes: 104,
      reads: 200,
      tags: 'travel,hotels',
      popularity: 0.7,
      authorId: santiago.id,
    }),
    Post.create({
      text: 'Voluptate consequat minim commodo nisi minim ut. Exercitation incididunt eiusmod qui duis enim sunt dolor sit nisi laboris qui enim mollit. Proident pariatur elit est elit consectetur. Velit anim eu culpa adipisicing esse consequat magna. Id do aliquip pariatur laboris consequat cupidatat voluptate incididunt sint ea.',
      likes: 10,
      reads: 32,
      tags: 'travel,airbnb,vacation',
      popularity: 0.7,
      authorId: thomas.id,
    }),
    Author.create({
      username: 'ashanti',
      password: SEED_PW,
    }),
    Author.create({
      username: 'julia',
      password: SEED_PW,
    }),
    Author.create({
      username: 'cheng',
      password: SEED_PW,
    }),
  ]);

  console.log('seeded authors and posts');
}

async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

if (module === require.main) {
  runSeed();
}
