output "storage_account_name" {
  description = "The name of the deployed storage account"
  value       = azurerm_storage_account.main.name
}

output "static_website_url" {
  description = "The primary URL for the static website"
  value       = azurerm_storage_account.main.primary_web_endpoint
}

output "static_website_host" {
  description = "The hostname of the static website"
  value       = azurerm_storage_account.main.primary_web_host
}


output "frontdoor_endpoint_hostname" {
  description = "The hostname of the Front Door endpoint"
  value       = azurerm_cdn_frontdoor_endpoint.main.host_name
}

output "frontdoor_custom_domain" {
  description = "The custom domain FQDN"
  value       = azurerm_cdn_frontdoor_custom_domain.root.host_name
}

output "dns_zone_name_servers" {
  description = "The name servers for the DNS zone"
  value       = data.azurerm_dns_zone.main.name_servers
}
