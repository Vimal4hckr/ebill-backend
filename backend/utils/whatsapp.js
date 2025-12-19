const axios = require("axios");

const sendWhatsAppMessage = async ({ to, templateName, components = [] }) => {
  try {
    const url = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "en_US" },
          components
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "WhatsApp API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = { sendWhatsAppMessage };
