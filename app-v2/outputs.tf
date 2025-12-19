output "dns_zone_name_servers" {
  description = "Name servers assigned to the Azure DNS zone (if the zone exists in Azure). Set these at your registrar (Namecheap)."
  value       = data.azurerm_dns_zone.main.name_servers
  # Note: this will be empty/unknown until the zone exists in the specified resource group.
}

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

output "frontdoor_endpoint_hostname" {
  description = "Public hostname assigned to the Front Door endpoint"
  value       = azurerm_cdn_frontdoor_endpoint.main.host_name
}

output "frontdoor_custom_domain" {
  description = "Custom domain configured on Front Door"
  value       = azurerm_cdn_frontdoor_custom_domain.root.host_name
}

