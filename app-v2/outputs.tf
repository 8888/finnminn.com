# Storage Account Static Website Endpoint
output "static_website_url" {
  description = "The primary endpoint URL for the static website (use this to access your site)"
  value       = azurerm_storage_account.main.primary_web_endpoint
}

# Storage Account Name
output "storage_account_name" {
  description = "The name of the storage account (for manual file upload reference)"
  value       = azurerm_storage_account.main.name
}

# Storage Account Static Website Host
output "static_website_host" {
  description = "The hostname of the static website endpoint"
  value       = azurerm_storage_account.main.primary_web_host
}

