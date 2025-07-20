
# Song Downloader API Documentation

## Base URL
- **Production**: `https://your-render-app.onrender.com`
- **Development**: `http://localhost:3000`

## Authentication
No authentication required. Rate limited to 10 requests per hour per IP.

## Endpoints

### 🏥 Health Check

#### `GET /`
Returns API status and basic information.

**Response:**
```json
{
  "message": "🎵 Song Downloader API is running!",
  "version": "1.0.0",
  "endpoints": ["/api/info", "/api/download"],
  "status": "healthy",
  "timestamp": "2025-07-20T12:00:00.000Z"
}
```

---

### 📺 Get Video Information

#### `POST /api/info`
Retrieves information about a YouTube video.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "title": "Video Title",
  "author": "Channel Name",
  "duration": "180",
  "durationFormatted": "3:00",
  "thumbnail": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
  "viewCount": "1000000",
  "uploadDate": "2025-01-01"
}
```

**Error Responses:**
- `400` - Invalid or missing URL
- `400` - Video too long (>10 minutes)
- `500` - Failed to fetch video information

---

### 🎵 Download Audio

#### `POST /api/download`
Downloads audio from a YouTube video in the specified format.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "format": "mp3"
}
```

**Parameters:**
- `url` (required): Valid YouTube URL
- `format` (optional): Audio format - `mp3`, `wav`, or `ogg` (default: `mp3`)

**Response:**
- **Content-Type**: `audio/mpeg`, `audio/wav`, or `audio/ogg`
- **Content-Disposition**: `attachment; filename="video_title.mp3"`
- **Body**: Binary audio file

**Error Responses:**
- `400` - Invalid URL or format
- `400` - Video too long (>10 minutes)
- `429` - Rate limit exceeded
- `500` - Download or conversion failed

---

## Rate Limiting

- **Limit**: 10 requests per hour per IP address
- **Window**: 1 hour (3600 seconds)
- **Headers**: No rate limit headers currently provided
- **Response**: `429 Too Many Requests` when exceeded

## Supported Formats

| Format | MIME Type    | Quality | Notes |
|--------|-------------|---------|-------|
| MP3    | audio/mpeg  | 128kbps | Most compatible |
| WAV    | audio/wav   | 128kbps | Uncompressed |
| OGG    | audio/ogg   | Original| Direct stream |

## Limitations

1. **Duration**: Maximum 10 minutes per video
2. **Rate Limiting**: 10 downloads per hour per IP
3. **File Size**: Depends on video length and format
4. **Formats**: Only audio extraction (no video)

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid URL or parameters |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error - Processing failed |
| 404  | Not Found - Invalid endpoint |

## Example Usage

### JavaScript/Fetch
```javascript
// Get video info
const infoResponse = await fetch('https://your-api.com/api/info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' 
  })
});
const info = await infoResponse.json();

// Download audio
const downloadResponse = await fetch('https://your-api.com/api/download', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    format: 'mp3'
  })
});
const audioBlob = await downloadResponse.blob();
```

### cURL
```bash
# Get video info
curl -X POST https://your-api.com/api/info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Download audio
curl -X POST https://your-api.com/api/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","format":"mp3"}' \
  --output song.mp3
```

## Legal Notice

This API is for educational and personal use only. Users are responsible for complying with YouTube's Terms of Service and applicable copyright laws.

## Support

For issues or questions:
- GitHub: [EduAlexis/SptDwnloader](https://github.com/EduAlexis/SptDwnloader)
- Create an issue for bug reports or feature requests
