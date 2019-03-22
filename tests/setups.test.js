/* eslint-disable import/no-mutable-exports */
import assert from "assert";
import jwt from "jsonwebtoken";
import db from "../models";

global.assert = assert;
/* eslint-disable import/no-mutable-exports */
let token;
const { Article, User, Permission, Role } = db;
const dummyArticle = {
  title: "History of a lone wolf",
  description: "lone wolf",
  body: "I used to be a lone wolf",
  slug: "article"
};
const dummyUser = {
  firstName: "espoir",
  lastName: "Murhabazi",
  password: "password",
  email: "you.can.see@me.com",
  username: "youcant@"
};
const dummyRole = {
  name: "admin",
  description: "brah brah"
};
let user;
let post;
let role;
const createTestData = async () => {
  role = await Role.create(dummyRole);
  user = await User.create({ ...dummyUser, roleId: role.id });
  token = jwt.sign(
    {
      email: user.email,
      username: user.username,
      id: user.id
    },
    process.env.SECRET_KEY
  );
  user.token = token;
  const userId = user.id;
  const article = await Article.create({ ...dummyArticle, userId });
  post = article.dataValues;
};

before(createTestData);

after("Destroy the database ", async () => {
  await User.destroy({
    where: {},
    truncate: true,
    cascade: true
  });
  await Permission.destroy({
    where: {},
    truncate: true,
    cascade: true
  });
  await Role.destroy({
    where: {},
    truncate: true,
    cascade: true
  });
});

export { post, user, token };
