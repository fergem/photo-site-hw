resource "aws_elastic_beanstalk_application" "backend_application" {
  name        = "cloud-photo-backend"
  description = ""
}

resource "aws_elastic_beanstalk_environment" "backend_environment" {
  name                = "cloud-photo-backend-env"
  application         = aws_elastic_beanstalk_application.backend_application.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.5.0 running Corretto 21"
  cname_prefix        = "cloud-assignment-photo-backend"
  version_label       = aws_elastic_beanstalk_application_version.backend_version.name

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = aws_iam_role.aws_elasticbeanstalk_service_role.arn
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.beanstalk_instance_profile.name
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "COGNITO_USER_POOL_ID"
    value     = aws_cognito_user_pool.this.id
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "COGNITO_CLIENT_ID"
    value     = aws_cognito_user_pool_client.this.id
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_HOST"
    value     = aws_rds_cluster_instance.serverless_v2.endpoint
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PORT"
    value     = aws_rds_cluster_instance.serverless_v2.port
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_NAME"
    value     = local.db_name
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_USERNAME"
    value     = local.db_username
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PASSWORD"
    value     = local.db_password
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = data.aws_vpc.default.id
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", data.aws_subnets.private.ids)
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBSubnets"
    value     = join(",", data.aws_subnets.private.ids)
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.beanstalk.id
  }

}

resource "aws_security_group" "beanstalk" {
  name        = "cloud-photo-backend-app-sg"
  description = "Beanstalk instances SG"
  vpc_id      = data.aws_vpc.default.id
}

resource "terraform_data" "backend_version" {
  input = local.backend_version
}

resource "aws_s3_object" "backend_s3_object" {
  bucket = aws_s3_bucket.code_versions.id
  key    = "backend-v${terraform_data.backend_version.output}.zip"
  source = local.backend_artifact
}

resource "aws_elastic_beanstalk_application_version" "backend_version" {
  name        = "backend-v${terraform_data.backend_version.output}"
  application = aws_elastic_beanstalk_application.backend_application.name
  bucket      = aws_s3_bucket.code_versions.id
  key         = aws_s3_object.backend_s3_object.id
}
