/**
 * Universal Website Search Engine - Muatasim Portfolio Version
 * A self-contained JavaScript search solution with custom branding
 * 
 * Features:
 * - Automatic HTML file discovery and crawling
 * - Single character search support
 * - Real-time content indexing
 * - Smart content extraction
 * - Fast fuzzy search algorithm
 * - Modern UI with portfolio branding
 * - Keyboard navigation
 * - Local storage caching
 * - Responsive design
 * - Zero external dependencies
 */

class UniversalSearchEngine {
  constructor(options = {}) {
    // Configuration options
    this.config = {
      searchButtonSelector: options.searchButtonSelector || '#search-btn',
      triggerKey: options.triggerKey || '/',
      minSearchLength: options.minSearchLength || 1,
      maxResults: options.maxResults || 10,
      cacheDuration: options.cacheDuration || 24 * 60 * 60 * 1000, // 24 hours
      crawlDelay: options.crawlDelay || 100, // Delay between requests
      maxCrawlDepth: options.maxCrawlDepth || 3,
      excludePatterns: options.excludePatterns || [
        /\.(pdf|jpg|jpeg|png|gif|svg|ico|css|js|json|xml)$/i,
        /\/api\//,
        /\/admin\//,
        /#/
      ],
      ...options
    };

    // Internal state
    this.isInitialized = false;
    this.isOpen = false;
    this.isIndexing = false;
    this.selectedIndex = -1;
    this.searchResults = [];
    this.searchIndex = [];
    this.searchHistory = [];
    this.crawledUrls = new Set();
    this.pendingUrls = new Queue();
    
    // DOM elements
    this.overlay = null;
    this.searchInput = null;
    this.resultsContainer = null;
    this.statsContainer = null;
    
    // Cache keys
    this.cacheKeys = {
      index: 'universal_search_index_v3',
      history: 'universal_search_history',
      timestamp: 'universal_search_timestamp'
    };

    // Initialize the search engine
    this.init();
  }

  /**
   * Initialize the search engine
   */
  async init() {
    if (this.isInitialized) return;
    
    try {
      // Inject CSS styles
      this.injectStyles();
      
      // Create search UI
      this.createSearchUI();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Load cached data
      this.loadCache();
      
      // Start initial crawling
      await this.startCrawling();
      
      this.isInitialized = true;
      console.log('Universal Search Engine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Universal Search Engine:', error);
    }
  }

  /**
   * Inject CSS styles into the document
   */
  injectStyles() {
    const style = document.createElement('style');
    style.id = 'universal-search-styles';
    
    style.textContent = `
      /* Universal Search Engine Styles - Muatasim Portfolio Branding */
      
      @keyframes searchFadeIn {
        from { 
          opacity: 0; 
          transform: translateY(20px) scale(0.95); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0) scale(1); 
        }
      }
      
      @keyframes searchSlideIn {
        from { 
          opacity: 0; 
          transform: translateX(-20px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      
      @keyframes pulseGlow {
        0%, 100% { 
          box-shadow: 0 0 5px rgba(112, 0, 255, 0.3); 
        }
        50% { 
          box-shadow: 0 0 20px rgba(112, 0, 255, 0.6), 0 0 30px rgba(112, 0, 255, 0.4); 
        }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .universal-search-btn {
        background: linear-gradient(135deg, #7000ff 0%, #9a4eff 100%);
        border: none;
        border-radius: 12px;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 12px 20px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(112, 0, 255, 0.3);
        position: relative;
        overflow: hidden;
      }
      
      .universal-search-btn:before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }
      
      .universal-search-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(112, 0, 255, 0.4);
        background: linear-gradient(135deg, #5a00cc 0%, #7000ff 100%);
      }
      
      .universal-search-btn:hover:before {
        left: 100%;
      }
      
      .universal-search-btn:active {
        transform: translateY(-1px);
      }
      
      .universal-search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(12, 12, 20, 0.95) 0%, rgba(90, 0, 204, 0.1) 100%);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .universal-search-overlay.active {
        opacity: 1;
        visibility: visible;
      }
      
      .universal-search-container {
        background: rgba(22, 22, 31, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 24px;
        box-shadow: 
          0 25px 80px rgba(0, 0, 0, 0.6),
          0 0 0 1px rgba(112, 0, 255, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        max-width: 650px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        transform: scale(0.8) translateY(40px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        animation: searchFadeIn 0.5s ease-out;
      }
      
      .universal-search-overlay.active .universal-search-container {
        transform: scale(1) translateY(0);
      }
      
      .universal-search-header {
        padding: 28px 28px 20px;
        border-bottom: 1px solid rgba(112, 0, 255, 0.2);
        background: linear-gradient(135deg, #7000ff 0%, #5a00cc 100%);
        position: relative;
        overflow: hidden;
      }
      
      .universal-search-header:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
        animation: pulseGlow 3s infinite;
      }
      
      .universal-search-form {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        padding: 0 20px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
        position: relative;
        z-index: 1;
      }
      
      .universal-search-form:focus-within {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(0, 217, 255, 0.5);
        box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
      }
      
      .universal-search-icon {
        color: rgba(255, 255, 255, 0.9);
        font-size: 20px;
        margin-right: 16px;
        animation: pulseGlow 2s infinite;
      }
      
      .universal-search-input {
        flex: 1;
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        padding: 18px 0;
        outline: none;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
      }
      
      .universal-search-input::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
      
      .universal-search-clear {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        font-size: 18px;
        padding: 10px;
        border-radius: 8px;
        transition: all 0.2s ease;
        font-weight: bold;
      }
      
      .universal-search-clear:hover {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        transform: scale(1.1);
      }
      
      .universal-search-stats {
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        margin-top: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        position: relative;
        z-index: 1;
        font-weight: 500;
      }
      
      .universal-search-indexing {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: #00d9ff;
        font-weight: 600;
      }
      
      .universal-search-spinner {
        width: 14px;
        height: 14px;
        border: 2px solid rgba(0, 217, 255, 0.3);
        border-top: 2px solid #00d9ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      .universal-search-results {
        max-height: 420px;
        overflow-y: auto;
        padding: 12px 0;
        scrollbar-width: thin;
        scrollbar-color: rgba(112, 0, 255, 0.5) transparent;
      }
      
      .universal-search-results::-webkit-scrollbar {
        width: 6px;
      }
      
      .universal-search-results::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .universal-search-results::-webkit-scrollbar-thumb {
        background: rgba(112, 0, 255, 0.5);
        border-radius: 3px;
      }
      
      .universal-search-result {
        padding: 18px 28px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-left: 4px solid transparent;
        display: flex;
        flex-direction: column;
        gap: 6px;
        position: relative;
        overflow: hidden;
        animation: searchSlideIn 0.4s ease-out;
      }
      
      .universal-search-result:nth-child(even) {
        animation-delay: 0.1s;
      }
      
      .universal-search-result:nth-child(odd) {
        animation-delay: 0.2s;
      }
      
      .universal-search-result:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 0;
        background: linear-gradient(90deg, rgba(112, 0, 255, 0.1), rgba(0, 217, 255, 0.05));
        transition: width 0.3s ease;
      }
      
      .universal-search-result:hover,
      .universal-search-result.selected {
        background: rgba(112, 0, 255, 0.1);
        border-left-color: #7000ff;
        transform: translateX(8px);
        box-shadow: 0 8px 25px rgba(112, 0, 255, 0.2);
      }
      
      .universal-search-result:hover:before,
      .universal-search-result.selected:before {
        width: 100%;
      }
      
      .universal-search-result-title {
        color: white;
        font-size: 17px;
        font-weight: 700;
        margin: 0;
        line-height: 1.4;
        font-family: 'Poppins', sans-serif;
      }
      
      .universal-search-result-url {
        color: #00d9ff;
        font-size: 13px;
        text-decoration: none;
        opacity: 0.8;
        font-weight: 500;
        display: none; /* Hidden as requested */
      }
      
      .universal-search-result-snippet {
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        line-height: 1.5;
        margin-top: 4px;
      }
      
      .universal-search-result-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 10px;
      }
      
      .universal-search-result-type {
        background: linear-gradient(135deg, rgba(112, 0, 255, 0.3), rgba(0, 217, 255, 0.2));
        color: #00d9ff;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .universal-search-result-score {
        display: none; /* Hidden as requested */
      }
      
      .universal-search-empty {
        padding: 60px 28px;
        text-align: center;
        color: rgba(255, 255, 255, 0.6);
      }
      
      .universal-search-empty-icon {
        font-size: 64px;
        margin-bottom: 20px;
        opacity: 0.3;
        background: linear-gradient(135deg, #7000ff, #00d9ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .universal-search-footer {
        display: none; /* Hidden as requested */
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .universal-search-container {
          width: 95%;
          max-height: 85vh;
          border-radius: 20px;
        }
        
        .universal-search-header {
          padding: 24px 24px 18px;
        }
        
        .universal-search-input {
          font-size: 16px;
          padding: 16px 0;
        }
        
        .universal-search-result {
          padding: 16px 24px;
        }
        
        .universal-search-btn {
          padding: 10px 16px;
          font-size: 14px;
        }
      }
      
      /* Light theme adaptation (matches your portfolio) */
      .light-theme .universal-search-overlay {
        background: linear-gradient(135deg, rgba(245, 245, 250, 0.95) 0%, rgba(112, 0, 255, 0.05) 100%);
      }
      
      .light-theme .universal-search-container {
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 
          0 25px 80px rgba(0, 0, 0, 0.15),
          0 0 0 1px rgba(112, 0, 255, 0.1);
      }
      
      .light-theme .universal-search-result-title {
        color: #16161f;
      }
      
      .light-theme .universal-search-result-snippet {
        color: rgba(85, 85, 103, 0.8);
      }
      
      .light-theme .universal-search-result:hover,
      .light-theme .universal-search-result.selected {
        background: rgba(112, 0, 255, 0.05);
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Create search UI elements
   */
  createSearchUI() {
    // Create search button if it doesn't exist
    this.createSearchButton();
    
    // Create search overlay
    this.createSearchOverlay();
  }

  /**
   * Create search button
   */
  createSearchButton() {
    let searchBtn = document.querySelector(this.config.searchButtonSelector);
    
    if (!searchBtn) {
      // Try to find a good place to insert the button
      const nav = document.querySelector('nav');
      const header = document.querySelector('header');
      const container = nav || header || document.body;
      
      searchBtn = document.createElement('button');
      searchBtn.id = 'search-btn';
      searchBtn.className = 'universal-search-btn';
      searchBtn.innerHTML = `
        <i class="fas fa-search"></i>
        <span>Search</span>
       
      `;
      
      if (container === document.body) {
        // If no nav/header found, create a floating button
        searchBtn.style.position = 'fixed';
        searchBtn.style.top = '20px';
        searchBtn.style.right = '20px';
        searchBtn.style.zIndex = '9999';
      }
      
      container.appendChild(searchBtn);
    }
    
    // Add click event to existing or new button
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.openSearch();
    });
  }

  /**
   * Create search overlay
   */
  createSearchOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'universal-search-overlay';
    
    this.overlay.innerHTML = `
      <div class="universal-search-container">
        <div class="universal-search-header">
          <div class="universal-search-form">
            <input type="text" class="universal-search-input" placeholder="Search anything..." autocomplete="off" spellcheck="false">
            <button class="universal-search-clear" title="Clear search">×</button>
          </div>
          <div class="universal-search-stats"></div>
        </div>
        <div class="universal-search-results"></div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    
    // Store element references
    this.searchInput = this.overlay.querySelector('.universal-search-input');
    this.resultsContainer = this.overlay.querySelector('.universal-search-results');
    this.statsContainer = this.overlay.querySelector('.universal-search-stats');
    
    // Setup overlay event listeners
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.closeSearch();
      }
    });
    
    this.overlay.querySelector('.universal-search-clear').addEventListener('click', () => {
      this.clearSearch();
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Global keyboard shortcut
    document.addEventListener('keydown', (e) => {
 
      // Handle search overlay keyboard events
      if (this.isOpen) {
        switch (e.key) {
          case 'Escape':
            e.preventDefault();
            this.closeSearch();
            break;
            
          case 'ArrowDown':
            e.preventDefault();
            this.navigateResults(1);
            break;
            
          case 'ArrowUp':
            e.preventDefault();
            this.navigateResults(-1);
            break;
            
          case 'Enter':
            e.preventDefault();
            this.selectResult();
            break;
        }
      }
    });
    
    // Search input events
    this.searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });
    
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
      }
    });
  }

  /**
   * Open search overlay
   */
  openSearch() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.overlay.classList.add('active');
    this.searchInput.focus();
    this.updateStats();
    
    // Show recent searches or popular results
    if (this.searchInput.value.trim() === '') {
      this.showDefaultResults();
    }
  }

  /**
   * Close search overlay
   */
  closeSearch() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.overlay.classList.remove('active');
    this.selectedIndex = -1;
    this.searchResults = [];
  }

  /**
   * Clear search input
   */
  clearSearch() {
    this.searchInput.value = '';
    this.searchInput.focus();
    this.showDefaultResults();
  }

  /**
   * Handle search input
   */
  handleSearch(query) {
    query = query.trim();
    
    if (query.length < this.config.minSearchLength) {
      this.showDefaultResults();
      return;
    }
    
    // Perform search
    const results = this.search(query);
    this.displayResults(results, query);
    
    // Update stats with result count
    this.updateStats(results.length, query);
    
    // Reset selection
    this.selectedIndex = -1;
  }

  /**
   * Perform search with fuzzy matching
   */
  search(query) {
    if (!query || this.searchIndex.length === 0) return [];
    
    const queryLower = query.toLowerCase();
    const results = [];
    
    // Search through all indexed content
    for (const item of this.searchIndex) {
      const score = this.calculateSearchScore(item, queryLower);
      if (score > 0) {
        results.push({
          ...item,
          score
        });
      }
    }
    
    // Sort by score (descending) and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config.maxResults);
  }

  /**
   * Calculate search score for an item
   */
  calculateSearchScore(item, query) {
    let score = 0;
    const title = item.title.toLowerCase();
    const content = item.content.toLowerCase();
    const keywords = (item.keywords || []).join(' ').toLowerCase();
    
    // Exact title match gets highest score
    if (title.includes(query)) {
      score += 100;
    }
    
    // Title starts with query
    if (title.startsWith(query)) {
      score += 80;
    }
    
    // Content contains query
    if (content.includes(query)) {
      score += 50;
    }
    
    // Keywords match
    if (keywords.includes(query)) {
      score += 70;
    }
    
    // Single character matching for better UX
    if (query.length === 1) {
      if (title.startsWith(query)) {
        score += 90;
      }
      // Check if any word in title starts with the character
      const words = title.split(' ');
      for (const word of words) {
        if (word.startsWith(query)) {
          score += 60;
          break;
        }
      }
    }
    
    // Fuzzy matching for typos
    if (this.fuzzyMatch(query, title) > 0.7) {
      score += 30;
    }
    
    // Boost popular pages
    if (item.visits && item.visits > 0) {
      score += Math.min(item.visits * 5, 25);
    }
    
    return score;
  }

  /**
   * Fuzzy matching algorithm
   */
  fuzzyMatch(pattern, text) {
    const patternLength = pattern.length;
    const textLength = text.length;
    
    if (patternLength === 0) return 1;
    if (textLength === 0) return 0;
    
    const matrix = [];
    
    // Initialize matrix
    for (let i = 0; i <= textLength; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= patternLength; j++) {
      matrix[0][j] = j;
    }
    
    // Fill matrix
    for (let i = 1; i <= textLength; i++) {
      for (let j = 1; j <= patternLength; j++) {
        if (text[i - 1] === pattern[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + 1
          );
        }
      }
    }
    
    const distance = matrix[textLength][patternLength];
    return 1 - (distance / Math.max(patternLength, textLength));
  }

  /**
   * Display search results
   */
  displayResults(results, query = '') {
    this.searchResults = results;
    
    if (results.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="universal-search-empty">
          <div class="universal-search-empty-icon">🔍</div>
          <div>No results found for "${query}"</div>
          <div style="margin-top: 8px; font-size: 14px;">Try different keywords or check spelling</div>
        </div>
      `;
      return;
    }
    
    const resultsHTML = results.map((result, index) => {
      const snippet = this.createSnippet(result.content, query);
      const highlightedTitle = this.highlightText(result.title, query);
      
      return `
        <div class="universal-search-result" data-index="${index}" data-url="${result.url}">
          <div class="universal-search-result-title">${highlightedTitle}</div>
          <div class="universal-search-result-url">${result.url}</div>
          ${snippet ? `<div class="universal-search-result-snippet">${snippet}</div>` : ''}
          <div class="universal-search-result-meta">
            <span class="universal-search-result-type">${result.type || 'page'}</span>
            <span class="universal-search-result-score">Score: ${Math.round(result.score || 0)}</span>
          </div>
        </div>
      `;
    }).join('');
    
    this.resultsContainer.innerHTML = resultsHTML;
    
    // Add click event listeners to results - FIXED
    this.resultsContainer.querySelectorAll('.universal-search-result').forEach((element, index) => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const url = element.getAttribute('data-url');
        if (url) {
          // Add to search history
          this.addToHistory(query);
          
          // Increment visit count
          this.incrementVisitCount(url);
          
          // Open in new tab
          window.open(url, '_blank');
          
          // Close search overlay
          this.closeSearch();
        }
      });
    });
  }

  /**
   * Show default results (recent searches, popular pages)
   */
  showDefaultResults() {
    // Show recent searches from history
    const recentSearches = this.getSearchHistory().slice(0, 5);
    
    // Show popular pages (top scored pages from index)
    const popularPages = this.searchIndex
      .sort((a, b) => (b.visits || 0) - (a.visits || 0))
      .slice(0, 5);
    
    let resultsHTML = '';
    
    if (recentSearches.length > 0) {
      resultsHTML += `
        <div style="padding: 16px 24px; color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 600;">
          Recent Searches
        </div>
      `;
      
      recentSearches.forEach((search, index) => {
        resultsHTML += `
          <div class="universal-search-result" data-search="${search}" data-index="recent-${index}">
            <div class="universal-search-result-title">🕒 ${search}</div>
            <div class="universal-search-result-snippet">Click to search again</div>
          </div>
        `;
      });
    }
    
    if (popularPages.length > 0) {
      resultsHTML += `
        <div style="padding: 16px 24px; color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 600;">
          Popular Pages
        </div>
      `;
      
      popularPages.forEach((page, index) => {
        resultsHTML += `
          <div class="universal-search-result" data-index="popular-${index}" data-url="${page.url}">
            <div class="universal-search-result-title">${page.title}</div>
            <div class="universal-search-result-url">${page.url}</div>
            <div class="universal-search-result-meta">
              <span class="universal-search-result-type">${page.type || 'page'}</span>
            </div>
          </div>
        `;
      });
      
      this.searchResults = popularPages;
    }
    
    this.resultsContainer.innerHTML = resultsHTML || `
      <div class="universal-search-empty">
        <div class="universal-search-empty-icon">🌟</div>
        <div>Start typing to search...</div>
        <div style="margin-top: 8px; font-size: 14px;">Try searching for pages, content, or topics</div>
      </div>
    `;
    
    // Update stats to show ready status
    this.updateStats();
    
    // Add click listeners for recent searches and popular pages - FIXED
    this.resultsContainer.querySelectorAll('.universal-search-result').forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        
        const searchTerm = element.getAttribute('data-search');
        const url = element.getAttribute('data-url');
        
        if (searchTerm) {
          // Handle recent search click
          this.searchInput.value = searchTerm;
          this.handleSearch(searchTerm);
        } else if (url) {
          // Handle popular page click
          this.incrementVisitCount(url);
          window.open(url, '_blank');
          this.closeSearch();
        }
      });
    });
  }

  /**
   * Create content snippet with query highlighting
   */
  createSnippet(content, query, maxLength = 150) {
    if (!content || !query) return '';
    
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const queryIndex = lowerContent.indexOf(lowerQuery);
    
    if (queryIndex === -1) {
      return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
    }
    
    const start = Math.max(0, queryIndex - 50);
    const end = Math.min(content.length, start + maxLength);
    let snippet = content.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    return this.highlightText(snippet, query);
  }

  /**
   * Highlight search query in text
   */
  highlightText(text, query) {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<mark style="background: linear-gradient(135deg, #7000ff, #00d9ff); color: white; padding: 2px 4px; border-radius: 4px; font-weight: 600;">$1</mark>');
  }

  /**
   * Escape special regex characters
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Navigate search results with keyboard
   */
  navigateResults(direction) {
    const results = this.resultsContainer.querySelectorAll('.universal-search-result');
    if (results.length === 0) return;
    
    // Remove previous selection
    results.forEach(result => result.classList.remove('selected'));
    
    // Update selected index
    this.selectedIndex += direction;
    
    if (this.selectedIndex < 0) {
      this.selectedIndex = results.length - 1;
    } else if (this.selectedIndex >= results.length) {
      this.selectedIndex = 0;
    }
    
    // Add selection to current result
    results[this.selectedIndex].classList.add('selected');
    results[this.selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  /**
   * Select current result
   */
  selectResult() {
    const results = this.resultsContainer.querySelectorAll('.universal-search-result');
    if (results.length === 0 || this.selectedIndex < 0) return;
    
    const selectedResult = results[this.selectedIndex];
    if (selectedResult) {
      selectedResult.click();
    }
  }

  /**
   * Update search statistics
   */
  updateStats(resultCount = null, query = '') {
    if (!this.statsContainer) return;
    
    if (resultCount !== null && query) {
      // Show result count for current search
      const resultText = resultCount === 1 ? 'result' : 'results';
      this.statsContainer.innerHTML = `✨ ${resultCount} ${resultText} for "${query}"`;
    } else if (this.isIndexing) {
      // Show indexing status
      this.statsContainer.innerHTML = `<span class="universal-search-indexing"><span class="universal-search-spinner"></span>Discovering content...</span>`;
    } else {
      // Show ready status without page count
      this.statsContainer.innerHTML = `🚀 Search ready - Type anything to explore`;
    }
  }

  /**
   * Start crawling the website
   */
  async startCrawling() {
    if (this.isIndexing) return;
    
    this.isIndexing = true;
    this.updateStats();
    
    try {
      // Get starting URLs
      const startUrls = this.getStartUrls();
      startUrls.forEach(url => this.pendingUrls.enqueue(url));
      
      // Start crawling
      await this.crawlUrls();
      
    } catch (error) {
      console.error('Crawling failed:', error);
    } finally {
      this.isIndexing = false;
      this.updateStats();
      this.saveCache();
    }
  }

  /**
   * Get starting URLs for crawling
   */
  getStartUrls() {
    const baseUrl = window.location.origin;
    const currentPath = window.location.pathname;
    
    // Start with current page and common paths
    const urls = [
      baseUrl + '/',
      baseUrl + '/index.html',
      baseUrl + currentPath
    ];
    
    // Add URLs from navigation links
    const navLinks = document.querySelectorAll('a[href]');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        if (href.startsWith('/')) {
          urls.push(baseUrl + href);
        } else if (href.startsWith('./')) {
          urls.push(baseUrl + href.substring(1));
        } else if (!href.startsWith('http')) {
          urls.push(baseUrl + '/' + href);
        }
      }
    });
    
    // Remove duplicates and return
    return [...new Set(urls)];
  }

  /**
   * Crawl URLs from the queue
   */
  async crawlUrls() {
    const maxConcurrent = 3;
    const crawlPromises = [];
    
    while (!this.pendingUrls.isEmpty()) {
      if (crawlPromises.length >= maxConcurrent) {
        await Promise.race(crawlPromises);
        crawlPromises.splice(0, 1);
      }
      
      const url = this.pendingUrls.dequeue();
      if (this.shouldCrawlUrl(url)) {
        const promise = this.crawlSingleUrl(url);
        crawlPromises.push(promise);
      }
    }
    
    // Wait for remaining crawls to complete
    await Promise.all(crawlPromises);
  }

  /**
   * Check if URL should be crawled
   */
  shouldCrawlUrl(url) {
    // Check if already crawled
    if (this.crawledUrls.has(url)) return false;
    
    // Check exclude patterns
    for (const pattern of this.config.excludePatterns) {
      if (pattern.test(url)) return false;
    }
    
    // Only crawl same origin
    try {
      const urlObj = new URL(url);
      return urlObj.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  /**
   * Crawl a single URL
   */
  async crawlSingleUrl(url) {
    if (this.crawledUrls.has(url)) return;
    
    this.crawledUrls.add(url);
    
    try {
      const response = await fetch(url);
      if (!response.ok) return;
      
      const html = await response.text();
      const pageData = this.extractPageData(html, url);
      
      if (pageData) {
        // Check if already exists in index
        const existingIndex = this.searchIndex.findIndex(item => item.url === url);
        if (existingIndex >= 0) {
          this.searchIndex[existingIndex] = pageData;
        } else {
          this.searchIndex.push(pageData);
        }
      }
      
      // Extract and queue new URLs
      const newUrls = this.extractUrls(html, url);
      newUrls.forEach(newUrl => {
        if (this.shouldCrawlUrl(newUrl)) {
          this.pendingUrls.enqueue(newUrl);
        }
      });
      
      // Add delay to be respectful
      await this.delay(this.config.crawlDelay);
      
    } catch (error) {
      console.warn(`Failed to crawl ${url}:`, error);
    }
  }

  /**
   * Extract page data from HTML
   */
  extractPageData(html, url) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract title
      const titleElement = doc.querySelector('title');
      const title = titleElement ? titleElement.textContent.trim() : url;
      
      // Extract meta description
      const metaDesc = doc.querySelector('meta[name="description"]');
      const description = metaDesc ? metaDesc.getAttribute('content') : '';
      
      // Extract text content
      const content = this.extractTextContent(doc);
      
      // Determine page type
      const type = this.determinePageType(url, content);
      
      // Extract keywords
      const keywords = this.extractKeywords(title, description, content);
      
      return {
        id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url,
        title,
        content: content.substring(0, 1000), // Limit content length
        type,
        keywords,
        crawledAt: Date.now(),
        visits: 0
      };
    } catch (error) {
      console.warn(`Failed to parse page data for ${url}:`, error);
      return null;
    }
  }

  /**
   * Extract text content from document
   */
  extractTextContent(doc) {
    // Remove script and style elements
    const scripts = doc.querySelectorAll('script, style, nav, footer');
    scripts.forEach(el => el.remove());
    
    // Get text from main content areas
    const contentSelectors = [
      'main', 'article', '.content', '.post', '.entry',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'
    ];
    
    let text = '';
    for (const selector of contentSelectors) {
      const elements = doc.querySelectorAll(selector);
      elements.forEach(el => {
        text += ' ' + el.textContent;
      });
    }
    
    // Clean up text
    return text
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 2000);
  }

  /**
   * Determine page type based on URL and content
   */
  determinePageType(url, content) {
    const urlLower = url.toLowerCase();
    const contentLower = content.toLowerCase();
    
    if (urlLower.includes('/blog/') || contentLower.includes('blog')) return 'blog';
    if (urlLower.includes('/project') || contentLower.includes('project')) return 'project';
    if (urlLower.includes('/service') || contentLower.includes('service')) return 'service';
    if (urlLower.includes('/about') || contentLower.includes('about')) return 'about';
    if (urlLower.includes('/contact') || contentLower.includes('contact')) return 'contact';
    if (urlLower.includes('/portfolio') || contentLower.includes('portfolio')) return 'portfolio';
    
    return 'page';
  }

  /**
   * Extract keywords from content
   */
  extractKeywords(title, description, content) {
    const text = `${title} ${description} ${content}`.toLowerCase();
    const words = text.match(/\b\w{3,}\b/g) || [];
    
    // Count word frequency
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Get top keywords
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Extract URLs from HTML
   */
  extractUrls(html, baseUrl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('a[href]');
    const urls = [];
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        try {
          const url = new URL(href, baseUrl);
          if (url.origin === window.location.origin) {
            urls.push(url.href);
          }
        } catch {
          // Invalid URL, skip
        }
      }
    });
    
    return [...new Set(urls)];
  }

  /**
   * Load cached data
   */
  loadCache() {
    try {
      const cachedIndex = localStorage.getItem(this.cacheKeys.index);
      const cachedHistory = localStorage.getItem(this.cacheKeys.history);
      const cacheTimestamp = localStorage.getItem(this.cacheKeys.timestamp);
      
      // Check if cache is still valid
      if (cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < this.config.cacheDuration) {
        if (cachedIndex) {
          this.searchIndex = JSON.parse(cachedIndex);
        }
      }
      
      if (cachedHistory) {
        this.searchHistory = JSON.parse(cachedHistory);
      }
    } catch (error) {
      console.warn('Failed to load cache:', error);
    }
  }

  /**
   * Save data to cache
   */
  saveCache() {
    try {
      localStorage.setItem(this.cacheKeys.index, JSON.stringify(this.searchIndex));
      localStorage.setItem(this.cacheKeys.history, JSON.stringify(this.searchHistory));
      localStorage.setItem(this.cacheKeys.timestamp, Date.now().toString());
    } catch (error) {
      console.warn('Failed to save cache:', error);
    }
  }

  /**
   * Add search query to history
   */
  addToHistory(query) {
    if (!query || query.length < 2) return;
    
    // Remove query if it already exists
    this.searchHistory = this.searchHistory.filter(item => item !== query);
    
    // Add to beginning
    this.searchHistory.unshift(query);
    
    // Limit history size
    this.searchHistory = this.searchHistory.slice(0, 20);
    
    // Save to localStorage
    this.saveCache();
  }

  /**
   * Get search history
   */
  getSearchHistory() {
    return this.searchHistory || [];
  }

  /**
   * Increment visit count for a URL
   */
  incrementVisitCount(url) {
    const item = this.searchIndex.find(item => item.url === url);
    if (item) {
      item.visits = (item.visits || 0) + 1;
      this.saveCache();
    }
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Force reindex (for development/debugging)
   */
  async forceReindex() {
    // Clear cache
    localStorage.removeItem(this.cacheKeys.index);
    localStorage.removeItem(this.cacheKeys.timestamp);
    
    // Reset state
    this.searchIndex = [];
    this.crawledUrls.clear();
    this.pendingUrls = new Queue();
    
    // Start fresh crawling
    await this.startCrawling();
  }
}

/**
 * Simple Queue implementation
 */
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

/**
 * Auto-initialize when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSearch);
} else {
  initializeSearch();
}

function initializeSearch() {
  // Create global instance
  window.universalSearch = new UniversalSearchEngine();
  
  // Debug helper
  window.reindexSearch = () => {
    if (window.universalSearch) {
      window.universalSearch.forceReindex();
    }
  };
}