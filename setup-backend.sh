#!/bin/bash

# Aphrodite Backend Setup Script
# This script automates all the setup steps from the backend README

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."

    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"

        # Check if version is 16 or higher
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$MAJOR_VERSION" -lt 16 ]; then
            print_error "Node.js version 16 or higher is required. Current version: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js v16 or higher."
        exit 1
    fi

    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi

    # Check MongoDB (optional check - might be cloud-based)
    if command_exists mongod; then
        print_success "MongoDB is installed locally"
    else
        print_warning "MongoDB not found locally. Make sure you have access to a MongoDB instance (local or cloud)."
    fi
}

# Navigate to backend directory
navigate_to_backend() {
    print_status "Navigating to backend directory..."

    if [ -d "aphrodite-backend" ]; then
        cd aphrodite-backend
        print_success "Changed to aphrodite-backend directory"
    else
        print_error "aphrodite-backend directory not found. Please run this script from the project root."
        exit 1
    fi
}

# Install backend dependencies
install_backend_dependencies() {
    print_status "Installing backend dependencies..."
    npm install
    print_success "Backend dependencies installed"
}

# Install admin panel dependencies
install_admin_dependencies() {
    print_status "Installing admin panel dependencies..."

    if [ -d "admin-panel" ]; then
        cd admin-panel
        npm install
        cd ..
        print_success "Admin panel dependencies installed"
    else
        print_error "admin-panel directory not found"
        exit 1
    fi
}

# Setup environment configuration
setup_environment() {
    print_status "Setting up environment configuration..."

    if [ -f ".env.example" ]; then
        if [ ! -f ".env" ]; then
            cp .env.example .env
            print_success "Created .env file from .env.example"
            print_warning "Please update the .env file with your configuration before running the server"
        else
            print_warning ".env file already exists. Skipping creation."
        fi
    else
        print_warning ".env.example not found. Creating a basic .env file..."
        cat > .env << EOL
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/aphrodite
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here_$(date +%s)
ADMIN_EMAIL=admin@aphrodite.com
ADMIN_PASSWORD=admin123
CORS_ORIGIN=http://localhost:3000
EOL
        print_success "Created basic .env file"
    fi
}

# Create upload directories
create_upload_directories() {
    print_status "Creating upload directories..."

    mkdir -p uploads/products
    mkdir -p uploads/categories

    print_success "Upload directories created"
}

# Seed database (optional)
seed_database() {
    print_status "Database seeding options:"
    echo "1. Seed database with sample data"
    echo "2. Skip database seeding"
    read -p "Choose an option (1 or 2): " SEED_CHOICE

    case $SEED_CHOICE in
        1)
            print_status "Seeding database with sample data..."
            if [ -f "src/utils/seed.js" ]; then
                node src/utils/seed.js
                print_success "Database seeded successfully"
            else
                print_error "Seed file not found at src/utils/seed.js"
                print_warning "You can seed the database later by running: node src/utils/seed.js"
            fi
            ;;
        2)
            print_status "Skipping database seeding"
            ;;
        *)
            print_warning "Invalid choice. Skipping database seeding"
            ;;
    esac
}

# Build admin panel for production (optional)
build_admin_panel() {
    print_status "Build options:"
    echo "1. Build admin panel for production"
    echo "2. Skip building (development mode)"
    read -p "Choose an option (1 or 2): " BUILD_CHOICE

    case $BUILD_CHOICE in
        1)
            print_status "Building admin panel for production..."
            cd admin-panel
            npm run build
            cd ..
            print_success "Admin panel built successfully"
            ;;
        2)
            print_status "Skipping admin panel build"
            ;;
        *)
            print_warning "Invalid choice. Skipping admin panel build"
            ;;
    esac
}

# Start the application
start_application() {
    print_status "Starting options:"
    echo "1. Start in development mode (with nodemon)"
    echo "2. Start in production mode"
    echo "3. Start admin panel only"
    echo "4. Exit without starting"
    read -p "Choose an option (1-4): " START_CHOICE

    case $START_CHOICE in
        1)
            print_success "Starting in development mode..."
            print_status "Server will start at http://localhost:3001"
            print_status "Admin panel will be available at http://localhost:3001/admin"
            npm run dev
            ;;
        2)
            print_success "Starting in production mode..."
            print_status "Server will start at http://localhost:3001"
            print_status "Admin panel will be available at http://localhost:3001/admin"
            npm start
            ;;
        3)
            print_success "Starting admin panel only..."
            npm run admin
            ;;
        4)
            print_status "Setup completed. You can start the server later with:"
            echo "  - Development: npm run dev"
            echo "  - Production: npm start"
            echo "  - Admin only: npm run admin"
            ;;
        *)
            print_warning "Invalid choice. Setup completed without starting the server"
            ;;
    esac
}

# Print final instructions
print_final_instructions() {
    echo ""
    print_success "🎉 Aphrodite Backend Setup Complete!"
    echo ""
    print_status "Next steps:"
    echo "1. Update your .env file with the correct MongoDB URI and other settings"
    echo "2. Make sure MongoDB is running (if using local instance)"
    echo "3. Start the server with: npm run dev"
    echo "4. Access the admin panel at: http://localhost:3001/admin"
    echo "5. Login with: admin@aphrodite.com / admin123 (or your custom credentials)"
    echo ""
    print_status "API Documentation:"
    echo "- Public API: http://localhost:3001/api/public/*"
    echo "- Admin API: http://localhost:3001/api/*"
    echo ""
    print_status "Useful commands:"
    echo "- Development: npm run dev"
    echo "- Production: npm start"
    echo "- Admin panel: npm run admin"
    echo "- Seed database: node src/utils/seed.js"
    echo ""
}

# Main execution
main() {
    echo ""
    print_status "🚀 Starting Aphrodite Backend Setup..."
    echo ""

    check_prerequisites
    navigate_to_backend
    install_backend_dependencies
    install_admin_dependencies
    setup_environment
    create_upload_directories
    seed_database
    build_admin_panel

    print_final_instructions

    # Ask if user wants to start the server
    echo ""
    read -p "Would you like to start the server now? (y/n): " START_NOW
    case $START_NOW in
        [Yy]*)
            start_application
            ;;
        *)
            print_status "Setup complete. You can start the server later using the commands above."
            ;;
    esac
}

# Run the main function
main "$@"