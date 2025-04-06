terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.94.1"
    }
  }
  backend "s3" {
    bucket = "cloud-assignment-terraform"
    key    = "state"
  }
}

provider "aws" {
  default_tags {
    tags = {
      school = "BMEVIIIMB12"
    }
  }
}
