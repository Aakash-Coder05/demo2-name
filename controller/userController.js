const bcrypt=require ('bcrypt');
const CATCH_MESSAGES = require('../constants/catchMessages');
const CONSTANTS = require("../constants/constants");
const adminModels=require ("../models/adminModels");
const {createAuthentication} = require('../middleware/auth');
const studentModel = require('../models/studentModel');
const librarianModel=require('../models/librarianModel');

//Common signup for Admin
const signUp = async (req, res, next) => {
    try {
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;
      const phoneNumber = req.body.phoneNumber;
      let password = req.body.password;
  
      password = await bcrypt.hash(password, 10);
  
      const userObj = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
      };
  
      const duplicateEmail = await adminModels.findOne({
        where: {
          email: email,
        },
      });
  
      if (!duplicateEmail) {
        const result = await adminModels.create(userObj);
  
        adminModels.prototype.toJSON = function () {
          var values = Object.assign({}, this.get());
          delete values.password;
          return values;
        };
  
        res.status(200).send({
          success: true,
          message: CONSTANTS.MESSAGES.USER_CREATED,
          data: [result]
        });
  
      } else {
        res.status(422).send({
          success: false,
          message: CONSTANTS.MESSAGES.EMAIL_ALREADY_REGISTERED,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(401).send({
        success: false,
        message: CONSTANTS.MESSAGES.USER_CREATION_FAILED,
      });
    }
  };



  
//common sign-in for  Admin
const signIn = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await adminModels.findOne({
      where: {
        email: email,
        active: 1,
      }
    });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const authObj = {
          id: user.id,
          role:CONSTANTS.ROLE.ADMIN
        }
        let authToken = await createAuthentication(authObj);
        res.status(200).send({
          success: true,
          authToken: authToken,
          message: CONSTANTS.MESSAGES.LOGGED_IN,
        });
      } else {
        const error = new Error(CONSTANTS.MESSAGES.INVALID_CREDENTIALS);
        throw error;
      }
    } else {
      const error = new Error(CONSTANTS.MESSAGES.INVALID_CREDENTIALS);
      throw error;
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: CONSTANTS.MESSAGES.INVALID_CREDENTIALS
    });
  }
}


//Common signup for Student
const signupstudent = async (req, res, next) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    let password = req.body.password;

    password = await bcrypt.hash(password, 10);

    const userObj = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
    };

    const Email = await studentModel.findOne({
      where: {
        email: email,
      },
    });

    if (!Email) {
      const result = await studentModel.create(userObj);

      studentModel.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.password;
        return values;
      };

      res.status(200).send({
        success: true,
        message: CONSTANTS.MESSAGES.USER_CREATED,
        data: [result]
      });

    } else {
      res.status(422).send({
        success: false,
        message: CONSTANTS.MESSAGES.EMAIL_ALREADY_REGISTERED,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send({
      success: false,
      message: CONSTANTS.MESSAGES.USER_CREATION_FAILED,
    });
  }
};


  //signUp For Librarian
const signuplibrarin = async (req, res, next) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    let password = req.body.password;

    password = await bcrypt.hash(password, 10);

    const userObj = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
    };

    const Email = await librarianModel.findOne({
      where: {
        email: email,
      },
    });

    if (!Email) {
      const result = await librarianModel.create(userObj);

      librarianModel.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.password;
        return values;
      };
      const authObj = {
        role:CONSTANTS.ROLE.LIBRARIAN
      }
      let authToken = await createAuthentication(authObj);

      res.status(200).send({
        success: true,
        authToken:authToken,
        message: CONSTANTS.MESSAGES.USER_CREATED,
        data: [result]
      });

    } else {
      res.status(422).send({
        success: false,
        message: CONSTANTS.MESSAGES.EMAIL_ALREADY_REGISTERED,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send({
      success: false,
      message: CONSTANTS.MESSAGES.USER_CREATION_FAILED,
    });
  }
};




module.exports={
    signUp,
    signIn,
    signupstudent,
    signuplibrarin
    
}
