# File Viewer

A web-based file viewer application that supports previewing Excel and Word documents. This application provides an easy-to-use interface for uploading and viewing office documents directly in your browser.

## Features

- File upload functionality
- Support for Excel (.xlsx) files
- Support for Word (.docx) files
- Unique file identification using UUID
- Web-based preview interface
- Express.js powered backend

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`
3. Upload your Excel or Word documents using the interface
4. View your documents in the browser

## Dependencies

- express (^4.18.2) - Web application framework
- express-fileupload (^1.4.0) - Middleware for handling file uploads
- uuid (^9.0.0) - Unique identifier generation
- mammoth (^1.6.0) - Word document processing

## Project Structure

```
file-viewer/
├── server.js          # Main server file
├── public/            # Static files
│   └── index.html     # Main frontend interface
└── uploads/           # Directory for uploaded files
```

## License

This project is open source and available under the MIT License.
