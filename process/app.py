import boto3
import cv2
import numpy as np
import psycopg2
import json
from urllib.parse import urlparse
from ultralytics import YOLO
import os

s3 = boto3.client("s3")
model = YOLO("yolov8n.pt")

DB_HOST = os.environ["DB_HOST"]
DB_PORT = os.environ.get("DB_PORT", "5432")
DB_NAME = os.environ["DB_NAME"]
DB_USER = os.environ["DB_USER"]
DB_PASS = os.environ["DB_PASS"]
BUCKET = os.environ["BUCKET"]

def lambda_handler(event, context):
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
    cur = conn.cursor()

    for record in event['Records']:
        msg = json.loads(record['body'])
        db_id = msg['id']
        s3_url = msg['url']

        key = s3_url.split("/")[-1]

        # Download image
        print(f"Downloading image from S3: {BUCKET=}, {key=}")
        image_obj = s3.get_object(Bucket=BUCKET, Key=key)
        print("Downloaded image from S3")
        image_data = image_obj['Body'].read()
        image_array = np.frombuffer(image_data, dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        print("Decoded image")

        # Detect people
        results = model(image)[0]
        count = 0
        for box in results.boxes:
            if results.names[int(box.cls[0])] == "person":
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
                count += 1

        # Overwrite original image
        _, buffer = cv2.imencode('.jpg', image)
        print("Encoded image")
        print(f"Detected {count} people in image")
        # Upload image back to S3
        print(f"Uploading image back to S3: {BUCKET=}, {key=}")
        s3.put_object(Bucket=BUCKET, Key=key, Body=buffer.tobytes(), ContentType='image/jpeg')
        print("Uploaded image back to S3")

        # Update DB by ID
        cur.execute("UPDATE Photo SET number_of_people = %s WHERE id = %s;", (count, db_id))
        conn.commit()

        print(f"Updated DB ID {db_id} with {count} people detected")

    cur.close()
    conn.close()
    return {"statusCode": 200}
