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

