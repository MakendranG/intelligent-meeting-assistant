// Simple Express server for the Meeting Assistant
const express = require('express');
const cors = require('cors');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes
app.post('/api/meetings/start', (req, res) => {
    const { title, platform, template } = req.body;
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    console.log(`Starting meeting: ${title} on ${platform}`);
    
    res.json({
        success: true,
        sessionId,
        message: 'Meeting started successfully'
    });
});

app.post('/api/meetings/end', (req, res) => {
    const { sessionId } = req.body;
    
    console.log(`Ending meeting: ${sessionId}`);
    
    res.json({
        success: true,
        message: 'Meeting ended successfully'
    });
});

app.post('/api/transcription/process', (req, res) => {
    const { sessionId, audioData } = req.body;
    
    // Simulate transcription processing
    setTimeout(() => {
        const mockTranscription = {
            segments: [{
                id: `seg_${Date.now()}`,
                speakerId: 'speaker_1',
                speakerName: 'John Doe',
                text: 'This is a sample transcription segment.',
                timestamp: new Date(),
                confidence: 0.95
            }],
            insights: {
                actionItems: [{
                    id: `action_${Date.now()}`,
                    description: 'Follow up on project timeline',
                    assignee: 'John Doe',
                    priority: 'medium',
                    confidence: 0.85
                }],
                decisions: []
            }
        };
        
        // Broadcast to connected WebSocket clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'transcription_update',
                    sessionId,
                    data: mockTranscription
                }));
            }
        });
    }, 1000);
    
    res.json({
        success: true,
        message: 'Audio processing started'
    });
});

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received WebSocket message:', data.type);
            
            // Handle different message types
            switch (data.type) {
                case 'join_session':
                    ws.sessionId = data.sessionId;
                    ws.send(JSON.stringify({
                        type: 'session_joined',
                        sessionId: data.sessionId
                    }));
                    break;
                    
                case 'audio_chunk':
                    // Process audio chunk
                    console.log(`Processing audio chunk for session ${data.sessionId}`);
                    // In a real implementation, this would be sent to the transcription service
                    break;
                    
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Meeting Assistant server running on port ${PORT}`);
    console.log(`📱 Web interface: http://localhost:${PORT}`);
    console.log(`🔌 WebSocket server ready for real-time connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = app;