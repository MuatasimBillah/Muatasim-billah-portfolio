// Portfolio Chatbot with Enhanced Knowledge Base, Advanced Conversation, Emojis and Dark/Light Mode
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotContainer = document.getElementById('chatbot-container');
  const closeButton = document.getElementById('close-chatbot');
  const messagesContainer = document.getElementById('chatbot-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const typingIndicator = document.getElementById('typing-indicator');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Portfolio URLs - FIXED with correct paths based on project folder structure
  const portfolioURLs = {
    // Main pages
    home: 'index.html',
    about: 'index.html#about',
    skills: 'index.html#skills',
    projects: 'index.html#projects',
    services: 'index.html#services',
    testimonials: 'index.html#testimonials',
    contact: 'index.html#contact',
    blog: 'blog/index.html',
    tools: 'tools.html',
    pricing: 'index.html#pricing',
    
    // Service pages - FIXED paths using the projects folder
    webDevelopment: 'projects/web-development.html',
    shopify: 'projects/ecommerce-redesign.html',
    audioEngineering: 'projects/audio-engineering.html',
    aiVoice: 'projects/ai-voice.html',
    aiAvatar: 'projects/ai-avatar.html',
    graphicDesign: 'projects/graphic-design.html',
    
    // Tool pages
    pdfToWord: 'tools/pdf-to-word.html',
    videoToAudio: 'tools/video-to-audio.html',
    barcodeGenerator: 'tools/barcode-generator.html',
    qrGenerator: 'tools/qr-generator.html',
    jpgToPdf: 'tools/jpg-to-pdf.html',
    pdfToJpg: 'tools/pdf-to-jpg.html',
    imageCompressor: 'tools/image-compressor.html',
    voiceRecorder: 'tools/voice-recorder.html',
    colorPalette: 'tools/color-palette.html',
    audioCutter: 'tools/audio-cutter.html',
    slowReverb: 'tools/slow-reverb.html',
    imageEffects: 'tools/image-effects.html',
    
    // Blog articles
    blogHome: 'blog/index.html',
    webDevelopmentBlog: 'blog/web-development.html',
    shopifyBlog: 'blog/shopify-tips.html',
    audioEngineeringBlog: 'blog/audio-engineering.html',
    aiServicesBlog: 'blog/ai-services.html'
  };
  
  // Enhanced Conversation System
  let conversationContext = {
    lastIntent: '',
    userName: '',
    userInterests: [],
    questionCount: 0,
    greetedUser: false
  };
  
  // Comprehensive Knowledge Base with Enhanced Personal Interactions & Emojis
  const knowledgeBase = {
    greeting: [
      "👋 Hello! I'm Muatasim's portfolio assistant. How can I help you today?",
      "👋 Hi there! Welcome to Muatasim Billah's portfolio. What would you like to know about my work?",
      "🙌 Welcome! I'm here to tell you about Muatasim Billah's services and skills. What are you interested in?"
    ],

    // Personal interaction responses
    personal: [
      "🤖 I'm an AI assistant created by Muatasim Billah to help you learn about his portfolio, services, and tools. How can I assist you today?",
      "🚀 I was designed by Muatasim Billah to provide detailed information about his work and services. What would you like to know?"
    ],
    
    aboutCreator: [
      "👨‍💻 I was created by Muatasim Billah to help visitors like you explore his portfolio and services. He's a multidisciplinary professional specializing in web development, e-commerce, audio engineering, AI services, and graphic design.",
      "🛠️ Muatasim Billah built me to provide helpful information about his work and services. He's a skilled professional in various digital domains including web development, Shopify design, AI services, and more."
    ],
    
    botIdentity: [
      "🤖 I'm a specialized AI assistant for Muatasim Billah's portfolio. I can tell you about his services, tools, projects, and more. How can I help you today?",
      "💬 I'm a portfolio assistant designed to showcase Muatasim Billah's work and services. I'd be happy to answer questions about his expertise and offerings!"
    ],

    feeling: [
      "😊 I'm doing well, thanks for asking! I'm here and ready to help you learn about Muatasim Billah's services and portfolio. What can I help you with today?",
      "⚡ I'm functioning perfectly! Ready to assist you with information about Muatasim's work. Is there something specific you'd like to know?",
      "😎 I'm great! Always happy to chat about Muatasim's portfolio and services. What brings you here today?"
    ],
    
    thanks: [
      "🙏 You're welcome! If you have any other questions about Muatasim's services or portfolio, I'm here to help.",
      "✨ Happy to help! Don't hesitate to ask if you need more information about anything else.",
      "😊 My pleasure! I'm here anytime you want to know more about Muatasim's work."
    ],
    
    funny: [
      "😄 I don't tell jokes, but I can tell you about some amazing web development and AI services that might make you smile!",
      "🤔 My humor circuit is still in development, but I'm excellent at providing information about Muatasim's portfolio. What would you like to know?",
      "😉 Instead of jokes, I specialize in providing detailed information about services that can help your business grow. Would you like to know more?"
    ],
    
    compliment: [
      "☺️ Thank you for the kind words! I'm designed to provide the best information about Muatasim's services. Is there something specific you'd like to know?",
      "🌟 That's very kind of you to say! I'm constantly learning to better assist with information about Muatasim's portfolio. How can I help you today?",
      "💖 You're too kind! I'm just doing my job to help you learn about Muatasim's work. What can I help you with?"
    ],
    
    goodbye: [
      "👋 Goodbye! Feel free to come back if you have more questions about Muatasim's services or portfolio.",
      "✌️ Take care! Don't hesitate to return when you need information about Muatasim's work.",
      "👋 Until next time! Remember, I'm always here to help with information about Muatasim's portfolio and services."
    ],
    
    creatorPhoto: [
      "<b>About Muatasim Billah</b> 👨‍💻<br><br>" +
      "<img src='images/chatbot avatar.png' alt='Muatasim Billah' class='creator-photo'><br><br>" +
      "Muatasim Billah is a multidisciplinary professional with expertise in web development, e-commerce, audio engineering, AI services, and graphic design. With years of experience across multiple domains, he delivers creative solutions for businesses and individuals seeking to establish or enhance their digital presence.<br><br>" +
      "Learn more about Muatasim here: <a href='" + portfolioURLs.about + "' target='_blank'>About Muatasim</a>"
    ],
    
    bossLook: [
      "👑 Here's the boss! <br><br>" +
      "<img src='images/chatbot avatar.png' alt='Muatasim Billah' class='creator-photo'><br><br>" +
      "The one and only Muatasim Billah! 🌟 With superpowers in web development, e-commerce, audio engineering, and more! Think of him as the digital Swiss Army knife - multitalented and always ready to solve problems! 😎"
    ],
    
    about: [
      "<b>About Muatasim Billah</b> 👨‍💻<br><br>" +
      "Muatasim Billah is a multidisciplinary professional with expertise in:<br><br>" +
      "• Web Development 🌐<br>" +
      "• E-commerce & Shopify Design 🛍️<br>" +
      "• Audio Engineering 🎵<br>" +
      "• AI Voice & Avatar Services 🤖<br>" +
      "• Graphic Design 🎨<br><br>" +
      "With years of experience across multiple domains, Muatasim delivers creative solutions for businesses and individuals seeking to establish or enhance their digital presence.<br><br>" +
      "His approach combines technical expertise with aesthetic sensibility, ensuring each project not only functions flawlessly but also captures the unique identity of the client's brand.<br><br>" +
      "Learn more about Muatasim here: <a href='" + portfolioURLs.about + "' target='_blank'>About Muatasim</a>"
    ],
    
    services: [
      "<b>Services Offered by Muatasim Billah</b> 🚀<br><br>" +
      "Muatasim provides a comprehensive range of digital services to help businesses and individuals establish a strong online presence:<br><br>" +
      "• <a href='" + portfolioURLs.webDevelopment + "' target='_blank'>Web Development</a> 🌐 - Custom websites with modern design and functionality<br><br>" +
      "• <a href='" + portfolioURLs.shopify + "' target='_blank'>Shopify/E-commerce</a> 🛍️ - Online store creation and optimization<br><br>" +
      "• <a href='" + portfolioURLs.audioEngineering + "' target='_blank'>Audio Engineering</a> 🎵 - Professional sound design and music production<br><br>" +
      "• <a href='" + portfolioURLs.aiVoice + "' target='_blank'>AI Voiceover</a> 🎤 - Custom AI-generated voice content<br><br>" +
      "• <a href='" + portfolioURLs.aiAvatar + "' target='_blank'>AI Avatar Creation</a> 👤 - Digital humans for videos and presentations<br><br>" +
      "• <a href='" + portfolioURLs.graphicDesign + "' target='_blank'>Graphic Design</a> 🎨 - Visual content for marketing and branding<br><br>" +
      "Each service is tailored to meet your specific needs and objectives. Which service would you like to know more about?"
    ],
    
    webDevelopment: [
      "<b>Web Development Services</b> 🌐<br><br>" +
      "Muatasim provides expert web development services focused on creating responsive, modern, and engaging websites that deliver exceptional user experiences.<br><br>" +
      "<b>Services include:</b><br><br>" +
      "• <b>Responsive Website Design</b> 📱 - Websites that look great on all devices<br>" +
      "• <b>Interactive UI/UX</b> ✨ - Engaging user interfaces with smooth interactions<br>" +
      "• <b>GSAP Animations</b> 🎭 - Advanced animations for visual impact<br>" +
      "• <b>Performance Optimization</b> ⚡ - Fast-loading, efficient websites<br>" +
      "• <b>SEO-Friendly Structure</b> 🔍 - Sites built for better search engine rankings<br>" +
      "• <b>Custom Web Applications</b> 🛠️ - Tailored functionality for specific needs<br><br>" +
      "<b>Technologies used:</b><br>" +
      "HTML5, CSS3, JavaScript, React, GSAP, Bootstrap, Tailwind CSS<br><br>" +
      "All websites are built with a mobile-first approach, ensuring they function perfectly across all devices and screen sizes.<br><br>" +
      "Learn more about web development services: <a href='" + portfolioURLs.webDevelopment + "' target='_blank'>Web Development</a>"
    ],
    
    shopify: [
      "<b>Shopify & E-commerce Services</b> 🛍️<br><br>" +
      "Muatasim specializes in creating and optimizing Shopify stores that not only look professional but also convert visitors into customers.<br><br>" +
      "<b>Services include:</b><br><br>" +
      "• <b>Custom Theme Development</b> 🎨 - Unique store designs that stand out<br>" +
      "• <b>Store Setup & Configuration</b> 🔧 - Complete store setup from scratch<br>" +
      "• <b>Performance Optimization</b> ⚡ - Speed enhancements for better user experience<br>" +
      "• <b>Conversion Rate Optimization</b> 📈 - Strategic improvements to increase sales<br>" +
      "• <b>Product Page Enhancement</b> 🖼️ - Compelling product presentations<br>" +
      "• <b>Payment Gateway Integration</b> 💳 - Secure, reliable payment processing<br><br>" +
      "<b>E-commerce expertise extends to:</b><br>" +
      "• Product strategy<br>" +
      "• Visual merchandising<br>" +
      "• Customer journey optimization<br>" +
      "• Mobile shopping experience<br><br>" +
      "Each store is built with scalability in mind, allowing your business to grow without technical limitations.<br><br>" +
      "Discover Shopify services: <a href='" + portfolioURLs.shopify + "' target='_blank'>Shopify Development</a>"
    ],
    
    audioEngineering: [
      "<b>Audio Engineering Services</b> 🎵<br><br>" +
      "Muatasim offers professional audio engineering services that transform raw recordings into polished, broadcast-ready sound.<br><br>" +
      "<b>Services include:</b><br><br>" +
      "• <b>Mixing & Mastering</b> 🎚️ - Professional balancing and enhancement of audio elements<br>" +
      "• <b>Sound Design</b> 🔊 - Custom sound creation for various media<br>" +
      "• <b>Podcast Production</b> 🎙️ - Complete audio solutions for podcasters<br>" +
      "• <b>Audio Restoration</b> 🧹 - Cleaning and enhancing damaged or noisy recordings<br>" +
      "• <b>Music Production</b> 🎼 - Creating original compositions and beats<br>" +
      "• <b>Voice Processing</b> 🗣️ - Vocal enhancement and character development<br><br>" +
      "<b>Equipment and techniques:</b><br>" +
      "• Professional DAWs (Pro Tools, Logic Pro, FL Studio)<br>" +
      "• High-quality plugins (Waves, Fab Filter, iZotope)<br>" +
      "• Industry-standard processing chains<br><br>" +
      "All projects receive meticulous attention to detail, ensuring the final product meets the highest standards of audio quality.<br><br>" +
      "Learn more about audio services: <a href='" + portfolioURLs.audioEngineering + "' target='_blank'>Audio Engineering</a>"
    ],
    
    aiVoice: [
      "<b>AI Voiceover Services</b> 🎤<br><br>" +
      "Muatasim provides cutting-edge AI voiceover creation services, generating realistic human-like voices for various applications.<br><br>" +
      "<b>Services include:</b><br><br>" +
      "• <b>Custom AI Voice Generation</b> 🤖 - Tailored voices for your specific needs<br>" +
      "• <b>Commercial Voiceovers</b> 📢 - Professional narration for advertisements<br>" +
      "• <b>Explainer Videos</b> 📹 - Clear, engaging narration for instructional content<br>" +
      "• <b>IVR Systems</b> ☎️ - Voice prompts for phone systems<br>" +
      "• <b>Audiobooks & Narration</b> 📚 - Long-form content with consistent delivery<br>" +
      "• <b>Multi-language Options</b> 🌍 - Voices available in multiple languages<br><br>" +
      "<b>Benefits:</b><br>" +
      "• Cost-effective alternative to hiring voice talent<br>" +
      "• Quick turnaround times<br>" +
      "• Consistent quality across all content<br>" +
      "• Easy revisions without re-recording<br><br>" +
      "All AI voices are carefully selected and fine-tuned to match your brand identity and communication style.<br><br>" +
      "Discover AI voice services: <a href='" + portfolioURLs.aiVoice + "' target='_blank'>AI Voiceover</a>"
    ],
    
    aiAvatar: [
      "<b>AI Talking Avatar Services</b> 👤<br><br>" +
      "Muatasim creates lifelike digital humans that can represent your brand, deliver presentations, or enhance your video content.<br><br>" +
      "<b>Services include:</b><br><br>" +
      "• <b>Digital Humans for Videos</b> 📹 - Realistic avatars for video content<br>" +
      "• <b>Virtual Presenters</b> 👨‍💼 - Professional speakers for presentations<br>" +
      "• <b>Marketing Materials</b> 📊 - Engaging spokespersons for promotions<br>" +
      "• <b>Customized Avatar Appearances</b> 🎭 - Personalized looks to match your brand<br>" +
      "• <b>Multilingual Capabilities</b> 🌐 - Avatars that speak multiple languages<br>" +
      "• <b>Emotion Settings</b> 😀 - Various emotional expressions for different contexts<br><br>" +
      "<b>Applications:</b><br>" +
      "• Corporate training videos<br>" +
      "• Product demonstrations<br>" +
      "• Customer service representatives<br>" +
      "• Educational content<br>" +
      "• Social media personalities<br><br>" +
      "These avatars provide consistent brand representation while reducing production costs and streamlining content creation.<br><br>" +
      "Learn more about AI avatars: <a href='" + portfolioURLs.aiAvatar + "' target='_blank'>AI Avatar Creation</a>"
    ],
    
    graphicDesign: [
      "<b>Graphic Design Services</b> 🎨<br><br>" +
      "Muatasim offers expert graphic design services with a specialization in Canva design for businesses and individuals.<br><br>" +
      "<b>Services include:</b><br><br>" +
      "• <b>Social Media Graphics</b> 📱 - Eye-catching visuals for all platforms<br>" +
      "• <b>Marketing Materials</b> 📑 - Promotional designs that convert<br>" +
      "• <b>Presentations</b> 📊 - Professional slides that impress audiences<br>" +
      "• <b>Branding Packages</b> 🏷️ - Consistent visual identity elements<br>" +
      "• <b>Print Materials</b> 🖨️ - Designs optimized for physical production<br>" +
      "• <b>Custom Templates</b> 📝 - Reusable designs for ongoing content<br><br>" +
      "<b>Design approach:</b><br>" +
      "• Focus on visual hierarchy<br>" +
      "• Strategic use of color psychology<br>" +
      "• Typography combinations that enhance readability<br>" +
      "• Balanced compositions for maximum impact<br><br>" +
      "All designs are created with your brand guidelines in mind, ensuring consistent visual communication across all materials.<br><br>" +
      "Explore graphic design services: <a href='" + portfolioURLs.graphicDesign + "' target='_blank'>Graphic Design</a>"
    ],
    
    tools: [
      "<b>Free Online Tools</b> 🛠️<br><br>" +
      "Muatasim offers a collection of powerful, free online tools designed for various tasks:<br><br>" +
      "• <a href='" + portfolioURLs.pdfToWord + "' target='_blank'>PDF to Word Converter</a> 📄 - Transform PDFs into editable Word documents<br><br>" +
      "• <a href='" + portfolioURLs.videoToAudio + "' target='_blank'>Video to Audio Converter</a> 🎬 - Extract audio from video files easily<br><br>" +
      "• <a href='" + portfolioURLs.barcodeGenerator + "' target='_blank'>Barcode Generator</a> 📊 - Create professional barcodes in multiple formats<br><br>" +
      "• <a href='" + portfolioURLs.qrGenerator + "' target='_blank'>QR Code Generator</a> 📱 - Generate customizable QR codes for various purposes<br><br>" +
      "• <a href='" + portfolioURLs.jpgToPdf + "' target='_blank'>JPG to PDF Converter</a> 🖼️ - Combine multiple images into a single PDF<br><br>" +
      "• <a href='" + portfolioURLs.pdfToJpg + "' target='_blank'>PDF to JPG Converter</a> 📄 - Extract pages from PDFs as images<br><br>" +
      "• <a href='" + portfolioURLs.imageCompressor + "' target='_blank'>Image Compressor</a> 🗜️ - Reduce image file sizes while maintaining quality<br><br>" +
      "• <a href='" + portfolioURLs.voiceRecorder + "' target='_blank'>Voice Recorder</a> 🎙️ - Record audio directly in your browser<br><br>" +
      "• <a href='" + portfolioURLs.colorPalette + "' target='_blank'>Color Palette Generator</a> 🎨 - Create harmonious color schemes<br><br>" +
      "• <a href='" + portfolioURLs.audioCutter + "' target='_blank'>Audio Cutter</a> ✂️ - Trim and edit audio files<br><br>" +
      "• <a href='" + portfolioURLs.slowReverb + "' target='_blank'>Slow & Reverb Generator</a> 🔊 - Create atmospheric audio effects<br><br>" +
      "• <a href='" + portfolioURLs.imageEffects + "' target='_blank'>Image Effects Studio</a> 📸 - Apply professional filters to images<br><br>" +
      "All tools process data directly in your browser for complete privacy and security. No files are uploaded to any server.<br><br>" +
      "Explore all tools: <a href='" + portfolioURLs.tools + "' target='_blank'>Tools Collection</a>"
    ],
    
    pdfToWord: [
      "<b>PDF to Word Converter Tool</b> 📄<br><br>" +
      "This free online tool allows you to convert PDF documents into editable Microsoft Word files with high accuracy.<br><br>" +
      "<b>Key features:</b><br><br>" +
      "• <b>Client-side Processing</b> 🔒 - Your files never leave your computer for complete privacy<br>" +
      "• <b>Format Preservation</b> 📊 - Maintains text styling, images, and layout<br>" +
      "• <b>No File Size Limits</b> 📈 - Convert documents of any size<br>" +
      "• <b>No Registration Required</b> 👤 - Use immediately without creating an account<br>" +
      "• <b>Multiple Output Options</b> 📋 - Save as DOCX or DOC format<br>" +
      "• <b>Batch Processing</b> 📚 - Convert multiple PDFs at once<br><br>" +
      "<b>How it works:</b><br>" +
      "1. Upload your PDF file(s)<br>" +
      "2. Wait for the conversion process to complete<br>" +
      "3. Download your editable Word document<br><br>" +
      "This tool is perfect for editing contracts, modifying reports, or updating any content that's locked in PDF format.<br><br>" +
      "Try it now: <a href='" + portfolioURLs.pdfToWord + "' target='_blank'>PDF to Word Converter</a>"
    ],
    
    videoToAudio: [
      "<b>Video to Audio Converter Tool</b> 🎬<br><br>" +
      "Extract high-quality audio from any video file with this powerful free online tool.<br><br>" +
      "<b>Key features:</b><br><br>" +
      "• <b>Multiple Output Formats</b> 🎵 - MP3, WAV, OGG, and more<br>" +
      "• <b>Quality Adjustment</b> 🎚️ - Select bitrate and audio quality<br>" +
      "• <b>Waveform Visualization</b> 📊 - See your audio before downloading<br>" +
      "• <b>Client-side Processing</b> 🔒 - 100% private, no server uploads<br>" +
      "• <b>Supports All Video Formats</b> 📹 - MP4, AVI, MOV, MKV, and more<br>" +
      "• <b>Fast Processing</b> ⚡ - Extract audio in seconds<br><br>" +
      "<b>Perfect for:</b><br>" +
      "• Creating podcasts from video interviews<br>" +
      "• Extracting music from videos<br>" +
      "• Saving lectures or presentations as audio<br>" +
      "• Converting video collections to audio libraries<br><br>" +
      "<b>How it works:</b><br>" +
      "1. Upload your video file<br>" +
      "2. Choose your preferred audio format and quality<br>" +
      "3. Extract and download your audio file<br><br>" +
      "Try it now: <a href='" + portfolioURLs.videoToAudio + "' target='_blank'>Video to Audio Converter</a>"
    ],
    
    barcodeGenerator: [
      "<b>Barcode Generator Tool</b> 📊<br><br>" +
      "Create professional barcodes for product labeling, inventory management, and retail applications with this free online tool.<br><br>" +
      "<b>Supported barcode formats:</b><br><br>" +
      "• <b>UPC-A</b> 🛒 - Standard retail product code (12 digits)<br>" +
      "• <b>EAN-13</b> 🏷️ - International product code (13 digits)<br>" +
      "• <b>Code 128</b> 📦 - High-density alphanumeric code<br>" +
      "• <b>Code 39</b> 📋 - General-purpose code for various industries<br>" +
      "• <b>ITF-14</b> 📦 - Shipping container code<br>" +
      "• <b>EAN-8</b> 🏪 - Compact retail product code (8 digits)<br>" +
      "• <b>Codabar</b> 📚 - Libraries, blood banks, and shipping<br><br>" +
      "<b>Customization options:</b><br>" +
      "• Adjustable barcode dimensions<br>" +
      "• Show/hide text display<br>" +
      "• Adjustable background and foreground colors<br>" +
      "• Multiple download formats (PNG, SVG, PDF)<br><br>" +
      "<b>How it works:</b><br>" +
      "1. Select your barcode type<br>" +
      "2. Enter your data (numbers or text depending on format)<br>" +
      "3. Customize appearance options<br>" +
      "4. Generate and download your barcode<br><br>" +
      "Try it now: <a href='" + portfolioURLs.barcodeGenerator + "' target='_blank'>Barcode Generator</a>"
    ],
    
    qrGenerator: [
      "<b>QR Code Generator Tool</b> 📱<br><br>" +
      "Create customized QR codes for websites, contact information, WiFi networks, and more with this free online tool.<br><br>" +
      "<b>QR code types:</b><br><br>" +
      "• <b>URL</b> 🔗 - Link to any website or web page<br>" +
      "• <b>Text</b> 📝 - Encode any text message<br>" +
      "• <b>Email</b> 📧 - Open email client with address, subject, and body<br>" +
      "• <b>Phone</b> 📞 - Dial a phone number when scanned<br>" +
      "• <b>SMS</b> 💬 - Open messaging app with number and text<br>" +
      "• <b>WiFi</b> 📶 - Connect to networks automatically<br>" +
      "• <b>vCard</b> 👤 - Share contact information<br>" +
      "• <b>Location</b> 📍 - Show coordinates on a map<br><br>" +
      "<b>Customization features:</b><br>" +
      "• Custom colors for QR code and background<br>" +
      "• Adjustable size and error correction level<br>" +
      "• Optional logo or image in the center<br>" +
      "• Corner style customization<br>" +
      "• Download as PNG or SVG<br><br>" +
      "<b>How it works:</b><br>" +
      "1. Select the type of QR code<br>" +
      "2. Enter your data (URL, text, contact info, etc.)<br>" +
      "3. Customize the appearance<br>" +
      "4. Generate and download your QR code<br><br>" +
      "Try it now: <a href='" + portfolioURLs.qrGenerator + "' target='_blank'>QR Code Generator</a>"
    ],
    
    skills: [
      "<b>Skills & Expertise</b> 🚀<br><br>" +
      "Muatasim has a diverse skill set covering multiple disciplines in digital media and technology:<br><br>" +
      "<b>Web Development</b> 🌐<br>" +
      "• HTML5, CSS3, JavaScript<br>" +
      "• React and modern frameworks<br>" +
      "• Responsive design<br>" +
      "• Performance optimization<br>" +
      "• Animation (GSAP)<br><br>" +
      "<b>E-commerce & Shopify</b> 🛍️<br>" +
      "• Shopify theme development<br>" +
      "• E-commerce optimization<br>" +
      "• Payment gateway integration<br>" +
      "• Conversion rate optimization<br><br>" +
      "<b>Audio Production</b> 🎵<br>" +
      "• Professional mixing & mastering<br>" +
      "• Sound design<br>" +
      "• Music production<br>" +
      "• Voice processing<br><br>" +
      "<b>AI Services</b> 🤖<br>" +
      "• AI voice generation<br>" +
      "• Digital human creation<br>" +
      "• AI-assisted content creation<br><br>" +
      "<b>Graphic Design</b> 🎨<br>" +
      "• Canva expert<br>" +
      "• Brand identity design<br>" +
      "• Social media graphics<br>" +
      "• Marketing materials<br><br>" +
      "These skills are continuously updated through ongoing education and practical application on real-world projects.<br><br>" +
      "Learn more: <a href='" + portfolioURLs.skills + "' target='_blank'>Skills & Expertise</a>"
    ],
    
    contact: [
      "<b>Contact Information</b> 📞<br><br>" +
      "You can get in touch with Muatasim through multiple channels for inquiries, quotes, or project discussions.<br><br>" +
      "<b>Contact methods:</b><br><br>" +
      "• <b>Contact Form</b> 📝 - Fill out the contact form on the website<br>" +
      "• <b>Email</b> 📧 - Send a detailed message about your project<br>" +
      "• <b>Social Media</b> 📱 - Connect through LinkedIn, Twitter, or Instagram<br><br>" +
      "For the fastest response, please include:<br>" +
      "• Project type and scope<br>" +
      "• Timeframe requirements<br>" +
      "• Budget considerations<br>" +
      "• Any specific questions<br><br>" +
      "Most inquiries receive a response within 24-48 hours during business days.<br><br>" +
      "Get in touch now: <a href='" + portfolioURLs.contact + "' target='_blank'>Contact Muatasim</a>"
    ],
    
    help: [
      "<b>How Can I Help You?</b> 💁‍♂️<br><br>" +
      "I can provide information about Muatasim Billah's services, tools, and expertise. Here's what I can tell you about:<br><br>" +
      "<b>Services:</b><br>" +
      "• <a href='#' onclick='return false;' class='service-link' data-service='webDevelopment'>Web Development</a> 🌐<br>" +
      "• <a href='#' onclick='return false;' class='service-link' data-service='shopify'>Shopify & E-commerce</a> 🛍️<br>" +
      "• <a href='#' onclick='return false;' class='service-link' data-service='audioEngineering'>Audio Engineering</a> 🎵<br>" +
      "• <a href='#' onclick='return false;' class='service-link' data-service='aiVoice'>AI Voiceover</a> 🎤<br>" +
      "• <a href='#' onclick='return false;' class='service-link' data-service='aiAvatar'>AI Avatar Creation</a> 👤<br>" +
      "• <a href='#' onclick='return false;' class='service-link' data-service='graphicDesign'>Graphic Design</a> 🎨<br><br>" +
      "<b>Online Tools:</b><br>" +
      "• <a href='#' onclick='return false;' class='tool-link' data-tool='tools'>All Tools</a> 🛠️<br>" +
      "• Converters (PDF, Video, Image)<br>" +
      "• Generators (QR, Barcode, Color Palette)<br><br>" +
      "<b>Other Information:</b><br>" +
      "• <a href='#' onclick='return false;' class='info-link' data-info='skills'>Skills & Expertise</a> 🚀<br>" +
      "• <a href='#' onclick='return false;' class='info-link' data-info='pricing'>Pricing & Packages</a> 💰<br>" +
      "• <a href='#' onclick='return false;' class='info-link' data-info='contact'>Contact Information</a> 📞<br><br>" +
      "What would you like to know about?"
    ],
    
    fallback: [
      "🤔 I'm still learning, but I'm here to provide information about Muatasim's services and portfolio. Could you perhaps ask about his web development, Shopify services, audio engineering, or AI services?",
      "🧐 I don't have specific information about that yet, but I'd be happy to tell you about Muatasim's expertise in web development, e-commerce, audio engineering, or AI services. What would you like to know?",
      "😊 I'm not sure I understand your question completely. I can provide details about Muatasim's professional services, tools, or contact information. Which would interest you most?"
    ]
  };
  
  // Enhanced Intent Patterns - Added more conversation patterns
  const intentPatterns = [
    // Basic conversation
    { intent: 'greeting', patterns: [/^hi\b/i, /^hello\b/i, /^hey\b/i, /^greetings/i, /^howdy/i, /^good\s(morning|evening|afternoon|day)/i, /^assalam[o|u]\s?[a|e]?laikum/i, /^salam/i] },
    { intent: 'feeling', patterns: [/how are you/i, /how['re|\ are] you doing/i, /how is it going/i, /how do you do/i, /what['s|\ is] up/i, /how have you been/i] },
    { intent: 'thanks', patterns: [/thank you/i, /thanks/i, /appreciate it/i, /thank you so much/i, /thanks a lot/i, /grateful/i] },
    { intent: 'goodbye', patterns: [/bye/i, /goodbye/i, /see you/i, /farewell/i, /take care/i, /later/i, /have a good/i] },
    { intent: 'funny', patterns: [/joke/i, /funny/i, /humor/i, /laugh/i, /tell me a joke/i, /make me laugh/i] },
    { intent: 'compliment', patterns: [/you['re|\ are] (great|awesome|amazing|helpful|smart|intelligent|good)/i, /well done/i, /good job/i, /love (you|this|chatting)/i, /nice/i] },
    
    // Bot identity and creator
    { intent: 'botIdentity', patterns: [/who are you/i, /what are you/i, /what is your name/i, /what should I call you/i, /tell me about yourself/i, /your identity/i, /identify yourself/i, /what is this/i] },
    { intent: 'aboutCreator', patterns: [/who (created|made|built|developed|designed) you/i, /who is your (creator|maker|developer|designer|owner)/i, /your creator/i, /who['s|\ is] the (creator|owner|ceo)/i, /who owns you/i] },
    { intent: 'personal', patterns: [/what do you do/i, /your purpose/i, /why are you here/i, /what can you (do|help with)/i, /your function/i, /your goal/i, /how do you work/i, /can you help me/i] },

    // Added photo and boss patterns
    { intent: 'creatorPhoto', patterns: [/who is muatasim/i, /show me muatasim/i, /muatasim('s)? (picture|photo|image|face)/i, /what does muatasim look like/i, /how does muatasim look/i, /can i see muatasim/i, /picture of muatasim/i] },
    { intent: 'bossLook', patterns: [/how (does|is) (my|the) boss look/i, /what does my boss look like/i, /show (me )?(my|the) boss/i, /boss photo/i, /boss pic/i] },
    
    // Main portfolio content
    { intent: 'about', patterns: [/about/i, /who is/i, /tell me about/i, /muatasim/i, /billah/i, /background/i, /experience/i, /portfolio owner/i] },
    { intent: 'services', patterns: [/services/i, /what (do you|does he) (do|offer)/i, /offering/i, /what services/i, /professional services/i] },
    { intent: 'webDevelopment', patterns: [/web\s?dev/i, /website/i, /front\s?end/i, /html/i, /css/i, /javascript/i, /web design/i, /responsive/i] },
    { intent: 'shopify', patterns: [/shopify/i, /e\s?commerce/i, /online store/i, /shop/i, /ecommerce redesign/i, /store design/i, /dropshipping/i] },
    { intent: 'audioEngineering', patterns: [/audio\s?engineering/i, /mixing/i, /mastering/i, /sound design/i, /audio production/i, /music production/i, /sound/i] },
    { intent: 'aiVoice', patterns: [/ai voice/i, /voice\s?over/i, /voice generation/i, /text to speech/i, /narration/i, /ai audio/i, /synthetic voice/i] },
    { intent: 'aiAvatar', patterns: [/ai avatar/i, /digital human/i, /talking avatar/i, /virtual presenter/i, /ai character/i, /synthetic video/i] },
    { intent: 'graphicDesign', patterns: [/graphic design/i, /canva/i, /design/i, /social media design/i, /visual/i, /graphics/i, /design expert/i] },
    { intent: 'tools', patterns: [/tools/i, /online tools/i, /free tools/i, /utilities/i, /converters/i, /generators/i, /what tools/i] },
    { intent: 'pdfToWord', patterns: [/pdf to word/i, /convert pdf/i, /pdf converter/i, /pdf to doc/i, /transform pdf/i] },
    { intent: 'videoToAudio', patterns: [/video to audio/i, /extract audio/i, /video converter/i, /get audio from video/i, /convert video/i] },
    { intent: 'barcodeGenerator', patterns: [/barcode/i, /generate barcode/i, /bar code/i, /upc/i, /ean/i, /code128/i, /product code/i] },
    { intent: 'qrGenerator', patterns: [/qr/i, /qr code/i, /generate qr/i, /quick response code/i, /scan code/i] },
    { intent: 'skills', patterns: [/skills/i, /expertise/i, /what can/i, /capable/i, /technologies/i, /proficient/i, /abilities/i, /tech stack/i] },
    { intent: 'contact', patterns: [/contact/i, /get in touch/i, /reach out/i, /email/i, /message/i, /connect/i, /hire/i] },
    { intent: 'help', patterns: [/help/i, /assist/i, /what can you do/i, /how does this work/i, /capabilities/i, /features/i] }
  ];
  
  // Initialize
  init();
  
  // Initialize function
  function init() {
    // Set event listeners
    chatbotToggle.addEventListener('click', toggleChatbot);
    closeButton.addEventListener('click', closeChatbot);
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') sendMessage();
    });
    
    // Add theme toggle functionality
    themeToggle.addEventListener('click', toggleTheme);
    
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('chatbotTheme') || 'dark';
    setTheme(savedTheme);
    
    // Add welcome message after a short delay
    setTimeout(() => {
      addBotMessage(getRandomResponse(knowledgeBase.greeting));
      conversationContext.greetedUser = true;
    }, 500);
    
    // Add click handlers for quick links
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('service-link')) {
        const service = e.target.getAttribute('data-service');
        if (knowledgeBase[service]) {
          addBotMessage(getRandomResponse(knowledgeBase[service]));
          conversationContext.lastIntent = service;
        }
      }
      
      if (e.target.classList.contains('tool-link')) {
        const tool = e.target.getAttribute('data-tool');
        if (knowledgeBase[tool]) {
          addBotMessage(getRandomResponse(knowledgeBase[tool]));
          conversationContext.lastIntent = tool;
        }
      }
      
      if (e.target.classList.contains('info-link')) {
        const info = e.target.getAttribute('data-info');
        if (knowledgeBase[info]) {
          addBotMessage(getRandomResponse(knowledgeBase[info]));
          conversationContext.lastIntent = info;
        }
      }
    });
    
    // Set up image error handling
    const avatarImage = document.querySelector('.avatar-image');
    if (avatarImage) {
      avatarImage.addEventListener('error', function() {
        this.classList.add('error');
      });
    }
  }
  
  // Toggle theme function
  function toggleTheme() {
    const currentTheme = chatbotContainer.classList.contains('light-mode') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('chatbotTheme', newTheme);
  }
  
  // Set theme function
  function setTheme(theme) {
    if (theme === 'light') {
      chatbotContainer.classList.add('light-mode');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      chatbotContainer.classList.remove('light-mode');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }
  
  // Toggle chatbot visibility
  function toggleChatbot() {
    chatbotContainer.classList.toggle('open');
    if (chatbotContainer.classList.contains('open')) {
      userInput.focus();
    }
  }
  
  // Close chatbot
  function closeChatbot() {
    chatbotContainer.classList.remove('open');
  }
  
  // Send message
  function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    // Add user message
    addUserMessage(message);
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message after a short delay for realism
    setTimeout(() => {
      const response = processUserInput(message);
      hideTypingIndicator();
      addBotMessage(response);
      
      // Increment question count
      conversationContext.questionCount++;
      
      // If many questions and no greeting, offer more help
      if (conversationContext.questionCount > 3 && conversationContext.lastIntent !== 'help') {
        setTimeout(() => {
          showTypingIndicator();
          setTimeout(() => {
            hideTypingIndicator();
            addBotMessage("Is there anything else about Muatasim's services or portfolio you'd like to know? I'm here to help! 😊");
          }, 1000);
        }, 2000);
      }
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }
  
  // Enhanced process user input
  function processUserInput(input) {
    // Check for intent matches
    for (const pattern of intentPatterns) {
      if (matchesPattern(input, pattern.patterns)) {
        conversationContext.lastIntent = pattern.intent;
        return getRandomResponse(knowledgeBase[pattern.intent]);
      }
    }
    
    // If no match found, return fallback response
    return getRandomResponse(knowledgeBase.fallback);
  }
  
  // Check if input matches any pattern
  function matchesPattern(input, patterns) {
    input = input.toLowerCase();
    for (const pattern of patterns) {
      if (pattern.test(input)) {
        return true;
      }
    }
    return false;
  }
  
  // Get random response from array
  function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Add user message to chat
  function addUserMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'user-message';
    messageEl.textContent = message;
    messagesContainer.appendChild(messageEl);
    scrollToBottom();
  }
  
  // Add bot message to chat
  function addBotMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'bot-message';
    messageEl.innerHTML = message;
    messagesContainer.appendChild(messageEl);
    scrollToBottom();
    
    // Make links open in new tab
    messageEl.querySelectorAll('a').forEach(link => {
      if (!link.hasAttribute('onclick')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }
  
  // Show typing indicator
  function showTypingIndicator() {
    typingIndicator.classList.add('active');
    scrollToBottom();
  }
  
  // Hide typing indicator
  function hideTypingIndicator() {
    typingIndicator.classList.remove('active');
  }
  
  // Scroll to bottom of messages
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Public API for external access
  window.portfolioChatbot = {
    open: function() {
      chatbotContainer.classList.add('open');
    },
    close: function() {
      chatbotContainer.classList.remove('open');
    },
    toggle: function() {
      toggleChatbot();
    }
  };
});