locals {
  backend_version  = file("../backend/version.txt")
  backend_artifact = "../backend/build/distributions/app.zip"
}
