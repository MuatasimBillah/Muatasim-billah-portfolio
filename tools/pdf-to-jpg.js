/**
 * PDF to PowerPoint Converter Tool
 * Client-side functionality for MB Tools
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
  
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const pageCount = document.getElementById('pageCount');
  
  const statusMessage = document.getElementById('statusMessage');
  const progressPercentage = document.getElementById('progressPercentage');
  const conversionProgress = document.getElementById('conversionProgress');
  const conversionTip = document.getElementById('conversionTip');
  
  const cancelBtn = document.getElementById('cancelBtn');
  
  const resultFileName = document.getElementById('resultFileName');
  const slideCount = document.getElementById('slideCount');
  const resultFileSize = document.getElementById('resultFileSize');
  const imageCount = document.getElementById('imageCount');
  const chartCount = document.getElementById('chartCount');
  const textBlockCount = document.getElementById('textBlockCount');
  
  const downloadBtn = document.getElementById('downloadBtn');
  const previewBtn = document.getElementById('previewBtn');
  const newConversionBtn = document.getElementById('newConversionBtn');
  
  const previewModal = document.getElementById('previewModal');
  const closePreviewBtn = document.getElementById('closePreviewBtn');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const currentSlide = document.getElementById('currentSlide');
  const totalSlides = document.getElementById('totalSlides');
  const slidePreview = document.getElementById('slidePreview');
  
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notificationMessage');
  const scrollToToolBtn = document.getElementById('scrollToToolBtn');
  
  const faqItems = document.querySelectorAll('.faq-item');
  
  // Variables
  let currentFile = null;
  let conversionInterval = null;
  let currentSlideIndex = 1;
  let totalSlideCount = 8;
  
  // Conversion tips
  const conversionTips = [
    "PowerPoint presentations with fewer words per slide tend to be more effective for audience engagement.",
    "Use high-quality images in your PDF for better conversion results in your PowerPoint slides.",
    "After conversion, consider applying a consistent theme for better visual appeal.",
    "You can edit the converted PowerPoint to add animations and transitions.",
    "Consider breaking complex information into multiple slides for better readability.",
  ];
  
  // Example files data
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
  
  // Initialize the application
  initializeApp();
  
  function initializeApp() {
    // Simulate loading process
    simulateLoading();
    
    // Set up event listeners
    setupEventListeners();
  }
  
  function simulateLoading() {
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
      progress += 5;
      progressBar.style.width = `${progress}%`;
      
      if (progress >= 30) {
        loadingText.textContent = "Setting up converter...";
      }
      
      if (progress >= 60) {
        loadingText.textContent = "Almost ready...";
      }
      
      if (progress >= 90) {
        loadingText.textContent = "Finishing up...";
      }
      
      if (progress >= 100) {
        clearInterval(loadingInterval);
        loadingText.textContent = "Ready!";
        loadingInfo.textContent = "Starting the application...";
        
        // Hide loading overlay after a short delay
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
        }, 500);
      }
    }, 50);
  }
  
  function setupEventListeners() {
    // Scroll to tool button
    if (scrollToToolBtn) {
      scrollToToolBtn.addEventListener('click', () => {
        document.querySelector('.tool-container').scrollIntoView({ behavior: 'smooth' });
      });
    }
    
    // File drop zone
    if (dropZone) {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });
      
      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
      });
      
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
          handleFileUpload(e.dataTransfer.files[0]);
        }
      });
      
      dropZone.addEventListener('click', () => {
        pdfFileInput.click();
      });
    }
    
    // Browse button
    if (browseBtn) {
      browseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering dropZone click
        pdfFileInput.click();
      });
    }
    
    // File input change
    if (pdfFileInput) {
      pdfFileInput.addEventListener('change', () => {
        if (pdfFileInput.files.length > 0) {
          handleFileUpload(pdfFileInput.files[0]);
        }
      });
    }
    
    // Example buttons
    const exampleButtons = document.querySelectorAll('.example-btn');
    if (exampleButtons) {
      exampleButtons.forEach(button => {
        button.addEventListener('click', () => {
          const exampleType = button.getAttribute('data-example');
          handleExampleSelection(exampleType);
        });
      });
    }
    
    // Cancel button
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        cancelConversion();
      });
    }
    
    // Download button
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        handleDownload();
      });
    }
    
    // Preview button
    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        openPreviewModal();
      });
    }
    
    // New conversion button
    if (newConversionBtn) {
      newConversionBtn.addEventListener('click', () => {
        showSection(uploadSection);
        hideSection(resultSection);
      });
    }
    
    // Preview modal controls
    if (closePreviewBtn) {
      closePreviewBtn.addEventListener('click', () => {
        closePreviewModal();
      });
    }
    
    if (prevSlideBtn) {
      prevSlideBtn.addEventListener('click', () => {
        navigateSlide(-1);
      });
    }
    
    if (nextSlideBtn) {
      nextSlideBtn.addEventListener('click', () => {
        navigateSlide(1);
      });
    }
    
    // Close preview modal when clicking outside
    if (previewModal) {
      previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
          closePreviewModal();
        }
      });
    }
    
    // FAQ items
    if (faqItems) {
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
          question.addEventListener('click', () => {
            toggleFaq(item);
          });
        }
      });
    }
  }
  
  function handleFileUpload(file) {
    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      showNotification('Please upload a PDF file', 'error');
      return;
    }
    
    // Check file size (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      showNotification('File size exceeds 25MB limit', 'error');
      return;
    }
    
    // Set as current file
    currentFile = file;
    
    // Update file info
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    // Generate random page count (for demo)
    const randomPageCount = Math.floor(Math.random() * 15) + 5;
    pageCount.textContent = randomPageCount;
    
    // Start conversion
    startConversion(randomPageCount);
  }
  
  function handleExampleSelection(exampleType) {
    const example = exampleFiles[exampleType];
    if (!example) return;
    
    // Set as current file
    currentFile = {
      name: example.name,
      size: example.size,
      pages: example.pages,
      example: exampleType
    };
    
    // Update file info
    fileName.textContent = example.name;
    fileSize.textContent = example.size;
    pageCount.textContent = example.pages;
    
    // Start conversion
    startConversion(example.pages);
  }
  
  function startConversion(pages) {
    // Show processing section
    hideSection(uploadSection);
    showSection(processingSection);
    
    // Reset progress
    conversionProgress.style.width = '0%';
    progressPercentage.textContent = '0%';
    
    // Show random tip
    conversionTip.textContent = conversionTips[Math.floor(Math.random() * conversionTips.length)];
    
    // Reset steps
    const steps = document.querySelectorAll('.progress-steps .step');
    steps.forEach(step => {
      step.classList.remove('current', 'completed');
    });
    steps[0].classList.add('current');
    
    statusMessage.textContent = 'Analyzing PDF structure';
    
    // Simulate conversion process
    let progress = 0;
    let currentStep = 0;
    const stepMessages = [
      'Analyzing PDF structure',
      'Extracting text and images',
      'Creating slide layouts',
      'Finalizing conversion'
    ];
    
    conversionInterval = setInterval(() => {
      progress += 1;
      
      // Update progress bar
      conversionProgress.style.width = `${progress}%`;
      progressPercentage.textContent = `${progress}%`;
      
      // Update steps when reaching thresholds
      if (progress >= 25 && currentStep < 1) {
        updateStep(steps, 0, 1);
        statusMessage.textContent = stepMessages[1];
        currentStep = 1;
        
        // Show a new tip
        conversionTip.textContent = conversionTips[Math.floor(Math.random() * conversionTips.length)];
      }
      
      if (progress >= 50 && currentStep < 2) {
        updateStep(steps, 1, 2);
        statusMessage.textContent = stepMessages[2];
        currentStep = 2;
        
        // Show a new tip
        conversionTip.textContent = conversionTips[Math.floor(Math.random() * conversionTips.length)];
      }
      
      if (progress >= 75 && currentStep < 3) {
        updateStep(steps, 2, 3);
        statusMessage.textContent = stepMessages[3];
        currentStep = 3;
      }
      
      // Complete conversion
      if (progress >= 100) {
        clearInterval(conversionInterval);
        conversionInterval = null;
        
        // Mark final step as completed
        steps[3].classList.remove('current');
        steps[3].classList.add('completed');
        
        // Show result after a short delay
        setTimeout(() => {
          completeConversion(pages);
        }, 500);
      }
    }, 50);
  }
  
  function updateStep(steps, prevIndex, newIndex) {
    steps[prevIndex].classList.remove('current');
    steps[prevIndex].classList.add('completed');
    steps[newIndex].classList.add('current');
  }
  
  function cancelConversion() {
    if (conversionInterval) {
      clearInterval(conversionInterval);
      conversionInterval = null;
    }
    
    showSection(uploadSection);
    hideSection(processingSection);
    
    showNotification('Conversion cancelled', 'info');
  }
  
  function completeConversion(pages) {
    // If it's an example file
    if (currentFile.example) {
      const example = exampleFiles[currentFile.example];
      
      resultFileName.textContent = currentFile.name.replace('.pdf', '.pptx');
      slideCount.textContent = example.slides;
      resultFileSize.textContent = example.resultSize;
      imageCount.textContent = example.images;
      chartCount.textContent = example.charts;
      textBlockCount.textContent = example.text;
      
      totalSlideCount = example.slides;
    } else {
      // Generate result data for uploaded file
      resultFileName.textContent = currentFile.name.replace('.pdf', '.pptx');
      slideCount.textContent = pages;
      
      // Calculate slightly larger file size for PPT
      const sizeMB = parseFloat(fileSize.textContent);
      const newSizeMB = (sizeMB * 1.15).toFixed(1);
      resultFileSize.textContent = `${newSizeMB} MB`;
      
      // Generate random stats
      imageCount.textContent = Math.floor(Math.random() * 10) + Math.floor(pages * 0.8);
      chartCount.textContent = Math.floor(Math.random() * 5) + Math.floor(pages * 0.3);
      textBlockCount.textContent = Math.floor(Math.random() * 10) + Math.floor(pages * 2);
      
      totalSlideCount = pages;
    }
    
    // Reset slide preview
    currentSlideIndex = 1;
    if (currentSlide) currentSlide.textContent = currentSlideIndex;
    if (totalSlides) totalSlides.textContent = totalSlideCount;
    
    // Show result section
    hideSection(processingSection);
    showSection(resultSection);
    
    showNotification('Conversion completed successfully!', 'success');
  }
  
  function handleDownload() {
    showNotification('Preparing download...', 'info');
    
    setTimeout(() => {
      // Simulate download by creating a temporary link
      const link = document.createElement('a');
      link.href = 'javascript:void(0)';
      link.download = resultFileName.textContent;
      link.click();
      
      showNotification('Download started!', 'success');
    }, 1000);
  }
  
  function openPreviewModal() {
    if (!previewModal) return;
    
    // Update slide preview
    updateSlidePreview();
    
    // Show modal
    previewModal.style.display = 'flex';
  }
  
  function closePreviewModal() {
    if (!previewModal) return;
    previewModal.style.display = 'none';
  }
  
  function navigateSlide(direction) {
    const newIndex = currentSlideIndex + direction;
    
    if (newIndex >= 1 && newIndex <= totalSlideCount) {
      currentSlideIndex = newIndex;
      currentSlide.textContent = currentSlideIndex;
      updateSlidePreview();
    }
  }
  
  function updateSlidePreview() {
    if (!slidePreview) return;
    
    // Create a simple slide preview with slide number
    slidePreview.innerHTML = `
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px;">
        <div style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 15px;">Slide ${currentSlideIndex}</div>
        <div style="width: 80%; height: 20px; background-color: #ddd; margin-bottom: 15px;"></div>
        <div style="width: 60%; height: 15px; background-color: #ddd; margin-bottom: 30px;"></div>
        <div style="display: flex; width: 80%; justify-content: space-between;">
          <div style="width: 45%; height: 120px; background-color: #e6e6e6; border-radius: 5px;"></div>
          <div style="width: 45%; height: 120px; background-color: #e6e6e6; border-radius: 5px;"></div>
        </div>
      </div>
    `;
  }
  
  function toggleFaq(faqItem) {
    const answer = faqItem.querySelector('.faq-answer');
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQs
    faqItems.forEach(item => {
      item.classList.remove('active');
      const itemAnswer = item.querySelector('.faq-answer');
      if (itemAnswer) {
        itemAnswer.style.maxHeight = '0';
      }
    });
    
    // Toggle current FAQ
    if (!isActive && answer) {
      faqItem.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  }
  
  function showNotification(message, type = 'info') {
    if (!notification || !notificationMessage) return;
    
    // Set message
    notificationMessage.textContent = message;
    
    // Set notification type
    notification.className = 'notification';
    notification.classList.add(type);
    
    // Display notification
    notification.style.display = 'block';
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateY(0)';
      notification.style.opacity = '1';
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateY(-20px)';
      notification.style.opacity = '0';
      
      setTimeout(() => {
        notification.style.display = 'none';
      }, 300);
    }, 3000);
  }
  
  function formatFileSize(bytes) {
    if (typeof bytes === 'string') return bytes;
    
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
  
  function showSection(section) {
    if (section) section.style.display = 'block';
  }
  
  function hideSection(section) {
    if (section) section.style.display = 'none';
  }
});