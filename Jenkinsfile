pipeline {
    agent any

    environment {
        VENV = 'venv'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Setup Python Environment') {
            steps {
                // Create a virtual environment using python3.
                sh 'python3 -m venv ${VENV}'
                // Create a symlink so that "python" points to "python3" within the venv.
                sh 'ln -sf $(which python3) ${VENV}/bin/python'
                // Activate the virtual environment and upgrade pip.
                sh '. ${VENV}/bin/activate && pip install --upgrade pip'
            }
        }
        stage('Install Dependencies') {
            steps {
                // Activate the virtual environment and install requirements.
                sh '. ${VENV}/bin/activate && pip install -r requirements.txt'
            }
        }
        stage('Apply Migrations') {
            steps {
                // Run Django migrations.
                sh '. ${VENV}/bin/activate && python manage.py migrate'
            }
        }
        stage('Run Tests') {
            steps {
                // Run Django tests.
                sh '. ${VENV}/bin/activate && python manage.py test'
            }
        }
        //stage('Collect Static Files') {
        //    steps {
                // Collect static files for production.
        //        sh '. ${VENV}/bin/activate && python manage.py collectstatic --noinput'
        //    }
        //}
    }
    
    post {
        always {
            // Optionally archive any artifacts (like static files or test reports).
            archiveArtifacts artifacts: 'staticfiles/**', allowEmptyArchive: true
        }
        failure {
            echo 'Build failed. Please check the logs for details.'
        }
    }
}

