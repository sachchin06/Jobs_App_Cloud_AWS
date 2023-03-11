const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const User = require("../models/User");

// var poolData = {
//   UserPoolId: process.env.UserPoolId,
//   ClientId: process.env.ClientId,
// };

var poolData = {
  UserPoolId: "us-east-1_SLCWj3Mtt",
  ClientId: "246n75899s4sk0bkpbpk0ne62b",
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const signUp = async (req, res) => {
  // console.log("Request Body" + req.body);

  var dataEmail = {
    Name: "email",
    Value: req.body.email,
  };

  var dataName = {
    Name: "name",
    Value: req.body.name,
  };
  var attributeList = [];
  var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
    dataEmail
  );
  var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);

  attributeList.push(attributeEmail);
  attributeList.push(attributeName);

  userPool.signUp(
    req.body.email,
    req.body.password,
    attributeList,
    null,
    async function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      var cognitoUser = result.user;
      console.log("cognitoUser" + result);
      console.log("user name is " + cognitoUser.getUsername());

      const user = await User.create({
        key: result.userSub,
        username: cognitoUser.getUsername(),
      });

      console.log("Database User :", user);
      return res.status(200).json(user);
    }
  );
};

const signIn = async (req, res) => {
  console.log(req.body);

  const signInCallback = doLogin(req, function (err, cogres) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.json(cogres);
    }
  });
};

function doLogin(req, callback) {
  console.log("doLogin", req.body);
  var authenticationData = {
    Username: req.body.email,
    Password: req.body.password,
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );
  var userData = {
    Username: req.body.email,
    Pool: userPool,
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: async function (result) {
      /*  console.log("Access Token:" + JSON.stringify(jwt_decode(result.getAccessToken().getJwtToken())));
      console.log("Id Token + " + JSON.stringify(jwt_decode(result.getIdToken().getJwtToken())));
      console.log("Refresh Token + " + JSON.stringify(result.getRefreshToken().getToken()));*/
      callback(null, result);
      return;
    },
    onFailure: function (err) {
      console.error(err);
      callback(err, null);
      return;
    },
    mfaRequired: (codeDeliveryDetails) => {
      console.error(codeDeliveryDetails);
      cognitoUser.sendMFACode(mfaCode, this);
    },
  });
}

const confirmation = async (req, res) => {
  console.log(req.body);

  const verificationCallback = doVerification(req, function (err, cogres) {
    if (err) {
      console.log(err);
      return res.status(400).send(err);
    } else {
      return res.json(cogres);
    }
  });
};

function doVerification(req, callback) {
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  var userData = {
    Username: req.body.email,
    Pool: userPool,
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.confirmRegistration(req.body.code, true, function (err, result) {
    if (err) {
      callback(err, null);
      return;
    }
    console.log("call result: " + result);
    callback(null, result);
  });
}

module.exports = {
  signUp,
  signIn,
  confirmation,
};
