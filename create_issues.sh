#!/bin/bash

# Set the repository
REPO="https://github.com/exzing/exzing-energyx"

# Define issues
issues=(
  "Set up GitHub Project Board::Track progress & backlog management"
  "Define MVP scope & key features::List core functionalities & user stories"
  "Finalize API endpoints & database schema::Design API contracts & DB models"
  "Implement backend structure (FastAPI, Azure Functions)::Set up core backend services"
  "Implement frontend structure (React.js, Next.js)::Initialize UI components"
  "Configure Azure services (Cosmos DB, AI, Blockchain)::Provision required cloud resources"
  "Develop authentication system (JWT, OAuth2)::Implement secure user login"
  "Implement core API endpoints for carbon tracking::Build data ingestion endpoints"
  "Set up database models & ORM (Cosmos DB, SQLAlchemy)::Define DB schemas"
  "Implement AI analytics API (prediction models)::Integrate AI insights into backend"
  "Create UI for carbon footprint dashboard::Build interactive frontend"
  "Integrate API calls with backend services::Connect frontend to APIs"
  "Implement user authentication & role-based access::Secure different user roles"
  "Write Solidity smart contract for carbon credits::Develop blockchain contracts"
  "Deploy contract on testnet & integrate with backend::Test smart contract transactions"
  "Write unit tests for backend APIs::Ensure API reliability"
  "Implement end-to-end testing for frontend/backend::Validate full user flows"
  "Optimize database queries & API response times::Improve performance"
  "Deploy MVP on Azure (App Service/Kubernetes)::Launch minimal working product"
  "Set up logging & monitoring (Azure Monitor, App Insights)::Monitor system health"
)

# Create issues using GitHub CLI
for issue in "${issues[@]}"; do
  IFS="::" read -r title description <<< "$issue"
  gh issue create --repo "$REPO" --title "$title" --body "$description" --label "VP"
done

echo " Issues successfully created!"
