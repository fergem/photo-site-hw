resource "aws_iam_role" "aws_elasticbeanstalk_service_role" {
  name = "aws-elasticbeanstalk-service-role"
  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Sid" : "",
          "Effect" : "Allow",
          "Principal" : {
            "Service" : [
              "elasticbeanstalk.amazonaws.com"
            ]
          },
          "Action" : [
            "sts:AssumeRole"
          ],
          "Condition" : {
            "StringEquals" : {
              "sts:ExternalId" : "elasticbeanstalk"
            }
          }
        }
      ]
    }
  )
}

resource "aws_iam_policy_attachment" "beanstalk_admin_policy_attachment" {
  name       = "beanstalk-admin-policy-attachment"
  roles      = [aws_iam_role.aws_elasticbeanstalk_service_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess-AWSElasticBeanstalk"
}

resource "aws_iam_policy" "s3_policy" {
  name = "beanstalk-s3-policy"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "VisualEditor1",
        "Effect" : "Allow",
        "Action" : "s3:*",
        "Resource" : ["arn:aws:s3:::${aws_s3_bucket.photos.id}", "arn:aws:s3:::${aws_s3_bucket.photos.id}/*"]
      }
    ]
  })
}

resource "aws_iam_policy" "sqs_policy" {
  name = "beanstalk-sqs-policy"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "VisualEditor1",
        "Effect" : "Allow",
        "Action" : "sqs:sendmessage",
        "Resource" : [aws_sqs_queue.yolo_queue.arn]
      }
    ]
  })
}

resource "aws_iam_policy" "cognito_confirm_policy" {
  name = "beanstalk-cognito-policy"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "VisualEditor1",
        "Effect" : "Allow",
        "Action" : "cognito-idp:AdminConfirmSignUp",
        "Resource" : ["*"]
      }
    ]
  })
}

resource "aws_iam_role" "beanstalk_instance_role" {
  name = "beanstalk-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "ec2.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "beanstalk_ec2_policy" {
  role       = aws_iam_role.beanstalk_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

resource "aws_iam_role_policy_attachment" "beanstalk_s3_policy" {
  role       = aws_iam_role.beanstalk_instance_role.name
  policy_arn = aws_iam_policy.s3_policy.arn
}

resource "aws_iam_role_policy_attachment" "beanstalk_sqs_policy" {
  role       = aws_iam_role.beanstalk_instance_role.name
  policy_arn = aws_iam_policy.sqs_policy.arn
}

resource "aws_iam_role_policy_attachment" "beanstalk_cognito_policy" {
  role       = aws_iam_role.beanstalk_instance_role.name
  policy_arn = aws_iam_policy.cognito_confirm_policy.arn
}

resource "aws_iam_instance_profile" "beanstalk_instance_profile" {
  name = "beanstalk-ec2-instance-profile"
  role = aws_iam_role.beanstalk_instance_role.name
}
