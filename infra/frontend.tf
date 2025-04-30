resource "aws_s3_bucket" "static_site" {
  bucket = "photo-site-frontend-bucket" # must be globally unique
  force_destroy = true
}

output "frontend_bucket_name" {
  value = aws_s3_bucket.static_site.bucket
}

resource "aws_s3_bucket_public_access_block" "static_site_public_access" {
  bucket = aws_s3_bucket.static_site.id
}

resource "aws_s3_bucket_policy" "static_site_allow_public_read" {
  bucket = aws_s3_bucket.static_site.id
  policy = data.aws_iam_policy_document.frontend_allow_public_access_policy_document.json
}

data "aws_iam_policy_document" "frontend_allow_public_access_policy_document" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.static_site.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_public_access_block" "frontend_public_access_block" {
  bucket = aws_s3_bucket.static_site.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "static_site_web" {
  bucket = aws_s3_bucket.static_site.id

  index_document {
    suffix = "index.html"
  }
  
}
