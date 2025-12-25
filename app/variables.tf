variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "finnminn-rg"
}

variable "location" {
  description = "The Azure region where resources will be created"
  type        = string
  default     = "eastus"
}

variable "storage_account_name" {
  description = "The name of the storage account (must be globally unique, 3-24 characters, lowercase letters and numbers only)"
  type        = string
  default     = "finnminnstorage"
}

variable "frontdoor_profile_name" {
  description = "Azure Front Door profile name"
  type        = string
  default     = "finnminn-fd-profile"
}

variable "frontdoor_endpoint_name" {
  description = "Azure Front Door endpoint name (visible under *.azurefd.net)"
  type        = string
  default     = "finnminn-site"
}

variable "frontdoor_custom_domain_name" {
  description = "Friendly name for the Front Door custom domain resource"
  type        = string
  default     = "finnminn-com"
}

variable "custom_domain_fqdn" {
  description = "The fully qualified domain name served through Front Door"
  type        = string
  default     = "finnminn.com"
}

