import { Response, Request } from "express";
import Blog from "../models/Blog";
import Follow from "../models/Follow";
const bcr = require("bcrypt");
const jwt = require("jsonwebtoken");
import User from "../models/User";

interface SignUpInterface {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  class: number;
  major: string;
}

const signup = (req: Request, res: Response) => {
  const body: SignUpInterface = req.body;
  if (
    !(
      body.email &&
      body.class &&
      body.password &&
      body.first_name &&
      body.last_name &&
      body.major
    )
  ) {
    return res.status(409).json({ message: "Bad Request!" });
  }
  console.log(body);
  User.findOne({ email: body.email })
    .exec()
    .then((doc) => {
      if (doc) {
        return res.status(409).json({ message: "Account Already Exists!" });
      }
      bcr.hash(body.password, 10, (err: Error, hash: string) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        let newUser = new User({
          email: body.email,
          password: hash,
          first_name: body.first_name,
          last_name: body.last_name,
          userName: (body.first_name + " " + body.last_name).toLowerCase(),
          class: body.class,
          major: body.major,
        });
        newUser
          .save()
          .then((conc: any) => {
            const token = jwt.sign(
              {
                email: body.email,
                first_name: body.first_name,
                last_name: body.last_name,
              },
              process.env.myKey
            );
            res.status(200).json({
              message: "Signed Up Successfully",
              token: token,
              uid: conc._id,
            });
          })
          .catch((err: Error) => {
            return res.status(500).json({ message: err.message });
          });
      });
    })
    .catch((err: Error) => {
      res.status(500).json({ message: err.message });
    });
};

interface LoginInterface {
  email: string;
  password: string;
}
const login = (req: Request, res: Response) => {
  const body: LoginInterface = req.body;
  if (!(body.email && body.password)) {
    return res.status(409).json({ message: "Bad Request!" });
  }
  User.findOne({ email: body.email })
    .exec()
    .then((doc) => {
      if (!doc) {
        return res.status(409).json({ message: "Account Doesn't Exist!" });
      }
      bcr.compare(body.password, doc.password, (err: Error, same: boolean) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        if (!same) {
          return res.status(409).json({ message: "Invalid Password!" });
        }
        if (same) {
          const token = jwt.sign(
            {
              email: doc.email,
              first_name: doc.first_name,
              last_name: doc.last_name,
            },
            process.env.myKey
          );
          res
            .status(200)
            .json({ message: "Login Success", token: token, uid: doc._id });
        }
      });
    })
    .catch((err: Error) => {
      res.status(500).json({ message: err.message });
    });
};

const updateProfile = (req: Request, res: Response) => {
  const body: any = req.body;
  if (body.password) {
    return res.status(409).json({ message: "Password Cannot be Changed" });
  }
  body.userName = (body.first_name + " " + body.last_name).toLowerCase();
  User.findByIdAndUpdate(req.params.id, { $set: body })
    .exec()
    .then((conc: any) => {
      if (!conc) {
        return res.status(409).json({ message: "Invalid Request!" });
      }
      res.status(200).json(conc);
    })
    .catch((err: Error) => {
      res.status(500).json({ message: err.message });
    });
};

const searchUserByName = (req: Request, res: Response) => {
  User.find({ userName: new RegExp(req.params.username.toLowerCase(), "") })
    .select("_id userName")
    .exec()
    .then((docs: any) => {
      if (docs.length === 0) {
        return res.status(409).json([]);
      }
      return res.status(200).json({ deets: docs });
    })
    .catch((err: Error) => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

const getUserDetailsById = (req: Request, res: Response) => {
  console.log("CURRENT UID", req.params.id)
  User.findById(req.params.id)
    .select('_id userName first_name last_name bio class major email')
    .exec()
    .then((doc: any) => {
      if (!doc) {
        return res.status(409).json({ message: "User Doesn't Exist!" });
      }
      Blog.find({ author_id: doc._id })
        .exec()
        .then((docs: any) => {
          Follow.find({ user_id: req.params.id })
            .exec()
            .then((followers: any) => {
              Follow.find({ follower_id: req.params.id })
                .exec()
                .then((following: any) => {
                  return res
                    .status(200)
                    .json({ deets: doc, numeros: docs.length, blogs: docs, followers : followers.length||0, following: following.length||0 });
                })
                .catch((err: Error) => {
                  res.status(500).json({ message: err.message });
                });
            })
            .catch((err: Error) => {
              res.status(500).json({ message: err.message });
            });
        })
        .catch((err: Error) => {
          res.status(500).json({ message: err.message });
        });
    })
    .catch((err: Error) => {
      res.status(500).json({ message: err.message });
    });
};

//TODO delete profile and all the blogs created from it

export { signup, login, updateProfile, searchUserByName, getUserDetailsById };
