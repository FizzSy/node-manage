const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/key");
// const keys = require("../config/keys");
const passport = require("passport");

router.get("/", (req, res) => {
  res.status(200).json({
    error: 0,
    msg: "hello user"
  });
});

router.post("/register", (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      res.json({
        error: 1,
        msg: "邮箱已被注册"
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        identity: req.body.identity,
        avatar
      });
      bcrypt.genSalt(10, function(err, salt) {
        //生成随机字符salt
        bcrypt.hash(newUser.password, salt, function(err, hash) {
          //用随机字符进行加密
          if (err) {
            throw err;
          } else {
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                res.json({
                  error: 0,
                  msg: "注册成功"
                });
              })
              .catch(err => {
                res.json({
                  error: 1,
                  msg: "注册失败"
                });
              });
          }
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.json({ error: 1, msg: "用户不存在" });
    }
    console.log(user);
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const rule = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          identity: user.identity
        };
        jwt.sign(rule, secretKey, { expiresIn: 3600 }, function(err, token) {
          if (err) {
            throw err;
          }
          res.json({
            error: 0,
            msg: "登录成功",
            token: "Bearer " + token
          });
        });
      } else {
        return res.json({ error: 1, msg: "密码错误" });
      }
    });
  });
});

router.get(
  "/info",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      error: 0,
      data: {
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        identity: req.user.identity,
        id: req.user.id
      }
    });
  }
);

module.exports = router;
