pipeline {
  agent any

  environment {
    // change to your docker hub image name (without tag)
    DOCKER_IMAGE = "krsaikrishna/cicd-demo"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          // tag with build number for traceability
          IMAGE_TAG = "${env.BUILD_NUMBER}"
          sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} ."
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        // Replace 'dockerhub-credentials' with the id you create in Jenkins (username/password)
        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh "docker push ${DOCKER_IMAGE}:${IMAGE_TAG}"
          // also push latest
          sh "docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest || true"
          sh "docker push ${DOCKER_IMAGE}:latest || true"
        }
      }
    }

    stage('Cleanup') {
      steps {
        sh 'docker image prune -f || true'
      }
    }
  }

  post {
    success {
      echo "Build and push succeeded: ${DOCKER_IMAGE}:${IMAGE_TAG}"
    }
    failure {
      echo "Build failed"
    }
  }
}

