/*
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

passport.use(new LocalStrategy(
  function(username: any, password: any, done: any) {
    User.findOne({ username: username }, function (err: any, user: any) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
)); */