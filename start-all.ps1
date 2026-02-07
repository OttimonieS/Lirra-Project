# Start All Lirra Services
Write-Host "tarting Lirra Services..." -ForegroundColor Cyan
Write-Host ""

# Start Landing Page Frontend
Write-Host "Starting Landing Page Frontend (Port 5173)..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\lirra-landingpage'; npm run dev"
Start-Sleep -Seconds 2

# Start Landing Page API
Write-Host "Starting Landing Page API (Port 3001)..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\lirra-landingpage'; npm run api"
Start-Sleep -Seconds 2

# Start Dashboard Frontend
Write-Host "Starting Dashboard Frontend (Port 5174)..." -ForegroundColor Blue
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\lirra-dashboard'; npm run dev"
Start-Sleep -Seconds 2

# Start Dashboard API
Write-Host "Starting Dashboard API (Port 3000)..." -ForegroundColor Blue
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\lirra-dashboard'; npm run api"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "âœ… All services started!" -ForegroundColor Green
Write-Host "Services running on:" -ForegroundColor Yellow
Write-Host "  Landing Page: http://localhost:5173" -ForegroundColor White
Write-Host "  Landing API:  http://localhost:3001" -ForegroundColor White
Write-Host "  Dashboard:    http://localhost:5174" -ForegroundColor White
Write-Host "  Dashboard API: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to close this launcher..." -ForegroundColor Cyan
Read-Host
