# ECR Repository
resource "aws_ecr_repository" "yolo_lambda_repo" {
  name = "yolo-lambda"
  force_delete = true
}

# SQS Queue
resource "aws_sqs_queue" "yolo_queue" {
  name = "yolo-image-queue"
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_yolo"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "lambda.amazonaws.com" },
      Action = "sts:AssumeRole"
    }]
  })
}

# IAM Policies
resource "aws_iam_role_policy_attachment" "basic_execution" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "s3_access" {
  name        = "lambda-s3-read"
  description = "Allow Lambda to read from S3"
  policy      = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect   = "Allow",
      Action   = "s3:*",
      Resource = ["arn:aws:s3:::${aws_s3_bucket.photos.id}", "arn:aws:s3:::${aws_s3_bucket.photos.id}/*"]
    }]
  })
}

resource "aws_iam_role_policy_attachment" "s3_access_attach" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.s3_access.arn
}

resource "aws_iam_role_policy" "lambda_vpc_networking" {
  name = "lambda-vpc-networking"
  role = aws_iam_role.lambda_exec_role.name

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_sqs" {
  name = "lambda-sqs-access"
  role = aws_iam_role.lambda_exec_role.name

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ],
        Resource = aws_sqs_queue.yolo_queue.arn
      }
    ]
  })
}

resource "aws_security_group" "lambda_sg" {
  name        = "cloud-photo-lambda-sg"
  description = "Lambda SG"
  vpc_id      = data.aws_vpc.default.id
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


# Lambda Function (container image)
resource "aws_lambda_function" "yolo_lambda" {
  function_name = "yolo-lambda"
  role          = aws_iam_role.lambda_exec_role.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.yolo_lambda_repo.repository_url}:latest"
  timeout       = 120
  memory_size   = 1024
  vpc_config {
    subnet_ids         = data.aws_subnets.private.ids
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  environment {
    variables = {
      DB_HOST = aws_rds_cluster_instance.serverless_v2.endpoint
      DB_PORT = aws_rds_cluster_instance.serverless_v2.port
      DB_NAME = local.db_name
      DB_USER = local.db_username
      DB_PASS = local.db_password
      BUCKET = aws_s3_bucket.photos.bucket
      TOPIC_ARN = aws_sns_topic.email_alerts.arn
    }
  }
}

# SQS Event Source Mapping
resource "aws_lambda_event_source_mapping" "lambda_sqs_trigger" {
  event_source_arn = aws_sqs_queue.yolo_queue.arn
  function_name    = aws_lambda_function.yolo_lambda.arn
  batch_size       = 1
  enabled          = true
}


output "ecr_url" {
  value = aws_ecr_repository.yolo_lambda_repo.repository_url
}

resource "aws_vpc_endpoint" "s3" {
  vpc_id            = data.aws_vpc.default.id
  service_name      = "com.amazonaws.${data.aws_region.current.name}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = data.aws_route_tables.private.ids

  tags = {
    Name = "s3-endpoint"
  }
}

resource "aws_sns_topic" "email_alerts" {
  name = "photo-process-email-alerts"
}

resource "aws_iam_policy" "lambda_sns_publish" {
  name = "lambda-sns-publish"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = "sns:Publish",
      Resource = aws_sns_topic.email_alerts.arn
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_sns_attach" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_sns_publish.arn
}

