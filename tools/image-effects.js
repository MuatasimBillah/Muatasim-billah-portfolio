/**
 * Image Effects Studio - Advanced client-side image editor
 * All processing happens in your browser - no server uploads required
 * Created for Mehar Designer Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Main Sections
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const browseBtn = document.getElementById('browseBtn');
    const uploadSection = document.getElementById('uploadSection');
    const editorSection = document.getElementById('editorSection');
    const backToUpload = document.getElementById('backToUpload');
    
    // Image Display Elements
    const previewImage = document.getElementById('previewImage');
    const previewWrapper = document.getElementById('previewWrapper');
    const imageName = document.getElementById('imageName');
    const imageSize = document.getElementById('imageSize');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    // Tab Navigation Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Zoom and History Controls
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const zoomLevel = document.getElementById('zoomLevel');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const compareBtn = document.getElementById('compareBtn');
    const comparisonSlider = document.getElementById('comparisonSlider');
    
    // Adjustment Controls
    const allSliders = document.querySelectorAll('input[type="range"][data-control]');
    
    // Filter Elements
    const filterItems = document.querySelectorAll('.filter-item');
    const filterStrengthSlider = document.getElementById('filterStrengthSlider');
    const filterStrengthValue = document.getElementById('filterStrengthValue');
    
    // Effect Elements
    const effectItems = document.querySelectorAll('.effect-item');
    const effectControls = document.querySelectorAll('.effect-control');
    
    // Crop Controls
    const aspectBtns = document.querySelectorAll('.aspect-btn');
    const applyCropBtn = document.getElementById('applyCrop');
    const cancelCropBtn = document.getElementById('cancelCrop');
    
    // Action Buttons
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadOptions = document.getElementById('downloadOptions');
    const downloadMenu = document.getElementById('downloadMenu');
    const downloadItems = document.querySelectorAll('.dropdown-item');
    
    // Notification
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    
    // State Variables
    let originalImage = null;  // Original uploaded image data
    let editHistory = [];      // History of edits for undo/redo
    let historyIndex = -1;     // Current position in history
    let currentZoom = 1;       // Current zoom level
    let currentFilter = 'none'; // Current selected filter
    let currentEffect = 'none'; // Current selected effect
    let isDragging = false;    // For drag/pan functionality
    let isComparing = false;   // For before/after comparison
    let comparePosition = 0.5; // Position of comparison slider
    let dragStartX, dragStartY, viewportScrollLeft, viewportScrollTop; // For panning
    
    // For crop functionality
    let cropActive = false;
    let cropAspectRatio = 'free';
    let cropStartX, cropStartY, cropEndX, cropEndY;
    let cropBox = null;
    let originalImageWidth, originalImageHeight;
    let isCropping = false;
    let cropSelection = { x: 0, y: 0, width: 0, height: 0 };
    
    // Default filter and effect values
    const defaultSettings = {
      // Basic adjustments
      brightness: 0,
      contrast: 0,
      saturation: 0, 
      exposure: 0,
      
      // Color adjustments
      temperature: 0,
      tint: 0,
      vibrance: 0,
      
      // Detail adjustments
      clarity: 0,
      sharpen: 0,
      noiseReduce: 0,
      
      // Filter
      filterName: 'none',
      filterStrength: 100,
      
      // Effect
      effectName: 'none',
      
      // Effect specific settings
      vignette: {
        amount: 50,
        size: 50
      },
      blur: {
        amount: 5
      },
      blurEdges: {
        amount: 5,
        size: 30
      },
      noise: {
        amount: 15
      },
      duotone: {
        color1: '#7000ff',
        color2: '#00d9ff'
      },
      glitch: {
        amount: 50
      },
      pixelate: {
        amount: 10
      }
    };
    
    //------------------------------------
    // UTILITY FUNCTIONS
    //------------------------------------
    
    /**
     * Format file size for display
     */
    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1048576).toFixed(1) + ' MB';
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
     * Show loading indicator
     */
    function showLoading() {
      loadingIndicator.classList.add('active');
    }
    
    /**
     * Hide loading indicator
     */
    function hideLoading() {
      loadingIndicator.classList.remove('active');
    }
    
    /**
     * Add state to history
     */
    function addToHistory() {
      // If we're not at the end of history, remove forward entries
      if (historyIndex < editHistory.length - 1) {
        editHistory = editHistory.slice(0, historyIndex + 1);
      }
      
      // Create a new state object
      const newState = {
        // Basic adjustments
        brightness: document.getElementById('brightnessSlider').value,
        contrast: document.getElementById('contrastSlider').value,
        saturation: document.getElementById('saturationSlider').value,
        exposure: document.getElementById('exposureSlider').value,
        
        // Color adjustments
        temperature: document.getElementById('temperatureSlider').value,
        tint: document.getElementById('tintSlider').value,
        vibrance: document.getElementById('vibranceSlider').value,
        
        // Detail adjustments
        clarity: document.getElementById('claritySlider').value,
        sharpen: document.getElementById('sharpenSlider').value,
        noiseReduce: document.getElementById('noiseReduceSlider').value,
        
        // Filter settings
        filterName: currentFilter,
        filterStrength: filterStrengthSlider.value,
        
        // Effect settings
        effectName: currentEffect,
        
        // Effect specific settings (capture only if applicable)
        ...(currentEffect === 'vignette' && {
          vignette: {
            amount: document.getElementById('vignetteAmountSlider').value,
            size: document.getElementById('vignetteSizeSlider').value
          }
        }),
        ...(currentEffect === 'blur' && {
          blur: {
            amount: document.getElementById('blurAmountSlider').value
          }
        }),
        ...(currentEffect === 'blur-edges' && {
          blurEdges: {
            amount: document.getElementById('blurEdgesAmountSlider').value,
            size: document.getElementById('blurEdgesSizeSlider').value
          }
        }),
        ...(currentEffect === 'noise' && {
          noise: {
            amount: document.getElementById('noiseAmountSlider').value
          }
        }),
        ...(currentEffect === 'duotone' && {
          duotone: {
            color1: document.getElementById('duotoneColor1').value,
            color2: document.getElementById('duotoneColor2').value
          }
        }),
        ...(currentEffect === 'glitch' && {
          glitch: {
            amount: document.getElementById('glitchAmountSlider').value
          }
        }),
        ...(currentEffect === 'pixelate' && {
          pixelate: {
            amount: document.getElementById('pixelateAmountSlider').value
          }
        })
      };
      
      // Add to history
      editHistory.push(newState);
      historyIndex = editHistory.length - 1;
      
      // Update history buttons
      updateHistoryButtons();
    }
    
    /**
     * Update history buttons state
     */
    function updateHistoryButtons() {
      undoBtn.disabled = historyIndex <= 0;
      redoBtn.disabled = historyIndex >= editHistory.length - 1;
    }
    
    /**
     * Apply a state from history
     */
    function applyState(state) {
      // Apply basic adjustments
      document.getElementById('brightnessSlider').value = state.brightness;
      document.getElementById('brightnessValue').textContent = state.brightness;
      
      document.getElementById('contrastSlider').value = state.contrast;
      document.getElementById('contrastValue').textContent = state.contrast;
      
      document.getElementById('saturationSlider').value = state.saturation;
      document.getElementById('saturationValue').textContent = state.saturation;
      
      document.getElementById('exposureSlider').value = state.exposure;
      document.getElementById('exposureValue').textContent = state.exposure;
      
      // Apply color adjustments
      document.getElementById('temperatureSlider').value = state.temperature;
      document.getElementById('temperatureValue').textContent = state.temperature;
      
      document.getElementById('tintSlider').value = state.tint;
      document.getElementById('tintValue').textContent = state.tint;
      
      document.getElementById('vibranceSlider').value = state.vibrance;
      document.getElementById('vibranceValue').textContent = state.vibrance;
      
      // Apply detail adjustments
      document.getElementById('claritySlider').value = state.clarity;
      document.getElementById('clarityValue').textContent = state.clarity;
      
      document.getElementById('sharpenSlider').value = state.sharpen;
      document.getElementById('sharpenValue').textContent = state.sharpen;
      
      document.getElementById('noiseReduceSlider').value = state.noiseReduce;
      document.getElementById('noiseReduceValue').textContent = state.noiseReduce;
      
      // Apply filter
      currentFilter = state.filterName;
      updateFilterSelection();
      
      filterStrengthSlider.value = state.filterStrength;
      filterStrengthValue.textContent = state.filterStrength + '%';
      
      // Apply effect
      currentEffect = state.effectName;
      updateEffectSelection();
      
      // Apply effect specific settings if applicable
      if (state.vignette && currentEffect === 'vignette') {
        document.getElementById('vignetteAmountSlider').value = state.vignette.amount;
        document.getElementById('vignetteAmountValue').textContent = state.vignette.amount + '%';
        
        document.getElementById('vignetteSizeSlider').value = state.vignette.size;
        document.getElementById('vignetteSizeValue').textContent = state.vignette.size + '%';
      }
      
      if (state.blur && currentEffect === 'blur') {
        document.getElementById('blurAmountSlider').value = state.blur.amount;
        document.getElementById('blurAmountValue').textContent = state.blur.amount + 'px';
      }
      
      if (state.blurEdges && currentEffect === 'blur-edges') {
        document.getElementById('blurEdgesAmountSlider').value = state.blurEdges.amount;
        document.getElementById('blurEdgesAmountValue').textContent = state.blurEdges.amount + 'px';
        
        document.getElementById('blurEdgesSizeSlider').value = state.blurEdges.size;
        document.getElementById('blurEdgesSizeValue').textContent = state.blurEdges.size + '%';
      }
      
      if (state.noise && currentEffect === 'noise') {
        document.getElementById('noiseAmountSlider').value = state.noise.amount;
        document.getElementById('noiseAmountValue').textContent = state.noise.amount + '%';
      }
      
      if (state.duotone && currentEffect === 'duotone') {
        document.getElementById('duotoneColor1').value = state.duotone.color1;
        document.getElementById('duotoneColor2').value = state.duotone.color2;
      }
      
      if (state.glitch && currentEffect === 'glitch') {
        document.getElementById('glitchAmountSlider').value = state.glitch.amount;
        document.getElementById('glitchAmountValue').textContent = state.glitch.amount + '%';
      }
      
      if (state.pixelate && currentEffect === 'pixelate') {
        document.getElementById('pixelateAmountSlider').value = state.pixelate.amount;
        document.getElementById('pixelateAmountValue').textContent = state.pixelate.amount + 'px';
      }
      
      // Apply filters to image
      applyFilters();
    }
    
    /**
     * Update filter selection UI
     */
    function updateFilterSelection() {
      filterItems.forEach(item => {
        if (item.dataset.filter === currentFilter) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
    
    /**
     * Update effect selection UI and show relevant controls
     */
    function updateEffectSelection() {
      effectItems.forEach(item => {
        if (item.dataset.effect === currentEffect) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      
      // Hide all effect controls first
      effectControls.forEach(control => {
        control.style.display = 'none';
      });
      
      // Show relevant effect control
      if (currentEffect !== 'none') {
        const activeControl = document.getElementById(`${currentEffect}Controls`);
        if (activeControl) {
          activeControl.style.display = 'block';
        }
      }
    }
    
    /**
     * Update zoom display
     */
    function updateZoomDisplay() {
      zoomLevel.textContent = Math.round(currentZoom * 100) + '%';
      previewImage.style.transform = `scale(${currentZoom})`;
    }
    
    /**
     * Apply all filters to image
     */
    function applyFilters() {
      // Get values from all sliders
      const brightness = document.getElementById('brightnessSlider').value;
      const contrast = document.getElementById('contrastSlider').value;
      const saturation = document.getElementById('saturationSlider').value;
      const exposure = document.getElementById('exposureSlider').value;
      const temperature = document.getElementById('temperatureSlider').value;
      const tint = document.getElementById('tintSlider').value;
      const vibrance = document.getElementById('vibranceSlider').value;
      const clarity = document.getElementById('claritySlider').value;
      const sharpen = document.getElementById('sharpenSlider').value;
      
      // Build CSS filter string
      let filterString = '';
      
      // Basic adjustments
      if (brightness !== '0') {
        filterString += `brightness(${100 + parseInt(brightness)}%) `;
      }
      
      if (contrast !== '0') {
        filterString += `contrast(${100 + parseInt(contrast)}%) `;
      }
      
      if (saturation !== '0') {
        filterString += `saturate(${100 + parseInt(saturation)}%) `;
      }
      
      // Exposure (simulated with brightness)
      if (exposure !== '0') {
        const exposureValue = parseInt(exposure) * 1.5; // Amplify effect
        filterString += `brightness(${100 + exposureValue}%) `;
      }
      
      // Apply selected filter if not 'none'
      if (currentFilter !== 'none') {
        const filterStrength = parseInt(filterStrengthSlider.value) / 100;
        
        switch (currentFilter) {
          case 'grayscale':
            filterString += `grayscale(${100 * filterStrength}%) `;
            break;
          case 'sepia':
            filterString += `sepia(${100 * filterStrength}%) `;
            break;
          case 'vintage':
            filterString += `sepia(${60 * filterStrength}%) saturate(${100 - 20 * filterStrength}%) brightness(${100 + 10 * filterStrength}%) `;
            break;
          case 'retro':
            filterString += `sepia(${50 * filterStrength}%) hue-rotate(${20 * filterStrength}deg) saturate(${100 - 20 * filterStrength}%) `;
            break;
          case 'warm':
            filterString += `sepia(${20 * filterStrength}%) saturate(${100 + 20 * filterStrength}%) brightness(${100 + 10 * filterStrength}%) hue-rotate(${30 * filterStrength}deg) `;
            break;
          case 'cool':
            filterString += `hue-rotate(${180 * filterStrength}deg) saturate(${100 - 10 * filterStrength}%) `;
            break;
          case 'dramatic':
            filterString += `contrast(${100 + 50 * filterStrength}%) brightness(${100 - 10 * filterStrength}%) `;
            break;
          case 'noir':
            filterString += `grayscale(${100 * filterStrength}%) contrast(${100 + 50 * filterStrength}%) brightness(${100 - 20 * filterStrength}%) `;
            break;
          case 'clarity':
            filterString += `contrast(${100 + 20 * filterStrength}%) brightness(${100 + 10 * filterStrength}%) saturate(${100 + 20 * filterStrength}%) `;
            break;
          case 'fade':
            filterString += `brightness(${100 + 10 * filterStrength}%) saturate(${100 - 50 * filterStrength}%) `;
            break;
          case 'chrome':
            filterString += `grayscale(${10 * filterStrength}%) contrast(${100 + 20 * filterStrength}%) brightness(${100 + 20 * filterStrength}%) `;
            break;
          case 'mono':
            filterString += `grayscale(${100 * filterStrength}%) brightness(${100 + 10 * filterStrength}%) contrast(${100 - 10 * filterStrength}%) `;
            break;
        }
      }
      
      // Apply effect if not 'none'
      if (currentEffect !== 'none') {
        switch (currentEffect) {
          case 'vignette':
            // Vignette is applied using a separate element with radial gradient
            // Here we'd update CSS variables or apply classes
            break;
          case 'blur':
            const blurAmount = document.getElementById('blurAmountSlider').value;
            filterString += `blur(${blurAmount}px) `;
            break;
          case 'blur-edges':
            // Blur edges is applied using a separate element with radial gradient + blur
            break;
          case 'noise':
            // Noise requires canvas manipulation, will be applied in download
            break;
          case 'duotone':
            // Duotone requires SVG filters, will be applied separately
            break;
          case 'glitch':
            // Glitch effect is complex, simplified version using RGB shifts
            break;
          case 'pixelate':
            // Pixelate requires canvas manipulation, simplified using blur + contrast
            const pixelateAmount = document.getElementById('pixelateAmountSlider').value;
            const amount = Math.max(2, parseInt(pixelateAmount) / 2);
            filterString += `blur(${amount}px) contrast(${150}%) `;
            break;
        }
      }
      
      // Apply filters to image
      previewImage.style.filter = filterString;
      
      // Apply special effects that can't be done with CSS filters
      applySpecialEffects();
    }
    
    /**
     * Apply special effects that can't be done with CSS filters
     */
    function applySpecialEffects() {
      // Reset any previous special effect styling
      previewImage.style.boxShadow = 'none';
      previewWrapper.style.background = 'none';
      
      if (currentEffect === 'vignette') {
        const amount = document.getElementById('vignetteAmountSlider').value;
        const size = document.getElementById('vignetteSizeSlider').value;
        
        // Create a vignette effect using box-shadow inset
        const vignetteOpacity = amount / 100;
        const vignetteSize = 100 - size; // Invert so higher values = larger vignette
        
        previewWrapper.style.background = `radial-gradient(
          circle,
          transparent ${vignetteSize}%,
          rgba(0, 0, 0, ${vignetteOpacity}) 100%
        )`;
      }
      
      if (currentEffect === 'blur-edges') {
        const amount = document.getElementById('blurEdgesAmountSlider').value;
        const size = document.getElementById('blurEdgesSizeSlider').value;
        
        // Apply a mask to the preview wrapper
        previewWrapper.style.background = `radial-gradient(
          circle,
          transparent ${size}%,
          rgba(0, 0, 0, 0.5) 100%
        )`;
        
        // Apply blur to the image
        previewImage.style.filter += ` blur(${amount}px)`;
      }
      
      if (currentEffect === 'duotone') {
        const color1 = document.getElementById('duotoneColor1').value;
        const color2 = document.getElementById('duotoneColor2').value;
        
        // Convert colors to RGB components
        const getRGB = (hex) => {
          const r = parseInt(hex.substring(1, 3), 16);
          const g = parseInt(hex.substring(3, 5), 16);
          const b = parseInt(hex.substring(5, 7), 16);
          return {r, g, b};
        };
        
        const rgb1 = getRGB(color1);
        const rgb2 = getRGB(color2);
        
        // Apply a simplified duotone effect using mix-blend-mode
        previewWrapper.style.background = `linear-gradient(
          to bottom right,
          ${color1},
          ${color2}
        )`;
        
        // Apply mix-blend-mode to the image
        previewImage.style.mixBlendMode = 'luminosity';
      }
      
      if (currentEffect === 'glitch') {
        const amount = document.getElementById('glitchAmountSlider').value;
        const intensity = amount / 100;
        
        // Apply a simplified glitch effect using text-shadow with RGB shifts
        const offsetValue = Math.round(intensity * 10);
        
        previewImage.style.position = 'relative';
        previewImage.style.display = 'block';
        
        // Add a subtle RGB shift using box-shadow
        previewImage.style.boxShadow = `
          ${offsetValue}px 0 0 rgba(255, 0, 0, ${intensity * 0.5}),
          -${offsetValue}px 0 0 rgba(0, 255, 255, ${intensity * 0.5})
        `;
      }
    }
    
    /**
     * Initialize crop functionality
     */
    function initCrop() {
      cropActive = true;
      
      // Store original image dimensions
      originalImageWidth = previewImage.naturalWidth;
      originalImageHeight = previewImage.naturalHeight;
      
      // Create crop overlay
      createCropOverlay();
      
      // Set crop tab as active
      tabBtns.forEach(btn => {
        if (btn.dataset.tab === 'cropTab') {
          btn.click();
        }
      });
      
      showNotification('Drag to create crop area');
    }
    
    /**
     * Create crop overlay
     */
    function createCropOverlay() {
      // Remove any existing crop overlay
      const existingOverlay = document.getElementById('cropOverlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
      
      // Create overlay container
      const overlay = document.createElement('div');
      overlay.id = 'cropOverlay';
      overlay.className = 'crop-overlay';
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay.style.zIndex = '10';
      
      // Create crop box
      cropBox = document.createElement('div');
      cropBox.className = 'crop-box';
      cropBox.style.position = 'absolute';
      cropBox.style.border = '2px dashed white';
      cropBox.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      cropBox.style.display = 'none';
      
      // Create crop handles
      const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
      handles.forEach(position => {
        const handle = document.createElement('div');
        handle.className = `crop-handle ${position}`;
        handle.dataset.position = position;
        handle.style.position = 'absolute';
        handle.style.width = '10px';
        handle.style.height = '10px';
        handle.style.backgroundColor = 'white';
        handle.style.borderRadius = '50%';
        
        // Position handles
        switch(position) {
          case 'nw': 
            handle.style.top = '-5px';
            handle.style.left = '-5px';
            handle.style.cursor = 'nwse-resize';
            break;
          case 'n': 
            handle.style.top = '-5px';
            handle.style.left = 'calc(50% - 5px)';
            handle.style.cursor = 'ns-resize';
            break;
          case 'ne': 
            handle.style.top = '-5px';
            handle.style.right = '-5px';
            handle.style.cursor = 'nesw-resize';
            break;
          case 'e': 
            handle.style.top = 'calc(50% - 5px)';
            handle.style.right = '-5px';
            handle.style.cursor = 'ew-resize';
            break;
          case 'se': 
            handle.style.bottom = '-5px';
            handle.style.right = '-5px';
            handle.style.cursor = 'nwse-resize';
            break;
          case 's': 
            handle.style.bottom = '-5px';
            handle.style.left = 'calc(50% - 5px)';
            handle.style.cursor = 'ns-resize';
            break;
          case 'sw': 
            handle.style.bottom = '-5px';
            handle.style.left = '-5px';
            handle.style.cursor = 'nesw-resize';
            break;
          case 'w': 
            handle.style.top = 'calc(50% - 5px)';
            handle.style.left = '-5px';
            handle.style.cursor = 'ew-resize';
            break;
        }
        
        cropBox.appendChild(handle);
      });
      
      overlay.appendChild(cropBox);
      previewWrapper.appendChild(overlay);
      
      // Add event listeners for crop
      overlay.addEventListener('mousedown', startCrop);
      document.addEventListener('mousemove', updateCrop);
      document.addEventListener('mouseup', endCrop);
      
      // Add event listeners for crop handles
      const cropHandles = document.querySelectorAll('.crop-handle');
      cropHandles.forEach(handle => {
        handle.addEventListener('mousedown', startResize);
      });
    }
    
    /**
     * Start crop
     */
    function startCrop(e) {
      if (isCropping) return;
      
      // Only start if we're clicking directly on the overlay (not the crop box)
      if (e.target.id === 'cropOverlay') {
        isCropping = true;
        
        const rect = previewWrapper.getBoundingClientRect();
        cropStartX = e.clientX - rect.left;
        cropStartY = e.clientY - rect.top;
        
        // Show crop box at initial position
        cropBox.style.display = 'block';
        cropBox.style.left = cropStartX + 'px';
        cropBox.style.top = cropStartY + 'px';
        cropBox.style.width = '0';
        cropBox.style.height = '0';
      }
    }
    
    /**
     * Update crop as mouse moves
     */
    function updateCrop(e) {
      if (!isCropping) return;
      
      const rect = previewWrapper.getBoundingClientRect();
      cropEndX = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
      cropEndY = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
      
      // Calculate dimensions based on starting and current position
      const width = Math.abs(cropEndX - cropStartX);
      const height = Math.abs(cropEndY - cropStartY);
      
      // Calculate top-left position
      const left = Math.min(cropStartX, cropEndX);
      const top = Math.min(cropStartY, cropEndY);
      
      // Apply aspect ratio constraint if needed
      if (cropAspectRatio !== 'free') {
        const ratio = eval(cropAspectRatio.replace(':', '/'));
        
        // Determine which dimension to constrain
        if (width / height > ratio) {
          // Constrain height based on width
          const newHeight = width / ratio;
          
          // Adjust top position
          if (cropEndY > cropStartY) {
            cropEndY = cropStartY + newHeight;
          } else {
            cropEndY = cropStartY - newHeight;
          }
        } else {
          // Constrain width based on height
          const newWidth = height * ratio;
          
          // Adjust left position
          if (cropEndX > cropStartX) {
            cropEndX = cropStartX + newWidth;
          } else {
            cropEndX = cropStartX - newWidth;
          }
        }
        
        // Recalculate dimensions
        const constrainedWidth = Math.abs(cropEndX - cropStartX);
        const constrainedHeight = Math.abs(cropEndY - cropStartY);
        
        // Recalculate top-left position
        const constrainedLeft = Math.min(cropStartX, cropEndX);
        const constrainedTop = Math.min(cropStartY, cropEndY);
        
        // Update crop box position and size
        cropBox.style.left = constrainedLeft + 'px';
        cropBox.style.top = constrainedTop + 'px';
        cropBox.style.width = constrainedWidth + 'px';
        cropBox.style.height = constrainedHeight + 'px';
      } else {
        // Update crop box position and size without constraint
        cropBox.style.left = left + 'px';
        cropBox.style.top = top + 'px';
        cropBox.style.width = width + 'px';
        cropBox.style.height = height + 'px';
      }
    }
    
    /**
     * End crop
     */
    function endCrop() {
      if (!isCropping) return;
      
      isCropping = false;
      
      // Calculate final crop selection relative to image
      const imageRect = previewImage.getBoundingClientRect();
      const boxRect = cropBox.getBoundingClientRect();
      
      // Calculate image scale factor
      const scaleX = originalImageWidth / previewImage.offsetWidth;
      const scaleY = originalImageHeight / previewImage.offsetHeight;
      
      // Calculate crop selection in terms of original image coordinates
      cropSelection = {
        x: Math.round((boxRect.left - imageRect.left) * scaleX),
        y: Math.round((boxRect.top - imageRect.top) * scaleY),
        width: Math.round(boxRect.width * scaleX),
        height: Math.round(boxRect.height * scaleY)
      };
      
      // Ensure crop selection doesn't exceed image bounds
      cropSelection.x = Math.max(0, cropSelection.x);
      cropSelection.y = Math.max(0, cropSelection.y);
      cropSelection.width = Math.min(originalImageWidth - cropSelection.x, cropSelection.width);
      cropSelection.height = Math.min(originalImageHeight - cropSelection.y, cropSelection.height);
      
      // Show notification with crop info
      showNotification(`Crop area selected: ${cropSelection.width} x ${cropSelection.height}`);
    }
    
    /**
     * Start resize crop box
     */
    function startResize(e) {
      e.stopPropagation();
      
      const handle = e.target;
      const position = handle.dataset.position;
      
      const initialBox = cropBox.getBoundingClientRect();
      const initialMouseX = e.clientX;
      const initialMouseY = e.clientY;
      
      const onMouseMove = (e) => {
        const deltaX = e.clientX - initialMouseX;
        const deltaY = e.clientY - initialMouseY;
        
        let newLeft = parseInt(cropBox.style.left);
        let newTop = parseInt(cropBox.style.top);
        let newWidth = parseInt(cropBox.style.width);
        let newHeight = parseInt(cropBox.style.height);
        
        // Update dimensions based on handle position
        switch(position) {
          case 'nw':
            newLeft += deltaX;
            newTop += deltaY;
            newWidth -= deltaX;
            newHeight -= deltaY;
            break;
          case 'n':
            newTop += deltaY;
            newHeight -= deltaY;
            break;
          case 'ne':
            newTop += deltaY;
            newWidth += deltaX;
            newHeight -= deltaY;
            break;
          case 'e':
            newWidth += deltaX;
            break;
          case 'se':
            newWidth += deltaX;
            newHeight += deltaY;
            break;
          case 's':
            newHeight += deltaY;
            break;
          case 'sw':
            newLeft += deltaX;
            newWidth -= deltaX;
            newHeight += deltaY;
            break;
          case 'w':
            newLeft += deltaX;
            newWidth -= deltaX;
            break;
        }
        
        // Apply aspect ratio constraint if needed
        if (cropAspectRatio !== 'free') {
          const ratio = eval(cropAspectRatio.replace(':', '/'));
          
          // Determine which dimension to constrain based on which handle is being dragged
          if (position.includes('n') || position.includes('s')) {
            // Height is being changed, adjust width
            newWidth = newHeight * ratio;
            
            // Adjust left position if needed
            if (position.includes('w')) {
              newLeft = parseInt(cropBox.style.left) + parseInt(cropBox.style.width) - newWidth;
            }
          } else {
            // Width is being changed, adjust height
            newHeight = newWidth / ratio;
            
            // Adjust top position if needed
            if (position.includes('n')) {
              newTop = parseInt(cropBox.style.top) + parseInt(cropBox.style.height) - newHeight;
            }
          }
        }
        
        // Ensure minimum size
        if (newWidth >= 20 && newHeight >= 20) {
          cropBox.style.left = newLeft + 'px';
          cropBox.style.top = newTop + 'px';
          cropBox.style.width = newWidth + 'px';
          cropBox.style.height = newHeight + 'px';
        }
      };
      
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        // Update crop selection
        endCrop();
      };
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    
    /**
     * Apply crop to image
     */
    function applyCrop() {
      if (!cropActive || !cropSelection.width || !cropSelection.height) {
        showNotification('Please select a crop area first');
        return;
      }
      
      showLoading();
      
      try {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match crop selection
        canvas.width = cropSelection.width;
        canvas.height = cropSelection.height;
        
        // Create a new image to draw from
        const img = new Image();
        
        img.onload = function() {
          // Draw the cropped portion
          ctx.drawImage(
            img,
            cropSelection.x, cropSelection.y, cropSelection.width, cropSelection.height,
            0, 0, cropSelection.width, cropSelection.height
          );
          
          // Convert canvas to data URL
          const croppedImage = canvas.toDataURL('image/png');
          
          // Update original image with cropped version
          originalImage = croppedImage;
          
          // Update preview image
          previewImage.src = croppedImage;
          
          // Wait for image to load
          previewImage.onload = function() {
            // Reset crop
            resetCrop();
            
            // Apply current filters to cropped image
            applyFilters();
            
            // Add to history
            addToHistory();
            
            // Notify user
            showNotification('Crop applied successfully');
            
            // Hide loading
            hideLoading();
          };
        };
        
        img.src = originalImage;
      } catch (error) {
        console.error('Error applying crop:', error);
        showNotification('Error applying crop');
        hideLoading();
      }
    }
    
    /**
     * Reset crop
     */
    function resetCrop() {
      cropActive = false;
      cropSelection = { x: 0, y: 0, width: 0, height: 0 };
      
      // Remove crop overlay
      const overlay = document.getElementById('cropOverlay');
      if (overlay) {
        overlay.remove();
      }
      
      // Switch back to adjust tab
      tabBtns.forEach(btn => {
        if (btn.dataset.tab === 'adjustTab') {
          btn.click();
        }
      });
    }
    
    /**
     * Download edited image
     */
    function downloadImage(format = 'jpeg', quality = 0.9) {
      if (!originalImage) {
        showNotification('No image to download');
        return;
      }
      
      showLoading();
      
      try {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Create a new image to draw from the original (not the preview which may be zoomed)
        const img = new Image();
        
        img.onload = function() {
          // Set canvas size to match image dimensions
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          
          // Draw the original image
          ctx.drawImage(img, 0, 0);
          
          // Apply filters manually as CSS filters aren't directly applicable to canvas
          applyCanvasFilters(canvas, ctx);
          
          // Determine MIME type and filename
          let mimeType, fileName;
          
          switch (format) {
            case 'png':
              mimeType = 'image/png';
              fileName = 'edited-image.png';
              break;
            case 'webp':
              mimeType = 'image/webp';
              fileName = 'edited-image.webp';
              break;
            default:
              mimeType = 'image/jpeg';
              fileName = 'edited-image.jpg';
          }
          
          // Convert canvas to data URL
          const dataURL = canvas.toDataURL(mimeType, quality);
          
          // Create a download link
          const link = document.createElement('a');
          link.href = dataURL;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          showNotification(`Image downloaded successfully as ${format.toUpperCase()}`);
        };
        
        img.src = originalImage;
      } catch (error) {
        console.error('Error downloading image:', error);
        showNotification('Error downloading image');
      } finally {
        hideLoading();
      }
    }
    
    /**
     * Apply filters to canvas (for download)
     */
    function applyCanvasFilters(canvas, ctx) {
      // This is a simplified implementation
      // For production, you'd need more sophisticated algorithms for each filter
      
      // Get current filter settings
      const brightness = parseInt(document.getElementById('brightnessSlider').value);
      const contrast = parseInt(document.getElementById('contrastSlider').value);
      const saturation = parseInt(document.getElementById('saturationSlider').value);
      
      // Get image data
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;
      
      // Apply brightness
      if (brightness !== 0) {
        const brightnessFactor = 1 + (brightness / 100);
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * brightnessFactor);
          data[i + 1] = Math.min(255, data[i + 1] * brightnessFactor);
          data[i + 2] = Math.min(255, data[i + 2] * brightnessFactor);
        }
      }
      
      // Apply contrast
      if (contrast !== 0) {
        const contrastFactor = 1 + (contrast / 100);
        const factor = (259 * (contrastFactor + 255)) / (255 * (259 - contrastFactor));
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
          data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
          data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
        }
      }
      
      // Apply saturation
      if (saturation !== 0) {
        const saturationFactor = 1 + (saturation / 100);
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate grayscale value using luminosity method
          const gray = 0.3 * r + 0.59 * g + 0.11 * b;
          
          // Apply saturation
          data[i] = Math.max(0, Math.min(255, r + (r - gray) * saturationFactor));
          data[i + 1] = Math.max(0, Math.min(255, g + (g - gray) * saturationFactor));
          data[i + 2] = Math.max(0, Math.min(255, b + (b - gray) * saturationFactor));
        }
      }
      
      // Apply current filter if not 'none'
      if (currentFilter !== 'none') {
        const filterStrength = parseInt(filterStrengthSlider.value) / 100;
        
        switch (currentFilter) {
          case 'grayscale':
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              
              const gray = 0.3 * r + 0.59 * g + 0.11 * b;
              const mix = filterStrength;
              
              data[i] = r * (1 - mix) + gray * mix;
              data[i + 1] = g * (1 - mix) + gray * mix;
              data[i + 2] = b * (1 - mix) + gray * mix;
            }
            break;
            
          case 'sepia':
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              
              const mix = filterStrength;
              const sepiaR = Math.min(255, (r * 0.393 + g * 0.769 + b * 0.189));
              const sepiaG = Math.min(255, (r * 0.349 + g * 0.686 + b * 0.168));
              const sepiaB = Math.min(255, (r * 0.272 + g * 0.534 + b * 0.131));
              
              data[i] = r * (1 - mix) + sepiaR * mix;
              data[i + 1] = g * (1 - mix) + sepiaG * mix;
              data[i + 2] = b * (1 - mix) + sepiaB * mix;
            }
            break;
            
          // Other filter implementations would go here for a production app
          // This is just a simplified demo
        }
      }
      
      // Apply effects if not 'none'
      if (currentEffect !== 'none') {
        switch (currentEffect) {
          case 'noise':
            const noiseAmount = parseInt(document.getElementById('noiseAmountSlider').value) / 100;
            
            for (let i = 0; i < data.length; i += 4) {
              if (Math.random() < noiseAmount * 0.3) {
                const randomValue = Math.random() * 255;
                data[i] = randomValue;
                data[i + 1] = randomValue;
                data[i + 2] = randomValue;
              }
            }
            break;
            
          case 'vignette':
            const vignetteAmount = parseInt(document.getElementById('vignetteAmountSlider').value) / 100;
            const vignetteSize = parseInt(document.getElementById('vignetteSizeSlider').value) / 100;
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.max(centerX, centerY) * vignetteSize;
            
            for (let y = 0; y < canvas.height; y++) {
              for (let x = 0; x < canvas.width; x++) {
                const idx = (y * canvas.width + x) * 4;
                
                // Calculate distance from center
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Calculate vignette factor
                let factor = 1;
                if (distance > radius) {
                  factor = 1 - Math.min(1, (distance - radius) / radius) * vignetteAmount;
                }
                
                // Apply vignette
                data[idx] = data[idx] * factor;
                data[idx + 1] = data[idx + 1] * factor;
                data[idx + 2] = data[idx + 2] * factor;
              }
            }
            break;
            
          // More effect implementations would go here
        }
      }
      
      // Put the modified image data back
      ctx.putImageData(imageData, 0, 0);
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
        processImage(this.files[0]);
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
        
        if (e.dataTransfer.files.length) {
          processImage(e.dataTransfer.files[0]);
        }
      });
      
      // Also handle click on dropzone
      dropZone.addEventListener('click', function() {
        fileInput.click();
      });
    }
    
    // Back to upload button
    if (backToUpload) {
      backToUpload.addEventListener('click', function() {
        editorSection.style.display = 'none';
        uploadSection.style.display = 'block';
        
        // Reset file input
        fileInput.value = '';
        
        // Animation
        gsap.from('#uploadSection', {
          opacity: 0,
          y: -20,
          duration: 0.5
        });
      });
    }
    
    // Tab navigation
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons and tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to this button
        this.classList.add('active');
        
        // Show corresponding tab content
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        // Initialize crop if this is the crop tab
        if (tabId === 'cropTab' && !cropActive) {
          initCrop();
        }
      });
    });
    
    // Zoom controls
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', function() {
        if (currentZoom < 3) {
          currentZoom += 0.1;
          updateZoomDisplay();
        }
      });
    }
    
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', function() {
        if (currentZoom > 0.3) {
          currentZoom -= 0.1;
          updateZoomDisplay();
        }
      });
    }
    
    // History controls
    if (undoBtn) {
      undoBtn.addEventListener('click', function() {
        if (historyIndex > 0) {
          historyIndex--;
          applyState(editHistory[historyIndex]);
          updateHistoryButtons();
        }
      });
    }
    
    if (redoBtn) {
      redoBtn.addEventListener('click', function() {
        if (historyIndex < editHistory.length - 1) {
          historyIndex++;
          applyState(editHistory[historyIndex]);
          updateHistoryButtons();
        }
      });
    }
    
    // Comparison slider
    if (compareBtn) {
      compareBtn.addEventListener('click', function() {
        isComparing = !isComparing;
        
        if (isComparing) {
          comparisonSlider.style.display = 'block';
          
          // Create a cloned image for comparison if needed
          if (!document.getElementById('originalPreviewImage')) {
            const originalImg = document.createElement('img');
            originalImg.src = originalImage;
            originalImg.id = 'originalPreviewImage';
            originalImg.className = 'preview-image';
            originalImg.style.position = 'absolute';
            originalImg.style.top = '0';
            originalImg.style.left = '0';
            originalImg.style.width = previewImage.offsetWidth + 'px';
            originalImg.style.height = previewImage.offsetHeight + 'px';
            originalImg.style.clip = `rect(0, ${previewImage.offsetWidth / 2}px, ${previewImage.offsetHeight}px, 0)`;
            
            previewWrapper.appendChild(originalImg);
          }
        } else {
          comparisonSlider.style.display = 'none';
          
          // Remove comparison image
          const originalImg = document.getElementById('originalPreviewImage');
          if (originalImg) {
            originalImg.remove();
          }
        }
      });
    }
    
    // Slider inputs for adjustments
    allSliders.forEach(slider => {
      slider.addEventListener('input', function() {
        // Update corresponding value display
        const controlName = this.getAttribute('data-control');
        const displayEl = document.getElementById(`${controlName}Value`);
        
        if (displayEl) {
          let suffix = '';
          
          // Add appropriate suffix based on control
          if (controlName === 'blur') suffix = 'px';
          else if (controlName === 'sharpen') suffix = '';
          
          displayEl.textContent = this.value + suffix;
        }
        
        // Apply filters
        applyFilters();
      });
      
      // Add to history when slider change is complete
      slider.addEventListener('change', function() {
        addToHistory();
      });
    });
    
    // Filter strength slider
    if (filterStrengthSlider) {
      filterStrengthSlider.addEventListener('input', function() {
        filterStrengthValue.textContent = this.value + '%';
        applyFilters();
      });
      
      filterStrengthSlider.addEventListener('change', function() {
        addToHistory();
      });
    }
    
    // Filter selection
    filterItems.forEach(item => {
      item.addEventListener('click', function() {
        currentFilter = this.getAttribute('data-filter');
        updateFilterSelection();
        applyFilters();
        addToHistory();
      });
    });
    
    // Effect selection
    effectItems.forEach(item => {
      item.addEventListener('click', function() {
        currentEffect = this.getAttribute('data-effect');
        updateEffectSelection();
        applyFilters();
        addToHistory();
      });
    });
    
    // Effect-specific controls
    document.querySelectorAll('.effect-control input').forEach(input => {
      input.addEventListener('input', function() {
        // Update value display
        const displayId = this.id.replace('Slider', 'Value');
        const displayEl = document.getElementById(displayId);
        
        if (displayEl) {
          let suffix = '';
          
          // Add appropriate suffix
          if (this.id.includes('Amount') && !this.id.includes('Glitch')) suffix = '%';
          if (this.id.includes('Size')) suffix = '%';
          if (this.id.includes('blur') || this.id.includes('Blur')) suffix = 'px';
          if (this.id.includes('pixelate')) suffix = 'px';
          
          displayEl.textContent = this.value + suffix;
        }
        
        // Apply filters
        applyFilters();
      });
      
      input.addEventListener('change', function() {
        addToHistory();
      });
    });
    
    // Color picker controls
    document.querySelectorAll('input[type="color"]').forEach(input => {
      input.addEventListener('input', function() {
        applyFilters();
      });
      
      input.addEventListener('change', function() {
        addToHistory();
      });
    });
    
    // Aspect ratio buttons for crop
    aspectBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        aspectBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        cropAspectRatio = this.getAttribute('data-ratio');
        
        // Start a new crop with the selected aspect ratio
        if (cropActive) {
          // Remove existing crop overlay and recreate
          resetCrop();
          initCrop();
        }
      });
    });
    
    // Apply crop button
    if (applyCropBtn) {
      applyCropBtn.addEventListener('click', function() {
        applyCrop();
      });
    }
    
    // Cancel crop button
    if (cancelCropBtn) {
      cancelCropBtn.addEventListener('click', function() {
        resetCrop();
        showNotification('Crop cancelled');
      });
    }
    
    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        resetFilters();
      });
    }
    
    // Download button
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function() {
        downloadImage();
      });
    }
    
    // Download dropdown toggle
    if (downloadOptions) {
      downloadOptions.addEventListener('click', function(e) {
        e.stopPropagation();
        downloadMenu.classList.toggle('active');
      });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      downloadMenu.classList.remove('active');
    });
    
    // Download format options
    downloadItems.forEach(item => {
      item.addEventListener('click', function() {
        const format = this.getAttribute('data-format');
        const quality = this.getAttribute('data-quality') || 0.9;
        
        downloadImage(format, quality);
        downloadMenu.classList.remove('active');
      });
    });
    
    // Theme toggle
    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        document.documentElement.setAttribute('data-theme', 
          document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        );
      });
    }
    
    // Initialize the app
    function init() {
      // Initial animations
      gsap.from('.page-header', { opacity: 0, y: -30, duration: 1 });
      gsap.from('.upload-section', { opacity: 0, y: 30, duration: 1, delay: 0.3 });
      
      // Set default theme
      document.documentElement.setAttribute('data-theme', 'dark');
      
      // Add CSS for crop overlay
      const cropStyle = document.createElement('style');
      cropStyle.textContent = `
        .crop-overlay {
          cursor: crosshair;
        }
        .crop-box {
          cursor: move;
        }
        .crop-handle {
          z-index: 20;
        }
      `;
      document.head.appendChild(cropStyle);
      
      // Log initialization
      console.log('Image Effects Studio initialized!');
    }
    
    /**
     * Handle file upload
     */
    function processImage(file) {
      if (!file) return;
      
      // Validate file type
      if (!file.type.match('image.*')) {
        showNotification('Please select an image file');
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showNotification('File size must be less than 10MB');
        return;
      }
      
      showLoading();
      
      // Process file
      const reader = new FileReader();
      
      reader.onload = async function(e) {
        // Store original image
        originalImage = e.target.result;
        
        // Set preview image
        previewImage.src = originalImage;
        
        // Wait for image to load
        previewImage.onload = async function() {
          // Update image info
          imageName.textContent = file.name;
          
          // Get image dimensions
          const dimensions = await getImageDimensions(file);
          imageSize.textContent = `${dimensions.width}x${dimensions.height} • ${formatFileSize(file.size)}`;
          
          // Show editor section
          uploadSection.style.display = 'none';
          editorSection.style.display = 'block';
          
          // Set filter preview images
          setFilterPreviews();
          
          // Reset all filters
          resetFilters(true);
          
          // Initialize history
          editHistory = [];
          historyIndex = -1;
          addToHistory();
          
          // Reset zoom
          currentZoom = 1;
          updateZoomDisplay();
          
          // Hide loading indicator
          hideLoading();
          
          // Add animation
          gsap.from('#editorSection', {
            opacity: 0,
            y: 20,
            duration: 0.5
          });
        };
      };
      
      reader.readAsDataURL(file);
    }
    
    /**
     * Set filter previews
     */
    function setFilterPreviews() {
      const filterPreviews = document.querySelectorAll('.filter-preview');
      
      // Only set background if we have an image
      if (!originalImage) return;
      
      filterPreviews.forEach(preview => {
        preview.style.backgroundImage = `url(${originalImage})`;
      });
    }
    
    /**
     * Reset all filters
     */
    function resetFilters(skipHistory = false) {
      // Reset basic adjustments
      document.getElementById('brightnessSlider').value = 0;
      document.getElementById('brightnessValue').textContent = '0';
      
      document.getElementById('contrastSlider').value = 0;
      document.getElementById('contrastValue').textContent = '0';
      
      document.getElementById('saturationSlider').value = 0;
      document.getElementById('saturationValue').textContent = '0';
      
      document.getElementById('exposureSlider').value = 0;
      document.getElementById('exposureValue').textContent = '0';
      
      // Reset color adjustments
      document.getElementById('temperatureSlider').value = 0;
      document.getElementById('temperatureValue').textContent = '0';
      
      document.getElementById('tintSlider').value = 0;
      document.getElementById('tintValue').textContent = '0';
      
      document.getElementById('vibranceSlider').value = 0;
      document.getElementById('vibranceValue').textContent = '0';
      
      // Reset detail adjustments
      document.getElementById('claritySlider').value = 0;
      document.getElementById('clarityValue').textContent = '0';
      
      document.getElementById('sharpenSlider').value = 0;
      document.getElementById('sharpenValue').textContent = '0';
      
      document.getElementById('noiseReduceSlider').value = 0;
      document.getElementById('noiseReduceValue').textContent = '0';
      
      // Reset filter
      currentFilter = 'none';
      updateFilterSelection();
      
      filterStrengthSlider.value = 100;
      filterStrengthValue.textContent = '100%';
      
      // Reset effect
      currentEffect = 'none';
      updateEffectSelection();
      
      // Reset effect specific controls
      if (document.getElementById('vignetteAmountSlider')) {
        document.getElementById('vignetteAmountSlider').value = 50;
        document.getElementById('vignetteAmountValue').textContent = '50%';
      }
      
      if (document.getElementById('vignetteSizeSlider')) {
        document.getElementById('vignetteSizeSlider').value = 50;
        document.getElementById('vignetteSizeValue').textContent = '50%';
      }
      
      if (document.getElementById('blurAmountSlider')) {
        document.getElementById('blurAmountSlider').value = 5;
        document.getElementById('blurAmountValue').textContent = '5px';
      }
      
      if (document.getElementById('blurEdgesAmountSlider')) {
        document.getElementById('blurEdgesAmountSlider').value = 5;
        document.getElementById('blurEdgesAmountValue').textContent = '5px';
      }
      
      if (document.getElementById('blurEdgesSizeSlider')) {
        document.getElementById('blurEdgesSizeSlider').value = 30;
        document.getElementById('blurEdgesSizeValue').textContent = '30%';
      }
      
      if (document.getElementById('noiseAmountSlider')) {
        document.getElementById('noiseAmountSlider').value = 15;
        document.getElementById('noiseAmountValue').textContent = '15%';
      }
      
      if (document.getElementById('duotoneColor1')) {
        document.getElementById('duotoneColor1').value = '#7000ff';
      }
      
      if (document.getElementById('duotoneColor2')) {
        document.getElementById('duotoneColor2').value = '#00d9ff';
      }
      
      if (document.getElementById('glitchAmountSlider')) {
        document.getElementById('glitchAmountSlider').value = 50;
        document.getElementById('glitchAmountValue').textContent = '50%';
      }
      
      if (document.getElementById('pixelateAmountSlider')) {
        document.getElementById('pixelateAmountSlider').value = 10;
        document.getElementById('pixelateAmountValue').textContent = '10px';
      }
      
      // Apply default filters
      previewImage.style.filter = 'none';
      previewImage.style.mixBlendMode = 'normal';
      previewWrapper.style.background = 'none';
      previewImage.style.boxShadow = 'none';
      
      // Also reset crop if active
      if (cropActive) {
        resetCrop();
      }
      
      if (!skipHistory) {
        addToHistory();
        showNotification('All adjustments reset');
      }
    }
    
    // Run initialization
    init();
  });