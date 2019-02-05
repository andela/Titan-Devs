import { Router } from 'express';
import passport from 'passport';
import mongoose from 'mongoose';

const router = Router();

const User = mongoose.model('User');

router.get('/user', (req, res, next) => {
  User.findById(req.payload.id)
    .then(user => {
      if (!user) return res.sendStatus(401);
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

router.put('/user', (req, res, next) => {
  User.findById(req.payload.id)
    .then(user => {
      const { username, email, bio, image, password } = req.body;
      if (!user) return res.sendStatus(401);
      // only update fields that were actually passed...
      if (typeof username !== 'undefined') {
        user.username = username;
      }
      if (typeof email !== 'undefined') {
        user.email = email;
      }
      if (typeof bio !== 'undefined') {
        user.bio = bio;
      }
      if (typeof image !== 'undefined') {
        user.image = image;
      }
      if (typeof password !== 'undefined') {
        user.setPassword(password);
      }

      return user.save().then(() => res.json({ user: user.toAuthJSON() }));
    })
    .catch(next);
});

router.post('/users/login', (req, res, next) => {
  const { email, password } = req.body;
  if (!email) return res.status(422).json({ errors: { email: "can't be blank" } });
  if (!password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (user) return res.json({ user: user.toAuthJSON() });
    return res.status(422).json(info);
  })(req, res, next);
});

router.post('/users', (req, res, next) => {
  const { username, password, email } = req.body;
  // FIXME: The setPassword method is not declared
  // const user = new User({ username, email, password: setPassword(password) });
  const user = new User({ username, email, password });
  user
    .save()
    .then(() => res.json({ user: user.toAuthJSON() }))
    .catch(next);
});

export default router;
