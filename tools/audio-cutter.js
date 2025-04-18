document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const uploadInput = document.getElementById('audio-upload');
    const uploadPrompt = document.getElementById('upload-prompt');
    const editorContainer = document.getElementById('editor-container');
    const audioElement = document.getElementById('audio-element');
    const fileName = document.getElementById('file-name');
    const fileDuration = document.getElementById('file-duration');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const btnReset = document.getElementById('btn-reset');
    const btnPreview = document.getElementById('btn-preview');
    const btnCut = document.getElementById('btn-cut');
    const btnDownload = document.getElementById('btn-download');
    const processingOverlay = document.getElementById('processing-overlay');
    const uploadContainer = document.querySelector('.upload-container');
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
    let audioSource;
    let startTime = 0;
    let endTime = 0;
    let isPlaying = false;
    let currentStartPercentage = 0;
    let currentEndPercentage = 100;
    let originalAudioUrl;
    let cutAudioUrl;
    
    // Initialize WaveSurfer
    function initWavesurfer() {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
      
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
        hideScrollbar: true
      });
      
      // Wavesurfer events
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
        
        // Show editor
        uploadPrompt.parentElement.classList.add('hidden');
        editorContainer.classList.remove('hidden');
      });
      
      wavesurfer.on('finish', function() {
        isPlaying = false;
        btnPreview.innerHTML = '<i class="fas fa-play"></i> Preview Selection';
      });
    }
    
    // Audio Upload Handler
    uploadInput.addEventListener('change', handleAudioUpload);
    
    // Drag and drop functionality
    uploadContainer.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.add('drag-over');
    });
    
    uploadContainer.addEventListener('dragleave', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove('drag-over');
    });
    
    uploadContainer.addEventListener('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove('drag-over');
      
      if (e.dataTransfer.files.length) {
        uploadInput.files = e.dataTransfer.files;
        handleAudioUpload();
      }
    });
    
    function handleAudioUpload() {
      const file = uploadInput.files[0];
      
      if (!file) return;
      
      const validTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg', 'audio/x-m4a', 'audio/m4a'];
      if (!validTypes.includes(file.type) && !file.type.startsWith('audio/')) {
        alert('Please upload a valid audio file (MP3, WAV, OGG, M4A)');
        return;
      }
      
      audioFile = file;
      fileName.textContent = file.name;
      
      // Create URL for audio element
      if (originalAudioUrl) {
        URL.revokeObjectURL(originalAudioUrl);
      }
      originalAudioUrl = URL.createObjectURL(file);
      audioElement.src = originalAudioUrl;
      
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
            alert('Error processing audio file. Please try a different file.');
          });
      };
      
      reader.onerror = function() {
        console.error('Error reading file');
        alert('Error reading audio file. Please try again.');
      };
      
      reader.readAsArrayBuffer(file);
    }
    
    // Time formatting helper
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
    
    // Make selection handles draggable
    let isDraggingStart = false;
    let isDraggingEnd = false;
    
    selectionStart.addEventListener('mousedown', function(e) {
      isDraggingStart = true;
      e.preventDefault();
    });
    
    selectionEnd.addEventListener('mousedown', function(e) {
      isDraggingEnd = true;
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
      if (!isDraggingStart && !isDraggingEnd) return;
      
      const waveformContainer = document.querySelector('.waveform-container');
      const rect = waveformContainer.getBoundingClientRect();
      const containerWidth = rect.width;
      const offsetX = e.clientX - rect.left;
      
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
    });
    
    document.addEventListener('mouseup', function() {
      isDraggingStart = false;
      isDraggingEnd = false;
    });
    
    // Time input handlers
    startTimeInput.addEventListener('change', function() {
      const inputTime = parseTimeInput(this.value);
      
      if (inputTime !== null) {
        const duration = wavesurfer.getDuration();
        if (inputTime >= duration) {
          inputTime = duration - 0.1;
        }
        if (inputTime >= endTime) {
          inputTime = endTime - 0.1;
        }
        
        startTime = inputTime;
        const startPerc = (startTime / duration) * 100;
        updateSelectionArea(startPerc, currentEndPercentage);
      } else {
        this.value = formatTime(startTime);
      }
    });
    
    endTimeInput.addEventListener('change', function() {
      const inputTime = parseTimeInput(this.value);
      
      if (inputTime !== null) {
        const duration = wavesurfer.getDuration();
        if (inputTime > duration) {
          inputTime = duration;
        }
        if (inputTime <= startTime) {
          inputTime = startTime + 0.1;
        }
        
        endTime = inputTime;
        const endPerc = (endTime / duration) * 100;
        updateSelectionArea(currentStartPercentage, endPerc);
      } else {
        this.value = formatTime(endTime);
      }
    });
    
    // Button handlers
    btnReset.addEventListener('click', function() {
      if (wavesurfer) {
        wavesurfer.pause();
      }
      
      uploadPrompt.parentElement.classList.remove('hidden');
      editorContainer.classList.add('hidden');
      
      // Reset values
      uploadInput.value = '';
      fileName.textContent = 'filename.mp3';
      fileDuration.textContent = '00:00';
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
      btnDownload.classList.add('hidden');
    });
    
    btnPreview.addEventListener('click', function() {
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
        }, previewDuration * 1000);
      }
    });
    
    btnCut.addEventListener('click', function() {
      if (!audioBuffer || startTime >= endTime) return;
      
      processingOverlay.classList.remove('hidden');
      
      // Wait a moment to allow UI to update before heavy processing
      setTimeout(() => {
        cutAudio(startTime, endTime)
          .then(blob => {
            // Create URL for the cut audio
            if (cutAudioUrl) {
              URL.revokeObjectURL(cutAudioUrl);
            }
            cutAudioUrl = URL.createObjectURL(blob);
            audioBlob = blob;
            
            // Update audio element
            audioElement.src = cutAudioUrl;
            
            // Show download button
            btnDownload.classList.remove('hidden');
            processingOverlay.classList.add('hidden');
          })
          .catch(err => {
            console.error('Error cutting audio:', err);
            alert('Error cutting audio. Please try again.');
            processingOverlay.classList.add('hidden');
          });
      }, 100);
    });
    
    btnDownload.addEventListener('click', function() {
      if (!audioBlob) return;
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = cutAudioUrl;
      
      // Generate filename with "cut" suffix
      let originalName = audioFile.name;
      const lastDotIndex = originalName.lastIndexOf('.');
      
      let baseName, extension;
      if (lastDotIndex !== -1) {
        baseName = originalName.substring(0, lastDotIndex);
        extension = originalName.substring(lastDotIndex);
      } else {
        baseName = originalName;
        extension = '.mp3';
      }
      
      downloadLink.download = `${baseName}_cut${extension}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
    
    // Audio cutting function - fixed version
    async function cutAudio(startTime, endTime) {
      return new Promise((resolve, reject) => {
        try {
          // Input validation
          if (!audioBuffer) {
            throw new Error("Audio buffer is not available");
          }
          
          const duration = endTime - startTime;
          const sampleRate = audioBuffer.sampleRate;
          const channelCount = audioBuffer.numberOfChannels;
          
          // Create a new buffer for the cut audio
          const newBuffer = audioContext.createBuffer(
            channelCount,
            Math.ceil(duration * sampleRate),
            sampleRate
          );
          
          // Copy each channel's data to the new buffer
          for (let channel = 0; channel < channelCount; channel++) {
            const originalData = audioBuffer.getChannelData(channel);
            const newData = newBuffer.getChannelData(channel);
            
            const startIndex = Math.floor(startTime * sampleRate);
            const endIndex = Math.min(
              Math.ceil(endTime * sampleRate),
              originalData.length
            );
            
            for (let i = startIndex; i < endIndex; i++) {
              newData[i - startIndex] = originalData[i];
            }
          }
          
          // Convert buffer to WAV directly
          const audioData = bufferToWave(newBuffer);
          resolve(new Blob([audioData], { type: 'audio/wav' }));
          
        } catch (err) {
          console.error("Error in cutAudio function:", err);
          reject(err);
        }
      });
    }
    
    // Helper function to convert AudioBuffer to WAV
    function bufferToWave(abuffer) {
      const numOfChan = abuffer.numberOfChannels;
      const length = abuffer.length * numOfChan * 2;
      const buffer = new ArrayBuffer(44 + length);
      const view = new DataView(buffer);
      
      // Write WAVE header
      writeUTFBytes(view, 0, 'RIFF');
      view.setUint32(4, 36 + length, true);
      writeUTFBytes(view, 8, 'WAVE');
      writeUTFBytes(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numOfChan, true);
      view.setUint32(24, abuffer.sampleRate, true);
      view.setUint32(28, abuffer.sampleRate * 2 * numOfChan, true);
      view.setUint16(32, numOfChan * 2, true);
      view.setUint16(34, 16, true);
      writeUTFBytes(view, 36, 'data');
      view.setUint32(40, length, true);
      
      // Write PCM data
      const offset = 44;
      let dataIndex = 0;
      
      for (let i = 0; i < abuffer.length; i++) {
        for (let channel = 0; channel < numOfChan; channel++) {
          const sample = abuffer.getChannelData(channel)[i];
          // Clamp between -1 and 1
          const clampedSample = Math.max(-1, Math.min(1, sample));
          const value = clampedSample < 0 ? clampedSample * 32768 : clampedSample * 32767;
          view.setInt16(offset + (dataIndex * 2), value, true);
          dataIndex++;
        }
      }
      
      return buffer;
    }
    
    function writeUTFBytes(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }
  });