# The DNS zone is created/managed outside of Terraform (e.g., Namecheap/Azure portal).
# Use a data lookup so Terraform manages the records but not the zone itself.
data "azurerm_dns_zone" "main" {
  name                = var.custom_domain_fqdn
  resource_group_name = azurerm_resource_group.main.name
}

# Create the custom domain for the static web app
resource "azurerm_static_web_app_custom_domain" "main" {
  static_web_app_id = azurerm_static_web_app.main.id
  domain_name       = var.custom_domain_fqdn
  validation_type   = "dns-txt-token"
}

# Create the TXT record required to validate the custom domain
resource "azurerm_dns_txt_record" "domain_validation" {
  name                = "_dnsauth"
  zone_name           = data.azurerm_dns_zone.main.name
  resource_group_name = azurerm_resource_group.main.name
  ttl                 = 3600

  record {
    value = azurerm_static_web_app_custom_domain.main.validation_token
  }
}

# Create a CNAME record to point the custom domain to the Static Web App
resource "azurerm_dns_cname_record" "main" {
  name                = "@"
  zone_name           = data.azurerm_dns_zone.main.name
  resource_group_name = azurerm_resource_group.main.name
  ttl                 = 3600
  record              = azurerm_static_web_app.main.default_host_name

  depends_on = [azurerm_static_web_app_custom_domain.main]
}