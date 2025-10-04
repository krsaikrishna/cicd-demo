pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')   // Your DockerHub credentials ID
        IMAGE_NAME = "krsaikrishna/cicd-demo"              // Replace with your repo name
        KUBECONFIG_CRED = 'kubeconfig-minikube'                       // The Jenkins secret file ID
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/krsaikrishna/cicd-demo.git'
            }
        }

        stage('Build App') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $IMAGE_NAME:latest .
                docker images | grep cicd-demo
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                docker push $IMAGE_NAME:latest
                '''
            }
        }

        stage('Setup Kubeconfig') {
            steps {
                withCredentials([file(credentialsId: "${KUBECONFIG_CRED}", variable: 'KUBECONFIG_FILE')]) {
                    sh '''
                    mkdir -p $HOME/.kube
                    cp $KUBECONFIG_FILE $HOME/.kube/config
                    chmod 600 $HOME/.kube/config
                    kubectl config use-context minikube
                    kubectl get nodes
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f k8s/k8s-deployment.yaml --validate=false
                kubectl apply -f k8s/k8s-service.yaml --validate=false
                kubectl rollout status deployment/cicd-demo
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
