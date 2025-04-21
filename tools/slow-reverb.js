document.addEventListener('DOMContentLoaded', function() {
    // Main elements
    const audioFileInput = document.getElementById('audioFileInput');
    const dropZone = document.getElementById('dropZone');
    const browseBtn = document.getElementById('browseBtn');
    const uploadSection = document.getElementById('uploadSection');
    const editorSection = document.getElementById('editorSection');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.getElementById('loadingText');
    const loadingInfo = document.getElementById('loadingInfo');
    const backToUpload = document.getElementById('backToUpload');
    const scrollToToolBtn = document.getElementById('scrollToToolBtn');
    
    // Audio elements and controls
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
    const resetEffectsBtn = document.getElementById('resetEffectsBtn');
    const applyEffectsBtn = document.getElementById('applyEffectsBtn');
    
    // Output controls
    const outputFormat = document.getElementById('outputFormat');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const resetAllBtn = document.getElementById('resetAllBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Notification
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    // Variables
    let originalAudio = null;
    let processedAudio = null;
    let audioContext = null;
    let audioBuffer = null;
    let audioSource = null;
    let audioPlaying = false;
    let currentPreset = 'classic';
    let waveform = null;
    let isPlayingOriginal = true;
    let lastNotificationTimeout = null;
    
    // Effect parameters
    let effectParams = {
        tempo: 75,   // percentage of original speed
        reverb: 60,  // percentage 0-100
        decay: 4,    // seconds
        bassBoost: 3, // dB
        pitch: -2    // semitones
    };
    
    // Preset parameters
    const presets = {
        classic: { tempo: 75, reverb: 60, decay: 4, bassBoost: 3, pitch: -2 },
        dreamy: { tempo: 70, reverb: 80, decay: 6, bassBoost: 2, pitch: -3 },
        underwater: { tempo: 65, reverb: 90, decay: 8, bassBoost: 4, pitch: -4 },
        lofi: { tempo: 85, reverb: 50, decay: 3, bassBoost: 6, pitch: -1 },
        custom: { tempo: 75, reverb: 60, decay: 4, bassBoost: 3, pitch: -2 }
    };
    
    // Initialize
    function init() {
        // Set up event listeners
        setupEventListeners();
        
        // Initialize Web Audio API
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
        } catch (e) {
            showNotification('Your browser does not support the Web Audio API. Please use a modern browser.', 5000);
        }
        
        // Hide editor section initially
        editorSection.style.display = 'none';
        
        // Initialize wavesurfer when the script is loaded
        if (typeof WaveSurfer !== 'undefined') {
            initWaveform();
        } else {
            // Check for WaveSurfer in case it loads after this script
            window.addEventListener('load', function() {
                if (typeof WaveSurfer !== 'undefined') {
                    initWaveform();
                } else {
                    console.error('WaveSurfer.js is not loaded');
                }
            });
        }
    }
    
    // Initialize waveform
    function initWaveform() {
        if (!WaveSurfer) return;
        
        waveform = WaveSurfer.create({
            container: waveformContainer,
            waveColor: 'rgba(158, 158, 179, 0.4)',
            progressColor: '#7000ff',
            cursorColor: '#00d9ff',
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
            height: 128,
            responsive: true,
            normalize: true,
            partialRender: true
        });
        
        // Waveform events
        waveform.on('ready', function() {
            updateTimeDisplay(0, waveform.getDuration());
            showNotification('Audio loaded successfully!');
        });
        
        waveform.on('audioprocess', function(time) {
            updateTimeDisplay(time, waveform.getDuration());
        });
        
        waveform.on('seek', function(progress) {
            updateTimeDisplay(progress * waveform.getDuration(), waveform.getDuration());
        });
        
        waveform.on('finish', function() {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            audioPlaying = false;
        });
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // File input events
        audioFileInput.addEventListener('change', handleFileSelect);
        browseBtn.addEventListener('click', () => audioFileInput.click());
        backToUpload.addEventListener('click', resetTool);
        
        // Drag and drop events
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);
        
        // Playback control events
        playPauseBtn.addEventListener('click', togglePlay);
        volumeSlider.addEventListener('input', adjustVolume);
        
        // Audio preview toggle
        originalAudioBtn.addEventListener('click', function() {
            setActiveButton([originalAudioBtn, effectAudioBtn], this);
            switchAudioPreview('original');
        });
        
        effectAudioBtn.addEventListener('click', function() {
            setActiveButton([originalAudioBtn, effectAudioBtn], this);
            switchAudioPreview('effect');
        });
        
        // Effect preset buttons
        presetBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const preset = this.dataset.preset;
                setActiveButton(presetBtns, this);
                applyPreset(preset);
            });
        });
        
        // Effect slider events
        tempoSlider.addEventListener('input', function() {
            tempoValue.textContent = `${this.value}%`;
            effectParams.tempo = parseInt(this.value);
            updateCustomPreset();
        });
        
        reverbSlider.addEventListener('input', function() {
            reverbValue.textContent = `${this.value}%`;
            effectParams.reverb = parseInt(this.value);
            updateCustomPreset();
        });
        
        decaySlider.addEventListener('input', function() {
            decayValue.textContent = `${this.value}s`;
            effectParams.decay = parseInt(this.value);
            updateCustomPreset();
        });
        
        bassSlider.addEventListener('input', function() {
            bassValue.textContent = `+${this.value}dB`;
            effectParams.bassBoost = parseInt(this.value);
            updateCustomPreset();
        });
        
        pitchSlider.addEventListener('input', function() {
            pitchValue.textContent = this.value;
            effectParams.pitch = parseInt(this.value);
            updateCustomPreset();
        });
        
        // Button events
        resetEffectsBtn.addEventListener('click', resetEffects);
        applyEffectsBtn.addEventListener('click', processAudio);
        
        // Output control events
        qualitySlider.addEventListener('input', function() {
            qualityValue.textContent = `${this.value} kbps`;
        });
        
        // Final action events
        resetAllBtn.addEventListener('click', resetTool);
        downloadBtn.addEventListener('click', downloadProcessedAudio);
        
        // Scroll to tool button
        if (scrollToToolBtn) {
            scrollToToolBtn.addEventListener('click', function() {
                document.querySelector('.tool-container').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // Handle file selection
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && isValidAudioFile(file)) {
            loadAudio(file);
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
    
    // Handle drop
    function handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        dropZone.classList.remove('dragover');
        
        const file = event.dataTransfer.files[0];
        if (file && isValidAudioFile(file)) {
            loadAudio(file);
        } else {
            showNotification('Please upload a valid audio file (MP3, WAV, OGG, M4A).', 3000);
        }
    }
    
    // Check if file is a valid audio file
    function isValidAudioFile(file) {
        const acceptedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'];
        return acceptedTypes.includes(file.type);
    }
    
    // Load audio file
    function loadAudio(file) {
        showLoading('Loading Audio', 'Preparing your audio...');
        
        originalAudio = file;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const audioData = e.target.result;
            
            // Decode audio data
            audioContext.decodeAudioData(audioData)
                .then(function(buffer) {
                    audioBuffer = buffer;
                    
                    // Display waveform
                    waveform.loadDecodedBuffer(buffer);
                    
                    // Show editor section
                    uploadSection.style.display = 'none';
                    editorSection.style.display = 'block';
                    
                    // Reset all controls to default
                    resetControls();
                    
                    // Apply default preset
                    applyPreset('classic');
                    
                    // Hide loading
                    hideLoading();
                })
                .catch(function(err) {
                    console.error('Error decoding audio data', err);
                    hideLoading();
                    showNotification('Failed to decode audio. Please try another file.', 3000);
                });
        };
        
        reader.onerror = function() {
            hideLoading();
            showNotification('Failed to load audio file. Please try again.', 3000);
        };
        
        reader.readAsArrayBuffer(file);
    }
    
    // Toggle play/pause
    function togglePlay() {
        if (!waveform) return;
        
        if (audioPlaying) {
            waveform.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            waveform.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        
        audioPlaying = !audioPlaying;
    }
    
    // Update time display
    function updateTimeDisplay(currentTime, totalTime) {
        currentTimeDisplay.textContent = formatTime(currentTime);
        totalTimeDisplay.textContent = formatTime(totalTime);
    }
    
    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Adjust volume
    function adjustVolume() {
        if (!waveform) return;
        
        const volume = volumeSlider.value / 100;
        waveform.setVolume(volume);
    }
    
    // Switch between original and processed audio preview
    function switchAudioPreview(type) {
        isPlayingOriginal = (type === 'original');
        
        if (audioPlaying) {
            waveform.pause();
            audioPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        
        if (type === 'original') {
            // Use original audio
            if (audioBuffer) {
                waveform.loadDecodedBuffer(audioBuffer);
            }
        } else {
            // Use processed audio
            if (processedAudio) {
                waveform.loadDecodedBuffer(processedAudio);
            } else {
                showNotification('Please apply effects first to preview.', 3000);
                // Switch back to original
                originalAudioBtn.click();
            }
        }
    }
    
    // Apply effect preset
    function applyPreset(preset) {
        currentPreset = preset;
        
        // Apply preset parameters
        if (presets[preset]) {
            const params = presets[preset];
            
            // Update sliders and values
            tempoSlider.value = params.tempo;
            tempoValue.textContent = `${params.tempo}%`;
            
            reverbSlider.value = params.reverb;
            reverbValue.textContent = `${params.reverb}%`;
            
            decaySlider.value = params.decay;
            decayValue.textContent = `${params.decay}s`;
            
            bassSlider.value = params.bassBoost;
            bassValue.textContent = `+${params.bassBoost}dB`;
            
            pitchSlider.value = params.pitch;
            pitchValue.textContent = params.pitch;
            
            // Update effect parameters
            effectParams = { ...params };
        }
    }
    
    // Update custom preset when sliders change
    function updateCustomPreset() {
        // Switch to custom preset if user changes sliders
        if (currentPreset !== 'custom') {
            currentPreset = 'custom';
            setActiveButton(presetBtns, document.querySelector('.preset-btn[data-preset="custom"]'));
        }
        
        // Update custom preset parameters
        presets.custom = { ...effectParams };
    }
    
    // Reset effects to default
    function resetEffects() {
        applyPreset('classic');
        setActiveButton(presetBtns, document.querySelector('.preset-btn[data-preset="classic"]'));
        showNotification('Effects reset to default.');
    }
    
    // Process audio with effects
    function processAudio() {
        if (!audioBuffer) {
            showNotification('Please upload an audio file first.', 3000);
            return;
        }
        
        showLoading('Processing Audio', 'Applying effects...');
        
        // Start with a low progress
        let progress = 10;
        progressBar.style.width = `${progress}%`;
        
        // Progress animation
        const progressInterval = setInterval(() => {
            progress += 5;
            if (progress > 90) progress = 90;
            progressBar.style.width = `${progress}%`;
        }, 300);
        
        // Process in a setTimeout to allow UI to update
        setTimeout(() => {
            try {
                // Create a new AudioContext for processing
                const offlineCtx = new OfflineAudioContext(
                    audioBuffer.numberOfChannels,
                    audioBuffer.length * (100 / effectParams.tempo), // Adjust length based on tempo
                    audioBuffer.sampleRate
                );
                
                // Create source
                const source = offlineCtx.createBufferSource();
                source.buffer = audioBuffer;
                
                // Apply tempo change (time stretching)
                // We're simply adjusting the playback rate for the offline context
                // For more sophisticated time stretching, a dedicated library would be needed
                source.playbackRate.value = effectParams.tempo / 100;
                
                // Apply pitch shift (simple approximation)
                // This is a simple pitch shift, advanced algorithms would use phase vocoder
                if (effectParams.pitch !== 0) {
                    const pitchShift = Math.pow(2, effectParams.pitch / 12);
                    source.detune.value = effectParams.pitch * 100; // detune in cents
                }
                
                // Create convolver for reverb
                const convolver = offlineCtx.createConvolver();
                const reverbGain = offlineCtx.createGain();
                reverbGain.gain.value = effectParams.reverb / 100;
                
                // Generate impulse response for reverb
                const reverbImpulse = createReverbImpulse(offlineCtx, effectParams.decay);
                convolver.buffer = reverbImpulse;
                
                // Create bass boost EQ
                const bassBoost = offlineCtx.createBiquadFilter();
                bassBoost.type = 'lowshelf';
                bassBoost.frequency.value = 200;
                bassBoost.gain.value = effectParams.bassBoost;
                
                // Create dry/wet mix
                const dryGain = offlineCtx.createGain();
                dryGain.gain.value = 1 - (effectParams.reverb / 100);
                
                // Connect the nodes
                source.connect(bassBoost);
                
                // Dry path
                bassBoost.connect(dryGain);
                dryGain.connect(offlineCtx.destination);
                
                // Wet path (reverb)
                bassBoost.connect(convolver);
                convolver.connect(reverbGain);
                reverbGain.connect(offlineCtx.destination);
                
                // Start the source
                source.start(0);
                
                // Render the audio
                offlineCtx.startRendering().then(function(renderedBuffer) {
                    // Store processed audio
                    processedAudio = renderedBuffer;
                    
                    // Automatically switch to processed audio preview
                    effectAudioBtn.click();
                    
                    // Complete progress bar
                    clearInterval(progressInterval);
                    progressBar.style.width = '100%';
                    
                    // Hide loading
                    setTimeout(hideLoading, 500);
                    
                    showNotification('Effects applied successfully!');
                }).catch(function(err) {
                    console.error('Rendering failed:', err);
                    clearInterval(progressInterval);
                    hideLoading();
                    showNotification('Failed to process audio. Please try again.', 3000);
                });
                
            } catch (error) {
                console.error('Processing error:', error);
                clearInterval(progressInterval);
                hideLoading();
                showNotification('An error occurred during processing. Please try again.', 3000);
            }
        }, 100);
    }
    
    // Create impulse response for reverb
    function createReverbImpulse(context, duration) {
        const sampleRate = context.sampleRate;
        const length = sampleRate * duration;
        const impulse = context.createBuffer(2, length, sampleRate);
        const impulseL = impulse.getChannelData(0);
        const impulseR = impulse.getChannelData(1);
        
        // Fill with noise with exponential decay
        for (let i = 0; i < length; i++) {
            const decay = Math.exp(-i / (sampleRate * (duration / 3)));
            impulseL[i] = (Math.random() * 2 - 1) * decay;
            impulseR[i] = (Math.random() * 2 - 1) * decay;
        }
        
        return impulse;
    }
    
    // Download processed audio
    function downloadProcessedAudio() {
        if (!processedAudio) {
            showNotification('Please apply effects first before downloading.', 3000);
            return;
        }
        
        showLoading('Preparing Download', 'Creating file...');
        
        // Progress animation
        let progress = 10;
        progressBar.style.width = `${progress}%`;
        
        const progressInterval = setInterval(() => {
            progress += 10;
            if (progress > 90) progress = 90;
            progressBar.style.width = `${progress}%`;
        }, 200);
        
        // Get selected format and quality
        const format = outputFormat.value;
        const quality = parseInt(qualitySlider.value);
        
        setTimeout(() => {
            try {
                // Create a new offline context for rendering
                const offlineCtx = new OfflineAudioContext(
                    processedAudio.numberOfChannels,
                    processedAudio.length,
                    processedAudio.sampleRate
                );
                
                // Create source from processed audio
                const source = offlineCtx.createBufferSource();
                source.buffer = processedAudio;
                source.connect(offlineCtx.destination);
                source.start(0);
                
                // Render for downloading
                offlineCtx.startRendering().then(function(renderedBuffer) {
                    // Convert to desired format
                    exportBuffer(renderedBuffer, format, quality)
                        .then(function(blob) {
                            // Create download link
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `slow-reverb.${format}`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            
                            // Complete progress and hide loading
                            clearInterval(progressInterval);
                            progressBar.style.width = '100%';
                            setTimeout(hideLoading, 500);
                            
                            showNotification('Download started!');
                        })
                        .catch(function(err) {
                            console.error('Export failed:', err);
                            clearInterval(progressInterval);
                            hideLoading();
                            showNotification('Failed to export audio. Please try again.', 3000);
                        });
                    
                }).catch(function(err) {
                    console.error('Rendering failed:', err);
                    clearInterval(progressInterval);
                    hideLoading();
                    showNotification('Failed to prepare download. Please try again.', 3000);
                });
                
            } catch (error) {
                console.error('Download preparation error:', error);
                clearInterval(progressInterval);
                hideLoading();
                showNotification('An error occurred during download preparation. Please try again.', 3000);
            }
        }, 100);
    }
    
    // Export audio buffer to desired format
    function exportBuffer(buffer, format, quality) {
        return new Promise((resolve, reject) => {
            // Create a new offline context for encoding
            const offlineCtx = new OfflineAudioContext(
                buffer.numberOfChannels,
                buffer.length,
                buffer.sampleRate
            );
            
            // Create source
            const source = offlineCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(offlineCtx.destination);
            source.start(0);
            
            // Render
            offlineCtx.startRendering().then(function(renderedBuffer) {
                // Convert to desired format using MediaRecorder
                const channels = [];
                for (let i = 0; i < renderedBuffer.numberOfChannels; i++) {
                    channels.push(renderedBuffer.getChannelData(i));
                }
                
                // Interleave channels
                const interleaved = interleaveChannels(channels, renderedBuffer.length);
                
                // Create a WAV file regardless of requested format (for compatibility)
                const wavBlob = createWaveBlob(interleaved, renderedBuffer.numberOfChannels, renderedBuffer.sampleRate);
                
                if (format === 'wav') {
                    resolve(wavBlob);
                } else if (format === 'mp3') {
                    // For MP3, we would need a dedicated encoder like lame.js
                    // For this example, we'll just return WAV for simplicity
                    // In a production app, you would include lame.js or use Web Audio API's MediaRecorder
                    resolve(wavBlob);
                }
            }).catch(reject);
        });
    }
    
    // Interleave audio channels
    function interleaveChannels(channels, frameCount) {
        const numChannels = channels.length;
        const result = new Float32Array(frameCount * numChannels);
        let offset = 0;
        
        for (let i = 0; i < frameCount; i++) {
            for (let channel = 0; channel < numChannels; channel++) {
                result[offset++] = channels[channel][i];
            }
        }
        
        return result;
    }
    
    // Create WAV blob from audio data
    function createWaveBlob(interleaved, numChannels, sampleRate) {
        const buffer = new ArrayBuffer(44 + interleaved.length * 2);
        const view = new DataView(buffer);
        
        // RIFF chunk descriptor
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + interleaved.length * 2, true);
        writeString(view, 8, 'WAVE');
        
        // fmt sub-chunk
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true); // fmt chunk size
        view.setUint16(20, 1, true); // audio format (1 for PCM)
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * 2, true); // byte rate
        view.setUint16(32, numChannels * 2, true); // block align
        view.setUint16(34, 16, true); // bits per sample
        
        // data sub-chunk
        writeString(view, 36, 'data');
        view.setUint32(40, interleaved.length * 2, true);
        
        // Write the PCM samples
        const volume = 1;
        let index = 44;
        for (let i = 0; i < interleaved.length; i++) {
            view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
            index += 2;
        }
        
        return new Blob([buffer], { type: 'audio/wav' });
    }
    
    // Write a string to a DataView
    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
    
    // Reset all controls to default values
    function resetControls() {
        // Reset effect sliders
        tempoSlider.value = 75;
        tempoValue.textContent = '75%';
        
        reverbSlider.value = 60;
        reverbValue.textContent = '60%';
        
        decaySlider.value = 4;
        decayValue.textContent = '4s';
        
        bassSlider.value = 3;
        bassValue.textContent = '+3dB';
        
        pitchSlider.value = -2;
        pitchValue.textContent = '-2';
        
        // Reset preset selection
        setActiveButton(presetBtns, document.querySelector('.preset-btn[data-preset="classic"]'));
        currentPreset = 'classic';
        
        // Reset audio preview
        setActiveButton([originalAudioBtn, effectAudioBtn], originalAudioBtn);
        isPlayingOriginal = true;
        
        // Reset volume
        volumeSlider.value = 100;
        
        // Reset output format and quality
        outputFormat.value = 'mp3';
        qualitySlider.value = 256;
        qualityValue.textContent = '256 kbps';
        
        // Reset effect parameters
        effectParams = { ...presets.classic };
    }
    
    // Reset the entire tool
    function resetTool() {
        // Stop any playing audio
        if (waveform && audioPlaying) {
            waveform.stop();
            audioPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        
        // Reset variables
        originalAudio = null;
        processedAudio = null;
        audioBuffer = null;
        
        // Reset UI
        uploadSection.style.display = 'block';
        editorSection.style.display = 'none';
        
        // Reset file input
        audioFileInput.value = '';
        
        // Reset controls
        resetControls();
    }
    
    // Set active button in a group
    function setActiveButton(buttons, activeButton) {
        buttons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
    
    // Show loading overlay
    function showLoading(title, message) {
        loadingText.textContent = title || 'Processing...';
        loadingInfo.textContent = message || 'Please wait...';
        progressBar.style.width = '0%';
        loadingOverlay.classList.add('active');
    }
    
    // Hide loading overlay
    function hideLoading() {
        loadingOverlay.classList.remove('active');
    }
    
    // Show notification
    function showNotification(message, duration = 3000) {
        if (lastNotificationTimeout) {
            clearTimeout(lastNotificationTimeout);
        }
        
        notificationMessage.textContent = message;
        notification.classList.add('active');
        
        lastNotificationTimeout = setTimeout(() => {
            notification.classList.remove('active');
        }, duration);
    }
    
    // Initialize the app
    init();
});