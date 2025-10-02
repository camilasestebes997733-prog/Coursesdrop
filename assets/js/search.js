// Real-time Search Functionality
(function() {
  let searchIndex = [];
  let searchInput;
  let searchResults;

  // Initialize search when DOM is ready
  function init() {
    searchInput = document.getElementById('searchInput');
    searchResults = document.getElementById('searchResults');

    if (!searchInput || !searchResults) return;

    // Build search index from posts
    buildSearchIndex();

    // Event listeners
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim() !== '') {
        searchResults.style.display = 'block';
      }
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }

  // Build search index from page content
  function buildSearchIndex() {
    const posts = document.querySelectorAll('.post-item');

    posts.forEach(post => {
      const link = post.querySelector('.post-link');
      const excerpt = post.querySelector('.post-excerpt');
      const meta = post.querySelector('.post-meta');

      if (link) {
        searchIndex.push({
          title: link.textContent.trim(),
          url: link.getAttribute('href'),
          excerpt: excerpt ? excerpt.textContent.trim() : '',
          date: meta ? meta.textContent.trim() : ''
        });
      }
    });
  }

  // Handle search input
  function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();

    if (query === '') {
      searchResults.style.display = 'none';
      searchResults.innerHTML = '';
      return;
    }

    // Filter posts
    const results = searchIndex.filter(post => {
      return post.title.toLowerCase().includes(query) ||
             post.excerpt.toLowerCase().includes(query);
    });

    displayResults(results, query);
  }

  // Display search results
  function displayResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-no-results">
          <p>😕 No results found for "<strong>${escapeHtml(query)}</strong>"</p>
        </div>
      `;
      searchResults.style.display = 'block';
      return;
    }

    const html = results.slice(0, 8).map(post => `
      <a href="${post.url}" class="search-result-item">
        <div class="search-result-title">${highlightQuery(post.title, query)}</div>
        <div class="search-result-excerpt">${truncate(highlightQuery(post.excerpt, query), 100)}</div>
      </a>
    `).join('');

    searchResults.innerHTML = html;
    searchResults.style.display = 'block';

    if (results.length > 8) {
      searchResults.innerHTML += `
        <div class="search-more-results">
          <small>+${results.length - 8} more results</small>
        </div>
      `;
    }
  }

  // Highlight search query in text
  function highlightQuery(text, query) {
    if (!text || !query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Truncate text
  function truncate(text, length) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Escape regex special characters
  function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
