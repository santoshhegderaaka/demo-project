pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    environment {
        DEPLOY_DIR = "/home/${env.USER}/deployments/nodejs-app"
    }

    stages {

        stage('Checkout Source') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/<ORG>/<REPO>.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Generate Unit Tests using GitHub Copilot') {
            steps {
                sh '''
                mkdir -p tests

                for file in src/**/*.js; do
                  testFile=$(echo $file | sed 's/src/tests/' | sed 's/.js/.spec.js/')
                  mkdir -p $(dirname $testFile)

                  gh copilot suggest "
                  Generate Jest unit tests with mocks and edge cases for this Node.js file.
                  Output ONLY valid JavaScript test code.

                  $(cat $file)
                  " --language javascript > $testFile
                done
                '''
            }
        }

        stage('Run Unit Tests & Coverage') {
            steps {
                sh '''
                npm test -- --coverage
                '''
            }
        }

        stage('Publish Test Reports') {
            steps {
                junit allowEmptyResults: true, testResults: '**/junit.xml'
                publishHTML([
                    reportDir: 'coverage/lcov-report',
                    reportFiles: 'index.html',
                    reportName: 'Jest Coverage Report'
                ])
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Local Folder') {
            steps {
                sh '''
                rm -rf $DEPLOY_DIR
                mkdir -p $DEPLOY_DIR
                cp -r dist package.json package-lock.json $DEPLOY_DIR
                cd $DEPLOY_DIR
                npm install --production
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}
