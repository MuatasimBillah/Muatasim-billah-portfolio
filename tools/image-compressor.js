/**
 * Image Compressor Tool
 * Client-side image compression with complete privacy
 * 
 * All processing happens in the browser - no server uploads
 * Created for Mehar Designer Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Main Sections
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const browseBtn = document.getElementById('browseBtn');
    const uploadSection = document.getElementById('uploadSection');
    const compressionOptions = document.getElementById('compressionOptions');
    const resultsSection = document.getElementById('resultsSection');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Settings and Controls
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const resizeToggle = document.getElementById('resizeToggle');
    const resizeOptions = document.getElementById('resizeOptions');
    const maxWidthInput = document.getElementById('maxWidthInput');
    const maxHeightInput = document.getElementById('maxHeightInput');
    const maintainRatio = document.getElementById('maintainRatio');
    const metadataToggle = document.getElementById('metadataToggle');
    const outputFormat = document.getElementById('outputFormat');
    
    // Action Buttons
    const compressBtn = document.getElementById('compressBtn');
    const backToUpload = document.getElementById('backToUpload');
    const backToOptions = document.getElementById('backToOptions');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const compressMoreBtn = document.getElementById('compressMoreBtn');
    const scrollToToolBtn = document.getElementById('scrollToToolBtn');
    
    // Results Elements
    const resultsContainer = document.getElementById('resultsContainer');
    const totalSaved = document.getElementById('totalSaved');
    const avgReduction = document.getElementById('avgReduction');
    
    // Progress Elements
    const compressionProgress = document.getElementById('compressionProgress');
    const progressBar = document.getElementById('progressBar');
    
    // Notification
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    // State Variables
    let filesToCompress = [];
    let compressedResults = [];
    let totalSavedBytes = 0;
    let totalPercentSaved = 0;
    
    //------------------------------------
    // UTILITY FUNCTIONS
    //------------------------------------
    
    /**
     * Format file size for display
     */
    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1048576).toFixed(2) + ' MB';
    }
    
    /**
     * Show notification
     */
    function showNotification(message) {
      notificationMessage.textContent = message;
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
    
    /**
     * Show loading overlay
     */
    function showLoading() {
      loadingOverlay.classList.add('active');
    }
    
    /**
     * Hide loading overlay
     */
    function hideLoading() {
      loadingOverlay.classList.remove('active');
    }
    
    /**
     * Update progress 
     */
    function updateProgress(current, total, percent) {
      compressionProgress.textContent = `Processing image ${current} of ${total}`;
      progressBar.style.width = `${percent}%`;
    }
    
    /**
     * Get image dimensions
     */
    function getImageDimensions(file) {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = function() {
          URL.revokeObjectURL(img.src); // Clean up
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        };
        img.src = URL.createObjectURL(file);
      });
    }
    
    /**
     * Get file extension from MIME type
     */
    function getExtensionFromMimeType(mimeType) {
      const types = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif'
      };
      return types[mimeType] || 'jpg';
    }
    
    /**
     * Get MIME type for output format
     */
    function getMimeType(format, originalType) {
      if (format === 'same') return originalType;
      
      const types = {
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp'
      };
      return types[format] || 'image/jpeg';
    }
    
    /**
     * Update stats display
     */
    function updateStatsDisplay() {
      if (compressedResults.length === 0) return;
      
      const totalOriginalSize = compressedResults.reduce((total, result) => total + result.originalSize, 0);
      const totalCompressedSize = compressedResults.reduce((total, result) => total + result.compressedSize, 0);
      
      totalSavedBytes = totalOriginalSize - totalCompressedSize;
      const totalSavedPercent = ((totalSavedBytes / totalOriginalSize) * 100).toFixed(1);
      
      totalSaved.textContent = formatFileSize(totalSavedBytes);
      avgReduction.textContent = totalSavedPercent + '%';
    }
    
    //------------------------------------
    // CORE FUNCTIONS
    //------------------------------------
    
    /**
     * Process uploaded files
     */
    function processFiles(files) {
      // Validate files
      const validFiles = Array.from(files).filter(file => {
        // Check if it's an image
        if (!file.type.startsWith('image/')) {
          showNotification(`${file.name} is not an image file`);
          return false;
        }
        
        // Check file size
        if (file.size > 10 * 1024 * 1024) {
          showNotification(`${file.name} exceeds 10MB limit`);
          return false;
        }
        
        return true;
      });
      
      if (validFiles.length === 0) {
        showNotification('No valid image files selected');
        return;
      }
      
      // Store valid files
      filesToCompress = validFiles;
      
      // Show options section
      uploadSection.style.display = 'none';
      compressionOptions.style.display = 'block';
      resultsSection.style.display = 'none';
      
      // Add animation
      gsap.from('#compressionOptions', {
        opacity: 0,
        y: 20,
        duration: 0.5
      });
      
      // Show notification
      showNotification(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} ready for compression`);
    }
    
    /**
     * Compress images with selected options
     */
    async function compressImages() {
      if (filesToCompress.length === 0) {
        showNotification('No images to compress');
        return;
      }
      
      // Get compression options
      const quality = parseInt(qualitySlider.value) / 100;
      const shouldResize = resizeToggle.checked;
      const maxWidth = shouldResize ? parseInt(maxWidthInput.value) : undefined;
      const maxHeight = shouldResize ? parseInt(maxHeightInput.value) : undefined;
      const keepAspectRatio = maintainRatio.checked;
      const removeMetadata = !metadataToggle.checked;
      const format = outputFormat.value;
      
      // Show loading overlay
      showLoading();
      updateProgress(0, filesToCompress.length, 0);
      
      // Clear previous results
      compressedResults = [];
      resultsContainer.innerHTML = '';
      
      // Process each file
      for (let i = 0; i < filesToCompress.length; i++) {
        const file = filesToCompress[i];
        
        // Update progress
        updateProgress(i + 1, filesToCompress.length, ((i + 1) / filesToCompress.length) * 100);
        
        try {
          // Get file dimensions
          const dimensions = await getImageDimensions(file);
          
          // Configure compression options
          const compressionOptions = {
            maxSizeMB: 10,
            maxWidthOrHeight: Math.max(maxWidth || 8000, maxHeight || 8000),
            useWebWorker: true,
            fileType: getMimeType(format, file.type),
            initialQuality: quality
          };
          
          // If custom resize is enabled
          if (shouldResize) {
            if (keepAspectRatio) {
              // Calculate scaling factor based on both dimensions
              const widthRatio = maxWidth / dimensions.width;
              const heightRatio = maxHeight / dimensions.height;
              const ratio = Math.min(widthRatio, heightRatio);
              
              compressionOptions.maxWidthOrHeight = Math.max(
                dimensions.width * ratio,
                dimensions.height * ratio
              );
            } else {
              // Set max dimensions directly
              compressionOptions.maxWidthOrHeight = Math.max(maxWidth, maxHeight);
            }
          }
          
          // Compress the image
          const compressedFile = await imageCompression(file, compressionOptions);
          
          // Create result object
          const result = {
            originalFile: file,
            compressedFile: compressedFile,
            originalSize: file.size,
            compressedSize: compressedFile.size,
            name: file.name,
            reduction: ((file.size - compressedFile.size) / file.size) * 100,
            originalUrl: URL.createObjectURL(file),
            compressedUrl: URL.createObjectURL(compressedFile),
            originalDimensions: dimensions,
            outputFormat: format === 'same' ? getExtensionFromMimeType(file.type) : format
          };
          
          // Add to results
          compressedResults.push(result);
          
          // Create and add result card
          createResultCard(result);
          
          // Update stats
          updateStatsDisplay();
        } catch (error) {
          console.error(`Error compressing ${file.name}:`, error);
          showNotification(`Error compressing ${file.name}`);
        }
      }
      
      // Show results section
      uploadSection.style.display = 'none';
      compressionOptions.style.display = 'none';
      resultsSection.style.display = 'block';
      
      // Add animation
      gsap.from('#resultsSection', {
        opacity: 0,
        y: 20,
        duration: 0.5
      });
      
      // Hide loading
      hideLoading();
      
      // Show success notification
      showNotification(`${filesToCompress.length} image${filesToCompress.length > 1 ? 's' : ''} compressed successfully`);
    }
    
    /**
     * Create result card
     */
    function createResultCard(result) {
      const card = document.createElement('div');
      card.className = 'result-card';
      
      // Calculate percentage saved
      const percentSaved = result.reduction.toFixed(1);
      
      // Create HTML content
      card.innerHTML = `
        <div class="result-image">
          <div class="label original">Original</div>
          <div class="label compressed">Compressed</div>
          <div class="comparison-slider">
            <img class="original-image" src="${result.originalUrl}" alt="Original">
            <img class="compressed-image" src="${result.compressedUrl}" alt="Compressed">
          </div>
        </div>
        <div class="result-details">
          <h3 title="${result.name}">${result.name}</h3>
          <div class="result-stats">
            <span>
              <strong>${formatFileSize(result.originalSize)}</strong>
              Original
            </span>
            <span>
              <strong>${formatFileSize(result.compressedSize)}</strong>
              Compressed
            </span>
          </div>
          <div class="reduction-label">Reduced by ${percentSaved}%</div>
          <div class="result-actions">
            <button class="btn secondary download-btn" data-index="${compressedResults.length - 1}">
              <i class="fas fa-download"></i> Download
            </button>
            <button class="btn secondary comparison-btn" data-index="${compressedResults.length - 1}">
              <i class="fas fa-eye"></i> Compare
            </button>
          </div>
        </div>
      `;
      
      // Add to results container
      resultsContainer.appendChild(card);
      
      // Add event listeners
      const downloadBtn = card.querySelector('.download-btn');
      const comparisonBtn = card.querySelector('.comparison-btn');
      
      downloadBtn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        downloadCompressedImage(index);
      });
      
      comparisonBtn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        toggleComparison(this, index);
      });
    }
    
    /**
     * Toggle comparison slider
     */
    function toggleComparison(button, index) {
      const result = compressedResults[index];
      if (!result) return;
      
      const card = button.closest('.result-card');
      const comparisonSlider = card.querySelector('.comparison-slider');
      
      if (comparisonSlider.style.display === 'block') {
        comparisonSlider.style.display = 'none';
        button.innerHTML = '<i class="fas fa-eye"></i> Compare';
      } else {
        comparisonSlider.style.display = 'block';
        button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide';
      }
    }
    
    /**
     * Download a compressed image
     */
    function downloadCompressedImage(index) {
      const result = compressedResults[index];
      if (!result) return;
      
      // Create a download link
      const link = document.createElement('a');
      link.href = result.compressedUrl;
      
      // Generate filename
      const fileNameParts = result.name.split('.');
      fileNameParts.pop(); // Remove extension
      const nameWithoutExt = fileNameParts.join('.');
      const newFileName = `${nameWithoutExt}_compressed.${result.outputFormat}`;
      
      link.download = newFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification(`Downloaded ${newFileName}`);
    }
    
    /**
     * Download all compressed images as zip
     */
    async function downloadAllImages() {
      if (compressedResults.length === 0) {
        showNotification('No compressed images to download');
        return;
      }
      
      showLoading();
      compressionProgress.textContent = 'Preparing download...';
      
      try {
        // Check if JSZip is available
        if (typeof JSZip === 'undefined') {
          // Load JSZip dynamically
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
        }
        
        // Create a new zip file
        const zip = new JSZip();
        
        // Add each compressed image to the zip
        for (let i = 0; i < compressedResults.length; i++) {
          const result = compressedResults[i];
          
          // Update progress
          updateProgress(i + 1, compressedResults.length, ((i + 1) / compressedResults.length) * 100);
          
          // Generate filename
          const fileNameParts = result.name.split('.');
          fileNameParts.pop(); // Remove extension
          const nameWithoutExt = fileNameParts.join('.');
          const newFileName = `${nameWithoutExt}_compressed.${result.outputFormat}`;
          
          // Add file to zip
          const blob = await fetch(result.compressedUrl).then(r => r.blob());
          zip.file(newFileName, blob);
        }
        
        // Generate the zip file
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = 'compressed_images.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('All compressed images downloaded as ZIP');
      } catch (error) {
        console.error('Error creating ZIP file:', error);
        showNotification('Error creating ZIP file');
        
        // Fallback: download individual files
        for (let i = 0; i < compressedResults.length; i++) {
          downloadCompressedImage(i);
        }
      } finally {
        hideLoading();
      }
    }
    
    /**
     * Load external script
     */
    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    
    //------------------------------------
    // EVENT LISTENERS
    //------------------------------------
    
    // Open file browser when button is clicked
    if (browseBtn) {
      browseBtn.addEventListener('click', function() {
        fileInput.click();
      });
    }
    
    // Handle file selection
    if (fileInput) {
      fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
          processFiles(this.files);
        }
      });
    }
    
    // Handle drag and drop
    if (dropZone) {
      dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
      });
      
      dropZone.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
      });
      
      dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
          processFiles(e.dataTransfer.files);
        }
      });
      
      // Also handle click on dropzone
      dropZone.addEventListener('click', function() {
        fileInput.click();
      });
    }
    
    // Quality slider
    if (qualitySlider) {
      qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
      });
    }
    
    // Resize toggle
    if (resizeToggle) {
      resizeToggle.addEventListener('change', function() {
        resizeOptions.style.display = this.checked ? 'block' : 'none';
      });
    }
    
    // Compress button
    if (compressBtn) {
      compressBtn.addEventListener('click', compressImages);
    }
    
    // Back to upload button
    if (backToUpload) {
      backToUpload.addEventListener('click', function() {
        compressionOptions.style.display = 'none';
        uploadSection.style.display = 'block';
        
        // Animation
        gsap.from('#uploadSection', {
          opacity: 0,
          y: -20,
          duration: 0.5
        });
      });
    }
    
    // Back to options button
    if (backToOptions) {
      backToOptions.addEventListener('click', function() {
        resultsSection.style.display = 'none';
        compressionOptions.style.display = 'block';
        
        // Animation
        gsap.from('#compressionOptions', {
          opacity: 0,
          y: -20,
          duration: 0.5
        });
      });
    }
    
    // Download all button
    if (downloadAllBtn) {
      downloadAllBtn.addEventListener('click', downloadAllImages);
    }
    
    // Compress more button
    if (compressMoreBtn) {
      compressMoreBtn.addEventListener('click', function() {
        // Reset file input
        fileInput.value = '';
        
        // Show upload section
        resultsSection.style.display = 'none';
        uploadSection.style.display = 'block';
        
        // Animation
        gsap.from('#uploadSection', {
          opacity: 0,
          y: -20,
          duration: 0.5
        });
      });
    }
    
    // Scroll to tool button
    if (scrollToToolBtn) {
      scrollToToolBtn.addEventListener('click', function() {
        const toolContainer = document.querySelector('.tool-container');
        if (toolContainer) {
          toolContainer.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        document.documentElement.setAttribute('data-theme', 
          document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        );
      });
    }
    
    // Initialize the app
    function init() {
      // Set default theme
      document.documentElement.setAttribute('data-theme', 'dark');
      
      // Initial animations
      gsap.from('.page-header', { opacity: 0, y: -30, duration: 1 });
      gsap.from('.tool-container', { opacity: 0, y: 30, duration: 1, delay: 0.3 });
      gsap.from('.tool-benefits', { opacity: 0, y: 20, duration: 0.7, delay: 0.5, stagger: 0.1 });
      
      console.log('Image Compressor Tool initialized!');
    }
    
    // Run initialization
    init();
  });