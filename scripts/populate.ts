import { faker } from "@faker-js/faker/locale/pt_PT";
import { User } from "../src/entities/User";
import { Post } from "../src/entities/Post";
import { DataSource } from "typeorm";

const POPULATION_SIZE = 100000;

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Post],
  migrations: [],
  subscribers: [],
});

const createRandomPost = (): Post => {
  const title = faker.lorem.sentence({
    min: 15,
    max: 30,
  });
  const content = faker.lorem.paragraphs();

  return Post.createPost(title, content);
};

const createRandomUser = (): User => {
  const name = faker.person.fullName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  return User.createUser(name, email, password);
};

const saveUserAndPosts = async () => {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  const postRepository = AppDataSource.getRepository(Post);

  const randomUser = createRandomUser();

  const user = await userRepository.save(randomUser);

  console.log("user created: ", user);

  for (let index = 1; index <= POPULATION_SIZE; index++) {
    const post = createRandomPost();

    await postRepository.save({
      ...post,
      user,
    });

    console.log(`Post #${index} created`);
  }
};

saveUserAndPosts().then(() => process.exit(0));
