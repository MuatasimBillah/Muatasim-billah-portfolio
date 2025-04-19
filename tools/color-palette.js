/**
 * Color Palette Generator
 * Advanced client-side tool for creating beautiful color schemes with multiple harmony methods
 * Features: monochromatic, analogous, complementary, split-complementary, triadic, tetradic, and square palettes
 * 
 * SEO-optimized with proper error handling, analytics integration, and performance best practices
 * @author Mehar Designer
 * @version 2.0
 */

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const baseColorInput = document.getElementById('base-color');
  const baseColorHex = document.getElementById('base-color-hex');
  const paletteTypeSelect = document.getElementById('palette-type');
  const colorCountSelect = document.getElementById('color-count');
  const saturationRange = document.getElementById('saturation-range');
  const saturationValue = document.getElementById('saturation-value');
  const brightnessRange = document.getElementById('brightness-range');
  const brightnessValue = document.getElementById('brightness-value');
  const generateBtn = document.getElementById('generate-btn');
  const saveBtn = document.getElementById('save-btn');
  const exportBtn = document.getElementById('export-btn');
  const currentPalette = document.getElementById('current-palette');
  const savedPalettesContainer = document.getElementById('saved-palettes-container');
  const notificationToast = document.getElementById('notification-toast');
  const notificationText = document.getElementById('notification-text');
  
  // Code Block Elements
  const hexCode = document.getElementById('hex-code');
  const rgbCode = document.getElementById('rgb-code');
  const hslCode = document.getElementById('hsl-code');
  const cssCode = document.getElementById('css-code');
  const sassCode = document.getElementById('sass-code');
  
  // Variables
  let currentColors = [];
  let savedPalettes = [];
  
  // Initial Setup
  initApp();
  
  // Function to initialize the application
  function initApp() {
      // Check if local storage is available
      checkLocalStorageAvailability();
      
      // Load saved palettes from local storage
      loadSavedPalettes();
      
      // Set up event listeners
      setupEventListeners();
      
      // Initialize color picker
      updateBaseColorHex();
      
      // Generate initial palette
      generatePalette();
      
      // Track page load for analytics
      trackEvent('page_load', 'color_palette_generator', window.location.href);
  }
  
  // Function to check if local storage is available
  function checkLocalStorageAvailability() {
      try {
          const testKey = 'test_storage';
          localStorage.setItem(testKey, testKey);
          localStorage.removeItem(testKey);
          return true;
      } catch (e) {
          showNotification('Local storage is not available. Your palettes will not be saved between sessions.', 'warning', 5000);
          return false;
      }
  }
  
  // Setup event listeners
  function setupEventListeners() {
      // Generate palette when button is clicked
      generateBtn.addEventListener('click', generatePalette);
      
      // Generate palette when any of the options change
      paletteTypeSelect.addEventListener('change', generatePalette);
      colorCountSelect.addEventListener('change', generatePalette);
      
      // Update base color hex value when color picker changes
      baseColorInput.addEventListener('input', updateBaseColorHex);
      
      // Generate palette when base color is changed
      baseColorInput.addEventListener('change', generatePalette);
      
      // Update saturation value when range slider changes
      saturationRange.addEventListener('input', function() {
          saturationValue.textContent = `${this.value}%`;
          generatePalette();
      });
      
      // Update brightness value when range slider changes
      brightnessRange.addEventListener('input', function() {
          brightnessValue.textContent = `${this.value}%`;
          generatePalette();
      });
      
      // Save palette when button is clicked
      saveBtn.addEventListener('click', savePalette);
      
      // Export palette when button is clicked
      exportBtn.addEventListener('click', showExportOptions);
      
      // Tab switching
      const tabBtns = document.querySelectorAll('.tab-btn');
      tabBtns.forEach(btn => {
          btn.addEventListener('click', function() {
              const tabId = this.getAttribute('data-tab');
              switchTab(tabId);
          });
      });
      
      // Copy button functionality
      const copyBtns = document.querySelectorAll('.copy-btn');
      copyBtns.forEach(btn => {
          btn.addEventListener('click', function() {
              const targetId = this.getAttribute('data-target');
              copyToClipboard(targetId);
          });
      });
  }
  
  // Function to update base color hex value
  function updateBaseColorHex() {
      const hexValue = baseColorInput.value.toUpperCase();
      baseColorHex.textContent = hexValue;
  }
  
  // Generate palette based on selected options
  function generatePalette() {
      const baseColor = baseColorInput.value;
      const paletteType = paletteTypeSelect.value;
      const colorCount = parseInt(colorCountSelect.value);
      const saturation = parseInt(saturationRange.value) / 100;
      const brightness = parseInt(brightnessRange.value) / 100;
      
      // Convert base color to HSL
      const baseHSL = hexToHSL(baseColor);
      
      // Generate colors based on palette type
      currentColors = generateColorsByType(baseHSL, paletteType, colorCount, saturation, brightness);
      
      // Render the current palette
      renderCurrentPalette();
      
      // Update code blocks
      updateCodeBlocks();
      
      // Track palette generation
      trackEvent('palette_generated', paletteType, colorCount);
  }
  
  // Function to generate colors based on palette type
  function generateColorsByType(baseHSL, type, count, saturation, brightness) {
      const colors = [];
      const hue = baseHSL.h;
      const s = baseHSL.s * saturation;
      const l = baseHSL.l * brightness;
      
      switch (type) {
          case 'random':
              // Generate random colors
              for (let i = 0; i < count; i++) {
                  const randomHue = Math.floor(Math.random() * 360);
                  colors.push(hslToHex(randomHue, s, l));
              }
              break;
              
          case 'monochromatic':
              // Generate shades and tints of the same hue
              const stepL = 0.8 / (count - 1);
              for (let i = 0; i < count; i++) {
                  const lightness = 0.1 + (stepL * i);
                  colors.push(hslToHex(hue, s, lightness));
              }
              break;
              
          case 'analogous':
              // Generate colors adjacent on the color wheel
              const analogousStep = 30 / (count - 1);
              for (let i = 0; i < count; i++) {
                  const newHue = (hue - 15 + (analogousStep * i)) % 360;
                  colors.push(hslToHex(newHue, s, l));
              }
              break;
              
          case 'complementary':
              // Generate a complementary color scheme
              if (count === 2) {
                  colors.push(hslToHex(hue, s, l));
                  colors.push(hslToHex((hue + 180) % 360, s, l));
              } else {
                  const complementaryStep = 180 / (count - 1);
                  for (let i = 0; i < count; i++) {
                      const newHue = (hue + (complementaryStep * i)) % 360;
                      colors.push(hslToHex(newHue, s, l));
                  }
              }
              break;
              
          case 'split-complementary':
              // Generate a split-complementary color scheme
              colors.push(hslToHex(hue, s, l)); // Base color
              
              if (count >= 3) {
                  colors.push(hslToHex((hue + 150) % 360, s, l)); // Split complement 1
                  colors.push(hslToHex((hue + 210) % 360, s, l)); // Split complement 2
              }
              
              // Add intermediate colors if needed
              if (count > 3) {
                  const additionalColors = count - 3;
                  const step = 60 / (additionalColors + 1);
                  
                  for (let i = 1; i <= additionalColors; i++) {
                      const newHue = (hue + 150 + (step * i)) % 360;
                      colors.push(hslToHex(newHue, s, l));
                  }
              }
              break;
              
          case 'triadic':
              // Generate colors evenly spaced around the color wheel (120 degrees apart)
              if (count <= 3) {
                  for (let i = 0; i < count; i++) {
                      const newHue = (hue + (i * 120)) % 360;
                      colors.push(hslToHex(newHue, s, l));
                  }
              } else {
                  // Base triadic colors
                  colors.push(hslToHex(hue, s, l));
                  colors.push(hslToHex((hue + 120) % 360, s, l));
                  colors.push(hslToHex((hue + 240) % 360, s, l));
                  
                  // Add intermediate colors
                  const additionalColors = count - 3;
                  const triadicStep = 120 / (Math.floor(additionalColors / 3) + 1);
                  
                  for (let i = 1; i <= additionalColors; i++) {
                      const segment = i % 3;
                      const baseSegmentHue = hue + (segment * 120);
                      const offset = Math.floor(i / 3) * triadicStep;
                      const newHue = (baseSegmentHue + offset) % 360;
                      colors.push(hslToHex(newHue, s, l));
                  }
              }
              break;
              
          case 'tetradic':
              // Generate a rectangular color scheme (pairs of complementary colors)
              if (count <= 4) {
                  for (let i = 0; i < count; i++) {
                      const newHue = (hue + (i * 90)) % 360;
                      colors.push(hslToHex(newHue, s, l));
                  }
              } else {
                  // Base tetradic colors
                  colors.push(hslToHex(hue, s, l));
                  colors.push(hslToHex((hue + 90) % 360, s, l));
                  colors.push(hslToHex((hue + 180) % 360, s, l));
                  colors.push(hslToHex((hue + 270) % 360, s, l));
                  
                  // Add intermediate colors
                  const additionalColors = count - 4;
                  const tetradicStep = 90 / (Math.floor(additionalColors / 4) + 1);
                  
                  for (let i = 1; i <= additionalColors; i++) {
                      const segment = i % 4;
                      const baseSegmentHue = hue + (segment * 90);
                      const offset = Math.floor(i / 4) * tetradicStep;
                      const newHue = (baseSegmentHue + offset) % 360;
                      colors.push(hslToHex(newHue, s, l));
                  }
              }
              break;
              
          case 'square':
              // Generate colors evenly spaced 90 degrees apart
              if (count <= 4) {
                  for (let i = 0; i < count; i++) {
                      const newHue = (hue + (i * 90)) % 360;
                      colors.push(hslToHex(newHue, s, l));
                  }
              } else {
                  // Base square colors
                  colors.push(hslToHex(hue, s, l));
                  colors.push(hslToHex((hue + 90) % 360, s, l));
                  colors.push(hslToHex((hue + 180) % 360, s, l));
                  colors.push(hslToHex((hue + 270) % 360, s, l));
                  
                  // Add intermediate colors
                  const additionalColors = count - 4;
                  const squareStep = 90 / (Math.floor(additionalColors / 4) + 1);
                  
                  for (let i = 1; i <= additionalColors; i++) {
                      const segment = i % 4;
                      const baseSegmentHue = hue + (segment * 90);
                      const offset = Math.floor(i / 4) * squareStep;
                      const newHue = (baseSegmentHue + offset) % 360;
                      colors.push(hslToHex(newHue, s, l));
                  }
              }
              break;
              
          default:
              // Default to monochromatic if unknown type
              const defaultStepL = 0.8 / (count - 1);
              for (let i = 0; i < count; i++) {
                  const lightness = 0.1 + (defaultStepL * i);
                  colors.push(hslToHex(hue, s, lightness));
              }
      }
      
      return colors;
  }
  
  // Render the current palette
  function renderCurrentPalette() {
      // Clear previous palette
      currentPalette.innerHTML = '';
      
      // Create placeholder for empty palette
      if (currentColors.length === 0) {
          const placeholder = document.createElement('div');
          placeholder.className = 'palette-placeholder';
          placeholder.innerHTML = `
              <i class="fas fa-palette"></i>
              <p>Your color palette will appear here</p>
              <p class="small">Click "Generate Palette" to create your first color scheme</p>
          `;
          currentPalette.appendChild(placeholder);
          return;
      }
      
      // Create color swatches container
      const swatchesContainer = document.createElement('div');
      swatchesContainer.className = 'color-swatches';
      
      // Create color swatches
      currentColors.forEach((color, index) => {
          const swatch = document.createElement('div');
          swatch.className = 'color-swatch';
          swatch.setAttribute('data-color', color);
          swatch.setAttribute('data-index', index);
          
          // Create color preview
          const preview = document.createElement('div');
          preview.className = 'color-preview';
          preview.style.backgroundColor = color;
          
          // Create color info
          const info = document.createElement('div');
          info.className = 'color-info';
          
          // Get color name
          const colorName = getColorName(color);
          
          // Create color name element
          const nameElement = document.createElement('div');
          nameElement.className = 'color-name';
          nameElement.textContent = colorName;
          
          // Create color value element
          const valueElement = document.createElement('div');
          valueElement.className = 'color-value';
          valueElement.textContent = color.toUpperCase();
          
          // Append elements
          info.appendChild(nameElement);
          info.appendChild(valueElement);
          swatch.appendChild(preview);
          swatch.appendChild(info);
          
          // Add click event to copy color
          swatch.addEventListener('click', function() {
              copyToClipboard(null, color);
          });
          
          // Append swatch to container
          swatchesContainer.appendChild(swatch);
      });
      
      // Append swatches container to current palette
      currentPalette.appendChild(swatchesContainer);
  }
  
  // Function to update code blocks with current colors
  function updateCodeBlocks() {
      if (currentColors.length === 0) return;
      
      // Update HEX code
      let hexCodeStr = '/* Color Palette - HEX Values */\n';
      currentColors.forEach((color, index) => {
          hexCodeStr += `--color-${index + 1}: ${color.toUpperCase()};\n`;
      });
      hexCode.textContent = hexCodeStr;
      
      // Update RGB code
      let rgbCodeStr = '/* Color Palette - RGB Values */\n';
      currentColors.forEach((color, index) => {
          const rgb = hexToRgb(color);
          rgbCodeStr += `--color-${index + 1}: rgb(${rgb.r}, ${rgb.g}, ${rgb.b});\n`;
      });
      rgbCode.textContent = rgbCodeStr;
      
      // Update HSL code
      let hslCodeStr = '/* Color Palette - HSL Values */\n';
      currentColors.forEach((color, index) => {
          const hsl = hexToHSL(color);
          hslCodeStr += `--color-${index + 1}: hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%);\n`;
      });
      hslCode.textContent = hslCodeStr;
      
      // Update CSS code
      let cssCodeStr = '/* Color Palette - CSS Variables */\n:root {\n';
      currentColors.forEach((color, index) => {
          cssCodeStr += `  --color-${index + 1}: ${color.toUpperCase()};\n`;
      });
      cssCodeStr += '}';
      cssCode.textContent = cssCodeStr;
      
      // Update SASS code
      let sassCodeStr = '// Color Palette - SASS Variables\n';
      currentColors.forEach((color, index) => {
          sassCodeStr += `$color-${index + 1}: ${color.toUpperCase()};\n`;
      });
      sassCode.textContent = sassCodeStr;
  }
  
  // Function to save the current palette
  function savePalette() {
      if (currentColors.length === 0) {
          showNotification('No palette to save. Generate a palette first.', 'warning');
          return;
      }
      
      // Prompt for palette name
      const paletteName = prompt('Enter a name for this palette:', `Palette ${savedPalettes.length + 1}`);
      
      if (paletteName === null) return; // User cancelled
      
      if (paletteName.trim() === '') {
          showNotification('Please enter a valid name for your palette.', 'warning');
          return;
      }
      
      // Create palette object
      const palette = {
          id: Date.now(),
          name: paletteName,
          colors: [...currentColors],
          type: paletteTypeSelect.value,
          date: new Date().toISOString()
      };
      
      // Add to saved palettes
      savedPalettes.push(palette);
      
      // Save to local storage
      savePalettesToStorage();
      
      // Render saved palettes
      renderSavedPalettes();
      
      // Show notification
      showNotification(`Palette "${paletteName}" saved successfully!`, 'success');
      
      // Track event
      trackEvent('palette_saved', paletteTypeSelect.value, currentColors.length);
  }
  
  // Function to render saved palettes
  function renderSavedPalettes() {
      // Clear previous palettes
      savedPalettesContainer.innerHTML = '';
      
      // Show message if no palettes
      if (savedPalettes.length === 0) {
          const message = document.createElement('div');
          message.className = 'no-palettes-message';
          message.innerHTML = `
              <i class="fas fa-bookmark"></i>
              <p>You haven't saved any palettes yet</p>
              <p class="small">Click "Save Palette" to store your color schemes here</p>
          `;
          savedPalettesContainer.appendChild(message);
          return;
      }
      
      // Create palettes
      savedPalettes.forEach(palette => {
          const paletteElement = document.createElement('div');
          paletteElement.className = 'saved-palette';
          paletteElement.setAttribute('data-id', palette.id);
          
          // Create palette header
          const header = document.createElement('div');
          header.className = 'saved-palette-header';
          
          // Create palette name
          const name = document.createElement('h4');
          name.className = 'saved-palette-name';
          name.textContent = palette.name;
          
          // Create palette actions
          const actions = document.createElement('div');
          actions.className = 'saved-palette-actions';
          
          // Create load button
          const loadBtn = document.createElement('button');
          loadBtn.className = 'palette-action-btn';
          loadBtn.setAttribute('title', 'Load Palette');
          loadBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
          loadBtn.addEventListener('click', function(e) {
              e.stopPropagation();
              loadPalette(palette.id);
          });
          
          // Create delete button
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'palette-action-btn';
          deleteBtn.setAttribute('title', 'Delete Palette');
          deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
          deleteBtn.addEventListener('click', function(e) {
              e.stopPropagation();
              deletePalette(palette.id);
          });
          
          // Append buttons to actions
          actions.appendChild(loadBtn);
          actions.appendChild(deleteBtn);
          
          // Append name and actions to header
          header.appendChild(name);
          header.appendChild(actions);
          
          // Create palette colors
          const colors = document.createElement('div');
          colors.className = 'saved-palette-colors';
          
          // Add color swatches
          palette.colors.forEach(color => {
              const colorElement = document.createElement('div');
              colorElement.className = 'saved-color';
              colorElement.style.backgroundColor = color;
              colorElement.setAttribute('title', color.toUpperCase());
              colors.appendChild(colorElement);
          });
          
          // Append header and colors to palette
          paletteElement.appendChild(header);
          paletteElement.appendChild(colors);
          
          // Add click event to load palette
          paletteElement.addEventListener('click', function() {
              loadPalette(palette.id);
          });
          
          // Append palette to container
          savedPalettesContainer.appendChild(paletteElement);
      });
  }
  
  // Function to load a saved palette
  function loadPalette(id) {
      const palette = savedPalettes.find(p => p.id === id);
      
      if (!palette) {
          showNotification('Palette not found.', 'error');
          return;
      }
      
      // Set current colors
      currentColors = [...palette.colors];
      
      // Render current palette
      renderCurrentPalette();
      
      // Update code blocks
      updateCodeBlocks();
      
      // Show notification
      showNotification(`Palette "${palette.name}" loaded successfully!`, 'success');
      
      // Track event
      trackEvent('palette_loaded', palette.type, palette.colors.length);
  }
  
  // Function to delete a saved palette
  function deletePalette(id) {
      const paletteIndex = savedPalettes.findIndex(p => p.id === id);
      
      if (paletteIndex === -1) {
          showNotification('Palette not found.', 'error');
          return;
      }
      
      // Confirm deletion
      const palette = savedPalettes[paletteIndex];
      const confirmDelete = confirm(`Are you sure you want to delete "${palette.name}"?`);
      
      if (!confirmDelete) return;
      
      // Remove palette
      savedPalettes.splice(paletteIndex, 1);
      
      // Save to local storage
      savePalettesToStorage();
      
      // Render saved palettes
      renderSavedPalettes();
      
      // Show notification
      showNotification(`Palette "${palette.name}" deleted successfully.`, 'success');
      
      // Track event
      trackEvent('palette_deleted', palette.type, palette.colors.length);
  }
  
  // Function to save palettes to local storage
  function savePalettesToStorage() {
      try {
          localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
      } catch (e) {
          console.error('Error saving to local storage:', e);
          showNotification('Error saving palettes. Local storage may be full or disabled.', 'error');
      }
  }
  
  // Function to load saved palettes from local storage
  function loadSavedPalettes() {
      try {
          const palettes = localStorage.getItem('colorPalettes');
          
          if (palettes) {
              savedPalettes = JSON.parse(palettes);
              renderSavedPalettes();
          }
      } catch (e) {
          console.error('Error loading from local storage:', e);
          showNotification('Error loading saved palettes from local storage.', 'error');
      }
  }
  
  // Function to switch tabs
  function switchTab(tabId) {
      // Remove active class from all tabs
      document.querySelectorAll('.tab-btn').forEach(btn => {
          btn.classList.remove('active');
      });
      
      document.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.remove('active');
      });
      
      // Add active class to selected tab
      document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
      document.getElementById(tabId).classList.add('active');
  }
  
  // Function to copy text to clipboard
  function copyToClipboard(elementId, text) {
      let textToCopy;
      
      if (elementId) {
          const element = document.getElementById(elementId);
          textToCopy = element.textContent;
      } else if (text) {
          textToCopy = text;
      } else {
          return;
      }
      
      // Create temporary textarea
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed'; // Avoid scrolling to bottom
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
          const successful = document.execCommand('copy');
          
          if (successful) {
              showNotification(`Copied ${text ? text : 'codes'} to clipboard!`, 'success');
              
              // Track event
              trackEvent('copied_to_clipboard', elementId || 'color_value', textToCopy.length);
          } else {
              showNotification('Failed to copy. Please try again.', 'error');
          }
      } catch (err) {
          console.error('Error copying text to clipboard:', err);
          showNotification('Failed to copy. Please try again.', 'error');
      }
      
      document.body.removeChild(textarea);
  }
  
  // Function to show export options
  function showExportOptions() {
      if (currentColors.length === 0) {
          showNotification('No palette to export. Generate a palette first.', 'warning');
          return;
      }
      
      // For now, just offer to copy all formats
      const formats = ['HEX', 'RGB', 'HSL', 'CSS', 'SASS'];
      const formatStr = formats.join(', ');
      
      const confirmExport = confirm(`Export palette in the following formats?\n${formatStr}`);
      
      if (confirmExport) {
          // Create export text
          let exportText = `Color Palette Export\n`;
          exportText += `Date: ${new Date().toLocaleDateString()}\n\n`;
          
          // Add HEX values
          exportText += `HEX Values:\n`;
          currentColors.forEach((color, index) => {
              exportText += `Color ${index + 1}: ${color.toUpperCase()}\n`;
          });
          exportText += `\n`;
          
          // Add RGB values
          exportText += `RGB Values:\n`;
          currentColors.forEach((color, index) => {
              const rgb = hexToRgb(color);
              exportText += `Color ${index + 1}: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\n`;
          });
          exportText += `\n`;
          
          // Add HSL values
          exportText += `HSL Values:\n`;
          currentColors.forEach((color, index) => {
              const hsl = hexToHSL(color);
              exportText += `Color ${index + 1}: hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)\n`;
          });
          exportText += `\n`;
          
          // Add CSS variables
          exportText += `CSS Variables:\n`;
          exportText += `:root {\n`;
          currentColors.forEach((color, index) => {
              exportText += `  --color-${index + 1}: ${color.toUpperCase()};\n`;
          });
          exportText += `}\n\n`;
          
          // Add SASS variables
          exportText += `SASS Variables:\n`;
          currentColors.forEach((color, index) => {
              exportText += `$color-${index + 1}: ${color.toUpperCase()};\n`;
          });
          
          // Copy to clipboard
          copyToClipboard(null, exportText);
          
          // Track event
          trackEvent('palette_exported', 'all_formats', currentColors.length);
      }
  }
  
  // Function to show notification
  function showNotification(message, type = 'info', duration = 3000) {
      // Set icon based on type
      const iconClass = type === 'success' ? 'fa-check-circle' :
                       type === 'error' ? 'fa-exclamation-circle' :
                       type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
      
      // Update notification content
      notificationToast.querySelector('.notification-icon i').className = `fas ${iconClass}`;
      notificationText.textContent = message;
      
      // Set notification class
      notificationToast.className = `notification-toast ${type}`;
      
      // Show notification
      notificationToast.classList.add('show');
      
      // Hide notification after duration
      setTimeout(() => {
          notificationToast.classList.remove('show');
      }, duration);
  }
  
  // Function to track events for analytics
  function trackEvent(action, category, label) {
      try {
          // Check if gtag is available
          if (typeof gtag !== 'undefined') {
              gtag('event', action, {
                  'event_category': category,
                  'event_label': String(label)
              });
          }
          
          // You can add other analytics providers here
      } catch (e) {
          console.log('Analytics not available or blocked');
      }
  }
  
  // Color utility functions
  
  // Function to convert HEX to RGB
  function hexToRgb(hex) {
      // Remove # if present
      hex = hex.replace(/^#/, '');
      
      // Parse hex to RGB
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      
      return { r, g, b };
  }
  
  // Function to convert HEX to HSL
  function hexToHSL(hex) {
      // Convert hex to RGB
      const { r, g, b } = hexToRgb(hex);
      
      // Convert RGB to HSL
      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;
      
      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      let h, s, l = (max + min) / 2;
      
      if (max === min) {
          // Achromatic
          h = s = 0;
      } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
              case rNorm:
                  h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
                  break;
              case gNorm:
                  h = (bNorm - rNorm) / d + 2;
                  break;
              case bNorm:
                  h = (rNorm - gNorm) / d + 4;
                  break;
          }
          
          h /= 6;
      }
      
      // Convert h to degrees
      h = Math.round(h * 360);
      
      return { h, s, l };
  }
  
  // Function to convert HSL to HEX
  function hslToHex(h, s, l) {
      // Ensure h is between 0 and 360
      h = h < 0 ? h + 360 : h % 360;
      
      // Convert HSL to RGB
      let r, g, b;
      
      if (s === 0) {
          // Achromatic
          r = g = b = l;
      } else {
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          
          r = hueToRgb(p, q, h / 360 + 1/3);
          g = hueToRgb(p, q, h / 360);
          b = hueToRgb(p, q, h / 360 - 1/3);
      }
      
      // Convert RGB to HEX
      const toHex = (x) => {
          const hex = Math.round(x * 255).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
      };
      
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  
  // Helper function for HSL to RGB conversion
  function hueToRgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      
      return p;
  }
  
  // Function to get a simple color name from HEX
  function getColorName(hex) {
      const { h, s, l } = hexToHSL(hex);
      
      // Very dark colors (almost black)
      if (l < 0.1) return "Black";
      
      // Very light colors (almost white)
      if (l > 0.9) return "White";
      
      // Very desaturated colors (grayscale)
      if (s < 0.1) {
          if (l < 0.3) return "Dark Gray";
          if (l < 0.6) return "Gray";
          return "Light Gray";
      }
      
      // Determine base color name by hue
      let colorName;
      
      if (h < 15 || h >= 345) colorName = "Red";
      else if (h < 45) colorName = "Orange";
      else if (h < 75) colorName = "Yellow";
      else if (h < 105) colorName = "Lime";
      else if (h < 135) colorName = "Green";
      else if (h < 165) colorName = "Teal";
      else if (h < 195) colorName = "Cyan";
      else if (h < 225) colorName = "Blue";
      else if (h < 255) colorName = "Indigo";
      else if (h < 285) colorName = "Purple";
      else if (h < 315) colorName = "Magenta";
      else colorName = "Pink";
      
      // Add lightness/darkness modifier
      let modifier = "";
      
      if (l < 0.3) modifier = "Dark ";
      else if (l > 0.7) modifier = "Light ";
      
      // Add saturation modifier for highly saturated colors
      if (s > 0.8 && l > 0.3 && l < 0.7) modifier = "Bright ";
      
      return modifier + colorName;
  }
});

// Trigger analytics pageview on load
window.addEventListener('load', function() {
  try {
      if (typeof gtag !== 'undefined') {
          gtag('event', 'page_view', {
              'page_title': document.title,
              'page_location': window.location.href,
              'page_path': window.location.pathname
          });
      }
  } catch (e) {
      console.log('Analytics not available or blocked');
  }
});