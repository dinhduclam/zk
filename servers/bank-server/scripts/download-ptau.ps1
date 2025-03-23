# Create circuits directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "circuits"

# Download powers of tau file using curl
curl -o circuits/pot12_final.ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau

Write-Host "Powers of tau file downloaded successfully!" 