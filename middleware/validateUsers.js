function validateUsername(request, response, next) {
  const username = request.body.username
  
  //check if the username only contains aplhanumeric characters
  if (username.match(/^[A-Za-z0-9]{5,20}$/)) {
    next()
  }
  else {
    response
          .status(400)
          .send({ message: "Bad request, check if username is valid!" });
  }
}

// function validatePassword(request, response, next) {
//   const password = request.body.password
//   const length = password.length >= 8;
//   const lowerCase = /[a-z]/.test(password);
//   const upperCase = /[A-Z]/.test(password);
//   const regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]/g;
//   const specialChar = regex.test(password);
//   const number = password.match(/\d+/g);

//   if (length && lowerCase && upperCase && (specialChar || number)) {
//     next()
//   } else {
//     response
//           .status(400)
//           .send({ message: "Bad request, check if password is valid!" });
//   }
// }

function validatePassword(request, response, next) {
  console.log(request.body.password)
  if (process.env.Token === request.body.password) {
    next()
  } else {
    response.status(403).send({ message: "Forbidden"})
  }
}

module.exports = {validateUsername, validatePassword}