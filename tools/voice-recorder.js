document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const pauseButton = document.getElementById('pauseButton');
    const resumeButton = document.getElementById('resumeButton');
    const recordingsContainer = document.getElementById('recordings-container');
    const recordingsTitle = document.getElementById('recordings-title');
    const visualizer = document.getElementById('visualizer');
    const recordingTime = document.getElementById('recording-time');
    const instructions = document.getElementById('instructions');
    
    // Canvas context for visualizer
    const canvasCtx = visualizer.getContext('2d');
    
    // Variables
    let mediaRecorder;
    let audioChunks = [];
    let audioStream;
    let audioContext;
    let audioSource;
    let analyser;
    let recordingInterval;
    let recordingDuration = 0;
    let isPaused = false;
    let recordingNumber = 1;
    
    // Check if the browser supports the required APIs
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert('Your browser does not support audio recording. Please try a modern browser like Chrome or Firefox.');
      recordButton.disabled = true;
      return;
    }
    
    // Initialize audio visualization
    function initAudioVisualization(stream) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioSource = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      audioSource.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Clear canvas
      canvasCtx.clearRect(0, 0, visualizer.width, visualizer.height);
      
      // Draw visualization
      function draw() {
        requestAnimationFrame(draw);
        
        analyser.getByteFrequencyData(dataArray);
        
        canvasCtx.fillStyle = 'rgb(18, 18, 31)';
        canvasCtx.fillRect(0, 0, visualizer.width, visualizer.height);
        
        const barWidth = (visualizer.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;
          
          // Use gradient with primary color
          const gradient = canvasCtx.createLinearGradient(0, 0, 0, visualizer.height);
          gradient.addColorStop(0, '#7000ff');
          gradient.addColorStop(1, '#00d9ff');
          
          canvasCtx.fillStyle = gradient;
          canvasCtx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
          
          x += barWidth + 1;
        }
      }
      
      draw();
    }
    
    // Format time (mm:ss)
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      seconds = Math.floor(seconds % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Update recording time display
    function updateRecordingTime() {
      recordingInterval = setInterval(() => {
        if (!isPaused) {
          recordingDuration++;
          recordingTime.textContent = formatTime(recordingDuration);
        }
      }, 1000);
    }
    
    // Start recording
    recordButton.addEventListener('click', function() {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          audioStream = stream;
          
          // Initialize media recorder
          mediaRecorder = new MediaRecorder(stream);
          
          // Collect audio chunks
          mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
          });
          
          // Handle recording stop
          mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            addRecordingToList(audioBlob);
            
            // Reset recording
            audioChunks = [];
            recordingDuration = 0;
            recordingTime.textContent = '00:00';
            clearInterval(recordingInterval);
            
            // Stop all tracks on the stream
            audioStream.getTracks().forEach(track => track.stop());
          });
          
          // Start recording
          audioChunks = [];
          mediaRecorder.start();
          
          // Initialize visualization
          initAudioVisualization(stream);
          
          // Update UI
          recordButton.classList.add('hidden');
          stopButton.classList.remove('hidden');
          pauseButton.classList.remove('hidden');
          instructions.classList.add('hidden');
          
          // Start timer
          updateRecordingTime();
        })
        .catch(error => {
          console.error('Error accessing the microphone:', error);
          alert('Error accessing the microphone. Please ensure you have granted permission to use the microphone.');
        });
    });
    
    // Pause recording
    pauseButton.addEventListener('click', function() {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.pause();
        isPaused = true;
        
        // Update UI
        pauseButton.classList.add('hidden');
        resumeButton.classList.remove('hidden');
      }
    });
    
    // Resume recording
    resumeButton.addEventListener('click', function() {
      if (mediaRecorder && mediaRecorder.state === 'paused') {
        mediaRecorder.resume();
        isPaused = false;
        
        // Update UI
        resumeButton.classList.add('hidden');
        pauseButton.classList.remove('hidden');
      }
    });
    
    // Stop recording
    stopButton.addEventListener('click', function() {
      if (mediaRecorder) {
        mediaRecorder.stop();
        
        // Update UI
        stopButton.classList.add('hidden');
        pauseButton.classList.add('hidden');
        resumeButton.classList.add('hidden');
        recordButton.classList.remove('hidden');
      }
    });
    
    // Add recording to the list
    function addRecordingToList(blob) {
      const url = URL.createObjectURL(blob);
      const recordingName = `Recording ${recordingNumber}`;
      recordingNumber++;
      
      // Show recordings title
      recordingsTitle.classList.remove('hidden');
      
      // Create recording item
      const recordingItem = document.createElement('div');
      recordingItem.className = 'audio-item';
      
      // HTML for recording item
      recordingItem.innerHTML = `
        <div class="audio-info">
          <i class="fas fa-file-audio"></i>
          <span>${recordingName}</span>
        </div>
        <div class="audio-player">
          <audio controls src="${url}"></audio>
        </div>
        <div class="audio-actions">
          <button class="btn-action download" title="Download recording">
            <i class="fas fa-download"></i>
          </button>
          <button class="btn-action delete" title="Delete recording">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
      
      // Add event listeners
      const downloadButton = recordingItem.querySelector('.download');
      const deleteButton = recordingItem.querySelector('.delete');
      
      // Download recording
      downloadButton.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${recordingName}.wav`;
        a.click();
      });
      
      // Delete recording
      deleteButton.addEventListener('click', () => {
        recordingItem.remove();
        URL.revokeObjectURL(url);
        
        // Hide title if no recordings left
        if (recordingsContainer.children.length === 0) {
          recordingsTitle.classList.add('hidden');
        }
      });
      
      // Add to container
      recordingsContainer.appendChild(recordingItem);
    }
  });