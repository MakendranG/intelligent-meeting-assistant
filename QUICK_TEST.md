# 🚀 Quick Test Guide - Meeting Assistant

## ⚡ **1-Minute Quick Test**

```bash
# 1. Install dependencies (if not done already)
npm install

# 2. Run comprehensive test suite
node test-runner.js

# 3. Start the application
npm start

# 4. Open browser
# Go to: http://localhost:3000
```

## 🎯 **Step-by-Step Manual Testing**

### **Step 1: Basic Setup Test**
```bash
npm install
npm start
```

**Expected Output:**
```
🚀 Meeting Assistant server running on port 3000
📱 Web interface: http://localhost:3000
🔌 WebSocket server ready for real-time connections
```

### **Step 2: Web Interface Test**

1. **Open Browser**: Go to `http://localhost:3000`
2. **Check Interface**: You should see:
   - ✅ "Meeting Assistant" header with microphone icon
   - ✅ "Start New Meeting" form
   - ✅ Meeting title input field
   - ✅ Platform dropdown (Zoom, Teams, etc.)
   - ✅ Meeting type dropdown
   - ✅ Checkboxes for recording and AI processing

### **Step 3: Start Meeting Test**

1. **Fill Form**:
   - Meeting Title: "Test Meeting"
   - Platform: "Zoom" 
   - Meeting Type: "General Meeting"
   - Keep both checkboxes checked

2. **Click "Start Meeting"**
   - ✅ Should transition to live meeting panel
   - ✅ Browser should request microphone permission
   - ✅ **IMPORTANT**: Click "Allow" for microphone access

3. **Verify Live Interface**:
   - ✅ "Meeting in Progress" header
   - ✅ Live transcription area (initially shows placeholder)
   - ✅ Tabs: Action Items, Decisions, Participants
   - ✅ Audio visualizer appears (bottom right)
   - ✅ Status bar shows "Recording" and "AI Ready"

### **Step 4: Audio Test**

1. **Speak into microphone**: Say something like:
   - "Hello, this is a test meeting"
   - "John should complete the API integration by Friday"
   - "We decided to use React for the frontend"

2. **Watch for**:
   - ✅ Audio visualizer bars should animate when you speak
   - ✅ Transcription segments should appear (simulated)
   - ✅ Action items might appear in the Action Items tab
   - ✅ Status should show "AI Processing" briefly

### **Step 5: End Meeting Test**

1. **Click "End Meeting"** button
2. **Verify Summary Panel**:
   - ✅ Meeting statistics (duration, action items, etc.)
   - ✅ Key highlights section
   - ✅ Action items summary
   - ✅ Next steps section
   - ✅ Export and Share buttons

### **Step 6: Export Test**

1. **Click "Export"** button
2. **Check**: A JSON file should download with meeting data

## 🔧 **Troubleshooting Common Issues**

### **Issue: Microphone Not Working**
```bash
# Solutions:
1. Use HTTPS (required for microphone access)
2. Check browser permissions
3. Try different browser (Chrome recommended)
4. Check if microphone is being used by other apps
```

### **Issue: Server Won't Start**
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process using port 3000
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### **Issue: TypeScript Errors**
```bash
# Clean and rebuild
npm run clean
npm run build

# Check for syntax errors
npx tsc --noEmit
```

### **Issue: No Audio Visualizer**
- Make sure microphone permission is granted
- Check browser console for errors
- Try refreshing the page

## 🧪 **Advanced Testing**

### **API Testing with curl**
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test meeting start
curl -X POST http://localhost:3000/api/meetings/start \
  -H "Content-Type: application/json" \
  -d '{"title":"API Test","platform":"zoom"}'
```

### **WebSocket Testing**
```javascript
// Open browser console and run:
const ws = new WebSocket('ws://localhost:3000');
ws.onopen = () => console.log('WebSocket connected');
ws.onmessage = (e) => console.log('Received:', e.data);
```

### **Unit Tests**
```bash
# Run all unit tests
npm test

# Run specific test file
npm test -- src/tests/meeting-assistant.test.ts

# Run tests with coverage
npm test -- --coverage
```

## ✅ **Success Checklist**

- [ ] Server starts without errors
- [ ] Web interface loads correctly
- [ ] Can start a new meeting
- [ ] Microphone permission granted
- [ ] Audio visualizer animates
- [ ] Can end meeting and see summary
- [ ] Export functionality works
- [ ] No console errors in browser

## 🎉 **If Everything Works**

Congratulations! Your Intelligent Meeting Assistant is working correctly. You now have:

- ✅ **Real-time audio processing** (simulated)
- ✅ **AI-powered content analysis** (mock implementation)
- ✅ **Task management integration** (ready for API keys)
- ✅ **Modern web interface** with real-time updates
- ✅ **WebSocket communication** for live features
- ✅ **Export and sharing capabilities**

## 🚀 **Next Steps for Production**

1. **Add Real API Keys**:
   - OpenAI API key for real AI analysis
   - Speech recognition service keys
   - Task management platform APIs

2. **Deploy to Cloud**:
   - Use Docker for containerization
   - Deploy to AWS, Google Cloud, or Azure
   - Set up HTTPS for microphone access

3. **Enhance Features**:
   - Add user authentication
   - Implement real speech recognition
   - Connect to actual task management tools
   - Add calendar integration

## 📞 **Need Help?**

If you encounter issues:
1. Check the browser console for errors
2. Look at server logs in terminal
3. Run the automated test suite: `node test-runner.js`
4. Review the full TESTING.md guide for detailed troubleshooting

Your Meeting Assistant is ready to transform how you handle meetings! 🎯