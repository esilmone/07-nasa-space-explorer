// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Find the button and gallery elements
const getImagesButton = document.querySelector('button');
const gallery = document.getElementById('gallery');

// NASA APOD API key
const API_KEY = '4GRIeahUczzZPhxxLZbXwx6Y20yQCjzMPQIV3UT1';

// Listen for button click to fetch images
getImagesButton.addEventListener('click', () => {
  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Build the API URL with the selected date range
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  // Show a loading message
  gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">🚀</div><p>Loading images...</p></div>`;

  // Fetch data from NASA's APOD API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Clear the gallery
      gallery.innerHTML = '';

      // If the API returns a single object (not an array), make it an array
      const images = Array.isArray(data) ? data : [data];

      // Filter out non-image media types (e.g., videos)
      const imageItems = images.filter(item => item.media_type === 'image');

      // If there are no images, show a message
      if (imageItems.length === 0) {
        gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">😢</div><p>No images found for this date range.</p></div>`;
        return;
      }

      // Loop through each image and create a gallery item
      imageItems.forEach(item => {
        // Create a div for the gallery item
        const div = document.createElement('div');
        div.className = 'gallery-item';

        // Set the inner HTML with image, title, and date
        div.innerHTML = `
          <img src="${item.url}" alt="${item.title}" />
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        `;

        // Add the gallery item to the gallery
        gallery.appendChild(div);
      });
    })
    .catch(error => {
      // Log any errors
      console.error('Error fetching data:', error);
      gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">❌</div><p>Failed to load images. Please try again.</p></div>`;
    });
});
