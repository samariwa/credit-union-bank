FROM jenkins/jenkins:lts
USER root
RUN apt update && apt install -y python3 python3-pip python3.11-venv && ln -s /usr/bin/python3 /usr/bin/python
USER jenkins
