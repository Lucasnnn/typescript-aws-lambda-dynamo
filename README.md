# Project README

## Overview

This project is a Serverless application using TypeScript, AWS Lambda, and DynamoDB to create a simple API for managing client data. The Serverless Framework is employed to facilitate deployment and management of AWS resources.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Serverless Framework](https://www.serverless.com/)
- [AWS CLI](https://aws.amazon.com/cli/)
- [Jest](https://jestjs.io/)

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Lucasnnn/typescript-aws-lambda-dynamo
   cd typescript-aws-lambda-dynamo
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure AWS Credentials:**

   Ensure you have AWS credentials configured on your machine using the AWS CLI.

4. **Deploy the Application:**

   ```bash
   serverless deploy
   ```

   This command will deploy your Serverless application along with the DynamoDB table.

## Project Structure

- **`src/`**: Contains TypeScript source code.
  - **`functions/`**: Lambda function implementations.
- **`serverless.yml`**: Serverless Framework configuration file.
- **`README.md`**: Project documentation.

## Lambda Functions

1. **`createClient`**:

   - **Handler:** `src/functions/ClientFunctions.create`
   - **Description:** Creates a new client.
   - **HTTP Endpoint:** `POST /client`

2. **`getAllClients`**:

   - **Handler:** `src/functions/ClientFunctions.findAll`
   - **Description:** Retrieves all clients.
   - **HTTP Endpoint:** `GET /clients`

3. **`getClientById`**:

   - **Handler:** `src/functions/ClientFunctions.findById`
   - **Description:** Retrieves a client by ID.
   - **HTTP Endpoint:** `GET /client/{id}`

4. **`updateClient`**:

   - **Handler:** `src/functions/ClientFunctions.update`
   - **Description:** Updates an existing client.
   - **HTTP Endpoint:** `PUT /client/{id}`

5. **`deleteClient`**:
   - **Handler:** `src/functions/ClientFunctions.deleteById`
   - **Description:** Deletes a client by ID.
   - **HTTP Endpoint:** `DELETE /client/{id}`

## DynamoDB Table

- **Table Name:** `clients-table-test` (adjusts based on the deployment stage)
- **Primary Key:** `id` (String)

## IAM Roles

IAM roles are set up to allow the Lambda functions to interact with the DynamoDB table:

- `dynamodb:PutItem` for `createClient`
- `dynamodb:Scan` for `getAllClients`
- `dynamodb:GetItem` for `getClientById`
- `dynamodb:UpdateItem` for `updateClient`
- `dynamodb:DeleteItem` for `deleteClient`

## Cleaning Up

To remove all deployed resources:

```bash
serverless remove
```

## Additional Notes

- The application is designed for the `test` stage in the `sa-east-1` region.
- The DynamoDB table is provisioned with read and write capacity units set to 1 for simplicity.

Feel free to customize the code and configuration based on your specific requirements!

## Local Testing

**Run Tests with Coverage:**
Jest is configured to automatically set up a local DynamoDB instance for testing. The DynamoDB tables created during testing will have a prefix to avoid conflicts with production tables.

1.  Execute the following command to run your tests and generate coverage information:

```bash
npm test
```

To open the test coverage report in the browser, you can follow these steps:

2. **Open Coverage Report:**
   After running the tests, a `coverage` directory will be generated. Inside this directory, you'll find an `index.html` file. Open this file in your preferred browser. You can use a command-line tool like `open` for macOS or `start` for Windows to open the HTML file.

   For example, on macOS:

   ```bash
   open coverage/lcov-report/index.html
   ```

   On Windows:

   ```bash
   start coverage/lcov-report/index.html
   ```

   Adjust the path based on your project structure if needed.

3. **View Coverage Report:**
   This will open the coverage report in your default web browser. It will display detailed information about the test coverage of your codebase, including which lines are covered by tests and which are not.

Keep in mind that the exact commands may vary depending on your operating system and preferred command-line tools. Adjust them accordingly based on your setup.
