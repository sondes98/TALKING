// const joi = require("joi");

// const registerValidation = (data) => {
//   //User Register Schema
//   const UserRegister = joi.object({
//     fullname: joi.string().min(5).max(80).required(),
//     email: joi.string().required().email(),
//     password: joi
//       .string()
//       .min(8)
//       .required()
//       .pattern(new RegExp("^[a-zA-Z0-9]+$")),
//   })
//   .options({ allowUnknown: true });
//   // .options({ stripUnknown: true });

//   return UserRegister.validate(data);
// };

// const loginValidation = (data) => {
//   //User Register Schema
//   const UserLogin = joi.object({
//     email: joi.string().email().required(),
//     password: joi
//       .string()
//       .min(8)
//       .required()
//       .pattern(new RegExp("^[a-zA-Z0-9]+$")),
//   });

//   return UserLogin.validate(data);
// };
// const postValidation = (data) => {
//   const PostVald = joi.object({
//     title: joi.string().min(3).max(80).required(),
//     description: joi.string().min(5).max(80).required(),
//   });

//   return PostVald.validate(data);
// };

// module.exports = {
//   registerValidation,
//   loginValidation,
//   postValidation,
// };
