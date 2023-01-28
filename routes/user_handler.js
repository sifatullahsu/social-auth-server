const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = require('../schemas/user_schema');
const followerSchema = require('../schemas/follower_schema');
const { serverError } = require('../helpers/helpers');

const router = express.Router();
const User = mongoose.model('User', userSchema);
const Follower = mongoose.model('Follower', followerSchema);


/**
 *  POST /users: Create a new user account
 *  URL: http://localhost:5000/api/v1/users
 *  API BODY: { "name" : "Sifat Ullah", "username" : "shihabullah", "email": "shihab@gmail.com", "password" : "sifat12345" }
**/
router.post('/', async (req, res) => {

  if (req.body.password.length < 6) {
    return res.json({
      status: false,
      message: 'Password should be 6 character!'
    });
  }

  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newDocument = new User({ ...req.body, password: hashPassword });
    await newDocument.save((err, data) => {
      if (err) {
        res.json({
          status: false,
          message: err?.code === 11000 ? "User already exist. Please check username or email!" : err
        });
      }
      else {
        res.json({
          status: true,
          message: 'User created successful!',
          id: data._id
        })
      }
    });
  }
  catch (error) {
    serverError();
  }

});


/**
 *  GET /users/:username: Retrieve a specific user by username
 *  URL: http://localhost:5000/api/v1/users/shihabullah
**/
router.get('/:username', async (req, res) => {

  try {
    const query = { username: req.params.username };
    const result = await User.findOne(query).select({ password: 0, __v: 0 });

    if (result) {
      res.json({
        status: true,
        data: result
      })
    }
    else {
      res.json({
        status: false,
        message: 'User not found!'
      });
    }
  }
  catch (error) {
    serverError();
  }
});


/**
 *  GET /users/:username/followers: Retrieve a list of followers for a specific user
 *  URL: http://localhost:5000/api/v1/users/sifatullah/followers
**/
router.get('/:username/followers', async (req, res) => {

  try {
    const query = { username: req.params.username };
    const user = await User.findOne(query).select({ _id: 1 });

    if (user) {
      const query = { following: user._id };
      const populate = { path: 'author', select: { password: 0, __v: 0 } };
      const select = { following: 0, __v: 0 };
      const result = await Follower.find(query).populate(populate).select(select);

      res.json({
        status: true,
        data: result
      });
    }
    else {
      res.json({
        status: false,
        massage: 'User not registered!'
      });
    }
  }
  catch (error) {
    serverError();
  }

});


/**
 *  GET /users/:username/following: Retrieve a list of users a specific user is following
 *  URL: http://localhost:5000/api/v1/users/sifatullah/following
**/
router.get('/:username/following', async (req, res) => {

  try {
    const query = { username: req.params.username };
    const user = await User.findOne(query).select({ _id: 1 });

    if (user) {
      const query = { author: user._id };
      const populate = { path: 'following', select: { password: 0, __v: 0 } };
      const select = { author: 0, __v: 0 };
      const result = await Follower.find(query).populate(populate).select(select);

      res.json({
        status: true,
        data: result
      });
    }
    else {
      res.json({
        status: false,
        massage: 'User not registered!'
      });
    }
  }
  catch (error) {
    serverError();
  }

});



/**
 *  POST /users/:username/follow: Follow a specific user
 *  URL: http://localhost:5000/api/v1/users/sifatullah/follow
 *  API BODY:  {  "following" : "shihabullah" }
**/
router.post('/:username/follow', async (req, res) => {

  try {
    const authorQuery = { username: req.params.username };
    const author = await User.findOne(authorQuery).select({ _id: 1 });

    const followingQuery = { username: req.body.following };
    const following = await User.findOne(followingQuery).select({ _id: 1 });


    if (author && following) {
      const query = { author: author._id, following: following._id };
      const isFollowing = await Follower.findOne(query).count();

      if (isFollowing === 0) {
        const newDocument = new Follower({
          author: author._id,
          following: following._id
        });
        const abc = await newDocument.save((err, data) => {
          // console.log(err);
          if (err) {
            res.json({
              status: false,
              ss: err,
              message: 'User following faild!'
            });
          }
          else {
            res.json({
              status: true,
              message: 'User following successful!',
              id: data._id
            });
          }
        });
      }
      else {
        res.json({
          status: false,
          message: 'You already following!'
        });
      }
    }
    else {
      res.json({
        status: false,
        message: 'User not exist!'
      });
    }
  }
  catch (error) {
    serverError();
  }

});


/**
 *  DELETE /users/:username/follow: Unfollow a specific user
 *  URL: http://localhost:5000/api/v1/users/sifatullah/follow?unfollow=shihabullah
**/
router.delete('/:username/follow', async (req, res) => {

  try {
    const author = req.params.username;
    const unfollow = req.query.unfollow;

    const user = await User.findOne({ username: author }).select({ _id: 1 });
    const unfollowUser = await User.findOne({ username: unfollow }).select({ _id: 1 });

    if (user && unfollowUser) {
      const result = await Follower.deleteOne({ author: user._id, following: unfollowUser._id });

      if (result.acknowledged && result.deletedCount === 1) {
        res.json({
          status: true,
          massage: 'Unfollowed successful!'
        });
      }
      else {
        res.json({
          status: false,
          massage: 'You are not following!'
        });
      }
    }
    else {
      res.json({
        status: false,
        massage: 'User not registered!'
      });
    }
  }
  catch (error) {
    serverError();
  }

});


/**
 *  Additional Route for view all collections documents.
*/

router.get('/all/list', async (req, res) => {

  try {
    const select = { __v: 0, password: 0 };
    const users = await User.find({}).select(select);
    const followers = await Follower.find({})
      .populate({ path: 'author', select: select })
      .populate({ path: 'following', select: select })
      .select({ __v: 0 });

    res.json({
      status: true,
      data: {
        users: users,
        followers: followers
      }
    });

  }
  catch (error) {
    serverError();
  }

});


module.exports = router;