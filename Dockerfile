# Use an official Python runtime as a parent image
FROM python:3.9-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install required packages specified in requirements.txt
RUN pip install -r requirements.txt

# Set environment variable for Flask
# ENV FLASK_APP=app.py

# Expose port 5000 for Flask to listen on
EXPOSE 5000

# Define the command to run the Flask app
CMD ["flask", "run"]