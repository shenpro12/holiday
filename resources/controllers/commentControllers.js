const { checkHex } = require("../ulti/checkHex");
const comments = require("../models/comment");
const rep_comments = require("../models/rep_comment");
const report_comments = require("../models/reportComment");
const hotel = require("../models/hotel");
class commentControllers {
  //POST comment/:id
  async addComment(req, res, next) {
    if (
      req.params.id &&
      checkHex(req.params.id) &&
      req.params.id.length != 24
    ) {
      res.send("NOT FOUND!!!");
      return;
    }
    if (req.session.userid && req.body.Comment && req.params.id) {
      let date = new Date();
      let comment = new comments({
        userid: req.session.userid,
        pertain: req.params.id,
        content: req.body.Comment,
        time:
          date.getDate() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getFullYear(),
      });
      comment.save();
      res.redirect(req.session.beforeUrl);
      return;
    }
    if (req.session.userid && req.body.rep_comment) {
      if (await comments.findOne({ _id: req.params.id })) {
        let date = new Date();
        let comment = new rep_comments({
          userid: req.session.userid,
          pertain: req.params.id,
          content: req.body.rep_comment,
          time:
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear(),
        });
        comment.save();
        res.redirect(req.session.beforeUrl);
        return;
      }
    }
    if (req.session.beforeUrl) {
      res.redirect(req.session.beforeUrl);
    } else {
      res.redirect("/");
    }
  }
  //GET /comment/:id/delete
  async deleteComment(req, res, next) {
    if (
      req.params.id &&
      checkHex(req.params.id) &&
      req.params.id.length != 24
    ) {
      res.send("NOT FOUND!!!");
      return;
    }

    function redirecthandle() {
      if (req.session.beforeUrl) {
        res.redirect(req.session.beforeUrl);
      } else {
        res.redirect("/");
      }
    }
    if (req.session.userid) {
      const comment = await comments.findOne({ _id: req.params.id });
      const rep_comment = await rep_comments.findOne({ _id: req.params.id });
      if (comment && req.session.userid == comment.userid) {
        await comments.deleteOne({ _id: req.params.id });
        await rep_comments.deleteMany({ pertain: req.params.id });
        redirecthandle();
        return;
      }
      if (rep_comment && req.session.userid == rep_comment.userid) {
        await rep_comments.deleteOne({ _id: req.params.id });
        redirecthandle();
        return;
      }
    }
    redirecthandle();
  }
  //GET /comment/:id/report
  async reportComment(req, res, next) {
    if (
      req.params.id &&
      checkHex(req.params.id) &&
      req.params.id.length != 24
    ) {
      res.send("NOT FOUND!!!");
      return;
    }
    //
    if (req.params.id && (await comments.findOne({ _id: req.params.id }))) {
      if (!(await report_comments.findOne({ commentId: req.params.id }))) {
        let date = new Date();
        const report_comment = new report_comments({
          commentId: req.params.id,
          time:
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear(),
        });
        report_comment.save();
      }
    }
    //
    if (req.params.id && (await rep_comments.findOne({ _id: req.params.id }))) {
      if (!(await report_comments.findOne({ commentId: req.params.id }))) {
        let date = new Date();
        const report_comment = new report_comments({
          commentId: req.params.id,
          time:
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear(),
        });
        report_comment.save();
      }
    }
    //
    if (req.session.beforeUrl) {
      res.redirect(req.session.beforeUrl);
    } else {
      res.redirect("/");
    }
  }
}
module.exports = new commentControllers();
