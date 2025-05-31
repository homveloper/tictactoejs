const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;

// MIME 타입 매핑
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // 루트 경로면 index.html로 리다이렉트
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // 파일 경로 생성
    const filePath = path.join(__dirname, pathname);
    
    // 파일 확장자 추출
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // 파일 읽기 시도
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // 404 Not Found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - File Not Found</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            h1 { color: #e74c3c; }
                            a { color: #3498db; text-decoration: none; }
                        </style>
                    </head>
                    <body>
                        <h1>404 - File Not Found</h1>
                        <p>The requested file <code>${pathname}</code> was not found.</p>
                        <a href="/">Go back to the game</a>
                    </body>
                    </html>
                `, 'utf8');
            } else {
                // 500 Internal Server Error
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>500 - Server Error</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            h1 { color: #e74c3c; }
                        </style>
                    </head>
                    <body>
                        <h1>500 - Server Error</h1>
                        <p>Something went wrong on the server.</p>
                    </body>
                    </html>
                `, 'utf8');
            }
        } else {
            // 성공적으로 파일 전송
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache' // 개발 중 캐시 비활성화
            });
            res.end(content, 'utf8');
        }
    });
});

// 서버 시작
server.listen(PORT, () => {
    console.log('🎮 Tic Tac Toe Game Server');
    console.log('==========================');
    console.log(`🌐 Server running at http://localhost:${PORT}`);
    console.log('📁 Serving files from current directory');
    console.log('🚀 Open your browser and navigate to the URL above');
    console.log('⏹️  Press Ctrl+C to stop the server');
    console.log('');
});

// 우아한 종료 처리
process.on('SIGINT', () => {
    console.log('\n');
    console.log('🛑 Server stopping...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n');
    console.log('🛑 Server stopping...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});
