locals {
  backend_version  = file("../backend/version.txt")
  backend_artifact = "../backend/build/distributions/app.zip"

  db_username      = "cloudphoto"
  db_password      = "cloudphoto"
  db_name          = "cloudphotodb"
}
