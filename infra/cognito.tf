resource "aws_cognito_user_pool" "this" {
  name                     = "photo-site-user-pool"
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]


  password_policy {
    minimum_length    = 6
    require_lowercase = true
    require_uppercase = false
    require_numbers   = false
    require_symbols   = false
  }

  schema {
    attribute_data_type      = "Number"
    developer_only_attribute = false
    mutable                  = true
    name                     = "subscribed"
    required                 = false

    number_attribute_constraints {
      max_value = "1"
      min_value = "0"
    }
  }
}

resource "aws_cognito_user_pool_client" "this" {
  name            = "photo-site-app-client"
  user_pool_id    = aws_cognito_user_pool.this.id
  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ]

  supported_identity_providers  = ["COGNITO"]
  prevent_user_existence_errors = "ENABLED"

  read_attributes = [
    "custom:subscribed",
    "email",
  ]

  write_attributes = [
    "custom:subscribed"
  ]
}
