variable "location" {
  description = "The Azure region for resource deployment"
  type        = string
  default     = "southafricanorth"
}

variable "resource_group_name" {
  description = "The name of the Azure Resource Group"
  type        = string
  default     = "carbon-platform-rg"
}

variable "storage_account_name" {
  description = "The name of the Azure Storage Account"
  type        = string
  default     = "carbonplatformstorage"
}

variable "cosmosdb_name" {
  description = "The name of the Azure CosmosDB instance"
  type        = string
  default     = "carbonplatformcosmos"
}

variable "app_service_plan_name" {
  description = "The name of the Azure App Service Plan"
  type        = string
  default     = "carbon-platform-plan"
}

variable "function_app_name" {
  description = "The name of the Azure Function App"
  type        = string
  default     = "carbon-platform-function"
}
