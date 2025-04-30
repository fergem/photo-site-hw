FROM public.ecr.aws/lambda/python:3.10

# Install system dependencies
RUN yum -y update && \
    yum -y install gcc ffmpeg libSM libXext mesa-libGL mesa-libGL-devel postgresql-devel python3-devel && \
    yum clean all

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install ultralytics opencv-python-headless psycopg2-binary numpy

# Copy model and handler
COPY yolov8n.pt ./
COPY app.py ./

# Set the CMD to your handler
CMD ["app.lambda_handler"]
