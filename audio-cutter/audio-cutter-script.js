// Global variables for audio processing
let audioContext;
let audioBuffer;
let audioSource;
let waveformData = [];
let isPlaying = false;
let startTime = 0;
let endTime = 0;
let currentTime = 0;
let selectionStart = 0;
let selectionEnd = 0;
let originalFileName = '';
let animationId;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  initializeAudioCutter();
  
  if (typeof gsap !== 'undefined') {
    initGSAP();
  }
  
  initCustomCursor();
  initNavigation();
  initBackToTop();
  initFAQ();
});

// Initialize audio cutter functionality
function initializeAudioCutter() {
  const uploadArea = document.getElementById('uploadArea');
  const audioFileInput = document.getElementById('audioFile');
  
  // File upload handlers
  audioFileInput.addEventListener('change', handleFileUpload);
  
  // Drag and drop handlers
  uploadArea.addEventListener('dragover', handleDragOver);
  uploadArea.addEventListener('dragenter', handleDragEnter);
  uploadArea.addEventListener('dragleave', handleDragLeave);
  uploadArea.addEventListener('drop', handleFileDrop);
  
  // Time input handlers
  document.getElementById('startTime').addEventListener('change', updateTimeSelection);
  document.getElementById('endTime').addEventListener('change', updateTimeSelection);
  
  // Effect handlers
  document.getElementById('fadeIn').addEventListener('change', updateEffectValues);
  document.getElementById('fadeOut').addEventListener('change', updateEffectValues);
  document.getElementById('fadeInDuration').addEventListener('input', updateEffectValues);
  document.getElementById('fadeOutDuration').addEventListener('input', updateEffectValues);
  
  // Canvas click handler for selection
  const canvas = document.getElementById('waveformCanvas');
  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('mousedown', handleCanvasMouseDown);
  canvas.addEventListener('mousemove', handleCanvasMouseMove);
  canvas.addEventListener('mouseup', handleCanvasMouseUp);
  
  // Initialize Web Audio API
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  } catch (error) {
    console.error('Web Audio API not supported:', error);
    showError('Your browser does not support audio processing. Please use a modern browser.');
  }
}

// File handling functions
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    processAudioFile(file);
  }
}

function handleDragOver(event) {
  event.preventDefault();
  document.getElementById('uploadArea').classList.add('dragover');
}

function handleDragEnter(event) {
  event.preventDefault();
}

function handleDragLeave(event) {
  event.preventDefault();
  document.getElementById('uploadArea').classList.remove('dragover');
}

function handleFileDrop(event) {
  event.preventDefault();
  document.getElementById('uploadArea').classList.remove('dragover');
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith('audio/')) {
      processAudioFile(file);
    } else {
      showError('Please select a valid audio file.');
    }
  }
}

// Process uploaded audio file
async function processAudioFile(file) {
  try {
    showProgress('Loading audio file...', 20);
    
    // Store original file info
    originalFileName = file.name;
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('fileFormat').textContent = file.name.split('.').pop().toUpperCase();
    
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    showProgress('Decoding audio data...', 50);
    
    // Decode audio data
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Update duration display
    const duration = formatTime(audioBuffer.duration);
    document.getElementById('fileDuration').textContent = duration;
    
    // Set initial selection to full audio
    startTime = 0;
    endTime = audioBuffer.duration;
    selectionStart = 0;
    selectionEnd = 1;
    
    // Update time inputs
    document.getElementById('startTime').value = '00:00';
    document.getElementById('endTime').value = duration;
    
    showProgress('Generating waveform...', 80);
    
    // Generate waveform data
    generateWaveformData();
    drawWaveform();
    
    // Show editor and hide upload area
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('audioEditor').style.display = 'block';
    
    hideProgress();
    
    // Track successful upload
    trackToolUsage('file_uploaded', { 
      fileSize: file.size, 
      duration: audioBuffer.duration,
      format: file.name.split('.').pop() 
    });
    
  } catch (error) {
    console.error('Error processing audio file:', error);
    showError('Failed to process audio file. Please make sure it\'s a valid audio format.');
    hideProgress();
  }
}

// Generate waveform data
function generateWaveformData() {
  const channelData = audioBuffer.getChannelData(0);
  const samples = 1000; // Number of samples for waveform
  const blockSize = Math.floor(channelData.length / samples);
  
  waveformData = [];
  
  for (let i = 0; i < samples; i++) {
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(channelData[(i * blockSize) + j]);
    }
    waveformData.push(sum / blockSize);
  }
}

// Draw waveform on canvas
function drawWaveform() {
  const canvas = document.getElementById('waveformCanvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = canvas.offsetWidth;
  canvas.height = 120;
  
  const { width, height } = canvas;
  
  // Clear canvas
  ctx.fillStyle = 'rgba(22, 22, 31, 0.8)';
  ctx.fillRect(0, 0, width, height);
  
  // Draw waveform
  const barWidth = width / waveformData.length;
  const maxAmplitude = Math.max(...waveformData);
  
  waveformData.forEach((amplitude, index) => {
    const barHeight = (amplitude / maxAmplitude) * (height - 20);
    const x = index * barWidth;
    const y = (height - barHeight) / 2;
    
    // Color based on selection
    const progress = index / waveformData.length;
    if (progress >= selectionStart && progress <= selectionEnd) {
      ctx.fillStyle = '#7000ff';
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    }
    
    ctx.fillRect(x, y, barWidth - 1, barHeight);
  });
  
  // Draw selection overlay
  updateSelectionOverlay();
}

// Update selection overlay
function updateSelectionOverlay() {
  const overlay = document.getElementById('selectionOverlay');
  const canvas = document.getElementById('waveformCanvas');
  
  if (selectionStart !== selectionEnd) {
    const width = canvas.offsetWidth;
    const left = selectionStart * width;
    const selectionWidth = (selectionEnd - selectionStart) * width;
    
    overlay.style.left = `${left}px`;
    overlay.style.width = `${selectionWidth}px`;
    overlay.style.display = 'block';
  } else {
    overlay.style.display = 'none';
  }
}

// Canvas interaction handlers
let isSelecting = false;
let selectionStartX = 0;

function handleCanvasClick(event) {
  if (isSelecting) return;
  
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const progress = x / canvas.offsetWidth;
  
  currentTime = progress * audioBuffer.duration;
  
  // If shift key is held, extend selection
  if (event.shiftKey) {
    if (Math.abs(progress - selectionStart) < Math.abs(progress - selectionEnd)) {
      selectionStart = progress;
      startTime = currentTime;
    } else {
      selectionEnd = progress;
      endTime = currentTime;
    }
  } else {
    // Set playback position
    stopAudio();
  }
  
  updateTimeInputs();
  drawWaveform();
}

function handleCanvasMouseDown(event) {
  if (event.button !== 0) return; // Only left mouse button
  
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  
  isSelecting = true;
  selectionStartX = x / canvas.offsetWidth;
  selectionStart = selectionStartX;
  selectionEnd = selectionStartX;
  
  canvas.style.cursor = 'crosshair';
}

function handleCanvasMouseMove(event) {
  if (!isSelecting) return;
  
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const progress = Math.max(0, Math.min(1, x / canvas.offsetWidth));
  
  if (progress < selectionStartX) {
    selectionStart = progress;
    selectionEnd = selectionStartX;
  } else {
    selectionStart = selectionStartX;
    selectionEnd = progress;
  }
  
  startTime = selectionStart * audioBuffer.duration;
  endTime = selectionEnd * audioBuffer.duration;
  
  updateTimeInputs();
  drawWaveform();
}

function handleCanvasMouseUp(event) {
  if (!isSelecting) return;
  
  isSelecting = false;
  const canvas = event.target;
  canvas.style.cursor = 'pointer';
  
  // Ensure minimum selection length
  const minDuration = 0.1; // 0.1 seconds
  if (endTime - startTime < minDuration) {
    endTime = startTime + minDuration;
    selectionEnd = endTime / audioBuffer.duration;
    updateTimeInputs();
    drawWaveform();
  }
}

// Audio playback functions
function togglePlayPause() {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

function playAudio(fromSelection = false) {
  if (!audioBuffer) return;
  
  stopAudio();
  
  try {
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    
    const playStart = fromSelection ? startTime : currentTime;
    const playDuration = fromSelection ? (endTime - startTime) : undefined;
    
    audioSource.start(0, playStart, playDuration);
    
    isPlaying = true;
    updatePlayButton(true);
    
    audioSource.onended = () => {
      isPlaying = false;
      updatePlayButton(false);
    };
    
  } catch (error) {
    console.error('Error playing audio:', error);
    showError('Failed to play audio.');
  }
}

function pauseAudio() {
  if (audioSource && isPlaying) {
    audioSource.stop();
    isPlaying = false;
    updatePlayButton(false);
  }
}

function stopAudio() {
  if (audioSource) {
    try {
      audioSource.stop();
    } catch (error) {
      // Source might already be stopped
    }
    audioSource = null;
  }
  isPlaying = false;
  updatePlayButton(false);
}

function updatePlayButton(playing) {
  const btn = document.getElementById('playPauseBtn');
  const icon = btn.querySelector('i');
  
  if (playing) {
    icon.className = 'fas fa-pause';
    btn.classList.add('playing');
  } else {
    icon.className = 'fas fa-play';
    btn.classList.remove('playing');
  }
}

// Time handling functions
function updateTimeSelection() {
  const startInput = document.getElementById('startTime').value;
  const endInput = document.getElementById('endTime').value;
  
  startTime = parseTimeString(startInput);
  endTime = parseTimeString(endInput);
  
  // Validate times
  if (startTime >= endTime) {
    endTime = startTime + 0.1;
    document.getElementById('endTime').value = formatTime(endTime);
  }
  
  if (endTime > audioBuffer.duration) {
    endTime = audioBuffer.duration;
    document.getElementById('endTime').value = formatTime(endTime);
  }
  
  // Update selection
  selectionStart = startTime / audioBuffer.duration;
  selectionEnd = endTime / audioBuffer.duration;
  
  drawWaveform();
}

function updateTimeInputs() {
  document.getElementById('startTime').value = formatTime(startTime);
  document.getElementById('endTime').value = formatTime(endTime);
}

function setToCurrentTime(type) {
  if (type === 'start') {
    startTime = currentTime;
    selectionStart = currentTime / audioBuffer.duration;
    document.getElementById('startTime').value = formatTime(startTime);
  } else {
    endTime = currentTime;
    selectionEnd = currentTime / audioBuffer.duration;
    document.getElementById('endTime').value = formatTime(endTime);
  }
  
  drawWaveform();
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function parseTimeString(timeStr) {
  const parts = timeStr.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10) || 0;
    const seconds = parseInt(parts[1], 10) || 0;
    return minutes * 60 + seconds;
  }
  return 0;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Effect functions
function updateEffectValues() {
  const fadeInValue = document.getElementById('fadeInValue');
  const fadeOutValue = document.getElementById('fadeOutValue');
  
  fadeInValue.textContent = document.getElementById('fadeInDuration').value + 's';
  fadeOutValue.textContent = document.getElementById('fadeOutDuration').value + 's';
}

// Audio processing functions
function previewCut() {
  if (!audioBuffer) return;
  
  stopAudio();
  playAudio(true);
  
  trackToolUsage('preview_cut', { 
    duration: endTime - startTime 
  });
}

function resetSelection() {
  if (!audioBuffer) return;
  
  startTime = 0;
  endTime = audioBuffer.duration;
  selectionStart = 0;
  selectionEnd = 1;
  
  updateTimeInputs();
  drawWaveform();
}

async function cutAudio() {
  if (!audioBuffer) return;
  
  try {
    showProgress('Processing audio...', 0);
    
    const outputFormat = document.getElementById('outputFormat').value;
    const quality = parseInt(document.getElementById('quality').value);
    const fadeIn = document.getElementById('fadeIn').checked;
    const fadeOut = document.getElementById('fadeOut').checked;
    const fadeInDuration = parseFloat(document.getElementById('fadeInDuration').value);
    const fadeOutDuration = parseFloat(document.getElementById('fadeOutDuration').value);
    
    showProgress('Cutting audio...', 25);
    
    // Calculate selection in samples
    const sampleRate = audioBuffer.sampleRate;
    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);
    const duration = endTime - startTime;
    const lengthSamples = endSample - startSample;
    
    showProgress('Applying effects...', 50);
    
    // Create new buffer for cut audio
    const numberOfChannels = audioBuffer.numberOfChannels;
    const newBuffer = audioContext.createBuffer(numberOfChannels, lengthSamples, sampleRate);
    
    // Copy and process each channel
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = newBuffer.getChannelData(channel);
      
      // Copy selected portion
      for (let i = 0; i < lengthSamples; i++) {
        outputData[i] = inputData[startSample + i];
      }
      
      // Apply fade effects
      if (fadeIn && fadeInDuration > 0) {
        applyFadeIn(outputData, fadeInDuration, sampleRate);
      }
      
      if (fadeOut && fadeOutDuration > 0) {
        applyFadeOut(outputData, fadeOutDuration, sampleRate);
      }
    }
    
    showProgress('Encoding audio...', 75);
    
    // Convert to downloadable format
    const audioBlob = await encodeAudioBuffer(newBuffer, outputFormat, quality);
    
    showProgress('Preparing download...', 90);
    
    // Create download
    const fileName = generateFileName(originalFileName, outputFormat);
    createDownload(audioBlob, fileName);
    
    showProgress('Complete!', 100);
    
    // Show download section
    setTimeout(() => {
      hideProgress();
      showDownloadSection();
    }, 1000);
    
    // Track successful cut
    trackToolUsage('audio_cut', { 
      originalDuration: audioBuffer.duration,
      cutDuration: duration,
      format: outputFormat,
      quality: quality,
      fadeIn: fadeIn,
      fadeOut: fadeOut
    });
    
  } catch (error) {
    console.error('Error cutting audio:', error);
    showError('Failed to cut audio. Please try again.');
    hideProgress();
  }
}

// Audio effect functions
function applyFadeIn(audioData, duration, sampleRate) {
  const fadeSamples = Math.floor(duration * sampleRate);
  const actualFadeSamples = Math.min(fadeSamples, audioData.length);
  
  for (let i = 0; i < actualFadeSamples; i++) {
    const fadeMultiplier = i / actualFadeSamples;
    audioData[i] *= fadeMultiplier;
  }
}

function applyFadeOut(audioData, duration, sampleRate) {
  const fadeSamples = Math.floor(duration * sampleRate);
  const actualFadeSamples = Math.min(fadeSamples, audioData.length);
  const fadeStart = audioData.length - actualFadeSamples;
  
  for (let i = fadeStart; i < audioData.length; i++) {
    const fadeMultiplier = (audioData.length - i) / actualFadeSamples;
    audioData[i] *= fadeMultiplier;
  }
}

// Audio encoding (simplified - in real implementation you'd use libraries like lamejs for MP3)
async function encodeAudioBuffer(buffer, format, quality) {
  // For now, we'll export as WAV (which doesn't require external libraries)
  // In production, you'd integrate proper encoders for MP3, AAC, etc.
  
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  
  // Create WAV file
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * numberOfChannels * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * numberOfChannels * 2, true);
  
  // Convert float samples to 16-bit PCM
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

// Utility functions
function generateFileName(originalName, format) {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  return `${nameWithoutExt}_cut_${timestamp}.${format}`;
}

function createDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const downloadBtn = document.getElementById('downloadBtn');
  
  downloadBtn.onclick = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    trackToolUsage('file_downloaded', { fileName: fileName });
  };
}

function showDownloadSection() {
  document.getElementById('downloadSection').style.display = 'block';
  document.getElementById('downloadSection').scrollIntoView({ behavior: 'smooth' });
}

function resetTool() {
  // Stop any playing audio
  stopAudio();
  
  // Reset variables
  audioBuffer = null;
  waveformData = [];
  startTime = 0;
  endTime = 0;
  selectionStart = 0;
  selectionEnd = 0;
  originalFileName = '';
  
  // Show upload area, hide editor
  document.getElementById('uploadArea').style.display = 'block';
  document.getElementById('audioEditor').style.display = 'none';
  document.getElementById('downloadSection').style.display = 'none';
  
  // Reset file input
  document.getElementById('audioFile').value = '';
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Progress and error handling
function showProgress(message, percentage) {
  const container = document.getElementById('progressContainer');
  const fill = document.getElementById('progressFill');
  const text = document.getElementById('progressText');
  
  container.style.display = 'block';
  fill.style.width = percentage + '%';
  text.textContent = message;
}

function hideProgress() {
  document.getElementById('progressContainer').style.display = 'none';
}

function showError(message) {
  // Simple alert for now - you could implement a better error display
  alert('Error: ' + message);
}

// Analytics and tracking
function trackToolUsage(action, data = {}) {
  // Add your analytics tracking here
  console.log('Tool usage:', action, data);
  
  // Example: Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'audio_cutter_usage', {
      action: action,
      ...data
    });
  }
}

// Initialize GSAP animations
function initGSAP() {
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Page header animation
    gsap.fromTo('.page-header', {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out'
    });
    
    // Features animation
    gsap.fromTo('.feature-card', {
      y: 50,
      opacity: 0
    }, {
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 80%'
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }
}

// Initialize custom cursor
function initCustomCursor() {
  const cursor = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  if (!cursor || !cursorOutline) return;
  
  if (window.matchMedia("(min-width: 992px)").matches && !('ontouchstart' in window)) {
    const moveCursor = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      cursorOutline.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };
    
    window.addEventListener('mousemove', moveCursor);
    
    const interactiveElements = document.querySelectorAll('a, button, input, select, canvas, .feature-card');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.style.transform = "translate(-50%, -50%) scale(0.75)";
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
        cursorOutline.style.borderColor = "var(--primary)";
        cursorOutline.style.backgroundColor = "rgba(112, 0, 255, 0.1)";
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
        cursorOutline.style.borderColor = "var(--primary)";
        cursorOutline.style.backgroundColor = "transparent";
      });
    });
  }
}

// Initialize navigation
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  const updateNavbar = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', updateNavbar);
  updateNavbar();
  
  const toggleMobileMenu = () => {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  };
  
  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', toggleMobileMenu);
}

// Initialize back to top button
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  
  const toggleBackToTop = () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };
  
  window.addEventListener('scroll', toggleBackToTop);
  toggleBackToTop();
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize FAQ functionality
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      
      // Close all FAQ items
      faqItems.forEach(faq => faq.classList.remove('active'));
      
      // Open clicked item if it wasn't already active
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
}

// Handle window resize
window.addEventListener('resize', () => {
  if (waveformData.length > 0) {
    drawWaveform();
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
  if (event.target.tagName === 'INPUT') return;
  
  switch (event.key) {
    case ' ':
      event.preventDefault();
      togglePlayPause();
      break;
    case 'Escape':
      stopAudio();
      break;
    case 'r':
    case 'R':
      if (event.ctrlKey) {
        event.preventDefault();
        resetSelection();
      }
      break;
  }
});