# CI/CD Demo Project (Node.js + Docker + Jenkins)

![CI/CD Workflow](assets/cicd-workflow.png)

## Project Overview

This is a **CI/CD pipeline demo project** using:

- **Node.js** for application logic
- **Docker** for containerization
- **Jenkins** for CI/CD automation
- **GitHub** for source code management
- **Jest** for unit testing

The project demonstrates the **full DevOps pipeline** from code commit → automated build & test → Docker image push → optional deployment.

---

## Features

- Simple Node.js REST API
- Unit testing with Jest
- Dockerized application
- Jenkins pipeline for:
  - Pulling code from GitHub
  - Installing dependencies
  - Running tests
  - Building Docker images
  - Pushing Docker images to Docker Hub
- Clean Docker image cleanup after builds

## CI/CD Workflow

1. Developer pushes code to GitHub
2. GitHub webhook triggers Jenkins pipeline
3. Jenkins stages:
   - **Checkout code**
   - **Install dependencies** (`npm ci`)
   - **Run tests** (`npm test`)
   - **Build Docker image** (`docker build`)
   - **Push Docker image** (`docker push`)
