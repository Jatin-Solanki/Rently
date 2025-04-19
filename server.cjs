
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Twilio configuration
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);

// SMS sending endpoint
app.post('/api/send-sms', async (req, res) => {
  try {
    const { reminder, phone } = req.body;
    
    if (!reminder || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: reminder or phone'
      });
    }
    
    // Send SMS via Twilio
    const message = await client.messages.create({
      body: `Reminder: ${reminder.title}\n${reminder.message}`,
      from: twilioPhoneNumber,
      to: phone
    });
    
    console.log('SMS sent successfully:', message.sid);
    
    return res.status(200).json({
      success: true,
      messageId: message.sid
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send SMS'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
