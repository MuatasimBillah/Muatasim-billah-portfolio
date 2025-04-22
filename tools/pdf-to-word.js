/**
 * PDF to Word Converter Tool
 * Client-side JavaScript for browser-based PDF to Word conversion
 * All processing happens in the browser - no server uploads
 * Optimized for fast processing and better user experience
 * 
 * Dependencies:
 * - PDF.js for parsing PDFs
 * - docx.js for creating Word documents
 * - FileSaver.js for downloading files
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set PDF.js worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    
    // DOM Elements
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const uploadSection = document.getElementById('upload-section');
    const processingSection = document.getElementById('processing-section');
    const resultSection = document.getElementById('result-section');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const pageCount = document.getElementById('page-count');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const resultFileName = document.getElementById('result-file-name');
    const resultFileSize = document.getElementById('result-file-size');
    const downloadBtn = document.getElementById('download-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const convertNewBtn = document.getElementById('convert-new-btn');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationClose = document.getElementById('notification-close');
    const faqItems = document.querySelectorAll('.faq-item');
    const scrollToToolBtn = document.getElementById('scroll-to-tool-btn');
    
    // Variables
    let pdfFile = null;
    let pdfDocument = null;
    let docxBlob = null;
    let conversionCancelled = false;
    let objectUrl = null;
    
    // Initialize
    initFaqToggles();
    
    // Event Listeners
    uploadArea.addEventListener('click', function() {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
      if (fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
      }
    });
    
    uploadArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
      uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      
      if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
    
    downloadBtn.addEventListener('click', function() {
      if (docxBlob) {
        saveAs(docxBlob, getDocxFilename(pdfFile.name));
        
        // Track download event if analytics is available
        try {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
              'event_category': 'PDF to Word',
              'event_label': pdfFile.name
            });
          }
        } catch (e) {
          console.log('Analytics not available');
        }
      }
    });
    
    cancelBtn.addEventListener('click', function() {
      conversionCancelled = true;
      resetConverter();
    });
    
    convertNewBtn.addEventListener('click', resetConverter);
    
    notificationClose.addEventListener('click', function() {
      notification.classList.remove('show');
    });
    
    if (scrollToToolBtn) {
      scrollToToolBtn.addEventListener('click', function() {
        uploadSection.scrollIntoView({ behavior: 'smooth' });
      });
    }
    
    // Functions
    
    /**
     * Initialize FAQ toggles
     */
    function initFaqToggles() {
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
          // Close all other FAQs
          faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
              otherItem.classList.remove('active');
            }
          });
          
          // Toggle current FAQ
          item.classList.toggle('active');
        });
      });
    }
    
    /**
     * Handle the uploaded file
     */
    function handleFile(file) {
      // Show immediate feedback
      progressBar.style.width = '2%';
      progressText.textContent = 'Checking file... 2%';
      
      // Check if file is a PDF (quick check by extension)
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        showNotification('Please upload a PDF file.', 'error');
        return;
      }
      
      // Check file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        showNotification('File size exceeds the 100MB limit.', 'error');
        return;
      }
      
      // Store the file
      pdfFile = file;
      
      // Update UI with file info immediately
      fileName.textContent = file.name;
      fileSize.textContent = formatFileSize(file.size);
      
      // Move to processing section
      switchSection(processingSection);
      
      // Begin processing with minimal delay
      setTimeout(() => {
        processPdf(file);
      }, 10);
    }
    
    /**
     * Process the PDF file with optimizations
     */
    function processPdf(file) {
      // Create object URL for faster access
      objectUrl = URL.createObjectURL(file);
      
      // Update progress immediately
      updateProgress(5);
      
      // Load the PDF with optimized settings
      const loadingTask = pdfjsLib.getDocument({
        url: objectUrl,
        cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
        cMapPacked: true,
        disableFontFace: true, // Faster loading
        nativeImageDecoderSupport: 'display', // Optimize image handling
        ignoreErrors: true // Continue despite minor errors
      });
      
      loadingTask.onProgress = function(progressData) {
        if (progressData.total > 0) {
          const percent = Math.round((progressData.loaded / progressData.total) * 15) + 5;
          updateProgress(percent);
        }
      };
      
      loadingTask.promise.then(function(pdf) {
        if (conversionCancelled) {
          cleanupResources();
          return;
        }
        
        pdfDocument = pdf;
        pageCount.textContent = pdf.numPages + ' pages';
        updateProgress(20);
        
        // Process pages in batches for better performance
        const totalPages = pdf.numPages;
        const batchSize = Math.min(5, totalPages); // Process up to 5 pages at a time
        let extractedText = new Array(totalPages);
        let completedPages = 0;
        
        // Start processing batches
        processBatch(1);
        
        // Process a batch of pages
        function processBatch(startPage) {
          if (conversionCancelled) {
            cleanupResources();
            return;
          }
          
          const endPage = Math.min(startPage + batchSize - 1, totalPages);
          let batchPromises = [];
          
          // Create promises for each page in the batch
          for (let i = startPage; i <= endPage; i++) {
            batchPromises.push(processPage(i));
          }
          
          // Wait for all pages in batch to complete
          Promise.all(batchPromises).then(() => {
            completedPages += batchPromises.length;
            const progressPercent = Math.floor((completedPages / totalPages) * 30) + 20;
            updateProgress(progressPercent);
            
            // Continue with next batch or finish
            if (endPage < totalPages) {
              // Use setTimeout to prevent UI freezing
              setTimeout(() => {
                processBatch(endPage + 1);
              }, 0);
            } else {
              // All pages processed, create Word document
              createWordDocument(extractedText.filter(Boolean));
            }
          }).catch(error => {
            console.error('Error processing batch', error);
            showNotification('Error processing PDF pages.', 'error');
            resetConverter();
          });
        }
        
        // Process a single page
        function processPage(pageNum) {
          return new Promise((resolve) => {
            pdf.getPage(pageNum).then(function(page) {
              // Extract text content
              page.getTextContent({
                normalizeWhitespace: true, // Optimize text extraction
                disableCombineTextItems: false
              }).then(function(textContent) {
                let lastY;
                let text = '';
                
                // Combine text items into paragraphs based on positioning
                for (let i = 0; i < textContent.items.length; i++) {
                  const item = textContent.items[i];
                  
                  if (lastY == item.transform[5] || !lastY) {
                    text += item.str;
                  } else {
                    text += '\n' + item.str;
                  }
                  
                  lastY = item.transform[5];
                }
                
                extractedText[pageNum - 1] = text;
                resolve();
              }).catch(() => {
                // Continue despite errors in text extraction
                extractedText[pageNum - 1] = '';
                resolve();
              });
            }).catch(() => {
              // Continue despite errors in page loading
              extractedText[pageNum - 1] = '';
              resolve();
            });
          });
        }
      }).catch(function(error) {
        console.error('Error loading PDF', error);
        showNotification('Error loading the PDF. The file might be corrupted or password protected.', 'error');
        resetConverter();
      });
    }
    
    /**
     * Create Word document from extracted text with optimizations
     */
    function createWordDocument(pages) {
      if (conversionCancelled) {
        cleanupResources();
        return;
      }
      
      updateProgress(55);
      
      // Optimize docx creation by using web workers if available
      const useWorker = typeof Worker !== 'undefined';
      
      if (useWorker) {
        // Progressive progress updates while creating document
        const progressInterval = setInterval(() => {
          const currentProgress = parseInt(progressBar.style.width);
          if (currentProgress < 85) {
            updateProgress(currentProgress + 1);
          }
        }, 200);
        
        try {
          // Use setTimeout to prevent UI blocking
          setTimeout(() => {
            // Create a new Word document with optimized settings
            const doc = new docx.Document({
              sections: [{
                properties: {},
                children: createDocumentContent(pages)
              }]
            });
            
            // Generate the document
            docx.Packer.toBlob(doc).then(blob => {
              clearInterval(progressInterval);
              
              if (conversionCancelled) {
                cleanupResources();
                return;
              }
              
              completeConversion(blob);
            }).catch(error => {
              clearInterval(progressInterval);
              console.error('Error creating Word document', error);
              showNotification('Error creating the Word document.', 'error');
              resetConverter();
            });
          }, 10);
        } catch (error) {
          clearInterval(progressInterval);
          console.error('Error in document creation', error);
          showNotification('Error creating the document.', 'error');
          resetConverter();
        }
      } else {
        // Fallback for browsers without worker support
        try {
          const doc = new docx.Document({
            sections: [{
              properties: {},
              children: createDocumentContent(pages)
            }]
          });
          
          docx.Packer.toBlob(doc).then(blob => {
            completeConversion(blob);
          }).catch(error => {
            console.error('Error creating Word document', error);
            showNotification('Error creating the Word document.', 'error');
            resetConverter();
          });
        } catch (error) {
          console.error('Error in document creation', error);
          showNotification('Error creating the document.', 'error');
          resetConverter();
        }
      }
    }
    
    /**
     * Create document content from pages
     */
    function createDocumentContent(pages) {
      const children = [];
      
      // Process each page
      pages.forEach((pageText, index) => {
        // Split text into paragraphs
        const paragraphs = pageText.split('\n').filter(p => p.trim() !== '');
        
        // Add each paragraph to the document
        paragraphs.forEach(text => {
          children.push(new docx.Paragraph({
            children: [new docx.TextRun({ text: text })]
          }));
        });
        
        // Add page break if not the last page
        if (index < pages.length - 1) {
          children.push(new docx.Paragraph({
            children: [],
            pageBreakBefore: true
          }));
        }
      });
      
      return children;
    }
    
    /**
     * Complete the conversion process
     */
    function completeConversion(blob) {
      docxBlob = blob;
      resultFileName.textContent = getDocxFilename(pdfFile.name);
      resultFileSize.textContent = formatFileSize(blob.size);
      
      updateProgress(100);
      
      // Cleanup resources
      cleanupResources();
      
      // Show completion after a short delay
      setTimeout(() => {
        switchSection(resultSection);
      }, 300);
      
      // Show success notification
      showNotification('Conversion completed successfully!', 'success');
    }
    
    /**
     * Clean up resources
     */
    function cleanupResources() {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
    }
    
    /**
     * Reset the converter state
     */
    function resetConverter() {
      // Clean up resources
      cleanupResources();
      
      // Reset state variables
      pdfFile = null;
      pdfDocument = null;
      docxBlob = null;
      conversionCancelled = false;
      
      // Reset UI
      fileInput.value = '';
      progressBar.style.width = '0%';
      progressText.textContent = 'Processing... 0%';
      
      // Go back to upload section
      switchSection(uploadSection);
    }
    
    /**
     * Switch between sections
     */
    function switchSection(sectionToShow) {
      // Hide all sections
      uploadSection.classList.remove('section-active');
      processingSection.classList.remove('section-active');
      resultSection.classList.remove('section-active');
      
      // Show the specified section
      sectionToShow.classList.add('section-active');
    }
    
    /**
     * Update progress bar and text
     */
    function updateProgress(percent) {
      percent = Math.min(100, Math.max(0, percent)); // Ensure between 0-100
      progressBar.style.width = percent + '%';
      progressText.textContent = 'Processing... ' + percent + '%';
    }
    
    /**
     * Generate Word filename from PDF filename
     */
    function getDocxFilename(pdfFilename) {
      return pdfFilename.replace(/\.pdf$/i, '') + '.docx';
    }
    
    /**
     * Format file size for display
     */
    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' bytes';
      else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      else return (bytes / 1048576).toFixed(2) + ' MB';
    }
    
    /**
     * Show notification
     */
    function showNotification(message, type = 'info') {
      notificationMessage.textContent = message;
      
      const notificationIcon = notification.querySelector('.notification-icon');
      notificationIcon.className = 'notification-icon fas';
      
      if (type === 'error') {
        notificationIcon.classList.add('fa-exclamation-circle');
        notification.style.borderLeft = '4px solid var(--danger)';
        notificationIcon.style.color = 'var(--danger)';
      } else if (type === 'success') {
        notificationIcon.classList.add('fa-check-circle');
        notification.style.borderLeft = '4px solid var(--success)';
        notificationIcon.style.color = 'var(--success)';
      } else {
        notificationIcon.classList.add('fa-info-circle');
        notification.style.borderLeft = '4px solid var(--primary)';
        notificationIcon.style.color = 'var(--primary)';
      }
      
      notification.classList.add('show');
      
      // Hide notification after 5 seconds
      setTimeout(function() {
        notification.classList.remove('show');
      }, 5000);
    }
  });