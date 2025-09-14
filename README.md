# Intelligent Meeting Assistant

An AI-powered meeting assistant that transforms how teams handle meetings and follow-ups with real-time transcription, intelligent content analysis, and seamless task management integration.

## 🚀 Features

### Core Audio Processing
- **Real-time transcription** with 95%+ accuracy using advanced speech recognition
- **Automatic speaker identification** and labeling (even with similar voices)
- **Multi-language support** with automatic language detection
- **Noise cancellation** and audio enhancement for clear transcription
- **Meeting platform integration** (Zoom, Teams, Google Meet, Slack Huddles)

### AI-Powered Content Analysis
- **Intelligent action item extraction** with automatic priority assignment
- **Decision detection** with confidence scoring
- **Key topic identification** and risk assessment
- **Sentiment analysis** for meeting tone and engagement levels
- **Automatic meeting summaries** with highlights and takeaways

### Task Management Integration
- **Automatic task creation** in project management tools (Asana, Trello, Jira, Monday.com)
- **Smart task assignment** based on context and past assignments
- **Due date suggestions** based on urgency indicators
- **Follow-up reminder scheduling** for assigned tasks
- **Progress tracking** on meeting action items

### Calendar and Workflow Integration
- **Automatic calendar blocking** for action items and follow-up meetings
- **Meeting preparation suggestions** based on previous outcomes
- **Participant availability checking** for scheduling
- **Email integration** for automatic summary distribution
- **Company directory integration** for accurate participant identification

### Advanced Features
- **Meeting template recognition** (standup, planning, retrospective, one-on-one)
- **Custom vocabulary training** for industry-specific terms
- **Privacy controls** for sensitive discussions
- **Multi-meeting project tracking** across sessions
- **Analytics** on meeting effectiveness and participation

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm
- TypeScript 5+
- OpenAI API key
- Meeting platform API credentials (optional)
- Task management platform API keys (optional)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/intelligent-meeting-assistant.git
   cd intelligent-meeting-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the web interface**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### Required Configuration
- `OPENAI_API_KEY`: Your OpenAI API key for AI analysis
- `DATABASE_URL`: PostgreSQL database connection string
- `JWT_SECRET`: Secret key for authentication

### Optional Integrations
- **Speech Recognition**: Azure Speech Services or Google Speech-to-Text
- **Task Management**: Asana, Trello, Jira, Monday.com API credentials
- **Calendar**: Google Calendar or Microsoft Graph API credentials
- **Meeting Platforms**: Zoom, Teams, Slack API credentials

## 📖 Usage

### Starting a Meeting

1. **Open the web interface** and click "Start New Meeting"
2. **Configure meeting settings**:
   - Meeting title and platform
   - Meeting type (standup, planning, etc.)
   - Enable recording and AI processing
3. **Grant microphone permissions** when prompted
4. **Click "Start Meeting"** to begin real-time transcription

### During the Meeting

- **View live transcription** with speaker identification
- **Monitor action items** and decisions as they're detected
- **See participant engagement** metrics in real-time
- **Pause/resume recording** as needed

### After the Meeting

- **Review the generated summary** with key highlights
- **Export or share** the meeting summary
- **Check task management tools** for automatically created tasks
- **Review calendar** for scheduled follow-up meetings

## 🏗️ Architecture

### Core Components

```
src/
├── types/           # TypeScript type definitions
├── audio/           # Audio processing and transcription
├── ai/              # AI-powered content analysis
├── integrations/    # External service integrations
├── base/            # Base classes and utilities
├── errors/          # Error handling
└── index.ts         # Main application entry point
```

### Key Classes

- **`IntelligentMeetingAssistant`**: Main orchestrator class
- **`AudioTranscriptionService`**: Handles real-time audio processing
- **`ContentAnalyzer`**: AI-powered content analysis and extraction
- **`TaskManagerIntegration`**: Task management platform integrations
- **`CalendarIntegration`**: Calendar and scheduling integrations

## 🔌 API Integration

### Meeting Platforms

```typescript
// Zoom integration example
const zoomConfig = {
  apiKey: process.env.ZOOM_API_KEY,
  apiSecret: process.env.ZOOM_API_SECRET
};

await meetingAssistant.connectToPlatform('zoom', zoomConfig);
```

### Task Management

```typescript
// Asana integration example
const asanaConfig = {
  accessToken: process.env.ASANA_ACCESS_TOKEN,
  workspaceId: 'your-workspace-id'
};

await taskManager.configureIntegration('asana', asanaConfig);
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test suite
npm test -- --grep "AudioTranscriptionService"
```

## 📊 Analytics and Monitoring

The system provides comprehensive analytics on:
- Meeting effectiveness scores
- Participant engagement levels
- Action item completion rates
- Decision implementation tracking
- Platform usage statistics

## 🔒 Security and Privacy

### Privacy Controls
- **Selective transcription** for sensitive discussions
- **Data encryption** at rest and in transit
- **GDPR compliance** with data retention policies
- **Role-based access control** for meeting data

### Security Features
- **JWT-based authentication**
- **Rate limiting** on API endpoints
- **Input validation** and sanitization
- **Secure API key management**

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t meeting-assistant .

# Run with Docker Compose
docker-compose up -d
```

### Cloud Deployment

The application is designed to be cloud-native and can be deployed on:
- **AWS** (ECS, Lambda, S3)
- **Google Cloud** (Cloud Run, Cloud Functions)
- **Azure** (Container Instances, Functions)
- **Kubernetes** clusters

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.meeting-assistant.com](https://docs.meeting-assistant.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/intelligent-meeting-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/intelligent-meeting-assistant/discussions)
- **Email**: support@meeting-assistant.com

## 🗺️ Roadmap

### Upcoming Features
- [ ] Mobile app for iOS and Android
- [ ] Advanced voice commands and control
- [ ] Multi-language real-time translation
- [ ] Integration with more task management platforms
- [ ] Advanced analytics dashboard
- [ ] Custom AI model training for specific domains
- [ ] Offline mode support
- [ ] Video analysis and gesture recognition

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added task management integrations
- **v1.2.0** - Enhanced AI analysis capabilities
- **v1.3.0** - Calendar integration and scheduling

---

Built with ❤️ by the Kiro Team#   i n t e l l i g e n t - m e e t i n g - a s s i s t a n t  
 