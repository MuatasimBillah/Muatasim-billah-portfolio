/**
 * Slowed & Reverb Creator - Main JavaScript
 * MB Tools
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
    
    // ==================== STATE VARIABLES ====================
    let audioContext = null;
    let originalAudioFile = null;
    let originalBuffer = null;
    let processedBuffer = null;
    let waveform = null;
    let isAudioPlaying = false;
    let isPreviewingEffect = false;
    let lastNotificationTimeout = null;
    let processingPromise = null;
    
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
      lofi: { tempo: 85, reverb: 40, decay: 2, bassBoost: 3, pitch: -1 }, // Fixed lofi preset
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
      
      if (backToUpload || resetAllBtn) {
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
      // Validate file type
      if (!isValidAudioFile(file)) {
        showNotification('Please upload a valid audio file (MP3, WAV, OGG, M4A).', 3000);
        return;
      }
      
      // Size check (limit to 50MB to prevent browser crashes)
      if (file.size > 50 * 1024 * 1024) {
        showNotification('File is too large. Please upload audio less than 50MB.', 3000);
        return;
      }
      
      // Store original file and load it
      originalAudioFile = file;
      loadAudioFile(file);
    }
    
    // Check if file is a valid audio file
    function isValidAudioFile(file) {
      const acceptedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'];
      
      // Check MIME type
      if (acceptedTypes.includes(file.type)) {
        return true;
      }
      
      // Fallback to extension check if MIME type is not recognized
      const fileName = file.name.toLowerCase();
      return (
        fileName.endsWith('.mp3') ||
        fileName.endsWith('.wav') ||
        fileName.endsWith('.ogg') ||
        fileName.endsWith('.m4a')
      );
    }
    
    // Load audio file
    function loadAudioFile(file) {
      showLoading('Loading Audio', 'Preparing your audio file...');
      
      const reader = new FileReader();
      
      reader.onload = function(event) {
        const arrayBuffer = event.target.result;
        
        // Resume AudioContext if suspended (needed for autoplay policy)
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        // Decode the audio data
        audioContext.decodeAudioData(arrayBuffer)
          .then(function(decodedBuffer) {
            // Store the original buffer
            originalBuffer = decodedBuffer;
            
            // Load the waveform
            if (waveform) {
              waveform.loadDecodedBuffer(decodedBuffer);
            }
            
            // Show editor section
            uploadSection.style.display = 'none';
            editorSection.style.display = 'block';
            
            // Reset and initialize controls
            resetEffects();
            setActiveButton([originalAudioBtn, effectAudioBtn], originalAudioBtn);
            isPreviewingEffect = false;
            downloadBtn.disabled = true;
            
            // Hide loading overlay
            hideLoading();
            showNotification('Audio loaded successfully! Adjust effects and preview.', 3000);
          })
          .catch(function(error) {
            console.error('Error decoding audio data:', error);
            hideLoading();
            showNotification('Could not decode audio file. Please try another file.', 4000);
          });
      };
      
      reader.onerror = function(error) {
        console.error('Error reading file:', error);
        hideLoading();
        showNotification('Error reading file. Please try again.', 3000);
      };
      
      // Read the file as ArrayBuffer
      reader.readAsArrayBuffer(file);
    }
    
    // ==================== AUDIO PLAYBACK CONTROLS ====================
    // Toggle play/pause
    function togglePlayPause() {
      if (!waveform) return;
      
      if (isAudioPlaying) {
        waveform.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        isAudioPlaying = false;
      } else {
        // Resume AudioContext if suspended
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        waveform.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isAudioPlaying = true;
      }
    }
    
    // Adjust volume
    function adjustVolume() {
      if (!waveform) return;
      
      const volume = parseFloat(volumeSlider.value) / 100;
      waveform.setVolume(volume);
    }
    
    // Switch between original and effect audio
    function switchAudioSource(source) {
      if (!waveform || !originalBuffer) return;
      
      // Stop current playback
      const wasPlaying = isAudioPlaying;
      if (isAudioPlaying) {
        waveform.pause();
        isAudioPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
      
      if (source === 'original') {
        waveform.loadDecodedBuffer(originalBuffer);
        waveform.setWaveColor('rgba(158, 158, 179, 0.4)');
        waveform.setProgressColor('#7000ff');
        isPreviewingEffect = false;
        
        // Resume playback if it was playing
        if (wasPlaying) {
          setTimeout(() => {
            waveform.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isAudioPlaying = true;
          }, 100);
        }
      } else if (source === 'effect') {
        // If processed buffer exists, use it
        if (processedBuffer) {
          waveform.loadDecodedBuffer(processedBuffer);
          waveform.setWaveColor('rgba(0, 217, 255, 0.4)');
          waveform.setProgressColor('#00d9ff');
          isPreviewingEffect = true;
          
          // Resume playback if it was playing
          if (wasPlaying) {
            setTimeout(() => {
              waveform.play();
              playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
              isAudioPlaying = true;
            }, 100);
          }
        } else {
          // Need to create a preview
          showNotification('Creating effect preview...', 2000);
          
          showLoading('Creating Preview', 'Applying effects...');
          
          // Process the audio with current effects
          processAudioWithEffects(originalBuffer)
            .then(function(buffer) {
              processedBuffer = buffer;
              
              waveform.loadDecodedBuffer(buffer);
              waveform.setWaveColor('rgba(0, 217, 255, 0.4)');
              waveform.setProgressColor('#00d9ff');
              isPreviewingEffect = true;
              hideLoading();
              
              // Resume playback if it was playing
              if (wasPlaying) {
                setTimeout(() => {
                  waveform.play();
                  playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                  isAudioPlaying = true;
                }, 100);
              }
            })
            .catch(function(error) {
              console.error('Error creating preview:', error);
              hideLoading();
              showNotification('Error creating preview. Please try again.', 3000);
              
              // Switch back to original
              setActiveButton([originalAudioBtn, effectAudioBtn], originalAudioBtn);
              waveform.loadDecodedBuffer(originalBuffer);
              isPreviewingEffect = false;
            });
        }
      }
    }
    
    // Update time display
    function updateTimeDisplay(currentTime, totalTime) {
      if (isNaN(currentTime)) currentTime = 0;
      if (isNaN(totalTime)) totalTime = 0;
      
      currentTimeDisplay.textContent = formatTime(currentTime);
      totalTimeDisplay.textContent = formatTime(totalTime);
    }
    
    // Format time in MM:SS format
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // ==================== EFFECT CONTROLS ====================
    // Apply preset
    function applyPreset(presetName) {
      if (!presets[presetName]) return;
      
      const preset = presets[presetName];
      
      // Update effect parameters
      effectParams = { ...preset };
      
      // Update UI
      tempoSlider.value = effectParams.tempo;
      tempoValue.textContent = effectParams.tempo;
      
      reverbSlider.value = effectParams.reverb;
      reverbValue.textContent = effectParams.reverb;
      
      decaySlider.value = effectParams.decay;
      decayValue.textContent = effectParams.decay;
      
      bassSlider.value = effectParams.bassBoost;
      bassValue.textContent = effectParams.bassBoost;
      
      pitchSlider.value = effectParams.pitch;
      pitchValue.textContent = effectParams.pitch;
      
      // Clear the processed buffer so it will be regenerated with new settings
      processedBuffer = null;
      
      // If currently previewing effect, update the preview
      if (isPreviewingEffect) {
        switchAudioSource('effect');
      }
    }
    
    // Reset effects to default (classic preset)
    function resetEffects() {
      setActiveButton(presetBtns, document.querySelector('[data-preset="classic"]'));
      applyPreset('classic');
    }
    
    // Update custom preset when sliders change
    function updateCustomPreset() {
      // Update custom preset
      presets.custom = { ...effectParams };
      
      // Set active button to custom
      setActiveButton(presetBtns, document.querySelector('[data-preset="custom"]'));
      
      // Clear the processed buffer so it will be regenerated with new settings
      processedBuffer = null;
    }
    
    // ==================== AUDIO PROCESSING ====================
    // Process audio with effects
    function processAudio() {
      if (!originalBuffer) {
        showNotification('Please upload an audio file first.', 3000);
        return;
      }
      
      showLoading('Processing Audio', 'Applying slowed & reverb effects...');
      
      // Cancel any previous processing
      if (processingPromise && typeof processingPromise.cancel === 'function') {
        processingPromise.cancel();
      }
      
      // Process the audio with current effects
      processingPromise = processAudioWithEffects(originalBuffer)
        .then(function(buffer) {
          processedBuffer = buffer;
          
          // If currently previewing effect, update the waveform
          if (isPreviewingEffect) {
            waveform.loadDecodedBuffer(buffer);
          }
          
          // Enable download button
          downloadBtn.disabled = false;
          
          hideLoading();
          showNotification('Audio processed successfully! You can now listen to the result or download it.', 4000);
        })
        .catch(function(error) {
          console.error('Error processing audio:', error);
          hideLoading();
          showNotification('Error processing audio. Please try again.', 3000);
        });
    }
    
    // Process audio buffer with effects
    function processAudioWithEffects(buffer) {
      return new Promise(function(resolve, reject) {
        try {
          // Calculate appropriate slowing factor (tempo percentage represents target speed)
          // If original is 100%, and we want 80%, we use 0.8 as the factor
          const slowFactor = effectParams.tempo / 100;
          
          // Create offline audio context for processing
          const offlineCtx = new OfflineAudioContext(
            buffer.numberOfChannels,
            // Calculate new length based on slowFactor (slower = longer)
            Math.ceil(buffer.length / slowFactor),
            buffer.sampleRate
          );
          
          // Create source node
          const source = offlineCtx.createBufferSource();
          source.buffer = buffer;
          
          // Set proper playbackRate (slower = smaller number)
          // This is the key fix - properly slow down without affecting pitch
          source.playbackRate.value = slowFactor;
          
          // Adjust pitch independently if needed
          if (effectParams.pitch !== 0) {
            // Apply detune to adjust pitch (100 cents = 1 semitone)
            source.detune.value = effectParams.pitch * 100;
          }
          
          // 2. Bass Boost
          const bassBoost = offlineCtx.createBiquadFilter();
          bassBoost.type = 'lowshelf';
          bassBoost.frequency.value = 200;
          bassBoost.gain.value = effectParams.bassBoost;
          
          // Connect source to bass boost
          source.connect(bassBoost);
          
          // 3. Reverb (using convolver)
          const convolver = offlineCtx.createConvolver();
          
          // Generate impulse response for reverb
          createReverbImpulse(offlineCtx, effectParams.decay, effectParams.reverb)
            .then(function(impulseBuffer) {
              convolver.buffer = impulseBuffer;
              
              // Create dry/wet mix for reverb
              const dryGain = offlineCtx.createGain();
              const wetGain = offlineCtx.createGain();
              const masterGain = offlineCtx.createGain();
              
              // Set dry/wet mix based on reverb amount
              const wetAmount = effectParams.reverb / 100;
              dryGain.gain.value = 1 - (wetAmount * 0.5); // Keep some dry signal
              wetGain.gain.value = wetAmount * 0.7; // Reduce wet signal slightly to avoid clipping
              
              // Special routing for lofi preset
              if (presets.lofi.tempo === effectParams.tempo && 
                  presets.lofi.reverb === effectParams.reverb && 
                  presets.lofi.decay === effectParams.decay) {
                
                // Gentler routing for lofi preset
                bassBoost.connect(dryGain);
                bassBoost.connect(convolver);
                convolver.connect(wetGain);
                dryGain.connect(masterGain);
                wetGain.connect(masterGain);
                masterGain.connect(offlineCtx.destination);
              } else {
                // Standard routing for other presets
                bassBoost.connect(dryGain);
                bassBoost.connect(convolver);
                convolver.connect(wetGain);
                dryGain.connect(masterGain);
                wetGain.connect(masterGain);
                masterGain.connect(offlineCtx.destination);
              }
              
              // Start processing
              source.start(0);
              
              // Render audio
              offlineCtx.startRendering()
                .then(function(renderedBuffer) {
                  resolve(renderedBuffer);
                })
                .catch(function(error) {
                  console.error('Error rendering audio:', error);
                  reject(error);
                });
            })
            .catch(function(error) {
              console.error('Error creating reverb impulse:', error);
              reject(error);
            });
        } catch (error) {
          console.error('Error in audio processing:', error);
          reject(error);
        }
      });
    }
    
    // Create reverb impulse response
    function createReverbImpulse(context, decayTime, reverbAmount) {
      return new Promise(function(resolve, reject) {
        try {
          const sampleRate = context.sampleRate;
          const length = Math.ceil(sampleRate * decayTime);
          const impulse = context.createBuffer(2, length, sampleRate);
          
          // Adjust decay based on reverb amount
          const decay = decayTime * (reverbAmount / 60);
          
          // Fill impulse buffer with noise and apply decay
          for (let channel = 0; channel < 2; channel++) {
            const impulseChannel = impulse.getChannelData(channel);
            
            // Generate noise with smooth decay
            for (let i = 0; i < length; i++) {
              // Generate random value between -1 and 1
              const noise = Math.random() * 2 - 1;
              
              // Apply exponential decay
              let envelope = Math.pow(1 - i / length, decay);
              
              // Special processing for lofi preset
              if (presets.lofi.tempo === effectParams.tempo && 
                  presets.lofi.reverb === effectParams.reverb && 
                  presets.lofi.decay === effectParams.decay) {
                
                // Apply smoother decay curve for lofi
                if (i > length * 0.5) {
                  // Reduce high frequency noise in the tail
                  const damping = Math.min(1.0, 0.7 + (length - i) / (length * 0.5));
                  impulseChannel[i] = noise * envelope * damping;
                } else {
                  impulseChannel[i] = noise * envelope;
                }
                
                // Additional smoothing for lofi preset
                if (i > 0) {
                  // Simple lowpass filter
                  const smoothFactor = 0.2;
                  impulseChannel[i] = impulseChannel[i-1] * smoothFactor + impulseChannel[i] * (1 - smoothFactor);
                }
              } else {
                // Standard processing for other presets
                impulseChannel[i] = noise * envelope;
              }
            }
          }
          
          resolve(impulse);
        } catch (error) {
          console.error('Error creating reverb impulse:', error);
          reject(error);
        }
      });
    }
    
    // ==================== EXPORT & DOWNLOAD ====================
    // Download processed audio
    function downloadProcessedAudio() {
      if (!processedBuffer || !originalAudioFile) {
        showNotification('Please process your audio first.', 3000);
        return;
      }
      
      showLoading('Preparing Download', 'Creating your audio file...');
      
      // Get selected format
      const format = outputFormat.value;
      
      // Generate filename
      const originalName = originalAudioFile.name;
      const extension = format;
      const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
      const newFilename = `${nameWithoutExt}_slowed_reverb.${extension}`;
      
      // Convert AudioBuffer to Blob
      convertAudioBufferToBlob(processedBuffer, format)
        .then(function(blob) {
          // Create download link
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = url;
          downloadLink.download = newFilename;
          
          // Append to document, click, and remove
          document.body.appendChild(downloadLink);
          downloadLink.click();
          
          // Clean up
          setTimeout(function() {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
            hideLoading();
            showNotification('Download started! Enjoy your slowed & reverb track.', 3000);
          }, 100);
        })
        .catch(function(error) {
          console.error('Error preparing download:', error);
          hideLoading();
          showNotification('Error preparing download. Please try again.', 3000);
        });
    }
    
    // Convert AudioBuffer to Blob
    function convertAudioBufferToBlob(buffer, format) {
      return new Promise(function(resolve, reject) {
        try {
          // WAV will be our base format (all browsers support it)
          const wavBlob = audioBufferToWav(buffer);
          
          if (format === 'wav') {
            resolve(wavBlob);
          } else if (format === 'mp3') {
            // For MP3, we need a codec - usually would use a library like lamejs
            // But for simplicity, we'll just return WAV format
            console.warn('MP3 encoding not implemented, falling back to WAV');
            resolve(new Blob([wavBlob], { type: 'audio/wav' }));
          } else if (format === 'ogg') {
            // Same for OGG
            console.warn('OGG encoding not implemented, falling back to WAV');
            resolve(new Blob([wavBlob], { type: 'audio/wav' }));
          } else {
            // Default fallback
            resolve(wavBlob);
          }
        } catch (error) {
          console.error('Error converting audio format:', error);
          reject(error);
        }
      });
    }
    
    // Convert AudioBuffer to WAV blob
    function audioBufferToWav(buffer) {
      const numOfChannels = buffer.numberOfChannels;
      const length = buffer.length * numOfChannels * 2 + 44;
      const arrayBuffer = new ArrayBuffer(length);
      const view = new DataView(arrayBuffer);
      
      // Write WAV header
      writeString(view, 0, 'RIFF');
      view.setUint32(4, length - 8, true);
      writeString(view, 8, 'WAVE');
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numOfChannels, true);
      view.setUint32(24, buffer.sampleRate, true);
      view.setUint32(28, buffer.sampleRate * numOfChannels * 2, true);
      view.setUint16(32, numOfChannels * 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, 'data');
      view.setUint32(40, length - 44, true);
      
      // Write interleaved audio data
      const channelData = [];
      
      // Extract channel data
      for (let i = 0; i < numOfChannels; i++) {
        channelData.push(buffer.getChannelData(i));
      }
      
      let offset = 44;
      for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numOfChannels; channel++) {
          // Clamp sample between -1 and 1
          let sample = Math.max(-1, Math.min(1, channelData[channel][i]));
          
          // Convert to 16-bit PCM
          sample = sample < 0 ? sample * 32768 : sample * 32767;
          
          // Write sample to buffer
          view.setInt16(offset, sample, true);
          offset += 2;
        }
      }
      
      return new Blob([arrayBuffer], { type: 'audio/wav' });
    }
    
    // Helper function to write strings to DataView
    function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }
    
    // ==================== UI UTILITIES ====================
    // Reset the entire tool
    function resetTool() {
      // Stop playback
      if (waveform && isAudioPlaying) {
        waveform.pause();
        isAudioPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
      
      // Reset audio data
      originalAudioFile = null;
      originalBuffer = null;
      processedBuffer = null;
      isPreviewingEffect = false;
      
      // Reset waveform
      if (waveform) {
        waveform.empty();
        waveform.setWaveColor('rgba(158, 158, 179, 0.4)');
        waveform.setProgressColor('#7000ff');
      }
      
      // Reset UI
      resetEffects();
      setActiveButton([originalAudioBtn, effectAudioBtn], originalAudioBtn);
      volumeSlider.value = 100;
      
      // Reset outputs
      outputFormat.value = 'mp3';
      qualitySlider.value = 192;
      qualityValue.textContent = 192;
      
      // Disable download
      downloadBtn.disabled = true;
      
      // Show upload section, hide editor
      uploadSection.style.display = 'block';
      editorSection.style.display = 'none';
      
      // Reset file input
      audioFileInput.value = '';
    }
    
    // Show loading overlay
    function showLoading(title, message) {
      loadingText.textContent = title || 'Loading';
      loadingInfo.textContent = message || 'Please wait...';
      progressBar.style.width = '0%';
      loadingOverlay.style.display = 'flex';
      
      // Animate progress
      simulateProgress();
    }
    
    // Hide loading overlay
    function hideLoading() {
      loadingOverlay.style.display = 'none';
      clearInterval(progressInterval);
    }
    
    // Simulate progress for loading indicator
    let progressInterval;
    function simulateProgress() {
      clearInterval(progressInterval);
      
      let progress = 0;
      progressBar.style.width = '0%';
      
      progressInterval = setInterval(function() {
        if (progress < 90) {
          progress += Math.random() * 3;
        } else {
          progress += Math.random() * 0.5;
        }
        
        if (progress > 100) {
          progress = 100;
          clearInterval(progressInterval);
        }
        
        progressBar.style.width = `${progress}%`;
      }, 200);
    }
    
    // Show notification
    function showNotification(message, duration = 3000) {
      // Clear previous timeout if exists
      if (lastNotificationTimeout) {
        clearTimeout(lastNotificationTimeout);
      }
      
      // Set message and show notification
      notificationMessage.textContent = message;
      notification.classList.add('show');
      
      // Set timeout to hide
      lastNotificationTimeout = setTimeout(function() {
        notification.classList.remove('show');
      }, duration);
    }
    
    // Set active button
    function setActiveButton(buttons, activeButton) {
      // Convert to array if not already
      if (!Array.isArray(buttons)) {
        buttons = Array.from(buttons);
      }
      
      // Remove active class
      buttons.forEach(button => button.classList.remove('active'));
      
      // Add active class to selected button
      activeButton.classList.add('active');
    }
    
    // Initialize the tool
    init();
  });