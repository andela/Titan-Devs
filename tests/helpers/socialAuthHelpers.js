const dummyProfileGoogle = {
  id: "113497765187161548343",
  displayName: "Espoir Murhabazi",
  name: { familyName: "Murhabazi", givenName: "Espoir" },
  emails: [{ value: "test@test.com", type: "account" }],
  photos: [
    {
      value:
        "https://lh3.googleusercontent.com/a-/AAuE7mDMB8spoGWTcZyxqzDhTSANKT1Q_vW54EcIpAtn?sz=50"
    }
  ],
  gender: "male",
  provider: "google",
  username: "espoir_murhabazi"
};

const userFound = {
  email: "850855856@ah.com",
  password: null,
  username: "espoir_murhabazi",
  socialId: "850855856",
  isVerified: true
};

const dummyProfileTwitter = {
  id: "850855856",
  username: "espoir_murhabazi",
  displayName: "Espoir Murhabazi",
  provider: "twitter"
};
export { dummyProfileGoogle, userFound, dummyProfileTwitter };
