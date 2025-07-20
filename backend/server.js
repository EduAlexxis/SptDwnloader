const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8080',
    'https://edualexis.github.io' // Your GitHub Pages URL
  ]
}));
app.use(express.json());

// Rate limiting (simple implementation)
const requests = new Map();
const RATE_LIMIT = 10; // requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requests.has(ip)) {
    requests.set(ip, []);
  }
  
  const userRequests = requests.get(ip);
  const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  
  recentRequests.push(now);
  requests.set(ip, recentRequests);
  next();
};

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: '🎵 Song Downloader API is running!',
    version: '1.0.0',
    endpoints: ['/api/info', '/api/download'],
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Get video info
app.post('/api/info', rateLimit, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    console.log(`Getting info for: ${url}`);
    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;

    // Check if video is too long (limit to 10 minutes)
    const maxDuration = 10 * 60; // 10 minutes in seconds
    if (parseInt(videoDetails.lengthSeconds) > maxDuration) {
      return res.status(400).json({ 
        error: 'Video is too long. Maximum duration is 10 minutes.' 
      });
    }

    res.json({
      title: videoDetails.title,
      author: videoDetails.author.name,
      duration: videoDetails.lengthSeconds,
      durationFormatted: formatDuration(videoDetails.lengthSeconds),
      thumbnail: videoDetails.thumbnails[0]?.url,
      viewCount: videoDetails.viewCount,
      uploadDate: videoDetails.uploadDate
    });

  } catch (error) {
    console.error('Error getting video info:', error);
    res.status(500).json({ 
      error: 'Failed to get video information. Please check the URL and try again.' 
    });
  }
});

// Download audio
app.post('/api/download', rateLimit, async (req, res) => {
  try {
    const { url, format = 'mp3' } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Validate format
    const allowedFormats = ['mp3', 'wav', 'ogg'];
    if (!allowedFormats.includes(format)) {
      return res.status(400).json({ error: 'Invalid format. Allowed: mp3, wav, ogg' });
    }

    console.log(`Downloading: ${url} as ${format}`);
    
    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;
    
    // Check duration again
    const maxDuration = 10 * 60;
    if (parseInt(videoDetails.lengthSeconds) > maxDuration) {
      return res.status(400).json({ 
        error: 'Video is too long. Maximum duration is 10 minutes.' 
      });
    }

    const title = sanitizeFilename(videoDetails.title);

    // Set response headers
    res.setHeader('Content-Type', getContentType(format));
    res.setHeader('Content-Disposition', `attachment; filename="${title}.${format}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    // Create audio stream with highest quality
    const audioStream = ytdl(url, {
      quality: 'highestaudio',
      filter: 'audioonly'
    });

    // Handle stream errors
    audioStream.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to stream audio' });
      }
    });

    // Convert audio based on format
    if (format === 'mp3') {
      const ffmpegCommand = ffmpeg(audioStream)
        .audioBitrate(128)
        .audioChannels(2)
        .audioFrequency(44100)
        .format('mp3')
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Audio conversion failed' });
          }
        })
        .on('start', (commandLine) => {
          console.log('FFmpeg process started:', commandLine);
        });

      ffmpegCommand.pipe(res);
      
    } else if (format === 'wav') {
      ffmpeg(audioStream)
        .audioBitrate(128)
        .audioChannels(2)
        .audioFrequency(44100)
        .format('wav')
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Audio conversion failed' });
          }
        })
        .pipe(res);
        
    } else {
      // For ogg or direct stream
      audioStream.pipe(res);
    }

  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Download failed. Please try again.' 
      });
    }
  }
});

// Utility functions
function sanitizeFilename(filename) {
  return filename
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 100); // Limit length
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getContentType(format) {
  const types = {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg'
  };
  return types[format] || 'audio/mpeg';
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Song Downloader API running on port ${PORT}`);
  console.log(`📖 Health check: http://localhost:${PORT}/`);
  console.log(`🎵 Ready to download songs!`);
});

module.exports = app;
