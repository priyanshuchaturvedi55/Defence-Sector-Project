// This file is for testing purposes only and does not have any application in the project

const twilio = require('twilio');

const accountSid = 'AC379059c9f176f373d22b6b65592549c5';
const authToken = '63288a292dc7a882292750ed973abbb4';
const twilioNumber = '+13204296922'; // Your Twilio phone number

const client = twilio(accountSid, authToken);

client.messages
  .create({
    body: 'Test SOS message',
    to: '+919015352525', // Replace with your test number
    from: twilioNumber,
  })
  .then((message) => console.log(`SMS sent: ${message.sid}`))
  .catch((error) => console.error(`Error sending SMS: ${error.message}`));
