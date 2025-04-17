document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const audioFileInput = document.getElementById('audioFileInput');
    const recordButton = document.getElementById('recordButton');
    const stopRecording = document.getElementById('stopRecording');
    const recordingControls = document.getElementById('recordingControls');
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    const stopButton = document.getElementById('stopButton');
    const currentTimeDisplay = document.getElementById('currentTime');
    const totalTimeDisplay = document.getElementById('totalTime');
    const noiseReduction = document.getElementById('noiseReduction');
    const noiseReductionValue = document.getElementById('noiseReductionValue');
    const bassEQ = document.getElementById('bassEQ');
    const bassEQValue = document.getElementById('bassEQValue');
    const midEQ = document.getElementById('midEQ');
    const midEQValue = document.getElementById('midEQValue');
    const trebleEQ = document.getElementById('trebleEQ');
    const trebleEQValue = document.getElementById('trebleEQValue');
    const resetEQ = document.getElementById('resetEQ');
    const voiceEnhancement = document.getElementById('voiceEnhancement');
    const voiceEnhancementValue = document.getElementById('voiceEnhancementValue');
    const normalization = document.getElementById('normalization');
    const reverbReduction = document.getElementById('reverbReduction');
    const reverbReductionValue = document.getElementById('reverbReductionValue');
    const applyEffects = document.getElementById('applyEffects');
    const exportButton = document.getElementById('exportButton');
    const formatRadios = document.getElementsByName('format');
    const qualitySelect = document.getElementById('qualitySelect');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Audio Context
    let audioContext;
    let originalAudioBuffer = null;
    let processedAudioBuffer = null;
    
    // Wavesurfer instances
    let waveformOriginal;
    let waveformProcessed;
    
    // Recording variables
    let mediaRecorder;
    let recordedChunks = [];
    let recordingTimer;
    let recordingTime = 0;
    
    // Audio nodes for processing
    let sourceNode = null;
    let bassFilter = null;
    let midFilter = null;
    let trebleFilter = null;
    let gainNode = null;
    
    // Playing state
    let isPlaying = false;
    
    // Initialize WaveSurfer
    function initWaveSurfer() {
      waveformOriginal = WaveSurfer.create({
        container: '#waveformOriginal',
        waveColor: '#4a83ff',
        progressColor: '#2250c9',
        cursorColor: '#ffffff',
        barWidth: 2,
        barRadius: 3,
        barGap: 2,
        height: 100,
        responsive: true,
        normalize: true,
        partialRender: true,
      });
      
      waveformProcessed = WaveSurfer.create({
        container: '#waveformProcessed',
        waveColor: '#8a2be2',
        progressColor: '#a020f0',
        cursorColor: '#ffffff',
        barWidth: 2,
        barRadius: 3,
        barGap: 2,
        height: 100,
        responsive: true,
        normalize: true,
        partialRender: true
      });
      
      // Events for waveforms
      waveformOriginal.on('ready', function() {
        updateTimers();
        enableControls();
      });
      
      waveformOriginal.on('audioprocess', function() {
        updateTimers();
      });
      
      waveformOriginal.on('seek', function() {
        if (waveformProcessed.isReady) {
          waveformProcessed.seekTo(waveformOriginal.getCurrentTime() / waveformOriginal.getDuration());
        }
        updateTimers();
      });
      
      waveformProcessed.on('seek', function() {
        if (waveformOriginal.isReady) {
          waveformOriginal.seekTo(waveformProcessed.getCurrentTime() / waveformProcessed.getDuration());
        }
        updateTimers();
      });
    }
    
    // Initialize Audio Context and audio processing nodes
    function initAudioContext() {
      // Create AudioContext
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('AudioContext initialized');
        
        // Initialize filters
        bassFilter = audioContext.createBiquadFilter();
        bassFilter.type = 'lowshelf';
        bassFilter.frequency.value = 200;
        
        midFilter = audioContext.createBiquadFilter();
        midFilter.type = 'peaking';
        midFilter.frequency.value = 1000;
        midFilter.Q.value = 1;
        
        trebleFilter = audioContext.createBiquadFilter();
        trebleFilter.type = 'highshelf';
        trebleFilter.frequency.value = 3000;
        
        gainNode = audioContext.createGain();
        
      } catch (e) {
        console.error('Web Audio API is not supported in this browser:', e);
        alert('Your browser does not support the Web Audio API. Please try another browser.');
      }
    }
    
    // Upload handlers
    uploadArea.addEventListener('click', function() {
      audioFileInput.click();
    });
    
    uploadArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', function() {
      uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      uploadArea.classList.remove('active');
      
      if (e.dataTransfer.files.length) {
        processAudioFile(e.dataTransfer.files[0]);
      }
    });
    
    audioFileInput.addEventListener('change', function() {
      if (audioFileInput.files.length) {
        processAudioFile(audioFileInput.files[0]);
      }
    });
    
    // Process uploaded audio file
    function processAudioFile(file) {
      // Check file type
      if (!file.type.startsWith('audio/')) {
        alert('Please upload an audio file.');
        return;
      }
      
      // Check file size (20MB max)
      if (file.size > 20 * 1024 * 1024) {
        alert('File size should not exceed 20MB.');
        return;
      }
      
      // Show loading
      showLoading();
      
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        
        // Initialize audio context if not already done
        if (!audioContext) {
          initAudioContext();
        }
        
        // Decode audio
        audioContext.decodeAudioData(arrayBuffer)
          .then(function(buffer) {
            originalAudioBuffer = buffer;
            processedAudioBuffer = buffer;
            
            // Load into waveforms
            waveformOriginal.loadDecodedBuffer(originalAudioBuffer);
            waveformProcessed.loadDecodedBuffer(processedAudioBuffer);
            
            // Enable controls
            enableControls();
            
            // Hide loading
            hideLoading();
          })
          .catch(function(err) {
            console.error('Error decoding audio data', err);
            alert('Error processing audio file. Please try a different file.');
            hideLoading();
          });
      };
      
      reader.onerror = function() {
        alert('Error reading file.');
        hideLoading();
      };
      
      reader.readAsArrayBuffer(file);
    }
    
    // Recording functionality
    recordButton.addEventListener('click', function() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support audio recording. Please try another browser.');
        return;
      }
      
      // Start recording
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
          // Initialize audio context if not already done
          if (!audioContext) {
            initAudioContext();
          }
          
          mediaRecorder = new MediaRecorder(stream);
          recordedChunks = [];
          
          mediaRecorder.addEventListener('dataavailable', function(e) {
            if (e.data.size > 0) {
              recordedChunks.push(e.data);
            }
          });
          
          mediaRecorder.addEventListener('stop', function() {
            // Stop all tracks in the stream
            stream.getTracks().forEach(track => track.stop());
            
            // Process recorded audio
            processRecordedAudio();
            
            // Reset UI
            recordButton.style.display = 'block';
            recordingControls.style.display = 'none';
            
            // Clear recording timer
            clearInterval(recordingTimer);
            recordingTime = 0;
          });
          
          // Start recording
          mediaRecorder.start();
          
          // Update UI
          recordButton.style.display = 'none';
          recordingControls.style.display = 'flex';
          
          // Start recording timer
          recordingTimer = setInterval(updateRecordingTime, 1000);
        })
        .catch(function(err) {
          console.error('Error accessing microphone:', err);
          alert('Error accessing your microphone. Please check permissions and try again.');
        });
    });
    
    // Stop recording
    stopRecording.addEventListener('click', function() {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    });
    
    // Process recorded audio
    function processRecordedAudio() {
      showLoading();
      
      const blob = new Blob(recordedChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        
        audioContext.decodeAudioData(arrayBuffer)
          .then(function(buffer) {
            originalAudioBuffer = buffer;
            processedAudioBuffer = buffer;
            
            // Load into waveforms
            waveformOriginal.loadDecodedBuffer(originalAudioBuffer);
            waveformProcessed.loadDecodedBuffer(processedAudioBuffer);
            
            // Enable controls
            enableControls();
            
            // Hide loading
            hideLoading();
          })
          .catch(function(err) {
            console.error('Error decoding recorded audio', err);
            alert('Error processing recorded audio. Please try again.');
            hideLoading();
          });
      };
      
      reader.onerror = function() {
        alert('Error reading recorded audio.');
        hideLoading();
      };
      
      reader.readAsArrayBuffer(blob);
    }
    
    // Update recording time
    function updateRecordingTime() {
      recordingTime++;
      const minutes = Math.floor(recordingTime / 60).toString().padStart(2, '0');
      const seconds = (recordingTime % 60).toString().padStart(2, '0');
      
      const timeDisplay = document.querySelector('.recording-time');
      timeDisplay.textContent = `${minutes}:${seconds}`;
    }
    
    // Audio playback controls
    playButton.addEventListener('click', function() {
      waveformOriginal.play();
      waveformProcessed.play();
      isPlaying = true;
      updatePlaybackButtons();
    });
    
    pauseButton.addEventListener('click', function() {
      waveformOriginal.pause();
      waveformProcessed.pause();
      isPlaying = false;
      updatePlaybackButtons();
    });
    
    stopButton.addEventListener('click', function() {
      waveformOriginal.stop();
      waveformProcessed.stop();
      isPlaying = false;
      updatePlaybackButtons();
    });
    
    // Update playback buttons
    function updatePlaybackButtons() {
      if (isPlaying) {
        playButton.style.display = 'none';
        pauseButton.style.display = 'flex';
      } else {
        playButton.style.display = 'flex';
        pauseButton.style.display = 'none';
      }
    }
    
    // Update time displays
    function updateTimers() {
      if (waveformOriginal.isReady) {
        const currentTime = waveformOriginal.getCurrentTime();
        const duration = waveformOriginal.getDuration();
        
        currentTimeDisplay.textContent = formatTime(currentTime);
        totalTimeDisplay.textContent = formatTime(duration);
      }
    }
    
    // Format time in mm:ss
    function formatTime(timeInSeconds) {
      const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
      const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }
    
    // Enable UI controls
    function enableControls() {
      playButton.disabled = false;
      pauseButton.disabled = false;
      stopButton.disabled = false;
      applyEffects.disabled = false;
      exportButton.disabled = false;
    }
    
    // Effect controls event listeners
    noiseReduction.addEventListener('input', function() {
      noiseReductionValue.textContent = noiseReduction.value;
    });
    
    bassEQ.addEventListener('input', function() {
      bassEQValue.textContent = bassEQ.value;
    });
    
    midEQ.addEventListener('input', function() {
      midEQValue.textContent = midEQ.value;
    });
    
    trebleEQ.addEventListener('input', function() {
      trebleEQValue.textContent = trebleEQ.value;
    });
    
    resetEQ.addEventListener('click', function() {
      bassEQ.value = 0;
      midEQ.value = 0;
      trebleEQ.value = 0;
      bassEQValue.textContent = '0';
      midEQValue.textContent = '0';
      trebleEQValue.textContent = '0';
    });
    
    voiceEnhancement.addEventListener('input', function() {
      voiceEnhancementValue.textContent = voiceEnhancement.value;
    });
    
    reverbReduction.addEventListener('input', function() {
      reverbReductionValue.textContent = reverbReduction.value;
    });
    
    // Apply audio effects
    applyEffects.addEventListener('click', function() {
      if (!originalAudioBuffer) {
        alert('Please upload or record audio first.');
        return;
      }
      
      showLoading();
      
      // Use setTimeout to allow the loading overlay to appear before processing
      setTimeout(function() {
        try {
          // Create offline audio context for processing
          const offlineContext = new OfflineAudioContext(
            originalAudioBuffer.numberOfChannels,
            originalAudioBuffer.length,
            originalAudioBuffer.sampleRate
          );
          
          // Source node
          const source = offlineContext.createBufferSource();
          source.buffer = originalAudioBuffer;
          
          // Create processing nodes
          let lastNode = source;
          
          // 1. Noise Reduction (using low-pass filter as a simple simulation)
          if (parseInt(noiseReduction.value) > 0) {
            const noiseFilter = offlineContext.createBiquadFilter();
            noiseFilter.type = 'lowpass';
            const noiseValue = parseInt(noiseReduction.value);
            // More reduction = lower cutoff frequency (removes more high-frequency noise)
            noiseFilter.frequency.value = 20000 - (noiseValue * 150);
            noiseFilter.Q.value = 1.0;
            
            lastNode.connect(noiseFilter);
            lastNode = noiseFilter;
          }
          
          // 2. Equalizer
          const bass = offlineContext.createBiquadFilter();
          bass.type = 'lowshelf';
          bass.frequency.value = 200;
          bass.gain.value = parseInt(bassEQ.value);
          
          const mid = offlineContext.createBiquadFilter();
          mid.type = 'peaking';
          mid.frequency.value = 1000;
          mid.Q.value = 1;
          mid.gain.value = parseInt(midEQ.value);
          
          const treble = offlineContext.createBiquadFilter();
          treble.type = 'highshelf';
          treble.frequency.value = 3000;
          treble.gain.value = parseInt(trebleEQ.value);
          
          lastNode.connect(bass);
          bass.connect(mid);
          mid.connect(treble);
          lastNode = treble;
          
          // 3. Voice Enhancement (using peaking EQ to boost speech frequencies)
          if (parseInt(voiceEnhancement.value) > 0) {
            const voiceFilter1 = offlineContext.createBiquadFilter();
            voiceFilter1.type = 'peaking';
            voiceFilter1.frequency.value = 1000; // Human voice fundamental frequencies
            voiceFilter1.Q.value = 1.4;
            voiceFilter1.gain.value = parseInt(voiceEnhancement.value) * 0.2;
            
            const voiceFilter2 = offlineContext.createBiquadFilter();
            voiceFilter2.type = 'peaking';
            voiceFilter2.frequency.value = 2500; // Human voice presence
            voiceFilter2.Q.value = 1.0;
            voiceFilter2.gain.value = parseInt(voiceEnhancement.value) * 0.25;
            
            lastNode.connect(voiceFilter1);
            voiceFilter1.connect(voiceFilter2);
            lastNode = voiceFilter2;
          }
          
          // 4. Reverb Reduction (using dynamic compressor as a simple simulation)
          if (parseInt(reverbReduction.value) > 0) {
            const compressor = offlineContext.createDynamicCompressor();
            compressor.threshold.value = -50 + parseInt(reverbReduction.value) * 0.3;
            compressor.knee.value = 40;
            compressor.ratio.value = 12;
            compressor.attack.value = 0;
            compressor.release.value = 0.25;
            
            lastNode.connect(compressor);
            lastNode = compressor;
          }
          
          // 5. Volume Normalization
          if (normalization.checked) {
            const analyser = offlineContext.createAnalyser();
            analyser.fftSize = 2048;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            const gainNode = offlineContext.createGain();
            lastNode.connect(analyser);
            analyser.connect(gainNode);
            
            // Get average volume
            analyser.getByteTimeDomainData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += Math.abs(dataArray[i] - 128);
            }
            const average = sum / dataArray.length;
            
            // Set gain to normalize (simple approach)
            const normalizeLevel = 40; // target level
            const gain = average < normalizeLevel ? normalizeLevel / average : 1;
            gainNode.gain.value = Math.min(gain, 2.0); // limit gain to 2x to prevent distortion
            
            lastNode = gainNode;
          }
          
          // Connect to offline context destination
          lastNode.connect(offlineContext.destination);
          
          // Start processing
          source.start(0);
          
          offlineContext.startRendering().then(function(renderedBuffer) {
            // Update processed buffer
            processedAudioBuffer = renderedBuffer;
            
            // Update waveform display
            waveformProcessed.loadDecodedBuffer(processedAudioBuffer);
            
            hideLoading();
          }).catch(function(err) {
            console.error('Rendering failed:', err);
            alert('Error processing audio. Please try again with different settings.');
            hideLoading();
          });
          
        } catch (error) {
          console.error('Processing error:', error);
          alert('An error occurred during audio processing. Please try again.');
          hideLoading();
        }
      }, 100);
    });
    
    // Export processed audio
    exportButton.addEventListener('click', function() {
      if (!processedAudioBuffer) {
        alert('Please process audio first.');
        return;
      }
      
      showLoading();
      
      // Get selected format
      let format = 'mp3'; // default
      for (const radio of formatRadios) {
        if (radio.checked) {
          format = radio.value;
          break;
        }
      }
      
      // Get selected quality
      const quality = parseInt(qualitySelect.value);
      
      // Create download function
      setTimeout(function() {
        try {
          // Create offline context for encoding
          const offlineContext = new OfflineAudioContext(
            processedAudioBuffer.numberOfChannels,
            processedAudioBuffer.length,
            processedAudioBuffer.sampleRate
          );
          
          const source = offlineContext.createBufferSource();
          source.buffer = processedAudioBuffer;
          source.connect(offlineContext.destination);
          source.start(0);
          
          offlineContext.startRendering().then(function(renderedBuffer) {
            // Convert buffer to WAV format (16-bit PCM)
            const wavBuffer = bufferToWave(renderedBuffer, renderedBuffer.length);
            
            if (format === 'wav') {
              // Direct WAV download
              downloadBlob(wavBuffer, 'enhanced_audio.wav');
              hideLoading();
            } else if (format === 'mp3') {
              // For MP3, we would typically use a library like lamejs
              // For simplicity in this example, we'll just download as WAV
              downloadBlob(wavBuffer, 'enhanced_audio.wav');
              alert('MP3 encoding requires an additional library. Downloading as WAV instead.');
              hideLoading();
            }
          }).catch(function(err) {
            console.error('Rendering failed:', err);
            alert('Error exporting audio. Please try again.');
            hideLoading();
          });
        } catch (error) {
          console.error('Export error:', error);
          alert('An error occurred during export. Please try again.');
          hideLoading();
        }
      }, 100);
    });
    
    // Convert AudioBuffer to WAV format
    function bufferToWave(abuffer, len) {
      const numOfChan = abuffer.numberOfChannels;
      const length = len * numOfChan * 2 + 44;
      const buffer = new ArrayBuffer(length);
      const view = new DataView(buffer);
      let sample;
      let offset = 0;
      let pos = 0;
      
      // write WAVE header
      setUint32(0x46464952); // "RIFF"
      setUint32(length - 8); // file length - 8
      setUint32(0x45564157); // "WAVE"
      
      setUint32(0x20746d66); // "fmt " chunk
      setUint32(16); // length = 16
      setUint16(1); // PCM (uncompressed)
      setUint16(numOfChan);
      setUint32(abuffer.sampleRate);
      setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
      setUint16(numOfChan * 2); // block-align
      setUint16(16); // 16-bit
      
      setUint32(0x61746164); // "data" chunk
      setUint32(length - pos - 4); // chunk length
      
      // write interleaved data
      for(let i = 0; i < abuffer.getChannelData(0).length; i++) {
        for(let channel = 0; channel < numOfChan; channel++) {
          sample = Math.max(-1, Math.min(1, abuffer.getChannelData(channel)[i]));
          sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // convert to 16 bit
          view.setInt16(pos, sample, true); // write 16-bit sample
          pos += 2;
        }
      }
      
      function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
      }
      
      function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
      }
      
      return new Blob([buffer], { type: 'audio/wav' });
    }
    
    // Download blob
    function downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      a.click();
      
      // Cleanup
      setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    }
    
    // Loading overlay functions
    function showLoading() {
      loadingOverlay.classList.add('active');
    }
    
    function hideLoading() {
      loadingOverlay.classList.remove('active');
    }
    
    // Initialize
    initWaveSurfer();
    updatePlaybackButtons();
  });