let currentPage = 1;
const pageSize = 8;
const totalResults = 97;
let slideIndex = 0;
const slides = document.querySelectorAll('#carousel-inner img');
const totalSlides = slides.length;
const indicators = document.getElementById('carousel-indicators');

// Function to fetch and display news
async function fetchNews(page) {
    const response = await fetch(`https://api-berita-indonesia.vercel.app/cnn/olahraga`);
    const data = await response.json();

    // Display Headline News
    const headline = data.data.posts[0];
    document.getElementById('headline-title').innerText = headline.title;
    document.getElementById('headline-description').innerText = headline.description || '';
    document.getElementById('headline-date').innerText = new Date(headline.pubDate).toLocaleDateString();
    document.getElementById('headline-link').href = headline.link;
    document.getElementById('headline-image').src = headline.thumbnail;

    // Display Popular News
    const popularNewsContainer = document.getElementById('popular-news');
    popularNewsContainer.innerHTML = '';

    data.data.posts.slice(1, 4).forEach((post, index) => {
        popularNewsContainer.innerHTML += `
            <div class="relative bg-white rounded-lg shadow-md overflow-hidden">
                <span class="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-bold">Trending ${index + 1}</span>
                <img src="${post.thumbnail}" alt="${post.title}" class="w-full h-40 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-bold text-gray-800">${post.title}</h3>
                    <p class="text-gray-600 mt-2">${new Date(post.pubDate).toLocaleDateString()}</p>
                </div>
            </div>
        `;
    });

    // Display Recommended News
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const newsItems = data.data.posts.slice(start, end);

    newsItems.forEach(post => {
        newsContainer.innerHTML += `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="${post.thumbnail}" alt="${post.title}" class="w-full h-40 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-bold text-gray-800">${post.title}</h3>
                    <p class="text-blue-600 mt-2">Nasional - ${new Date(post.pubDate).toLocaleDateString()}</p>
                </div>
            </div>
        `;
    });

    document.getElementById('pagination-info').innerText = `Showing ${start + 1} to ${end} of ${totalResults} results`;
    document.getElementById('current-page').innerText = `${currentPage}`;
}

// Pagination controls
document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchNews(currentPage);
    }
});

document.getElementById('next').addEventListener('click', () => {
    if (currentPage * pageSize < totalResults) {
        currentPage++;
        fetchNews(currentPage);
    }
});

// Search functionality
document.getElementById('search-btn').addEventListener('click', async () => {
    const query = document.getElementById('search').value;
    const response = await fetch(`https://api-berita-indonesia.vercel.app/cnn/olahraga?search=${query}`);
    const data = await response.json();
    
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    data.data.posts.forEach(post => {
        newsContainer.innerHTML += `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="${post.thumbnail}" alt="${post.title}" class="w-full h-40 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-bold text-gray-800">${post.title}</h3>
                    <p class="text-blue-600 mt-2">Nasional - ${new Date(post.pubDate).toLocaleDateString()}</p>
                </div>
            </div>
        `;
    });
});

// Carousel for ads
function showSlide(index) {
    const offset = -index * 100;
    document.getElementById('carousel-inner').style.transform = `translateX(${offset}%)`;

    // Update indicators
    document.querySelectorAll('#carousel-indicators span').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function createIndicators() {
    indicators.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => {
            slideIndex = i;
            showSlide(slideIndex);
        });
        indicators.appendChild(dot);
    }
}

createIndicators();

document.getElementById('prev-slide').addEventListener('click', () => {
    slideIndex = (slideIndex > 0) ? slideIndex - 1 : totalSlides - 1;
    showSlide(slideIndex);
});

document.getElementById('next-slide').addEventListener('click', () => {
    slideIndex = (slideIndex < totalSlides - 1) ? slideIndex + 1 : 0;
    showSlide(slideIndex);
});

// Automatic carousel movement
setInterval(() => {
    slideIndex = (slideIndex < totalSlides - 1) ? slideIndex + 1 : 0;
    showSlide(slideIndex);
}, 3000);

// Fetch the first page of news when the page loads
fetchNews(currentPage);
