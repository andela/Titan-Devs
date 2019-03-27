import sinon from 'sinon';
import chai from 'chai';
import models from '../../src/models';
import { SocialLoginController } from '../../src/controller';
import { Authentication } from '../../src/utilities';


const { expect } = chai;
const { Users } = models;
const req = {
  user: {
    emails: [
      { values: 'someemail@address.com' }
    ]
  }
};
const res = {
  status() { return this; },
  json(Obj) { return Obj; }
};
const userFound = {
  id: 'someIdvalue',
  username: 'iceCream',
  email: 'nwachina@cheesecake.com',
};
const objectToVerifyWith = {
  verifyWith: 'email',
  profile: req.user,
  socialMedia: 'facebook',
  res,
};
const objectToVerifyWithTwitter = {
  verifyWith: 'username',
  profile: req.user,
  socialMedia: 'twitter',
  res,
};

describe('Unit tests for the social login controller', () => {
  describe('Ensure all methods of the controller are available', () => {
    it('should exist a method called facebookLogin', () => {
      expect(SocialLoginController.facebookLogin).to.exist;
    });
    it('facebookLogin should be a method', () => {
      expect(SocialLoginController.facebookLogin).to.be.a('function');
    });
    it('should exist a method called googleLogin', () => {
      expect(SocialLoginController.googleLogin).to.exist;
    });
    it('googleLogin should be a method', () => {
      expect(SocialLoginController.googleLogin).to.be.a('function');
    });
    it('should exist a method called twitterLogin', () => {
      expect(SocialLoginController.twitterLogin).to.exist;
    });
    it('twitterLogin should be a method', () => {
      expect(SocialLoginController.twitterLogin).to.be.a('function');
    });
    it('should exist a method called socialLoginFailed', () => {
      expect(SocialLoginController.socialLoginFailed).to.exist;
    });
    it('socialLoginFailed should be a method', () => {
      expect(SocialLoginController.socialLoginFailed).to.be.a('function');
    });
    it('should exist a method called verifyAndLoginUser', () => {
      expect(SocialLoginController.verifyAndLoginUser).to.exist;
    });
    it('verifyAndLoginUser should be a method', () => {
      expect(SocialLoginController.verifyAndLoginUser).to.be.a('function');
    });
  });
  describe('Unit test for the facebookLogin method', () => {
    it('should login as user via facebook', async () => {
      const stubVerifyAndLoginUser = sinon
        .stub(SocialLoginController, 'verifyAndLoginUser').returns(true);
      const response = await SocialLoginController.facebookLogin(req, res);
      expect(response).to.equal(true);
      stubVerifyAndLoginUser.restore();
    });
    it('should send an internal server error when an '
    + 'error occurs during social login', async () => {
      const stubVerifyAndLoginUser = sinon
        .stub(SocialLoginController, 'verifyAndLoginUser').throws();
      const response = await SocialLoginController.facebookLogin(req, res);
      expect(response).to.have.property('success');
      expect(response.success).to.equal(false);
      expect(response).to.have.property('message');
      expect(response.message).to.equal('Internal server error');
      stubVerifyAndLoginUser.restore();
    });
  });
  describe('Unit test for the googleLogin method', () => {
    it('should login a user via google', async () => {
      const stubVerifyAndLoginUser = sinon
        .stub(SocialLoginController, 'verifyAndLoginUser').returns(true);
      const response = await SocialLoginController.googleLogin(req, res);
      expect(response).to.equal(true);
      stubVerifyAndLoginUser.restore();
    });
    it('send an internal server error when an error occurs'
    + ' during google login', async () => {
      const stubVerifyAndLoginUser = sinon
        .stub(SocialLoginController, 'verifyAndLoginUser').throws();
      const response = await SocialLoginController.googleLogin(req, res);
      expect(response).to.have.property('success');
      expect(response.success).to.equal(false);
      expect(response).to.have.property('message');
      expect(response.message).to.equal('Internal server error');
      stubVerifyAndLoginUser.restore();
    });
  });
  describe('Unit test for the verifyAndLoginUser method', () => {
    it('should send a success message when a user logs in successfully',
      async () => {
        const stubFindOne = sinon.stub(Users, 'findOne').returns(userFound);
        const spyGetToken = sinon.spy(Authentication, 'getToken');
        const response = await SocialLoginController
          .verifyAndLoginUser(objectToVerifyWith);
        expect(response.success).to.equal(true);
        expect(response).to.have.property('message');
        expect(response.message).to
          .equal('Social login via facebook was successful');
        expect(response).to.have.property('id');
        expect(response.id).to.equal(userFound.id);
        expect(response).to.have.property('username');
        expect(response.username).to.equal(userFound.username);
        expect(response).to.have.property('token');
        expect(response.token).to.be.a('string');
        sinon.assert.calledOnce(spyGetToken);
        stubFindOne.restore();
        spyGetToken.restore();
      });
    it('should tell user to signup if user is not registered', async () => {
      const stubFindOne = sinon.stub(Users, 'findOne').returns(false);
      const spyGetToken = sinon.spy(Authentication, 'getToken');
      const response = await SocialLoginController
        .verifyAndLoginUser(objectToVerifyWith);
      expect(response).to.have.property('success');
      expect(response.success).to.equal(false);
      expect(response).to.have.property('message');
      expect(response.message).to.equal('You are not registered on this app. Please signup.');
      sinon.assert.notCalled(spyGetToken);
      stubFindOne.restore();
      spyGetToken.restore();
    });
    it('should send a success message when a user logs in'
    + ' successfully with twitter', async () => {
      const stubFindOne = sinon.stub(Users, 'findOne').returns(userFound);
      const spyGetToken = sinon.spy(Authentication, 'getToken');
      const response = await SocialLoginController
        .verifyAndLoginUser(objectToVerifyWithTwitter);
      expect(response.success).to.equal(true);
      expect(response).to.have.property('message');
      expect(response.message).to
        .equal('Social login via twitter was successful');
      expect(response).to.have.property('id');
      expect(response.id).to.equal(userFound.id);
      expect(response).to.have.property('username');
      expect(response.username).to.equal(userFound.username);
      expect(response).to.have.property('token');
      expect(response.token).to.be.a('string');
      sinon.assert.calledOnce(spyGetToken);
      stubFindOne.restore();
      spyGetToken.restore();
    });
  });
  describe('Unit test for the twitterLogin method', () => {
    it('should login a user via twitterLogin', async () => {
      const stubVerifyAndLoginUser = sinon
        .stub(SocialLoginController, 'verifyAndLoginUser').returns(true);
      const response = await SocialLoginController.twitterLogin(req, res);
      expect(response).to.equal(true);
      stubVerifyAndLoginUser.restore();
    });
    it('send an internal server error when an error occurs'
    + ' during google login', async () => {
      const stubVerifyAndLoginUser = sinon
        .stub(SocialLoginController, 'verifyAndLoginUser').throws();
      const response = await SocialLoginController.twitterLogin(req, res);
      expect(response).to.have.property('success');
      expect(response.success).to.equal(false);
      expect(response).to.have.property('message');
      expect(response.message).to.equal('Internal server error');
      stubVerifyAndLoginUser.restore();
    });
  });
  describe('Unit test for the socialLoginFailed', async () => {
    it('send an error message when social login failed', async () => {
      const response = await SocialLoginController.socialLoginFailed(req, res);
      expect(response).to.have.property('message');
      expect(response).to.have.property('success');
      expect(response.success).to.equal(false);
      expect(response.message).to
        .equal('The social media login failed. Please try again.');
    });
  });
});