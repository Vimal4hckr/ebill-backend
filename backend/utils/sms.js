const axios = require("axios");

exports.sendSMS = async (number, message) => {
  return axios.post(
    "https://www.fast2sms.com/dev/bulkV2",
    {
      route: "q",
      message,
      numbers: number
    },
    {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );
};
