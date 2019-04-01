/* eslint-disable import/no-mutable-exports */
import assert from "assert";
import jwt from "jsonwebtoken";
import nock from "nock";
import { hashSync, genSaltSync } from "bcrypt";
import dotenv from "dotenv";
import db from "../models";
import constants from "../helpers/constants";
import {
  roleTestData,
  permissionObjects,
  sendGridResponse
} from "./helpers/testData";

global.assert = assert;
/* eslint-disable import/no-mutable-exports */
const { OK } = constants.statusCode;
const { validRole, validRole2 } = roleTestData;

dotenv.config();

global.assert = assert;
/* eslint-disable import/no-mutable-exports */
let roleId,
  post2,
  post3,
  post,
  user,
  newRole,
  newComment,
  user2,
  user3,
  permission,
  token,
  token3,
  newRole2;
const { Article, User, Permission, Role, Comment } = db;

const hashedPassword = async password => {
  const salt = await genSaltSync(parseFloat(process.env.BCRYPT_HASH_ROUNDS) || 10);
  return hashSync(password, salt);
};

const dummyArticle = {
  title: "History of a lone wolf",
  description:
    "String based operators are now deprecated. Please use Symbol based operators for better security, read more at http",
  body: "I used to be a lone wolf",
  slug: "article"
};
const dummyArticle2 = {
  title: "History of a lone wolf",
  description:
    "String based operators are now deprecated. Please use Symbol based operators for better security, read more at http",
  body: "I used to be a lone wolf",
  slug: "article"
};
const dummyArticle3 = {
  title: "History of a lone wolf",
  description:
    "String based operators are now deprecated. Please use Symbol based operators for better security, read more at http",
  body: "I used to be a lone wolf",
  slug: "article"
};
const dummyUser = {
  firstName: "espoir",
  lastName: "Murhabazi",
  password: "lucjdldf2018",
  email: "luc.bayo.test@gmail.com",
  username: "luc2017"
};
const dummyUser3 = {
  firstName: "espoir",
  lastName: "Murhabazi",
  password: "password",
  email: "fabrice.niyomwunger@andela.com",
  username: "luc2018"
};
const dummyUser2 = {
  firstName: "fabrice",
  lastName: "fabM5666",
  password: "password",
  email: "you.can.see123@me.com",
  username: "youcant@123"
};
const dummyComment = {
  body: "I like this article however, You should rename the title"
};

const createTestData = async () => {
    nock("https://api.sendgrid.com")
      .persist()
      .post("/v3/mail/send")
      .reply(OK, { mockResponse: sendGridResponse });
    // user = await User.create({ ...dummyUser });
    // create role
    newRole = await Role.create(validRole);
    newRole2 = await Role.create(validRole2);
    roleId = newRole.id;
    // assign permission to the role
    await permissionObjects.map(async p => {
      const perm = await Permission.findOrCreate({
        where: { ...p, roleId }
      });
      permission = perm;
      return perm;
    });
    // create a user
    user = await User.create({
      ...dummyUser,
      password: await hashedPassword(dummyUser.password),
      roleId
    });
    user2 = await User.create({ ...dummyUser2, roleId });
    user3 = await User.create({ ...dummyUser3, roleId });
    // sign a token
    token = jwt.sign(
      {
        email: user.email,
        username: user.username,
        id: user.id,
        roleId
      },
      process.env.SECRET_KEY
    );
    token3 = jwt.sign(
      {
        email: user3.email,
        username: user3.username,
        id: user3.id,
        roleId
      },
      process.env.SECRET_KEY
    );

    user.token = token;
    const userId = user.id;
    // crate an article
    const article = await Article.create({ ...dummyArticle, userId });
    const article2 = await Article.create({ ...dummyArticle2, userId });
    const article3 = await Article.create({ ...dummyArticle3, userId });
    // create a comment
    const comment = await Comment.create({
      articleId: article.id,
      userId,
      body: dummyComment.body
    });
    newComment = comment.dataValues;
    post = article.dataValues;
    post2 = article2.dataValues;
    post3 = article3.dataValues;
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

export {
  post,
  post2,
  post3,
  user,
  user2,
  user3,
  token,
  token3,
  newRole,
  newComment,
  permission,
  dummyComment,
  newRole2
};
