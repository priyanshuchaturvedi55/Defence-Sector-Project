const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = 3000;

// Twilio credentials
const accountSid = 'AC379059c9f176f373d22b6b65592549c5'; // Your Twilio Account SID
const authToken = '63288a292dc7a882292750ed973abbb4'; // Your Twilio Auth Token
const twilioNumber = '+13204296922'; // Your Twilio phone number

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'text-message', 'call', and 'safest-root' directories
app.use('/text-message', express.static(__dirname + '/text-message'));
app.use('/call', express.static(__dirname + '/call'));
app.use('/droneview', express.static(__dirname + '/droneview'));

// Handle SOS requests
app.post('/sos', (req, res) => {
  const { message, to } = req.body;
  console.log(`Sending SOS to: ${to}`);

  client.messages
    .create({
      body: message,
      to: to,
      from: twilioNumber,
    })
    .then((message) => {
      console.log(`SMS sent: ${message.sid}`);
      res.send('SOS message sent!');
    })
    .catch((error) => {
      console.error(`Error sending SMS: ${error.message}`);
      res.status(500).send('Failed to send SOS message');
    });
});

// Handle call requests
app.post('/call', (req, res) => {
  const { to } = req.body;

  client.calls
    .create({
      twiml: '<Response><Say>This is an automated call.</Say></Response>',
      to: to,
      from: twilioNumber,
    })
    .then(call => {
      console.log(`Call initiated: ${call.sid}`);
      res.send('Call initiated!');
    })
    .catch(error => {
      console.error(`Error initiating call: ${error.message}`);
      res.status(500).send('Failed to initiate call');
    });

  // Send the location SMS
  const message = `This is an SOS message. Check the live location here: https://example.com/live-location`;
  client.messages
    .create({
      body: message,
      to: to,
      from: twilioNumber,
    })
    .then((message) => {
      console.log(`Location SMS sent: ${message.sid}`);
    })
    .catch((error) => {
      console.error(`Error sending location SMS: ${error.message}`);
    });
});

// Handle location SMS requests
app.post('/sendLocationSMS', (req, res) => {
  const { to } = req.body;
  const message = `This is an SOS message. Check the live location here: https://example.com/live-location`;

  console.log(`Sending location SMS to: ${to}`);

  client.messages
    .create({
      body: message,
      to: to,
      from: twilioNumber,
    })
    .then((message) => {
      console.log(`Location SMS sent: ${message.sid}`);
      res.send('Location SMS sent!');
    })
    .catch((error) => {
      console.error(`Error sending location SMS: ${error.message}`);
      res.status(500).send('Failed to send location SMS');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
