document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const formSections = document.querySelectorAll('.form-section');
    const nextBtns = document.querySelectorAll('.form-next-btn');
    const prevBtns = document.querySelectorAll('.form-prev-btn');
    
    // DOM Elements - Personal Info
    const fullNameInput = document.getElementById('full-name');
    const jobTitleInput = document.getElementById('job-title');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const locationInput = document.getElementById('location');
    const linkedinInput = document.getElementById('linkedin');
    const websiteInput = document.getElementById('website');
    const githubInput = document.getElementById('github');
    const twitterInput = document.getElementById('twitter');
    const profileSummaryInput = document.getElementById('profile-summary');
    const photoInput = document.getElementById('photo-input');
    const photoPreview = document.getElementById('photo-preview');
    const removePhotoBtn = document.getElementById('remove-photo-btn');
    const summaryCount = document.getElementById('summary-count');
    
    // DOM Elements - Education
    const educationItemsContainer = document.getElementById('education-items-container');
    const addEducationBtn = document.getElementById('add-education-btn');
    const educationEmptyMessage = document.getElementById('education-empty-message');
    
    // DOM Elements - Experience
    const experienceItemsContainer = document.getElementById('experience-items-container');
    const addExperienceBtn = document.getElementById('add-experience-btn');
    const experienceEmptyMessage = document.getElementById('experience-empty-message');
    
    // DOM Elements - Skills
    const technicalSkillsInput = document.getElementById('technical-skills');
    const softSkillsInput = document.getElementById('soft-skills');
    const languagesInput = document.getElementById('languages');
    const technicalSkillsPreview = document.getElementById('technical-skills-preview');
    const softSkillsPreview = document.getElementById('soft-skills-preview');
    const languagesPreview = document.getElementById('languages-preview');
    const addCertificateBtn = document.getElementById('add-certificate-btn');
    const certificatesContainer = document.getElementById('certificates-container');
    
    // DOM Elements - Customization
    const templateOptions = document.querySelectorAll('.template-option');
    const colorOptions = document.querySelectorAll('.color-option');
    const fontSelection = document.getElementById('font-selection');
    const fontPreview = document.getElementById('font-preview');
    const compactLayoutCheckbox = document.getElementById('compact-layout');
    const showBordersCheckbox = document.getElementById('show-borders');
    
    // DOM Elements - Actions
    const generateCvBtn = document.getElementById('generate-cv-btn');
    const downloadCvBtn = document.getElementById('download-cv-btn');
    const saveCvBtn = document.getElementById('save-cv-btn');
    const loadCvBtn = document.getElementById('load-cv-btn');
    const resetCvBtn = document.getElementById('reset-cv-btn');
    const cvPreview = document.getElementById('cv-preview');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    // DOM Elements - Preview Controls
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const zoomLevelText = document.getElementById('zoom-level');
    
    // DOM Elements - Modals
    const dataModal = document.getElementById('data-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const savedCvsContainer = document.getElementById('saved-cvs-container');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmTitle = document.getElementById('confirm-title');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmActionBtn = document.getElementById('confirm-action-btn');
    const cancelActionBtn = document.getElementById('cancel-action-btn');
    const closeConfirmModalBtn = document.getElementById('close-confirm-modal-btn');
    
    // Templates
    const educationItemTemplate = document.getElementById('education-item-template').innerHTML;
    const experienceItemTemplate = document.getElementById('experience-item-template').innerHTML;
    
    // Variables
    let selectedTemplate = 'modern';
    let selectedColor = 'blue';
    let selectedFont = 'inter';
    let zoomLevel = 100;
    let educationCounter = 0;
    let experienceCounter = 0;
    let userPhoto = null;
    let currentConfirmAction = null;
    
    // Initialize
    init();
    
    function init() {
      setupEventListeners();
      setupSortable();
      initializeCounts();
      updateProgress();
      updateFontPreview();
      generateEmptyCV();
      loadFromLocalStorage();
    }
    
    // Setup Event Listeners
    function setupEventListeners() {
      // Tab Navigation
      navItems.forEach(item => {
        item.addEventListener('click', () => {
          activateTab(item.dataset.section);
        });
      });
      
      // Next and Previous Buttons
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
      
      // Profile Summary Character Count
      profileSummaryInput.addEventListener('input', function() {
        summaryCount.textContent = this.value.length;
        if (this.value.length > 500) {
          this.value = this.value.substring(0, 500);
          summaryCount.textContent = 500;
        }
        updateCV();
      });
      
      // Photo Upload
      photoInput.addEventListener('change', handlePhotoUpload);
      removePhotoBtn.addEventListener('click', removePhoto);
      
      // Add Education Button
      addEducationBtn.addEventListener('click', addEducation);
      
      // Add Experience Button
      addExperienceBtn.addEventListener('click', addExperience);
      
      // Skills Input
      technicalSkillsInput.addEventListener('input', function() {
        updateSkillsPreview(this.value, technicalSkillsPreview);
        updateCV();
      });
      
      softSkillsInput.addEventListener('input', function() {
        updateSkillsPreview(this.value, softSkillsPreview);
        updateCV();
      });
      
      languagesInput.addEventListener('input', function() {
        updateSkillsPreview(this.value, languagesPreview);
        updateCV();
      });
      
      // Add Certificate Button
      addCertificateBtn.addEventListener('click', addCertificate);
      
      // Template Selection
      templateOptions.forEach(option => {
        option.addEventListener('click', () => {
          selectTemplate(option.dataset.template);
          updateCV();
        });
      });
      
      // Color Selection
      colorOptions.forEach(option => {
        option.addEventListener('click', () => {
          selectColor(option.dataset.color);
          updateCV();
        });
      });
      
      // Font Selection
      fontSelection.addEventListener('change', function() {
        selectedFont = this.value;
        updateFontPreview();
        updateCV();
      });
      
      // Layout Options
      compactLayoutCheckbox.addEventListener('change', updateCV);
      showBordersCheckbox.addEventListener('change', updateCV);
      
      // Real-time Updates for Form Inputs
      document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('input', updateCV);
      });
      
      // Form sections change (event delegation)
      formSections.forEach(section => {
        section.addEventListener('input', function(e) {
          if (e.target.classList.contains('form-input') || 
              e.target.classList.contains('form-textarea') || 
              e.target.classList.contains('form-select')) {
            updateCV();
          }
        });
      });
      
      // Action Buttons
      generateCvBtn.addEventListener('click', validateAndGenerateCV);
      downloadCvBtn.addEventListener('click', downloadCV);
      saveCvBtn.addEventListener('click', saveCV);
      loadCvBtn.addEventListener('click', showLoadModal);
      resetCvBtn.addEventListener('click', confirmReset);
      
      // Zoom Controls
      zoomInBtn.addEventListener('click', zoomIn);
      zoomOutBtn.addEventListener('click', zoomOut);
      
      // Modal Close Buttons
      closeModalBtn.addEventListener('click', closeModal);
      closeConfirmModalBtn.addEventListener('click', closeConfirmModal);
      cancelActionBtn.addEventListener('click', closeConfirmModal);
      confirmActionBtn.addEventListener('click', executeConfirmAction);
      
      // Close modal on outside click
      window.addEventListener('click', function(e) {
        if (e.target === dataModal) {
          closeModal();
        }
        if (e.target === confirmModal) {
          closeConfirmModal();
        }
      });
    }
    
    // Setup Sortable Lists
    function setupSortable() {
      // Education Items
      new Sortable(educationItemsContainer, {
        handle: '.sortable-handle',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: updateCV
      });
      
      // Experience Items
      new Sortable(experienceItemsContainer, {
        handle: '.sortable-handle',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: updateCV
      });
    }
    
    // Initialize Counts
    function initializeCounts() {
      summaryCount.textContent = profileSummaryInput.value.length;
    }
    
    // Activate Tab
    function activateTab(tabId) {
      // Remove active class from all tabs
      navItems.forEach(item => item.classList.remove('active'));
      formSections.forEach(section => section.classList.remove('active'));
      
      // Add active class to selected tab
      document.querySelector(`.nav-item[data-section="${tabId}"]`).classList.add('active');
      document.getElementById(tabId).classList.add('active');
      
      // Update progress
      updateProgress();
      
      // Scroll to top of form
      document.querySelector('.form-content-container').scrollTop = 0;
    }
    
    // Handle Photo Upload
    function handlePhotoUpload(event) {
      const file = event.target.files[0];
      
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          photoPreview.innerHTML = `<img src="${e.target.result}" alt="Profile Photo">`;
          userPhoto = e.target.result;
          updateCV();
        };
        
        reader.readAsDataURL(file);
      }
    }
    
    // Remove Photo
    function removePhoto() {
      photoPreview.innerHTML = '<i class="fas fa-user-circle"></i>';
      photoInput.value = '';
      userPhoto = null;
      updateCV();
    }
    
    // Add Education
    function addEducation() {
      educationCounter++;
      const id = educationCounter;
      
      const educationItem = educationItemTemplate.replace(/{id}/g, id);
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = educationItem;
      
      const newItem = tempContainer.firstChild;
      educationItemsContainer.appendChild(newItem);
      
      // Add event listener to remove button
      newItem.querySelector('.remove-item-btn').addEventListener('click', function() {
        removeItem(this.dataset.target);
      });
      
      // Show container, hide empty message
      educationEmptyMessage.style.display = 'none';
      
      // Update CV
      updateCV();
    }
    
    // Add Experience
    function addExperience() {
      experienceCounter++;
      const id = experienceCounter;
      
      const experienceItem = experienceItemTemplate.replace(/{id}/g, id);
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = experienceItem;
      
      const newItem = tempContainer.firstChild;
      experienceItemsContainer.appendChild(newItem);
      
      // Add event listener to remove button
      newItem.querySelector('.remove-item-btn').addEventListener('click', function() {
        removeItem(this.dataset.target);
      });
      
      // Show container, hide empty message
      experienceEmptyMessage.style.display = 'none';
      
      // Update CV
      updateCV();
    }
    
    // Remove Item (Education or Experience)
    function removeItem(itemId) {
      const item = document.querySelector(`[data-id="${itemId}"]`);
      
      if (item) {
        // Ask for confirmation
        showConfirmModal(
          'Remove Item',
          'Are you sure you want to remove this item?',
          () => {
            item.remove();
            
            // Check if there are any education items left
            if (educationItemsContainer.children.length === 0) {
              educationEmptyMessage.style.display = 'block';
            }
            
            // Check if there are any experience items left
            if (experienceItemsContainer.children.length === 0) {
              experienceEmptyMessage.style.display = 'block';
            }
            
            updateCV();
          }
        );
      }
    }
    
    // Update Skills Preview
    function updateSkillsPreview(input, container) {
      container.innerHTML = '';
      
      if (input.trim()) {
        const skills = input.split(',').map(skill => skill.trim()).filter(Boolean);
        
        skills.forEach(skill => {
          const skillTag = document.createElement('div');
          skillTag.className = 'skill-tag';
          skillTag.innerHTML = `<i class="fas fa-check-circle"></i> ${skill}`;
          container.appendChild(skillTag);
        });
      }
    }
    
    // Add Certificate
    function addCertificate() {
      const certificateItem = document.createElement('div');
      certificateItem.className = 'certificate-item';
      
      certificateItem.innerHTML = `
        <div class="input-with-icon">
          <i class="fas fa-certificate input-icon"></i>
          <input type="text" class="certificate-name form-input" placeholder="Certification name (e.g., AWS Certified Solutions Architect)">
        </div>
        <div class="certificate-year-container">
          <input type="text" class="certificate-year form-input" placeholder="Year">
          <button type="button" class="remove-certificate-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
      
      certificatesContainer.appendChild(certificateItem);
      
      // Add event listener to remove button
      certificateItem.querySelector('.remove-certificate-btn').addEventListener('click', function() {
        certificateItem.remove();
        updateCV();
      });
      
      // Add event listeners for input updates
      certificateItem.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updateCV);
      });
      
      updateCV();
    }
    
    // Select Template
    function selectTemplate(template) {
      templateOptions.forEach(option => option.classList.remove('active'));
      document.querySelector(`.template-option[data-template="${template}"]`).classList.add('active');
      selectedTemplate = template;
    }
    
    // Select Color
    function selectColor(color) {
      colorOptions.forEach(option => option.classList.remove('active'));
      document.querySelector(`.color-option[data-color="${color}"]`).classList.add('active');
      selectedColor = color;
      
      // Update CSS variable
      document.documentElement.style.setProperty('--cv-primary', `var(--color-${color})`);
    }
    
    // Update Font Preview
    function updateFontPreview() {
      const fontFamily = getFontFamily(selectedFont);
      fontPreview.style.fontFamily = fontFamily;
    }
    
    // Get Font Family
    function getFontFamily(font) {
      switch (font) {
        case 'inter':
          return "'Inter', sans-serif";
        case 'roboto':
          return "'Roboto', sans-serif";
        case 'poppins':
          return "'Poppins', sans-serif";
        case 'montserrat':
          return "'Montserrat', sans-serif";
        case 'playfair':
          return "'Playfair Display', serif";
        case 'merriweather':
          return "'Merriweather', serif";
        default:
          return "'Inter', sans-serif";
      }
    }
    
    // Update Progress
    function updateProgress() {
      const requiredFields = document.querySelectorAll('.required');
      const filledFields = Array.from(requiredFields).filter(field => field.value.trim() !== '');
      
      const progressPercentage = Math.round((filledFields.length / requiredFields.length) * 100);
      
      progressFill.style.width = `${progressPercentage}%`;
      progressText.textContent = `${progressPercentage}% Complete`;
    }
    
    // Generate Empty CV
    function generateEmptyCV() {
      updateCV();
    }
    
    // Update CV with current data
    function updateCV() {
      // Collect form data
      const data = collectFormData();
      
      // Generate CV HTML based on selected template
      let cvHTML = '';
      switch (selectedTemplate) {
        case 'modern':
          cvHTML = generateModernTemplate(data);
          break;
        case 'classic':
          cvHTML = generateClassicTemplate(data);
          break;
        case 'minimalist':
          cvHTML = generateMinimalistTemplate(data);
          break;
        case 'creative':
          cvHTML = generateCreativeTemplate(data);
          break;
        default:
          cvHTML = generateModernTemplate(data);
      }
      
      // Insert CV HTML into preview
      cvPreview.innerHTML = cvHTML;
      
      // Apply layout options
      applyLayoutOptions();
      
      // Apply font family
      cvPreview.style.fontFamily = getFontFamily(selectedFont);
      
      // Update progress
      updateProgress();
      
      // Auto-save
      saveToLocalStorage();
    }
    
    // Apply layout options
    function applyLayoutOptions() {
      if (compactLayoutCheckbox.checked) {
        cvPreview.classList.add('compact-layout');
      } else {
        cvPreview.classList.remove('compact-layout');
      }
      
      if (showBordersCheckbox.checked) {
        cvPreview.classList.add('show-borders');
      } else {
        cvPreview.classList.remove('show-borders');
      }
    }
    
    // Collect form data
    function collectFormData() {
      // Personal Info
      const personalInfo = {
        fullName: fullNameInput.value.trim(),
        jobTitle: jobTitleInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        location: locationInput.value.trim(),
        linkedin: linkedinInput.value.trim(),
        website: websiteInput.value.trim(),
        github: githubInput.value.trim(),
        twitter: twitterInput.value.trim(),
        summary: profileSummaryInput.value.trim(),
        photo: userPhoto
      };
      
      // Education
      const education = [];
      const educationItems = document.querySelectorAll('.education-item');
      
      educationItems.forEach(item => {
        const degree = item.querySelector('.education-degree').value.trim();
        const institution = item.querySelector('.education-institution').value.trim();
        const from = item.querySelector('.education-from').value.trim();
        const to = item.querySelector('.education-to').value.trim();
        const location = item.querySelector('.education-location')?.value.trim() || '';
        const description = item.querySelector('.education-description').value.trim();
        
        education.push({
          degree,
          institution,
          location,
          from,
          to,
          description
        });
      });
      
      // Experience
      const experience = [];
      const experienceItems = document.querySelectorAll('.experience-item');
      
      experienceItems.forEach(item => {
        const title = item.querySelector('.experience-title').value.trim();
        const company = item.querySelector('.experience-company').value.trim();
        const from = item.querySelector('.experience-from').value.trim();
        const to = item.querySelector('.experience-to').value.trim();
        const location = item.querySelector('.experience-location')?.value.trim() || '';
        const description = item.querySelector('.experience-description').value.trim();
        
        experience.push({
          title,
          company,
          location,
          from,
          to,
          description
        });
      });
      
      // Skills
      const skills = {
        technical: technicalSkillsInput.value.trim(),
        soft: softSkillsInput.value.trim(),
        languages: languagesInput.value.trim()
      };
      
      // Certificates
      const certificates = [];
      const certificateItems = document.querySelectorAll('.certificate-item');
      
      certificateItems.forEach(item => {
        const name = item.querySelector('.certificate-name').value.trim();
        const year = item.querySelector('.certificate-year').value.trim();
        
        if (name) {
          certificates.push({
            name,
            year
          });
        }
      });
      
      return {
        personalInfo,
        education,
        experience,
        skills,
        certificates
      };
    }
    
    // Validate and Generate CV
    function validateAndGenerateCV() {
      // Validate required fields
      const requiredFields = document.querySelectorAll('.required');
      let isValid = true;
      let firstInvalidField = null;
      
      requiredFields.forEach(field => {
        const errorId = `${field.id}-error`;
        const errorElement = document.getElementById(errorId);
        
        if (field.value.trim() === '') {
          isValid = false;
          if (errorElement) {
            errorElement.style.display = 'block';
          }
          if (!firstInvalidField) {
            firstInvalidField = field;
          }
        } else {
          if (errorElement) {
            errorElement.style.display = 'none';
          }
        }
      });
      
      // Check if education and experience sections have at least one item
      if (educationItemsContainer.children.length === 0) {
        isValid = false;
        showNotification('Please add at least one education entry', 'error');
        activateTab('education-section');
        return;
      }
      
      if (experienceItemsContainer.children.length === 0) {
        isValid = false;
        showNotification('Please add at least one experience entry', 'error');
        activateTab('experience-section');
        return;
      }
      
      // Validate email format
      if (emailInput.value.trim() && !isValidEmail(emailInput.value.trim())) {
        isValid = false;
        document.getElementById('email-error').style.display = 'block';
        if (!firstInvalidField) {
          firstInvalidField = emailInput;
        }
      }
      
      if (!isValid) {
        // Focus on first invalid field
        if (firstInvalidField) {
          // Find the section containing the field
          const section = firstInvalidField.closest('.form-section');
          if (section) {
            activateTab(section.id);
          }
          
          // Focus on the field
          firstInvalidField.focus();
        }
        
        showNotification('Please fill in all required fields correctly', 'error');
        return;
      }
      
      // Show success notification
      showNotification('Your CV is ready! You can download it as a PDF.', 'success');
      
      // Start download
      downloadCV();
    }
    
    // Download CV as PDF
    function downloadCV() {
      showNotification('Preparing your CV for download...', 'info');
      
      // Reset zoom for PDF generation
      const currentZoom = zoomLevel;
      zoomLevel = 100;
      cvPreview.style.transform = `scale(1)`;
      
      // Use html2canvas to capture the CV
      html2canvas(cvPreview, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      }).then(canvas => {
        // Convert canvas to image
        const imgData = canvas.toDataURL('image/png');
        
        // Initialize jsPDF
        const pdf = new jspdf.jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Add image to PDF
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        // Download PDF
        const fullName = fullNameInput.value.trim() || 'CV';
        const sanitizedName = fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `${sanitizedName}_${new Date().toISOString().slice(0, 10)}.pdf`;
        
        pdf.save(fileName);
        
        // Restore zoom level
        zoomLevel = currentZoom;
        applyZoom();
        
        showNotification('CV downloaded successfully!', 'success');
      }).catch(error => {
        console.error('Error generating PDF:', error);
        showNotification('Failed to generate PDF. Please try again.', 'error');
        
        // Restore zoom level
        zoomLevel = currentZoom;
        applyZoom();
      });
    }
    
    // Zoom In
    function zoomIn() {
      if (zoomLevel < 200) {
        zoomLevel += 10;
        applyZoom();
      }
    }
    
    // Zoom Out
    function zoomOut() {
      if (zoomLevel > 50) {
        zoomLevel -= 10;
        applyZoom();
      }
    }
    
    // Apply Zoom
    function applyZoom() {
      cvPreview.style.transform = `scale(${zoomLevel / 100})`;
      zoomLevelText.textContent = `${zoomLevel}%`;
    }
    
    // Save CV
    function saveCV() {
      const cvName = prompt('Enter a name for this CV:');
      
      if (cvName) {
        const data = collectFormData();
        const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
        
        // Create saved CV object
        const savedCV = {
          id: Date.now(),
          name: cvName,
          date: new Date().toISOString(),
          template: selectedTemplate,
          color: selectedColor,
          font: selectedFont,
          data: data
        };
        
        // Add to saved CVs
        savedCVs.push(savedCV);
        localStorage.setItem('savedCVs', JSON.stringify(savedCVs));
        
        showNotification(`CV "${cvName}" saved successfully!`, 'success');
      }
    }
    
    // Show Load Modal
    function showLoadModal() {
      const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
      
      if (savedCVs.length === 0) {
        savedCvsContainer.innerHTML = `
          <div class="no-saved-cvs">
            <i class="fas fa-file-alt"></i>
            <p>No saved CVs found.</p>
          </div>
        `;
      } else {
        savedCvsContainer.innerHTML = '';
        
        savedCVs.forEach(cv => {
          const date = new Date(cv.date).toLocaleDateString();
          
          const cvItem = document.createElement('div');
          cvItem.className = 'saved-cv-item';
          
          cvItem.innerHTML = `
            <div class="saved-cv-info">
              <div class="saved-cv-name">${cv.name}</div>
              <div class="saved-cv-date">${date}</div>
            </div>
            <div class="saved-cv-actions">
              <button class="load-cv-btn" data-id="${cv.id}" title="Load CV">
                <i class="fas fa-folder-open"></i>
              </button>
              <button class="delete-cv-btn" data-id="${cv.id}" title="Delete CV">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          `;
          
          // Add event listeners
          cvItem.querySelector('.load-cv-btn').addEventListener('click', function() {
            loadCV(cv.id);
          });
          
          cvItem.querySelector('.delete-cv-btn').addEventListener('click', function() {
            deleteSavedCV(cv.id, cv.name);
          });
          
          savedCvsContainer.appendChild(cvItem);
        });
      }
      
      // Show modal
      dataModal.classList.add('show');
    }
    
    // Load CV
    function loadCV(id) {
      const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
      const cv = savedCVs.find(cv => cv.id === id);
      
      if (cv) {
        // Confirm load
        showConfirmModal(
          'Load CV',
          `Are you sure you want to load "${cv.name}"? This will replace your current CV.`,
          () => {
            // Load CV data
            loadCVData(cv);
            
            // Close modal
            closeModal();
            
            showNotification(`CV "${cv.name}" loaded successfully!`, 'success');
          }
        );
      }
    }
    
    // Load CV Data
    function loadCVData(cv) {
      // Set template, color, and font
      selectTemplate(cv.template);
      selectColor(cv.color);
      selectedFont = cv.font;
      fontSelection.value = cv.font;
      updateFontPreview();
      
      // Load personal info
      fullNameInput.value = cv.data.personalInfo.fullName || '';
      jobTitleInput.value = cv.data.personalInfo.jobTitle || '';
      emailInput.value = cv.data.personalInfo.email || '';
      phoneInput.value = cv.data.personalInfo.phone || '';
      locationInput.value = cv.data.personalInfo.location || '';
      linkedinInput.value = cv.data.personalInfo.linkedin || '';
      websiteInput.value = cv.data.personalInfo.website || '';
      githubInput.value = cv.data.personalInfo.github || '';
      twitterInput.value = cv.data.personalInfo.twitter || '';
      profileSummaryInput.value = cv.data.personalInfo.summary || '';
      
      // Load photo
      if (cv.data.personalInfo.photo) {
        userPhoto = cv.data.personalInfo.photo;
        photoPreview.innerHTML = `<img src="${userPhoto}" alt="Profile Photo">`;
      } else {
        removePhoto();
      }
      
      // Update character count
      summaryCount.textContent = profileSummaryInput.value.length;
      
      // Clear existing education items
      educationItemsContainer.innerHTML = '';
      educationCounter = 0;
      
      // Add education items
      if (cv.data.education && cv.data.education.length > 0) {
        educationEmptyMessage.style.display = 'none';
        
        cv.data.education.forEach(edu => {
          addEducation();
          
          const item = educationItemsContainer.lastChild;
          item.querySelector('.education-degree').value = edu.degree || '';
          item.querySelector('.education-institution').value = edu.institution || '';
          item.querySelector('.education-from').value = edu.from || '';
          item.querySelector('.education-to').value = edu.to || '';
          
          if (item.querySelector('.education-location')) {
            item.querySelector('.education-location').value = edu.location || '';
          }
          
          item.querySelector('.education-description').value = edu.description || '';
        });
      } else {
        educationEmptyMessage.style.display = 'block';
      }
      
      // Clear existing experience items
      experienceItemsContainer.innerHTML = '';
      experienceCounter = 0;
      
      // Add experience items
      if (cv.data.experience && cv.data.experience.length > 0) {
        experienceEmptyMessage.style.display = 'none';
        
        cv.data.experience.forEach(exp => {
          addExperience();
          
          const item = experienceItemsContainer.lastChild;
          item.querySelector('.experience-title').value = exp.title || '';
          item.querySelector('.experience-company').value = exp.company || '';
          item.querySelector('.experience-from').value = exp.from || '';
          item.querySelector('.experience-to').value = exp.to || '';
          
          if (item.querySelector('.experience-location')) {
            item.querySelector('.experience-location').value = exp.location || '';
          }
          
          item.querySelector('.experience-description').value = exp.description || '';
        });
      } else {
        experienceEmptyMessage.style.display = 'block';
      }
      
      // Load skills
      technicalSkillsInput.value = cv.data.skills.technical || '';
      softSkillsInput.value = cv.data.skills.soft || '';
      languagesInput.value = cv.data.skills.languages || '';
      
      // Update skills previews
      updateSkillsPreview(technicalSkillsInput.value, technicalSkillsPreview);
      updateSkillsPreview(softSkillsInput.value, softSkillsPreview);
      updateSkillsPreview(languagesInput.value, languagesPreview);
      
      // Clear existing certificates
      certificatesContainer.innerHTML = '';
      
      // Add certificates
      if (cv.data.certificates && cv.data.certificates.length > 0) {
        cv.data.certificates.forEach(cert => {
          addCertificate();
          
          const item = certificatesContainer.lastChild;
          item.querySelector('.certificate-name').value = cert.name || '';
          item.querySelector('.certificate-year').value = cert.year || '';
        });
      }
      
      // Update CV
      updateCV();
      
      // Go to first tab
      activateTab('personal-section');
    }
    
    // Delete Saved CV
    function deleteSavedCV(id, name) {
      showConfirmModal(
        'Delete CV',
        `Are you sure you want to delete "${name}"? This cannot be undone.`,
        () => {
          const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '[]');
          const updatedCVs = savedCVs.filter(cv => cv.id !== id);
          
          localStorage.setItem('savedCVs', JSON.stringify(updatedCVs));
          
          // Refresh load modal
          showLoadModal();
          
          showNotification(`CV "${name}" deleted successfully!`, 'success');
        }
      );
    }
    
    // Confirm Reset
    function confirmReset() {
      showConfirmModal(
        'Reset Form',
        'Are you sure you want to reset the form? This will clear all your data.',
        resetForm
      );
    }
    
    // Reset Form
    function resetForm() {
      // Reset personal info
      fullNameInput.value = '';
      jobTitleInput.value = '';
      emailInput.value = '';
      phoneInput.value = '';
      locationInput.value = '';
      linkedinInput.value = '';
      websiteInput.value = '';
      githubInput.value = '';
      twitterInput.value = '';
      profileSummaryInput.value = '';
      
      // Reset photo
      removePhoto();
      
      // Clear education items
      educationItemsContainer.innerHTML = '';
      educationCounter = 0;
      educationEmptyMessage.style.display = 'block';
      
      // Clear experience items
      experienceItemsContainer.innerHTML = '';
      experienceCounter = 0;
      experienceEmptyMessage.style.display = 'block';
      
      // Reset skills
      technicalSkillsInput.value = '';
      softSkillsInput.value = '';
      languagesInput.value = '';
      
      // Clear skills previews
      technicalSkillsPreview.innerHTML = '';
      softSkillsPreview.innerHTML = '';
      languagesPreview.innerHTML = '';
      
      // Clear certificates
      certificatesContainer.innerHTML = '';
      
      // Reset template and color
      selectTemplate('modern');
      selectColor('blue');
      
      // Reset font
      selectedFont = 'inter';
      fontSelection.value = 'inter';
      updateFontPreview();
      
      // Reset layout options
      compactLayoutCheckbox.checked = false;
      showBordersCheckbox.checked = false;
      
      // Update CV
      updateCV();
      
      // Go to first tab
      activateTab('personal-section');
      
      showNotification('Form reset successfully!', 'success');
    }
    
    // Show Confirm Modal
    function showConfirmModal(title, message, confirmAction) {
      confirmTitle.textContent = title;
      confirmMessage.textContent = message;
      currentConfirmAction = confirmAction;
      
      confirmModal.classList.add('show');
    }
    
    // Close Confirm Modal
    function closeConfirmModal() {
      confirmModal.classList.remove('show');
    }
    
    // Execute Confirm Action
    function executeConfirmAction() {
      if (typeof currentConfirmAction === 'function') {
        currentConfirmAction();
      }
      
      closeConfirmModal();
    }
    
    // Close Modal
    function closeModal() {
      dataModal.classList.remove('show');
    }
    
    // Show Notification
    function showNotification(message, type = 'info') {
      // Remove any existing notification
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
        document.body.removeChild(existingNotification);
      }
      
      // Create new notification
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      
      // Add icon based on type
      let icon = 'info-circle';
      if (type === 'success') icon = 'check-circle';
      if (type === 'error') icon = 'exclamation-circle';
      if (type === 'warning') icon = 'exclamation-triangle';
      
      notification.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span>`;
      
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
    
    // Save to localStorage
    function saveToLocalStorage() {
      try {
        const data = collectFormData();
        const cvState = {
          template: selectedTemplate,
          color: selectedColor,
          font: selectedFont,
          data: data
        };
        
        localStorage.setItem('cvCreatorState', JSON.stringify(cvState));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    
    // Load from localStorage
    function loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('cvCreatorState');
        
        if (saved) {
          const cvState = JSON.parse(saved);
          
          // Load CV data
          loadCVData(cvState);
        } else {
          // If no saved state, add initial education and experience
          addEducation();
          addExperience();
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        
        // Add initial education and experience
        addEducation();
        addExperience();
      }
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
    
    // Generate Modern Template
    function generateModernTemplate(data) {
      // Parse skills into arrays
      const technicalSkills = data.skills.technical.split(',').map(skill => skill.trim()).filter(Boolean);
      const softSkills = data.skills.soft.split(',').map(skill => skill.trim()).filter(Boolean);
      const languages = data.skills.languages.split(',').map(language => language.trim()).filter(Boolean);
      
      // Generate HTML
      return `
        <div class="cv-modern">
          <!-- Sidebar -->
          <div class="cv-modern-sidebar">
            <!-- Photo/Avatar -->
            <div class="cv-modern-photo">
              ${data.personalInfo.photo 
                ? `<img src="${data.personalInfo.photo}" alt="${data.personalInfo.fullName || 'Profile Photo'}">`
                : `<i class="fas fa-user"></i>`}
            </div>
            
            <!-- Name and Title -->
            <h2>${data.personalInfo.fullName || 'Your Name'}</h2>
            <div class="cv-modern-job-title">${data.personalInfo.jobTitle || 'Your Profession'}</div>
            
            <!-- Contact Information -->
            <div class="cv-modern-contact">
              <h3 class="cv-modern-section-title">Contact</h3>
              
              ${data.personalInfo.email ? `
                <div class="cv-contact-item">
                  <i class="fas fa-envelope"></i>
                  <span>${data.personalInfo.email}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.phone ? `
                <div class="cv-contact-item">
                  <i class="fas fa-phone-alt"></i>
                  <span>${data.personalInfo.phone}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.location ? `
                <div class="cv-contact-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>${data.personalInfo.location}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.linkedin ? `
                <div class="cv-contact-item">
                  <i class="fab fa-linkedin-in"></i>
                  <span>${data.personalInfo.linkedin}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.website ? `
                <div class="cv-contact-item">
                  <i class="fas fa-globe"></i>
                  <span>${data.personalInfo.website}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.github ? `
                <div class="cv-contact-item">
                  <i class="fab fa-github"></i>
                  <span>${data.personalInfo.github}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.twitter ? `
                <div class="cv-contact-item">
                  <i class="fab fa-twitter"></i>
                  <span>${data.personalInfo.twitter}</span>
                </div>
              ` : ''}
            </div>
            
            <!-- Skills -->
            <div class="cv-modern-skills">
              <h3 class="cv-modern-section-title">Skills</h3>
              
              <ul>
                ${technicalSkills.map(skill => `<li>${skill}</li>`).join('')}
              </ul>
            </div>
            
            ${softSkills.length > 0 ? `
              <!-- Soft Skills -->
              <div class="cv-modern-skills">
                <h3 class="cv-modern-section-title">Soft Skills</h3>
                
                <ul>
                  ${softSkills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            
            ${languages.length > 0 ? `
              <!-- Languages -->
              <div class="cv-modern-skills">
                <h3 class="cv-modern-section-title">Languages</h3>
                
                <ul>
                  ${languages.map(language => `<li>${language}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            
            ${data.certificates && data.certificates.length > 0 ? `
              <!-- Certifications -->
              <div class="cv-modern-skills">
                <h3 class="cv-modern-section-title">Certifications</h3>
                
                <ul>
                  ${data.certificates.map(cert => `
                    <li>${cert.name}${cert.year ? ` (${cert.year})` : ''}</li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
          
          <!-- Main Content -->
          <div class="cv-modern-main">
            <!-- Name and Title (Mobile) -->
            <h2>${data.personalInfo.fullName || 'Your Name'}</h2>
            <div class="cv-modern-main-job">${data.personalInfo.jobTitle || 'Your Profession'}</div>
            
            <!-- Professional Summary -->
            ${data.personalInfo.summary ? `
              <div class="cv-modern-main-section">
                <h3>Professional Summary</h3>
                <div class="cv-modern-summary">
                  ${data.personalInfo.summary}
                </div>
              </div>
            ` : ''}
            
            <!-- Experience -->
            <div class="cv-modern-main-section">
              <h3>Work Experience</h3>
              
              ${data.experience.map(exp => `
                <div class="cv-experience-item">
                  <div class="cv-item-header">
                    <div class="cv-item-title">${exp.title || 'Job Title'}</div>
                    <div class="cv-item-date">${exp.from || ''}${exp.from && exp.to ? ' - ' : ''}${exp.to || ''}</div>
                  </div>
                  <div class="cv-item-subtitle">${exp.company || 'Company Name'}${exp.location ? `, ${exp.location}` : ''}</div>
                  <div class="cv-item-description">${exp.description || ''}</div>
                </div>
              `).join('')}
            </div>
            
            <!-- Education -->
            <div class="cv-modern-main-section">
              <h3>Education</h3>
              
              ${data.education.map(edu => `
                <div class="cv-education-item">
                  <div class="cv-item-header">
                    <div class="cv-item-title">${edu.degree || 'Degree/Course'}</div>
                    <div class="cv-item-date">${edu.from || ''}${edu.from && edu.to ? ' - ' : ''}${edu.to || ''}</div>
                  </div>
                  <div class="cv-item-subtitle">${edu.institution || 'Institution Name'}${edu.location ? `, ${edu.location}` : ''}</div>
                  ${edu.description ? `<div class="cv-item-description">${edu.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }
    
    // Generate Classic Template
    function generateClassicTemplate(data) {
      // Parse skills into arrays
      const technicalSkills = data.skills.technical.split(',').map(skill => skill.trim()).filter(Boolean);
      const softSkills = data.skills.soft.split(',').map(skill => skill.trim()).filter(Boolean);
      const languages = data.skills.languages.split(',').map(language => language.trim()).filter(Boolean);
      
      // Generate HTML
      return `
        <div class="cv-classic">
          <!-- Header -->
          <div class="cv-classic-header">
            <h1 class="cv-classic-name">${data.personalInfo.fullName || 'Your Name'}</h1>
            <div class="cv-classic-job">${data.personalInfo.jobTitle || 'Your Profession'}</div>
            
            <div class="cv-classic-contact">
              ${data.personalInfo.email ? `
                <div class="cv-classic-contact-item">
                  <i class="fas fa-envelope"></i>
                  <span>${data.personalInfo.email}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.phone ? `
                <div class="cv-classic-contact-item">
                  <i class="fas fa-phone-alt"></i>
                  <span>${data.personalInfo.phone}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.location ? `
                <div class="cv-classic-contact-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>${data.personalInfo.location}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.linkedin ? `
                <div class="cv-classic-contact-item">
                  <i class="fab fa-linkedin-in"></i>
                  <span>${data.personalInfo.linkedin}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.website ? `
                <div class="cv-classic-contact-item">
                  <i class="fas fa-globe"></i>
                  <span>${data.personalInfo.website}</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Main Content -->
          <div class="cv-classic-main">
            <!-- Professional Summary -->
            ${data.personalInfo.summary ? `
              <div class="cv-classic-section">
                <h3>Professional Summary</h3>
                <p>${data.personalInfo.summary}</p>
              </div>
            ` : ''}
            
            <!-- Experience -->
            <div class="cv-classic-section">
              <h3>Work Experience</h3>
              
              ${data.experience.map(exp => `
                <div class="cv-classic-experience-item">
                  <div class="cv-classic-item-header">
                    <div class="cv-classic-item-title">${exp.title || 'Job Title'}</div>
                    <div class="cv-classic-item-date">${exp.from || ''}${exp.from && exp.to ? ' - ' : ''}${exp.to || ''}</div>
                  </div>
                  <div class="cv-classic-item-subtitle">${exp.company || 'Company Name'}${exp.location ? `, ${exp.location}` : ''}</div>
                  <div class="cv-classic-item-description">${exp.description || ''}</div>
                </div>
              `).join('')}
            </div>
            
            <!-- Education -->
            <div class="cv-classic-section">
              <h3>Education</h3>
              
              ${data.education.map(edu => `
                <div class="cv-classic-education-item">
                  <div class="cv-classic-item-header">
                    <div class="cv-classic-item-title">${edu.degree || 'Degree/Course'}</div>
                    <div class="cv-classic-item-date">${edu.from || ''}${edu.from && edu.to ? ' - ' : ''}${edu.to || ''}</div>
                  </div>
                  <div class="cv-classic-item-subtitle">${edu.institution || 'Institution Name'}${edu.location ? `, ${edu.location}` : ''}</div>
                  ${edu.description ? `<div class="cv-classic-item-description">${edu.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
            
            <!-- Skills -->
            <div class="cv-classic-section">
              <h3>Skills</h3>
              
              <div class="cv-classic-skills">
                <div class="cv-classic-skills-category">
                  <h4>Technical Skills</h4>
                  <div class="cv-classic-skills-list">
                    ${technicalSkills.map(skill => `<div class="cv-classic-skill">${skill}</div>`).join('')}
                  </div>
                </div>
                
                ${softSkills.length > 0 ? `
                  <div class="cv-classic-skills-category">
                    <h4>Soft Skills</h4>
                    <div class="cv-classic-skills-list">
                      ${softSkills.map(skill => `<div class="cv-classic-skill">${skill}</div>`).join('')}
                    </div>
                  </div>
                ` : ''}
                
                ${languages.length > 0 ? `
                  <div class="cv-classic-skills-category">
                    <h4>Languages</h4>
                    <div class="cv-classic-skills-list">
                      ${languages.map(language => `<div class="cv-classic-skill">${language}</div>`).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
            
            ${data.certificates && data.certificates.length > 0 ? `
              <!-- Certifications -->
              <div class="cv-classic-section">
                <h3>Certifications</h3>
                <div class="cv-classic-skills-list">
                  ${data.certificates.map(cert => `
                    <div class="cv-classic-skill">${cert.name}${cert.year ? ` (${cert.year})` : ''}</div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }
    
    // Generate Minimalist Template
    function generateMinimalistTemplate(data) {
      // Parse skills into arrays
      const technicalSkills = data.skills.technical.split(',').map(skill => skill.trim()).filter(Boolean);
      const softSkills = data.skills.soft.split(',').map(skill => skill.trim()).filter(Boolean);
      const languages = data.skills.languages.split(',').map(language => language.trim()).filter(Boolean);
      
      // Generate HTML
      return `
        <div class="cv-minimalist">
          <!-- Header -->
          <div class="cv-minimalist-header">
            <div class="cv-minimalist-name-section">
              <h1>${data.personalInfo.fullName || 'Your Name'}</h1>
              <div class="cv-minimalist-job">${data.personalInfo.jobTitle || 'Your Profession'}</div>
              <p>${data.personalInfo.summary || ''}</p>
            </div>
            
            <div class="cv-minimalist-contact">
              ${data.personalInfo.email ? `
                <div class="cv-minimalist-contact-item">
                  <i class="fas fa-envelope"></i>
                  <span>${data.personalInfo.email}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.phone ? `
                <div class="cv-minimalist-contact-item">
                  <i class="fas fa-phone-alt"></i>
                  <span>${data.personalInfo.phone}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.location ? `
                <div class="cv-minimalist-contact-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>${data.personalInfo.location}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.linkedin ? `
                <div class="cv-minimalist-contact-item">
                  <i class="fab fa-linkedin-in"></i>
                  <span>${data.personalInfo.linkedin}</span>
                </div>
              ` : ''}
              
              ${data.personalInfo.website ? `
                <div class="cv-minimalist-contact-item">
                  <i class="fas fa-globe"></i>
                  <span>${data.personalInfo.website}</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Experience -->
          <div class="cv-minimalist-section">
            <h2>Experience</h2>
            
            ${data.experience.map(exp => `
              <div class="cv-minimalist-experience-item">
                <div class="cv-minimalist-item-date">${exp.from || ''}${exp.from && exp.to ? ' — ' : ''}${exp.to || ''}</div>
                <div class="cv-minimalist-item-content">
                  <h3>${exp.title || 'Job Title'}</h3>
                  <div class="cv-minimalist-item-subtitle">${exp.company || 'Company Name'}${exp.location ? `, ${exp.location}` : ''}</div>
                  <div class="cv-minimalist-item-description">${exp.description || ''}</div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <!-- Education -->
          <div class="cv-minimalist-section">
            <h2>Education</h2>
            
            ${data.education.map(edu => `
              <div class="cv-minimalist-education-item">
                <div class="cv-minimalist-item-date">${edu.from || ''}${edu.from && edu.to ? ' — ' : ''}${edu.to || ''}</div>
                <div class="cv-minimalist-item-content">
                  <h3>${edu.degree || 'Degree/Course'}</h3>
                  <div class="cv-minimalist-item-subtitle">${edu.institution || 'Institution Name'}${edu.location ? `, ${edu.location}` : ''}</div>
                  ${edu.description ? `<div class="cv-minimalist-item-description">${edu.description}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
          
          <!-- Skills -->
          <div class="cv-minimalist-section">
            <h2>Skills</h2>
            
            <div class="cv-minimalist-skills">
              <div class="cv-minimalist-skills-category">
                <h3>Technical</h3>
                <div class="cv-minimalist-skills-list">
                  ${technicalSkills.map(skill => `<div class="cv-minimalist-skill">${skill}</div>`).join('')}
                </div>
              </div>
              
              ${softSkills.length > 0 ? `
                <div class="cv-minimalist-skills-category">
                  <h3>Soft Skills</h3>
                  <div class="cv-minimalist-skills-list">
                    ${softSkills.map(skill => `<div class="cv-minimalist-skill">${skill}</div>`).join('')}
                  </div>
                </div>
              ` : ''}
              
              ${languages.length > 0 ? `
                <div class="cv-minimalist-skills-category">
                  <h3>Languages</h3>
                  <div class="cv-minimalist-skills-list">
                    ${languages.map(language => `<div class="cv-minimalist-skill">${language}</div>`).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
          
          ${data.certificates && data.certificates.length > 0 ? `
            <!-- Certifications -->
            <div class="cv-minimalist-section">
              <h2>Certifications</h2>
              <div class="cv-minimalist-skills-list">
                ${data.certificates.map(cert => `
                  <div class="cv-minimalist-skill">${cert.name}${cert.year ? ` (${cert.year})` : ''}</div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }
    
    // Generate Creative Template
    function generateCreativeTemplate(data) {
      // Parse skills into arrays
      const technicalSkills = data.skills.technical.split(',').map(skill => skill.trim()).filter(Boolean);
      const softSkills = data.skills.soft.split(',').map(skill => skill.trim()).filter(Boolean);
      const languages = data.skills.languages.split(',').map(language => language.trim()).filter(Boolean);
      
      // Generate HTML
      return `
        <div class="cv-creative">
          <!-- Header -->
          <div class="cv-creative-header">
            <div class="cv-creative-shape"></div>
            <div class="cv-creative-shape-2"></div>
            
            <div class="cv-creative-header-content">
              <h1 class="cv-creative-name">${data.personalInfo.fullName || 'Your Name'}</h1>
              <p class="cv-creative-job">${data.personalInfo.jobTitle || 'Your Profession'}</p>
            </div>
            
            <!-- Photo -->
            <div class="cv-creative-photo">
              ${data.personalInfo.photo 
                ? `<img src="${data.personalInfo.photo}" alt="${data.personalInfo.fullName || 'Profile Photo'}">`
                : `<i class="fas fa-user"></i>`}
            </div>
          </div>
          
          <!-- Main Content -->
          <div class="cv-creative-main">
            <div class="cv-creative-main-left">
              <!-- Professional Summary -->
              ${data.personalInfo.summary ? `
                <div class="cv-creative-section">
                  <h3>About Me</h3>
                  <div class="cv-creative-summary">
                    ${data.personalInfo.summary}
                  </div>
                </div>
              ` : ''}
              
              <!-- Experience -->
              <div class="cv-creative-section">
                <h3>Work Experience</h3>
                
                ${data.experience.map(exp => `
                  <div class="cv-creative-experience-item">
                    <div class="cv-creative-item-title">${exp.title || 'Job Title'}</div>
                    <div class="cv-creative-item-subtitle">
                      <span>${exp.company || 'Company Name'}${exp.location ? `, ${exp.location}` : ''}</span>
                      <span class="cv-creative-item-date">${exp.from || ''}${exp.from && exp.to ? ' - ' : ''}${exp.to || ''}</span>
                    </div>
                    <div class="cv-creative-item-description">${exp.description || ''}</div>
                  </div>
                `).join('')}
              </div>
              
              <!-- Education -->
              <div class="cv-creative-section">
                <h3>Education</h3>
                
                ${data.education.map(edu => `
                  <div class="cv-creative-education-item">
                    <div class="cv-creative-item-title">${edu.degree || 'Degree/Course'}</div>
                    <div class="cv-creative-item-subtitle">
                      <span>${edu.institution || 'Institution Name'}${edu.location ? `, ${edu.location}` : ''}</span>
                      <span class="cv-creative-item-date">${edu.from || ''}${edu.from && edu.to ? ' - ' : ''}${edu.to || ''}</span>
                    </div>
                    ${edu.description ? `<div class="cv-creative-item-description">${edu.description}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="cv-creative-main-right">
              <!-- Contact Information -->
              <div class="cv-creative-section">
                <h3>Contact</h3>
                
                <div class="cv-creative-contact">
                  ${data.personalInfo.email ? `
                    <div class="cv-creative-contact-item">
                      <i class="fas fa-envelope"></i>
                      <span>${data.personalInfo.email}</span>
                    </div>
                  ` : ''}
                  
                  ${data.personalInfo.phone ? `
                    <div class="cv-creative-contact-item">
                      <i class="fas fa-phone-alt"></i>
                      <span>${data.personalInfo.phone}</span>
                    </div>
                  ` : ''}
                  
                  ${data.personalInfo.location ? `
                    <div class="cv-creative-contact-item">
                      <i class="fas fa-map-marker-alt"></i>
                      <span>${data.personalInfo.location}</span>
                    </div>
                  ` : ''}
                  
                  ${data.personalInfo.linkedin ? `
                    <div class="cv-creative-contact-item">
                      <i class="fab fa-linkedin-in"></i>
                      <span>${data.personalInfo.linkedin}</span>
                    </div>
                  ` : ''}
                  
                  ${data.personalInfo.website ? `
                    <div class="cv-creative-contact-item">
                      <i class="fas fa-globe"></i>
                      <span>${data.personalInfo.website}</span>
                    </div>
                  ` : ''}
                  
                  ${data.personalInfo.github ? `
                    <div class="cv-creative-contact-item">
                      <i class="fab fa-github"></i>
                      <span>${data.personalInfo.github}</span>
                    </div>
                  ` : ''}
                  
                  ${data.personalInfo.twitter ? `
                    <div class="cv-creative-contact-item">
                      <i class="fab fa-twitter"></i>
                      <span>${data.personalInfo.twitter}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
              
              <!-- Skills -->
              <div class="cv-creative-section">
                <h3>Skills</h3>
                
                <div class="cv-creative-skills">
                  ${technicalSkills.map((skill, index) => {
                    const level = ['expert', 'advanced', 'intermediate', 'basic'][index % 4];
                    return `
                      <div class="cv-creative-skill-item">
                        <div class="cv-creative-skill-name">
                          <span>${skill}</span>
                        </div>
                        <div class="cv-creative-skill-level ${level}"></div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
              
              ${softSkills.length > 0 ? `
                <!-- Soft Skills -->
                <div class="cv-creative-section">
                  <h3>Soft Skills</h3>
                  
                  <div class="cv-creative-skills">
                    ${softSkills.map(skill => `
                      <div class="cv-creative-skill-item">
                        <div class="cv-creative-skill-name">
                          <span>${skill}</span>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              
              ${languages.length > 0 ? `
                <!-- Languages -->
                <div class="cv-creative-section">
                  <h3>Languages</h3>
                  
                  <div class="cv-creative-languages">
                    ${languages.map(language => `
                      <div class="cv-creative-lang-item">
                        <span>${language}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              
              ${data.certificates && data.certificates.length > 0 ? `
                <!-- Certifications -->
                <div class="cv-creative-section">
                  <h3>Certifications</h3>
                  
                  <div class="cv-creative-certificates">
                    ${data.certificates.map(cert => `
                      <div class="cv-creative-cert-item">
                        <span>${cert.name}</span>
                        ${cert.year ? `<span>${cert.year}</span>` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }
  });