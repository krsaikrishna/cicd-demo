pipeline {
  agent any

  environment {
    DOCKER_IMAGE = "krsaikrishna/cicd-demo"
    KUBE_DEPLOYMENT = "k8s/k8s-deployment.yaml"
    KUBE_SERVICE = "k8s/k8s-service.yaml"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npm test'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          IMAGE_TAG = "${env.BUILD_NUMBER}"
          sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} ."
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh "docker push ${DOCKER_IMAGE}:${IMAGE_TAG}"
          sh "docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest"
          sh "docker push ${DOCKER_IMAGE}:latest"
        }
      }
    }

    stage('Setup Kubeconfig') {
      steps {
        withCredentials([file(credentialsId: 'kubeconfig-minikube', variable: 'KUBECONFIG_FILE')]) {
          sh '''
            echo "Setting up kubeconfig for Jenkins user..."
            mkdir -p $HOME/.kube
            cp $KUBECONFIG_FILE $HOME/.kube/config
            chmod 600 $HOME/.kube/config
            echo "✅ Kubeconfig setup complete."
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          sh '''
            echo "Deploying to Kubernetes..."
            kubectl apply -f ${KUBE_DEPLOYMENT}
            kubectl apply -f ${KUBE_SERVICE}
            kubectl get pods
          '''
        }
      }
    }

    stage('Cleanup Docker') {
      steps {
        sh 'docker image prune -f || true'
      }
    }
  }

  post {
    success {
      echo "✅ CI/CD pipeline completed successfully!"
    }
    failure {
      echo "❌ Deployment failed!"
    }
  }
}
