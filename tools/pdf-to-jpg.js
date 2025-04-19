document.addEventListener('DOMContentLoaded', function() {
    // Set PDF.js worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    
    // DOM Elements
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const converterSection = document.getElementById('converter-section');
    const resultSection = document.getElementById('result-section');
    const pdfName = document.getElementById('pdf-name');
    const pdfSize = document.getElementById('pdf-size');
    const pageCount = document.getElementById('page-count');
    const pageThumbnails = document.getElementById('page-thumbnails');
    const selectAllBtn = document.getElementById('select-all-btn');
    const selectNoneBtn = document.getElementById('select-none-btn');
    const convertBtn = document.getElementById('convert-btn');
    const resetBtn = document.getElementById('reset-btn');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const convertNewBtn = document.getElementById('convert-new-btn');
    const convertedCount = document.getElementById('converted-count');
    const imagePreviewGrid = document.getElementById('image-preview-grid');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationClose = document.getElementById('notification-close');
    
    // Options elements
    const imageQualitySelect = document.getElementById('image-quality');
    const formatSelect = document.getElementById('format');
    const downloadOptionSelect = document.getElementById('download-option');
    
    // Variables
    let pdfDocument = null;
    let pdfFile = null;
    let selectedPages = new Set();
    let convertedImages = [];
    
    // Event Listeners
    uploadArea.addEventListener('click', function() {
      fileInput.click();
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
      
      if (e.dataTransfer.files.length && e.dataTransfer.files[0].type === 'application/pdf') {
        handleFile(e.dataTransfer.files[0]);
      } else {
        showNotification('Please select a valid PDF file.', 'error');
      }
    });
    
    fileInput.addEventListener('change', function() {
      if (fileInput.files.length && fileInput.files[0].type === 'application/pdf') {
        handleFile(fileInput.files[0]);
      } else {
        showNotification('Please select a valid PDF file.', 'error');
      }
    });
    
    selectAllBtn.addEventListener('click', selectAllPages);
    selectNoneBtn.addEventListener('click', deselectAllPages);
    convertBtn.addEventListener('click', convertToImages);
    resetBtn.addEventListener('click', resetConverter);
    downloadAllBtn.addEventListener('click', downloadAllImages);
    convertNewBtn.addEventListener('click', resetConverter);
    notificationClose.addEventListener('click', closeNotification);
    
    // Functions
    function handleFile(file) {
      // Check file size
      if (file.size > 50 * 1024 * 1024) { // 50MB
        showNotification('File size exceeds the maximum limit of 50MB.', 'error');
        return;
      }
      
      pdfFile = file;
      
      // Update UI with file information
      pdfName.textContent = file.name;
      
      // Format file size
      const fileSizeKB = Math.round(file.size / 1024);
      let fileSizeText = `${fileSizeKB} KB`;
      
      if (fileSizeKB > 1024) {
        const fileSizeMB = (fileSizeKB / 1024).toFixed(2);
        fileSizeText = `${fileSizeMB} MB`;
      }
      
      pdfSize.textContent = fileSizeText;
      
      // Load PDF
      loadPdf(file);
      
      // Show converter section
      document.querySelector('.upload-section').style.display = 'none';
      converterSection.style.display = 'block';
    }
    
    function loadPdf(file) {
      const fileReader = new FileReader();
      
      fileReader.onload = function() {
        const typedArray = new Uint8Array(this.result);
        
        pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
          pdfDocument = pdf;
          pageCount.textContent = pdf.numPages;
          
          // Clear and add loading indicator
          pageThumbnails.innerHTML = `
            <div class="loading-pages">
              <div class="spinner"></div>
              <p>Loading PDF pages...</p>
            </div>
          `;
          
          // Generate thumbnails
          generateThumbnails(pdf);
        }).catch(function(error) {
          console.error('Error loading PDF:', error);
          showNotification('Error loading PDF. Please try another file.', 'error');
        });
      };
      
      fileReader.readAsArrayBuffer(file);
    }
    
    function generateThumbnails(pdf) {
      const totalPages = pdf.numPages;
      let loadedCount = 0;
      const fragments = document.createDocumentFragment();
      
      for (let i = 1; i <= totalPages; i++) {
        pdf.getPage(i).then(function(page) {
          const viewport = page.getViewport({ scale: 0.3 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          
          page.render(renderContext).promise.then(function() {
            const thumbnailContainer = document.createElement('div');
            thumbnailContainer.className = 'page-thumbnail';
            thumbnailContainer.dataset.page = i;
            
            const img = document.createElement('img');
            img.src = canvas.toDataURL();
            
            const pageNumberElement = document.createElement('div');
            pageNumberElement.className = 'page-number';
            pageNumberElement.textContent = i;
            
            thumbnailContainer.appendChild(img);
            thumbnailContainer.appendChild(pageNumberElement);
            
            thumbnailContainer.addEventListener('click', function() {
              togglePageSelection(this);
            });
            
            fragments.appendChild(thumbnailContainer);
            
            loadedCount++;
            if (loadedCount === totalPages) {
              pageThumbnails.innerHTML = '';
              pageThumbnails.appendChild(fragments);
              
              // Select all pages by default
              selectAllPages();
            }
          });
        });
      }
    }
    
    function togglePageSelection(thumbnailElement) {
      const pageNumber = parseInt(thumbnailElement.dataset.page);
      
      if (selectedPages.has(pageNumber)) {
        selectedPages.delete(pageNumber);
        thumbnailElement.classList.remove('selected');
      } else {
        selectedPages.add(pageNumber);
        thumbnailElement.classList.add('selected');
      }
      
      updateConvertButton();
    }
    
    function selectAllPages() {
      const thumbnails = pageThumbnails.querySelectorAll('.page-thumbnail');
      thumbnails.forEach(thumbnail => {
        const pageNumber = parseInt(thumbnail.dataset.page);
        selectedPages.add(pageNumber);
        thumbnail.classList.add('selected');
      });
      
      updateConvertButton();
    }
    
    function deselectAllPages() {
      const thumbnails = pageThumbnails.querySelectorAll('.page-thumbnail');
      thumbnails.forEach(thumbnail => {
        const pageNumber = parseInt(thumbnail.dataset.page);
        selectedPages.delete(pageNumber);
        thumbnail.classList.remove('selected');
      });
      
      updateConvertButton();
    }
    
    function updateConvertButton() {
      if (selectedPages.size > 0) {
        convertBtn.disabled = false;
      } else {
        convertBtn.disabled = true;
      }
    }
    
    function convertToImages() {
      if (selectedPages.size === 0) {
        showNotification('Please select at least one page to convert.', 'warning');
        return;
      }
      
      // Show progress
      progressContainer.style.display = 'block';
      updateProgress(0, `Preparing to convert ${selectedPages.size} pages...`);
      
      // Get options
      const quality = getQualityValue(imageQualitySelect.value);
      const format = formatSelect.value;
      
      // Sort selected pages
      const sortedSelectedPages = Array.from(selectedPages).sort((a, b) => a - b);
      
      // Reset converted images
      convertedImages = [];
      
      // Start conversion
      let convertedCount = 0;
      
      for (let i = 0; i < sortedSelectedPages.length; i++) {
        const pageNumber = sortedSelectedPages[i];
        
        pdfDocument.getPage(pageNumber).then(function(page) {
          // Determine scale based on quality
          let scale;
          switch (quality) {
            case 'high':
              scale = 3.0;
              break;
            case 'medium':
              scale = 1.5;
              break;
            case 'low':
              scale = 0.8;
              break;
            default:
              scale = 1.5;
          }
          
          const viewport = page.getViewport({ scale: scale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          
          page.render(renderContext).promise.then(function() {
            let imgDataUrl;
            
            if (format === 'jpg') {
              imgDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            } else {
              imgDataUrl = canvas.toDataURL('image/png');
            }
            
            convertedImages.push({
              dataUrl: imgDataUrl,
              pageNumber: pageNumber,
              name: `page-${pageNumber}.${format}`
            });
            
            convertedCount++;
            updateProgress(Math.round((convertedCount / sortedSelectedPages.length) * 100), `Converting page ${convertedCount} of ${sortedSelectedPages.length}`);
            
            if (convertedCount === sortedSelectedPages.length) {
              // Sort by page number
              convertedImages.sort((a, b) => a.pageNumber - b.pageNumber);
              
              // Show results
              showConversionResults();
            }
          });
        });
      }
    }
    
    function showConversionResults() {
      // Update converted count
      document.getElementById('converted-count').textContent = convertedImages.length;
      
      // Clear image grid
      imagePreviewGrid.innerHTML = '';
      
      // Add image previews
      convertedImages.forEach((image, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'image-preview-item';
        
        previewItem.innerHTML = `
          <img src="${image.dataUrl}" alt="Page ${image.pageNumber}">
          <div class="page-number">${image.pageNumber}</div>
          <button class="image-download-btn" data-index="${index}" title="Download this image">
            <i class="fas fa-download"></i>
          </button>
        `;
        
        const downloadBtn = previewItem.querySelector('.image-download-btn');
        downloadBtn.addEventListener('click', function() {
          const imageIndex = parseInt(this.dataset.index);
          downloadSingleImage(imageIndex);
        });
        
        imagePreviewGrid.appendChild(previewItem);
      });
      
      // Show result section
      converterSection.style.display = 'none';
      resultSection.style.display = 'block';
      progressContainer.style.display = 'none';
      
      showNotification(`Successfully converted ${convertedImages.length} pages to ${formatSelect.value.toUpperCase()} images.`, 'success');
    }
    
    function downloadSingleImage(index) {
      const image = convertedImages[index];
      
      // Convert data URL to Blob
      const byteString = atob(image.dataUrl.split(',')[1]);
      const mimeString = image.dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      saveAs(blob, image.name);
      
      showNotification(`Downloading ${image.name}`, 'success');
    }
    
    function downloadAllImages() {
      if (convertedImages.length === 0) {
        showNotification('No images to download.', 'error');
        return;
      }
      
      const downloadOption = downloadOptionSelect.value;
      
      if (downloadOption === 'zip' && convertedImages.length > 1) {
        // Show progress
        progressContainer.style.display = 'block';
        updateProgress(0, 'Preparing ZIP archive...');
        
        // Create ZIP file
        const zip = new JSZip();
        
        // Add images to ZIP
        convertedImages.forEach((image, index) => {
          const imageData = image.dataUrl.split(',')[1];
          zip.file(image.name, imageData, { base64: true });
          updateProgress(Math.round(((index + 1) / convertedImages.length) * 80), 'Adding images to ZIP...');
        });
        
        // Generate ZIP file
        zip.generateAsync({ type: 'blob' }, function(metadata) {
          updateProgress(80 + Math.round(metadata.percent * 0.2), 'Generating ZIP file...');
        }).then(function(content) {
          // Download ZIP file
          const zipFileName = pdfFile.name.replace('.pdf', '') + '-images.zip';
          saveAs(content, zipFileName);
          
          progressContainer.style.display = 'none';
          showNotification(`Downloading ${convertedImages.length} images as ZIP archive.`, 'success');
        });
      } else {
        // Download individual images
        convertedImages.forEach((image, index) => {
          setTimeout(() => {
            downloadSingleImage(index);
          }, index * 500); // Add delay to prevent browser from blocking multiple downloads
        });
        
        showNotification(`Downloading ${convertedImages.length} images...`, 'success');
      }
    }
    
    function resetConverter() {
      // Reset variables
      pdfDocument = null;
      pdfFile = null;
      selectedPages = new Set();
      convertedImages = [];
      
      // Reset UI
      fileInput.value = '';
      document.querySelector('.upload-section').style.display = 'block';
      converterSection.style.display = 'none';
      resultSection.style.display = 'none';
      progressContainer.style.display = 'none';
      pageThumbnails.innerHTML = '';
    }
    
    function getQualityValue(quality) {
      switch (quality) {
        case 'high':
          return 300;
        case 'medium':
          return 150;
        case 'low':
          return 72;
        default:
          return 150;
      }
    }
    
    function updateProgress(percent, message) {
      progressBar.style.width = `${percent}%`;
      progressText.textContent = message ? message : `Processing: ${percent}%`;
    }
    
    function showNotification(message, type = 'info') {
      notificationMessage.textContent = message;
      notification.className = 'notification show';
      
      if (type) {
        notification.classList.add(type);
      }
      
      setTimeout(closeNotification, 5000);
    }
    
    function closeNotification() {
      notification.classList.remove('show');
    }
  });