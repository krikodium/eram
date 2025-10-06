#!/bin/bash

# ERAM Category Debugger - Installation Script
# Professional database debugging and fixing tools

echo "🔧 ERAM Category Debugger - Installation"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check for .env file
if [ ! -f "../.env" ]; then
    echo "⚠️  Warning: .env file not found in parent directory"
    echo "   Please ensure you have:"
    echo "   VITE_SUPABASE_URL=your_url_here"
    echo "   VITE_SUPABASE_ANON_KEY=your_key_here"
    echo ""
fi

# Create reports directory
mkdir -p reports
echo "✅ Reports directory created"

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Run analysis: npm run debug"
echo "   2. Review dry run: npm run fix-dry"
echo "   3. Apply fixes: npm run fix"
echo ""
echo "📖 For detailed instructions, see README.md"



