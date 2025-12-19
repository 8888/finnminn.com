resource "azurerm_cdn_frontdoor_profile" "main" {
  name                = var.frontdoor_profile_name
  resource_group_name = azurerm_resource_group.main.name
  sku_name            = "Standard_AzureFrontDoor"
}

resource "azurerm_cdn_frontdoor_endpoint" "main" {
  name                     = var.frontdoor_endpoint_name
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id
}

resource "azurerm_cdn_frontdoor_origin_group" "main" {
  name                     = "${var.frontdoor_endpoint_name}-og"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id

  session_affinity_enabled = false

  health_probe {
    interval_in_seconds = 120
    path                = "/"
    protocol            = "Https"
    request_type        = "GET"
  }

  load_balancing {
    sample_size                        = 4
    successful_samples_required        = 3
    additional_latency_in_milliseconds = 0
  }
}

resource "azurerm_cdn_frontdoor_origin" "static_site" {
  name                           = "${var.frontdoor_endpoint_name}-origin"
  cdn_frontdoor_origin_group_id  = azurerm_cdn_frontdoor_origin_group.main.id
  enabled                        = true
  host_name                      = azurerm_storage_account.main.primary_web_host
  http_port                      = 80
  https_port                     = 443
  origin_host_header             = azurerm_storage_account.main.primary_web_host
  certificate_name_check_enabled = true
  priority                       = 1
  weight                         = 1000
}

resource "azurerm_cdn_frontdoor_route" "main" {
  name                          = "${var.frontdoor_endpoint_name}-route"
  cdn_frontdoor_endpoint_id     = azurerm_cdn_frontdoor_endpoint.main.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.main.id
  cdn_frontdoor_origin_ids      = [azurerm_cdn_frontdoor_origin.static_site.id]

  patterns_to_match   = ["/*"]
  supported_protocols = ["Http", "Https"]

  forwarding_protocol    = "HttpsOnly"
  https_redirect_enabled = true
  link_to_default_domain = true
  enabled                = true

  cache {
    query_string_caching_behavior = "IgnoreQueryString"
  }
}

resource "azurerm_cdn_frontdoor_custom_domain" "root" {
  name                     = var.frontdoor_custom_domain_name
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id
  host_name                = var.custom_domain_fqdn

  tls {
    certificate_type    = "ManagedCertificate"
    minimum_tls_version = "TLS12"
  }
}

resource "null_resource" "wait_for_custom_domain" {
  depends_on = [azurerm_cdn_frontdoor_custom_domain.root]

  provisioner "local-exec" {
    command = "sleep 60"
  }
}

resource "azurerm_cdn_frontdoor_custom_domain_association" "root" {
  cdn_frontdoor_custom_domain_id = azurerm_cdn_frontdoor_custom_domain.root.id
  cdn_frontdoor_route_ids        = [azurerm_cdn_frontdoor_route.main.id]
  depends_on = [azurerm_cdn_frontdoor_route.main, null_resource.wait_for_custom_domain]
}


