resource "aws_db_subnet_group" "aurora" {
  name       = "cloud-photo-backend-db-subnet-group"
  subnet_ids = data.aws_subnets.private.ids
}

resource "aws_security_group" "aurora" {
  name        = "cloud-photo-backend-db-sg"
  description = "Allow Postgres from Beanstalk"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.beanstalk.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_rds_cluster" "aurora" {
  cluster_identifier      = "cloud-photo-backend-db"
  engine                  = "aurora-postgresql"
  engine_mode             = "provisioned"
  engine_version          = "16.6"
  database_name           = local.db_name
  master_username         = local.db_username
  master_password         = local.db_password
  db_subnet_group_name    = aws_db_subnet_group.aurora.name
  vpc_security_group_ids  = [aws_security_group.aurora.id]
  skip_final_snapshot     = true

  serverlessv2_scaling_configuration  {
    max_capacity             = 1
    min_capacity             = 0
    seconds_until_auto_pause = 600
  }
}

resource "aws_rds_cluster_instance" "serverless_v2" {
  identifier         = "backend-serverless-v2"
  cluster_identifier = aws_rds_cluster.aurora.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.aurora.engine
  engine_version     = aws_rds_cluster.aurora.engine_version
  auto_minor_version_upgrade = true
}
