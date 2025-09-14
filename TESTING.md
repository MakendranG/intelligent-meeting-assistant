# Testing Guide - Intelligent Meeting Assistant

This guide provides comprehensive instructions for testing the meeting assistant solution at different levels.

## 🚀 Quick Start Testing

### 1. **Basic Setup Test**

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Expected output:
```
🚀 Meeting Assistant server running on port 3000
📱 Web interface: http://localhost:3000
🔌 WebSocket server ready for real-time connections
```

### 2. **Web Interface Test**

1. Open `http://localhost:3000` in your browser
2. You should see the Meeting Assistant interface
3. Try starting a new meeting with these steps:
   - Enter a meeting title (e.g., "Test Meeting")
   - Select a platform (Zoom, Teams, etc.)
   - Choose a meeting type
   - Click "Start Meeting"

### 3. **Audio Permission Test**

When you start a meeting, the browser will request microphone permissions:
- **Allow** the microphone access
- You should see the audio visualizer bars moving
- The status bar should show "Microphone Ready" → "Recording"

## 🔧 **Development Testing**

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- transcription.test.ts
```

### TypeScript Compilation Test

```bash
# Build TypeScript files
npm run build:ts

# Check for compilation errors
npx tsc --noEmit
```

### Linting Test

```bash
# Run ESLint
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

## 🎯 **Feature Testing Scenarios**

### Scenario 1: Complete Meeting Flow

1. **Start Meeting**
   - Fill out meeting form
   - Click "Start Meeting"
   - Verify transition to live meeting panel

2. **Simulate Audio Input**
   - Speak into microphone
   - Watch for transcription segments appearing
   - Check action items and decisions tabs

3. **End Meeting**
   - Click "End Meeting"
   - Verify transition to summary panel
   - Check meeting statistics and summary

### Scenario 2: Real-time Features

1. **Audio Visualizer**
   - Start a meeting
   - Make noise near microphone
   - Verify audio bars animate

2. **Live Transcription**
   - Speak clearly into microphone
   - Watch transcription feed update
   - Check speaker identification

3. **Insights Detection**
   - Say phrases like "John should handle the API integration"
   - Check if action items appear in real-time
   - Try decision phrases like "We decided to use React"

### Scenario 3: Export and Share

1. **Export Summary**
   - Complete a meeting
   - Click "Export" button
   - Verify JSON file downloads

2. **Share Summary**
   - Click "Share" button
   - Check clipboard or native share dialog

## 🔍 **API Testing**

### Using curl or Postman

```bash
# Health check
curl http://localhost:3000/health

# Start meeting
curl -X POST http://localhost:3000/api/meetings/start \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Meeting","platform":"zoom","template":"general"}'

# End meeting
curl -X POST http://localhost:3000/api/meetings/end \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"session_123"}'
```

### WebSocket Testing

Use a WebSocket client to test real-time features:

```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'join_session',
    sessionId: 'test_session_123'
  }));
};

ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};
```

## 🧪 **Browser Testing**

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Browser-Specific Tests

1. **Microphone Access**
   - Test in different browsers
   - Check permission dialogs
   - Verify audio capture works

2. **WebSocket Connection**
   - Check browser developer tools
   - Verify WebSocket connection established
   - Test real-time message flow

3. **Responsive Design**
   - Test on mobile devices
   - Check tablet layouts
   - Verify touch interactions

## 🔧 **Integration Testing**

### Mock API Testing

The system includes mock implementations for testing without real API keys:

```bash
# Test without OpenAI API key
OPENAI_API_KEY=test_key npm start
```

### Task Management Integration Test

```javascript
// Test task creation
const taskManager = new TaskManagerIntegration();
const actionItems = [{
  id: 'test_action',
  description: 'Test task creation',
  assignee: 'test@example.com',
  priority: 'medium'
}];

await taskManager.createTasks(actionItems, 'test_session');
```

## 📊 **Performance Testing**

### Load Testing

```bash
# Install artillery for load testing
npm install -g artillery

# Run load test
artillery run load-test.yml
```

### Memory Usage

```bash
# Monitor memory usage
node --inspect server.js

# Open Chrome DevTools
# Go to chrome://inspect
# Click "inspect" on the Node.js process
```

### Audio Processing Performance

1. **Latency Test**
   - Measure time from audio input to transcription
   - Target: < 2 seconds for real-time feel

2. **Accuracy Test**
   - Test with different audio qualities
   - Test with multiple speakers
   - Test with background noise

## 🐛 **Debugging and Troubleshooting**

### Common Issues

1. **Microphone Not Working**
   ```bash
   # Check browser permissions
   # Verify HTTPS (required for microphone access)
   # Test with different browsers
   ```

2. **WebSocket Connection Failed**
   ```bash
   # Check server logs
   # Verify port 3000 is available
   # Test with curl first
   ```

3. **TypeScript Compilation Errors**
   ```bash
   # Clean build directory
   npm run clean
   npm run build:ts
   ```

### Debug Mode

```bash
# Start server with debug logging
DEBUG=* npm start

# Or specific debug categories
DEBUG=meeting-assistant:* npm start
```

### Browser Developer Tools

1. **Console Logs**
   - Check for JavaScript errors
   - Monitor WebSocket messages
   - Watch API calls in Network tab

2. **Application Tab**
   - Check Local Storage
   - Verify Service Worker (if implemented)
   - Monitor WebSocket connection

## 📋 **Test Checklist**

### Pre-deployment Checklist

- [ ] All unit tests pass
- [ ] TypeScript compiles without errors
- [ ] Linting passes
- [ ] Web interface loads correctly
- [ ] Microphone permissions work
- [ ] Audio visualizer animates
- [ ] Meeting flow works end-to-end
- [ ] WebSocket connection established
- [ ] API endpoints respond correctly
- [ ] Export functionality works
- [ ] Mobile responsive design works
- [ ] Cross-browser compatibility verified

### Production Readiness

- [ ] Environment variables configured
- [ ] API keys secured
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Error handling tested
- [ ] Logging configured
- [ ] Monitoring setup
- [ ] Backup procedures tested

## 🎯 **Automated Testing**

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run build:ts
      - run: npm test
```

### End-to-End Testing

```bash
# Install Playwright for E2E testing
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

This comprehensive testing guide ensures your meeting assistant works reliably across all scenarios and environments!