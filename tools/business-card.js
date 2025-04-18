document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navItems = document.querySelectorAll('.nav-item');
    const designSections = document.querySelectorAll('.design-section');
    const nextBtns = document.querySelectorAll('.form-next-btn');
    const prevBtns = document.querySelectorAll('.form-prev-btn');
    const fullNameInput = document.getElementById('full-name');
    const jobTitleInput = document.getElementById('job-title');
    const companyInput = document.getElementById('company');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const websiteInput = document.getElementById('website');
    const addressInput = document.getElementById('address');
    const bioInput = document.getElementById('bio');
    const bioCount = document.getElementById('bio-count');
    const photoInput = document.getElementById('photo-input');
    const photoPreview = document.getElementById('photo-preview');
    const removePhotoBtn = document.getElementById('remove-photo-btn');
    const linkedinInput = document.getElementById('linkedin');
    const twitterInput = document.getElementById('twitter');
    const instagramInput = document.getElementById('instagram');
    const facebookInput = document.getElementById('facebook');
    const githubInput = document.getElementById('github');
    const youtubeInput = document.getElementById('youtube');
    const behanceInput = document.getElementById('behance');
    const dribbbleInput = document.getElementById('dribbble');
    const templateOptions = document.querySelectorAll('.template-option');
    const colorOptions = document.querySelectorAll('.color-option');
    const customColorInput = document.getElementById('custom-color');
    const fontSelection = document.getElementById('font-selection');
    const fontPreview = document.getElementById('font-preview');
    const orientationOptions = document.querySelectorAll('.orientation-option');
    const showBordersCheckbox = document.getElementById('show-borders');
    const showShadowsCheckbox = document.getElementById('show-shadows');
    const showIconsCheckbox = document.getElementById('show-icons');
    const qrTypeSelect = document.getElementById('qr-type');
    const qrUrlGroup = document.getElementById('qr-url-group');
    const qrUrlInput = document.getElementById('qr-url');
    const qrForegroundInput = document.getElementById('qr-foreground');
    const qrSizeInput = document.getElementById('qr-size');
    const qrSizeValue = document.getElementById('qr-size-value');
    const qrPreview = document.getElementById('qr-preview');
    const regenerateQrBtn = document.getElementById('regenerate-qr-btn');
    const downloadQrBtn = document.getElementById('download-qr-btn');
    const cardPreviewFront = document.getElementById('card-preview-front');
    const cardPreviewBack = document.getElementById('card-preview-back');
    const cardPreviewWrapper = document.getElementById('card-preview-wrapper');
    const flipCardBtn = document.getElementById('flip-card-btn');
    const previewDownloadBtn = document.getElementById('preview-download-btn');
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const saveDesignBtn = document.getElementById('save-design-btn');
    const loadDesignBtn = document.getElementById('load-design-btn');
    const resetDesignBtn = document.getElementById('reset-design-btn');
    const downloadCardBtn = document.getElementById('download-card-btn');
    const finishBtn = document.getElementById('finish-btn');
    const saveModal = document.getElementById('save-modal');
    const loadModal = document.getElementById('load-modal');
    const downloadModal = document.getElementById('download-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const closeSaveModalBtn = document.getElementById('close-save-modal-btn');
    const closeLoadModalBtn = document.getElementById('close-load-modal-btn');
    const closeDownloadModalBtn = document.getElementById('close-download-modal-btn');
    const closeConfirmModalBtn = document.getElementById('close-confirm-modal-btn');
    const designNameInput = document.getElementById('design-name');
    const confirmSaveBtn = document.getElementById('confirm-save-btn');
    const cancelSaveBtn = document.getElementById('cancel-save-btn');
    const savedDesignsContainer = document.getElementById('saved-designs-container');
    const confirmTitle = document.getElementById('confirm-title');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmActionBtn = document.getElementById('confirm-action-btn');
    const cancelActionBtn = document.getElementById('cancel-action-btn');
    const downloadPngBtn = document.getElementById('download-png-btn');
    const downloadJpgBtn = document.getElementById('download-jpg-btn');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const downloadVcardBtn = document.getElementById('download-vcard-btn');
    
    // Variables
    let userPhoto = null;
    let currentTemplate = 'modern';
    let currentColor = 'blue';
    let currentFont = 'inter';
    let currentOrientation = 'landscape';
    let qrCodeData = null;
    let currentConfirmAction = null;
    
    // Initialize
    init();
    
    function init() {
      setupEventListeners();
      updateFontPreview();
      updateCardPreview();
      generateQRCode();
      loadFromLocalStorage();
    }
    
    function setupEventListeners() {
      navItems.forEach(item => {
        item.addEventListener('click', () => {
          activateTab(item.dataset.section);
        });
      });
      
      nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          activateTab(btn.dataset.next);
        });
      });
      
      prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          activateTab(btn.dataset.prev);
        });
      });
      
      bioInput.addEventListener('input', function() {
        bioCount.textContent = this.value.length;
        if (this.value.length > 100) {
          this.value = this.value.substring(0, 100);
          bioCount.textContent = 100;
        }
        updateCardPreview();
      });
      
      photoInput.addEventListener('change', handlePhotoUpload);
      removePhotoBtn.addEventListener('click', removePhoto);
      
      document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
        input.addEventListener('input', updateCardPreview);
      });
      
      templateOptions.forEach(option => {
        option.addEventListener('click', () => {
          selectTemplate(option.dataset.template);
        });
      });
      
      colorOptions.forEach(option => {
        if (!option.classList.contains('custom')) {
          option.addEventListener('click', () => {
            selectColor(option.dataset.color);
          });
        }
      });
      
      customColorInput.addEventListener('input', function() {
        selectCustomColor(this.value);
      });
      
      fontSelection.addEventListener('change', function() {
        selectFont(this.value);
      });
      
      orientationOptions.forEach(option => {
        option.addEventListener('click', () => {
          selectOrientation(option.dataset.orientation);
        });
      });
      
      showBordersCheckbox.addEventListener('change', updateCardPreview);
      showShadowsCheckbox.addEventListener('change', updateCardPreview);
      showIconsCheckbox.addEventListener('change', updateCardPreview);
      
      qrTypeSelect.addEventListener('change', function() {
        if (this.value === 'url') {
          qrUrlGroup.style.display = 'block';
        } else {
          qrUrlGroup.style.display = 'none';
        }
        generateQRCode();
      });
      
      qrUrlInput.addEventListener('input', generateQRCode);
      qrForegroundInput.addEventListener('input', generateQRCode);
      qrSizeInput.addEventListener('input', function() {
        qrSizeValue.textContent = this.value;
        generateQRCode();
      });
      
      regenerateQrBtn.addEventListener('click', generateQRCode);
      downloadQrBtn.addEventListener('click', downloadQRCode);
      
      flipCardBtn.addEventListener('click', flipCard);
      previewDownloadBtn.addEventListener('click', showDownloadModal);
      
      viewModeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          setViewMode(this.dataset.view);
        });
      });
      
      saveDesignBtn.addEventListener('click', showSaveModal);
      loadDesignBtn.addEventListener('click', showLoadModal);
      resetDesignBtn.addEventListener('click', confirmReset);
      downloadCardBtn.addEventListener('click', showDownloadModal);
      finishBtn.addEventListener('click', showDownloadModal);
      
      closeSaveModalBtn.addEventListener('click', closeSaveModal);
      closeLoadModalBtn.addEventListener('click', closeLoadModal);
      closeDownloadModalBtn.addEventListener('click', closeDownloadModal);
      closeConfirmModalBtn.addEventListener('click', closeConfirmModal);
      confirmSaveBtn.addEventListener('click', saveDesign);
      cancelSaveBtn.addEventListener('click', closeSaveModal);
      cancelActionBtn.addEventListener('click', closeConfirmModal);
      confirmActionBtn.addEventListener('click', executeConfirmAction);
      
      downloadPngBtn.addEventListener('click', () => downloadCard('png'));
      downloadJpgBtn.addEventListener('click', () => downloadCard('jpg'));
      downloadPdfBtn.addEventListener('click', () => downloadCard('pdf'));
      downloadVcardBtn.addEventListener('click', downloadVCard);
      
      window.addEventListener('click', function(e) {
        if (e.target === saveModal) closeSaveModal();
        if (e.target === loadModal) closeLoadModal();
        if (e.target === downloadModal) closeDownloadModal();
        if (e.target === confirmModal) closeConfirmModal();
      });
    }
    
    function activateTab(tabId) {
      navItems.forEach(item => item.classList.remove('active'));
      designSections.forEach(section => section.classList.remove('active'));
      
      document.querySelector(`.nav-item[data-section="${tabId}"]`).classList.add('active');
      document.getElementById(tabId).classList.add('active');
      
      document.querySelector('.design-content-container').scrollTop = 0;
    }
    
    function handlePhotoUpload(event) {
      const file = event.target.files[0];
      
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          photoPreview.innerHTML = `<img src="${e.target.result}" alt="Profile Photo">`;
          userPhoto = e.target.result;
          updateCardPreview();
        };
        
        reader.readAsDataURL(file);
      }
    }
    
    function removePhoto() {
      photoPreview.innerHTML = '<i class="fas fa-user-circle"></i>';
      photoInput.value = '';
      userPhoto = null;
      updateCardPreview();
    }
    
    function selectTemplate(template) {
      templateOptions.forEach(option => option.classList.remove('active'));
      document.querySelector(`.template-option[data-template="${template}"]`).classList.add('active');
      currentTemplate = template;
      updateCardPreview();
    }
    
    function selectColor(color) {
      colorOptions.forEach(option => option.classList.remove('active'));
      document.querySelector(`.color-option[data-color="${color}"]`).classList.add('active');
      currentColor = color;
      document.documentElement.style.setProperty('--card-primary', `var(--card-color-${color})`);
      updateCardPreview();
    }
    
    function selectCustomColor(color) {
      colorOptions.forEach(option => option.classList.remove('active'));
      document.querySelector('.color-option.custom').classList.add('active');
      document.documentElement.style.setProperty('--card-primary', color);
      currentColor = color;
      updateCardPreview();
    }
    
    function selectFont(font) {
      currentFont = font;
      updateFontPreview();
      updateCardPreview();
    }
    
    function updateFontPreview() {
      const fontFamily = getFontFamily(currentFont);
      fontPreview.style.fontFamily = fontFamily;
    }
    
    function getFontFamily(font) {
      switch (font) {
        case 'inter': return "'Inter', sans-serif";
        case 'roboto': return "'Roboto', sans-serif";
        case 'poppins': return "'Poppins', sans-serif";
        case 'montserrat': return "'Montserrat', sans-serif";
        case 'open-sans': return "'Open Sans', sans-serif";
        default: return "'Inter', sans-serif";
      }
    }
    
    function selectOrientation(orientation) {
      orientationOptions.forEach(option => option.classList.remove('active'));
      document.querySelector(`.orientation-option[data-orientation="${orientation}"]`).classList.add('active');
      
      currentOrientation = orientation;
      
      if (orientation === 'portrait') {
        cardPreviewWrapper.classList.add('portrait');
      } else {
        cardPreviewWrapper.classList.remove('portrait');
      }
      
      updateCardPreview();
    }
    
    function updateCardPreview() {
      const data = collectFormData();
      
      const frontHTML = generateCardFront(data);
      const backHTML = generateCardBack(data);
      
      cardPreviewFront.innerHTML = frontHTML;
      cardPreviewBack.innerHTML = backHTML;
      
      const fontFamily = getFontFamily(currentFont);
      cardPreviewFront.style.fontFamily = fontFamily;
      cardPreviewBack.style.fontFamily = fontFamily;
      
      applyCustomCardStyling();
      
      saveToLocalStorage();
    }
    
    function applyCustomCardStyling() {
      if (showBordersCheckbox.checked) {
        cardPreviewFront.classList.add('show-borders');
        cardPreviewBack.classList.add('show-borders');
      } else {
        cardPreviewFront.classList.remove('show-borders');
        cardPreviewBack.classList.remove('show-borders');
      }
      
      if (showShadowsCheckbox.checked) {
        cardPreviewFront.classList.add('show-shadows');
        cardPreviewBack.classList.add('show-shadows');
      } else {
        cardPreviewFront.classList.remove('show-shadows');
        cardPreviewBack.classList.remove('show-shadows');
      }
      
      if (showIconsCheckbox.checked) {
        cardPreviewFront.classList.add('show-icons');
        cardPreviewBack.classList.add('show-icons');
      } else {
        cardPreviewFront.classList.remove('show-icons');
        cardPreviewBack.classList.remove('show-icons');
      }
    }
    
    function collectFormData() {
      return {
        personalInfo: {
          fullName: fullNameInput.value.trim(),
          jobTitle: jobTitleInput.value.trim(),
          company: companyInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          website: websiteInput.value.trim(),
          address: addressInput.value.trim(),
          bio: bioInput.value.trim(),
          photo: userPhoto
        },
        socialMedia: {
          linkedin: linkedinInput.value.trim(),
          twitter: twitterInput.value.trim(),
          instagram: instagramInput.value.trim(),
          facebook: facebookInput.value.trim(),
          github: githubInput.value.trim(),
          youtube: youtubeInput.value.trim(),
          behance: behanceInput.value.trim(),
          dribbble: dribbbleInput.value.trim()
        },
        design: {
          template: currentTemplate,
          color: currentColor,
          font: currentFont,
          orientation: currentOrientation,
          showBorders: showBordersCheckbox.checked,
          showShadows: showShadowsCheckbox.checked,
          showIcons: showIconsCheckbox.checked
        },
        qrCode: {
          type: qrTypeSelect.value,
          url: qrUrlInput.value.trim(),
          foreground: qrForegroundInput.value,
          size: qrSizeInput.value
        }
      };
    }
    
    function generateCardFront(data) {
      switch (data.design.template) {
        case 'modern': return generateModernCardFront(data);
        case 'elegant': return generateElegantCardFront(data);
        case 'minimal': return generateMinimalCardFront(data);
        case 'bold': return generateBoldCardFront(data);
        case 'creative': return generateCreativeCardFront(data);
        case 'professional': return generateProfessionalCardFront(data);
        default: return generateModernCardFront(data);
      }
    }
    
    function generateCardBack(data) {
      switch (data.design.template) {
        case 'modern': return generateModernCardBack(data);
        case 'elegant': return generateElegantCardBack(data);
        case 'minimal': return generateMinimalCardBack(data);
        case 'bold': return generateBoldCardBack(data);
        case 'creative': return generateCreativeCardBack(data);
        case 'professional': return generateProfessionalCardBack(data);
        default: return generateModernCardBack(data);
      }
    }
    
    function generateModernCardFront(data) {
      const info = data.personalInfo;
      const social = data.socialMedia;
      
      return `
        <div class="bc-modern">
          <div class="bc-modern-sidebar">
            <div class="bc-modern-photo">
              ${info.photo ? `<img src="${info.photo}" alt="${info.fullName}">` : '<i class="fas fa-user"></i>'}
            </div>
            <h2 class="bc-modern-name">${info.fullName || 'Your Name'}</h2>
            <div class="bc-modern-title">${info.jobTitle || 'Your Title'}</div>
            
            <div class="bc-modern-contact">
              ${info.email ? `
                <div class="bc-modern-contact-item">
                  <i class="fas fa-envelope"></i>
                  <span>${info.email}</span>
                </div>
              ` : ''}
              
              ${info.phone ? `
                <div class="bc-modern-contact-item">
                  <i class="fas fa-phone-alt"></i>
                  <span>${info.phone}</span>
                </div>
              ` : ''}
              
              ${info.website ? `
                <div class="bc-modern-contact-item">
                  <i class="fas fa-globe"></i>
                  <span>${info.website}</span>
                </div>
              ` : ''}
              
              ${info.address ? `
                <div class="bc-modern-contact-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>${info.address}</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          <div class="bc-modern-main">
            <h2 class="bc-modern-main-name">${info.fullName || 'Your Name'}</h2>
            <div class="bc-modern-main-title">${info.jobTitle || 'Your Title'}</div>
            
            ${info.company ? `<div class="bc-modern-company">${info.company}</div>` : ''}
            
            ${info.bio ? `<div class="bc-modern-bio">${info.bio}</div>` : ''}
            
            <div class="bc-modern-social">
              ${social.linkedin ? `<a href="${social.linkedin}" class="bc-modern-social-icon"><i class="fab fa-linkedin-in"></i></a>` : ''}
              ${social.twitter ? `<a href="${social.twitter}" class="bc-modern-social-icon"><i class="fab fa-twitter"></i></a>` : ''}
              ${social.instagram ? `<a href="${social.instagram}" class="bc-modern-social-icon"><i class="fab fa-instagram"></i></a>` : ''}
              ${social.facebook ? `<a href="${social.facebook}" class="bc-modern-social-icon"><i class="fab fa-facebook-f"></i></a>` : ''}
              ${social.github ? `<a href="${social.github}" class="bc-modern-social-icon"><i class="fab fa-github"></i></a>` : ''}
            </div>
            
            <div class="bc-modern-qr">
              <div id="card-qr-code"></div>
            </div>
          </div>
        </div>
      `;
    }
    
    function generateModernCardBack(data) {
      const info = data.personalInfo;
      const social = data.socialMedia;
      
      return `
        <div class="bc-modern">
          <div class="bc-modern-sidebar">
            <div class="bc-modern-photo">
              ${info.photo ? `<img src="${info.photo}" alt="${info.fullName}">` : '<i class="fas fa-user"></i>'}
            </div>
            <h2 class="bc-modern-name">${info.fullName || 'Your Name'}</h2>
            <div class="bc-modern-title">${info.jobTitle || 'Your Title'}</div>
          </div>
          
          <div class="bc-modern-main">
            <div class="bc-modern-social">
              ${social.behance ? `<a href="${social.behance}" class="bc-modern-social-icon"><i class="fab fa-behance"></i></a>` : ''}
              ${social.dribbble ? `<a href="${social.dribbble}" class="bc-modern-social-icon"><i class="fab fa-dribbble"></i></a>` : ''}
              ${social.youtube ? `<a href="${social.youtube}" class="bc-modern-social-icon"><i class="fab fa-youtube"></i></a>` : ''}
            </div>
            
            <div class="bc-modern-qr">
              <div id="card-qr-code-back"></div>
            </div>
            
            <div class="bc-modern-tagline">Scan the QR code to save my contact information</div>
          </div>
        </div>
      `;
    }
    
    function generateElegantCardFront(data) {
      const info = data.personalInfo;
      const social = data.socialMedia;
      
      return `
        <div class="bc-elegant">
          <div class="bc-elegant-header">
            <h1 class="bc-elegant-name">${info.fullName || 'Your Name'}</h1>
            <div class="bc-elegant-title">${info.jobTitle || 'Your Title'}</div>
            ${info.company ? `<div class="bc-elegant-company">${info.company}</div>` : ''}
          </div>
          
          <div class="bc-elegant-content">
            <div class="bc-elegant-left">
              ${info.bio ? `<div class="bc-elegant-bio">${info.bio}</div>` : ''}
              
              <div class="bc-elegant-contact">
                ${info.email ? `
                  <div class="bc-elegant-contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${info.email}</span>
                  </div>
                ` : ''}
                
                ${info.phone ? `
                  <div class="bc-elegant-contact-item">
                    <i class="fas fa-phone-alt"></i>
                    <span>${info.phone}</span>
                  </div>
                ` : ''}
                
                ${info.website ? `
                  <div class="bc-elegant-contact-item">
                    <i class="fas fa-globe"></i>
                    <span>${info.website}</span>
                  </div>
                ` : ''}
                
                ${info.address ? `
                  <div class="bc-elegant-contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${info.address}</span>
                  </div>
                ` : ''}
              </div>
            </div>
            
            <div class="bc-elegant-right">
              <div class="bc-elegant-photo">
                ${info.photo ? `<img src="${info.photo}" alt="${info.fullName}">` : '<i class="fas fa-user"></i>'}
              </div>
              
              <div class="bc-elegant-qr">
                <div id="card-qr-code"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    function generateElegantCardBack(data) {
      const info = data.personalInfo;
      const social = data.socialMedia;
      
      return `
        <div class="bc-elegant">
          <div class="bc-elegant-header">
            <h1 class="bc-elegant-name">${info.fullName || 'Your Name'}</h1>
            <div class="bc-elegant-title">${info.jobTitle || 'Your Title'}</div>
          </div>
          
          <div class="bc-elegant-social">
            ${social.linkedin ? `<a href="${social.linkedin}" class="bc-elegant-social-icon"><i class="fab fa-linkedin-in"></i></a>` : ''}
            ${social.twitter ? `<a href="${social.twitter}" class="bc-elegant-social-icon"><i class="fab fa-twitter"></i></a>` : ''}
            ${social.instagram ? `<a href="${social.instagram}" class="bc-elegant-social-icon"><i class="fab fa-instagram"></i></a>` : ''}
            ${social.facebook ? `<a href="${social.facebook}" class="bc-elegant-social-icon"><i class="fab fa-facebook-f"></i></a>` : ''}
            ${social.github ? `<a href="${social.github}" class="bc-elegant-social-icon"><i class="fab fa-github"></i></a>` : ''}
            ${social.behance ? `<a href="${social.behance}" class="bc-elegant-social-icon"><i class="fab fa-behance"></i></a>` : ''}
            ${social.dribbble ? `<a href="${social.dribbble}" class="bc-elegant-social-icon"><i class="fab fa-dribbble"></i></a>` : ''}
            ${social.youtube ? `<a href="${social.youtube}" class="bc-elegant-social-icon"><i class="fab fa-youtube"></i></a>` : ''}
          </div>
          
          <div class="bc-elegant-tagline">Scan the QR code to save my contact information</div>
        </div>
      `;
    }
    
    function generateMinimalCardFront(data) {
      const info = data.personalInfo;
      
      return `
        <div class="bc-minimal">
          <div class="bc-minimal-line"></div>
          
          <div class="bc-minimal-header">
            <h1 class="bc-minimal-name">${info.fullName || 'Your Name'}</h1>
            <div class="bc-minimal-title">${info.jobTitle || 'Your Title'}</div>
            ${info.company ? `<div class="bc-minimal-company">${info.company}</div>` : ''}
          </div>
          
          <div class="bc-minimal-content">
            <div class="bc-minimal-left">
              ${info.bio ? `<div class="bc-minimal-bio">${info.bio}</div>` : ''}
              
              <div class="bc-minimal-contact">
                ${info.email ? `
                  <div class="bc-minimal-contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${info.email}</span>
                  </div>
                ` : ''}
                
                ${info.phone ? `
                  <div class="bc-minimal-contact-item">
                    <i class="fas fa-phone-alt"></i>
                    <span>${info.phone}</span>
                  </div>
                ` : ''}
                
                ${info.website ? `
                  <div class="bc-minimal-contact-item">
                    <i class="fas fa-globe"></i>
                    <span>${info.website}</span>
                  </div>
                ` : ''}
              </div>
            </div>
            
            <div class="bc-minimal-right">
              <div class="bc-minimal-qr">
                <div id="card-qr-code"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    function generateMinimalCardBack(data) {
      const info = data.personalInfo;
      const social = data.socialMedia;
      
      return `
        <div class="bc-minimal">
          <div class="bc-minimal-line"></div>
          
          <div class="bc-minimal-header">
            <div class="bc-minimal-logo">
              ${info.photo ? `<img src="${info.photo}" alt="${info.fullName}">` : '<i class="fas fa-user"></i>'}
            </div>
          </div>
          
          <div class="bc-minimal-content">
            <div class="bc-minimal-social">
              ${social.linkedin ? `<a href="${social.linkedin}" class="bc-minimal-social-icon"><i class="fab fa-linkedin-in"></i></a>` : ''}
              ${social.twitter ? `<a href="${social.twitter}" class="bc-minimal-social-icon"><i class="fab fa-twitter"></i></a>` : ''}
              ${social.instagram ? `<a href="${social.instagram}" class="bc-minimal-social-icon"><i class="fab fa-instagram"></i></a>` : ''}
              ${social.facebook ? `<a href="${social.facebook}" class="bc-minimal-social-icon"><i class="fab fa-facebook-f"></i></a>` : ''}
              ${social.github ? `<a href="${social.github}" class="bc-minimal-social-icon"><i class="fab fa-github"></i></a>` : ''}
            </div>
            
            ${info.address ? `
              <div class="bc-minimal-address">
                <i class="fas fa-map-marker-alt"></i>
                <span>${info.address}</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }
    
    function generateBoldCardFront(data) {
      const info = data.personalInfo;
      
      return `
        <div class="bc-bold">
          <div class="bc-bold-header">
            <h1 class="bc-bold-name">${info.fullName || 'Your Name'}</h1>
            <div class="bc-bold-title">${info.jobTitle || 'Your Title'}</div>
            ${info.company ? `<div class="bc-bold-company">${info.company}</div>` : ''}
          </div>
          
          <div class="bc-bold-content">
            <div class="bc-bold-left">
              ${info.bio ? `<div class="bc-bold-bio">${info.bio}</div>` : ''}
              
              <div class="bc-bold-contact">
                ${info.email ? `
                  <div class="bc-bold-contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${info.email}</span>
                  </div>
                ` : ''}
                
                ${info.phone ? `
                  <div class="bc-bold-contact-item">
                    <i class="fas fa-phone-alt"></i>
                    <span>${info.phone}</span>
                  </div>
                ` : ''}
                
                ${info.website ? `
                  <div class="bc-bold-contact-item">
                    <i class="fas fa-globe"></i>
                    <span>${info.website}</span>
                  </div>
                ` : ''}
                
                ${info.address ? `
                  <div class="bc-bold-contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${info.address}</span>
                  </div>
                ` : ''}
              </div>
            </div>
            
            <div class="bc-bold-right">
              <div class="bc-bold-photo">
                ${info.photo ? `<img src="${info.photo}" alt="${info.fullName}">` : '<i class="fas fa-user"></i>'}
              </div>
              
              <div class="bc-bold-qr">
                <div id="card-qr-code"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    function generateBoldCardBack(data) {
      const social = data.socialMedia;
      
      return `
        <div class="bc-bold">
          <div class="bc-bold-social">
            ${social.linkedin ? `<a href="${social.linkedin}" class="bc-bold-social-icon"><i class="fab fa-linkedin-in"></i></a>` : ''}
            ${social.twitter ? `<a href="${social.twitter}" class="bc-bold-social-icon"><i class="fab fa-twitter"></i></a>` : ''}
            ${social.instagram ? `<a href="${social.instagram}" class="bc-bold-social-icon"><i class="fab fa-instagram"></i></a>` : ''}
            ${social.facebook ? `<a href="${social.facebook}" class="bc-bold-social-icon"><i class="fab fa-facebook-f"></i></a>` : ''}
            ${social.github ? `<a href="${social.github}" class="bc-bold-social-icon"><i class="fab fa-github"></i></a>` : ''}
            ${social.behance ? `<a href="${social.behance}" class="bc-bold-social-icon"><i class="fab fa-behance"></i></a>` : ''}
            ${social.dribbble ? `<a href="${social.dribbble}" class="bc-bold-social-icon"><i class="fab fa-dribbble"></i></a>` : ''}
            ${social.youtube ? `<a href="${social.youtube}" class="bc-bold-social-icon"><i class="fab fa-youtube"></i></a>` : ''}
          </div>
          
          <div class="bc-bold-tagline">Scan to connect</div>
        </div>
      `;
    }
    
    function generateCreativeCardFront(data) {
      const info = data.personalInfo;
      
      return `
        <div class="bc-creative">
          <div class="bc-creative-shape"></div>
          <div class="bc-creative-shape-2"></div>
          
          <div class="bc-creative-content">
            <div class="bc-creative-header">
              <div class="bc-creative-photo">
                ${info.photo ? `<img src="${info.photo}" alt="${info.fullName}">` : '<i class="fas fa-user"></i>'}
              </div>
              
              <div class="bc-creative-title-group">
                <h1 class="bc-creative-name">${info.fullName || 'Your Name'}</h1>
                <div class="bc-creative-title">${info.jobTitle || 'Your Title'}</div>
                ${info.company ? `<div class="bc-creative-company">${info.company}</div>` : ''}
              </div>
            </div>
            
            <div class="bc-creative-main">
              <div class="bc-creative-left">
                ${info.bio ? `<div class="bc-creative-bio">${info.bio}</div>` : ''}
                
                <div class="bc-creative-contact">
                  ${info.email ? `
                    <div class="bc-creative-contact-item">
                      <i class="fas fa-envelope"></i>
                      <span>${info.email}</span>
                    </div>
                  ` : ''}
                  
                  ${info.phone ? `
                    <div class="bc-creative-contact-item">
                      <i class="fas fa-phone-alt"></i>
                      <span>${info.phone}</span>
                    </div>
                  ` : ''}
                  
                  ${info.website ? `
                    <div class="bc-creative-contact-item">
                      <i class="fas fa-globe"></i>
                      <span>${info.website}</span>
                    </div>
                  ` : ''}
                  
                  ${info.address ? `
                    <div class="bc-creative-contact-item">
                      <i class="fas fa-map-marker-alt"></i>
                      <span>${info.address}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
            
            <div class="bc-creative-qr">
              <div id="card-qr-code"></div>
            </div>
          </div>
        </div>
      `;
    }
    
    function generateCreativeCardBack(data) {
      const info = data.personalInfo;
      const social = data.socialMedia;
      
      return `
        <div class="bc-creative">
          <div class="bc-creative-shape"></div>
          <div class="bc-creative-shape-2"></div>
          
          <div class="bc-creative-content">
            <div class="bc-creative-header">
              <h2>${info.fullName || 'Your Name'}</h2>
            </div>
            
            <div class="bc-creative-social">
              ${social.linkedin ? `<a href="${social.linkedin}" class="bc-creative-social-icon"><i class="fab fa-linkedin-in"></i></a>` : ''}
              ${social.twitter ? `<a href="${social.twitter}" class="bc-creative-social-icon"><i class="fab fa-twitter"></i></a>` : ''}
              ${social.instagram ? `<a href="${social.instagram}" class="bc-creative-social-icon"><i class="fab fa-instagram"></i></a>` : ''}
              ${social.facebook ? `<a href="${social.facebook}" class="bc-creative-social-icon"><i class="fab fa-facebook-f"></i></a>` : ''}
              ${social.github ? `<a href="${social.github}" class="bc-creative-social-icon"><i class="fab fa-github"></i></a>` : ''}
              ${social.behance ? `<a href="${social.behance}" class="bc-creative-social-icon"><i class="fab fa-behance"></i></a>` : ''}
              ${social.dribbble ? `<a href="${social.dribbble}" class="bc-creative-social-icon"><i class="fab fa-dribbble"></i></a>` : ''}
              ${social.youtube ? `<a href="${social.youtube}" class="bc-creative-social-icon"><i class="fab fa-youtube"></i></a>` : ''}
            </div>
            
            <div class="bc-creative-tagline">Scan to connect</div>
          </div>
        </div>
      `;
    }
    
    function generateProfessionalCardFront(data) {
      const info = data.personalInfo;
      
      return `
        <div class="bc-professional">
          <div class="bc-professional-sidebar"></div>
          
          <div class="bc-professional-content">
            <div class="bc-professional-header">
              <h1 class="bc-professional-name">${info.fullName || 'Your Name'}</h1>
              <div class="bc-professional-title">${info.jobTitle || 'Your Title'}</div>
              ${info.company ? `<div class="bc-professional-company">${info.company}</div>` : ''}
            </div>
            
            <div class="bc-professional-main">
              <div class="bc-professional-left">
                ${info.bio ? `<div class="bc-professional-bio">${info.bio}</div>` : ''}
                
                <div class="bc-professional-contact">
                  ${info.email ? `
                    <div class="bc-professional-contact-item">
                      <i class="fas fa-envelope"></i>
                      <span>${info.email}</span>
                    </div>
                  ` : ''}
                  
                  ${info.phone ? `
                    <div class="bc-professional-contact-item">
                      <i class="fas fa-phone-alt"></i>
                      <span>${info.phone}</span>
                    </div>
                  ` : ''}
                  
                  ${info.website ? `
                    <div class="bc-professional-contact-item">
                      <i class="fas fa-globe"></i>
                      <span>${info.website}</span>
                    </div>
                  ` : ''}
                  
                  ${info.address ? `
                    <div class="bc-professional-contact-item">
                      <i class="fas fa-map-marker-alt"></i>
                      <span>${info.address}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
              
              <div class="bc-professional-right">
                <div class="bc-professional-photo">
                  ${info.photo ? `<img src="${info.photo}" alt="${info.fullName}">` : '<i class="fas fa-user"></i>'}
                </div>
                
                <div class="bc-professional-qr">
                  <div id="card-qr-code"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    function generateProfessionalCardBack(data) {
      const info = data.personalInfo;
      const social = data.socialMedia;
      
      return `
        <div class="bc-professional">
          <div class="bc-professional-sidebar"></div>
          
          <div class="bc-professional-content">
            <div class="bc-professional-header">
              <h2>${info.fullName || 'Your Name'}</h2>
            </div>
            
            <div class="bc-professional-social">
              ${social.linkedin ? `<a href="${social.linkedin}" class="bc-professional-social-icon"><i class="fab fa-linkedin-in"></i></a>` : ''}
              ${social.twitter ? `<a href="${social.twitter}" class="bc-professional-social-icon"><i class="fab fa-twitter"></i></a>` : ''}
              ${social.instagram ? `<a href="${social.instagram}" class="bc-professional-social-icon"><i class="fab fa-instagram"></i></a>` : ''}
              ${social.facebook ? `<a href="${social.facebook}" class="bc-professional-social-icon"><i class="fab fa-facebook-f"></i></a>` : ''}
              ${social.github ? `<a href="${social.github}" class="bc-professional-social-icon"><i class="fab fa-github"></i></a>` : ''}
              ${social.behance ? `<a href="${social.behance}" class="bc-professional-social-icon"><i class="fab fa-behance"></i></a>` : ''}
              ${social.dribbble ? `<a href="${social.dribbble}" class="bc-professional-social-icon"><i class="fab fa-dribbble"></i></a>` : ''}
              ${social.youtube ? `<a href="${social.youtube}" class="bc-professional-social-icon"><i class="fab fa-youtube"></i></a>` : ''}
            </div>
            
            <div class="bc-professional-tagline">Scan to connect</div>
          </div>
        </div>
      `;
    }
    
    function generateQRCode() {
      const data = collectFormData();
      let qrContent;
      
      if (data.qrCode.type === 'url') {
        qrContent = data.qrCode.url || `https://example.com/card/${encodeURIComponent(data.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase())}`;
      } else {
        qrContent = generateVCardContent(data);
      }
      
      qrCodeData = qrContent;
      
      try {
        const typeNumber = 0;
        const errorCorrectionLevel = 'L';
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        qr.addData(qrContent);
        qr.make();
        
        const size = parseInt(data.qrCode.size);
        const qrSvg = qr.createSvgTag({
          cellSize: size / 33,
          margin: 0,
          scalable: true
        });
        
        const coloredQrSvg = qrSvg.replace(/fill="#000000"/g, `fill="${data.qrCode.foreground}"`);
        
        qrPreview.innerHTML = coloredQrSvg;
        
        const cardQrCode = document.getElementById('card-qr-code');
        const cardQrCodeBack = document.getElementById('card-qr-code-back');
        
        if (cardQrCode) {
          cardQrCode.innerHTML = coloredQrSvg;
        }
        
        if (cardQrCodeBack) {
          cardQrCodeBack.innerHTML = coloredQrSvg;
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
        showNotification('Error generating QR code. Please try again.', 'error');
      }
    }
    
    function generateVCardContent(data) {
      const info = data.personalInfo;
      const social = data.socialMedia;
      
      let vCard = 'BEGIN:VCARD\nVERSION:3.0\n';
      
      if (info.fullName) {
        vCard += `FN:${info.fullName}\n`;
        vCard += `N:${info.fullName};;;;\n`;
      }
      
      if (info.jobTitle || info.company) {
        vCard += `TITLE:${info.jobTitle || ''}\n`;
        if (info.company) {
          vCard += `ORG:${info.company}\n`;
        }
      }
      
      if (info.email) {
        vCard += `EMAIL:${info.email}\n`;
      }
      
      if (info.phone) {
        vCard += `TEL:${info.phone}\n`;
      }
      
      if (info.website) {
        vCard += `URL:${info.website}\n`;
      }
      
      if (info.address) {
        vCard += `ADR:;;${info.address};;;;\n`;
      }
      
      let socialNote = '';
      if (social.linkedin) socialNote += `LinkedIn: ${social.linkedin}\n`;
      if (social.twitter) socialNote += `Twitter: ${social.twitter}\n`;
      if (social.facebook) socialNote += `Facebook: ${social.facebook}\n`;
      if (social.instagram) socialNote += `Instagram: ${social.instagram}\n`;
      if (social.github) socialNote += `GitHub: ${social.github}\n`;
      if (social.youtube) socialNote += `YouTube: ${social.youtube}\n`;
      if (social.behance) socialNote += `Behance: ${social.behance}\n`;
      if (social.dribbble) socialNote += `Dribbble: ${social.dribbble}\n`;
      
      if (socialNote) {
        vCard += `NOTE:${socialNote}`;
      }
      
      vCard += 'END:VCARD';
      return vCard;
    }
    
    function downloadQRCode() {
      const qrSize = parseInt(qrSizeInput.value);
      
      const canvas = document.createElement('canvas');
      canvas.width = qrSize;
      canvas.height = qrSize;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, qrSize, qrSize);
      
      const img = new Image();
      const svgBlob = new Blob([qrPreview.innerHTML], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = function() {
        ctx.drawImage(img, 0, 0, qrSize, qrSize);
        URL.revokeObjectURL(url);
        
        canvas.toBlob(function(blob) {
          const name = fullNameInput.value ? fullNameInput.value.replace(/\s+/g, '-').toLowerCase() : 'qr-code';
          saveAs(blob, `${name}-qr-code.png`);
        });
      };
      
      img.src = url;
    }
    
    function flipCard() {
      cardPreviewWrapper.classList.toggle('flipped');
    }
    
    function setViewMode(mode) {
      viewModeBtns.forEach(btn => btn.classList.remove('active'));
      document.querySelector(`.view-mode-btn[data-view="${mode}"]`).classList.add('active');
      
      switch (mode) {
        case 'front':
          cardPreviewWrapper.classList.remove('flipped');
          break;
        case 'back':
          cardPreviewWrapper.classList.add('flipped');
          break;
        case 'both':
          animateBothSides();
          break;
      }
    }
    
    let bothSidesInterval = null;
    
    function animateBothSides() {
      clearInterval(bothSidesInterval);
      
      bothSidesInterval = setInterval(() => {
        cardPreviewWrapper.classList.toggle('flipped');
      }, 3000);
    }
    
    function showSaveModal() {
      if (!validateRequiredFields()) {
        showNotification('Please fill in all required fields before saving.', 'warning');
        return;
      }
      
      designNameInput.value = '';
      saveModal.classList.add('show');
    }
    
    function closeSaveModal() {
      saveModal.classList.remove('show');
    }
    
    function showLoadModal() {
      populateSavedDesigns();
      loadModal.classList.add('show');
    }
    
    function closeLoadModal() {
      loadModal.classList.remove('show');
    }
    
    function showDownloadModal() {
      if (!validateRequiredFields()) {
        showNotification('Please fill in all required fields before downloading.', 'warning');
        return;
      }
      
      downloadModal.classList.add('show');
    }
    
    function closeDownloadModal() {
      downloadModal.classList.remove('show');
    }
    
    function showConfirmModal(title, message, confirmAction) {
      confirmTitle.textContent = title;
      confirmMessage.textContent = message;
      currentConfirmAction = confirmAction;
      confirmModal.classList.add('show');
    }
    
    function closeConfirmModal() {
      confirmModal.classList.remove('show');
    }
    
    function executeConfirmAction() {
      if (typeof currentConfirmAction === 'function') {
        currentConfirmAction();
      }
      closeConfirmModal();
    }
    
    function validateRequiredFields() {
      const requiredFields = document.querySelectorAll('.form-input.required');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          
          field.classList.add('invalid');
          
          setTimeout(() => {
            field.classList.remove('invalid');
          }, 3000);
        }
      });
      
      return isValid;
    }
    
    function saveDesign() {
      const designName = designNameInput.value.trim();
      
      if (!designName) {
        showNotification('Please enter a name for your design.', 'warning');
        return;
      }
      
      const data = collectFormData();
      
      const design = {
        id: Date.now(),
        name: designName,
        date: new Date().toISOString(),
        data: data
      };
      
      const savedDesigns = JSON.parse(localStorage.getItem('bcCreatorSavedDesigns') || '[]');
      
      savedDesigns.push(design);
      
      localStorage.setItem('bcCreatorSavedDesigns', JSON.stringify(savedDesigns));
      
      closeSaveModal();
      showNotification(`Design "${designName}" saved successfully!`, 'success');
    }
    
    function populateSavedDesigns() {
      const savedDesigns = JSON.parse(localStorage.getItem('bcCreatorSavedDesigns') || '[]');
      
      savedDesignsContainer.innerHTML = '';
      
      if (savedDesigns.length === 0) {
        savedDesignsContainer.innerHTML = `
          <div class="no-saved-designs">
            <i class="fas fa-file-alt"></i>
            <p>No saved designs found.</p>
          </div>
        `;
        return;
      }
      
      savedDesigns.forEach(design => {
        const date = new Date(design.date).toLocaleDateString();
        
        const designItem = document.createElement('div');
        designItem.className = 'saved-design-item';
        
        designItem.innerHTML = `
          <div class="saved-design-info">
            <div class="saved-design-name">${design.name}</div>
            <div class="saved-design-date">${date}</div>
          </div>
          <div class="saved-design-actions">
            <button class="load-design-btn" data-id="${design.id}" title="Load Design">
              <i class="fas fa-folder-open"></i>
            </button>
            <button class="delete-design-btn" data-id="${design.id}" title="Delete Design">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        `;
        
        designItem.querySelector('.load-design-btn').addEventListener('click', () => {
          loadDesign(design.id);
        });
        
        designItem.querySelector('.delete-design-btn').addEventListener('click', () => {
          deleteDesign(design.id, design.name);
        });
        
        savedDesignsContainer.appendChild(designItem);
      });
    }
    
    function loadDesign(id) {
      const savedDesigns = JSON.parse(localStorage.getItem('bcCreatorSavedDesigns') || '[]');
      
      const design = savedDesigns.find(d => d.id === id);
      
      if (!design) {
        showNotification('Design not found.', 'error');
        return;
      }
      
      showConfirmModal(
        'Load Design',
        `Are you sure you want to load "${design.name}"? This will replace your current design.`,
        () => {
          loadDesignData(design.data);
          
          closeLoadModal();
          
          showNotification(`Design "${design.name}" loaded successfully!`, 'success');
        }
      );
    }
    
    function loadDesignData(data) {
      fullNameInput.value = data.personalInfo.fullName || '';
      jobTitleInput.value = data.personalInfo.jobTitle || '';
      companyInput.value = data.personalInfo.company || '';
      emailInput.value = data.personalInfo.email || '';
      phoneInput.value = data.personalInfo.phone || '';
      websiteInput.value = data.personalInfo.website || '';
      addressInput.value = data.personalInfo.address || '';
      bioInput.value = data.personalInfo.bio || '';
      bioCount.textContent = bioInput.value.length;
      
      if (data.personalInfo.photo) {
        userPhoto = data.personalInfo.photo;
        photoPreview.innerHTML = `<img src="${userPhoto}" alt="Profile Photo">`;
      } else {
        removePhoto();
      }
      
      linkedinInput.value = data.socialMedia.linkedin || '';
      twitterInput.value = data.socialMedia.twitter || '';
      instagramInput.value = data.socialMedia.instagram || '';
      facebookInput.value = data.socialMedia.facebook || '';
      githubInput.value = data.socialMedia.github || '';
      youtubeInput.value = data.socialMedia.youtube || '';
      behanceInput.value = data.socialMedia.behance || '';
      dribbbleInput.value = data.socialMedia.dribbble || '';
      
      selectTemplate(data.design.template);
      
      if (typeof data.design.color === 'string') {
        if (data.design.color.startsWith('#')) {
          selectCustomColor(data.design.color);
          customColorInput.value = data.design.color;
        } else {
          selectColor(data.design.color);
        }
      }
      
      selectFont(data.design.font);
      fontSelection.value = data.design.font;
      
      selectOrientation(data.design.orientation);
      
      showBordersCheckbox.checked = data.design.showBorders;
      showShadowsCheckbox.checked = data.design.showShadows;
      showIconsCheckbox.checked = data.design.showIcons;
      
      qrTypeSelect.value = data.qrCode.type;
      qrUrlInput.value = data.qrCode.url || '';
      qrForegroundInput.value = data.qrCode.foreground;
      qrSizeInput.value = data.qrCode.size;
      qrSizeValue.textContent = data.qrCode.size;
      
      if (data.qrCode.type === 'url') {
        qrUrlGroup.style.display = 'block';
      } else {
        qrUrlGroup.style.display = 'none';
      }
      
      updateCardPreview();
      generateQRCode();
      
      activateTab('info-section');
    }
    
    function deleteDesign(id, name) {
      showConfirmModal(
        'Delete Design',
        `Are you sure you want to delete "${name}"? This cannot be undone.`,
        () => {
          const savedDesigns = JSON.parse(localStorage.getItem('bcCreatorSavedDesigns') || '[]');
          
          const updatedDesigns = savedDesigns.filter(d => d.id !== id);
          
          localStorage.setItem('bcCreatorSavedDesigns', JSON.stringify(updatedDesigns));
          
          populateSavedDesigns();
          
          showNotification(`Design "${name}" deleted successfully!`, 'success');
        }
      );
    }
    
    function confirmReset() {
      showConfirmModal(
        'Reset Design',
        'Are you sure you want to reset the design? This will clear all your data.',
        resetDesign
      );
    }
    
    function resetDesign() {
      document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.value = '';
      });
      
      removePhoto();
      
      bioCount.textContent = '0';
      
      selectTemplate('modern');
      selectColor('blue');
      selectFont('inter');
      fontSelection.value = 'inter';
      selectOrientation('landscape');
      
      showBordersCheckbox.checked = true;
      showShadowsCheckbox.checked = true;
      showIconsCheckbox.checked = true;
      
      qrTypeSelect.value = 'vcard';
      qrUrlInput.value = '';
      qrForegroundInput.value = '#000000';
      qrSizeInput.value = '150';
      qrSizeValue.textContent = '150';
      qrUrlGroup.style.display = 'none';
      
      updateCardPreview();
      generateQRCode();
      
      activateTab('info-section');
      
      showNotification('Design reset successfully!', 'success');
    }
    
    function downloadCard(format) {
      closeDownloadModal();
      
      showNotification('Preparing your business card...', 'info');
      
      Promise.all([
        html2canvas(cardPreviewFront, {
          scale: 2,
          backgroundColor: '#ffffff'
        }),
        html2canvas(cardPreviewBack, {
          scale: 2,
          backgroundColor: '#ffffff'
        })
      ]).then(([frontCanvas, backCanvas]) => {
        if (format === 'pdf') {
          downloadAsPDF(frontCanvas, backCanvas);
        } else {
          downloadAsImage(frontCanvas, format);
        }
      }).catch(error => {
        console.error('Error generating image:', error);
        showNotification('Error generating image. Please try again.', 'error');
      });
    }
    
    function downloadAsImage(canvas, format) {
      const name = fullNameInput.value ? fullNameInput.value.replace(/\s+/g, '-').toLowerCase() : 'business-card';
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      
      canvas.toBlob(function(blob) {
        saveAs(blob, `${name}-card.${format}`);
        showNotification(`Business card downloaded as ${format.toUpperCase()}!`, 'success');
      }, mimeType, 0.92);
    }
    
    function downloadAsPDF(frontCanvas, backCanvas) {
      const pdf = new jspdf.jsPDF({
        orientation: currentOrientation === 'portrait' ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [85, 55]
      });
      
      const frontImgData = frontCanvas.toDataURL('image/jpeg', 0.92);
      pdf.addImage(frontImgData, 'JPEG', 0, 0, 85, 55);
      
      pdf.addPage();
      const backImgData = backCanvas.toDataURL('image/jpeg', 0.92);
      pdf.addImage(backImgData, 'JPEG', 0, 0, 85, 55);
      
      const name = fullNameInput.value ? fullNameInput.value.replace(/\s+/g, '-').toLowerCase() : 'business-card';
      
      pdf.save(`${name}-card.pdf`);
      
      showNotification('Business card downloaded as PDF!', 'success');
    }
    
    function downloadVCard() {
      closeDownloadModal();
      
      const data = collectFormData();
      const vCardContent = generateVCardContent(data);
      
      const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8' });
      const name = data.personalInfo.fullName ? data.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase() : 'contact';
      saveAs(blob, `${name}.vcf`);
      
      showNotification('vCard downloaded successfully!', 'success');
    }
    
    function saveToLocalStorage() {
      try {
        const data = collectFormData();
        localStorage.setItem('bcCreatorCurrentState', JSON.stringify(data));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    
    function loadFromLocalStorage() {
      try {
        const savedState = localStorage.getItem('bcCreatorCurrentState');
        if (savedState) {
          loadDesignData(JSON.parse(savedState));
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    }
    
    function showNotification(message, type = 'info') {
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
        document.body.removeChild(existingNotification);
      }
      
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      
      let icon = 'info-circle';
      if (type === 'success') icon = 'check-circle';
      if (type === 'error') icon = 'exclamation-circle';
      if (type === 'warning') icon = 'exclamation-triangle';
      
      notification.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span>`;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
      }, 10);
      
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