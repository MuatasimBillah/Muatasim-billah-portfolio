document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const converterSection = document.getElementById('converter-section');
    const resultSection = document.getElementById('result-section');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const convertBtn = document.getElementById('convert-btn');
    const resetBtn = document.getElementById('reset-btn');
    const downloadBtn = document.getElementById('download-btn');
    const createNewBtn = document.getElementById('create-new-btn');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const pdfName = document.getElementById('pdf-name');
    const pdfSize = document.getElementById('pdf-size');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationClose = document.getElementById('notification-close');
    
    // Settings
    const pageSizeSelect = document.getElementById('page-size');
    const orientationSelect = document.getElementById('orientation');
    const imageQualitySelect = document.getElementById('image-quality');
    const marginInput = document.getElementById('margin');
    
    // Variables
    let uploadedImages = [];
    let pdfOutput = null;
    
    // Initialize
    initSortable();
    
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
      
      if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
      }
    });
    
    fileInput.addEventListener('change', function() {
      if (fileInput.files.length) {
        handleFiles(fileInput.files);
      }
    });
    
    convertBtn.addEventListener('click', convertToPdf);
    resetBtn.addEventListener('click', resetConverter);
    downloadBtn.addEventListener('click', downloadPdf);
    createNewBtn.addEventListener('click', resetConverter);
    notificationClose.addEventListener('click', closeNotification);
    
    // Functions
    function initSortable() {
      new Sortable(imagePreviewContainer, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onEnd: function() {
          // Update the uploadedImages array based on the new order
          const imageElements = imagePreviewContainer.querySelectorAll('.image-preview');
          const newOrder = [];
          
          imageElements.forEach(element => {
            const index = element.dataset.index;
            newOrder.push(uploadedImages[index]);
          });
          
          uploadedImages = newOrder;
          refreshImagePreviews();
        }
      });
    }
    
    function handleFiles(files) {
      const validFiles = Array.from(files).filter(file => {
        const fileType = file.type.toLowerCase();
        return fileType === 'image/jpeg' || fileType === 'image/jpg';
      });
      
      if (validFiles.length === 0) {
        showNotification('Please select JPG/JPEG images only.', 'error');
        return;
      }
      
      // Check maximum number of files
      if (uploadedImages.length + validFiles.length > 20) {
        showNotification('You can only upload a maximum of 20 images at once.', 'warning');
        return;
      }
      
      // Check file size
      const oversizedFiles = validFiles.filter(file => file.size > 5 * 1024 * 1024); // 5MB
      if (oversizedFiles.length > 0) {
        showNotification('Some files exceed the maximum size of 5MB and will not be uploaded.', 'warning');
      }
      
      // Read and add valid files that are under the size limit
      const validSizeFiles = validFiles.filter(file => file.size <= 5 * 1024 * 1024);
      
      if (validSizeFiles.length === 0) {
        return;
      }
      
      // Show progress
      progressContainer.style.display = 'block';
      updateProgress(0, 'Loading images...');
      
      let loadedImages = 0;
      
      validSizeFiles.forEach((file, index) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          uploadedImages.push({
            file: file,
            dataUrl: e.target.result,
            name: file.name
          });
          
          loadedImages++;
          updateProgress(Math.round((loadedImages / validSizeFiles.length) * 100), 'Loading images...');
          
          if (loadedImages === validSizeFiles.length) {
            refreshImagePreviews();
            converterSection.style.display = 'block';
            fileInput.value = '';
            progressContainer.style.display = 'none';
            
            // Hide the upload section when images are loaded
            document.querySelector('.upload-section').style.display = 'none';
            
            showNotification(`${loadedImages} images uploaded successfully!`, 'success');
          }
        };
        
        reader.onerror = function() {
          showNotification('Error reading file. Please try again.', 'error');
        };
        
        reader.readAsDataURL(file);
      });
    }
    
    function refreshImagePreviews() {
      imagePreviewContainer.innerHTML = '';
      
      uploadedImages.forEach((image, index) => {
        const previewElement = document.createElement('div');
        previewElement.classList.add('image-preview');
        previewElement.dataset.index = index;
        
        previewElement.innerHTML = `
          <img src="${image.dataUrl}" alt="${image.name}">
          <div class="preview-number">${index + 1}</div>
          <div class="preview-overlay">
            <div class="preview-controls">
              <button class="preview-control-btn remove-btn" title="Remove Image">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
        
        const removeBtn = previewElement.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          removeImage(index);
        });
        
        imagePreviewContainer.appendChild(previewElement);
      });
    }
    
    function removeImage(index) {
      uploadedImages.splice(index, 1);
      
      if (uploadedImages.length === 0) {
        resetConverter();
        return;
      }
      
      refreshImagePreviews();
    }
    
    function convertToPdf() {
      if (uploadedImages.length === 0) {
        showNotification('Please upload at least one image.', 'warning');
        return;
      }
      
      // Show progress
      progressContainer.style.display = 'block';
      updateProgress(0, 'Preparing PDF...');
      
      // Get settings
      const pageSize = pageSizeSelect.value;
      const orientation = orientationSelect.value;
      const quality = getQualityValue(imageQualitySelect.value);
      const margin = parseInt(marginInput.value) || 0;
      
      // Create PDF
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);
      
      // Create async process for adding images
      let currentPage = 0;
      const totalImages = uploadedImages.length;
      
      function addImageToPdf(index) {
        if (index >= totalImages) {
          // All images have been added
          finalizePdf(pdf);
          return;
        }
        
        const image = uploadedImages[index];
        
        // Create temp image to get dimensions
        const img = new Image();
        img.src = image.dataUrl;
        
        img.onload = function() {
          // Calculate dimensions to fit content area while maintaining aspect ratio
          let imgWidth = contentWidth;
          let imgHeight = (img.height * contentWidth) / img.width;
          
          if (imgHeight > contentHeight) {
            imgHeight = contentHeight;
            imgWidth = (img.width * contentHeight) / img.height;
          }
          
          // Add new page if not the first image
          if (index > 0) {
            pdf.addPage();
          }
          
          // Calculate positions to center the image
          const x = margin + (contentWidth - imgWidth) / 2;
          const y = margin + (contentHeight - imgHeight) / 2;
          
          // Add image to page
          pdf.addImage(image.dataUrl, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST', quality);
          
          // Update progress
          currentPage++;
          updateProgress(Math.round((currentPage / totalImages) * 100), `Converting image ${currentPage} of ${totalImages}`);
          
          // Process next image
          setTimeout(() => {
            addImageToPdf(index + 1);
          }, 100); // Small delay to keep UI responsive
        };
        
        img.onerror = function() {
          showNotification(`Error loading image: ${image.name}`, 'error');
          // Skip to next image
          currentPage++;
          addImageToPdf(index + 1);
        };
      }
      
      // Start adding images
      addImageToPdf(0);
    }
    
    function finalizePdf(pdf) {
      // Get PDF as blob
      pdfOutput = pdf.output('blob');
      
      // Format file size
      const fileSizeKB = Math.round(pdfOutput.size / 1024);
      let fileSizeText = `${fileSizeKB} KB`;
      
      if (fileSizeKB > 1024) {
        const fileSizeMB = (fileSizeKB / 1024).toFixed(2);
        fileSizeText = `${fileSizeMB} MB`;
      }
      
      // Update result section
      const fileName = generateFileName();
      pdfName.textContent = fileName;
      pdfSize.textContent = fileSizeText;
      
      // Show result section
      converterSection.style.display = 'none';
      resultSection.style.display = 'block';
      progressContainer.style.display = 'none';
      
      showNotification('PDF created successfully!', 'success');
    }
    
    function downloadPdf() {
      if (!pdfOutput) {
        showNotification('No PDF available for download.', 'error');
        return;
      }
      
      const fileName = generateFileName();
      const url = URL.createObjectURL(pdfOutput);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      showNotification('PDF downloaded successfully!', 'success');
    }
    
    function resetConverter() {
      uploadedImages = [];
      pdfOutput = null;
      fileInput.value = '';
      
      document.querySelector('.upload-section').style.display = 'block';
      converterSection.style.display = 'none';
      resultSection.style.display = 'none';
      progressContainer.style.display = 'none';
      imagePreviewContainer.innerHTML = '';
    }
    
    function updateProgress(percent, message) {
      progressBar.style.width = `${percent}%`;
      progressText.textContent = message ? message : `Processing: ${percent}%`;
    }
    
    function generateFileName() {
      if (uploadedImages.length === 1) {
        // Use the original filename if only one image
        const originalName = uploadedImages[0].name;
        return originalName.replace(/\.[^.]+$/, '.pdf');
      } else {
        // Generate a default name
        const date = new Date();
        const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        return `document-${dateStr}.pdf`;
      }
    }
    
    function getQualityValue(quality) {
      switch (quality) {
        case 'high':
          return 'MEDIUM';
        case 'medium':
          return 'FAST';
        case 'low':
          return 'SLOW';
        default:
          return 'FAST';
      }
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