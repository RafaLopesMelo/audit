# 🔍 Audit System

A modern, scalable, and cost-effective audit logging system built with TypeScript and serverless architecture. This system provides comprehensive audit trail capabilities with intelligent report generation using AI.

## 🚀 Features

- **Client SDK**: Easy-to-use TypeScript/JavaScript SDK for audit log collection
- **Serverless Functions**: AWS Lambda-based processing for maximum cost efficiency
- **Internationalization**: Built-in i18n support for any language that you'd like
- **AWS Integration**: Seamless integration with AWS services for data storage and processing
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions

## 🛠 Technologies

### Core Stack
- **TypeScript**: Full type safety and modern JavaScript features
- **Node.js 22+**: Latest LTS runtime for optimal performance
- **pnpm**: Fast, disk-efficient package manager with monorepo support

### Cloud Infrastructure
- **AWS Lambda**: Serverless compute for cost-effective processing
- **Amazon S3**: Scalable object storage for audit data
- **AWS Athena**: Serverless interactive query service
- **AWS Glue**: Data catalog and ETL service
- **Amazon SQS**: Message queuing for reliable processing
- **AWS Secrets Manager**: Secure credential management

### Development & Testing
- **Vitest**: Modern testing framework with native TypeScript support
- **ESLint + Prettier**: Code quality and formatting
- **esbuild**: Fast JavaScript/TypeScript bundler
- **Docker**: Containerization for consistent deployments

## 📦 Project Structure

```
audit/
├── packages/
│   ├── sdk/                    # Client library for audit logging
│   ├── serverless/
│   │   ├── register/          # Lambda function for audit log ingestion
│   │   └── report/            # AI-powered report generation service
│   └── shared/                # Common utilities and domain logic
├── infra/                     # Infrastructure as Code
└── examples/                  # Usage examples
```

## 💰 Cost Efficiency

This audit system is designed with cost optimization in mind:

### Serverless Architecture Benefits
- **Pay-per-execution**: Only pay when audit logs are processed
- **Auto-scaling**: Automatically scales from zero to handle any load
- **No idle costs**: No charges when the system isn't being used

### Storage Optimization
- **S3 Standard-IA**: Cost-effective storage for infrequently accessed audit data
- **Athena**: Pay-per-query analytics with no infrastructure costs
- **Efficient data formats**: Optimized data structures reduce storage costs

## 🌍 Internationalization

The system includes built-in internationalization support by using AI for translations with cache in S3
You can easily replace AI translations at any moment.

## 📊 Use Cases

- **Compliance**: Meet regulatory requirements (GDPR, HIPAA, SOX)
- **Security**: Track user actions and system changes
- **Debugging**: Audit trail for troubleshooting
- **Analytics**: Business intelligence from user behavior
- **Legal**: Evidence for legal proceedings

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## 📈 Scalability

- **Horizontal scaling**: Lambda functions scale automatically
- **Data partitioning**: Efficient querying with Athena partitions
- **Async processing**: SQS queues handle high-volume ingestion

## 📄 License

ISC License - see LICENSE file for details

## 👨‍💻 Author

**Rafael Lopes Melo**
- GitHub: [@RafaLopesMelo](https://github.com/RafaLopesMelo)
