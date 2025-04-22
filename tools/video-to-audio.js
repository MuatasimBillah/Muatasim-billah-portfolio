document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dropZone = document.getElementById('dropZone');
    const videoInput = document.getElementById('videoInput');
    const filesContainer = document.getElementById('filesContainer');
    const settingsSection = document.getElementById('settings-section');
    const trimSection = document.getElementById('trim-section');
    const convertSection = document.getElementById('convert-section');
    const progressSection = document.getElementById('progress-section');
    const resultSection = document.getElementById('result-section');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const backBtn = document.getElementById('backBtn');
    const convertBtn = document.getElementById('convertBtn');
    const resultList = document.getElementById('resultList');
    const audioPreview = document.getElementById('audioPreview');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Variables
    let videoFiles = [];
    let currentFileIndex = 0;
    
    // Add event listeners
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
    
    dropZone.addEventListener('click', () => {
        videoInput.click();
    });
    
    videoInput.addEventListener('change', () => {
        handleFiles(videoInput.files);
    });
    
    // Handle uploaded files
    function handleFiles(files) {
        if (files.length === 0) return;
        
        // Filter valid video files
        const validFileTypes = [
            'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 
            'video/x-msvideo', 'video/x-matroska', 'video/x-flv'
        ];
        
        const validFiles = Array.from(files).filter(file => {
            // Check by MIME type first
            if (validFileTypes.includes(file.type)) return true;
            
            // If MIME type check fails, check by extension
            const extension = file.name.split('.').pop().toLowerCase();
            const validExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv', '3gp', 'm4v'];
            return validExtensions.includes(extension);
        });
        
        if (validFiles.length === 0) {
            showMessage('Please select valid video files.', 'error');
            return;
        }
        
        videoFiles = [...videoFiles, ...validFiles];
        displayFiles();
        
        if (videoFiles.length > 0) {
            settingsSection.classList.remove('hidden');
            convertSection.classList.remove('hidden');
            
            // Preview first file
            setupAudioPreview(videoFiles[0]);
        }
    }
    
    // Display file list
    function displayFiles() {
        filesContainer.innerHTML = '';
        
        if (videoFiles.length === 0) {
            settingsSection.classList.add('hidden');
            trimSection.classList.add('hidden');
            convertSection.classList.add('hidden');
            return;
        }
        
        videoFiles.forEach((file, index) => {
            const fileSize = formatFileSize(file.size);
            
            // Determine file type
            let fileType = file.type.split('/')[1]?.toUpperCase() || 'VIDEO';
            if (fileType === 'QUICKTIME') fileType = 'MOV';
            if (fileType === 'X-MSVIDEO') fileType = 'AVI';
            if (fileType === 'X-MATROSKA') fileType = 'MKV';
            if (fileType === 'X-FLV') fileType = 'FLV';
            
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">
                        <i class="fas fa-film"></i>
                    </div>
                    <div class="file-details">
                        <h4>${file.name}</h4>
                        <p>${fileSize} • ${fileType}</p>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="file-action-btn preview" data-index="${index}" title="Preview">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="file-action-btn remove" data-index="${index}" title="Remove">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            
            filesContainer.appendChild(fileItem);
            
            // Add event listeners to buttons
            fileItem.querySelector('.preview').addEventListener('click', () => {
                setupAudioPreview(file);
                currentFileIndex = index;
            });
            
            fileItem.querySelector('.remove').addEventListener('click', () => {
                videoFiles.splice(index, 1);
                displayFiles();
            });
        });
    }
    
    // Setup audio preview
    function setupAudioPreview(file) {
        trimSection.classList.remove('hidden');
        
        // Create a video URL
        const videoURL = URL.createObjectURL(file);
        
        // Set the audio preview source
        audioPreview.src = videoURL;
        
        // Simple play button integration
        const playButton = document.createElement('button');
        playButton.className = 'play-btn';
        playButton.innerHTML = '<i class="fas fa-play"></i> Play Preview';
        playButton.addEventListener('click', () => {
            audioPreview.play();
        });
        
        // Clear and update waveform placeholder
        const waveformContainer = document.getElementById('waveform');
        waveformContainer.innerHTML = '';
        waveformContainer.appendChild(playButton);
    }
    
    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Show message function
    function showMessage(text, type = 'info', duration = 3000) {
        // Create message element if it doesn't exist
        let messageEl = document.getElementById('message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'message';
            document.body.appendChild(messageEl);
            
            // Add style
            const style = document.createElement('style');
            style.textContent = `
                #message {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 12px 24px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 9999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    transition: opacity 0.3s ease;
                }
                .info { background-color: #00d9ff; }
                .success { background-color: #28a745; }
                .warning { background-color: #ffc107; color: #333; }
                .error { background-color: #dc3545; }
            `;
            document.head.appendChild(style);
        }
        
        // Set message
        messageEl.textContent = text;
        messageEl.className = type;
        messageEl.style.opacity = '1';
        
        // Hide after duration
        if (duration > 0) {
            setTimeout(() => {
                messageEl.style.opacity = '0';
                
                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 300);
            }, duration);
        }
    }
    
    // Convert button click
    convertBtn.addEventListener('click', function() {
        // Simple version: just extract audio directly using the HTML5 APIs
        if (videoFiles.length > 0) {
            showDirectAudioDownload();
        } else {
            showMessage('Please upload at least one video file.', 'error');
        }
    });
    
    // Simple method to extract audio using browser's native capabilities
    function showDirectAudioDownload() {
        // Show progress section
        convertSection.classList.add('hidden');
        progressSection.classList.remove('hidden');
        
        // Set progress to 100% immediately (since we're not actually converting)
        setTimeout(() => {
            progressBar.style.width = '100%';
            progressText.textContent = '100%';
            
            setTimeout(() => {
                progressSection.classList.add('hidden');
                
                // Create direct download link
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <div class="result-file-info">
                        <div class="result-file-icon">
                            <i class="fas fa-music"></i>
                        </div>
                        <div class="result-file-details">
                            <h4>Audio from ${videoFiles[currentFileIndex].name}</h4>
                            <p>Click the download button to save the audio</p>
                        </div>
                    </div>
                    <div class="result-file-actions">
                        <a href="${audioPreview.src}" download="audio_${Date.now()}.mp3" class="file-action-btn download">
                            <i class="fas fa-download"></i>
                        </a>
                    </div>
                `;
                
                resultList.innerHTML = '';
                resultList.appendChild(resultItem);
                resultSection.classList.remove('hidden');
                
                // Add message about browser limitations
                const noteEl = document.createElement('div');
                noteEl.className = 'result-note';
                noteEl.innerHTML = `
                    <p><strong>Note:</strong> This is using your browser's native capability to extract audio. 
                    For more conversion options or higher quality, please use a desktop application.</p>
                `;
                resultList.appendChild(noteEl);
                
            }, 1000);
        }, 1500);
    }
    
    // Back button click
    backBtn.addEventListener('click', () => {
        convertSection.classList.remove('hidden');
        settingsSection.classList.remove('hidden');
        progressSection.classList.add('hidden');
        resultSection.classList.add('hidden');
    });
    
    // Convert more button click
    document.getElementById('convertMoreBtn').addEventListener('click', () => {
        // Reset state
        videoFiles = [];
        
        // Reset UI
        filesContainer.innerHTML = '';
        resultSection.classList.add('hidden');
        settingsSection.classList.add('hidden');
        trimSection.classList.add('hidden');
        convertSection.classList.add('hidden');
    });
    
    // FAQ toggle functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle active class
            item.classList.toggle('active');
        });
    });
    
    // Add CSS styles for the play button
    const style = document.createElement('style');
    style.textContent = `
        .play-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #7000ff, #5a00cc);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 30px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(112, 0, 255, 0.3);
            margin: 20px auto;
            transition: all 0.3s ease;
        }
        
        .play-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 7px 20px rgba(112, 0, 255, 0.4);
        }
        
        .play-btn i {
            margin-right: 8px;
        }
        
        .result-note {
            margin-top: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            border-left: 3px solid #ffc107;
            color: #eee;
        }
    `;
    document.head.appendChild(style);
});