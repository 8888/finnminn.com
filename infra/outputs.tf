output "static_web_app_url" {
  description = "The URL of the static web app"
  value       = "https://${azurerm_static_web_app.main.default_host_name}"
}

output "custom_domain_validation_token" {
  description = "The TXT token required to validate the custom domain. Create a TXT record named '_dnsauth' with this value."
  value       = azurerm_static_web_app_custom_domain.main.validation_token
  sensitive   = true
}