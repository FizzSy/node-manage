const express = require("express");
const router = express.Router();
const Profile = require("../models/profile");
const passport = require("passport");

router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profile = {};
    if (req.body.type) {
      profile.type = req.body.type;
    }
    if (req.body.describe) {
      profile.describe = req.body.describe;
    }
    if (req.body.income) {
      profile.income = req.body.income;
    }
    if (req.body.expend) {
      profile.expend = req.body.expend;
    }
    if (req.body.cash) {
      profile.cash = req.body.cash;
    }
    if (req.body.remark) {
      profile.remark = req.body.remark;
    }
    if (req.body.id) {
      Profile.findOneAndUpdate(
        { _id: req.body.id },
        { $set: profile },
        { new: true }
      ).then(profile => {
        return res.json({
          error: 0,
          msg: "编辑成功"
        });
      });
    } else {
      new Profile(profile)
        .save()
        .then(profile => {
          res.json({
            error: 0,
            msg: "添加成功"
          });
        })
        .catch(err => {
          res.json({ error: 1, msg: "请求失败" });
        });
    }
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.find()
      .then(profile => {
        if (!profile) {
          res.json({
            error: 0,
            msg: "暂无内容"
          });
        }
        res.json({
          error: 0,
          data: profile
        });
      })
      .catch(err => {
        res.json({ error: 1, msg: "请求失败" });
      });
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findById(req.params.id)
      .then(profile => {
        if (!profile) {
          res.json({
            error: 0,
            msg: "暂无内容"
          });
        }
        res.json({
          error: 0,
          data: profile
        });
      })
      .catch(err => {
        res.json({ error: 1, msg: "请求失败" });
      });
  }
);

router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body);
    Profile.findOneAndRemove({ _id: req.body.id })
      .then(profile => {
        res.json({
          error: 0,
          msg: "删除成功"
        });
      })
      .catch(err => {
        res.json({ error: 1, msg: "请求失败" });
      });
  }
);

module.exports = router;
