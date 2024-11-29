// Function to handle form submission
document.getElementById('callForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const phoneNumber = document.getElementById('phoneNumber').value.trim(); // Get phone number
    if (phoneNumber) {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        makeCallAndSendSMS(formattedNumber); // Call function to initiate call and send SMS
    } else {
        alert('Please enter a phone number.'); // Display error message if phone number is empty
    }
});

// Function to format phone number to E.164 format
function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+91' + phoneNumber; // Prepend the country code for India
    }
    return phoneNumber;
}

// Function to initiate call and send SMS
function makeCallAndSendSMS(phoneNumber) {
    // Make the call
    fetch('/call', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: phoneNumber }),
    })
    .then(response => {
        if (response.ok) {
            alert('Call initiated successfully!');
        } else {
            throw new Error('Failed to initiate call.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to initiate call. Please try again later.');
    });

    // Send the SMS
    fetch('/sendLocationSMS', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: phoneNumber }),
    })
    .then(response => {
        if (response.ok) {
            console.log('Location SMS sent successfully!');
        } else {
            throw new Error('Failed to send location SMS.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to send location SMS. Please try again later.');
    });
}
