/**
 * Audio Cutter Tool - Client-side JavaScript for browser-based audio cutting and trimming
 * Enhanced for SEO optimization and improved user experience
 * Supports MP3, WAV, OGG, M4A formats
 */
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const uploadInput = document.getElementById('audio-upload');
  const uploadArea = document.getElementById('upload-area');
  const editorContainer = document.getElementById('editor-container');
  const audioElement = document.getElementById('audio-element');
  const fileName = document.getElementById('file-name');
  const fileDuration = document.getElementById('file-duration');
  const fileFormat = document.getElementById('file-format');
  const startTimeInput = document.getElementById('start-time');
  const endTimeInput = document.getElementById('end-time');
  const btnReset = document.getElementById('btn-reset');
  const btnPreview = document.getElementById('btn-preview');
  const btnCut = document.getElementById('btn-cut');
  const btnDownload = document.getElementById('btn-download');
  const processingOverlay = document.getElementById('processing-overlay');
  const selectionStart = document.getElementById('selection-start');
  const selectionEnd = document.getElementById('selection-end');
  const selectionArea = document.getElementById('selection-area');
  const timeline = document.getElementById('timeline');
  
  // Variables
  let wavesurfer;
  let audioContext;
  let audioBuffer;
  let audioFile;
  let audioBlob;
  let startTime = 0;
  let endTime = 0;
  let isPlaying = false;
  let currentStartPercentage = 0;
  let currentEndPercentage = 100;
  let originalAudioUrl;
  let cutAudioUrl;
  let processingStartTime;
  
  // Analytics tracking for SEO enhancement
  function trackEvent(action, label, value) {
      try {
          // Check if analytics is available (non-blocking)
          if (typeof gtag !== 'undefined') {
              gtag('event', action, {
                  'event_category': 'Audio Cutter',
                  'event_label': label,
                  'value': value
              });
          }
      } catch (e) {
          console.log('Analytics not available');
      }
  }
  
  // Browser compatibility checks
  function checkBrowserCompatibility() {
      const isAudioContextSupported = window.AudioContext || window.webkitAudioContext;
      const isFileReaderSupported = window.FileReader;
      
      if (!isAudioContextSupported || !isFileReaderSupported) {
          const errorMessage = 'Your browser does not support some required features. Please use a modern browser like Chrome, Firefox, or Edge for the best experience.';
          alert(errorMessage);
          
          // Add visible compatibility warning
          const compatWarning = document.createElement('div');
          compatWarning.className = 'compatibility-warning';
          compatWarning.innerHTML = `
              <i class="fas fa-exclamation-triangle"></i>
              <p>${errorMessage}</p>
          `;
          document.querySelector('.upload-container').prepend(compatWarning);
          
          return false;
      }
      
      return true;
  }
  
  // Initialize the application
  function init() {
      if (!checkBrowserCompatibility()) return;
      
      // Set up drag and drop functionality
      setupDragAndDrop();
      
      // Set up click to upload
      uploadArea.addEventListener('click', function() {
          uploadInput.click();
      });
      
      // Set up button event listeners
      setupEventListeners();
  }
  
  // Initialize WaveSurfer
  function initWavesurfer() {
      if (wavesurfer) {
          wavesurfer.destroy();
      }
      
      // Create wavesurfer instance with optimized settings
      wavesurfer = WaveSurfer.create({
          container: '#waveform',
          waveColor: '#9e9eb3',
          progressColor: '#7000ff',
          cursorColor: '#00d9ff',
          barWidth: 2,
          barGap: 1,
          responsive: true,
          height: 100,
          normalize: true,
          backend: 'MediaElement',
          hideScrollbar: true,
          scrollParent: false,
          partialRender: true,
          pixelRatio: 1
      });
      
      // WaveSurfer events
      wavesurfer.on('ready', function() {
          const duration = wavesurfer.getDuration();
          endTime = duration;
          fileDuration.textContent = formatTime(duration);
          
          // Set initial selection to full audio
          updateSelectionArea(0, 100);
          startTimeInput.value = formatTime(0);
          endTimeInput.value = formatTime(duration);
          
          // Generate timeline markers
          generateTimeline(duration);
          
          // Show editor and hide upload area
          fadeOut(uploadArea.parentElement);
          setTimeout(() => {
              fadeIn(editorContainer);
          }, 300);
          
          // Track successful upload
          trackEvent('audio_loaded', audioFile.type, Math.round(duration));
      });
      
      wavesurfer.on('error', function(err) {
          console.error('WaveSurfer error:', err);
          showNotification('Error loading audio waveform. The file might be corrupted or unsupported.', 'error');
          
          // Track error
          trackEvent('error', 'waveform_load_error', 0);
      });
      
      wavesurfer.on('finish', function() {
          isPlaying = false;
          btnPreview.innerHTML = '<i class="fas fa-play"></i> Preview Selection';
      });
  }
  
  // Set up drag and drop functionality
  function setupDragAndDrop() {
      uploadArea.addEventListener('dragover', function(e) {
          e.preventDefault();
          e.stopPropagation();
          this.classList.add('dragover');
      });
      
      uploadArea.addEventListener('dragleave', function(e) {
          e.preventDefault();
          e.stopPropagation();
          this.classList.remove('dragover');
      });
      
      uploadArea.addEventListener('drop', function(e) {
          e.preventDefault();
          e.stopPropagation();
          this.classList.remove('dragover');
          
          if (e.dataTransfer.files.length) {
              uploadInput.files = e.dataTransfer.files;
              handleAudioUpload();
              
              // Track drag & drop upload
              trackEvent('upload_method', 'drag_and_drop', 1);
          }
      });
  }
  
  // Set up event listeners
  function setupEventListeners() {
      uploadInput.addEventListener('change', function() {
          handleAudioUpload();
          
          // Track button upload
          trackEvent('upload_method', 'button_click', 1);
      });
      
      // Reset button
      btnReset.addEventListener('click', resetEditor);
      
      // Preview button
      btnPreview.addEventListener('click', handlePreview);
      
      // Cut button
      btnCut.addEventListener('click', handleCut);
      
      // Download button
      btnDownload.addEventListener('click', handleDownload);
      
      // Time input handlers
      startTimeInput.addEventListener('change', handleStartTimeChange);
      endTimeInput.addEventListener('change', handleEndTimeChange);
      
      // Make selection handles draggable
      setupSelectionHandles();
  }
  
  // Handle audio upload
  function handleAudioUpload() {
      const file = uploadInput.files[0];
      
      if (!file) return;
      
      // Check if the file is an audio file
      const validTypes = [
          'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg', 
          'audio/x-m4a', 'audio/m4a', 'audio/aac', 'audio/flac'
      ];
      
      if (!validTypes.includes(file.type) && !file.type.startsWith('audio/')) {
          showNotification('Please upload a valid audio file (MP3, WAV, OGG, M4A)', 'error');
          return;
      }
      
      // File size check
      if (file.size > 100 * 1024 * 1024) { // 100MB
          showNotification('File size exceeds 100MB limit. Please upload a smaller file.', 'error');
          return;
      }
      
      audioFile = file;
      fileName.textContent = file.name;
      
      // Set file format display
      let format = file.type.split('/')[1].toUpperCase();
      if (format === 'MPEG') format = 'MP3';
      fileFormat.textContent = format;
      
      // Create URL for audio element
      if (originalAudioUrl) {
          URL.revokeObjectURL(originalAudioUrl);
      }
      originalAudioUrl = URL.createObjectURL(file);
      audioElement.src = originalAudioUrl;
      
      // Show loading indicator
      showNotification('Loading audio waveform...', 'info');
      
      // Initialize waveform
      initWavesurfer();
      wavesurfer.load(audioElement);
      
      // Also load the file into an AudioBuffer for processing
      loadAudioBuffer(file);
  }
  
  // Load audio into an AudioBuffer
  function loadAudioBuffer(file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
          const audioData = e.target.result;
          
          // Initialize audio context if needed
          if (!audioContext) {
              audioContext = new (window.AudioContext || window.webkitAudioContext)();
          }
          
          // Decode the audio data
          audioContext.decodeAudioData(audioData)
              .then(function(buffer) {
                  audioBuffer = buffer;
              })
              .catch(function(err) {
                  console.error('Error decoding audio data:', err);
                  showNotification('Error processing audio file. Please try a different file.', 'error');
                  
                  // Track error
                  trackEvent('error', 'audio_decode_error', 0);
              });
      };
      
      reader.onerror = function() {
          console.error('Error reading file');
          showNotification('Error reading audio file. Please try again.', 'error');
          
          // Track error
          trackEvent('error', 'file_read_error', 0);
      };
      
      reader.readAsArrayBuffer(file);
  }
  
  // Time formatting helper (mm:ss.ms format)
  function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      const ms = Math.floor((seconds % 1) * 1000);
      
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }
  
  // Parse time input (mm:ss.ms format)
  function parseTimeInput(timeStr) {
      const regex = /^(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?$/;
      const match = timeStr.match(regex);
      
      if (match) {
          const mins = parseInt(match[1]);
          const secs = parseInt(match[2]);
          const ms = match[3] ? parseInt(match[3]) : 0;
          
          return mins * 60 + secs + ms / 1000;
      }
      
      return null;
  }
  
  // Generate timeline markers
  function generateTimeline(duration) {
      timeline.innerHTML = '';
      
      // Determine appropriate interval based on duration
      let interval = 10; // default 10 sec intervals
      if (duration > 600) interval = 60; // 1 min intervals for > 10 min
      else if (duration > 300) interval = 30; // 30 sec intervals for 5-10 min
      else if (duration < 60) interval = 5; // 5 sec intervals for < 1 min
      
      const numMarkers = Math.ceil(duration / interval);
      
      for (let i = 0; i <= numMarkers; i++) {
          const markerTime = i * interval;
          if (markerTime > duration) break;
          
          const marker = document.createElement('div');
          marker.className = 'timeline-marker';
          marker.textContent = formatTime(markerTime).split('.')[0]; // without ms
          marker.style.position = 'absolute';
          marker.style.left = `${(markerTime / duration) * 100}%`;
          marker.style.transform = 'translateX(-50%)';
          
          timeline.appendChild(marker);
      }
  }
  
  // Update selection area display
  function updateSelectionArea(startPerc, endPerc) {
      currentStartPercentage = startPerc;
      currentEndPercentage = endPerc;
      
      // Update UI elements
      selectionStart.style.left = `${startPerc}%`;
      selectionEnd.style.left = `${endPerc}%`;
      selectionArea.style.left = `${startPerc}%`;
      selectionArea.style.width = `${endPerc - startPerc}%`;
      
      // Calculate times
      if (wavesurfer) {
          const duration = wavesurfer.getDuration();
          startTime = (startPerc / 100) * duration;
          endTime = (endPerc / 100) * duration;
          
          // Update time inputs
          startTimeInput.value = formatTime(startTime);
          endTimeInput.value = formatTime(endTime);
      }
  }
  
  // Setup selection handles
  function setupSelectionHandles() {
      let isDraggingStart = false;
      let isDraggingEnd = false;
      
      selectionStart.addEventListener('mousedown', function(e) {
          isDraggingStart = true;
          e.preventDefault();
          document.body.style.cursor = 'ew-resize';
      });
      
      selectionEnd.addEventListener('mousedown', function(e) {
          isDraggingEnd = true;
          e.preventDefault();
          document.body.style.cursor = 'ew-resize';
      });
      
      // Mobile touch support
      selectionStart.addEventListener('touchstart', function(e) {
          isDraggingStart = true;
          e.preventDefault();
      });
      
      selectionEnd.addEventListener('touchstart', function(e) {
          isDraggingEnd = true;
          e.preventDefault();
      });
      
      // Mouse move handler
      document.addEventListener('mousemove', function(e) {
          if (!isDraggingStart && !isDraggingEnd) return;
          
          const waveformContainer = document.querySelector('.waveform-container');
          const rect = waveformContainer.getBoundingClientRect();
          const containerWidth = rect.width;
          const offsetX = e.clientX - rect.left;
          
          handleDragging(offsetX, containerWidth);
      });
      
      // Touch move handler
      document.addEventListener('touchmove', function(e) {
          if (!isDraggingStart && !isDraggingEnd) return;
          
          const touch = e.touches[0];
          const waveformContainer = document.querySelector('.waveform-container');
          const rect = waveformContainer.getBoundingClientRect();
          const containerWidth = rect.width;
          const offsetX = touch.clientX - rect.left;
          
          handleDragging(offsetX, containerWidth);
      });
      
      // Mouse up / touch end handler
      document.addEventListener('mouseup', function() {
          if (isDraggingStart || isDraggingEnd) {
              // Track selection change
              trackEvent('selection_adjusted', 'mouse_drag', Math.round(endTime - startTime));
          }
          
          isDraggingStart = false;
          isDraggingEnd = false;
          document.body.style.cursor = '';
      });
      
      document.addEventListener('touchend', function() {
          if (isDraggingStart || isDraggingEnd) {
              // Track selection change
              trackEvent('selection_adjusted', 'touch_drag', Math.round(endTime - startTime));
          }
          
          isDraggingStart = false;
          isDraggingEnd = false;
      });
      
      function handleDragging(offsetX, containerWidth) {
          let position = (offsetX / containerWidth) * 100;
          position = Math.max(0, Math.min(100, position)); // Clamp between 0-100
          
          if (isDraggingStart) {
              if (position >= currentEndPercentage) {
                  position = currentEndPercentage - 1;
              }
              updateSelectionArea(position, currentEndPercentage);
          } else if (isDraggingEnd) {
              if (position <= currentStartPercentage) {
                  position = currentStartPercentage + 1;
              }
              updateSelectionArea(currentStartPercentage, position);
          }
      }
  }
  
  // Handle start time input change
  function handleStartTimeChange() {
      const inputTime = parseTimeInput(this.value);
      
      if (inputTime !== null) {
          const duration = wavesurfer.getDuration();
          let validTime = inputTime;
          
          // Ensure start time is valid
          if (validTime >= duration) {
              validTime = duration - 0.1;
          }
          if (validTime >= endTime) {
              validTime = endTime - 0.1;
          }
          
          startTime = validTime;
          const startPerc = (startTime / duration) * 100;
          updateSelectionArea(startPerc, currentEndPercentage);
          
          // Track manual time entry
          trackEvent('selection_adjusted', 'start_time_input', Math.round(endTime - startTime));
      } else {
          // Invalid input, reset to current value
          this.value = formatTime(startTime);
          showNotification('Please enter time in format mm:ss.ms', 'warning');
      }
  }
  
  // Handle end time input change
  function handleEndTimeChange() {
      const inputTime = parseTimeInput(this.value);
      
      if (inputTime !== null) {
          const duration = wavesurfer.getDuration();
          let validTime = inputTime;
          
          // Ensure end time is valid
          if (validTime > duration) {
              validTime = duration;
          }
          if (validTime <= startTime) {
              validTime = startTime + 0.1;
          }
          
          endTime = validTime;
          const endPerc = (endTime / duration) * 100;
          updateSelectionArea(currentStartPercentage, endPerc);
          
          // Track manual time entry
          trackEvent('selection_adjusted', 'end_time_input', Math.round(endTime - startTime));
      } else {
          // Invalid input, reset to current value
          this.value = formatTime(endTime);
          showNotification('Please enter time in format mm:ss.ms', 'warning');
      }
  }
  
  // Handle preview button click
  function handlePreview() {
      if (!wavesurfer) return;
      
      if (isPlaying) {
          wavesurfer.pause();
          isPlaying = false;
          this.innerHTML = '<i class="fas fa-play"></i> Preview Selection';
      } else {
          wavesurfer.play(startTime, endTime);
          isPlaying = true;
          this.innerHTML = '<i class="fas fa-pause"></i> Pause';
          
          // Reset button when preview ends
          const previewDuration = endTime - startTime;
          setTimeout(() => {
              if (isPlaying) {
                  isPlaying = false;
                  this.innerHTML = '<i class="fas fa-play"></i> Preview Selection';
              }
          }, previewDuration * 1000 + 100); // Add a little buffer
          
          // Track preview
          trackEvent('preview', 'audio_preview', Math.round(previewDuration));
      }
  }
  
  // Handle cut button click
  function handleCut() {
      if (!audioBuffer || !audioFile) {
          showNotification('No audio loaded or audio processing failed', 'error');
          return;
      }
      
      processingStartTime = performance.now();
      showProcessingOverlay(true);
      
      // Use setTimeout to allow UI to update before heavy processing
      setTimeout(() => {
          try {
              // Cut the audio buffer
              const sampleRate = audioBuffer.sampleRate;
              const channels = audioBuffer.numberOfChannels;
              const startOffset = Math.floor(startTime * sampleRate);
              const endOffset = Math.floor(endTime * sampleRate);
              const frameCount = endOffset - startOffset;
              
              // Create a new buffer for the cut section
              const cutBuffer = audioContext.createBuffer(channels, frameCount, sampleRate);
              
              // Copy the data from original buffer to cut buffer
              for (let channel = 0; channel < channels; channel++) {
                  const originalData = audioBuffer.getChannelData(channel);
                  const cutData = cutBuffer.getChannelData(channel);
                  
                  for (let i = 0; i < frameCount; i++) {
                      cutData[i] = originalData[startOffset + i];
                  }
              }
              
              // Convert buffer to WAV or MP3 based on original format
              const originalFormat = audioFile.type.split('/')[1].toLowerCase();
              if (originalFormat === 'mp3' || originalFormat === 'mpeg') {
                  convertBufferToMP3(cutBuffer);
              } else {
                  convertBufferToWAV(cutBuffer);
              }
          } catch (err) {
              console.error('Error cutting audio:', err);
              showNotification('Error cutting audio. Please try again with a different file.', 'error');
              showProcessingOverlay(false);
              
              // Track error
              trackEvent('error', 'cut_error', 0);
          }
      }, 100);
  }
  
  // Convert buffer to WAV
  function convertBufferToWAV(buffer) {
      const sampleRate = buffer.sampleRate;
      const numChannels = buffer.numberOfChannels;
      
      // Create interleaved data
      let interleaved;
      if (numChannels === 2) {
          const left = buffer.getChannelData(0);
          const right = buffer.getChannelData(1);
          interleaved = new Float32Array(left.length * 2);
          
          for (let i = 0, j = 0; i < left.length; i++) {
              interleaved[j++] = left[i];
              interleaved[j++] = right[i];
          }
      } else {
          interleaved = buffer.getChannelData(0);
      }
      
      // Create the WAV file
      const dataView = encodeWAV(interleaved, sampleRate, numChannels);
      const audioBlob = new Blob([dataView], { type: 'audio/wav' });
      
      finalizeCut(audioBlob, 'wav');
  }
  
  // Convert buffer to MP3 using MediaRecorder (fallback method)
  function convertBufferToMP3(buffer) {
      try {
          // Create a new audio context for playback
          const offlineCtx = new OfflineAudioContext(
              buffer.numberOfChannels,
              buffer.length,
              buffer.sampleRate
          );
          
          // Create a buffer source
          const source = offlineCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(offlineCtx.destination);
          source.start(0);
          
          // Render the buffer
          offlineCtx.startRendering().then(renderedBuffer => {
              // Create an audio element to play the audio
              const audio = document.createElement('audio');
              const audioDestination = audioContext.createMediaStreamDestination();
              const mediaRecorder = new MediaRecorder(audioDestination.stream);
              const chunks = [];
              
              // Create a buffer source from the rendered buffer
              const source = audioContext.createBufferSource();
              source.buffer = renderedBuffer;
              source.connect(audioDestination);
              
              // Set up the media recorder
              mediaRecorder.ondataavailable = e => {
                  chunks.push(e.data);
              };
              
              mediaRecorder.onstop = () => {
                  const blob = new Blob(chunks, { type: 'audio/mp3' });
                  finalizeCut(blob, 'mp3');
              };
              
              // Start recording and play the source
              mediaRecorder.start();
              source.start(0);
              
              // Stop recording after the buffer duration
              setTimeout(() => {
                  mediaRecorder.stop();
                  source.stop();
              }, (renderedBuffer.duration * 1000) + 100);
          }).catch(err => {
              console.error('Rendering failed:', err);
              // Fallback to WAV if MP3 encoding fails
              convertBufferToWAV(buffer);
              
              // Track fallback
              trackEvent('encoding_fallback', 'mp3_to_wav', 0);
          });
      } catch (err) {
          console.error('MP3 conversion error:', err);
          // Fallback to WAV if MP3 encoding fails
          convertBufferToWAV(buffer);
          
          // Track fallback
          trackEvent('encoding_fallback', 'mp3_to_wav', 0);
      }
  }
  
  // Encode audio data to WAV format
  function encodeWAV(samples, sampleRate, numChannels) {
      const buffer = new ArrayBuffer(44 + samples.length * 2);
      const view = new DataView(buffer);
      
      // RIFF identifier
      writeString(view, 0, 'RIFF');
      // File length
      view.setUint32(4, 36 + samples.length * 2, true);
      // RIFF type
      writeString(view, 8, 'WAVE');
      // Format chunk identifier
      writeString(view, 12, 'fmt ');
      // Format chunk length
      view.setUint32(16, 16, true);
      // Sample format (1 is PCM)
      view.setUint16(20, 1, true);
      // Channel count
      view.setUint16(22, numChannels, true);
      // Sample rate
      view.setUint32(24, sampleRate, true);
      // Byte rate (sample rate * block align)
      view.setUint32(28, sampleRate * numChannels * 2, true);
      // Block align (channel count * bytes per sample)
      view.setUint16(32, numChannels * 2, true);
      // Bits per sample
      view.setUint16(34, 16, true);
      // Data chunk identifier
      writeString(view, 36, 'data');
      // Data chunk length
      view.setUint32(40, samples.length * 2, true);
      
      // Write the PCM samples
      floatTo16BitPCM(view, 44, samples);
      
      return view;
  }
  
  // Helper function to write a string to a DataView
  function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
      }
  }
  
  // Convert floating point audio data to 16-bit PCM
  function floatTo16BitPCM(output, offset, input) {
      for (let i = 0; i < input.length; i++, offset += 2) {
          const s = Math.max(-1, Math.min(1, input[i]));
          output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
  }
  
  // Finalize the cut operation
  function finalizeCut(blob, format) {
      // Create URL for the blob
      if (cutAudioUrl) {
          URL.revokeObjectURL(cutAudioUrl);
      }
      cutAudioUrl = URL.createObjectURL(blob);
      audioBlob = blob;
      
      // Update audio element source to play the cut audio
      audioElement.src = cutAudioUrl;
      
      // Calculate processing time
      const processingTime = (performance.now() - processingStartTime) / 1000;
      
      // Show download button and hide processing overlay
      btnDownload.style.display = 'inline-flex';
      showProcessingOverlay(false);
      
      // Show success notification
      showNotification(`Audio successfully cut! (${processingTime.toFixed(2)}s)`, 'success');
      
      // Track success
      trackEvent('cut_completed', format, Math.round(endTime - startTime));
  }
  
  // Handle download button click
  function handleDownload() {
      if (!audioBlob) {
          showNotification('No cut audio available', 'error');
          return;
      }
      
      const extension = audioFile.type.split('/')[1].toLowerCase() === 'mp3' || 
                       audioFile.type.split('/')[1].toLowerCase() === 'mpeg' ? 'mp3' : 'wav';
      
      // Generate a filename based on original filename and cut time
      const originalName = audioFile.name.split('.').slice(0, -1).join('.');
      const downloadName = `${originalName}_cut_${formatTimeForFilename(startTime)}-${formatTimeForFilename(endTime)}.${extension}`;
      
      // Create download link
      const a = document.createElement('a');
      a.href = cutAudioUrl;
      a.download = downloadName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Track download
      trackEvent('download', extension, Math.round(endTime - startTime));
  }
  
  // Format time for filename (no colons or periods)
  function formatTimeForFilename(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}m${secs.toString().padStart(2, '0')}s`;
  }
  
  // Reset the editor
  function resetEditor() {
      if (wavesurfer) {
          wavesurfer.pause();
      }
      
      fadeOut(editorContainer);
      setTimeout(() => {
          fadeIn(uploadArea.parentElement);
      }, 300);
      
      // Reset values
      uploadInput.value = '';
      fileName.textContent = 'filename.mp3';
      fileDuration.textContent = '00:00';
      fileFormat.textContent = 'MP3';
      startTime = 0;
      endTime = 0;
      
      // Reset audio element
      if (originalAudioUrl) {
          URL.revokeObjectURL(originalAudioUrl);
          originalAudioUrl = null;
      }
      if (cutAudioUrl) {
          URL.revokeObjectURL(cutAudioUrl);
          cutAudioUrl = null;
      }
      
      audioElement.src = '';
      audioBuffer = null;
      
      // Hide download button
      btnDownload.style.display = 'none';
      
      // Track reset
      trackEvent('reset', 'editor_reset', 0);
  }
  
  // Show/hide processing overlay
  function showProcessingOverlay(show) {
      if (show) {
          processingOverlay.style.display = 'flex';
          processingOverlay.style.opacity = '1';
      } else {
          processingOverlay.style.opacity = '0';
          setTimeout(() => {
              processingOverlay.style.display = 'none';
          }, 300);
      }
  }
  
  // Show notification
  function showNotification(message, type = 'info') {
      // Check if notification container exists
      let notificationContainer = document.querySelector('.notification-container');
      
      // Create container if it doesn't exist
      if (!notificationContainer) {
          notificationContainer = document.createElement('div');
          notificationContainer.className = 'notification-container';
          document.body.appendChild(notificationContainer);
      }
      
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      
      // Get icon based on type
      let icon = 'info-circle';
      if (type === 'success') icon = 'check-circle';
      if (type === 'error') icon = 'exclamation-circle';
      if (type === 'warning') icon = 'exclamation-triangle';
      
      notification.innerHTML = `
          <div class="notification-icon">
              <i class="fas fa-${icon}"></i>
          </div>
          <div class="notification-message">${message}</div>
          <button class="notification-close">
              <i class="fas fa-times"></i>
          </button>
      `;
      
      // Add to container
      notificationContainer.appendChild(notification);
      
      // Fade in
      setTimeout(() => {
          notification.classList.add('show');
      }, 10);
      
      // Add close functionality
      notification.querySelector('.notification-close').addEventListener('click', () => {
          notification.classList.remove('show');
          setTimeout(() => {
              notificationContainer.removeChild(notification);
          }, 300);
      });
      
      // Auto close after 5 seconds
      setTimeout(() => {
          if (notification.parentNode) {
              notification.classList.remove('show');
              setTimeout(() => {
                  if (notification.parentNode) {
                      notificationContainer.removeChild(notification);
                  }
              }, 300);
          }
      }, 5000);
  }
  
  // Fade in element
  function fadeIn(element) {
      element.style.display = 'block';
      setTimeout(() => {
          element.style.opacity = '1';
      }, 10);
  }
  
  // Fade out element
  function fadeOut(element) {
      element.style.opacity = '0';
      setTimeout(() => {
          element.style.display = 'none';
      }, 300);
  }
  
  // Initialize the app
  init();
});

// FAQ Toggle Function
function toggleFaq(element) {
  const faqItem = element.parentElement;
  const isActive = faqItem.classList.contains('active');
  
  // Close all FAQs
  document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
  });
  
  // If the clicked FAQ wasn't active, open it
  if (!isActive) {
      faqItem.classList.add('active');
  }
}