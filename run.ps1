# JavaScript TicTacToe Game Runner
# PowerShell script to test and run the JavaScript Tic Tac Toe game

param(
    [switch]$Test,
    [switch]$Serve,
    [switch]$Open,
    [switch]$Help
)

$ErrorActionPreference = "Stop"

Write-Host "🎮 JavaScript Tic Tac Toe Game" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

function Show-Help {
    Write-Host "사용법:" -ForegroundColor Yellow
    Write-Host "  .\run.ps1           - 브라우저에서 게임 열기"
    Write-Host "  .\run.ps1 -Test     - Node.js 테스트 실행"
    Write-Host "  .\run.ps1 -Serve    - HTTP 서버 시작 (npm run serve)"
    Write-Host "  .\run.ps1 -Open     - 브라우저에서 게임 열기"
    Write-Host "  .\run.ps1 -Help     - 이 도움말 표시"
    Write-Host ""
    Write-Host "NPM 명령어:" -ForegroundColor Yellow
    Write-Host "  npm run serve       - Node.js HTTP 서버 시작"
    Write-Host "  npm run test        - 테스트 실행"
    Write-Host "  npm run dev         - 개발 서버 시작 (serve와 동일)"
    Write-Host "  npm run open        - 브라우저에서 게임 열기"
    Write-Host ""
    Write-Host "필요사항:" -ForegroundColor Yellow
    Write-Host "  - 최신 브라우저 (Chrome, Firefox, Edge 등)"
    Write-Host "  - Node.js 18+ (서버 실행 및 테스트용)"
}

function Test-NodeAvailable {
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Host "✅ Node.js 발견: $nodeVersion" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "⚠️  Node.js가 설치되지 않음" -ForegroundColor Yellow
        return $false
    }
    return $false
}

function Test-NpmAvailable {
    try {
        $npmVersion = npm --version 2>$null
        if ($npmVersion) {
            Write-Host "✅ npm 발견: $npmVersion" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "⚠️  npm이 설치되지 않음" -ForegroundColor Yellow
        return $false
    }
    return $false
}

function Run-Tests {
    Write-Host "🧪 Node.js 테스트 실행 중..." -ForegroundColor Yellow
    
    if (-not (Test-NodeAvailable)) {
        Write-Host "❌ Node.js가 필요합니다. https://nodejs.org에서 다운로드하세요." -ForegroundColor Red
        return $false
    }
    
    if (Test-NpmAvailable) {
        Write-Host "npm run test 사용..." -ForegroundColor Cyan
        try {
            npm run test
            Write-Host "✅ 모든 테스트 통과!" -ForegroundColor Green
            return $true
        }
        catch {
            Write-Host "❌ 테스트 실패!" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "Node.js 테스트 러너 직접 사용..." -ForegroundColor Cyan
        try {
            Write-Host "Domain Layer 테스트..." -ForegroundColor Cyan
            node --test tests/domain/Position.test.js
            node --test tests/domain/GameBoard.test.js
            
            Write-Host "Application Layer 테스트..." -ForegroundColor Cyan
            node --test tests/application/GameEngine.test.js
            
            Write-Host "✅ 모든 테스트 통과!" -ForegroundColor Green
            return $true
        }
        catch {
            Write-Host "❌ 테스트 실패!" -ForegroundColor Red
            Write-Host $_.Exception.Message -ForegroundColor Red
            return $false
        }
    }
}

function Start-Server {
    Write-Host "🌐 HTTP 서버 시작 중..." -ForegroundColor Yellow
    
    if ((Test-NodeAvailable) -and (Test-NpmAvailable)) {
        Write-Host "npm run serve 사용..." -ForegroundColor Cyan
        Write-Host "🚀 서버를 중지하려면 Ctrl+C를 누르세요" -ForegroundColor Green
        Write-Host "브라우저에서 http://localhost:8080 을 열어주세요" -ForegroundColor Green
        Write-Host ""
        
        try {
            npm run serve
        }
        catch {
            Write-Host "❌ npm run serve 실패: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "Node.js 서버를 직접 시도합니다..." -ForegroundColor Yellow
            Start-NodeServer
        }
    }
    elseif (Test-NodeAvailable) {
        Write-Host "Node.js 서버 직접 실행..." -ForegroundColor Cyan
        Start-NodeServer
    }
    else {
        Write-Host "❌ Node.js가 필요합니다. https://nodejs.org에서 다운로드하세요." -ForegroundColor Red
        Write-Host "대신 index.html 파일을 브라우저에서 직접 열어주세요." -ForegroundColor Yellow
        Open-Game
    }
}

function Start-NodeServer {
    Write-Host "🚀 서버를 중지하려면 Ctrl+C를 누르세요" -ForegroundColor Green
    Write-Host "브라우저에서 http://localhost:8080 을 열어주세요" -ForegroundColor Green
    Write-Host ""
    
    if (Test-Path "server.cjs") {
        node server.cjs
    } else {
        Write-Host "❌ server.cjs 파일을 찾을 수 없습니다!" -ForegroundColor Red
        Write-Host "기본 Node.js 서버를 생성합니다..." -ForegroundColor Yellow
        
        $serverScript = @"
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(8080, () => {
    console.log('🌐 Server running at http://localhost:8080');
    console.log('⏹️  Press Ctrl+C to stop');
});
"@
        $serverScript | Out-File -FilePath "temp_server.cjs" -Encoding UTF8
        node temp_server.cjs
        Remove-Item "temp_server.cjs" -ErrorAction SilentlyContinue
    }
}

function Open-Game {
    Write-Host "🚀 브라우저에서 게임 열기..." -ForegroundColor Yellow
    
    $indexPath = Join-Path $PWD "index.html"
    
    if (-not (Test-Path $indexPath)) {
        Write-Host "❌ index.html 파일을 찾을 수 없습니다!" -ForegroundColor Red
        return
    }
    
    try {
        # Windows에서 기본 브라우저로 열기
        Start-Process $indexPath
        Write-Host "✅ 게임이 브라우저에서 열렸습니다!" -ForegroundColor Green
        Write-Host "만약 모듈 로드 오류가 발생하면 HTTP 서버를 사용하세요:" -ForegroundColor Yellow
        Write-Host "  .\run.ps1 -Serve" -ForegroundColor Cyan
        Write-Host "  또는 npm run serve" -ForegroundColor Cyan
    }
    catch {
        Write-Host "❌ 브라우저 열기 실패: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "수동으로 index.html 파일을 브라우저에서 열어주세요." -ForegroundColor Yellow
    }
}

function Show-ProjectInfo {
    Write-Host ""
    Write-Host "📁 프로젝트 구조:" -ForegroundColor Cyan
    Write-Host "├── src/" -ForegroundColor Gray
    Write-Host "│   ├── domain/           # 도메인 계층 (Position, GameBoard, Player)" -ForegroundColor Gray
    Write-Host "│   ├── application/      # 응용 계층 (GameEngine)" -ForegroundColor Gray
    Write-Host "│   └── infrastructure/   # 인프라 계층 (GameUI, CSS)" -ForegroundColor Gray
    Write-Host "├── tests/               # 테스트 파일들" -ForegroundColor Gray
    Write-Host "├── index.html           # 메인 HTML 파일" -ForegroundColor Gray
    Write-Host "├── server.cjs            # Node.js HTTP 서버" -ForegroundColor Gray
    Write-Host "└── package.json         # 프로젝트 설정" -ForegroundColor Gray
    Write-Host ""
}

# Main execution logic
try {
    if ($Help) {
        Show-Help
        Show-ProjectInfo
    }
    elseif ($Test) {
        Run-Tests
    }
    elseif ($Serve) {
        Start-Server
    }
    elseif ($Open) {
        Open-Game
    }
    elseif ($args.Count -eq 0 -and -not $Test -and -not $Serve -and -not $Open -and -not $Help) {
        # Default: Open game in browser
        Show-ProjectInfo
        Open-Game
    }
    else {
        Show-Help
    }
}
catch {
    Write-Host "❌ 오류 발생: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
