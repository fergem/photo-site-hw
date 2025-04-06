resource "aws_s3_bucket" "static_site" {
  bucket = "photo-site-frontend-bucket" # must be globally unique
  force_destroy = true
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

resource "aws_s3_bucket_website_configuration" "static_site_web" {
  bucket = aws_s3_bucket.static_site.id

  index_document {
    suffix = "index.html"
  }
  
}

resource "aws_s3_object" "frontend_js_assets_s3_object" {
    for_each = fileset("../frontend/dist/assets", "**.js")
  bucket = aws_s3_bucket.static_site.id
  key    = "assets/${each.value}"
  source = "../frontend/dist/assets/${each.value}"
  content_type = "text/javascript"
}

resource "aws_s3_object" "frontend_css_assets_s3_object" {
    for_each = fileset("../frontend/dist/assets", "**.css")
  bucket = aws_s3_bucket.static_site.id
  key    = "assets/${each.value}"
  source = "../frontend/dist/assets/${each.value}"
  content_type = "text/css"
}

resource "aws_s3_object" "frontend_index_s3_object" {
  bucket = aws_s3_bucket.static_site.id
  key    = "index.html"
  source = "../frontend/dist/index.html"
  content_type = "text/html"
}

resource "aws_s3_object" "frontend_icon_s3_object" {
  bucket = aws_s3_bucket.static_site.id
  key    = "vite.svg"
  source = "../frontend/dist/vite.svg"
}
