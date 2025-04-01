terraform {
  backend "azurerm" {
    resource_group_name  = "carbon-platform-rg"
    storage_account_name = "carbonplatformstorage"
    container_name       = "terraform-state"
    key                  = "terraform.tfstate"
  }
}
