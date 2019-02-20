import faker from "faker";

const newArticle = {
  title: "How to train your dragon",
  description: "Ever wonder how?",
  body: "You have to believe",
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
  }
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
export { newArticle, newComment, users, sendGridResponse, article };
