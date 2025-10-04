pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')   // Jenkins credentials ID
        DOCKER_IMAGE = "krsaikrishna/cicd-demo"
        KUBECONFIG_FILE = "/home/ubuntu/.kube/config"  // Path on Jenkins server
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📦 Checking out code..."
                checkout scm
            }
        }

        stage('Build App') {
            steps {
                echo "⚙️ Building the application..."
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                sh '''
                    docker build -t $DOCKER_IMAGE:${BUILD_NUMBER} .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "📤 Pushing Docker image to Docker Hub..."
                sh '''
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                    docker push $DOCKER_IMAGE:${BUILD_NUMBER}
                '''
            }
        }

        stage('Setup Kubeconfig') {
            steps {
                echo "🧩 Setting up kubeconfig for Jenkins user..."
                sh '''
                    # Ensure Jenkins home kube directory exists
                    mkdir -p /var/lib/jenkins/.kube

                    # If config is accidentally a directory, remove it safely
                    if [ -d /var/lib/jenkins/.kube/config ]; then
                        echo "🧹 Removing incorrect directory at /var/lib/jenkins/.kube/config"
                        rm -rf /var/lib/jenkins/.kube/config
                    fi

                    # Copy kubeconfig file
                    cp $KUBECONFIG_FILE /var/lib/jenkins/.kube/config

                    # Fix permissions
                    chown -R jenkins:jenkins /var/lib/jenkins/.kube
                    chmod 600 /var/lib/jenkins/.kube/config

                    echo "✅ Kubeconfig setup complete."
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "🚀 Deploying application to Kubernetes..."
                sh '''
                    kubectl set image deployment/cicd-demo \
                        cicd-demo=$DOCKER_IMAGE:${BUILD_NUMBER} --record || \
                    kubectl apply -f k8s/deployment.yaml
                '''
            }
        }
    }

    post {
        success {
            echo "🎉 Deployment successful!"
        }
        failure {
            echo "❌ Pipeline failed. Please check the logs."
        }
    }
}
