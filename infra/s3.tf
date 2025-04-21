resource "aws_s3_bucket" "code_versions" {
  bucket = "bme-cloud-assignment-code-versions"
}

resource "aws_s3_bucket" "photos" {
  bucket = "bme-cloud-assignment-photos"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "photos_public_access" {
  bucket = aws_s3_bucket.photos.id
}

resource "aws_s3_bucket_policy" "allow_public_access_policy" {
  bucket = aws_s3_bucket.photos.id
  policy = data.aws_iam_policy_document.allow_public_access_policy_document.json
}

data "aws_iam_policy_document" "allow_public_access_policy_document" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.photos.arn}/*",
    ]
  }
}
