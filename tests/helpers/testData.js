import faker from "faker";

const newArticle = {
  title: faker.lorem.words(15),
  description: faker.lorem.words(50),
  body: "I set fire to the rain, and that was the last time",
  tagsList: ["reactjs", "angularjs", "dragons"]
};
const newComment = {
  body: "I like this article however, You should rename the title"
};

const users = {
  dummyUser: {
    email: "luc.bayo@gmail.com",
    password: "password",
    username: "luc2017"
  },
  dummyUser2: {
    email: "fake.email@gmail.com",
    password: "password",
    username: "jean786786"
  },
  dummyUser3: {
    email: "fabrice.niyomwungeri@andela.com",
    password: "password98",
    username: "fabrice92"
  }
};

const tokenEmailVerication = {
  invalidToken:
    "eyJhbGciOiJIUzJpZCI6ImI5ZjZjN2JiLWM1NTItNDUyNS04MTUwLWI0NTI5NjNkMTZiZiIsImlhdCI6MTU1MDAwODA4Mn0.xCpwywFSzqHXbikot0SzS8fUpPKsqMVMtgmpf4OD_l8",
  wrongToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU0MzM0YTA4LTMyMWEtNDdhYS1iMGVmLTQ5ODZmMWYyN2Q0OSIsImlhdCI6MTU1MDA1MzIzN30.O2QZO576DJ-iLc1ge7yU-jHdoAlQq9CK9Kc6QGqRuic"
};

const sendGridResponse = [
  {
    statusCode: 202,
    headers: {
      server: "nginx",
      date: "Mon, 18 Feb 2019 10:21:11 GMT",
      "content-type": "text/plain; charset=utf-8",
      "content-length": "0",
      connection: "close",
      "x-message-id": "IP2o4bUMSCafkr95SVicWg",
      "access-control-allow-origin": "https://sendgrid.api-docs.io",
      "access-control-allow-methods": "POST",
      "access-control-allow-headers":
        "Authorization, Content-Type, On-behalf-of, x-sg-elas-acl",
      "access-control-max-age": "600",
      "x-no-cors-reason": "https://sendgrid.com/docs/Classroom/Basics/API/cors.html"
    },
    request: {
      uri: {
        protocol: "https:",
        slashes: true,
        auth: null,
        host: "api.sendgrid.com",
        port: 443,
        hostname: "api.sendgrid.com",
        hash: null,
        search: null,
        query: null,
        pathname: "/v3/mail/send",
        path: "/v3/mail/send",
        href: "https://api.sendgrid.com/v3/mail/send"
      },
      method: "POST",
      headers: {
        Accept: "application/json",
        "User-agent": "sendgrid/6.3.0;nodejs",
        Authorization:
          "Bearer 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",
        "content-type": "application/json",
        "content-length": 2500
      }
    }
  },
  null
];
const article = {
  title: faker.lorem.words(15),
  description: faker.lorem.words(50),
  body: faker.lorem.words(500)
};
export { newArticle, newComment, users, tokenEmailVerication, sendGridResponse, article };
