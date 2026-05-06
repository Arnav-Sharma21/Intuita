# Setup Script for Intuita Backend & Frontend
Write-Host "Installing Frontend Dependencies..."
npm install axios react-markdown concurrently -D

Write-Host "Installing Backend Dependencies..."
cd server
npm install
npm install express cors multer dotenv @google/generative-ai pdf-parse mammoth papaparse pdfkit
npm install -D typescript @types/express @types/node @types/multer @types/cors @types/pdfkit ts-node nodemon

cd ..
Write-Host "Setup Complete! You can now run: npm run dev"
