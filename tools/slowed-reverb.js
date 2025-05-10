/**
 * Slowed & Reverb Creator - Main JavaScript
 * MB Tools
 * With Advanced Compression
 */

document.addEventListener('DOMContentLoaded', function() {
  // ==================== ELEMENT SELECTION ====================
  // Main sections
  const uploadSection = document.getElementById('uploadSection');
  const editorSection = document.getElementById('editorSection');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const progressBar = document.getElementById('progressBar');
  const loadingText = document.getElementById('loadingText');
  const loadingInfo = document.getElementById('loadingInfo');
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notificationMessage');
  
  // Upload elements
  const audioFileInput = document.getElementById('audioFileInput');
  const dropZone = document.getElementById('dropZone');
  const browseBtn = document.getElementById('browseBtn');
  
  // Audio preview controls
  const playPauseBtn = document.getElementById('playPauseBtn');
  const currentTimeDisplay = document.getElementById('currentTime');
  const totalTimeDisplay = document.getElementById('totalTime');
  const volumeSlider = document.getElementById('volumeSlider');
  const waveformContainer = document.getElementById('waveform');
  const originalAudioBtn = document.getElementById('originalAudioBtn');
  const effectAudioBtn = document.getElementById('effectAudioBtn');
  
  // Effect controls
  const presetBtns = document.querySelectorAll('.preset-btn');
  const tempoSlider = document.getElementById('tempoSlider');
  const tempoValue = document.getElementById('tempoValue');
  const reverbSlider = document.getElementById('reverbSlider');
  const reverbValue = document.getElementById('reverbValue');
  const decaySlider = document.getElementById('decaySlider');
  const decayValue = document.getElementById('decayValue');
  const bassSlider = document.getElementById('bassSlider');
  const bassValue = document.getElementById('bassValue');
  const pitchSlider = document.getElementById('pitchSlider');
  const pitchValue = document.getElementById('pitchValue');
  
  // Action buttons
  const resetEffectsBtn = document.getElementById('resetEffectsBtn');
  const applyEffectsBtn = document.getElementById('applyEffectsBtn');
  const backToUpload = document.getElementById('backToUpload');
  const resetAllBtn = document.getElementById('resetAllBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  
  // Output controls
  const outputFormat = document.getElementById('outputFormat');
  const qualitySlider = document.getElementById('qualitySlider');
  const qualityValue = document.getElementById('qualityValue');
  
  // Navigation elements
  const scrollToToolBtn = document.getElementById('scrollToToolBtn');
  const faqItems = document.querySelectorAll('.faq-item');
  
  // Notification close button
  const notificationClose = document.querySelector('.notification-close');
  if (notificationClose) {
      notificationClose.addEventListener('click', function() {
          notification.classList.remove('active');
      });
  }
  
  // ==================== STATE VARIABLES ====================
  let audioContext = null;
  let originalAudioFile = null;
  let originalBuffer = null;
  let processedBuffer = null;
  let currentAudioSource = null;
  let waveform = null;
  let isAudioPlaying = false;
  let isPreviewingEffect = false;
  let lastNotificationTimeout = null;
  let processingPromise = null;
  let compressionTimeout = null;
  
  // Effect parameters with default values
  let effectParams = {
    tempo: 75,      // percentage of original speed (50-90%)
    reverb: 60,     // percentage 0-100
    decay: 4,       // seconds (1-10)
    bassBoost: 3,   // dB (0-10)
    pitch: -2       // semitones (-12 to 12)
  };
  
  // Preset configurations
  const presets = {
    classic: { tempo: 75, reverb: 60, decay: 4, bassBoost: 3, pitch: -2 },
    dreamy: { tempo: 70, reverb: 80, decay: 6, bassBoost: 2, pitch: -3 },
    underwater: { tempo: 65, reverb: 90, decay: 8, bassBoost: 4, pitch: -4 },
    lofi: { tempo: 85, reverb: 40, decay: 2, bassBoost: 3, pitch: -1 },
    tiktok: { tempo: 75, reverb: 65, decay: 3, bassBoost: 4, pitch: -2 },
    custom: { tempo: 75, reverb: 60, decay: 4, bassBoost: 3, pitch: -2 }
  };
  
  // ==================== INITIALIZATION ====================
  function init() {
      // Initialize Web Audio API
      try {
          window.AudioContext = window.AudioContext || window.webkitAudioContext;
          audioContext = new AudioContext();
      } catch (e) {
          showNotification('Your browser does not support the Web Audio API. Please use a modern browser.', 5000);
          console.error('AudioContext initialization failed:', e);
      }
      
      // Initialize UI state
      editorSection.style.display = 'none';
      loadingOverlay.style.display = 'none';
      downloadBtn.disabled = true;
      
      // Setup all event listeners
      setupEventListeners();
      
      // Initialize WaveSurfer (if loaded)
      if (typeof WaveSurfer !== 'undefined') {
          initializeWaveform();
      } else {
          console.warn('WaveSurfer not loaded yet, will try again when page fully loads');
          window.addEventListener('load', function() {
              if (typeof WaveSurfer !== 'undefined') {
                  initializeWaveform();
              } else {
                  console.error('WaveSurfer.js is not available. Please check if the library is properly included.');
                  showNotification('Could not load audio visualization. Some features may be limited.', 3000);
              }
          });
      }
      
      // Initialize FAQ accordions
      initializeFAQ();
  }
  
  // Initialize waveform visualization
  function initializeWaveform() {
      try {
          waveform = WaveSurfer.create({
              container: waveformContainer,
              waveColor: 'rgba(158, 158, 179, 0.4)',
              progressColor: '#7000ff',
              cursorColor: '#00d9ff',
              barWidth: 2,
              barGap: 1,
              barRadius: 2,
              height: 140,
              responsive: true,
              normalize: true,
              partialRender: true
          });
          
          // Set up waveform events
          waveform.on('ready', function() {
              updateTimeDisplay(0, waveform.getDuration());
              totalTimeDisplay.textContent = formatTime(waveform.getDuration());
          });
          
          waveform.on('audioprocess', function(time) {
              updateTimeDisplay(time, waveform.getDuration());
          });
          
          waveform.on('seek', function(progress) {
              updateTimeDisplay(progress * waveform.getDuration(), waveform.getDuration());
          });
          
          waveform.on('finish', function() {
              playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
              isAudioPlaying = false;
          });
          
          waveform.on('error', function(error) {
              console.error('Waveform error:', error);
              showNotification('Error visualizing audio. Please try again.', 3000);
          });
      } catch (e) {
          console.error('Error initializing WaveSurfer:', e);
      }
  }
  
  // Set up all event listeners
  function setupEventListeners() {
      // File upload events
      if (browseBtn) {
          browseBtn.addEventListener('click', function() {
              audioFileInput.click();
          });
      }
      
      if (audioFileInput) {
          audioFileInput.addEventListener('change', handleFileSelect);
      }
      
      // Drag and drop events
      if (dropZone) {
          dropZone.addEventListener('dragover', handleDragOver);
          dropZone.addEventListener('dragleave', handleDragLeave);
          dropZone.addEventListener('drop', handleFileDrop);
          dropZone.addEventListener('click', function() {
              audioFileInput.click();
          });
      }
      
      // Audio player controls
      if (playPauseBtn) {
          playPauseBtn.addEventListener('click', togglePlayPause);
      }
      
      if (volumeSlider) {
          volumeSlider.addEventListener('input', adjustVolume);
      }
      
      // Audio preview toggle
      if (originalAudioBtn) {
          originalAudioBtn.addEventListener('click', function() {
              setActiveButton([originalAudioBtn, effectAudioBtn], this);
              switchAudioSource('original');
          });
      }
      
      if (effectAudioBtn) {
          effectAudioBtn.addEventListener('click', function() {
              setActiveButton([originalAudioBtn, effectAudioBtn], this);
              switchAudioSource('effect');
          });
      }
      
      // Effect preset buttons
      presetBtns.forEach(btn => {
          btn.addEventListener('click', function() {
              const preset = this.dataset.preset;
              setActiveButton(presetBtns, this);
              applyPreset(preset);
          });
      });
      
      // Effect parameter sliders
      if (tempoSlider) {
          tempoSlider.addEventListener('input', function() {
              effectParams.tempo = parseInt(this.value);
              tempoValue.textContent = this.value;
              updateCustomPreset();
          });
      }
      
      if (reverbSlider) {
          reverbSlider.addEventListener('input', function() {
              effectParams.reverb = parseInt(this.value);
              reverbValue.textContent = this.value;
              updateCustomPreset();
          });
      }
      
      if (decaySlider) {
          decaySlider.addEventListener('input', function() {
              effectParams.decay = parseInt(this.value);
              decayValue.textContent = this.value;
              updateCustomPreset();
          });
      }
      
      if (bassSlider) {
          bassSlider.addEventListener('input', function() {
              effectParams.bassBoost = parseInt(this.value);
              bassValue.textContent = this.value;
              updateCustomPreset();
          });
      }
      
      if (pitchSlider) {
          pitchSlider.addEventListener('input', function() {
              effectParams.pitch = parseInt(this.value);
              pitchValue.textContent = this.value;
              updateCustomPreset();
          });
      }
      
      // Output options
      if (qualitySlider) {
          qualitySlider.addEventListener('input', function() {
              qualityValue.textContent = this.value;
          });
      }
      
      // Action buttons
      if (resetEffectsBtn) {
          resetEffectsBtn.addEventListener('click', resetEffects);
      }
      
      if (applyEffectsBtn) {
          applyEffectsBtn.addEventListener('click', processAudio);
      }
      
      if (backToUpload && resetAllBtn) {
          backToUpload.addEventListener('click', resetTool);
          resetAllBtn.addEventListener('click', resetTool);
      }
      
      if (downloadBtn) {
          downloadBtn.addEventListener('click', downloadProcessedAudio);
      }
      
      // Scroll to tool button
      if (scrollToToolBtn) {
          scrollToToolBtn.addEventListener('click', function() {
              document.querySelector('.tool-container').scrollIntoView({
                  behavior: 'smooth'
              });
          });
      }
  }
  
  // Initialize FAQ accordions
  function initializeFAQ() {
      faqItems.forEach(item => {
          const question = item.querySelector('.faq-question');
          
          question.addEventListener('click', function() {
              const isActive = item.classList.contains('active');
              
              // Close all other FAQs
              faqItems.forEach(faq => {
                  faq.classList.remove('active');
              });
              
              // Toggle current FAQ
              if (!isActive) {
                  item.classList.add('active');
              }
          });
      });
  }
  
  // ==================== FILE HANDLING ====================
  // Handle file selection from input
  function handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
          processUploadedFile(file);
      }
  }
  
  // Handle drag over
  function handleDragOver(event) {
      event.preventDefault();
      event.stopPropagation();
      dropZone.classList.add('dragover');
  }
  
  // Handle drag leave
  function handleDragLeave(event) {
      event.preventDefault();
      event.stopPropagation();
      dropZone.classList.remove('dragover');
  }
  
  // Handle file drop
  function handleFileDrop(event) {
      event.preventDefault();
      event.stopPropagation();
      
      dropZone.classList.remove('dragover');
      
      const file = event.dataTransfer.files[0];
      if (file) {
          processUploadedFile(file);
      }
  }
  
  // Process uploaded file
  function processUploadedFile(file) {
      // Check if file is an audio file
      if (!file.type.startsWith('audio/')) {
          showNotification('Please upload an audio file (MP3, WAV, etc.)', 3000);
          return;
      }
      
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
          showNotification('File size exceeds the 50MB limit. Please upload a smaller file.', 3000);
          return;
      }
      
      // Store the original file
      originalAudioFile = file;
      
      // Show loading overlay
      loadingOverlay.style.display = 'flex';
      loadingText.textContent = 'Loading audio...';
      progressBar.style.width = '0%';
      
      // Read file as ArrayBuffer
      const reader = new FileReader();
      
      reader.onprogress = function(event) {
          if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              progressBar.style.width = percentComplete + '%';
          }
      };
      
      reader.onload = function(event) {
          // Decode audio data
          const arrayBuffer = event.target.result;
          
          if (audioContext.state === 'suspended') {
              audioContext.resume().then(decodeAudio);
          } else {
              decodeAudio();
          }
          
          function decodeAudio() {
              audioContext.decodeAudioData(arrayBuffer)
                  .then(function(decodedData) {
                      // Store original buffer
                      originalBuffer = decodedData;
                      
                      // Hide loading overlay
                      loadingOverlay.style.display = 'none';
                      
                      // Switch to editor section
                      uploadSection.style.display = 'none';
                      editorSection.style.display = 'block';
                      
                      // Update file info
                      const fileName = document.getElementById('fileName');
                      const fileSize = document.getElementById('fileSize');
                      const fileDuration = document.getElementById('fileDuration');
                      
                      fileName.textContent = originalAudioFile.name;
                      fileSize.textContent = formatFileSize(originalAudioFile.size);
                      fileDuration.textContent = formatTime(originalBuffer.duration);
                      
                      // Load audio into waveform
                      if (waveform) {
                          waveform.loadDecodedBuffer(originalBuffer);
                      }
                      
                      // Set original audio as active
                      setActiveButton([originalAudioBtn, effectAudioBtn], originalAudioBtn);
                      
                      // Apply default preset (Classic)
                      setActiveButton(presetBtns, document.querySelector('.preset-btn[data-preset="classic"]'));
                      applyPreset('classic');
                  })
                  .catch(function(error) {
                      loadingOverlay.style.display = 'none';
                      showNotification('Error decoding audio: ' + error.message, 3000);
                      console.error('Error decoding audio:', error);
                  });
          }
      };
      
      reader.onerror = function() {
          loadingOverlay.style.display = 'none';
          showNotification('Error reading file. Please try again.', 3000);
      };
      
      reader.readAsArrayBuffer(file);
  }
  
  // ==================== UI UTILITIES ====================
  // Show notification
  function showNotification(message, duration = 3000) {
      notificationMessage.textContent = message;
      notification.classList.add('active');
      
      // Clear previous timeout
      if (lastNotificationTimeout) {
          clearTimeout(lastNotificationTimeout);
      }
      
      // Hide notification after duration
      lastNotificationTimeout = setTimeout(function() {
          notification.classList.remove('active');
      }, duration);
  }
  
  // Set active button in a group
  function setActiveButton(buttons, activeButton) {
      buttons.forEach(button => {
          button.classList.remove('active');
      });
      activeButton.classList.add('active');
  }
  
  // Format time in seconds to MM:SS format
  function formatTime(seconds) {
      if (isNaN(seconds)) return '00:00';
      
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      
      return (
          String(minutes).padStart(2, '0') +
          ':' +
          String(remainingSeconds).padStart(2, '0')
      );
  }
  
  // Format file size in bytes to human-readable format
  function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // Update time display
  function updateTimeDisplay(currentTime, duration) {
      currentTimeDisplay.textContent = formatTime(currentTime);
      totalTimeDisplay.textContent = formatTime(duration);
  }
  
  // ==================== AUDIO PLAYBACK ====================
  // Toggle play/pause
  function togglePlayPause() {
      if (!waveform) return;
      
      if (isAudioPlaying) {
          waveform.pause();
          playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      } else {
          waveform.play();
          playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      }
      
      isAudioPlaying = !isAudioPlaying;
  }
  
  // Adjust volume
  function adjustVolume() {
      if (waveform) {
          waveform.setVolume(volumeSlider.value);
      }
  }
  
  // Switch between original and processed audio
  function switchAudioSource(source) {
      isPreviewingEffect = (source === 'effect');
      
      // If audio is playing, restart it with the new source
      const wasPlaying = isAudioPlaying;
      
      if (wasPlaying) {
          togglePlayPause(); // Pause current playback
      }
      
      if (source === 'original' && originalBuffer) {
          waveform.loadDecodedBuffer(originalBuffer);
          effectAudioBtn.classList.remove('active');
          originalAudioBtn.classList.add('active');
      } else if (source === 'effect' && processedBuffer) {
          waveform.loadDecodedBuffer(processedBuffer);
          originalAudioBtn.classList.remove('active');
          effectAudioBtn.classList.add('active');
      } else if (source === 'effect') {
          // No processed buffer yet, create a real-time preview
          previewEffect();
          return;
      }
      
      if (wasPlaying) {
          setTimeout(togglePlayPause, 100); // Resume playback with new source
      }
  }
  
  // Apply preset to effect parameters
  function applyPreset(presetName) {
      if (!presets[presetName]) return;
      
      // Get preset values
      const preset = presets[presetName];
      
      // Update sliders and values
      tempoSlider.value = preset.tempo;
      tempoValue.textContent = preset.tempo;
      
      reverbSlider.value = preset.reverb;
      reverbValue.textContent = preset.reverb;
      
      decaySlider.value = preset.decay;
      decayValue.textContent = preset.decay;
      
      bassSlider.value = preset.bassBoost;
      bassValue.textContent = preset.bassBoost;
      
      pitchSlider.value = preset.pitch;
      pitchValue.textContent = preset.pitch;
      
      // Update effect parameters
      effectParams = { ...preset };
      
      // Apply the preset in real-time if previewing effects
      if (isPreviewingEffect) {
          previewEffect();
      }
  }
  
  // Update custom preset with current slider values
  function updateCustomPreset() {
      // Update custom preset in presets
      presets.custom = { ...effectParams };
      
      // Set custom preset button as active
      setActiveButton(presetBtns, document.querySelector('.preset-btn[data-preset="custom"]'));
      
      // Apply the changes in real-time if previewing effects
      if (isPreviewingEffect) {
          previewEffect();
      }
  }
  
  // Reset effect parameters to default
  function resetEffects() {
      applyPreset('classic');
  }
  
  // Reset entire tool to initial state
  function resetTool() {
      // Reset UI
      uploadSection.style.display = 'block';
      editorSection.style.display = 'none';
      
      // Clear audio file input
      audioFileInput.value = '';
      
      // Reset parameters
      resetEffects();
      
      // Reset audio buffers
      originalBuffer = null;
      processedBuffer = null;
      
      // Reset waveform
      if (waveform) {
          waveform.empty();
      }
      
      // Reset button states
      downloadBtn.disabled = true;
      isAudioPlaying = false;
      isPreviewingEffect = false;
      
      // Update play button icon
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
  
  // Real-time preview of effects
  function previewEffect() {
      if (!originalBuffer) return;
      
      // Show loading for preview generation
      loadingOverlay.style.display = 'flex';
      loadingText.textContent = 'Generating preview...';
      progressBar.style.width = '0%';
      
      // Stop any existing playback
      if (isAudioPlaying) {
          waveform.pause();
          isAudioPlaying = false;
          playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
      
      // Create a new offline context for rendering
      const offlineCtx = new OfflineAudioContext(
          originalBuffer.numberOfChannels,
          originalBuffer.length * (100 / effectParams.tempo),
          originalBuffer.sampleRate
      );
      
      // Create source
      const source = offlineCtx.createBufferSource();
      source.buffer = originalBuffer;
      source.playbackRate.value = effectParams.tempo / 100;
      
      // Apply pitch shift if not zero
      if (effectParams.pitch !== 0) {
          try {
              // Create a simple pitch shift effect
              const pitchShift = effectParams.pitch;
              source.detune.value = pitchShift * 100; // Convert semitones to cents
          } catch (e) {
              console.warn('Pitch shifting not fully supported in this browser:', e);
          }
      }
      
      // Create bass boost
      const bassBoost = offlineCtx.createBiquadFilter();
      bassBoost.type = 'lowshelf';
      bassBoost.frequency.value = 100;
      bassBoost.gain.value = effectParams.bassBoost * 3; // Amplify effect for preview
      
      // Create reverb
      function createReverb() {
          const convolver = offlineCtx.createConvolver();
          
          // Create impulse response
          const decay = effectParams.decay;
          const impulseLength = offlineCtx.sampleRate * decay;
          const impulse = offlineCtx.createBuffer(2, impulseLength, offlineCtx.sampleRate);
          
          // Fill impulse buffer with noise with exponential decay
          for (let channel = 0; channel < 2; channel++) {
              const impulseData = impulse.getChannelData(channel);
              for (let i = 0; i < impulseLength; i++) {
                  impulseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, decay);
              }
          }
          
          convolver.buffer = impulse;
          return convolver;
      }
      
      const reverb = createReverb();
      
      // Create a gain node for reverb level
      const reverbGain = offlineCtx.createGain();
      reverbGain.gain.value = effectParams.reverb / 100;
      
      // Create a gain node for dry signal
      const dryGain = offlineCtx.createGain();
      dryGain.gain.value = 1 - (effectParams.reverb / 100 * 0.5); // Less reduction of dry signal
      
      // Connect nodes: source -> bassBoost -> dryGain -> destination
      //                                    -> reverb -> reverbGain -> destination
      source.connect(bassBoost);
      bassBoost.connect(dryGain);
      bassBoost.connect(reverb);
      reverb.connect(reverbGain);
      dryGain.connect(offlineCtx.destination);
      reverbGain.connect(offlineCtx.destination);
      
      // Start processing
      source.start(0);
      
      // Update progress
      let lastUpdateTime = Date.now();
      let renderedProgress = 0;
      const progressInterval = setInterval(() => {
          if (renderedProgress < 95) {
              renderedProgress += (Date.now() - lastUpdateTime) / 20; // Simulate progress
              lastUpdateTime = Date.now();
              progressBar.style.width = renderedProgress + '%';
          }
      }, 100);
      
      // Render audio
      offlineCtx.startRendering().then(function(renderedBuffer) {
          clearInterval(progressInterval);
          progressBar.style.width = '100%';
          
          processedBuffer = renderedBuffer;
          
          // Load processed buffer into waveform
          if (waveform) {
              waveform.loadDecodedBuffer(processedBuffer);
          }
          
          // Hide loading overlay
          loadingOverlay.style.display = 'none';
          
          // Enable download button
          downloadBtn.disabled = false;
      }).catch(function(err) {
          clearInterval(progressInterval);
          loadingOverlay.style.display = 'none';
          showNotification('Error generating preview: ' + err.message, 3000);
          console.error('Preview rendering error:', err);
          
          // Switch back to original audio
          setActiveButton([originalAudioBtn, effectAudioBtn], originalAudioBtn);
      });
  }
  
  // Process audio with effects
  function processAudio() {
      if (!originalBuffer) {
          showNotification('Please upload an audio file first', 3000);
          return;
      }
      
      // Disable apply button and show loading overlay
      applyEffectsBtn.disabled = true;
      loadingOverlay.style.display = 'flex';
      loadingText.textContent = 'Processing audio...';
      progressBar.style.width = '0%';
      loadingInfo.textContent = 'This may take a moment depending on the length of your audio file.';
      
      // Calculate new length based on tempo
      const newLength = Math.ceil(originalBuffer.length * (100 / effectParams.tempo));
      
      // Create offline context for processing
      const offlineCtx = new OfflineAudioContext(
          originalBuffer.numberOfChannels,
          newLength,
          originalBuffer.sampleRate
      );
      
      // Create source
      const source = offlineCtx.createBufferSource();
      source.buffer = originalBuffer;
      source.playbackRate.value = effectParams.tempo / 100;
      
      // Apply pitch shift if not zero
      if (effectParams.pitch !== 0) {
          try {
              const pitchShift = effectParams.pitch;
              source.detune.value = pitchShift * 100; // Convert semitones to cents
          } catch (e) {
              console.warn('Pitch shifting not fully supported in this browser:', e);
          }
      }
      
      // Create bass boost
      loadingInfo.textContent = 'Applying bass boost...';
      const bassBoost = offlineCtx.createBiquadFilter();
      bassBoost.type = 'lowshelf';
      bassBoost.frequency.value = 100;
      bassBoost.gain.value = effectParams.bassBoost * 2; // Amplify effect a bit
      
      // Create reverb
      loadingInfo.textContent = 'Creating reverb effect...';
      // Create a convolver node
      const convolver = offlineCtx.createConvolver();
      
      // Create impulse response for reverb
      const decayTime = effectParams.decay;
      const impulseLength = offlineCtx.sampleRate * decayTime;
      const impulse = offlineCtx.createBuffer(2, impulseLength, offlineCtx.sampleRate);
      
      // Fill buffer with decaying noise
      for (let channel = 0; channel < 2; channel++) {
          const impulseData = impulse.getChannelData(channel);
          for (let i = 0; i < impulseLength; i++) {
              impulseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, decayTime);
          }
      }
      
      convolver.buffer = impulse;
      
      // Create gain nodes for wet/dry mix
      const reverbGain = offlineCtx.createGain();
      reverbGain.gain.value = effectParams.reverb / 100;
      
      const dryGain = offlineCtx.createGain();
      dryGain.gain.value = 1 - (effectParams.reverb / 100 * 0.5); // Less reduction for dry
      
      // Connect nodes: source -> bassBoost -> dryGain -> destination
      //                                    -> convolver -> reverbGain -> destination
      source.connect(bassBoost);
      bassBoost.connect(dryGain);
      bassBoost.connect(convolver);
      convolver.connect(reverbGain);
      dryGain.connect(offlineCtx.destination);
      reverbGain.connect(offlineCtx.destination);
      
      // Set up progress tracking
      loadingInfo.textContent = 'Rendering audio...';
      let lastUpdateTime = Date.now();
      let renderedProgress = 0;
      const progressInterval = setInterval(() => {
          if (renderedProgress < 95) {
              renderedProgress += (Date.now() - lastUpdateTime) / 20; // Simulate progress
              lastUpdateTime = Date.now();
              progressBar.style.width = renderedProgress + '%';
          }
      }, 100);
      
      // Start the source
      source.start(0);
      
      // Start rendering
      processingPromise = offlineCtx.startRendering();
      
      processingPromise.then(function(renderedBuffer) {
          clearInterval(progressInterval);
          progressBar.style.width = '100%';
          
          processedBuffer = renderedBuffer;
          
          // Load processed buffer into waveform
          if (waveform) {
              waveform.loadDecodedBuffer(processedBuffer);
          }
          
          // Set effect as active
          setActiveButton([originalAudioBtn, effectAudioBtn], effectAudioBtn);
          
          // Hide loading overlay
          loadingOverlay.style.display = 'none';
          
          // Enable buttons
          applyEffectsBtn.disabled = false;
          downloadBtn.disabled = false;
          
          showNotification('Effects applied successfully!', 3000);
      }).catch(function(err) {
          clearInterval(progressInterval);
          loadingOverlay.style.display = 'none';
          applyEffectsBtn.disabled = false;
          
          showNotification('Error processing audio: ' + err.message, 3000);
          console.error('Audio processing error:', err);
      });
  }
  
  // Function for downloading processed audio
  function downloadProcessedAudio() {
      if (!processedBuffer) {
          showNotification('No processed audio to download. Please apply effects first.', 3000);
          return;
      }
      
      loadingOverlay.style.display = 'flex';
      loadingText.textContent = 'Compressing audio...';
      progressBar.style.width = '0%';
      
      // Get quality setting (1-10)
      const quality = parseInt(qualitySlider.value) || 5;
      const format = outputFormat.value;
      
      // Determine output filename
      const originalName = originalAudioFile.name;
      const fileNameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
      const outputFileName = `${fileNameWithoutExt}_slowedreverb.${format}`;
      
      // Set a timeout to ensure the process doesn't hang forever
      if (compressionTimeout) {
          clearTimeout(compressionTimeout);
      }
      
      compressionTimeout = setTimeout(() => {
          // If compression takes too long, cancel and show fallback option
          loadingOverlay.style.display = 'none';
          showNotification('Compression taking too long. Trying simplified method...', 2000);
          // Try the simpler compression method after 15 seconds
          setTimeout(() => downloadWithSimpleCompression(outputFileName), 2000);
      }, 15000);
      
      try {
          // Downsample the audio to reduce file size
          const targetSampleRate = quality <= 5 ? 22050 : 44100; // Lower quality = lower sample rate
          
          // Create an audio context with the target sample rate
          const offlineCtx = new OfflineAudioContext(
              processedBuffer.numberOfChannels,
              processedBuffer.length * (targetSampleRate / processedBuffer.sampleRate),
              targetSampleRate
          );
          
          // Create a source from the processed buffer
          const source = offlineCtx.createBufferSource();
          source.buffer = processedBuffer;
          source.connect(offlineCtx.destination);
          
          // Update progress for resampling phase
          let progress = 0;
          const progressInterval = setInterval(() => {
              if (progress < 50) {
                  progress += 2;
                  progressBar.style.width = progress + '%';
              }
          }, 100);
          
          // Start the source and render
          source.start(0);
          offlineCtx.startRendering().then(function(downsampledBuffer) {
              clearInterval(progressInterval);
              progress = 50;
              progressBar.style.width = progress + '%';
              
              // Now encode the buffer based on the selected format
              if (format === 'wav') {
                  // WAV encoding is simpler and more reliable
                  const wavBlob = encodeWAV(downsampledBuffer, quality);
                  progress = 90;
                  progressBar.style.width = progress + '%';
                  
                  clearTimeout(compressionTimeout);
                  finishDownload(wavBlob, outputFileName);
              } else if (format === 'mp3') {
                  // MP3 encoding requires specialized codec
                  // Since we don't have a reliable MP3 encoder in the browser, we'll use simplified encoding
                  progress = 60;
                  progressBar.style.width = progress + '%';
                  
                  encodeSimplifiedMP3(downsampledBuffer, quality, (mp3Blob) => {
                      progress = 90;
                      progressBar.style.width = progress + '%';
                      
                      clearTimeout(compressionTimeout);
                      finishDownload(mp3Blob, outputFileName);
                  });
              } else {
                  // For other formats, default to WAV
                  const wavBlob = encodeWAV(downsampledBuffer, quality);
                  progress = 90;
                  progressBar.style.width = progress + '%';
                  
                  clearTimeout(compressionTimeout);
                  finishDownload(wavBlob, fileNameWithoutExt + '_slowedreverb.wav');
              }
          }).catch(function(error) {
              clearInterval(progressInterval);
              clearTimeout(compressionTimeout);
              loadingOverlay.style.display = 'none';
              
              console.error('Error during downsampling:', error);
              showNotification('Error during compression. Trying simplified method...', 2000);
              
              // Fall back to simple compression
              setTimeout(() => downloadWithSimpleCompression(outputFileName), 2000);
          });
      } catch (error) {
          clearTimeout(compressionTimeout);
          loadingOverlay.style.display = 'none';
          
          console.error('Error during compression setup:', error);
          showNotification('Error setting up compression. Trying simplified method...', 2000);
          
          // Fall back to simple compression
          setTimeout(() => downloadWithSimpleCompression(outputFileName), 2000);
      }
  }
  
  // Function to finish the download process
  function finishDownload(blob, fileName) {
      // Log file sizes for comparison
      const originalSize = originalAudioFile.size;
      const newSize = blob.size;
      console.log(`Original size: ${formatFileSize(originalSize)}, New size: ${formatFileSize(newSize)}`);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = fileName;
      
      // Update progress to 100%
      progressBar.style.width = '100%';
      
      // Show compression results
      loadingInfo.textContent = `File compressed: ${formatFileSize(originalSize)} → ${formatFileSize(newSize)}`;
      
      // Trigger download after a short delay
      setTimeout(() => {
          loadingOverlay.style.display = 'none';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(url);
          
          showNotification('Download complete!', 3000);
      }, 1000);
  }
  
  // Simplified compression fallback
  function downloadWithSimpleCompression(fileName) {
      try {
          // Simple WAV encoding with reduced quality
          const wavBlob = encodeWAV(processedBuffer, 3); // Low quality for smaller size
          
          // Create download link
          const url = URL.createObjectURL(wavBlob);
          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = fileName;
          
          // Trigger download
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(url);
          
          showNotification('Download complete with simple compression!', 3000);
      } catch (error) {
          console.error('Error in simple compression:', error);
          showNotification('Error during download. Please try again.', 3000);
      }
  }
  
  // Function to encode AudioBuffer to WAV
  function encodeWAV(audioBuffer, quality) {
      // Quality affects bit depth and sample reduction
      const bitDepth = quality <= 5 ? 8 : 16; // Lower quality = lower bit depth
      const reduction = quality <= 3 ? 2 : 1; // For very low quality, use sample reduction
      
      // Get buffer data
      const numberOfChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const length = Math.floor(audioBuffer.length / reduction);
      
      // Use fewer channels for lower quality
      const outputChannels = quality <= 3 && numberOfChannels > 1 ? 1 : numberOfChannels;
      
      // Get audio data
      const channels = [];
      for (let i = 0; i < outputChannels; i++) {
          channels.push(audioBuffer.getChannelData(i % numberOfChannels));
      }
      
      // Calculate bytes per sample
      const bytesPerSample = bitDepth / 8;
      
      // Calculate total file size
      const dataSize = length * outputChannels * bytesPerSample;
      const buffer = new ArrayBuffer(44 + dataSize);
      const view = new DataView(buffer);
      
      // Write WAV header
      // "RIFF" chunk descriptor
      writeString(view, 0, 'RIFF');
      view.setUint32(4, 36 + dataSize, true);
      writeString(view, 8, 'WAVE');
      
      // "fmt " sub-chunk
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true); // fmt chunk size
      view.setUint16(20, 1, true); // audio format (1 for PCM)
      view.setUint16(22, outputChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * outputChannels * bytesPerSample, true); // byte rate
      view.setUint16(32, outputChannels * bytesPerSample, true); // block align
      view.setUint16(34, bitDepth, true); // bits per sample
      
      // "data" sub-chunk
      writeString(view, 36, 'data');
      view.setUint32(40, dataSize, true);
      
      // Write audio data
      let offset = 44;
      
      // Use different encoding based on bit depth
      if (bitDepth === 8) {
          // 8-bit WAV is unsigned
          for (let i = 0; i < length; i += reduction) {
              for (let channel = 0; channel < outputChannels; channel++) {
                  // Convert -1.0 to 1.0 into 0-255
                  const sample = Math.max(-1, Math.min(1, channels[channel][i]));
                  const scaled = (sample * 0.5 + 0.5) * 255;
                  view.setUint8(offset, scaled);
                  offset += 1;
              }
          }
      } else {
          // 16-bit WAV is signed
          for (let i = 0; i < length; i += reduction) {
              for (let channel = 0; channel < outputChannels; channel++) {
                  const sample = Math.max(-1, Math.min(1, channels[channel][i]));
                  // Convert -1.0 to 1.0 into -32768 to 32767
                  const scaled = sample < 0 ? sample * 32768 : sample * 32767;
                  view.setInt16(offset, scaled, true);
                  offset += 2;
              }
          }
      }
      
      // Create a Blob from the buffer
      return new Blob([buffer], { type: 'audio/wav' });
  }
  
  // Function to encode AudioBuffer to simplified MP3-like format
  function encodeSimplifiedMP3(audioBuffer, quality, callback) {
      // For simplified MP3, we'll use MediaRecorder API with audio/mpeg
      // This won't produce a real MP3 but a compressed audio format
      
      // Convert AudioBuffer to audio element for MediaRecorder
      const audioElement = document.createElement('audio');
      const wavBlob = encodeWAV(audioBuffer, quality); // First encode to WAV
      
      // Create object URL from WAV blob
      const wavUrl = URL.createObjectURL(wavBlob);
      audioElement.src = wavUrl;
      
      // Set up MediaRecorder once audio is loaded
      audioElement.onloadedmetadata = function() {
          try {
              // Create a media stream from the audio element
              const audioContext = new AudioContext();
              const source = audioContext.createMediaElementSource(audioElement);
              const destination = audioContext.createMediaStreamDestination();
              source.connect(destination);
              
              // Get quality settings
              let audioBitsPerSecond;
              if (quality <= 3) audioBitsPerSecond = 64000; // 64 kbps
              else if (quality <= 7) audioBitsPerSecond = 96000; // 96 kbps
              else audioBitsPerSecond = 128000; // 128 kbps
              
              // Create MediaRecorder with options
              const options = { 
                  mimeType: 'audio/webm', // Use WebM since MP3 is often not supported
                  audioBitsPerSecond: audioBitsPerSecond
              };
              
              const mediaRecorder = new MediaRecorder(destination.stream, options);
              const chunks = [];
              
              mediaRecorder.ondataavailable = function(e) {
                  if (e.data.size > 0) chunks.push(e.data);
              };
              
              mediaRecorder.onstop = function() {
                  // Clean up
                  URL.revokeObjectURL(wavUrl);
                  
                  // Create a blob from the chunks
                  const blob = new Blob(chunks, { type: 'audio/webm' });
                  callback(blob);
              };
              
              // Start recording and playback
              mediaRecorder.start();
              audioElement.play();
              
              // Stop after the duration of the buffer
              setTimeout(() => {
                  mediaRecorder.stop();
                  audioElement.pause();
              }, audioBuffer.duration * 1000 + 100);
              
          } catch (error) {
              console.error('MediaRecorder error:', error);
              
              // Fallback to WAV if MediaRecorder fails
              URL.revokeObjectURL(wavUrl);
              callback(encodeWAV(audioBuffer, quality));
          }
      };
      
      // Handle loading errors
      audioElement.onerror = function() {
          URL.revokeObjectURL(wavUrl);
          console.error('Error loading audio for MediaRecorder');
          
          // Fallback to WAV
          callback(encodeWAV(audioBuffer, quality));
      };
  }
  
  // Utility to write a string to a DataView
  function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
      }
  }
  
  // ==================== INITIALIZATION ====================
  // Initialize the application
  init();
});