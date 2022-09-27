const nodemailer = require("nodemailer");
const {
  multipleMongooseToObject,
  mongooseToObject,
} = require("../ulti/mongoose");
const { checkLogin } = require("../ulti/checklogin");
const { checkHex } = require("../ulti/checkHex");
const bcrypt = require("bcrypt");
const account = require("../models/account");
const news = require("../models/news");
class taikhoanControllers {
  //GET /taikhoan/prof/bindEmail
  bindEmail(req, res, next) {
    let user = checkLogin(req.session);
    res.render("login/bindEmail", {
      step_1: true,
      user,
    });
  }
  //GET /taikhoan/prof/changeEmail
  async changeEmail(req, res, next) {
    let user = checkLogin(req.session);

    let data = await account.findOne({ username: user.username });

    if (user && data.mail) {
      function getRndInteger(min, max) {
        return (Math.floor(Math.random() * (max - min)) + min).toString();
      }
      req.session.QRcode = getRndInteger(99999, 1000000); //save QRcode
      req.session.pass_step_1 = false;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.email,
          pass: process.env.pass,
        },
      });

      let mailOptions = {
        from: process.env.email,
        to: data.mail,
        subject: "Mã xác nhận tài khoản TRAVEL",
        text: req.session.QRcode,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      console.log(req.session);
      res.render("login/changeEmail", {
        step_1: true,
        data: mongooseToObject(data),
        user,
      });
    }
  }
  //GET /taikhoan/dangnhap
  async index(req, res, next) {
    if (!req.session.userid) {
      const data = await news.find({});

      let new_news = [];
      for (let i = data.length - 1; i >= data.length - 1 - 2; i--) {
        new_news.push(data[i]);
      }
      res.render("login/login", {
        new_news: multipleMongooseToObject(new_news),
      });
    } else {
      res.redirect("/");
    }
  }
  //GET /taikhoan/dangxuat
  logout(req, res, next) {
    req.session.username = "";
    req.session.userid = "";
    req.session.admin = false;
    if (req.session.beforeUrl) {
      res.redirect(req.session.beforeUrl);
    } else {
      res.redirect("/");
    }
  }
  //GET /taikhoan/prof
  async prof(req, res, next) {
    if (req.params.id && checkHex(req.params.id)) {
      res.send("NOT FOUND!!!");
      return;
    }
    if (
      req.params.id &&
      req.params.id == req.session.userid &&
      req.params.id.length == 24
    ) {
      if (await account.findOne({ _id: req.params.id })) {
        const user = await account.findOne({ _id: req.params.id });
        let login = checkLogin(req.session);
        res.render("login/userprof", {
          user: mongooseToObject(user),
          login,
        });
      } else {
        res.send("NOT FOUND!!!");
        return;
      }
    } else {
      res.send("NOT FOUND!!!");
      return;
    }
  }
  //GET /taikhoan/matkhau
  forgotPasswordPage(req, res, next) {
    req.session.destroy();
    res.render("login/forgotPassword", {
      step_1: true,
    });
  }
  //POST /taikhoan/matkhau
  async checkUser(req, res, next) {
    //step1 check form step1-check username and send mail
    if (req.body.userName_1) {
      const user = await account.findOne({ username: req.body.userName_1 });
      if (user) {
        if (user.mail) {
          //random QRcode
          function getRndInteger(min, max) {
            return (Math.floor(Math.random() * (max - min)) + min).toString();
          }
          req.session.QRcode = getRndInteger(99999, 1000000); //save QRcode
          req.session.pass_step_2 = false;
          req.session.username = req.body.userName_1;
          //send mail
          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.email,
              pass: process.env.pass,
            },
          });

          let mailOptions = {
            from: process.env.email,
            to: user.mail,
            subject: "Mã xác nhận tài khoản TRAVEL",
            text: req.session.QRcode,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          res.render("login/forgotPassword", {
            step_2: true,
            user: mongooseToObject(user),
          });
          return;
        } else {
          res.render("login/forgotPassword", {
            step_1: true,
            status:
              "Tài khoản chưa cập nhật Email! Không thể lấy lại mật khẩu!",
          });
          return;
        }
      } else {
        res.render("login/forgotPassword", {
          step_1: true,
          status: "User Name không tồn tại!",
        });
        return;
      }
    }
    //step2 check form step2-check QRcode
    if (req.body.userName_2) {
      const user = await account.findOne({ username: req.body.userName_2 });
      if (req.body.Code) {
        if (req.body.Code == req.session.QRcode) {
          req.session.QRcode = ""; //delete session after confirm QRcode
          req.session.pass_step_2 = true;
          res.render("login/forgotPassword", {
            step_3: true,
            user: mongooseToObject(user),
          });
          return;
        } else {
          res.render("login/forgotPassword", {
            step_2: true,
            user: mongooseToObject(user),
            status: "Mã không hợp lệ!",
          });
          return;
        }
      } else {
        res.render("login/forgotPassword", {
          step_2: true,
          user: mongooseToObject(user),
          status: "Vui lòng nhập mã xác nhận!",
        });
        return;
      }
    }
    //step3 check form step3-save info
    if (
      req.body.userName_3 &&
      req.session.pass_step_2 &&
      req.session.username == req.body.userName_3
    ) {
      const user = await account.findOne({ username: req.body.userName_3 });
      if (req.body.newPassword && req.body.re_newPassword) {
        if (req.body.newPassword == req.body.re_newPassword) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(req.body.newPassword, salt);
          user.password = hash;
          await account.updateOne({ username: req.body.userName_3 }, user);
          req.session.destroy();
          res.render("login/forgotPassword", {
            checkDone: true,
            status: "Cập nhật mật khẩu thành công!",
          });
          return;
        } else {
          res.render("login/forgotPassword", {
            step_3: true,
            user: mongooseToObject(user),
            status: "Mật khẩu không khớp!",
          });
          return;
        }
      } else {
        res.render("login/forgotPassword", {
          step_3: true,
          user: mongooseToObject(user),
          status: "Vui lòng nhập đầy đủ thông tin!",
        });
        return;
      }
    }
    //re-try step1
    res.render("login/forgotPassword", {
      step_1: true,
      status: "Chưa nhập UserName!",
    });
  }
  //POST /taikhoan/prof/:id/update
  async updateInfo(req, res, next) {
    const data = req.body;
    let changePassword = "";

    let login = checkLogin(req.session);
    if (req.params.id && checkHex(req.params.id)) {
      res.send("NOT FOUND!!!");
      return;
    }
    if (
      req.params.id &&
      req.params.id == req.session.userid &&
      req.params.id.length == 24
    ) {
      //change Password
      if (
        req.body.oldPassword ||
        req.body.newPassword ||
        req.body.re_newPassword
      ) {
        let user = await account.findOne({ _id: req.params.id });
        if (bcrypt.compareSync(req.body.oldPassword, user.password)) {
          if (
            req.body.newPassword == req.body.re_newPassword &&
            req.body.newPassword &&
            req.body.re_newPassword
          ) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.newPassword, salt);
            data.password = hash;
            changePassword = "Thay đổi mật khẩu thành công!";
          } else {
            changePassword =
              "Không thể thay đổi mật khẩu do sai thông tin! Kiểm tra lại thông tin đã nhập!";
          }
        } else {
          changePassword =
            "Không thể thay đổi mật khẩu do sai thông tin! Kiểm tra lại thông tin đã nhập!";
        }
      }
      //change user info
      await account.updateOne({ _id: req.params.id }, data);
      const user = await account.findOne({ _id: req.params.id });
      res.render("login/userprof", {
        user: mongooseToObject(user),
        login,
        status: "Thay đổi thông tin cá nhân thành công!",
        changePassword,
      });
    } else {
      res.send("NOT FOUND!!!");
      return;
    }
  }
  //POST /taikhoan/prof/changeEmail
  async cEmail(req, res, next) {
    let user = checkLogin(req.session);
    let data = await account.findOne({ username: req.session.username });
    //step1
    if (req.session.username && req.body.Code_1) {
      if (req.body.Code_1 == req.session.QRcode) {
        req.session.QRcode = "";
        req.session.pass_step_1 = true;
        req.session.pass_step_2 = false;
        res.render("login/changeEmail", {
          step_2: true,
          user,
        });
        return;
      } else {
        res.render("login/changeEmail", {
          step_1: true,
          status: "Mã không hợp lệ!",
          user,
          data: mongooseToObject(data),
        });
        return;
      }
    }
    //step2
    if (req.session.username && req.body.new_Email && req.session.pass_step_1) {
      function getRndInteger(min, max) {
        return (Math.floor(Math.random() * (max - min)) + min).toString();
      }
      req.session.QRcode = getRndInteger(99999, 1000000); //save QRcode
      req.session.pass_step_2 = true;
      req.session.pass_step_1 = false;
      req.session.new_Email = req.body.new_Email;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.email,
          pass: process.env.pass,
        },
      });

      let mailOptions = {
        from: process.env.email,
        to: req.body.new_Email,
        subject: "Mã xác nhận tài khoản TRAVEL",
        text: req.session.QRcode,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.render("login/changeEmail", {
        step_3: true,
        user,
      });
      return;
    }
    if (req.session.pass_step_1) {
      res.render("login/changeEmail", {
        step_2: true,
        status: "Vui lòng nhập Email muốn thay đổi!",
        user,
      });
      return;
    }
    //step3
    if (req.session.username && req.body.Code_2 && req.session.pass_step_2) {
      if (req.body.Code_2 == req.session.QRcode) {
        let data = await account.findOne({ username: req.session.username });
        data.mail = req.session.new_Email;
        req.session.new_Email = "";
        req.session.QRcode = "";
        req.session.pass_step_1 = false;
        req.session.pass_step_2 = false;
        await account.updateOne({ username: req.session.username }, data);
        console.log(req.session);
        res.render("login/changeEmail", {
          checkDone: true,
          status: "Cập nhật Email thành công!",
          user,
        });
        return;
      } else {
        res.render("login/changeEmail", {
          step_3: true,
          status: "Mã xác nhận không hợp lệ!",
          user,
        });
        return;
      }
    }
    if (req.session.pass_step_2) {
      res.render("login/changeEmail", {
        step_3: true,
        status: "Vui lòng nhập mã xác nhận Email mới!",
        user,
      });
      return;
    }
    //retry step1
    res.render("login/changeEmail", {
      step_1: true,
      status: "Chưa nhập mã xác nhận!",
      user,
      data: mongooseToObject(data),
    });
  }
  //POST /taikhoan/prof/bindEmail
  async bEmail(req, res, next) {
    let user = checkLogin(req.session);
    //step1
    if (req.session.username && req.body.password) {
      req.session.step_1 = false;
      let data = await account.findOne({ username: req.session.username });
      if (bcrypt.compareSync(req.body.password, data.password)) {
        req.session.step_1 = true;
        req.session.step_2 = false;
        res.render("login/bindEmail", {
          step_2: true,
          user,
        });
        return;
      }
    }
    //step2
    if (req.session.username && req.body.new_Email && req.session.step_1) {
      function getRndInteger(min, max) {
        return (Math.floor(Math.random() * (max - min)) + min).toString();
      }
      req.session.QRcode = getRndInteger(99999, 1000000); //save QRcode
      req.session.new_Email = req.body.new_Email;
      req.session.step_2 = true;
      req.session.step_1 = false;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.email,
          pass: process.env.pass,
        },
      });

      let mailOptions = {
        from: process.env.email,
        to: req.body.new_Email,
        subject: "Mã xác nhận tài khoản TRAVEL",
        text: req.session.QRcode,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.render("login/bindEmail", {
        step_3: true,
        user,
      });
      return;
    }
    if (req.session.step_1) {
      res.render("login/bindEmail", {
        step_2: true,
        status: "Vui lòng nhập Email muốn thêm!",
        user,
      });
      return;
    }
    //step3
    if (req.session.username && req.body.Code && req.session.step_2) {
      if (req.body.Code == req.session.QRcode) {
        let data = await account.findOne({ username: req.session.username });
        console.log(data);
        data.mail = req.session.new_Email;
        req.session.new_Email = "";
        req.session.QRcode = "";
        req.session.pass_step_1 = false;
        req.session.pass_step_2 = false;
        await account.updateOne({ username: req.session.username }, data);
        console.log(req.session);
        res.render("login/bindEmail", {
          checkDone: true,
          status: "Cập nhật Email thành công!",
          user,
        });
        return;
      } else {
        res.render("login/bindEmail", {
          step_3: true,
          status: "Mã xác nhận không hợp lệ!",
          user,
        });
        return;
      }
    }
    if (req.session.step_2) {
      res.render("login/bindEmail", {
        step_3: true,
        status: "Vui lòng nhập mã xác nhận Email mới!",
        user,
      });
      return;
    }
    //retry step1
    res.render("login/bindEmail", {
      step_1: true,
      user,
      status: "Chưa nhập mật khẩu hoặc nhập mật khẩu sai!",
    });
  }
  //POST /taikhoan/dangnhap
  async checkAccount(req, res, next) {
    const user = await account.findOne({ username: req.body.username });
    const data = await news.find({});

    let new_news = [];
    for (let i = data.length - 1; i >= data.length - 1 - 2; i--) {
      new_news.push(data[i]);
    }
    if (user) {
      if (bcrypt.compareSync(req.body.pswd, user.password)) {
        req.session.userid = user._id;
        req.session.username = user.username;
        req.session.admin = user.admin;
        if (req.session.beforeUrl) {
          res.redirect(req.session.beforeUrl);
        } else {
          res.redirect("/");
        }
      } else {
        res.render("login/login", {
          login_status: "Sai mật khẩu!",
          login_username: req.body.username,
          new_news: multipleMongooseToObject(new_news),
        });
      }
    } else {
      res.render("login/login", {
        login_status: "Username không tồn tại!",
        login_username: req.body.username,
        new_news: multipleMongooseToObject(new_news),
      });
    }
  }
  async signup(req, res, next) {
    const finduser = await account.findOne({ username: req.body.txt });
    const data = await news.find({});

    let new_news = [];
    for (let i = data.length - 1; i >= data.length - 1 - 2; i--) {
      new_news.push(data[i]);
    }
    if (finduser) {
      res.render("login/login", {
        signup_status: "Username đã tồn tại!",
        signup_username: req.body.txt,
        new_news: multipleMongooseToObject(new_news),
      });
    } else {
      if (req.body.new_password == req.body.re_password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.new_password, salt);
        const user = new account({
          username: req.body.txt,
          password: hash,
          admin: false,
        });
        user.save();
        res.render("login/login", {
          signup_successmess:
            "Đăng ký thành công! Hãy cập nhật các thông tin cần thiết để bảo mật tài khoản!",
          new_news: multipleMongooseToObject(new_news),
        });
      } else {
        res.render("login/login", {
          signup_status: "Mật khẩu không khớp!",
          signup_username: req.body.txt,
          new_news: multipleMongooseToObject(new_news),
        });
      }
    }
  }
}
module.exports = new taikhoanControllers();
