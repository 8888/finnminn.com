# Configure the Azure Provider
provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
}

# Storage Account with Static Website Hosting
resource "azurerm_storage_account" "main" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"

  static_website {
    index_document = "index.html"
  }
}

# Note: CDN is not included due to limitations with Free Trial accounts:
# - Azure Front Door: Not available for Free Trial accounts
# - Azure CDN Standard Microsoft (classic): No longer supports new profile creation
# - Azure CDN Standard Akamai: Retired
# The storage account static website endpoint will be used directly instead.
# You can add CDN later when you upgrade your subscription.

