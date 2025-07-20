# 🎵 SptDwnloader - YouTube Song Downloader

A modern, browser-based YouTube song downloader with a clean interface and powerful backend API.

![Screenshot](https://img.shields.io/badge/Status-Live-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Live Demo

- **Frontend**: [https://edualexis.github.io/SptDwnloader](https://edualexis.github.io/SptDwnloader)
- **API**: [Your Render URL here]

## ✨ Features

- 🎯 **Simple Interface** - Just paste a YouTube URL and download
- 🎵 **Multiple Formats** - MP3, WAV, and OGG support
- ⚡ **Fast Processing** - High-quality audio extraction
- 📱 **Mobile Friendly** - Responsive design works everywhere
- 🔒 **Rate Limited** - Prevents abuse with smart limits
- 🎨 **Modern UI** - Beautiful gradients and smooth animations

## 🛠️ Tech Stack

### Frontend
- Pure HTML, CSS, JavaScript
- Responsive design with modern CSS
- Web Audio API for preview
- GitHub Pages hosting

### Backend
- Node.js + Express
- ytdl-core for YouTube processing
- FFmpeg for audio conversion
- CORS enabled for cross-origin requests

## 📁 Project Structure

```
SptDwnloader/
├── index.html              # Frontend application
├── backend/
│   ├── server.js           # Express API server
│   ├── package.json        # Dependencies
│   ├── .env.example        # Environment variables template
│   └── .gitignore          # Git ignore rules
├── docs/
│   └── API.md              # API documentation
└── README.md               # This file
```

## 🚀 Quick Start

### Option 1: Use the Live Version
Just visit [https://edualexis.github.io/SptDwnloader](https://edualexis.github.io/SptDwnloader)

### Option 2: Run Locally

#### Frontend
```bash
# Clone the repository
git clone https://github.com/EduAlexis/SptDwnloader.git
cd SptDwnloader

# Serve frontend (any HTTP server)
npx http-server . -p 8080
# or python -m http.server 8080
# or use Live Server in VS Code
```

#### Backend
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start server
npm start
# or for development: npm run dev
```

## 📚 API Usage

### Get Video Info
```javascript
const response = await fetch('/api/info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    url: 'https://www.youtube.com/watch?v=VIDEO_ID' 
  })
});
const info = await response.json();
```

### Download Audio
```javascript
const response = await fetch('/api/download', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    url: 'https://www.youtube.com/watch?v=VIDEO_ID',
    format: 'mp3' // or 'wav', 'ogg'
  })
});
const audioBlob = await response.blob();
```

See [docs/API.md](docs/API.md) for complete API documentation.

## 🔧 Deployment

### Frontend (GitHub Pages)
1. Push to main branch
2. Enable GitHub Pages in repository settings
3. Select "Deploy from branch" → main

### Backend (Render.com)
1. Sign up at [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Set root directory to `backend`
5. Build command: `npm install`
6. Start command: `npm start`

### Backend (Alternative Platforms)
- **Railway**: Similar setup, auto-deploy from GitHub
- **Heroku**: Add Procfile with `web: npm start`
- **Vercel**: Convert to serverless functions
- **DigitalOcean**: Use App Platform

## ⚙️ Configuration

### Environment Variables
```bash
PORT=3000                    # Server port
NODE_ENV=production          # Environment
RATE_LIMIT_REQUESTS=10       # Requests per hour
MAX_DURATION_SECONDS=600     # Max video length (10 min)
FRONTEND_URL=https://...     # CORS origin
```

### Frontend Configuration
Update the API URL in `index.html`:
```javascript
getApiUrl() {
    return window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://your-backend-url.onrender.com';
}
```

## 🚨 Limitations

- **Duration**: Maximum 10 minutes per video
- **Rate Limiting**: 10 downloads per hour per IP
- **Formats**: Audio only (no video downloads)
- **Quality**: Up to 128kbps for converted formats

## 📋 Requirements

### Backend
- Node.js 18+ 
- FFmpeg (auto-installed on most platforms)
- 512MB RAM minimum

### Frontend
- Modern browser with Web Audio API support
- JavaScript enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal Notice

This tool is for educational and personal use only. Users are responsible for complying with YouTube's Terms of Service and applicable copyright laws. The developers are not responsible for any misuse of this software.

## 🐛 Issues & Support

- **Bug Reports**: [Create an issue](https://github.com/EduAlexis/SptDwnloader/issues)
- **Feature Requests**: [Create an issue](https://github.com/EduAlexis/SptDwnloader/issues)
- **Questions**: Check existing issues or create a new one

## 🌟 Acknowledgments

- [ytdl-core](https://github.com/fent/node-ytdl-core) - YouTube video downloading
- [FFmpeg](https://ffmpeg.org/) - Audio/video processing
- [Express.js](https://expressjs.com/) - Web framework
- [GitHub Pages](https://pages.github.com/) - Frontend hosting

---

**⭐ If you found this project helpful, please give it a star!**
