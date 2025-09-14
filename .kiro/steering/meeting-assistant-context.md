# Meeting Assistant Project Context

## Project Vision
Create an intelligent meeting assistant that revolutionizes how teams conduct and follow up on meetings through AI-powered transcription, analysis, and task management integration.

## Key Features Implementation

### Dual Speech Recognition Modes
- **Demo Mode**: Uses simulated transcription data for reliable demonstrations
- **Real Speech Mode**: Leverages browser Speech Recognition API for live transcription
- Toggle between modes using the microphone button in the header

### Real-time Audio Processing
- WebRTC audio capture with noise cancellation
- Visual audio feedback with animated bars
- Continuous speech recognition with interim results
- Automatic restart of recognition sessions

### AI-Powered Content Analysis
- Natural language processing for action item detection
- Decision tracking with confidence scoring
- Sentiment analysis of meeting content
- Intelligent keyword extraction and categorization

### Modern Web Architecture
- TypeScript for type safety and developer experience
- Express.js backend with WebSocket support
- Responsive design with mobile-first approach
- Progressive Web App capabilities

## Technical Decisions

### Browser Compatibility
- Primary support: Chrome and Edge (full Speech Recognition API)
- Secondary support: Safari (limited speech features)
- Fallback: Demo mode for unsupported browsers

### State Management
- Client-side session management for meeting data
- Real-time synchronization via WebSocket
- Local storage for user preferences
- Export functionality for meeting summaries

### UI/UX Design Principles
- Clean, professional interface design
- Intuitive navigation and controls
- Real-time feedback and status indicators
- Accessible design following WCAG guidelines

## Integration Points

### Task Management Systems
- Extensible adapter pattern for multiple platforms
- Support for Asana, Trello, Jira, Monday.com
- Automatic task creation from detected action items
- Smart assignee suggestions based on context

### Calendar Integration
- Meeting scheduling and follow-up automation
- Calendar blocking for action item work time
- Participant availability checking
- Reminder scheduling for important tasks

## Development Workflow
- Spec-driven development approach
- Comprehensive testing at all levels
- Continuous integration and deployment
- Documentation-first development