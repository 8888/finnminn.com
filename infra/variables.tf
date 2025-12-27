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

variable "static_web_app_name" {
  description = "The name of the static web app (must be globally unique)"
  type        = string
  default     = "finnminn-app"
}

variable "custom_domain_fqdn" {
  description = "The fully qualified domain name for the static web app"
  type        = string
  default     = "finnminn.com"
}