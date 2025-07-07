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

        // Add a loading message with icon
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'img-loading';
        loadingDiv.innerHTML = '<span class="img-loading-icon">🚀</span><span>Loading image...</span>';
        div.appendChild(loadingDiv);

        // Create the image element
        const img = document.createElement('img');
        img.src = item.url;
        img.alt = item.title;
        img.style.display = 'none';

        // When the image loads, hide the loading message and show the image
        img.onload = () => {
          loadingDiv.style.display = 'none';
          img.style.display = 'block';
        };

        // Set the inner HTML with title and date
        const title = document.createElement('h3');
        title.textContent = item.title;
        const date = document.createElement('p');
        date.textContent = item.date;

        // Add click event to open modal with more info
        div.addEventListener('click', () => {
          openModal(item);
        });

        // Add elements to the gallery item
        div.appendChild(img);
        div.appendChild(title);
        div.appendChild(date);
        gallery.appendChild(div);
      });
// Loading icon styles for gallery images
const style = document.createElement('style');
style.textContent = `
.img-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 95%;
  margin: 5px auto 0 auto;
  background: rgba(255,255,255,0.7);
  border-radius: 4px;
  font-size: 1.1rem;
  color: #212121;
  gap: 8px;
}
.img-loading-icon {
  font-size: 2.2rem;
  margin-bottom: 4px;
  animation: spin 1.2s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
// Modal creation
// Create modal HTML and add to body (only once)
let modal = document.getElementById('imageModal');
if (!modal) {
  modal = document.createElement('div');
  modal.id = 'imageModal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <img class="modal-img" src="" alt="" />
      <h2 class="modal-title"></h2>
      <p class="modal-date"></p>
      <p class="modal-explanation"></p>
    </div>
  `;
  document.body.appendChild(modal);
}

// Function to open modal with image info
function openModal(item) {
  modal.style.display = 'flex';
  modal.querySelector('.modal-img').src = item.hdurl || item.url;
  modal.querySelector('.modal-img').alt = item.title;
  modal.querySelector('.modal-title').textContent = item.title;
  modal.querySelector('.modal-date').textContent = item.date;
  modal.querySelector('.modal-explanation').textContent = item.explanation;
}

// Close modal on click of close button or backdrop
modal.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-backdrop')) {
    modal.style.display = 'none';
  }
});
    })
    .catch(error => {
      // Log any errors
      console.error('Error fetching data:', error);
      gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">❌</div><p>Failed to load images. Please try again.</p></div>`;
    });
});
