/**
 * Barcode Generator Tool
 * Client-side barcode generation with JsBarcode
 * 
 * This script handles:
 * 1. Barcode generation with various formats
 * 2. Live preview updates
 * 3. Form field validation
 * 4. Download functionality (PNG, SVG, PDF)
 * 5. FAQ toggle functionality
 */

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Show preloader
    if (typeof showPreloader === 'function') {
        showPreloader();
    }

    // Initialize variables with DOM elements
    const barcodeType = document.getElementById('barcodeType');
    const barcodeValue = document.getElementById('barcodeValue');
    const barcodeWidth = document.getElementById('barcodeWidth');
    const barcodeHeight = document.getElementById('barcodeHeight');
    const barcodeMargin = document.getElementById('barcodeMargin');
    const barcodeBgColor = document.getElementById('barcodeBgColor');
    const barcodeBgColorText = document.getElementById('barcodeBgColorText');
    const barcodeFgColor = document.getElementById('barcodeFgColor');
    const barcodeFgColorText = document.getElementById('barcodeFgColorText');
    const displayText = document.getElementById('displayText');
    const textAlign = document.getElementById('textAlign');
    const textPosition = document.getElementById('textPosition');
    const textMargin = document.getElementById('textMargin');
    const textOptionsContainer = document.getElementById('textOptionsContainer');
    const generateBtn = document.getElementById('generateBtn');
    const downloadPng = document.getElementById('downloadPng');
    const downloadSvg = document.getElementById('downloadSvg');
    const downloadPdf = document.getElementById('downloadPdf');
    const barcodePreview = document.getElementById('barcodePreview');
    const errorContainer = document.getElementById('errorContainer');
    const valueHelp = document.getElementById('valueHelp');
    const faqItems = document.querySelectorAll('.faq-item');

    // Initialize - disable download buttons until barcode is generated
    downloadPng.disabled = true;
    downloadSvg.disabled = true;
    downloadPdf.disabled = true;

    /**
     * Sync color input fields
     */
    barcodeBgColor.addEventListener('input', function() {
        barcodeBgColorText.value = this.value.toUpperCase();
    });

    barcodeBgColorText.addEventListener('input', function() {
        if (this.value.match(/^#[0-9A-Fa-f]{6}$/)) {
            barcodeBgColor.value = this.value;
        }
    });

    barcodeFgColor.addEventListener('input', function() {
        barcodeFgColorText.value = this.value.toUpperCase();
    });

    barcodeFgColorText.addEventListener('input', function() {
        if (this.value.match(/^#[0-9A-Fa-f]{6}$/)) {
            barcodeFgColor.value = this.value;
        }
    });

    /**
     * Toggle text options display
     */
    displayText.addEventListener('change', function() {
        textOptionsContainer.style.display = this.checked ? 'flex' : 'none';
    });

    /**
     * Update helper text based on selected barcode type
     */
    barcodeType.addEventListener('change', function() {
        updateHelperText();
        // Try to generate a barcode with the new type
        generateBarcode();
    });

    /**
     * Update values when inputs change
     */
    const inputElements = [barcodeValue, barcodeWidth, barcodeHeight, barcodeMargin, 
                          textAlign, textPosition, textMargin, displayText];
    
    inputElements.forEach(element => {
        if (element) {
            element.addEventListener('change', generateBarcode);
        }
    });

    /**
     * Function to update helper text based on barcode type
     */
    function updateHelperText() {
        switch(barcodeType.value) {
            case 'upc':
                valueHelp.textContent = 'Enter 11 or 12 digits (last digit is checksum)';
                if (!barcodeValue.value.match(/^\d{11,12}$/)) {
                    barcodeValue.value = '123456789012';
                }
                break;
            case 'ean13':
                valueHelp.textContent = 'Enter 12 or 13 digits (last digit is checksum)';
                if (!barcodeValue.value.match(/^\d{12,13}$/)) {
                    barcodeValue.value = '5901234123457';
                }
                break;
            case 'ean8':
                valueHelp.textContent = 'Enter 7 or 8 digits (last digit is checksum)';
                if (!barcodeValue.value.match(/^\d{7,8}$/)) {
                    barcodeValue.value = '96385074';
                }
                break;
            case 'code128':
                valueHelp.textContent = 'Enter any ASCII characters';
                if (barcodeValue.value.length === 0) {
                    barcodeValue.value = 'MB1234567890';
                }
                break;
            case 'code39':
                valueHelp.textContent = 'Enter uppercase letters, numbers, and special characters (-, ., $, /, +, %, space)';
                if (!barcodeValue.value.match(/^[A-Z0-9\-\.\$\/\+\% ]+$/)) {
                    barcodeValue.value = 'MB12345-67890';
                }
                break;
            case 'itf14':
                valueHelp.textContent = 'Enter 14 digits';
                if (!barcodeValue.value.match(/^\d{14}$/)) {
                    barcodeValue.value = '15400141288763';
                }
                break;
            case 'codabar':
                valueHelp.textContent = 'Enter digits and special characters (-$:/+.). Start and end with A, B, C, or D';
                if (!barcodeValue.value.match(/^[A-D][0-9\-\$\:\/\.\+]+[A-D]$/)) {
                    barcodeValue.value = 'A123456A';
                }
                break;
            default:
                valueHelp.textContent = 'Enter data to encode in the barcode';
        }
    }

    /**
     * Generate barcode function
     */
    function generateBarcode() {
        // Hide any previous errors
        errorContainer.style.display = 'none';
        
        // Disable generate button during generation
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Generating...';
        
        // Slight delay to allow UI to update
        setTimeout(() => {
            try {
                // Clear previous barcode
                barcodePreview.innerHTML = '';
                
                // Create SVG element
                const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgElement.id = 'barcodeCanvas';
                barcodePreview.appendChild(svgElement);

                // Generate barcode with JsBarcode
                JsBarcode('#barcodeCanvas', barcodeValue.value, {
                    format: barcodeType.value,
                    width: parseInt(barcodeWidth.value),
                    height: parseInt(barcodeHeight.value),
                    margin: parseInt(barcodeMargin.value),
                    displayValue: displayText.checked,
                    background: barcodeBgColor.value,
                    lineColor: barcodeFgColor.value,
                    textAlign: textAlign.value,
                    textPosition: textPosition.value,
                    textMargin: parseInt(textMargin.value),
                    font: 'Inter',
                    fontSize: 16,
                    valid: function(valid) {
                        if (!valid) {
                            showError("Invalid input for this barcode type. Please check the format requirements.");
                            return false;
                        }
                        return true;
                    }
                });

                // Enable download buttons after successful generation
                downloadPng.disabled = false;
                downloadSvg.disabled = false;
                downloadPdf.disabled = false;
                
            } catch (error) {
                showError("Error generating barcode: " + error.message);
            } finally {
                // Re-enable generate button
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Generate Barcode';
            }
        }, 100);
    }

    /**
     * Show error message
     */
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        
        // If there's no barcode, add placeholder back
        if (!barcodePreview.querySelector('#barcodeCanvas')) {
            barcodePreview.innerHTML = '';
            const p = document.createElement('p');
            p.id = 'previewPlaceholder';
            p.textContent = 'Error: Could not generate barcode';
            barcodePreview.appendChild(p);
            
            // Disable download buttons
            downloadPng.disabled = true;
            downloadSvg.disabled = true;
            downloadPdf.disabled = true;
        }
    }

    /**
     * Download as PNG
     */
    function downloadAsPng() {
        try {
            const svg = document.getElementById('barcodeCanvas');
            if (!svg) {
                showError("Please generate a barcode first.");
                return;
            }
            
            const barcodeType = document.getElementById('barcodeType').value;
            const filename = `barcode-${barcodeType}-${Date.now()}.png`;
            
            // Create a canvas
            const canvas = document.createElement('canvas');
            const svgSize = svg.getBoundingClientRect();
            
            // Set canvas dimensions to match SVG
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;
            const ctx = canvas.getContext('2d');
            
            // Fill with background color
            ctx.fillStyle = barcodeBgColor.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Convert SVG to data URL
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
            const DOMURL = window.URL || window.webkitURL || window;
            const url = DOMURL.createObjectURL(svgBlob);
            
            // Draw SVG on canvas
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0);
                DOMURL.revokeObjectURL(url);
                
                // Convert canvas to PNG and download
                canvas.toBlob(function(blob) {
                    saveAs(blob, filename);
                });
            };
            img.src = url;
        } catch (error) {
            showError("Error downloading PNG: " + error.message);
        }
    }

    /**
     * Download as SVG
     */
    function downloadAsSvg() {
        try {
            const svg = document.getElementById('barcodeCanvas');
            if (!svg) {
                showError("Please generate a barcode first.");
                return;
            }
            
            const barcodeType = document.getElementById('barcodeType').value;
            const filename = `barcode-${barcodeType}-${Date.now()}.svg`;
            
            // Get SVG content
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
            
            // Download SVG
            saveAs(svgBlob, filename);
        } catch (error) {
            showError("Error downloading SVG: " + error.message);
        }
    }

    /**
     * Download as PDF
     */
    function downloadAsPdf() {
        try {
            const svg = document.getElementById('barcodeCanvas');
            if (!svg) {
                showError("Please generate a barcode first.");
                return;
            }
            
            const barcodeTypeValue = document.getElementById('barcodeType').value;
            const barcodeTypeText = document.getElementById('barcodeType').options[document.getElementById('barcodeType').selectedIndex].text;
            const filename = `barcode-${barcodeTypeValue}-${Date.now()}.pdf`;
            
            // Create canvas from SVG
            const svgSize = svg.getBoundingClientRect();
            const canvas = document.createElement('canvas');
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;
            const ctx = canvas.getContext('2d');
            
            // Fill with background color
            ctx.fillStyle = barcodeBgColor.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Convert SVG to data URL
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
            const DOMURL = window.URL || window.webkitURL || window;
            const url = DOMURL.createObjectURL(svgBlob);
            
            // Draw SVG on canvas
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0);
                DOMURL.revokeObjectURL(url);
                
                // Get image data from canvas
                const imgData = canvas.toDataURL('image/png');
                
                // Create PDF with jsPDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });
                
                // Calculate dimensions while maintaining aspect ratio
                const pdfWidth = 190; // mm
                const pdfHeight = (svgSize.height * pdfWidth) / svgSize.width;
                
                // Add image to PDF
                pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
                
                // Add barcode details
                pdf.setFontSize(10);
                pdf.text(`Barcode Type: ${barcodeTypeText}`, 10, pdfHeight + 20);
                pdf.text(`Value: ${barcodeValue.value}`, 10, pdfHeight + 25);
                pdf.text(`Generated on: ${new Date().toLocaleString()}`, 10, pdfHeight + 30);
                pdf.text('Generated with MB Tools Barcode Generator', 10, pdfHeight + 35);
                
                // Download PDF
                pdf.save(filename);
            };
            img.src = url;
        } catch (error) {
            showError("Error downloading PDF: " + error.message);
        }
    }

    /**
     * FAQ toggle functionality
     */
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Check if this FAQ is already active
            const isActive = item.classList.contains('active');
            
            // Close all FAQs first 
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // If the clicked FAQ wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    /**
     * Mobile menu toggle
     */
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
        });
    }

    // Event listeners for buttons
    generateBtn.addEventListener('click', generateBarcode);
    downloadPng.addEventListener('click', downloadAsPng);
    downloadSvg.addEventListener('click', downloadAsSvg);
    downloadPdf.addEventListener('click', downloadAsPdf);

    // Initialize with default barcode after slight delay
    // This ensures all scripts are loaded
    setTimeout(function() {
        // Initialize helper text
        updateHelperText();
        
        // Generate initial barcode
        generateBarcode();
        
        // Hide preloader
        if (typeof hidePreloader === 'function') {
            hidePreloader();
        }
    }, 500);
});