# Dockerfile
FROM python:3.12
WORKDIR /app
#COPY . /app
COPY ../../* /app
RUN pip3 install -r requirements.txt
RUN rm -rf /app/banking/frontend && rm -rf /app/ci-cd/
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]