document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const qrText = document.getElementById('qr-text');
    const qrSize = document.getElementById('qr-size');
    const qrColor = document.getElementById('qr-color');
    const qrBgColor = document.getElementById('qr-bg-color');
    const qrErrorCorrection = document.getElementById('qr-error-correction');
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const downloadPngBtn = document.getElementById('download-png-btn');
    const downloadSvgBtn = document.getElementById('download-svg-btn');
    const qrPreview = document.getElementById('qr-preview');
    const templateBtns = document.querySelectorAll('.template-btn');
    
    // QR Code instance
    let qrCode = null;
    
    // Event Listeners
    generateBtn.addEventListener('click', generateQRCode);
    clearBtn.addEventListener('click', clearForm);
    downloadPngBtn.addEventListener('click', downloadQRAsPNG);
    downloadSvgBtn.addEventListener('click', downloadQRAsSVG);
    
    // Set up template buttons
    templateBtns.forEach(btn => {
      btn.addEventListener('click', () => loadTemplate(btn.dataset.template));
    });
    
    // Initial check
    checkInput();
    qrText.addEventListener('input', checkInput);
    
    // Check if input has content
    function checkInput() {
      const isEmpty = qrText.value.trim() === '';
      generateBtn.disabled = isEmpty;
      
      if (isEmpty) {
        clearBtn.disabled = true;
      } else {
        clearBtn.disabled = false;
      }
    }
    
    // Generate QR Code
    function generateQRCode() {
      const text = qrText.value.trim();
      
      if (!text) {
        showNotification('Please enter some text or URL', 'error');
        return;
      }
      
      // Clear previous QR code
      qrPreview.innerHTML = '';
      
      // Set options for QR code
      const options = {
        text: text,
        width: parseInt(qrSize.value),
        height: parseInt(qrSize.value),
        colorDark: qrColor.value,
        colorLight: qrBgColor.value,
        correctLevel: QRCode.CorrectLevel[qrErrorCorrection.value]
      };
      
      try {
        // Create new QR code
        qrCode = new QRCode(qrPreview, options);
        
        // Enable download buttons
        downloadPngBtn.disabled = false;
        downloadSvgBtn.disabled = false;
        
        showNotification('QR Code generated successfully!', 'success');
      } catch (error) {
        console.error('Error generating QR code:', error);
        showNotification('Failed to generate QR code. Please try again.', 'error');
      }
    }
    
    // Clear the form
    function clearForm() {
      qrText.value = '';
      qrPreview.innerHTML = '';
      
      // Add placeholder back
      const placeholder = document.createElement('div');
      placeholder.className = 'qr-placeholder';
      placeholder.innerHTML = `
        <i class="fas fa-qrcode"></i>
        <p>Your QR code will appear here</p>
      `;
      qrPreview.appendChild(placeholder);
      
      // Reset options to defaults
      qrSize.value = '200';
      qrColor.value = '#7000ff';
      qrBgColor.value = '#ffffff';
      qrErrorCorrection.value = 'M';
      
      // Disable buttons
      generateBtn.disabled = true;
      clearBtn.disabled = true;
      downloadPngBtn.disabled = true;
      downloadSvgBtn.disabled = true;
      
      // Reset check
      checkInput();
    }
    
    // Download QR code as PNG
    function downloadQRAsPNG() {
      if (!qrCode) {
        showNotification('Please generate a QR code first', 'error');
        return;
      }
      
      try {
        // Find the canvas element
        const canvas = qrPreview.querySelector('canvas');
        
        if (!canvas) {
          showNotification('Could not find QR code canvas', 'error');
          return;
        }
        
        // Convert to data URL
        const dataURL = canvas.toDataURL('image/png');
        
        // Create filename based on text content
        let filename = qrText.value.trim().substring(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        if (filename.length === 0) {
          filename = 'qrcode';
        }
        
        filename += '.png';
        
        // Create download link
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('QR code downloaded as PNG', 'success');
      } catch (error) {
        console.error('Error downloading PNG:', error);
        showNotification('Failed to download QR code', 'error');
      }
    }
    
    // Download QR code as SVG
    function downloadQRAsSVG() {
      if (!qrCode) {
        showNotification('Please generate a QR code first', 'error');
        return;
      }
      
      try {
        // Get the QR code SVG
        const svgElement = qrPreview.querySelector('svg');
        
        if (!svgElement) {
          showNotification('Could not find QR code SVG', 'error');
          return;
        }
        
        // Prepare SVG content
        const svgContent = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        // Create filename based on text content
        let filename = qrText.value.trim().substring(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        if (filename.length === 0) {
          filename = 'qrcode';
        }
        
        filename += '.svg';
        
        // Create download link
        const link = document.createElement('a');
        link.href = svgUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(svgUrl);
        
        showNotification('QR code downloaded as SVG', 'success');
      } catch (error) {
        console.error('Error downloading SVG:', error);
        showNotification('Failed to download QR code as SVG', 'error');
      }
    }
    
    // Load templates
    function loadTemplate(template) {
      let text = '';
      
      switch (template) {
        case 'url':
          text = 'https://www.example.com';
          break;
          
        case 'email':
          text = 'mailto:email@example.com?subject=Subject%20here&body=Message%20body%20here';
          break;
          
        case 'wifi':
          text = 'WIFI:S:NetworkName;T:WPA;P:Password;;';
          break;
          
        case 'vcard':
          text = 'BEGIN:VCARD\nVERSION:3.0\nN:Doe;John;;;\nFN:John Doe\nTITLE:Designer\nTEL;TYPE=CELL:+123456789\nEMAIL:john@example.com\nURL:https://www.example.com\nEND:VCARD';
          break;
      }
      
      qrText.value = text;
      checkInput();
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
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
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    }
  });