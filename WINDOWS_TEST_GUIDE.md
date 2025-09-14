# 🪟 Windows 11 Testing Guide - Meeting Assistant

## 🚀 **Quick Start for Windows 11**

### **Prerequisites**
- ✅ Node.js 18+ installed ([Download here](https://nodejs.org/))
- ✅ Git installed (optional)
- ✅ Chrome or Edge browser (recommended for microphone access)

### **Step 1: Open PowerShell or Command Prompt**
```powershell
# Open PowerShell as Administrator (recommended)
# Or use Windows Terminal (modern option)
```

### **Step 2: Navigate to Project Directory**
```powershell
# If you're in the project folder already, you're good!
# Otherwise navigate to where you have the meeting assistant files
cd path\to\your\meeting-assistant
```

### **Step 3: Install Dependencies**
```powershell
npm install
```

### **Step 4: Run Comprehensive Test**
```powershell
# This will test everything automatically
npm run test:all
```

### **Step 5: Start the Application**
```powershell
npm start
```

### **Step 6: Test in Browser**
1. Open **Chrome** or **Edge**
2. Go to: `http://localhost:3000`
3. Start a test meeting
4. **Allow microphone access** when prompted

## 🔧 **Windows-Specific Commands**

### **Check if Node.js is Installed**
```powershell
node --version
npm --version
```

### **Check if Port 3000 is Available**
```powershell
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill process if needed (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### **Alternative Port (if 3000 is busy)**
```powershell
# Set environment variable and start
$env:PORT=3001; npm start

# Or in Command Prompt
set PORT=3001 && npm start
```

### **Clean Installation (if issues)**
```powershell
# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## 🎯 **Windows Testing Checklist**

### **✅ Basic Setup Test**
```powershell
# 1. Check Node.js
node --version  # Should show v18+ or v20+

# 2. Install dependencies
npm install     # Should complete without errors

# 3. Check TypeScript compilation
npm run check   # Should show no errors

# 4. Start server
npm start       # Should show "Meeting Assistant server running"
```

### **✅ Browser Test (Chrome/Edge)**
1. **Open browser**: `http://localhost:3000`
2. **Check interface**: Should see professional meeting assistant UI
3. **Start meeting**: Fill form and click "Start Meeting"
4. **Microphone permission**: Click "Allow" when prompted
5. **Audio test**: Speak and watch audio visualizer bars move
6. **End meeting**: Click "End Meeting" and see summary

### **✅ Windows Firewall**
If you get firewall prompts:
- ✅ **Allow** Node.js through Windows Defender Firewall
- ✅ **Allow** for both Private and Public networks

## 🐛 **Windows-Specific Troubleshooting**

### **Issue: "npm is not recognized"**
```powershell
# Add Node.js to PATH
# 1. Open System Properties > Environment Variables
# 2. Add Node.js installation path to PATH
# 3. Restart PowerShell

# Or reinstall Node.js with "Add to PATH" checked
```

### **Issue: PowerShell Execution Policy**
```powershell
# If you get execution policy errors
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or run specific commands
powershell -ExecutionPolicy Bypass -Command "npm start"
```

### **Issue: Port 3000 Already in Use**
```powershell
# Find what's using the port
netstat -ano | findstr :3000

# Kill the process (replace 1234 with actual PID)
taskkill /PID 1234 /F

# Or use different port
$env:PORT=3001; npm start
```

### **Issue: Microphone Not Working**
1. **Check Windows Privacy Settings**:
   - Settings > Privacy & Security > Microphone
   - Allow apps to access microphone
   - Allow desktop apps to access microphone

2. **Check Browser Settings**:
   - Chrome: Settings > Privacy and Security > Site Settings > Microphone
   - Edge: Settings > Site permissions > Microphone

3. **Use HTTPS or localhost** (required for microphone access)

### **Issue: Windows Defender Blocking**
```powershell
# If Windows Defender blocks Node.js
# 1. Open Windows Security
# 2. Go to Virus & threat protection
# 3. Add exclusion for your project folder
```

## 🎮 **Windows Terminal (Recommended)**

For the best experience, use **Windows Terminal**:

1. **Install from Microsoft Store**: "Windows Terminal"
2. **Open PowerShell tab**
3. **Navigate to project**: `cd your\project\path`
4. **Run commands** with better formatting and colors

## 🚀 **Quick Windows Test Script**

Create a batch file for easy testing:

```batch
@echo off
echo 🚀 Testing Meeting Assistant on Windows 11
echo.

echo 📋 Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed!
    pause
    exit /b 1
)

echo 🔨 Checking TypeScript...
npm run check
if %errorlevel% neq 0 (
    echo ⚠️ TypeScript issues found, but continuing...
)

echo 🚀 Starting server...
echo Open your browser to: http://localhost:3000
npm start
```

Save this as `test-windows.bat` and double-click to run!

## 🌐 **Browser Recommendations for Windows 11**

### **Best Options:**
1. **Chrome** - Best microphone support
2. **Edge** - Good integration with Windows
3. **Firefox** - Alternative option

### **Browser Settings to Check:**
- ✅ Microphone permissions enabled
- ✅ JavaScript enabled
- ✅ WebSocket support (should be automatic)
- ✅ Local storage enabled

## 📊 **Expected Results on Windows 11**

### **✅ What Should Work:**
- Server starts on port 3000
- Web interface loads in browser
- Microphone permission dialog appears
- Audio visualizer animates when speaking
- Meeting flow works end-to-end
- Export downloads JSON file
- No console errors

### **⚠️ Known Windows Limitations:**
- Some antivirus software may flag Node.js initially
- Windows Defender might prompt for network access
- Microphone access requires HTTPS or localhost
- File downloads go to default Downloads folder

## 🎯 **Success on Windows 11**

You'll know everything is working when:
1. ✅ PowerShell shows "Meeting Assistant server running on port 3000"
2. ✅ Browser loads the interface without errors
3. ✅ Microphone permission granted successfully
4. ✅ Audio visualizer bars move when you speak
5. ✅ Can complete full meeting workflow
6. ✅ Windows Defender doesn't block the application

## 🆘 **Need Help?**

If you encounter Windows-specific issues:
1. **Check Windows Event Viewer** for system errors
2. **Run PowerShell as Administrator**
3. **Temporarily disable antivirus** for testing
4. **Check Windows Firewall settings**
5. **Try different browser** (Chrome recommended)

Your Meeting Assistant should work perfectly on Windows 11! 🎉