// Intelligent Meeting Assistant - Frontend
class MeetingAssistant {
    constructor() {
        this.currentSession = null;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioContext = null;
        this.websocket = null;
        this.speechRecognition = null;
        this.realSpeechMode = false; // Toggle between mock and real speech
        
        this.initializeUI();
        this.setupEventListeners();
        this.initializeAudio();
        this.initializeSpeechRecognition();
    }

    initializeUI() {
        this.panels = {
            setup: document.getElementById('setupPanel'),
            live: document.getElementById('livePanel'),
            summary: document.getElementById('summaryPanel')
        };

        this.elements = {
            meetingForm: document.getElementById('meetingSetupForm'),
            transcriptionFeed: document.getElementById('transcriptionFeed'),
            actionItemsList: document.getElementById('actionItemsList'),
            decisionsList: document.getElementById('decisionsList'),
            participantsList: document.getElementById('participantsList'),
            audioVisualizer: document.getElementById('audioVisualizer'),
            statusElements: {
                connection: document.getElementById('connectionStatus'),
                connectionText: document.getElementById('connectionText'),
                mic: document.getElementById('micStatus'),
                micText: document.getElementById('micText'),
                ai: document.getElementById('aiStatus'),
                aiText: document.getElementById('aiText')
            }
        };

        // Add speech mode toggle
        this.addSpeechModeToggle();

        this.updateStatus('connection', 'ready', 'Ready');
        this.updateStatus('mic', 'ready', 'Microphone Ready');
        this.updateStatus('ai', 'ready', 'AI Ready');
    }

    setupEventListeners() {
        // Meeting setup form
        this.elements.meetingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.startMeeting();
        });

        // Meeting controls
        document.getElementById('endMeetingBtn').addEventListener('click', () => {
            this.endMeeting();
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.toggleRecording();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Summary actions
        document.getElementById('newMeetingBtn').addEventListener('click', () => {
            this.showPanel('setup');
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportSummary();
        });

        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareSummary();
        });
    }

    async initializeAudio() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });
            
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.setupAudioAnalyzer(stream);
            this.updateStatus('mic', 'ready', 'Microphone Ready');
        } catch (error) {
            console.error('Audio initialization failed:', error);
            this.updateStatus('mic', 'error', 'Microphone Error');
        }
    }

    initializeSpeechRecognition() {
        // Check if speech recognition is supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            this.speechRecognition = new SpeechRecognition();
            this.setupSpeechRecognition();
            console.log('✅ Real speech recognition available');
        } else {
            console.log('⚠️ Speech recognition not supported, using mock mode');
            this.realSpeechMode = false;
        }
    }

    setupSpeechRecognition() {
        if (!this.speechRecognition) return;

        this.speechRecognition.continuous = true;
        this.speechRecognition.interimResults = true;
        this.speechRecognition.lang = 'en-US';

        this.speechRecognition.onstart = () => {
            console.log('🎤 Real speech recognition started');
            this.updateStatus('ai', 'processing', 'Listening...');
        };

        this.speechRecognition.onresult = (event) => {
            this.handleRealSpeechResult(event);
        };

        this.speechRecognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.updateStatus('ai', 'error', 'Speech Error');
        };

        this.speechRecognition.onend = () => {
            if (this.isRecording && this.realSpeechMode) {
                // Restart recognition if still recording
                setTimeout(() => {
                    this.speechRecognition.start();
                }, 100);
            }
        };
    }

    handleRealSpeechResult(event) {
        const results = event.results;
        const lastResult = results[results.length - 1];
        
        if (lastResult.isFinal) {
            const transcript = lastResult[0].transcript.trim();
            const confidence = lastResult[0].confidence || 0.9;
            
            if (transcript.length > 0) {
                console.log('🗣️ Real speech detected:', transcript);
                
                // Create real transcription segment
                const segment = {
                    id: 'seg_' + Date.now(),
                    speakerId: 'current_user',
                    speakerName: 'You',
                    text: transcript,
                    timestamp: new Date(),
                    confidence: confidence
                };
                
                this.addTranscriptionSegments([segment]);
                
                // Analyze for action items and decisions
                this.analyzeRealSpeech(transcript);
                
                this.updateStatus('ai', 'ready', 'AI Ready');
            }
        }
    }

    analyzeRealSpeech(text) {
        // Real-time analysis of actual speech
        const actionKeywords = ['should', 'need to', 'must', 'have to', 'will', 'going to', 'task', 'action', 'todo'];
        const decisionKeywords = ['decided', 'choose', 'pick', 'select', 'go with', 'use', 'implement'];
        
        const lowerText = text.toLowerCase();
        
        // Check for action items
        if (actionKeywords.some(keyword => lowerText.includes(keyword))) {
            const actionItem = {
                id: 'action_' + Date.now(),
                description: text,
                assignee: 'Current User',
                priority: this.determinePriority(text),
                confidence: 0.8
            };
            
            this.addActionItems([actionItem]);
        }
        
        // Check for decisions
        if (decisionKeywords.some(keyword => lowerText.includes(keyword))) {
            const decision = {
                id: 'decision_' + Date.now(),
                description: text,
                impact: 'medium',
                category: 'operational',
                confidence: 0.8
            };
            
            this.addDecisions([decision]);
        }
    }

    determinePriority(text) {
        const urgentWords = ['urgent', 'asap', 'immediately', 'critical', 'important'];
        const highWords = ['soon', 'quickly', 'priority', 'must'];
        
        const lowerText = text.toLowerCase();
        
        if (urgentWords.some(word => lowerText.includes(word))) return 'critical';
        if (highWords.some(word => lowerText.includes(word))) return 'high';
        return 'medium';
    }

    addSpeechModeToggle() {
        // Add toggle button to switch between mock and real speech
        const headerControls = document.querySelector('.header-controls');
        
        const toggleButton = document.createElement('button');
        toggleButton.className = 'btn-icon';
        toggleButton.id = 'speechModeToggle';
        toggleButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        toggleButton.title = 'Toggle Real Speech Recognition';
        
        toggleButton.addEventListener('click', () => {
            this.toggleSpeechMode();
        });
        
        headerControls.insertBefore(toggleButton, headerControls.firstChild);
        
        // Update initial state
        this.updateSpeechModeUI();
    }

    toggleSpeechMode() {
        if (!this.speechRecognition) {
            alert('Real speech recognition is not supported in this browser. Please use Chrome or Edge.');
            return;
        }
        
        this.realSpeechMode = !this.realSpeechMode;
        this.updateSpeechModeUI();
        
        console.log(`Speech mode: ${this.realSpeechMode ? 'REAL' : 'MOCK'}`);
    }

    updateSpeechModeUI() {
        const toggleButton = document.getElementById('speechModeToggle');
        const indicator = document.getElementById('speechModeIndicator');
        
        if (toggleButton) {
            if (this.realSpeechMode) {
                toggleButton.innerHTML = '<i class="fas fa-microphone"></i>';
                toggleButton.title = 'Real Speech Recognition (ON) - Click to switch to Demo Mode';
                toggleButton.style.color = '#38a169';
                toggleButton.classList.add('real-mode');
            } else {
                toggleButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                toggleButton.title = 'Demo Mode (ON) - Click to enable Real Speech Recognition';
                toggleButton.style.color = '#e53e3e';
                toggleButton.classList.remove('real-mode');
            }
        }
        
        // Update mode indicator
        if (indicator) {
            const badge = indicator.querySelector('.mode-badge');
            if (this.realSpeechMode) {
                badge.className = 'mode-badge real-mode';
                badge.innerHTML = `
                    <i class="fas fa-microphone"></i>
                    <span>Real Speech Mode</span>
                    <small>Using browser speech recognition</small>
                `;
            } else {
                badge.className = 'mode-badge demo-mode';
                badge.innerHTML = `
                    <i class="fas fa-microphone-slash"></i>
                    <span>Demo Mode</span>
                    <small>Using simulated transcription</small>
                `;
            }
        }
        
        // Update status
        const mode = this.realSpeechMode ? 'Real Speech' : 'Demo Mode';
        this.updateStatus('ai', 'ready', mode);
    }

    setupAudioAnalyzer(stream) {
        const source = this.audioContext.createMediaStreamSource(stream);
        const analyzer = this.audioContext.createAnalyser();
        analyzer.fftSize = 256;
        
        source.connect(analyzer);
        
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);
        const bars = document.querySelectorAll('.audio-bars .bar');
        
        const updateVisualizer = () => {
            analyzer.getByteFrequencyData(dataArray);
            
            bars.forEach((bar, index) => {
                const value = dataArray[index * 10] || 0;
                const height = (value / 255) * 30;
                bar.style.height = Math.max(8, height) + 'px';
            });
            
            if (this.isRecording) {
                requestAnimationFrame(updateVisualizer);
            }
        };
        
        this.visualizerUpdate = updateVisualizer;
    }

    async startMeeting() {
        const formData = new FormData(this.elements.meetingForm);
        const meetingConfig = {
            title: formData.get('meetingTitle') || 'Untitled Meeting',
            platform: formData.get('meetingPlatform') || 'zoom',
            template: formData.get('meetingTemplate') || 'general',
            recordingEnabled: document.getElementById('recordingEnabled').checked,
            aiProcessingEnabled: document.getElementById('aiProcessingEnabled').checked
        };

        try {
            this.updateStatus('connection', 'connecting', 'Starting Meeting...');
            
            // Simulate API call to start meeting
            await this.simulateApiCall('/api/meetings/start', meetingConfig);
            
            this.currentSession = {
                id: 'session_' + Date.now(),
                title: meetingConfig.title,
                startTime: new Date(),
                participants: [],
                transcription: [],
                actionItems: [],
                decisions: []
            };

            document.getElementById('liveMeetingTitle').textContent = meetingConfig.title;
            this.showPanel('live');
            
            if (meetingConfig.recordingEnabled) {
                await this.startRecording();
            }
            
            this.updateStatus('connection', 'connected', 'Meeting Active');
            this.simulateRealTimeUpdates();
            
        } catch (error) {
            console.error('Failed to start meeting:', error);
            this.updateStatus('connection', 'error', 'Connection Failed');
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && !this.realSpeechMode) {
                    // Only process audio chunks in mock mode
                    this.processAudioChunk(event.data);
                }
            };
            
            this.mediaRecorder.start(1000); // Capture every second
            this.isRecording = true;
            
            // Start real speech recognition if enabled
            if (this.realSpeechMode && this.speechRecognition) {
                try {
                    this.speechRecognition.start();
                    this.updateStatus('mic', 'active', 'Real Speech Active');
                } catch (error) {
                    console.error('Failed to start speech recognition:', error);
                    this.updateStatus('mic', 'active', 'Recording (Speech Failed)');
                }
            } else {
                this.updateStatus('mic', 'active', 'Recording (Demo Mode)');
            }
            
            this.elements.audioVisualizer.classList.add('active');
            this.visualizerUpdate();
            
        } catch (error) {
            console.error('Recording failed:', error);
            this.updateStatus('mic', 'error', 'Recording Failed');
        }
    }

    async processAudioChunk(audioBlob) {
        if (!this.currentSession) return;
        
        try {
            // Convert blob to ArrayBuffer for processing
            const arrayBuffer = await audioBlob.arrayBuffer();
            
            // Simulate transcription processing
            this.updateStatus('ai', 'processing', 'Processing...');
            
            // Simulate API call for transcription
            const transcriptionResult = await this.simulateTranscription(arrayBuffer);
            
            if (transcriptionResult.segments.length > 0) {
                this.addTranscriptionSegments(transcriptionResult.segments);
                this.updateInsights(transcriptionResult.insights);
            }
            
            this.updateStatus('ai', 'ready', 'AI Ready');
        } catch (error) {
            console.error('Audio processing failed:', error);
            this.updateStatus('ai', 'error', 'Processing Error');
        }
    }

    async simulateTranscription(audioBuffer) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock transcription data
        const mockSegments = [
            {
                id: 'seg_' + Date.now(),
                speakerId: 'speaker_1',
                speakerName: 'John Doe',
                text: this.generateMockTranscription(),
                timestamp: new Date(),
                confidence: 0.95
            }
        ];

        const mockInsights = {
            actionItems: this.generateMockActionItems(),
            decisions: this.generateMockDecisions()
        };

        return { segments: mockSegments, insights: mockInsights };
    }

    generateMockTranscription() {
        const samples = [
            "Let's review the project timeline and identify any potential blockers.",
            "I think we should prioritize the user authentication feature for the next sprint.",
            "Can someone take ownership of the database migration task?",
            "We need to schedule a follow-up meeting to discuss the API integration.",
            "The design team should have the mockups ready by Friday.",
            "Let's make sure we have proper testing coverage for the new features."
        ];
        return samples[Math.floor(Math.random() * samples.length)];
    }

    generateMockActionItems() {
        const items = [
            {
                id: 'action_' + Date.now(),
                description: 'Complete user authentication implementation',
                assignee: 'John Doe',
                priority: 'high',
                confidence: 0.9
            },
            {
                id: 'action_' + Date.now() + 1,
                description: 'Review and update API documentation',
                assignee: 'Jane Smith',
                priority: 'medium',
                confidence: 0.85
            }
        ];
        return Math.random() > 0.7 ? [items[Math.floor(Math.random() * items.length)]] : [];
    }

    generateMockDecisions() {
        const decisions = [
            {
                id: 'decision_' + Date.now(),
                description: 'Decided to use React for the frontend framework',
                impact: 'high',
                category: 'technical',
                confidence: 0.95
            }
        ];
        return Math.random() > 0.8 ? [decisions[0]] : [];
    }

    addTranscriptionSegments(segments) {
        const feed = this.elements.transcriptionFeed;
        
        // Remove placeholder if it exists
        const placeholder = feed.querySelector('.transcription-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        segments.forEach(segment => {
            const segmentElement = document.createElement('div');
            segmentElement.className = 'transcription-segment';
            segmentElement.innerHTML = `
                <div class="speaker-name">${segment.speakerName || segment.speakerId}</div>
                <div class="segment-text">${segment.text}</div>
                <div class="segment-timestamp">${segment.timestamp.toLocaleTimeString()}</div>
            `;
            
            feed.appendChild(segmentElement);
            feed.scrollTop = feed.scrollHeight;
        });
        
        // Store in session
        this.currentSession.transcription.push(...segments);
    }

    updateInsights(insights) {
        if (insights.actionItems.length > 0) {
            this.addActionItems(insights.actionItems);
        }
        
        if (insights.decisions.length > 0) {
            this.addDecisions(insights.decisions);
        }
    }

    addActionItems(items) {
        const list = this.elements.actionItemsList;
        const emptyState = list.querySelector('.empty-state');
        
        if (emptyState) {
            emptyState.remove();
        }
        
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = `insight-item ${item.priority}-priority`;
            itemElement.innerHTML = `
                <div class="insight-description">${item.description}</div>
                <div class="insight-meta">
                    <span>Assigned to: ${item.assignee}</span>
                    <span class="priority-badge ${item.priority}">${item.priority}</span>
                </div>
            `;
            
            list.appendChild(itemElement);
        });
        
        // Update counter
        this.currentSession.actionItems.push(...items);
        document.getElementById('actionItemsCount').textContent = this.currentSession.actionItems.length;
    }

    addDecisions(decisions) {
        const list = this.elements.decisionsList;
        const emptyState = list.querySelector('.empty-state');
        
        if (emptyState) {
            emptyState.remove();
        }
        
        decisions.forEach(decision => {
            const decisionElement = document.createElement('div');
            decisionElement.className = 'insight-item';
            decisionElement.innerHTML = `
                <div class="insight-description">${decision.description}</div>
                <div class="insight-meta">
                    <span>Impact: ${decision.impact}</span>
                    <span>Category: ${decision.category}</span>
                </div>
            `;
            
            list.appendChild(decisionElement);
        });
        
        // Update counter
        this.currentSession.decisions.push(...decisions);
        document.getElementById('decisionsCount').textContent = this.currentSession.decisions.length;
    }

    simulateRealTimeUpdates() {
        // Simulate periodic updates during the meeting
        this.updateInterval = setInterval(() => {
            if (this.isRecording && Math.random() > 0.7) {
                // Simulate new transcription
                const mockData = this.simulateTranscription(new ArrayBuffer(0));
                mockData.then(result => {
                    if (result.segments.length > 0) {
                        this.addTranscriptionSegments(result.segments);
                        this.updateInsights(result.insights);
                    }
                });
            }
        }, 5000);
    }

    async endMeeting() {
        try {
            this.updateStatus('connection', 'processing', 'Ending Meeting...');
            
            if (this.mediaRecorder && this.isRecording) {
                this.mediaRecorder.stop();
                this.isRecording = false;
            }
            
            // Stop speech recognition if active
            if (this.speechRecognition && this.realSpeechMode) {
                this.speechRecognition.stop();
            }
            
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            
            this.elements.audioVisualizer.classList.remove('active');
            
            // Simulate final processing
            await this.simulateApiCall('/api/meetings/end', { sessionId: this.currentSession.id });
            
            this.currentSession.endTime = new Date();
            this.generateMeetingSummary();
            this.showPanel('summary');
            
            this.updateStatus('connection', 'ready', 'Meeting Ended');
            this.updateStatus('mic', 'ready', 'Microphone Ready');
            this.updateStatus('ai', 'ready', this.realSpeechMode ? 'Real Speech' : 'Demo Mode');
            
        } catch (error) {
            console.error('Failed to end meeting:', error);
            this.updateStatus('connection', 'error', 'Error Ending Meeting');
        }
    }

    generateMeetingSummary() {
        if (!this.currentSession) return;
        
        const duration = this.currentSession.endTime - this.currentSession.startTime;
        const durationMinutes = Math.floor(duration / 60000);
        
        // Update summary stats
        document.getElementById('meetingDuration').textContent = `${durationMinutes}m`;
        document.getElementById('totalActionItems').textContent = this.currentSession.actionItems.length;
        document.getElementById('totalDecisions').textContent = this.currentSession.decisions.length;
        document.getElementById('participantCount').textContent = this.currentSession.participants.length || 1;
        
        // Generate key highlights
        setTimeout(() => {
            document.getElementById('keyHighlights').innerHTML = `
                <ul>
                    <li>Discussed project timeline and identified key milestones</li>
                    <li>Assigned ownership for critical development tasks</li>
                    <li>Made important technical decisions for the architecture</li>
                    <li>Scheduled follow-up meetings for next week</li>
                </ul>
            `;
        }, 1000);
        
        // Generate action items summary
        setTimeout(() => {
            const actionItemsHtml = this.currentSession.actionItems.map(item => `
                <div class="insight-item ${item.priority}-priority">
                    <div class="insight-description">${item.description}</div>
                    <div class="insight-meta">
                        <span>Assigned to: ${item.assignee}</span>
                        <span class="priority-badge ${item.priority}">${item.priority}</span>
                    </div>
                </div>
            `).join('');
            
            document.getElementById('summaryActionItems').innerHTML = actionItemsHtml || '<p>No action items were identified.</p>';
        }, 1500);
        
        // Generate next steps
        setTimeout(() => {
            document.getElementById('nextSteps').innerHTML = `
                <ul>
                    <li>Team members to complete assigned action items by due dates</li>
                    <li>Schedule follow-up meeting for progress review</li>
                    <li>Share meeting summary with all stakeholders</li>
                    <li>Update project management tools with new tasks</li>
                </ul>
            `;
        }, 2000);
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    showPanel(panelName) {
        Object.values(this.panels).forEach(panel => {
            panel.classList.remove('active');
        });
        this.panels[panelName].classList.add('active');
    }

    updateStatus(type, status, text) {
        const statusElement = this.elements.statusElements[type];
        const textElement = this.elements.statusElements[type + 'Text'];
        
        if (statusElement) {
            statusElement.className = `fas fa-circle ${status}`;
        }
        
        if (textElement) {
            textElement.textContent = text;
        }
    }

    toggleRecording() {
        if (this.isRecording) {
            this.mediaRecorder.pause();
            this.updateStatus('mic', 'paused', 'Recording Paused');
            document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-play"></i>';
        } else {
            this.mediaRecorder.resume();
            this.updateStatus('mic', 'active', 'Recording');
            document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    async exportSummary() {
        if (!this.currentSession) return;
        
        const summary = {
            title: this.currentSession.title,
            date: this.currentSession.startTime.toLocaleDateString(),
            duration: Math.floor((this.currentSession.endTime - this.currentSession.startTime) / 60000),
            actionItems: this.currentSession.actionItems,
            decisions: this.currentSession.decisions,
            transcription: this.currentSession.transcription
        };
        
        const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `meeting-summary-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    async shareSummary() {
        if (!this.currentSession) return;
        
        const summaryText = `Meeting Summary: ${this.currentSession.title}
Date: ${this.currentSession.startTime.toLocaleDateString()}
Duration: ${Math.floor((this.currentSession.endTime - this.currentSession.startTime) / 60000)} minutes
Action Items: ${this.currentSession.actionItems.length}
Decisions: ${this.currentSession.decisions.length}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Meeting Summary',
                    text: summaryText
                });
            } catch (error) {
                console.log('Share cancelled or failed:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(summaryText).then(() => {
                alert('Summary copied to clipboard!');
            });
        }
    }

    async simulateApiCall(endpoint, data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // Simulate occasional failures for testing
        if (Math.random() < 0.05) {
            throw new Error('API call failed');
        }
        
        return { success: true, data };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new MeetingAssistant();
    window.meetingAssistant = app; // Make available globally for debugging
});