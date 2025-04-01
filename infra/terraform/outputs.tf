output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "storage_account_name" {
  value = azurerm_storage_account.storage.name
}

output "cosmosdb_name" {
  value = azurerm_cosmosdb_account.cosmosdb.name
}

output "function_app_name" {
  value = azurerm_linux_function_app.function.name # ✅ Fixed reference
}
