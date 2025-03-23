# Create circuits directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "circuits"

# Generate a small powers of tau file
snarkjs powersoftau new bn128 12 circuits/pot12_0000.ptau -v
snarkjs powersoftau contribute circuits/pot12_0000.ptau circuits/pot12_0001.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 circuits/pot12_0001.ptau circuits/pot12_final.ptau -v

# Install circom if not already installed
if (-not (Get-Command circom -ErrorAction SilentlyContinue)) {
    npm install -g circom@2.1.4
}

# Compile the circuit
npm run compile-circuit

# Setup the circuit
npm run setup-circuit

# Generate verification key
npm run generate-verification-key

Write-Host "Circuit setup completed successfully!" 