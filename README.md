# Zero-Knowledge Proof Loan Application System

This project implements a privacy-preserving loan application system using Zero-Knowledge Proofs (ZKP). The system allows users to apply for loans while maintaining their privacy by proving their eligibility without revealing sensitive information.

## System Architecture

The system consists of three servers and a frontend application:

1. **Credit Institution Server**
   - Makes loan approval decisions based on ZKP evidence
   - Validates ZKP proofs from other servers
   - Manages loan packages and approval process

2. **Bank Server**
   - Verifies financial conditions using ZKP
   - Confirms account balance and credit history
   - Provides ZKP proofs for financial data

3. **Civil Database Server**
   - Verifies personal and legal information using ZKP
   - Confirms age, marital status, and criminal history
   - Provides ZKP proofs for personal data

4. **Frontend Application**
   - User interface for loan applications
   - Displays personal information and loan packages
   - Handles the loan application process

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- TypeScript

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm run install:all
```

## Running the Application

To start all servers and the frontend application:

```bash
npm start
```

This will start:
- Frontend application on http://localhost:3000
- Credit Institution Server on http://localhost:3001
- Bank Server on http://localhost:3002
- Civil Database Server on http://localhost:3003

## Development

The project uses:
- React with TypeScript for the frontend
- Express.js for the backend servers
- Zero-Knowledge Proofs for privacy-preserving verification
- REST APIs for server communication

## Security Features

- Zero-Knowledge Proofs for all sensitive data verification
- No direct exposure of personal information
- Secure communication between servers
- Privacy-preserving loan application process

## License

MIT 