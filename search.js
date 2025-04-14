// Enhanced Search Feature - Advanced Content Searching
class EnhancedSearchFeature {
    constructor() {
      this.overlay = null;
      this.searchInput = null;
      this.resultsContainer = null;
      this.searchStats = null;
      this.selectedIndex = -1;
      this.results = [];
      this.isOpen = false;
      this.searchData = [];
      this.minSearchLength = 1; // Reduce to just 1 character for immediate results
      
      this.init();
    }
    
    async init() {
      // Create search button & overlay
      this.createSearchButton();
      this.createSearchOverlay();
      
      // Initialize event listeners
      this.initEventListeners();
      
      // Load content from the actual website pages
      await this.scanWebsiteContent();
    }
    
    createSearchButton() {
      // Find the navigation container
      const navs = document.querySelectorAll('nav');
      if (navs.length === 0) return;
      
      // Create a new button for search
      const searchBtn = document.createElement('button');
      searchBtn.id = 'search-button';
      searchBtn.className = 'search-button';
      searchBtn.setAttribute('aria-label', 'Search');
      searchBtn.innerHTML = '<i class="fas fa-search"></i>';
      
      // Find the best place to insert it
      const nav = navs[0];
      const themeToggle = nav.querySelector('.theme-toggle');
      
      if (themeToggle) {
        themeToggle.parentNode.insertBefore(searchBtn, themeToggle);
      } else {
        const mobileMenuBtn = nav.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
          mobileMenuBtn.parentNode.insertBefore(searchBtn, mobileMenuBtn);
        } else {
          nav.appendChild(searchBtn);
        }
      }
    }
    
    createSearchOverlay() {
      // Create the overlay container
      const overlay = document.createElement('div');
      overlay.id = 'search-overlay';
      overlay.className = 'search-overlay';
      
      // Create the search form with improved UI
      overlay.innerHTML = `
        <div class="search-container">
          <div class="search-form">
            <i class="fas fa-search search-icon"></i>
            <input type="text" id="search-input" placeholder="Type anything to search..." aria-label="Search">
            <button id="search-clear" aria-label="Clear search"><i class="fas fa-times"></i></button>
          </div>
          <div id="search-stats" class="search-stats"></div>
          <div id="search-results" class="search-results"></div>
          <div class="search-footer">
            <p>Press <kbd>/</kbd> to search, <kbd>↑</kbd><kbd>↓</kbd> to navigate, <kbd>Enter</kbd> to select</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(overlay);
      
      // Store references
      this.overlay = overlay;
      this.searchInput = document.getElementById('search-input');
      this.resultsContainer = document.getElementById('search-results');
      this.searchStats = document.getElementById('search-stats');
    }
    
    initEventListeners() {
      // Toggle search on button click
      const searchBtn = document.getElementById('search-button');
      if (searchBtn) {
        searchBtn.addEventListener('click', () => this.openSearch());
      }
      
      // Close search on overlay click
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.closeSearch();
        }
      });
      
      // Search input event - use both input and keyup for better responsiveness
      this.searchInput.addEventListener('input', () => this.handleSearch());
      
      // Clear search button
      const clearBtn = document.getElementById('search-clear');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clearSearch());
      }
      
      // Keyboard events
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeSearch();
        } else if (e.key === '/' && !this.isOpen && !e.ctrlKey && !e.metaKey && 
                  e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.openSearch();
        } else if (this.isOpen) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectNextResult();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectPrevResult();
          } else if (e.key === 'Enter' && this.selectedIndex >= 0) {
            e.preventDefault();
            this.navigateToResult(this.results[this.selectedIndex]);
          }
        }
      });
    }
    
    async scanWebsiteContent() {
      // Start with initial searchData (crucial pages)
      this.searchData = [
        // Your existing searchData here
      ];
      
      try {
        // Get all links from the current page
        const links = Array.from(document.querySelectorAll('a[href]'))
          .map(a => a.getAttribute('href'))
          .filter(href => {
            // Filter to only include internal links with HTML extension
            return href && 
              !href.startsWith('http') && 
              !href.startsWith('#') && 
              (href.endsWith('.html') || href === '/' || href === '');
          })
          .map(href => {
            // Normalize URLs
            if (href === '/' || href === '') return '/index.html';
            if (!href.startsWith('/')) return '/' + href;
            return href;
          });
        
        // Remove duplicates
        const uniqueLinks = [...new Set(links)];
        
        // For each link, fetch the content
        for (const link of uniqueLinks) {
          try {
            const pageContent = await this.fetchPageContent(link);
            if (pageContent) {
              // Process the page content
              this.processPageContent(link, pageContent);
            }
          } catch (err) {
            console.warn(`Could not process ${link}:`, err);
          }
        }
        
        console.log(`Enhanced Search: Indexed ${this.searchData.length} content items`);
      } catch (err) {
        console.error('Error scanning website content:', err);
      }
    }
    
    async fetchPageContent(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) return null;
        
        const html = await response.text();
        return html;
      } catch (err) {
        console.warn(`Failed to fetch ${url}:`, err);
        return null;
      }
    }
    
    processPageContent(url, html) {
      // Create a temporary element to parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract title
      const title = doc.querySelector('title')?.textContent || 'Untitled Page';
      
      // Try to determine content type
      let type = 'page';
      if (url.includes('blog') || url.includes('article')) type = 'blog';
      else if (url.includes('portfolio') || url.includes('project')) type = 'project';
      else if (url.includes('service')) type = 'service';
      
      // Extract tags
      const tags = [];
      const metaKeywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content');
      if (metaKeywords) {
        tags.push(...metaKeywords.split(',').map(t => t.trim()));
      }
      
      // Get the main content
      const mainContent = doc.querySelector('main') || doc.querySelector('article') || doc.body;
      
      // Extract text content, removing scripts and styles
      const scripts = mainContent.querySelectorAll('script, style');
      scripts.forEach(s => s.remove());
      
      // Get text content and clean it up
      let content = mainContent.textContent
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .trim()
        .substring(0, 500);    // Limit to 500 chars for excerpt
      
      // Determine icon based on type
      let icon = 'fas fa-file';
      if (type === 'blog') icon = 'fas fa-file-alt';
      else if (type === 'project') icon = 'fas fa-project-diagram';
      else if (type === 'service') icon = 'fas fa-concierge-bell';
      
      // Add to searchData
      this.searchData.push({
        id: `page-${this.searchData.length + 1}`,
        type,
        title,
        url,
        tags,
        content,
        icon
      });
    }
    
    openSearch() {
      this.overlay.classList.add('active');
      this.searchInput.focus();
      this.isOpen = true;
      document.body.style.overflow = 'hidden'; // Prevent scrolling while search is open
    }
    
    closeSearch() {
      this.overlay.classList.remove('active');
      this.isOpen = false;
      document.body.style.overflow = ''; // Restore scrolling
    }
    
    clearSearch() {
      this.searchInput.value = '';
      this.handleSearch();
      this.searchInput.focus();
    }
    
    handleSearch() {
      const query = this.searchInput.value.trim();
      
      // Search even with just one character
      if (query.length >= this.minSearchLength) {
        this.results = this.searchItems(query);
        this.selectedIndex = this.results.length > 0 ? 0 : -1;
        this.renderResults();
        this.updateSearchStats(query);
      } else {
        this.showEmptyState();
      }
    }
    
    showEmptyState() {
      this.results = [];
      this.selectedIndex = -1;
      this.resultsContainer.innerHTML = `
        <div class="empty-results">
          <div class="empty-icon">
            <i class="fas fa-search"></i>
          </div>
          <h3>Start typing to search</h3>
          <p>Search across all website content with just 1 character</p>
        </div>
      `;
      this.searchStats.innerHTML = '';
    }
    
    searchItems(query) {
      const searchTerm = query.toLowerCase();
      
      // Advanced search algorithm with scoring
      return this.searchData
        .map(item => {
          // Calculate relevance score
          let score = 0;
          
          // Title matches are most important
          if (item.title.toLowerCase().includes(searchTerm)) {
            score += 10;
            // Exact title matches or starts with search term get bonus
            if (item.title.toLowerCase() === searchTerm) score += 10;
            if (item.title.toLowerCase().startsWith(searchTerm)) score += 5;
          }
          
          // Content matches
          if (item.content.toLowerCase().includes(searchTerm)) {
            score += 5;
          }
          
          // Tags matches
          const tagMatches = item.tags.filter(tag => 
            tag.toLowerCase().includes(searchTerm));
          score += tagMatches.length * 3;
          
          // Only include results with a score
          return score > 0 ? { ...item, score } : null;
        })
        .filter(item => item !== null)
        .sort((a, b) => b.score - a.score); // Sort by score, highest first
    }
    
    renderResults() {
      // Clear previous results
      this.resultsContainer.innerHTML = '';
      
      if (this.results.length === 0) {
        // Show empty state
        this.resultsContainer.innerHTML = `
          <div class="empty-results">
            <div class="empty-icon">
              <i class="fas fa-search-minus"></i>
            </div>
            <h3>No results found</h3>
            <p>We couldn't find any matches for your search term.</p>
            <p class="empty-help">Try using different keywords or check for typos</p>
          </div>
        `;
        return;
      }
      
      // Create and append each result
      this.results.forEach((result, index) => {
        const resultElement = this.createResultElement(result, index);
        this.resultsContainer.appendChild(resultElement);
        
        // Add animation delay for staggered appearance
        resultElement.style.setProperty('--animation-order', index);
      });
    }
    
    createResultElement(result, index) {
      const resultElement = document.createElement('div');
      resultElement.className = `search-result ${index === this.selectedIndex ? 'selected' : ''}`;
      resultElement.setAttribute('data-index', index.toString());
      
      // Get category color
      const categoryColor = this.getCategoryColor(result.type);
      resultElement.classList.add(categoryColor);
      
      // Create excerpt with context
      const excerpt = this.getContextExcerpt(result.content, this.searchInput.value);
      
      resultElement.innerHTML = `
        <div class="result-content">
          <div class="result-icon">
            <i class="${result.icon}"></i>
          </div>
          <div class="result-details">
            <h3 class="result-title">
              <a href="${result.url}">${this.highlightText(result.title, this.searchInput.value)}</a>
            </h3>
            <p class="result-meta">
              ${this.getCategoryName(result.type)} ${result.tags.length > 0 ? '/ ' + result.tags.join(', ') : ''}
              ${result.score ? `<span class="result-score">Relevance: ${result.score}</span>` : ''}
            </p>
            <p class="result-excerpt">
              ${excerpt}
            </p>
          </div>
        </div>
      `;
      
      // Add click event to navigate
      resultElement.addEventListener('click', () => {
        this.navigateToResult(result);
      });
      
      return resultElement;
    }
    
    getContextExcerpt(content, query) {
      if (!query || query.trim().length < this.minSearchLength) return content;
      
      const searchTerm = query.trim().toLowerCase();
      const lowerContent = content.toLowerCase();
      
      // Find the position of the search term
      const pos = lowerContent.indexOf(searchTerm);
      if (pos === -1) return this.highlightText(content, query);
      
      // Extract context around the match
      const contextRadius = 60; // characters before and after the match
      const start = Math.max(0, pos - contextRadius);
      const end = Math.min(content.length, pos + searchTerm.length + contextRadius);
      
      // Add ellipsis if we're not at the beginning/end
      const prefix = start > 0 ? '...' : '';
      const suffix = end < content.length ? '...' : '';
      
      // Extract the context and highlight the match
      const context = content.substring(start, end);
      return prefix + this.highlightText(context, query) + suffix;
    }
    
    getCategoryColor(type) {
      switch (type) {
        case 'project':
          return 'result-project';
        case 'blog':
          return 'result-blog';
        case 'service':
          return 'result-service';
        case 'page':
          return 'result-page';
        default:
          return '';
      }
    }
    
    getCategoryName(type) {
      switch (type) {
        case 'project':
          return 'Project';
        case 'blog':
          return 'Blog';
        case 'service':
          return 'Service';
        case 'page':
          return 'Page';
        default:
          return 'Content';
      }
    }
    
    highlightText(text, query) {
      if (!query || query.trim().length < this.minSearchLength) return text;
      
      const searchTerm = query.trim().toLowerCase();
      const lowerText = text.toLowerCase();
      
      if (!lowerText.includes(searchTerm)) return text;
      
      let result = '';
      let lastIndex = 0;
      let index = lowerText.indexOf(searchTerm);
      
      while (index !== -1) {
        // Add text before match
        result += text.substring(lastIndex, index);
        // Add highlighted match
        result += `<span class="highlight">${text.substring(index, index + searchTerm.length)}</span>`;
        
        lastIndex = index + searchTerm.length;
        index = lowerText.indexOf(searchTerm, lastIndex);
      }
      
      // Add remaining text after last match
      if (lastIndex < text.length) {
        result += text.substring(lastIndex);
      }
      
      return result;
    }
    
    updateSearchStats(query) {
      this.searchStats.innerHTML = `
        <span class="stats-count">${this.results.length} result${this.results.length !== 1 ? 's' : ''} found for "${query}"</span>
        <span class="stats-help">Press ESC to close</span>
      `;
    }
    
    selectNextResult() {
      if (this.results.length === 0) return;
      
      // Clear current selection
      const currentSelected = this.resultsContainer.querySelector('.selected');
      if (currentSelected) {
        currentSelected.classList.remove('selected');
      }
      
      // Select next
      this.selectedIndex = (this.selectedIndex < this.results.length - 1) ? this.selectedIndex + 1 : 0; // Loop back to top
      
      // Apply new selection
      const nextSelected = this.resultsContainer.querySelector(`[data-index="${this.selectedIndex}"]`);
      if (nextSelected) {
        nextSelected.classList.add('selected');
        // Scroll into view if needed
        nextSelected.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    
    selectPrevResult() {
      if (this.results.length === 0) return;
      
      // Clear current selection
      const currentSelected = this.resultsContainer.querySelector('.selected');
      if (currentSelected) {
        currentSelected.classList.remove('selected');
      }
      
      // Select previous
      this.selectedIndex = (this.selectedIndex > 0) ? this.selectedIndex - 1 : this.results.length - 1; // Loop back to bottom
      
      // Apply new selection
      const prevSelected = this.resultsContainer.querySelector(`[data-index="${this.selectedIndex}"]`);
      if (prevSelected) {
        prevSelected.classList.add('selected');
        // Scroll into view if needed
        prevSelected.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    
    navigateToResult(result) {
      window.location.href = result.url;
      this.closeSearch();
    }
  }
  
  // Initialize enhanced search feature when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new EnhancedSearchFeature();
  });