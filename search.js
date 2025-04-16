// Enhanced Search Feature with GSAP Animations, New Tab Opening, and Responsive Design
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
    this.minSearchLength = 1; // Allow single letter searches
    this.cacheKey = 'search_index_v6'; // Version your cache
    this.cacheDuration = 24 * 60 * 60 * 1000; // 24 hours
    this.lastIndexTime = 0;
    this.crawledUrls = new Set();
    this.isIndexing = false;
    this.isMobile = window.innerWidth <= 768; // Check if mobile
    
    // Important blog posts that should always be in search results
    this.knownBlogPosts = [
      {
        title: "How to Earn Money from Canva: Complete Guide",
        url: "/blog/earn-money-canva.html",
        keywords: ["earn", "money", "canva", "design", "template", "graphic", "h", "e", "c", "m"],
        type: "blog",
        category: "Graphic Design"
      },
      {
        title: "Data Visualization Techniques for Better Insights",
        url: "/blog/data-visualization.html", 
        keywords: ["data", "visualization", "chart", "graph", "insight", "d", "v", "i"],
        type: "blog",
        category: "Data"
      },
      {
        title: "How to Start Coding with Zero Knowledge in 2025",
        url: "/blog/start-coding.html",
        keywords: ["coding", "programming", "beginner", "learn", "code", "web", "c", "s", "p"],
        type: "blog",
        category: "Web Development"
      },
      {
        title: "Essential Design Tips for E-commerce Success",
        url: "/blog/ecommerce-redesign.html",
        keywords: ["ecommerce", "design", "shopify", "store", "online", "e", "s"],
        type: "blog",
        category: "E-commerce"
      },
      {
        title: "Mastering E-commerce Analytics for Data-Driven Growth",
        url: "/blog/ecommerce-analytics.html",
        keywords: ["analytics", "ecommerce", "data", "growth", "insights", "a", "e"],
        type: "blog",
        category: "E-commerce"
      },
      {
        title: "Top Ecommerce Trends in 2025",
        url: "/blog/ecommerce-trends.html",
        keywords: ["trends", "ecommerce", "2025", "future", "retail", "t", "e"],
        type: "blog",
        category: "E-commerce"
      },
      {
        title: "How to Improve Your Shopify Store for Better Sales",
        url: "/blog/improve-shopify-store.html",
        keywords: ["improve", "shopify", "store", "sales", "optimization", "i", "s"],
        type: "blog",
        category: "E-commerce"
      },
      {
        title: "Complete Guide to Managing Your Online Store in 2025",
        url: "/blog/Mange-Store.html",
        keywords: ["manage", "store", "online", "guide", "ecommerce", "m", "s"],
        type: "blog",
        category: "E-commerce"
      },
      {
        title: "Product Photography for E-commerce: Boost Conversions",
        url: "/blog/product-photography.html",
        keywords: ["photography", "product", "photo", "ecommerce", "conversion", "p"],
        type: "blog",
        category: "E-commerce"
      },
      {
        title: "AI Voiceovers: The Future of Content Creation in 2025",
        url: "/blog/ai-voiceovers.html",
        keywords: ["ai", "voice", "voiceover", "content", "creation", "a", "v"],
        type: "blog",
        category: "AI Voice"
      },
      {
        title: "Creating Hyper-Realistic Digital Humans with AI",
        url: "/blog/ai-avatars.html",
        keywords: ["ai", "avatar", "digital", "humans", "realistic", "a", "d"],
        type: "blog",
        category: "AI Avatar"
      }
    ];
    
    // Service pages mapping
    this.servicePages = [
      {
        title: "AI Talking Avatar Creation",
        url: "/ai-avatar.html",
        type: "service",
        category: "AI Avatar"
      },
      {
        title: "AI Voiceover Creation",
        url: "/ai-voice.html",
        type: "service",
        category: "AI Voice"
      },
      {
        title: "Professional Audio Engineering",
        url: "/audio-engineering.html",
        type: "service",
        category: "Audio"
      },
      {
        title: "Canva Design Expert",
        url: "/graphic-design.html",
        type: "service",
        category: "Graphic Design"
      },
      {
        title: "Frontend Web Development",
        url: "/web-development.html",
        type: "service",
        category: "Web Development"
      },
      {
        title: "Shopify Store Design",
        url: "/ecommerce-redesign.html",
        type: "service",
        category: "E-commerce"
      }
    ];
    
    // Listen for window resize events to update mobile status
    window.addEventListener('resize', this.handleResize.bind(this));
    
    this.init();
  }
  
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    // If the device type changed while search is open, close and reopen it
    if (this.isOpen && wasMobile !== this.isMobile) {
      this.closeSearch();
      setTimeout(() => this.openSearch(), 300);
    }
  }
  
  async init() {
    // Load GSAP first if not already loaded
    await this.ensureGSAPLoaded();
    
    // Create search button & overlay
    this.createSearchButton();
    this.createSearchOverlay();
    
    // Initialize event listeners
    this.initEventListeners();
    
    // Add known blog posts to search data immediately
    this.addKnownBlogPostsToIndex();
    
    // Load search data
    await this.loadSearchData();
    
    // Add a hidden reindex button for admins
    this.createReindexButton();
  }
  
  async ensureGSAPLoaded() {
    // Check if GSAP is already loaded
    if (window.gsap) {
      console.log('GSAP already loaded');
      return;
    }
    
    // Load GSAP if not already available
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
      script.async = true;
      
      script.onload = () => {
        console.log('GSAP loaded dynamically');
        resolve();
      };
      
      script.onerror = () => {
        console.error('Failed to load GSAP');
        resolve(); // Continue anyway
      };
      
      document.head.appendChild(script);
    });
  }
  
  // Add known blog posts to index
  addKnownBlogPostsToIndex() {
    console.log("Adding known blog posts to search index");
    
    for (const blogPost of this.knownBlogPosts) {
      // Check if already in searchData
      const exists = this.searchData.some(item => item.url === blogPost.url);
      if (!exists) {
        // Add to search data with initial content
        this.searchData.push({
          id: `blog-${this.searchData.length + 1}`,
          url: blogPost.url,
          title: blogPost.title,
          content: `${blogPost.title}. Keywords: ${blogPost.keywords.join(", ")}`,
          type: "blog",
          category: blogPost.category,
          isKnownBlog: true, // Mark as known blog for prioritization
          // Add first letters to help with single-letter search
          firstLetters: blogPost.title.split(' ').map(word => word[0]?.toLowerCase()).join('')
        });
      }
    }
    
    // Add service pages
    for (const service of this.servicePages) {
      const exists = this.searchData.some(item => item.url === service.url);
      if (!exists) {
        this.searchData.push({
          id: `service-${this.searchData.length + 1}`,
          url: service.url,
          title: service.title,
          content: `${service.title}. Service page for ${service.category}.`,
          type: "service",
          category: service.category,
          isService: true,
          firstLetters: service.title.split(' ').map(word => word[0]?.toLowerCase()).join('')
        });
      }
    }
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
    
    // Apply modern styling for the search overlay
    this.applyModernStyling();
    
    // Store references
    this.overlay = overlay;
    this.searchInput = document.getElementById('search-input');
    this.resultsContainer = document.getElementById('search-results');
    this.searchStats = document.getElementById('search-stats');
  }
  
  // Add modern styling to the search overlay with responsive design
  applyModernStyling() {
    const style = document.createElement('style');
    style.textContent = `
      .search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(20, 10, 30, 0.95) 0%, rgba(5, 5, 15, 0.95) 100%);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }
      
      .search-overlay.active {
        opacity: 1;
        visibility: visible;
      }
      
      .search-container {
        width: 100%;
        max-width: 800px;
        background: rgba(25, 20, 35, 0.6);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
        overflow: hidden;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        margin: 0 20px;
        transform: translateY(20px);
        animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .search-form {
        display: flex;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: linear-gradient(to right, rgba(123, 44, 191, 0.2), rgba(157, 78, 221, 0.1));
      }
      
      .search-icon {
        color: #9d4edd;
        font-size: 20px;
        margin-right: 16px;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0% { opacity: 0.8; }
        50% { opacity: 1; }
        100% { opacity: 0.8; }
      }
      
      #search-input {
        flex: 1;
        background: transparent;
        border: none;
        color: #fff;
        font-size: 20px;
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
        outline: none;
        padding: 8px 0;
        caret-color: #9d4edd;
      }
      
      #search-input::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }
      
      #search-clear {
        background: rgba(157, 78, 221, 0.2);
        border: none;
        color: #fff;
        cursor: pointer;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
      }
      
      #search-clear:hover {
        background: rgba(157, 78, 221, 0.4);
        transform: rotate(90deg);
      }
      
      .search-stats {
        padding: 12px 24px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        backdrop-filter: blur(5px);
        background: rgba(20, 15, 30, 0.4);
        font-family: 'Poppins', sans-serif;
      }
      
      .search-results {
        overflow-y: auto;
        max-height: calc(80vh - 140px);
        padding: 10px 0;
        scrollbar-width: thin;
        scrollbar-color: rgba(157, 78, 221, 0.5) rgba(30, 30, 40, 0.3);
      }
      
      .search-results::-webkit-scrollbar {
        width: 6px;
      }
      
      .search-results::-webkit-scrollbar-track {
        background: rgba(30, 30, 40, 0.3);
      }
      
      .search-results::-webkit-scrollbar-thumb {
        background-color: rgba(157, 78, 221, 0.5);
        border-radius: 6px;
      }
      
      .search-result {
        display: flex;
        align-items: flex-start;
        padding: 16px 24px;
        margin: 4px 8px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        overflow: hidden;
      }
      
      .search-result:hover, .search-result.selected {
        background: rgba(40, 35, 55, 0.6);
        transform: translateX(4px);
      }
      
      .result-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 18px;
        flex-shrink: 0;
        color: #fff;
        font-size: 18px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      }
      
      .category-blog {
        background: linear-gradient(135deg, #9d4edd 0%, #7209b7 100%);
      }
      
      .category-service {
        background: linear-gradient(135deg, #f77f00 0%, #d62828 100%);
      }
      
      .category-page {
        background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
      }
      
      .search-result:hover .result-icon, .search-result.selected .result-icon {
        transform: scale(1.05);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      .result-content {
        flex: 1;
        min-width: 0;
      }
      
      .result-title {
        font-size: 17px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: 'Poppins', sans-serif;
      }
      
      .result-category {
        display: inline-block;
        font-size: 11px;
        color: #fff;
        margin-bottom: 8px;
        font-weight: 500;
        padding: 3px 8px;
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: rgba(157, 78, 221, 0.3);
      }
      
      .result-excerpt {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .result-arrow {
        margin-left: 18px;
        color: rgba(255, 255, 255, 0.5);
        transition: all 0.3s;
      }
      
      .search-result:hover .result-arrow, 
      .search-result.selected .result-arrow {
        color: #9d4edd;
        transform: translateX(5px);
      }
      
      .search-footer {
        padding: 14px 24px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        background: rgba(20, 15, 30, 0.5);
        backdrop-filter: blur(5px);
        text-align: center;
        font-family: 'Poppins', sans-serif;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      .search-footer kbd {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
        color: #fff;
        display: inline-block;
        font-size: 12px;
        line-height: 1;
        padding: 4px 6px;
        margin: 0 3px;
        font-family: 'Space Mono', monospace;
      }
      
      .empty-state, .no-results {
        padding: 50px 20px;
        text-align: center;
        color: rgba(255, 255, 255, 0.7);
        font-family: 'Poppins', sans-serif;
      }
      
      .empty-state i, .no-results i {
        font-size: 48px;
        margin-bottom: 20px;
        background: linear-gradient(135deg, #9d4edd 0%, #7209b7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: float 3s ease-in-out infinite;
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      
      .empty-state p, .no-results p {
        margin: 5px 0;
        font-size: 16px;
      }
      
      .no-results .tip {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 16px;
        max-width: 300px;
        margin: 16px auto 0;
      }
      
      mark {
        background: linear-gradient(120deg, rgba(157, 78, 221, 0.3) 0%, rgba(157, 78, 221, 0.4) 100%);
        color: #fff;
        padding: 0 4px;
        border-radius: 3px;
        font-weight: 500;
      }
      
      /* Mobile Styles */
      @media (max-width: 768px) {
        .search-overlay {
          align-items: flex-start;
          padding: 0;
        }
        
        .search-container {
          max-width: 100%;
          height: 100%;
          max-height: 100%;
          margin: 0;
          border-radius: 0;
        }
        
        .search-form {
          padding: 16px;
        }
        
        #search-input {
          font-size: 16px;
        }
        
        .search-icon {
          font-size: 18px;
          margin-right: 12px;
        }
        
        #search-clear {
          width: 32px;
          height: 32px;
        }
        
        .search-stats {
          padding: 10px 16px;
          font-size: 13px;
        }
        
        .search-results {
          max-height: calc(100vh - 130px);
        }
        
        .search-result {
          padding: 14px 16px;
          margin: 4px;
          flex-direction: column;
        }
        
        .result-icon {
          width: 36px;
          height: 36px;
          font-size: 16px;
          margin-right: 12px;
          float: left;
          margin-bottom: 8px;
        }
        
        .result-content {
          width: 100%;
          margin-left: 48px;
        }
        
        .result-title {
          font-size: 15px;
          white-space: normal;
          margin-top: -5px;
        }
        
        .result-excerpt {
          font-size: 13px;
          -webkit-line-clamp: 3;
        }
        
        .result-category {
          font-size: 10px;
          padding: 2px 6px;
        }
        
        .result-arrow {
          position: absolute;
          top: 14px;
          right: 16px;
          margin-left: 0;
        }
        
        .search-footer {
          padding: 12px 16px;
        }
        
        .search-footer kbd {
          font-size: 10px;
          padding: 3px 5px;
        }
      }
      
      /* Large Screen Adjustments */
      @media (min-width: 1200px) {
        .search-container {
          max-width: 900px;
        }
        
        .result-title {
          font-size: 18px;
        }
        
        .result-excerpt {
          font-size: 15px;
        }
        
        .search-result {
          padding: 18px 28px;
        }
      }
      
      #force-reindex {
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: #9d4edd;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 12px;
        cursor: pointer;
        z-index: 999;
        display: none;
      }
      
      #force-reindex:hover {
        background: #8100e0;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create a hidden button to force reindex for admins
  createReindexButton() {
    const reindexButton = document.createElement('button');
    reindexButton.id = 'force-reindex';
    reindexButton.textContent = 'Rebuild Search Index';
    reindexButton.style.display = 'none';
    
    reindexButton.addEventListener('click', () => {
      this.forceReindex();
    });
    
    document.body.appendChild(reindexButton);
    
    // Show button with Shift+Ctrl+I key combo
    document.addEventListener('keydown', (e) => {
      if (e.shiftKey && e.ctrlKey && e.key === 'I') {
        const button = document.getElementById('force-reindex');
        if (button) {
          button.style.display = button.style.display === 'none' ? 'block' : 'none';
        }
      }
    });
  }
  
  forceReindex() {
    // Clear the cache
    localStorage.removeItem(this.cacheKey);
    this.searchData = [];
    this.crawledUrls = new Set();
    
    // Add known blog posts first
    this.addKnownBlogPostsToIndex();
    
    // Reindex content
    this.indexAllContent().then(() => {
      alert('Search index rebuilt successfully! The index now contains ' + this.searchData.length + ' items.');
    });
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
    
    // Search input event
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
          // Open in new tab
          this.navigateToResult(this.results[this.selectedIndex], true);
        }
      }
    });
  }
  
  async loadSearchData() {
    // Try to get from cache first
    const cachedData = this.getCachedSearchData();
    
    if (cachedData && cachedData.length > 0) {
      console.log('Using cached search data with', cachedData.length, 'items');
      this.searchData = cachedData;
      
      // Still index current page in background
      setTimeout(() => this.addCurrentPageToIndex(), 100);
      
      // Schedule a background reindex if it's been a while
      const lastIndexTime = parseInt(localStorage.getItem('last_index_time') || '0');
      const now = Date.now();
      if (now - lastIndexTime > this.cacheDuration / 2) {
        setTimeout(() => this.indexAllContent(true), 2000); // Background indexing
      }
    } else {
      // No cache, need to build search index
      console.log('Building search index...');
      
      // Make sure known blog posts are added first
      if (this.searchData.length === 0) {
        this.addKnownBlogPostsToIndex();
      }
      
      await this.indexAllContent();
    }
  }
  
  getCachedSearchData() {
    try {
      const cachedData = localStorage.getItem(this.cacheKey);
      if (!cachedData) return null;
      return JSON.parse(cachedData);
    } catch (e) {
      console.error('Error retrieving cached search data:', e);
      return null;
    }
  }
  
  cacheSearchData() {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(this.searchData));
      localStorage.setItem('last_index_time', Date.now().toString());
      console.log('Search data cached with', this.searchData.length, 'items');
    } catch (e) {
      console.error('Error caching search data:', e);
    }
  }
  
  async indexAllContent(background = false) {
    if (this.isIndexing) return;
    this.isIndexing = true;
    
    try {
      // Reset crawled URLs if not background indexing
      if (!background) {
        this.crawledUrls = new Set();
        
        // Keep known blog posts but reset other content
        const knownBlogPosts = this.searchData.filter(item => item.isKnownBlog);
        const servicePages = this.searchData.filter(item => item.isService);
        this.searchData = [...knownBlogPosts, ...servicePages];
      }
      
      // Always start with current page
      await this.addCurrentPageToIndex();
      
      // Index known blog URLs specifically first
      for (const blogPost of this.knownBlogPosts) {
        await this.indexPageFromUrl(blogPost.url);
      }
      
      // Find all links on the page
      const links = Array.from(document.querySelectorAll('a[href]'))
        .map(a => a.getAttribute('href'))
        .filter(href => this.shouldIndexLink(href));
      
      // Prioritize blog links
      const blogLinks = links.filter(link => 
        link.includes('/blog/') || 
        this.knownBlogPosts.some(blog => link.includes(blog.url.replace('/blog/', '')))
      );
      
      // Index blog pages first
      for (const link of blogLinks) {
        if (this.crawledUrls.size > 50) break; // Limit for performance
        await this.indexPageFromUrl(link);
      }
      
      // Then index other pages
      for (const link of links) {
        if (this.crawledUrls.size > 50) break; // Limit for performance
        if (!blogLinks.includes(link)) {
          await this.indexPageFromUrl(link);
        }
      }
      
      // Cache the results
      this.cacheSearchData();
      
      console.log('Indexing complete with', this.searchData.length, 'items');
    } catch (e) {
      console.error('Error during indexing:', e);
    } finally {
      this.isIndexing = false;
    }
  }
  
  shouldIndexLink(href) {
    if (!href) return false;
    
    // Skip external links, anchor links, etc.
    if (href.startsWith('http') || 
        href.startsWith('#') || 
        href.startsWith('mailto:') || 
        href.startsWith('tel:') || 
        href.startsWith('javascript:')) {
      return false;
    }
    
    // Special case - prioritize known blog posts
    for (const blog of this.knownBlogPosts) {
      if (href.includes(blog.url)) {
        return true;
      }
    }
    
    // Normalize the URL
    const url = this.resolveUrl(href);
    
    // Skip if already crawled
    if (this.crawledUrls.has(url)) return false;
    
    // Include only HTML pages
    if (!url.endsWith('.html') && !url.endsWith('/')) return false;
    
    // Skip certain pages
    if (url.includes('/admin/') || 
        url.includes('/login') || 
        url.includes('/register') || 
        url.includes('/terms') || 
        url.includes('/privacy')) {
      return false;
    }
    
    return true;
  }
  
  resolveUrl(href) {
    if (href.startsWith('/')) {
      // Absolute path
      return href;
    } else {
      // Relative path - resolve against current page path
      const base = window.location.pathname.replace(/\/[^/]*$/, '/');
      return base + href;
    }
  }
  
  async indexPageFromUrl(href) {
    try {
      const url = this.resolveUrl(href);
      
      // Skip if already crawled, unless it's a known blog post
      if (this.crawledUrls.has(url) && !this.isKnownBlogPost(url)) return;
      
      // Mark as crawled
      this.crawledUrls.add(url);
      
      // SPECIAL HANDLING FOR KNOWN BLOG POSTS
      // If this is a known blog post, treat it specially
      const knownBlog = this.getKnownBlogPost(url);
      if (knownBlog) {
        console.log(`Indexing known blog post: ${knownBlog.title} at ${url}`);
        
        // Check if we already have this in the search data
        const existingIndex = this.searchData.findIndex(item => 
          item.url === url || item.url === knownBlog.url
        );
        
        if (existingIndex >= 0) {
          // Update with known blog info
          this.searchData[existingIndex] = {
            ...this.searchData[existingIndex],
            title: knownBlog.title,
            url: knownBlog.url, // Use the known URL format
            type: "blog",
            category: knownBlog.category,
            isKnownBlog: true,
            score: 100, // Give high score for prioritization
            firstLetters: knownBlog.title.split(' ').map(word => word[0]?.toLowerCase()).join('')
          };
        } else {
          // Add to search data
          this.searchData.push({
            id: `blog-${this.searchData.length + 1}`,
            url: knownBlog.url,
            title: knownBlog.title,
            content: `${knownBlog.title}. Keywords: ${knownBlog.keywords.join(", ")}`,
            type: "blog",
            category: knownBlog.category,
            isKnownBlog: true,
            firstLetters: knownBlog.title.split(' ').map(word => word[0]?.toLowerCase()).join('')
          });
        }
        
        // Attempt to fetch the actual content
        try {
          const response = await fetch(url);
          if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract content from the blog post
            let content = '';
            const contentElements = doc.querySelectorAll('.blog-post-text p, .blog-post-content p, article p, .blog-content p, h1, h2, h3, h4, h5, h6');
            for (const el of contentElements) {
              content += el.textContent + ' ';
            }
            
            // Update with actual content if found
            if (content.length > 50) {
              const existingIdx = this.searchData.findIndex(item => 
                item.url === url || item.url === knownBlog.url
              );
              
              if (existingIdx >= 0) {
                this.searchData[existingIdx].content = content;
              }
            }
          }
        } catch (fetchError) {
          console.warn(`Couldn't fetch content for known blog: ${url}`, fetchError);
          // Keep the placeholder content
        }
        
        return;
      }
      
      // REGULAR PAGE INDEXING (non-known blogs)
      // Fetch the page
      const response = await fetch(url);
      if (!response.ok) return;
      
      const html = await response.text();
      
      // Parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract metadata
      const title = doc.title || '';
      
      // Get description
      let description = '';
      const metaDesc = doc.querySelector('meta[name="description"]');
      if (metaDesc) {
        description = metaDesc.getAttribute('content') || '';
      }
      
      // Get main content
      let content = '';
      const mainContent = doc.querySelector('main') || 
                          doc.querySelector('article') || 
                          doc.querySelector('.blog-post-content') ||
                          doc.querySelector('.content') ||
                          doc.body;
      
      if (mainContent) {
        // Extract text from paragraphs and headings for better quality
        const contentElements = mainContent.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
        for (const el of contentElements) {
          content += el.textContent + ' ';
        }
        
        content = content.replace(/\s+/g, ' ').trim();
      }
      
      // Skip pages with minimal content
      if (!title || content.length < 50) return;
      
      // Determine type and category
      let type = 'page';
      let category = 'Page';
      
      if (url.includes('/blog/')) {
        type = 'blog';
        category = 'Blog';
        
        // Try to get more specific category from page
        const categoryEl = doc.querySelector('.blog-category');
        if (categoryEl && categoryEl.textContent) {
          category = categoryEl.textContent.trim();
        }
      } else if (url.match(/\/(ai-avatar|ai-voice|audio-engineering|graphic-design|web-development|ecommerce-redesign)\.html$/)) {
        type = 'service';
        category = 'Service';
        
        // Set more specific category based on URL
        if (url.includes('ai-avatar')) {
          category = 'AI Avatar';
        } else if (url.includes('ai-voice')) {
          category = 'AI Voice';
        } else if (url.includes('audio-engineering')) {
          category = 'Audio';
        } else if (url.includes('graphic-design')) {
          category = 'Graphic Design';
        } else if (url.includes('web-development')) {
          category = 'Web Development';
        } else if (url.includes('ecommerce-redesign')) {
          category = 'E-commerce';
        }
      }
      
      // Add to search data
      const existingIndex = this.searchData.findIndex(item => item.url === url);
      
      // Add firstLetters for single-letter searching
      const firstLetters = title.split(' ').map(word => word[0]?.toLowerCase()).join('');
      
      if (existingIndex >= 0) {
        // Update existing entry
        this.searchData[existingIndex] = {
          ...this.searchData[existingIndex],
          title,
          content,
          type,
          category,
          firstLetters
        };
      } else {
        // Add new entry
        this.searchData.push({
          id: `page-${this.searchData.length + 1}`,
          url,
          title,
          content: content || description,
          type,
          category,
          firstLetters
        });
      }
      
      // Find additional links to follow (for blog pages)
      if (type === 'blog') {
        const pageLinks = Array.from(doc.querySelectorAll('a[href]'))
          .map(a => a.getAttribute('href'))
          .filter(href => this.shouldIndexLink(href));
        
        // Follow up to 3 links from each blog page
        let followed = 0;
        for (const link of pageLinks) {
          if (followed >= 3 || this.crawledUrls.size > 50) break;
          await this.indexPageFromUrl(link);
          followed++;
        }
      }
      
    } catch (e) {
      console.error(`Error indexing ${href}:`, e);
    }
  }
  
  // Check if URL is a known blog post
  isKnownBlogPost(url) {
    return this.knownBlogPosts.some(blog => url.includes(blog.url));
  }
  
  // Get known blog post data
  getKnownBlogPost(url) {
    return this.knownBlogPosts.find(blog => url.includes(blog.url));
  }
  
  addCurrentPageToIndex() {
    // Only add the current page if it's not already indexed
    const currentPath = window.location.pathname;
    const currentUrl = currentPath.endsWith('/') ? currentPath + 'index.html' : currentPath;
    
    // Special handling for known blog posts
    const knownBlog = this.getKnownBlogPost(currentUrl);
    if (knownBlog) {
      console.log(`Current page is known blog: ${knownBlog.title}`);
      // Use indexPageFromUrl for consistent handling
      this.indexPageFromUrl(currentUrl);
      return;
    }
    
    // Check if already in crawledUrls
    if (this.crawledUrls.has(currentUrl)) return;
    this.crawledUrls.add(currentUrl);
    
    // Get page title
    const title = document.title || 'Untitled Page';
    
    // Get page description
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = metaDescription ? metaDescription.getAttribute('content') : '';
    
    // Get main content - focus on the main elements
    const mainContent = document.querySelector('main') || 
                        document.querySelector('article') || 
                        document.querySelector('.blog-post-content') ||
                        document.querySelector('.content') ||
                        document.body;
    
    // Extract text with focus on important elements
    let content = '';
    if (mainContent) {
      // Get text from paragraphs and headings for better quality
      const contentElements = mainContent.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, .blog-post-text');
      for (const el of contentElements) {
        content += el.textContent + ' ';
      }
      
      content = content.replace(/\s+/g, ' ').trim();
    }
    
    // Determine type and category
    let type = 'page';
    let category = 'Page';
    
    if (currentUrl.includes('/blog/')) {
      type = 'blog';
      category = 'Blog';
      
      // Try to get more specific category
      const categoryEl = document.querySelector('.blog-category');
      if (categoryEl && categoryEl.textContent) {
        category = categoryEl.textContent.trim();
      }
    } else if (currentUrl.match(/\/(ai-avatar|ai-voice|audio-engineering|graphic-design|web-development|ecommerce-redesign)\.html$/)) {
      type = 'service';
      category = 'Service';
      
      // Set more specific category based on URL
      if (currentUrl.includes('ai-avatar')) {
        category = 'AI Avatar';
      } else if (currentUrl.includes('ai-voice')) {
        category = 'AI Voice';
      } else if (currentUrl.includes('audio-engineering')) {
        category = 'Audio';
      } else if (currentUrl.includes('graphic-design')) {
        category = 'Graphic Design';
      } else if (currentUrl.includes('web-development')) {
        category = 'Web Development';
      } else if (currentUrl.includes('ecommerce-redesign')) {
        category = 'E-commerce';
      }
    }
    
    // Add firstLetters for single-letter searching
    const firstLetters = title.split(' ').map(word => word[0]?.toLowerCase()).join('');
    
    // Add to search data
    if (title && (content || description)) {
      const existingIndex = this.searchData.findIndex(item => item.url === currentUrl);
      
      if (existingIndex >= 0) {
        // Update existing entry
        this.searchData[existingIndex] = {
          ...this.searchData[existingIndex],
          title,
          content: content || description,
          type,
          category,
          firstLetters
        };
      } else {
        // Add new entry
        this.searchData.push({
          id: `page-${this.searchData.length + 1}`,
          url: currentUrl,
          title,
          content: content || description,
          type,
          category,
          firstLetters
        });
      }
      
      // Cache the updated data
      this.cacheSearchData();
    }
  }
  
  openSearch() {
    // Add 'active' class to overlay to make it visible
    this.overlay.classList.add('active');
    
    // Apply different animations for mobile and desktop
    if (window.gsap) {
      // Clear any previous animations
      gsap.killTweensOf('.search-container');
      gsap.killTweensOf('.search-form');
      gsap.killTweensOf('.search-icon');
      
      if (this.isMobile) {
        // Mobile animation - slide up from bottom
        gsap.fromTo('.search-container', 
          { y: '100%', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
        
        // Animate form elements
        gsap.fromTo('.search-form', 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3, delay: 0.2, ease: 'power1.out' }
        );
      } else {
        // Desktop animation - scale and fade in
        gsap.set('.search-container', { opacity: 0, scale: 0.95, y: 20 });
        gsap.set('.search-form', { opacity: 0, y: -10 });
        gsap.set('.search-icon', { scale: 0.5 });
        
        // Create timeline
        const tl = gsap.timeline();
        
        // Container animation
        tl.to('.search-container', { 
          opacity: 1, 
          scale: 1,
          y: 0, 
          duration: 0.4, 
          ease: "back.out(1.2)" 
        });
        
        // Search form animation
        tl.to('.search-form', { 
          opacity: 1, 
          y: 0, 
          duration: 0.4, 
          ease: "power1.out" 
        }, "-=0.2");
        
        // Icon animation
        tl.to('.search-icon', { 
          scale: 1, 
          duration: 0.5, 
          ease: "elastic.out(1, 0.5)" 
        }, "-=0.2");
      }
      
      // Focus input after animation
      setTimeout(() => this.searchInput.focus(), 300);
    } else {
      // Fallback without GSAP
      this.searchInput.focus();
    }
    
    this.isOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
  
  closeSearch() {
    // GSAP animation for closing
    if (window.gsap) {
      // Different animations for mobile and desktop
      if (this.isMobile) {
        // Mobile animation - slide down
        gsap.to('.search-container', {
          y: '100%',
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            this.overlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            this.isOpen = false;
          }
        });
      } else {
        // Desktop animation - fade out and scale down
        gsap.to('.search-container', { 
          opacity: 0, 
          scale: 0.95,
          y: 20, 
          duration: 0.3, 
          ease: "power1.in",
          onComplete: () => {
            this.overlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            this.isOpen = false;
          }
        });
      }
    } else {
      // Fallback without GSAP
      this.overlay.classList.remove('active');
      this.isOpen = false;
      document.body.style.overflow = ''; // Restore scrolling
    }
  }
  
  clearSearch() {
    this.searchInput.value = '';
    this.handleSearch();
    this.searchInput.focus();
  }
  
  handleSearch() {
    const query = this.searchInput.value.trim();
    
    if (query.length >= this.minSearchLength) {
      // Perform search
      this.results = this.searchItems(query);
      this.selectedIndex = this.results.length > 0 ? 0 : -1;
      this.renderResults(query);
      this.updateSearchStats(query);
    } else {
      // Clear results
      this.results = [];
      this.selectedIndex = -1;
      this.resultsContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <p>Type to search across the website</p>
        </div>
      `;
      this.searchStats.innerHTML = '';
    }
  }
  
  searchItems(query) {
    if (!query) return [];
    
    const searchTerm = query.toLowerCase();
    const searchTerms = searchTerm.split(/\s+/).filter(term => term.length > 0); // Allow single-letter terms
    
    // SINGLE-LETTER SEARCH:
    // If just a single letter, check if it's an initial letter of title words
    if (searchTerm.length === 1) {
      const matchingItems = this.searchData.filter(item => {
        // Match first letter of any word in title
        if (item.firstLetters && item.firstLetters.includes(searchTerm)) {
          return true;
        }
        
        // Also check keywords for known blogs
        if (item.isKnownBlog) {
          const blog = this.knownBlogPosts.find(b => b.title === item.title);
          if (blog && blog.keywords.some(k => k.toLowerCase() === searchTerm)) {
            return true;
          }
        }
        
        return false;
      });
      
      if (matchingItems.length > 0) {
        return matchingItems.map(item => {
          const excerpt = item.content ? 
            item.content.substring(0, 150) + '...' : 
            item.title;
            
          return {
            ...item,
            score: item.isKnownBlog ? 1000 : (item.isService ? 800 : 500),
            excerpt,
            highlightedExcerpt: this.highlightMatches(excerpt, searchTerm),
            highlightedTitle: this.highlightMatches(item.title, searchTerm)
          };
        }).sort((a, b) => b.score - a.score);
      }
    }
    
    // DIRECT BLOG POST MATCH:
    // Check for direct matches to known blog posts
    for (const blogPost of this.knownBlogPosts) {
      // Check if query directly relates to this blog post
      const titleMatch = blogPost.title.toLowerCase().includes(searchTerm);
      const keywordMatch = blogPost.keywords.some(keyword => 
        searchTerm.includes(keyword.toLowerCase()) || 
        keyword.toLowerCase() === searchTerm
      );
      
      if (titleMatch || keywordMatch) {
        console.log(`Direct match found for known blog: ${blogPost.title}`);
        
        // Get the blog post from search data
        const blogInIndex = this.searchData.find(item => 
          item.url === blogPost.url || 
          (item.title === blogPost.title && item.type === 'blog')
        );
        
        if (blogInIndex) {
          // Return just this result with high score
          const excerpt = blogInIndex.content ? 
            blogInIndex.content.substring(0, 150) + '...' : 
            `${blogPost.title}. Keywords: ${blogPost.keywords.join(", ")}`;
            
          return [{
            ...blogInIndex,
            score: 1000, // Very high score
            excerpt,
            highlightedExcerpt: this.highlightMatches(excerpt, searchTerm),
            highlightedTitle: this.highlightMatches(blogPost.title, searchTerm)
          }];
        }
      }
    }
    
    // If no direct matches found, do regular search
    return this.searchData
      .filter(item => {
        // Skip items with no content
        if (!item.title || (!item.content && !item.description)) return false;
        
        // Search in title and content
        const titleMatch = item.title.toLowerCase().includes(searchTerm);
        const contentMatch = item.content && item.content.toLowerCase().includes(searchTerm);
        
        // Check multiple terms if present
        if (searchTerms.length > 1) {
          return titleMatch || contentMatch || searchTerms.every(term => 
            item.title.toLowerCase().includes(term) || 
            (item.content && item.content.toLowerCase().includes(term))
          );
        }
        
        return titleMatch || contentMatch;
      })
      .map(item => {
        // Calculate score based on match quality
        let score = 0;
        
        // Known blog posts get very high score
        if (item.isKnownBlog) {
          score += 500;
        }
        
        // Service pages get high score
        if (item.isService) {
          score += 400;
        }
        
        // Title matches are weighted higher
        if (item.title.toLowerCase().includes(searchTerm)) {
          score += 100;
          // Bonus for starts with
          if (item.title.toLowerCase().startsWith(searchTerm)) {
            score += 50;
          }
        }
        
        // Type/category matches
        if (item.category.toLowerCase().includes(searchTerm)) {
          score += 50;
        }
        
        // Content matches
        if (item.content && item.content.toLowerCase().includes(searchTerm)) {
          score += 30;
          
          // Bonus for multiple occurrences
          const occurrences = (item.content.toLowerCase().match(new RegExp(this.escapeRegExp(searchTerm), 'g')) || []).length;
          if (occurrences > 1) {
            score += Math.min(occurrences * 5, 50);
          }
        }
        
        // Special case for blog posts
        if (item.type === 'blog') {
          score += 200; // Big boost for blog content
        }
        
        // Special case for known blog keywords
        if (item.type === 'blog') {
          for (const blogPost of this.knownBlogPosts) {
            if (item.url.includes(blogPost.url) || item.title === blogPost.title) {
              // Check if search term matches any keywords
              for (const keyword of blogPost.keywords) {
                if (searchTerm.includes(keyword.toLowerCase())) {
                  score += 300; // Huge boost for keyword match
                  break;
                }
              }
            }
          }
        }
        
        // For multiple terms, check how many match
        if (searchTerms.length > 1) {
          let matchCount = 0;
          for (const term of searchTerms) {
            if (item.title.toLowerCase().includes(term) || 
                (item.content && item.content.toLowerCase().includes(term))) {
              matchCount++;
            }
          }
          // Bonus for matching all terms
          if (matchCount === searchTerms.length) {
            score += 50;
          } else {
            score += matchCount * 10;
          }
        }
        
        // Generate excerpt with highlighted matches
        let excerpt = item.content || '';
        if (excerpt.length > 150) {
          // Try to find a match position
          const matchPos = excerpt.toLowerCase().indexOf(searchTerm);
          if (matchPos >= 0) {
            // Start excerpt around the match
            const start = Math.max(0, matchPos - 60);
            excerpt = (start > 0 ? '...' : '') + 
                      excerpt.substring(start, Math.min(start + 150, excerpt.length)) + 
                      (start + 150 < excerpt.length ? '...' : '');
          } else {
            // No match found, use beginning
            excerpt = excerpt.substring(0, 150) + '...';
          }
        }
        
        // Add highlighted excerpt
        const highlightedExcerpt = this.highlightMatches(excerpt, searchTerm);
        const highlightedTitle = this.highlightMatches(item.title, searchTerm);
        
        return {
          ...item,
          score,
          excerpt,
          highlightedExcerpt,
          highlightedTitle
        };
      })
      .sort((a, b) => b.score - a.score) // Sort by score
      .slice(0, 20); // Limit results
  }
  
  highlightMatches(text, searchTerm) {
    if (!text) return '';
    
    const searchTerms = searchTerm.split(/\s+/).filter(term => term.length > 0);
    let highlightedText = text;
    
    if (searchTerms.length > 1) {
      // Sort by length (longest first) to avoid nested highlights
      searchTerms.sort((a, b) => b.length - a.length);
      
      // Highlight each term
      for (const term of searchTerms) {
        const regex = new RegExp(this.escapeRegExp(term), 'gi');
        highlightedText = highlightedText.replace(regex, match => `<mark>${match}</mark>`);
      }
    } else {
      // Single term
      const regex = new RegExp(this.escapeRegExp(searchTerm), 'gi');
      highlightedText = highlightedText.replace(regex, match => `<mark>${match}</mark>`);
    }
    
    return highlightedText;
  }
  
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  renderResults(query) {
    if (this.results.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="no-results">
          <i class="fas fa-exclamation-circle"></i>
          <p>No results found for "${query}"</p>
          <p class="tip">Try different keywords or check spelling</p>
        </div>
      `;
      return;
    }
    
    let html = '';
    
    for (let i = 0; i < this.results.length; i++) {
      const result = this.results[i];
      
      // Determine icon based on type
      let iconClass = 'fas fa-file';
      let categoryClass = 'category-page';
      
      if (result.type === 'blog') {
        iconClass = 'fas fa-newspaper';
        categoryClass = 'category-blog';
      } else if (result.type === 'service') {
        iconClass = 'fas fa-concierge-bell';
        categoryClass = 'category-service';
      }
      
      html += `
        <div class="search-result ${i === this.selectedIndex ? 'selected' : ''}" data-index="${i}">
          <div class="result-icon ${categoryClass}">
            <i class="${iconClass}"></i>
          </div>
          <div class="result-content">
            <div class="result-title">${result.highlightedTitle}</div>
            <span class="result-category">${result.category}</span>
            <div class="result-excerpt">${result.highlightedExcerpt}</div>
          </div>
          <div class="result-arrow">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      `;
    }
    
    this.resultsContainer.innerHTML = html;
    
    // Add animation with GSAP if available
    if (window.gsap) {
      gsap.from('.search-result', {
        y: this.isMobile ? 30 : 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power1.out'
      });
    }
    
    // Add click listeners
    const resultElements = this.resultsContainer.querySelectorAll('.search-result');
    for (let i = 0; i < resultElements.length; i++) {
      resultElements[i].addEventListener('click', () => {
        // Open in new tab when clicked
        this.navigateToResult(this.results[i], true);
      });
      
      resultElements[i].addEventListener('mouseenter', () => {
        this.selectedIndex = i;
        this.updateSelectedResult();
      });
    }
  }
  
  updateSearchStats(query) {
    this.searchStats.innerHTML = `
      <div class="results-count">
        ${this.results.length} result${this.results.length !== 1 ? 's' : ''} for "${query}"
      </div>
    `;
    
    // Animate with GSAP if available
    if (window.gsap) {
      gsap.from('.results-count', {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: 'power1.out'
      });
    }
  }
  
  selectNextResult() {
    if (this.results.length === 0) return;
    
    this.selectedIndex = (this.selectedIndex + 1) % this.results.length;
    this.updateSelectedResult();
  }
  
  selectPrevResult() {
    if (this.results.length === 0) return;
    
    this.selectedIndex = (this.selectedIndex - 1 + this.results.length) % this.results.length;
    this.updateSelectedResult();
  }
  
  updateSelectedResult() {
    const resultElements = this.resultsContainer.querySelectorAll('.search-result');
    
    for (let i = 0; i < resultElements.length; i++) {
      if (i === this.selectedIndex) {
        resultElements[i].classList.add('selected');
        resultElements[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        resultElements[i].classList.remove('selected');
      }
    }
  }
  
  navigateToResult(result, newTab = false) {
    if (!result || !result.url) return;
    
    // CRITICAL FIX: Ensure blog URLs are correct
    let url = result.url;
    
    // 1. Check if this is a known blog post
    if (result.type === 'blog') {
      for (const knownBlog of this.knownBlogPosts) {
        if (url.includes(knownBlog.url.replace('/blog/', '')) || 
            result.title === knownBlog.title) {
          // Use the correct URL for this known blog
          url = knownBlog.url;
          console.log('Using known blog URL:', url);
          break;
        }
      }
    }
    
    // 2. Ensure URL starts with / if it's relative
    if (!url.startsWith('/') && !url.startsWith('http')) {
      url = '/' + url;
    }
    
    // 3. Fix blog URLs that might be missing the /blog/ directory
    if (result.type === 'blog' && !url.includes('/blog/')) {
      // Extract the filename
      const match = url.match(/\/([^\/]+\.html)$/);
      if (match) {
        const filename = match[1];
        url = '/blog/' + filename;
      }
    }
    
    console.log('Navigating to URL:', url, newTab ? '(in new tab)' : '');
    
    // GSAP animation before navigation
    if (window.gsap && !newTab) {
      gsap.to('.search-container', {
        opacity: 0,
        y: this.isMobile ? 100 : -20,
        duration: 0.3,
        ease: 'power1.in',
        onComplete: () => {
          if (newTab) {
            window.open(url, '_blank');
          } else {
            window.location.href = url;
          }
        }
      });
    } else {
      // Open in new tab or same window
      if (newTab) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    }
  }
}

// Initialize search feature
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedSearchFeature();
});