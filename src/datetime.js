// datetime.js

function updateDateTime() {
    const datetimeElement = document.getElementById('datetime-value');
    const now = new Date();
    const formattedDateTime = now.toLocaleString();
    datetimeElement.textContent = formattedDateTime;
}

// Call the function to update the datetime when the page loads
updateDateTime();

// Optional: Update the datetime every second
// setInterval(updateDateTime, 1000);