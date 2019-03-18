import faker from "faker";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import constants from "../../helpers/constants";

dotenv.config();

const { ACCEPTED, INTERNAL_SERVER_ERROR } = constants;
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
  },
  dummyUser4: {
    email: "me@example.com",
    password: "password",
    username: "luc2018"
  },
  dummyUser5: {
    profile: {
      bio: "I am a software developer",
      image: "image-link",
      firstName: "YvesIraguha",
      lastName: "Iraguha",
      gender: "Male",
      phone: "07836378367373",
      address: "Kigali city"
    }
  },
  dummyUser6: {
    profile: {
      bio: "I am a software developer",
      image: "image-link",
      firstName: " ",
      lastName: " ",
      gender: "Male",
      phone: "07836378367373",
      address: "Kigali city"
    }
  },
  dummyUser7: {
    profile: {
      bio: "I am a software developer",
      image: "image-link",
      following: "false"
    }
  },
  dummyUser8: {
    profile: {
      bio: "I am a software developer",
      image: "image-link",
      following: "false"
    }
  }
};

const tokenEmailVerication = {
  invalidToken:
    "eyJhbGciOiJIUzJpZCI6ImI5ZjZjN2JiLWM1NTItNDUyNS04MTUwLWI0NTI5NjNkMTZiZiIsImlhdCI6MTU1MDAwODA4Mn0.xCpwywFSzqHXbikot0SzS8fUpPKsqMVMtgmpf4OD_l8",
  wrongToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU0MzM0YTA4LTMyMWEtNDdhYS1iMGVmLTQ5ODZmMWYyN2Q0OSIsImlhdCI6MTU1MDA1MzIzN30.O2QZO576DJ-iLc1ge7yU-jHdoAlQq9CK9Kc6QGqRuid",
  mutatedToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJZdmVzIiwibGFzdG5hbWUiOiJJcmFndWhhIiwiSWQiOiJhc3NhZGFmYWRhaGZhaGRhaGRhaCIsImlhdCI6MTU1MTE5NDI0NX0.
  BD3GY0JypL9E0B3kgh0ps3m2CJv_8UXMfz_-SI92nCE`,
  noUser: jwt.sign(
    {
      email: "yves.iraguha@gmail.com",
      id: "a934b3c4-9593-4455-b08e-c82de23ed165",
      username: "YvesIraguha"
    },
    process.env.SECRET_KEY
  )
};

const sendGridResponse = [
  {
    statusCode: ACCEPTED,
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
        Authorization: process.env.SENDGRID_API_KEY,
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
  body: faker.lorem.words(INTERNAL_SERVER_ERROR)
};
const opnResponse = {
  _events: {},
  _eventsCount: 0,
  _closesNeeded: 3,
  _closesGot: 0,
  connected: false,
  signalCode: null,
  exitCode: null,
  killed: false,
  spawnfile: "open",
  _handle: {
    pid: 15495
  },
  spawnargs: [
    "open",
    "https://twitter.com/intent/tweet?text=http://localhost:3000/api/v1/articles/how-to-train-your-dragon-gdrcq9h9rt"
  ],
  pid: 15495,
  stdin: {
    connecting: false,
    _hadError: false,
    _handle: {},
    _parent: null,
    _host: null,
    _readableState: {
      objectMode: false,
      highWaterMark: 16384,
      buffer: {
        head: null,
        tail: null,
        length: 0
      },
      length: 0,
      pipes: null,
      pipesCount: 0,
      flowing: null,
      ended: false,
      endEmitted: false,
      reading: false,
      sync: true,
      needReadable: false,
      emittedReadable: false,
      readableListening: false,
      resumeScheduled: false,
      emitClose: false,
      destroyed: false,
      defaultEncoding: "utf8",
      awaitDrain: 0,
      readingMore: false,
      decoder: null,
      encoding: null
    },
    readable: false,
    _events: {},
    _eventsCount: 1,
    _writableState: {
      objectMode: false,
      highWaterMark: 16384,
      finalCalled: false,
      needDrain: false,
      ending: false,
      ended: false,
      finished: false,
      destroyed: false,
      decodeStrings: false,
      defaultEncoding: "utf8",
      length: 0,
      writing: false,
      corked: 0,
      sync: true,
      bufferProcessing: false,
      writecb: null,
      writelen: 0,
      bufferedRequest: null,
      lastBufferedRequest: null,
      pendingcb: 0,
      prefinished: false,
      errorEmitted: false,
      emitClose: false,
      bufferedRequestCount: 0,
      corkedRequestsFree: {
        next: null,
        entry: null
      }
    },
    writable: true,
    allowHalfOpen: false,
    _sockname: null,
    _pendingData: null,
    _pendingEncoding: "",
    server: null,
    _server: null
  },
  stdout: {
    connecting: false,
    _hadError: false,
    _handle: {
      reading: true
    },
    _parent: null,
    _host: null,
    _readableState: {
      objectMode: false,
      highWaterMark: 16384,
      buffer: {
        head: null,
        tail: null,
        length: 0
      },
      length: 0,
      pipes: null,
      pipesCount: 0,
      flowing: null,
      ended: false,
      endEmitted: false,
      reading: true,
      sync: false,
      needReadable: true,
      emittedReadable: false,
      readableListening: false,
      resumeScheduled: false,
      emitClose: false,
      destroyed: false,
      defaultEncoding: "utf8",
      awaitDrain: 0,
      readingMore: false,
      decoder: null,
      encoding: null
    },
    readable: true,
    _events: {},
    _eventsCount: 2,
    _writableState: {
      objectMode: false,
      highWaterMark: 16384,
      finalCalled: false,
      needDrain: false,
      ending: false,
      ended: false,
      finished: false,
      destroyed: false,
      decodeStrings: false,
      defaultEncoding: "utf8",
      length: 0,
      writing: false,
      corked: 0,
      sync: true,
      bufferProcessing: false,
      writecb: null,
      writelen: 0,
      bufferedRequest: null,
      lastBufferedRequest: null,
      pendingcb: 0,
      prefinished: false,
      errorEmitted: false,
      emitClose: false,
      bufferedRequestCount: 0,
      corkedRequestsFree: {
        next: null,
        entry: null
      }
    },
    writable: false,
    allowHalfOpen: false,
    _sockname: null,
    _pendingData: null,
    _pendingEncoding: "",
    server: null,
    _server: null
  },
  stderr: {
    connecting: false,
    _hadError: false,
    _handle: {
      reading: true
    },
    _parent: null,
    _host: null,
    _readableState: {
      objectMode: false,
      highWaterMark: 16384,
      buffer: {
        head: null,
        tail: null,
        length: 0
      },
      length: 0,
      pipes: null,
      pipesCount: 0,
      flowing: null,
      ended: false,
      endEmitted: false,
      reading: true,
      sync: false,
      needReadable: true,
      emittedReadable: false,
      readableListening: false,
      resumeScheduled: false,
      emitClose: false,
      destroyed: false,
      defaultEncoding: "utf8",
      awaitDrain: 0,
      readingMore: false,
      decoder: null,
      encoding: null
    },
    readable: true,
    _events: {},
    _eventsCount: 2,
    _writableState: {
      objectMode: false,
      highWaterMark: 16384,
      finalCalled: false,
      needDrain: false,
      ending: false,
      ended: false,
      finished: false,
      destroyed: false,
      decodeStrings: false,
      defaultEncoding: "utf8",
      length: 0,
      writing: false,
      corked: 0,
      sync: true,
      bufferProcessing: false,
      writecb: null,
      writelen: 0,
      bufferedRequest: null,
      lastBufferedRequest: null,
      pendingcb: 0,
      prefinished: false,
      errorEmitted: false,
      emitClose: false,
      bufferedRequestCount: 0,
      corkedRequestsFree: {
        next: null,
        entry: null
      }
    },
    writable: false,
    allowHalfOpen: false,
    _sockname: null,
    _pendingData: null,
    _pendingEncoding: "",
    server: null,
    _server: null
  },
  stdio: [
    {
      connecting: false,
      _hadError: false,
      _handle: {},
      _parent: null,
      _host: null,
      _readableState: {
        objectMode: false,
        highWaterMark: 16384,
        buffer: {
          head: null,
          tail: null,
          length: 0
        },
        length: 0,
        pipes: null,
        pipesCount: 0,
        flowing: null,
        ended: false,
        endEmitted: false,
        reading: false,
        sync: true,
        needReadable: false,
        emittedReadable: false,
        readableListening: false,
        resumeScheduled: false,
        emitClose: false,
        destroyed: false,
        defaultEncoding: "utf8",
        awaitDrain: 0,
        readingMore: false,
        decoder: null,
        encoding: null
      },
      readable: false,
      _events: {},
      _eventsCount: 1,
      _writableState: {
        objectMode: false,
        highWaterMark: 16384,
        finalCalled: false,
        needDrain: false,
        ending: false,
        ended: false,
        finished: false,
        destroyed: false,
        decodeStrings: false,
        defaultEncoding: "utf8",
        length: 0,
        writing: false,
        corked: 0,
        sync: true,
        bufferProcessing: false,
        writecb: null,
        writelen: 0,
        bufferedRequest: null,
        lastBufferedRequest: null,
        pendingcb: 0,
        prefinished: false,
        errorEmitted: false,
        emitClose: false,
        bufferedRequestCount: 0,
        corkedRequestsFree: {
          next: null,
          entry: null
        }
      },
      writable: true,
      allowHalfOpen: false,
      _sockname: null,
      _pendingData: null,
      _pendingEncoding: "",
      server: null,
      _server: null
    },
    {
      connecting: false,
      _hadError: false,
      _handle: {
        reading: true
      },
      _parent: null,
      _host: null,
      _readableState: {
        objectMode: false,
        highWaterMark: 16384,
        buffer: {
          head: null,
          tail: null,
          length: 0
        },
        length: 0,
        pipes: null,
        pipesCount: 0,
        flowing: null,
        ended: false,
        endEmitted: false,
        reading: true,
        sync: false,
        needReadable: true,
        emittedReadable: false,
        readableListening: false,
        resumeScheduled: false,
        emitClose: false,
        destroyed: false,
        defaultEncoding: "utf8",
        awaitDrain: 0,
        readingMore: false,
        decoder: null,
        encoding: null
      },
      readable: true,
      _events: {},
      _eventsCount: 2,
      _writableState: {
        objectMode: false,
        highWaterMark: 16384,
        finalCalled: false,
        needDrain: false,
        ending: false,
        ended: false,
        finished: false,
        destroyed: false,
        decodeStrings: false,
        defaultEncoding: "utf8",
        length: 0,
        writing: false,
        corked: 0,
        sync: true,
        bufferProcessing: false,
        writecb: null,
        writelen: 0,
        bufferedRequest: null,
        lastBufferedRequest: null,
        pendingcb: 0,
        prefinished: false,
        errorEmitted: false,
        emitClose: false,
        bufferedRequestCount: 0,
        corkedRequestsFree: {
          next: null,
          entry: null
        }
      },
      writable: false,
      allowHalfOpen: false,
      _sockname: null,
      _pendingData: null,
      _pendingEncoding: "",
      server: null,
      _server: null
    },
    {
      connecting: false,
      _hadError: false,
      _handle: {
        reading: true
      },
      _parent: null,
      _host: null,
      _readableState: {
        objectMode: false,
        highWaterMark: 16384,
        buffer: {
          head: null,
          tail: null,
          length: 0
        },
        length: 0,
        pipes: null,
        pipesCount: 0,
        flowing: null,
        ended: false,
        endEmitted: false,
        reading: true,
        sync: false,
        needReadable: true,
        emittedReadable: false,
        readableListening: false,
        resumeScheduled: false,
        emitClose: false,
        destroyed: false,
        defaultEncoding: "utf8",
        awaitDrain: 0,
        readingMore: false,
        decoder: null,
        encoding: null
      },
      readable: true,
      _events: {},
      _eventsCount: 2,
      _writableState: {
        objectMode: false,
        highWaterMark: 16384,
        finalCalled: false,
        needDrain: false,
        ending: false,
        ended: false,
        finished: false,
        destroyed: false,
        decodeStrings: false,
        defaultEncoding: "utf8",
        length: 0,
        writing: false,
        corked: 0,
        sync: true,
        bufferProcessing: false,
        writecb: null,
        writelen: 0,
        bufferedRequest: null,
        lastBufferedRequest: null,
        pendingcb: 0,
        prefinished: false,
        errorEmitted: false,
        emitClose: false,
        bufferedRequestCount: 0,
        corkedRequestsFree: {
          next: null,
          entry: null
        }
      },
      writable: false,
      allowHalfOpen: false,
      _sockname: null,
      _pendingData: null,
      _pendingEncoding: "",
      server: null,
      _server: null
    }
  ]
};

const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBhY2lAZW1haWwuY29tIiwidXNlcm5hbWUiOiJwYWNpIiwiaWQiOiIzNjRlYmFjNy1jYjQ1LTQ5ZDQtODlmNC1lY2Y5MWE5OTczZjIiLCJpYXQiOjE1NTIwMDEwNTB9.mPtpx6r62aXEYWyWFYYkiCdTEPR4ECfZrB1wJ30fXXM`;
const fakeId = "71840433-e8e4-48dd-89d1-b0a91258da58";
export {
  newArticle,
  newComment,
  users,
  fakeToken,
  tokenEmailVerication,
  sendGridResponse,
  article,
  opnResponse,
  fakeId
};
