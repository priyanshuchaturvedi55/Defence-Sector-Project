// Function to add Hover Effect
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('ul li button');

    buttons.forEach(button => {
        const originalText = button.textContent;
        const phoneNumber = button.getAttribute('data-phone');

        // Add event listener for mouse enter
        button.addEventListener('mouseenter', () => {
            button.textContent = phoneNumber; // Change button text to phone number
        });

        // Add event listener for mouse leave
        button.addEventListener('mouseleave', () => {
            button.textContent = originalText; // Restore original button text
        });
    });
});

// Function to handle form submission
document.getElementById('sosForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const phoneNumber = document.getElementById('phoneNumber').value.trim(); // Get phone number
    if (phoneNumber) {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        sendSOS(formattedNumber); // Call function to send SOS message
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

// Function to send SOS message
function sendSOS(phoneNumber) {
    console.log(`Sending SOS to: ${phoneNumber}`);
    fetch('/sendLocationSMS', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: phoneNumber }),
    })
   .then(response => {
        if (response.ok) {
            console.log('SOS message sent successfully!');
            alert('SOS message sent successfully!');
        } else {
            throw new Error('Failed to send SOS message.');
        }
    })
   .catch(error => {
        console.error('Error:', error);
        alert('Failed to send SOS message. Please try again later.');
    });
}

// Function to handle emergency contact button click
function sendEmergencyContactSOS(phoneNumber) {
    sendSOS(formatPhoneNumber(phoneNumber)); // Reuse sendSOS function
}

// Function to send SOS to all contacts
function sendSOSToAll() {
    const emergencyContacts = [
        '+919015352525', // Emergency Contact 1
        '+919868671261', // Emergency Contact 2
        '+916264580842'  // Emergency Contact 3
        // Add more pre-defined numbers as needed
    ];
    emergencyContacts.forEach(contact => {
        sendSOS(contact);
    });
}