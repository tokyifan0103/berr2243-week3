const API = 'http://localhost:3000/rides';

// Fetch rides from the backend and display them in the table
async function fetchRides() {
  try {
    const res = await fetch(API);
    if (!res.ok) {
      throw new Error('Failed to fetch rides');
    }
    const rides = await res.json();
    console.log("Fetched rides:", rides); // Log fetched rides for debugging

    const tbody = document.querySelector('#ridesTable tbody');
    tbody.innerHTML = ''; // Clear current rows

    // Loop through and add each ride to the table
    rides.forEach(ride => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${ride.pickupLocation}</td>
        <td>${ride.destination}</td>
        <td>${ride.driverId}</td>
        <td>
          <select onchange="updateStatus('${ride._id}', this.value)">
            <option value="scheduled" ${ride.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
            <option value="ongoing" ${ride.status === 'ongoing' ? 'selected' : ''}>Ongoing</option>
            <option value="completed" ${ride.status === 'completed' ? 'selected' : ''}>Completed</option>
          </select>
        </td>
        <td>
          <button onclick="deleteRide('${ride._id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Error fetching rides:', err);
  }
}

// Add a new ride
async function addRide(e) {
  e.preventDefault(); // Prevent the default form submit

  console.log("Form submitted!"); // Check if form is submitting correctly

  const pickupLocation = document.getElementById('pickupLocation').value;
  const destination = document.getElementById('destination').value;
  const driverId = document.getElementById('driverId').value;
  const status = document.getElementById('status').value;

  // Check if all fields are filled
  if (!pickupLocation || !destination || !driverId || !status) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    // Send POST request to add a new ride
    const response = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pickupLocation, destination, driverId, status })
    });

    const responseData = await response.json();
    console.log('Response from POST:', responseData);

    if (response.ok) {
      fetchRides(); // Refresh the list of rides after adding a new one
    } else {
      alert('Failed to add ride.');
    }
  } catch (err) {
    console.error('Error adding ride:', err);
  }
}

// Update the status of a ride
async function updateStatus(id, status) {
  try {
    const response = await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const responseData = await response.json();
    console.log('Status updated:', responseData);

    if (response.ok) {
      fetchRides(); // Refresh rides after update
    } else {
      alert('Failed to update status');
    }
  } catch (err) {
    console.error('Error updating status:', err);
  }
}

// Delete a ride
async function deleteRide(id) {
  try {
    const response = await fetch(`${API}/${id}`, {
      method: 'DELETE'
    });

    const responseData = await response.json();
    console.log('Ride deleted:', responseData);

    if (response.ok) {
      fetchRides(); // Refresh rides after delete
    } else {
      alert('Failed to delete ride');
    }
  } catch (err) {
    console.error('Error deleting ride:', err);
  }
}

// Event listener for form submission
document.getElementById('rideForm').addEventListener('submit', addRide);

// Initial fetch of rides on page load
window.onload = fetchRides;