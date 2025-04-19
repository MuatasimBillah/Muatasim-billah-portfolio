/**
 * Voice Recorder Tool
 * A browser-based audio recording tool with real-time visualization
 * Features: recording, pausing, visualization, playback, and download
 */
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const recordButton = document.getElementById('recordButton');
  const stopButton = document.getElementById('stopButton');
  const pauseButton = document.getElementById('pauseButton');
  const resumeButton = document.getElementById('resumeButton');
  const visualizer = document.getElementById('visualizer');
  const recordingTime = document.getElementById('recording-time');
  const recordingsContainer = document.getElementById('recordings-container');
  const recordingsTitle = document.getElementById('recordings-title');
  const notificationToast = document.getElementById('notification-toast');
  const notificationText = document.getElementById('notification-text');
  const notificationIcon = document.getElementById('notification-icon');
  const notificationClose = document.getElementById('notification-close');
  
  // Audio Context and Analyzer
  let audioContext;
  let analyser;
  let microphone;
  let processor;
  let mediaRecorder;
  let audioChunks = [];
  let startTime;
  let elapsedTime = 0;
  let timerInterval;
  let isPaused = false;
  let recordings = [];
  let canvasContext = visualizer.getContext('2d');
  
  // Check Browser Compatibility
  function checkBrowserCompatibility() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showNotification('Your browser does not support audio recording. Please use Chrome, Firefox, or Edge.', 'error');
      recordButton.disabled = true;
      return false;
    }
    return true;
  }
  
  // Set up canvas for visualization
  function setupCanvas() {
    visualizer.width = visualizer.offsetWidth;
    visualizer.height = visualizer.offsetHeight;
    
    // Fill with gradient background
    const gradient = canvasContext.createLinearGradient(0, 0, 0, visualizer.height);
    gradient.addColorStop(0, 'rgba(154, 78, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 217, 255, 0.1)');
    
    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(0, 0, visualizer.width, visualizer.height);
  }
  
  // Start recording
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create audio context and analyzer
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);
      
      // Connect microphone to analyzer
      microphone.connect(analyser);
      
      // Set up analyzer
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Create media recorder
      mediaRecorder = new MediaRecorder(stream);
      
      // Start recording
      mediaRecorder.start();
      
      // Event listener for data available
      mediaRecorder.ondataavailable = function(event) {
        audioChunks.push(event.data);
      };
      
      // Start timer
      startTime = Date.now() - elapsedTime;
      timerInterval = setInterval(updateTimer, 100);
      
      // Start visualization
      visualize();
      
      // Show active recording UI
      recordButton.classList.add('hidden');
      stopButton.classList.remove('hidden');
      pauseButton.classList.remove('hidden');
      
      showNotification('Recording started. Speak into your microphone.', 'info');
      
      // Visualization function
      function visualize() {
        if (!audioContext) return;
        
        // Get canvas dimensions
        const width = visualizer.width;
        const height = visualizer.height;
        
        // Create animation frame
        const draw = function() {
          // Exit if recording stopped
          if (!audioContext) return;
          
          // Request next animation frame
          requestAnimationFrame(draw);
          
          // Get frequency data
          analyser.getByteTimeDomainData(dataArray);
          
          // Clear canvas
          canvasContext.clearRect(0, 0, width, height);
          
          // Draw background
          canvasContext.fillStyle = 'rgba(22, 22, 31, 0.5)';
          canvasContext.fillRect(0, 0, width, height);
          
          // Draw waveform
          canvasContext.lineWidth = 2;
          canvasContext.strokeStyle = 'rgb(154, 78, 255)';
          canvasContext.beginPath();
          
          const sliceWidth = width / bufferLength;
          let x = 0;
          
          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * height / 2;
            
            if (i === 0) {
              canvasContext.moveTo(x, y);
            } else {
              canvasContext.lineTo(x, y);
            }
            
            x += sliceWidth;
          }
          
          canvasContext.lineTo(width, height / 2);
          canvasContext.stroke();
        };
        
        draw();
      }
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      showNotification('Could not access your microphone. Please allow microphone access and try again.', 'error');
    }
  }
  
  // Stop recording
  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      
      // Stop timer
      clearInterval(timerInterval);
      
      // Show stop recording UI
      stopButton.classList.add('hidden');
      pauseButton.classList.add('hidden');
      resumeButton.classList.add('hidden');
      recordButton.classList.remove('hidden');
      
      // Clear audio context
      if (microphone) microphone.disconnect();
      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }
      
      // Save recording
      mediaRecorder.onstop = function() {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Create recording object
        const recording = {
          id: Date.now(),
          name: `Recording ${recordings.length + 1}`,
          url: audioUrl,
          blob: audioBlob,
          duration: elapsedTime,
          date: new Date().toISOString()
        };
        
        // Add to recordings array
        recordings.push(recording);
        
        // Save to local storage
        saveRecordingsToStorage();
        
        // Add to UI
        addRecordingToList(recording);
        
        // Reset recording data
        audioChunks = [];
        elapsedTime = 0;
        recordingTime.textContent = '00:00';
        
        showNotification('Recording saved successfully!', 'success');
      };
    }
  }
  
  // Pause recording
  function pauseRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      
      // Pause timer
      clearInterval(timerInterval);
      elapsedTime = Date.now() - startTime;
      
      // Update UI
      pauseButton.classList.add('hidden');
      resumeButton.classList.remove('hidden');
      
      isPaused = true;
      
      showNotification('Recording paused. Click resume to continue.', 'info');
    }
  }
  
  // Resume recording
  function resumeRecording() {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      
      // Resume timer
      startTime = Date.now() - elapsedTime;
      timerInterval = setInterval(updateTimer, 100);
      
      // Update UI
      resumeButton.classList.add('hidden');
      pauseButton.classList.remove('hidden');
      
      isPaused = false;
      
      showNotification('Recording resumed.', 'info');
    }
  }
  
  // Update timer
  function updateTimer() {
    elapsedTime = Date.now() - startTime;
    const formattedTime = formatTime(elapsedTime);
    recordingTime.textContent = formattedTime;
  }
  
  // Format time (milliseconds to mm:ss)
  function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  // Add recording to list
  function addRecordingToList(recording) {
    // Show recordings title if first recording
    if (recordings.length === 1) {
      recordingsTitle.classList.remove('hidden');
    }
    
    // Create recording item
    const item = document.createElement('div');
    item.className = 'recording-item';
    item.dataset.id = recording.id;
    
    // Format date
    const date = new Date(recording.date);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    
    item.innerHTML = `
      <div class="recording-info">
        <div class="recording-icon">
          <i class="fas fa-microphone"></i>
        </div>
        <div class="recording-details">
          <div class="recording-name">${recording.name}</div>
          <div class="recording-meta">
            ${formatTime(recording.duration)} • ${formattedDate}
          </div>
        </div>
      </div>
      <div class="recording-actions">
        <button class="play-btn" aria-label="Play recording">
          <i class="fas fa-play"></i>
        </button>
        <button class="download-btn" aria-label="Download recording">
          <i class="fas fa-download"></i>
        </button>
        <button class="rename-btn" aria-label="Rename recording">
          <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn" aria-label="Delete recording">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    // Add to container
    recordingsContainer.prepend(item);
    
    // Add event listeners
    const playBtn = item.querySelector('.play-btn');
    const downloadBtn = item.querySelector('.download-btn');
    const renameBtn = item.querySelector('.rename-btn');
    const deleteBtn = item.querySelector('.delete-btn');
    
    // Play button
    playBtn.addEventListener('click', function() {
      playRecording(recording);
      
      // Toggle icon
      const icon = this.querySelector('i');
      if (icon.classList.contains('fa-play')) {
        // Reset all icons first
        document.querySelectorAll('.play-btn i').forEach(i => {
          i.classList.remove('fa-stop');
          i.classList.add('fa-play');
        });
        
        // Set this to stop
        icon.classList.remove('fa-play');
        icon.classList.add('fa-stop');
      } else {
        icon.classList.remove('fa-stop');
        icon.classList.add('fa-play');
        stopPlayback();
      }
    });
    
    // Download button
    downloadBtn.addEventListener('click', function() {
      downloadRecording(recording);
    });
    
    // Rename button
    renameBtn.addEventListener('click', function() {
      renameRecording(recording, item);
    });
    
    // Delete button
    deleteBtn.addEventListener('click', function() {
      deleteRecording(recording, item);
    });
  }
  
  // Play recording
  let currentAudio = null;
  
  function playRecording(recording) {
    // Stop current playback if any
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
      
      // Reset all play buttons
      document.querySelectorAll('.play-btn i').forEach(i => {
        i.classList.remove('fa-stop');
        i.classList.add('fa-play');
      });
    }
    
    // Create audio element
    const audio = new Audio(recording.url);
    currentAudio = audio;
    
    // Play
    audio.play();
    
    // Add ended event listener
    audio.addEventListener('ended', function() {
      // Reset button
      const item = document.querySelector(`.recording-item[data-id="${recording.id}"]`);
      const playBtn = item.querySelector('.play-btn i');
      playBtn.classList.remove('fa-stop');
      playBtn.classList.add('fa-play');
      
      currentAudio = null;
    });
  }
  
  // Stop playback
  function stopPlayback() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
  }
  
  // Download recording
  function downloadRecording(recording) {
    const a = document.createElement('a');
    a.href = recording.url;
    a.download = `${recording.name}.wav`;
    a.click();
    
    showNotification('Recording downloaded successfully!', 'success');
  }
  
  // Rename recording
  function renameRecording(recording, item) {
    const newName = prompt('Enter a new name for the recording:', recording.name);
    
    if (newName && newName.trim() !== '') {
      // Update recording object
      recording.name = newName.trim();
      
      // Update UI
      const nameElement = item.querySelector('.recording-name');
      nameElement.textContent = recording.name;
      
      // Save to storage
      saveRecordingsToStorage();
      
      showNotification('Recording renamed successfully!', 'success');
    }
  }
  
  // Delete recording
  function deleteRecording(recording, item) {
    if (confirm('Are you sure you want to delete this recording?')) {
      // Remove from array
      const index = recordings.findIndex(r => r.id === recording.id);
      if (index !== -1) {
        recordings.splice(index, 1);
      }
      
      // Remove from UI
      item.remove();
      
      // Save to storage
      saveRecordingsToStorage();
      
      // Hide title if no recordings
      if (recordings.length === 0) {
        recordingsTitle.classList.add('hidden');
      }
      
      // Revoke URL
      URL.revokeObjectURL(recording.url);
      
      showNotification('Recording deleted successfully!', 'success');
    }
  }
  
  // Save recordings to local storage
  function saveRecordingsToStorage() {
    // We can't store Blob objects in localStorage, so we'll just save metadata
    const metadataArray = recordings.map(recording => {
      return {
        id: recording.id,
        name: recording.name,
        duration: recording.duration,
        date: recording.date
      };
    });
    
    try {
      localStorage.setItem('voice-recordings-metadata', JSON.stringify(metadataArray));
    } catch (error) {
      console.error('Error saving recordings to localStorage:', error);
    }
  }
  
  // Load recordings from local storage
  function loadRecordingsFromStorage() {
    try {
      const metadata = localStorage.getItem('voice-recordings-metadata');
      
      if (metadata) {
        return JSON.parse(metadata);
      }
    } catch (error) {
      console.error('Error loading recordings from localStorage:', error);
    }
    
    return [];
  }
  
  // Show notification
  function showNotification(message, type = 'info') {
    notificationText.textContent = message;
    
    // Set icon based on type
    notificationIcon.className = 'fas';
    
    switch (type) {
      case 'success':
        notificationIcon.classList.add('fa-check-circle');
        break;
      case 'error':
        notificationIcon.classList.add('fa-times-circle');
        break;
      case 'warning':
        notificationIcon.classList.add('fa-exclamation-circle');
        break;
      default:
        notificationIcon.classList.add('fa-info-circle');
    }
    
    // Show toast
    notificationToast.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      notificationToast.classList.remove('show');
    }, 5000);
  }
  
  // Initialize app
  function init() {
    // Check browser compatibility
    if (!checkBrowserCompatibility()) return;
    
    // Set up canvas
    setupCanvas();
    
    // Set up event listeners
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    pauseButton.addEventListener('click', pauseRecording);
    resumeButton.addEventListener('click', resumeRecording);
    notificationClose.addEventListener('click', () => {
      notificationToast.classList.remove('show');
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      setupCanvas();
    });
    
    // Load previous recordings (note: we can't restore the actual audio data on page reload)
    const savedMetadata = loadRecordingsFromStorage();
    
    if (savedMetadata && savedMetadata.length > 0) {
      showNotification('Previous recording metadata loaded. Audio content cannot be restored after page reload.', 'info');
      recordingsTitle.classList.remove('hidden');
      
      savedMetadata.forEach(meta => {
        // Create a placeholder item
        const item = document.createElement('div');
        item.className = 'recording-item';
        item.dataset.id = meta.id;
        
        // Format date
        const date = new Date(meta.date);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        item.innerHTML = `
          <div class="recording-info">
            <div class="recording-icon">
              <i class="fas fa-microphone"></i>
            </div>
            <div class="recording-details">
              <div class="recording-name">${meta.name}</div>
              <div class="recording-meta">
                ${formatTime(meta.duration)} • ${formattedDate}
              </div>
            </div>
          </div>
          <div class="recording-actions">
            <button class="play-btn disabled" aria-label="Play recording" disabled>
              <i class="fas fa-play"></i>
            </button>
            <button class="download-btn disabled" aria-label="Download recording" disabled>
              <i class="fas fa-download"></i>
            </button>
            <button class="rename-btn disabled" aria-label="Rename recording" disabled>
              <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" aria-label="Delete recording">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
        
        // Add to container
        recordingsContainer.prepend(item);
        
        // Add delete event listener
        const deleteBtn = item.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
          if (confirm('Are you sure you want to delete this recording?')) {
            // Remove from metadata array
            const index = savedMetadata.findIndex(r => r.id === meta.id);
            if (index !== -1) {
              savedMetadata.splice(index, 1);
            }
            
            // Remove from UI
            item.remove();
            
            // Save to storage
            localStorage.setItem('voice-recordings-metadata', JSON.stringify(savedMetadata));
            
            // Hide title if no recordings
            if (savedMetadata.length === 0) {
              recordingsTitle.classList.add('hidden');
            }
            
            showNotification('Recording deleted successfully!', 'success');
          }
        });
      });
    }
    
    // Show intro notification
    setTimeout(() => {
      showNotification('Welcome! Click the record button to start recording your voice.', 'info');
    }, 1000);
  }
  
  // Initialize the app
  init();
});