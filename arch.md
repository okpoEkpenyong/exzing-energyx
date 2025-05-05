                                     +-----------------------+
                                     |     End Users (Web)   |
                                     |  - Sustainability Orgs|
                                     |  - Enterprises        |
                                     +-----------+-----------+
                                                 |
                                                 v
                                   +-------------+-------------+
                                   |   Azure App Services /    |
                                   |   Static Web Apps (UI)    |
                                   +-------------+-------------+
                                                 |
                                                 v
                              +------------------+------------------+
                              |      Azure API Layer (App Service)  |
                              |  - RESTful APIs                      |
                              |  - BFF for UI, IoT, Blockchain, etc.|
                              +------------------+------------------+
                                                 |
        +-----------------------------+----------+----------+------------------------------+
        |                             |                     |                              |
        v                             v                     v                              v
+---------------+         +------------------+   +-------------------------+   +------------------------+
| Azure SQL DB  |         | Azure IoT Hub     |   | Azure Functions /      |   | Azure Confidential     |
| (Structured   | <-----> | (Device Telemetry |   | Container Apps (Logic) |   | Ledger (Carbon Credits)|
| emissions,    |         |  ingestion)       |   | Microservices for:     |   | Blockchain registry)   |
| credits, logs)|         +------------------+   | - Emission Calc         |   +------------------------+
+---------------+                               | - Tokenization          |
                                                | - Notifications, etc.   |
                                                +-------------------------+

          +-------------------------+
          | Microsoft Sustainability|
          | APIs (emission factors, |
          | carbon scoring, etc.)   |
          +-----------+-------------+
                      |
                      v
              Consumed by Logic Layer
              for emissions tracking

          +-------------------------+
          | Azure AD B2C           |
          | (Multi-tenant Identity |
          |  Management)           |
          +-------------------------+

          +-------------------------+
          | Azure Key Vault        |
          | (Secrets, Certificates)|
          +-------------------------+

          +-------------------------+
          | GitHub Actions         |
          | (CI/CD Pipelines)      |
          +-------------------------+

          +-------------------------+
          | IPFS / Hyperledger     |
          | (Optional registry ext.)|
          +-------------------------+
