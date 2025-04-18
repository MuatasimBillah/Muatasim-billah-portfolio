document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const paletteTypeSelect = document.getElementById('palette-type');
    const colorCountSelect = document.getElementById('color-count');
    const baseColorInput = document.getElementById('base-color');
    const generateBtn = document.getElementById('generate-btn');
    const saveBtn = document.getElementById('save-btn');
    const currentPalette = document.getElementById('current-palette');
    const webCode = document.getElementById('web-code');
    const cssCode = document.getElementById('css-code');
    const sassCode = document.getElementById('sass-code');
    const sketchCode = document.getElementById('sketch-code');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const copyBtns = document.querySelectorAll('.copy-btn');
    const savedPalettesList = document.getElementById('saved-palettes-list');
    const noPalettesMessage = document.getElementById('no-palettes-message');
    
    // Variables
    let currentColors = [];
    let savedPalettes = JSON.parse(localStorage.getItem('savedPalettes')) || [];
    
    // Show saved palettes on load
    updateSavedPalettes();
    
    // Generate initial palette
    generatePalette();
    
    // Event listeners
    generateBtn.addEventListener('click', generatePalette);
    saveBtn.addEventListener('click', savePalette);
    
    // Tab switching
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        this.classList.add('active');
        document.getElementById(this.dataset.tab).classList.add('active');
      });
    });
    
    // Copy code buttons
    copyBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const codeElement = document.getElementById(this.dataset.target);
        const textToCopy = codeElement.textContent;
        
        navigator.clipboard.writeText(textToCopy)
          .then(() => showNotification('Code copied to clipboard!', 'success'))
          .catch(err => showNotification('Failed to copy code.', 'error'));
      });
    });
    
    // Generate color palette
    function generatePalette() {
      const paletteType = paletteTypeSelect.value;
      const colorCount = parseInt(colorCountSelect.value);
      const baseColor = baseColorInput.value;
      
      // Generate colors based on palette type
      currentColors = generateColors(paletteType, baseColor, colorCount);
      
      // Update palette display
      updatePaletteDisplay(currentColors);
      
      // Update code snippets
      updateCodeSnippets(currentColors);
    }
    
    // Save current palette
    function savePalette() {
      if (currentColors.length === 0) {
        showNotification('No palette to save!', 'error');
        return;
      }
      
      const paletteName = `Palette #${savedPalettes.length + 1}`;
      
      const palette = {
        id: Date.now(),
        name: paletteName,
        colors: currentColors
      };
      
      savedPalettes.push(palette);
      localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
      
      updateSavedPalettes();
      showNotification('Palette saved!', 'success');
    }
    
    // Update saved palettes display
    function updateSavedPalettes() {
      if (savedPalettes.length === 0) {
        noPalettesMessage.style.display = 'block';
        return;
      }
      
      noPalettesMessage.style.display = 'none';
      savedPalettesList.innerHTML = '';
      
      savedPalettes.forEach(palette => {
        const paletteItem = document.createElement('div');
        paletteItem.className = 'saved-palette-item';
        
        // Create palette colors display
        const colorsDiv = document.createElement('div');
        colorsDiv.className = 'saved-palette-colors';
        
        palette.colors.forEach(color => {
          const swatch = document.createElement('div');
          swatch.className = 'color-swatch';
          swatch.style.backgroundColor = color;
          colorsDiv.appendChild(swatch);
        });
        
        // Create palette info
        const infoDiv = document.createElement('div');
        infoDiv.className = 'saved-palette-info';
        
        const nameEl = document.createElement('h4');
        nameEl.className = 'saved-palette-name';
        nameEl.textContent = palette.name;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'saved-palette-actions';
        
        // Load button
        const loadBtn = document.createElement('button');
        loadBtn.className = 'palette-action-btn load';
        loadBtn.title = 'Load palette';
        loadBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        loadBtn.addEventListener('click', () => loadPalette(palette));
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'palette-action-btn delete';
        deleteBtn.title = 'Delete palette';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', () => deletePalette(palette.id));
        
        actionsDiv.appendChild(loadBtn);
        actionsDiv.appendChild(deleteBtn);
        
        infoDiv.appendChild(nameEl);
        infoDiv.appendChild(actionsDiv);
        
        // Assemble palette item
        paletteItem.appendChild(colorsDiv);
        paletteItem.appendChild(infoDiv);
        
        savedPalettesList.appendChild(paletteItem);
      });
    }
    
    // Load a saved palette
    function loadPalette(palette) {
      currentColors = [...palette.colors];
      updatePaletteDisplay(currentColors);
      updateCodeSnippets(currentColors);
      
      // Try to update the base color input if possible
      try {
        baseColorInput.value = palette.colors[0];
      } catch (e) {
        console.error('Could not update base color input:', e);
      }
      
      showNotification('Palette loaded!', 'success');
    }
    
    // Delete a saved palette
    function deletePalette(id) {
      savedPalettes = savedPalettes.filter(palette => palette.id !== id);
      localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
      updateSavedPalettes();
      showNotification('Palette deleted!', 'success');
    }
    
    // Update the current palette display
    function updatePaletteDisplay(colors) {
      currentPalette.innerHTML = '';
      
      colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        
        const info = document.createElement('div');
        info.className = 'color-swatch-info';
        info.textContent = color.toUpperCase();
        info.title = 'Click to copy';
        
        info.addEventListener('click', () => {
          navigator.clipboard.writeText(color)
            .then(() => showNotification(`Color ${color} copied!`, 'success'))
            .catch(err => showNotification('Failed to copy color.', 'error'));
        });
        
        swatch.appendChild(info);
        currentPalette.appendChild(swatch);
      });
    }
    
    // Update code snippets for different formats
    function updateCodeSnippets(colors) {
      // Web hex codes
      webCode.textContent = colors.map(color => color.toUpperCase()).join('\n');
      
      // CSS variables
      cssCode.textContent = `:root {\n${colors.map((color, i) => `  --color-${i + 1}: ${color.toUpperCase()};`).join('\n')}\n}`;
      
      // SASS variables
      sassCode.textContent = colors.map((color, i) => `$color-${i + 1}: ${color.toUpperCase()};`).join('\n');
      
      // Sketch color variables
      sketchCode.textContent = colors.map((color, i) => `Color ${i + 1}: ${color.toUpperCase()}`).join('\n');
    }
    
    // Show notification
    function showNotification(message, type) {
      // Remove any existing notification
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
        document.body.removeChild(existingNotification);
      }
      
      // Create new notification
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      // Show notification
      setTimeout(() => {
        notification.classList.add('show');
      }, 10);
      
      // Hide after 3 seconds
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }
    
    // Color generation functions
    function generateColors(type, baseColor, count) {
      // Convert base color from hex to HSL
      const baseHSL = hexToHSL(baseColor);
      
      switch (type) {
        case 'monochromatic':
          return generateMonochromaticColors(baseHSL, count);
        case 'analogous':
          return generateAnalogousColors(baseHSL, count);
        case 'complementary':
          return generateComplementaryColors(baseHSL, count);
        case 'triadic':
          return generateTriadicColors(baseHSL, count);
        case 'tetradic':
          return generateTetradicColors(baseHSL, count);
        case 'random':
        default:
          return generateRandomColors(count);
      }
    }
    
    function generateRandomColors(count) {
      const colors = [];
      for (let i = 0; i < count; i++) {
        colors.push(getRandomHexColor());
      }
      return colors;
    }
    
    function generateMonochromaticColors(baseHSL, count) {
      const colors = [];
      const { h, s, l } = baseHSL;
      
      // Generate variations by adjusting lightness
      for (let i = 0; i < count; i++) {
        const newL = Math.max(10, Math.min(90, l - 30 + (i * 60 / count)));
        colors.push(hslToHex(h, s, newL));
      }
      
      return colors;
    }
    
    function generateAnalogousColors(baseHSL, count) {
      const colors = [];
      const { h, s, l } = baseHSL;
      const hueStep = 30;
      
      const startHue = (h - (Math.floor(count / 2) * hueStep) + 360) % 360;
      
      for (let i = 0; i < count; i++) {
        const newH = (startHue + (i * hueStep)) % 360;
        colors.push(hslToHex(newH, s, l));
      }
      
      return colors;
    }
    
    function generateComplementaryColors(baseHSL, count) {
      const colors = [];
      const { h, s, l } = baseHSL;
      
      // The complementary color is 180 degrees away on the color wheel
      const complementH = (h + 180) % 360;
      
      // Add colors between the base and its complement
      for (let i = 0; i < count; i++) {
        const ratio = i / (count - 1);
        const newH = Math.round(h + (ratio * 180)) % 360;
        const newS = s;
        const newL = l;
        
        colors.push(hslToHex(newH, newS, newL));
      }
      
      return colors;
    }
    
    function generateTriadicColors(baseHSL, count) {
      const colors = [];
      const { h, s, l } = baseHSL;
      
      // Triadic colors are 120 degrees apart
      const triad1 = (h + 120) % 360;
      const triad2 = (h + 240) % 360;
      
      if (count < 3) {
        // If less than 3 colors requested, just return what we can
        colors.push(hslToHex(h, s, l));
        if (count > 1) colors.push(hslToHex(triad1, s, l));
        return colors;
      }
      
      // First color is the base
      colors.push(hslToHex(h, s, l));
      
      // Distribute remaining colors between the triadic points
      const step1 = Math.floor((count - 1) / 2);
      const step2 = count - 1 - step1;
      
      for (let i = 1; i <= step1; i++) {
        const ratio = i / (step1 + 1);
        const newH = Math.round(h + (ratio * 120)) % 360;
        colors.push(hslToHex(newH, s, l));
      }
      
      colors.push(hslToHex(triad1, s, l));
      
      for (let i = 1; i <= step2; i++) {
        const ratio = i / (step2 + 1);
        const newH = Math.round(triad1 + (ratio * 120)) % 360;
        colors.push(hslToHex(newH, s, l));
      }
      
      return colors;
    }
    
    function generateTetradicColors(baseHSL, count) {
      const colors = [];
      const { h, s, l } = baseHSL;
      
      // Tetradic colors form a rectangle on the color wheel (90 degrees apart)
      const tetrad1 = (h + 90) % 360;
      const tetrad2 = (h + 180) % 360;
      const tetrad3 = (h + 270) % 360;
      
      // Generate the four main colors
      const mainColors = [
        hslToHex(h, s, l),
        hslToHex(tetrad1, s, l),
        hslToHex(tetrad2, s, l),
        hslToHex(tetrad3, s, l)
      ];
      
      // If count <= 4, return just what we need
      if (count <= 4) {
        return mainColors.slice(0, count);
      }
      
      // Add all four main colors
      colors.push(...mainColors);
      
      // Add intermediate colors as needed
      const remaining = count - 4;
      const hueStep = 360 / remaining;
      
      for (let i = 0; i < remaining; i++) {
        const newH = (h + (i * hueStep)) % 360;
        colors.push(hslToHex(newH, s, l));
      }
      
      return colors;
    }
    
    // Utility functions for color conversion
    function getRandomHexColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    
    function hexToHSL(hex) {
      // Remove the # if present
      hex = hex.replace(/^#/, '');
      
      // Parse the hex values
      let r = parseInt(hex.substring(0, 2), 16) / 255;
      let g = parseInt(hex.substring(2, 4), 16) / 255;
      let b = parseInt(hex.substring(4, 6), 16) / 255;
      
      // Find min and max
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      
      // Calculate lightness
      let l = (max + min) / 2;
      
      let h, s;
      
      if (max === min) {
        // Achromatic
        h = 0;
        s = 0;
      } else {
        // Calculate saturation
        s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
        
        // Calculate hue
        switch (max) {
          case r:
            h = ((g - b) / (max - min) + (g < b ? 6 : 0)) * 60;
            break;
          case g:
            h = ((b - r) / (max - min) + 2) * 60;
            break;
          case b:
            h = ((r - g) / (max - min) + 4) * 60;
            break;
        }
      }
      
      return {
        h: Math.round(h),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    }
    
    function hslToHex(h, s, l) {
      // Convert HSL to RGB first
      s /= 100;
      l /= 100;
      
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      
      let r, g, b;
      
      if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
      } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
      } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
      } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
      } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
      } else {
        r = c; g = 0; b = x;
      }
      
      r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
      g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
      b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
      
      return `#${r}${g}${b}`;
    }
  });