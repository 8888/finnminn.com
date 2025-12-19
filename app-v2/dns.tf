// DNS records for finnminn.com

// The DNS zone is created/managed outside of Terraform (Namecheap/Azure portal).
// Use a data lookup so Terraform manages the records but not the zone itself.
data "azurerm_dns_zone" "main" {
  name                = var.custom_domain_fqdn
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_dns_cname_record" "www" {
  name                = "www"
  zone_name           = data.azurerm_dns_zone.main.name
  resource_group_name = azurerm_resource_group.main.name
  ttl                 = 3600
  record              = azurerm_cdn_frontdoor_endpoint.main.host_name
}

resource "azurerm_dns_a_record" "apex" {
  name                = "@"
  zone_name           = data.azurerm_dns_zone.main.name
  resource_group_name = azurerm_resource_group.main.name
  ttl                 = 3600

  target_resource_id = azurerm_cdn_frontdoor_endpoint.main.id
}
