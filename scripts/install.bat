@echo off
REM ERAM Category Debugger - Installation Script for Windows
REM Professional database debugging and fixing tools

echo 🔧 ERAM Category Debugger - Installation
echo ========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Check for .env file
if not exist "..\.env" (
    echo ⚠️  Warning: .env file not found in parent directory
    echo    Please ensure you have:
    echo    VITE_SUPABASE_URL=your_url_here
    echo    VITE_SUPABASE_ANON_KEY=your_key_here
    echo.
)

REM Create reports directory
if not exist "reports" mkdir reports
echo ✅ Reports directory created

echo.
echo 🎉 Installation completed successfully!
echo.
echo 📋 Next steps:
echo    1. Run analysis: npm run debug
echo    2. Review dry run: npm run fix-dry
echo    3. Apply fixes: npm run fix
echo.
echo 📖 For detailed instructions, see README.md
pause



