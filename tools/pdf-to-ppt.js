/**
 * PDF to PowerPoint Converter Tool
 * Client-side functionality for the PDF to PowerPoint converter tool
 * Handles file upload, conversion simulation, and download
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loadingOverlay = document.getElementById('loadingOverlay');
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.getElementById('loadingText');
    const loadingInfo = document.getElementById('loadingInfo');
    
    const uploadSection = document.getElementById('uploadSection');
    const processingSection = document.getElementById('processingSection');
    const resultSection = document.getElementById('resultSection');
    
    const dropZone = document.getElementById('dropZone');
    const browseBtn = document.getElementById('browseBtn');
    const pdfFileInput = document.getElementById('pdfFileInput');
    const exampleBtns = document.querySelectorAll('.example-btn');
    
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const pageCount = document.getElementById('pageCount');
    const statusMessage = document.getElementById('statusMessage');
    const progressPercentage = document.getElementById('progressPercentage');
    const conversionProgress = document.getElementById('conversionProgress');
    const conversionTip = document.getElementById('conversionTip');
    
    const resultFileName = document.getElementById('resultFileName');
    const slideCount = document.getElementById('slideCount');
    const resultFileSize = document.getElementById('resultFileSize');
    const imageCount = document.getElementById('imageCount');
    const chartCount = document.getElementById('chartCount');
    const textBlockCount = document.getElementById('textBlockCount');
    
    const cancelBtn = document.getElementById('cancelBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewBtn = document.getElementById('previewBtn');
    const newConversionBtn = document.getElementById('newConversionBtn');
    
    const previewModal = document.getElementById('previewModal');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const slidePreview = document.getElementById('slidePreview');
    const prevSlideBtn = document.getElementById('prevSlideBtn');
    const nextSlideBtn = document.getElementById('nextSlideBtn');
    const currentSlide = document.getElementById('currentSlide');
    const totalSlides = document.getElementById('totalSlides');
    
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    const faqItems = document.querySelectorAll('.faq-item');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    
    // Variables
    let currentFile = null;
    let conversionInterval = null;
    let currentSlideIndex = 1;
    let totalSlideCount = 0;
    
    // Example data for simulation
    const exampleFiles = {
      business: {
        name: "Business-Report.pdf",
        size: "2.8 MB",
        pages: 12,
        slides: 12,
        resultSize: "3.2 MB",
        images: 8,
        charts: 6,
        text: 35
      },
      education: {
        name: "Educational-Materials.pdf",
        size: "4.2 MB",
        pages: 18,
        slides: 18,
        resultSize: "4.8 MB",
        images: 15,
        charts: 4,
        text: 42
      },
      portfolio: {
        name: "Creative-Portfolio.pdf",
        size: "5.8 MB",
        pages: 10,
        slides: 10,
        resultSize: "6.3 MB",
        images: 25,
        charts: 0,
        text: 15
      },
      infographic: {
        name: "Data-Infographic.pdf",
        size: "3.5 MB",
        pages: 6,
        slides: 6,
        resultSize: "3.8 MB",
        images: 12,
        charts: 8,
        text: 20
      }
    };
    
    // Conversion tips
    const conversionTips = [
      "PowerPoint presentations with fewer words per slide tend to be more effective for audience engagement.",
      "After conversion, consider applying a consistent theme for better visual cohesion across all slides.",
      "Use the 6x6 rule: no more than 6 bullet points per slide and no more than 6 words per bullet.",
      "Consider breaking complex PDF pages into multiple slides for better readability.",
      "High-quality images from your PDF will make your PowerPoint presentation more engaging."
    ];
    
    // Initialize
    initApp();
    
    /**
     * Initialize the application
     */
    function initApp() {
      // Simulate loading
      simulateLoading();
      
      // Event listeners
      setupEventListeners();
    }
    
    /**
     * Simulate loading the application
     */
    function simulateLoading() {
      let progress = 0;
      const loadingInterval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
          clearInterval(loadingInterval);
          loadingText.textContent = "Ready";
          loadingInfo.textContent = "Starting the converter...";
          
          // Hide loading overlay
          setTimeout(() => {
            loadingOverlay.style.display = "none";
          }, 500);
        }
      }, 100);
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
      // File upload via browse button
      if (browseBtn) {
        browseBtn.addEventListener('click', function() {
          pdfFileInput.click();
        });
      }
      
      // File input change
      if (pdfFileInput) {
        pdfFileInput.addEventListener('change', function() {
          if (pdfFileInput.files.length > 0) {
            handleFileUpload(pdfFileInput.files[0]);
          }
        });
      }
      
      // Drag and drop functionality
      if (dropZone) {
        dropZone.addEventListener('dragover', function(e) {
          e.preventDefault();
          dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', function() {
          dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', function(e) {
          e.preventDefault();
          dropZone.classList.remove('dragover');
          
          if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        });
        
        dropZone.addEventListener('click', function() {
          pdfFileInput.click();
        });
      }
      
      // Example buttons
      if (exampleBtns) {
        exampleBtns.forEach(function(btn) {
          btn.addEventListener('click', function() {
            const exampleType = btn.dataset.example;
            handleExampleSelection(exampleType);
          });
        });
      }
      
      // Cancel button
      if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
          stopConversion();
          showSection(uploadSection);
          hideSection(processingSection);
          showNotification("Conversion cancelled", "warning");
        });
      }
      
      // New conversion button
      if (newConversionBtn) {
        newConversionBtn.addEventListener('click', function() {
          showSection(uploadSection);
          hideSection(resultSection);
        });
      }
      
      // Download button
      if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
          simulateDownload();
        });
      }
      
      // Preview button
      if (previewBtn) {
        previewBtn.addEventListener('click', function() {
          openPreviewModal();
        });
      }
      
      // Preview modal controls
      if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', function() {
          closePreviewModal();
        });
      }
      
      // Preview navigation
      if (prevSlideBtn) {
        prevSlideBtn.addEventListener('click', function() {
          navigateSlide(-1);
        });
      }
      
      if (nextSlideBtn) {
        nextSlideBtn.addEventListener('click', function() {
          navigateSlide(1);
        });
      }
      
      // FAQ toggles
      if (faqItems) {
        faqItems.forEach(function(item) {
          const question = item.querySelector('.faq-question');
          
          if (question) {
            question.addEventListener('click', function() {
              toggleFaqItem(item);
            });
          }
        });
      }
      
      // Mobile menu
      if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
          mobileMenu.style.display = 'flex';
        });
      }
      
      if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', function() {
          mobileMenu.style.display = 'none';
        });
      }
    }
    
    /**
     * Handle file upload
     * @param {File} file - The uploaded file
     */
    function handleFileUpload(file) {
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        showNotification("Please upload a PDF file", "error");
        return;
      }
      
      // Check file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        showNotification("File size exceeds 25MB limit", "error");
        return;
      }
      
      // Set current file
      currentFile = file;
      
      // Update file info
      fileName.textContent = file.name;
      fileSize.textContent = formatFileSize(file.size);
      
      // Generate random page count for demo
      const pageAmount = Math.floor(Math.random() * 15) + 5;
      pageCount.textContent = pageAmount;
      
      // Start conversion
      startConversion(pageAmount);
    }
    
    /**
     * Handle example file selection
     * @param {string} exampleType - The type of example
     */
    function handleExampleSelection(exampleType) {
      const example = exampleFiles[exampleType];
      
      if (!example) {
        showNotification("Example not found", "error");
        return;
      }
      
      // Update file info
      fileName.textContent = example.name;
      fileSize.textContent = example.size;
      pageCount.textContent = example.pages;
      
      // Set as current file (example)
      currentFile = {
        name: example.name,
        type: 'application/pdf',
        example: exampleType
      };
      
      // Start conversion
      startConversion(example.pages);
    }
    
    /**
     * Start the conversion process
     * @param {number} pages - Number of pages
     */
    function startConversion(pages) {
      // Show processing section
      hideSection(uploadSection);
      showSection(processingSection);
      
      // Reset progress
      conversionProgress.style.width = '0%';
      progressPercentage.textContent = '0%';
      statusMessage.textContent = 'Analyzing PDF structure';
      
      // Reset steps
      const steps = document.querySelectorAll('.conversion-steps .step');
      steps.forEach(function(step) {
        step.classList.remove('current', 'completed');
      });
      steps[0].classList.add('current');
      
      // Show random tip
      conversionTip.textContent = conversionTips[Math.floor(Math.random() * conversionTips.length)];
      
      // Start progress simulation
      let progress = 0;
      let currentStep = 0;
      const stepMessages = [
        'Analyzing PDF structure',
        'Extracting text and images',
        'Creating slide layouts',
        'Finalizing conversion'
      ];
      
      conversionInterval = setInterval(function() {
        // Increment progress
        progress += 1;
        const progressValue = Math.min(progress, 100);
        conversionProgress.style.width = progressValue + '%';
        progressPercentage.textContent = progressValue + '%';
        
        // Update steps
        const newStep = Math.floor(progress / 25); // 4 steps, 25% each
        if (newStep > currentStep && newStep < 4) {
          steps[currentStep].classList.remove('current');
          steps[currentStep].classList.add('completed');
          steps[newStep].classList.add('current');
          statusMessage.textContent = stepMessages[newStep];
          currentStep = newStep;
        }
        
        // Show new tip at 50%
        if (progress === 50) {
          conversionTip.textContent = conversionTips[Math.floor(Math.random() * conversionTips.length)];
        }
        
        // Complete conversion at 100%
        if (progress >= 100) {
          clearInterval(conversionInterval);
          steps[currentStep].classList.remove('current');
          steps[currentStep].classList.add('completed');
          
          setTimeout(function() {
            completeConversion(pages);
          }, 500);
        }
      }, 50);
    }
    
    /**
     * Stop the conversion process
     */
    function stopConversion() {
      if (conversionInterval) {
        clearInterval(conversionInterval);
        conversionInterval = null;
      }
    }
    
    /**
     * Complete the conversion and show results
     * @param {number} pages - Number of pages
     */
    function completeConversion(pages) {
      // If it's an example file
      if (currentFile.example) {
        const example = exampleFiles[currentFile.example];
        resultFileName.textContent = currentFile.name.replace('.pdf', '.pptx');
        resultFileSize.textContent = example.resultSize;
        slideCount.textContent = example.slides;
        imageCount.textContent = example.images;
        chartCount.textContent = example.charts;
        textBlockCount.textContent = example.text;
        
        totalSlideCount = example.slides;
      } 
      // For uploaded files
      else {
        const pptxName = currentFile.name.replace('.pdf', '.pptx');
        const slides = pages;
        // Slightly larger than PDF
        const pptxSize = formatFileSize(Math.round(getFileSizeInBytes(fileSize.textContent) * 1.15));
        
        // Generate random stats based on page count
        const images = Math.floor(Math.random() * 5) + Math.floor(pages * 0.8);
        const charts = Math.floor(Math.random() * 3) + Math.floor(pages * 0.3);
        const textBlocks = Math.floor(Math.random() * 10) + Math.floor(pages * 2);
        
        resultFileName.textContent = pptxName;
        resultFileSize.textContent = pptxSize;
        slideCount.textContent = slides;
        imageCount.textContent = images;
        chartCount.textContent = charts;
        textBlockCount.textContent = textBlocks;
        
        totalSlideCount = slides;
      }
      
      // Reset slide preview
      currentSlideIndex = 1;
      currentSlide.textContent = currentSlideIndex;
      totalSlides.textContent = totalSlideCount;
      
      // Show result section
      hideSection(processingSection);
      showSection(resultSection);
      
      // Show success notification
      showNotification("Conversion completed successfully!", "success");
    }
    
    /**
     * Simulate downloading the converted file
     */
    function simulateDownload() {
      showNotification("Preparing download...", "info");
      
      setTimeout(function() {
        // Create fake download link
        const link = document.createElement('a');
        link.href = 'javascript:void(0)';
        link.setAttribute('download', resultFileName.textContent);
        link.click();
        
        showNotification("Download started", "success");
      }, 1000);
    }
    
    /**
     * Open the preview modal
     */
    function openPreviewModal() {
      previewModal.style.display = 'flex';
      updateSlidePreview();
    }
    
    /**
     * Close the preview modal
     */
    function closePreviewModal() {
      previewModal.style.display = 'none';
    }
    
    /**
     * Navigate between slides
     * @param {number} direction - Direction of navigation (-1 for prev, 1 for next)
     */
    function navigateSlide(direction) {
      const newIndex = currentSlideIndex + direction;
      
      if (newIndex >= 1 && newIndex <= totalSlideCount) {
        currentSlideIndex = newIndex;
        currentSlide.textContent = currentSlideIndex;
        updateSlidePreview();
      }
    }
    
    /**
     * Update the slide preview content
     */
    function updateSlidePreview() {
      // Create a simple slide preview
      slidePreview.innerHTML = `
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
             background-color: white; display: flex; flex-direction: column; 
             justify-content: center; align-items: center; padding: 20px;">
          <div style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 15px;">
            Slide ${currentSlideIndex}
          </div>
          <div style="width: 80%; height: 20px; background-color: #ddd; margin-bottom: 15px;"></div>
          <div style="width: 70%; height: 15px; background-color: #ddd; margin-bottom: 15px;"></div>
          <div style="width: 60%; height: 15px; background-color: #ddd; margin-bottom: 25px;"></div>
          
          <div style="display: flex; width: 80%; justify-content: space-between;">
            <div style="width: 45%; height: 100px; background-color: #e6e6e6; border-radius: 5px;"></div>
            <div style="width: 45%; height: 100px; background-color: #e6e6e6; border-radius: 5px;"></div>
          </div>
        </div>
      `;
    }
    
    /**
     * Toggle FAQ item open/closed
     * @param {Element} item - FAQ item element
     */
    function toggleFaqItem(item) {
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');
      
      // Close all FAQs
      faqItems.forEach(function(faq) {
        faq.classList.remove('active');
      });
      
      // Open this FAQ if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    }
    
    /**
     * Show notification
     * @param {string} message - The notification message
     * @param {string} type - The notification type (success, error, warning, info)
     */
    function showNotification(message, type = 'info') {
      notificationMessage.textContent = message;
      notification.className = 'notification';
      notification.classList.add(type);
      notification.classList.add('show');
      
      // Hide after 3 seconds
      setTimeout(function() {
        notification.classList.remove('show');
      }, 3000);
    }
    
    /**
     * Helper function to show a section
     * @param {Element} section - The section to show
     */
    function showSection(section) {
      if (section) section.classList.remove('hidden');
    }
    
    /**
     * Helper function to hide a section
     * @param {Element} section - The section to hide
     */
    function hideSection(section) {
      if (section) section.classList.add('hidden');
    }
    
    /**
     * Format file size
     * @param {number} bytes - Size in bytes
     * @returns {string} Formatted size
     */
    function formatFileSize(bytes) {
      if (typeof bytes === 'string') return bytes;
      
      if (bytes === 0) return '0 Bytes';
      
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      
      return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    /**
     * Get file size in bytes from formatted string
     * @param {string} sizeStr - Formatted size string (e.g., "2.8 MB")
     * @returns {number} Size in bytes
     */
    function getFileSizeInBytes(sizeStr) {
      const parts = sizeStr.split(' ');
      const size = parseFloat(parts[0]);
      const unit = parts[1];
      
      const units = {
        'Bytes': 1,
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024
      };
      
      return size * (units[unit] || 1);
    }
  });