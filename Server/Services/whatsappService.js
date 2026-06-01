const axios = require("axios");

/**
 * WhatsApp Service - Send notifications to customers
 * Supports multiple providers: Twilio, CallMeBot, WhatsApp Cloud API
 */

const sendWhatsAppMessage = async (phoneNumber, message) => {
  const provider = process.env.WHATSAPP_PROVIDER || "callmebot";

  try {
    if (provider === "twilio") {
      return await sendViaTwilio(phoneNumber, message);
    } else if (provider === "callmebot") {
      return await sendViaCallMeBot(phoneNumber, message);
    } else if (provider === "whatsapp_cloud") {
      return await sendViaWhatsAppCloud(phoneNumber, message);
    } else {
      console.log(
        "WhatsApp service disabled or provider not configured. Message would be:",
        message,
      );
      return { success: false, reason: "provider_not_configured" };
    }
  } catch (error) {
    console.error("WhatsApp send error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send via Twilio
 * Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
 */
const sendViaTwilio = async (phoneNumber, message) => {
  const twilio = require("twilio");
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );

  try {
    const result = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886",
      to: `whatsapp:+${phoneNumber.replace(/\D/g, "")}`,
      body: message,
    });

    console.log("WhatsApp message sent via Twilio:", result.sid);
    return { success: true, provider: "twilio", sid: result.sid };
  } catch (error) {
    console.error("Twilio error:", error.message);
    throw error;
  }
};

/**
 * Send via CallMeBot (Free WhatsApp API)
 * Requires: CALLMEBOT_API_KEY
 * https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */
const sendViaCallMeBot = async (phoneNumber, message) => {
  const apiKey = process.env.CALLMEBOT_API_KEY;

  if (!apiKey) {
    console.log(
      "CallMeBot API key not configured. To enable, set CALLMEBOT_API_KEY in .env",
    );
    return { success: false, reason: "api_key_not_configured" };
  }

  try {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const url = `https://api.callmebot.com/whatsapp.php`;

    const response = await axios.get(url, {
      params: {
        phone: cleanPhone,
        text: message,
        apikey: apiKey,
      },
    });

    console.log("WhatsApp message sent via CallMeBot:", response.data);
    return { success: true, provider: "callmebot" };
  } catch (error) {
    console.error("CallMeBot error:", error.message);
    throw error;
  }
};

/**
 * Send via WhatsApp Cloud API (Meta)
 * Requires: WHATSAPP_BUSINESS_ACCOUNT_ID, WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_ID
 */
const sendViaWhatsAppCloud = async (phoneNumber, message) => {
  const businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  if (!businessAccountId || !accessToken || !phoneId) {
    console.log(
      "WhatsApp Cloud API credentials not configured. Required: WHATSAPP_BUSINESS_ACCOUNT_ID, WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_ID",
    );
    return { success: false, reason: "credentials_not_configured" };
  }

  try {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const url = `https://graph.instagram.com/v18.0/${phoneId}/messages`;

    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: cleanPhone,
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("WhatsApp message sent via Cloud API:", response.data);
    return { success: true, provider: "whatsapp_cloud" };
  } catch (error) {
    console.error("WhatsApp Cloud API error:", error.message);
    throw error;
  }
};

/**
 * Generate order acceptance message
 */
const getOrderAcceptanceMessage = (customerName, productName, farmerName) => {
  return `नमस्ते ${customerName}! 👋\n\nआपका आदेश स्वीकार कर दिया गया है! ✅\n\nकिसान: ${farmerName}\nपण्य: ${productName}\n\nहम जल्द ही आपके द्वारा प्रदान किए गए पते पर डिलीवरी के लिए तैयार हैं।\n\nधन्यवाद!`;
};

/**
 * Generate order completion message
 */
const getOrderCompletionMessage = (customerName, productName) => {
  return `बहुत बढ़िया ${customerName}! 🎉\n\nआपका आदेश पूरा हो गया है! ✅✅\n\nपण्य: ${productName}\n\nआपको डिलीवर कर दिया जाएगा।\n\nधन्यवाद!`;
};

/**
 * Send order acceptance notification
 */
const notifyOrderAcceptance = async (
  customerPhone,
  customerName,
  productName,
  farmerName,
) => {
  const message = getOrderAcceptanceMessage(
    customerName,
    productName,
    farmerName,
  );
  return sendWhatsAppMessage(customerPhone, message);
};

/**
 * Send order completion notification
 */
const notifyOrderCompletion = async (
  customerPhone,
  customerName,
  productName,
) => {
  const message = getOrderCompletionMessage(customerName, productName);
  return sendWhatsAppMessage(customerPhone, message);
};

module.exports = {
  sendWhatsAppMessage,
  notifyOrderAcceptance,
  notifyOrderCompletion,
  getOrderAcceptanceMessage,
  getOrderCompletionMessage,
};
