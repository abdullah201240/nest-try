<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

This project includes a comprehensive logging system that tracks all API requests, responses, errors, and application events. See [LOGGING_GUIDE.md](./LOGGING_GUIDE.md) for detailed documentation.

---

## 📝 Table of Contents

- [🚀 Quick Start](#project-setup)
- [✨ Features](#project-features)
- [📚 Documentation](#-documentation)
  - [API & Authentication](#api--authentication-guides)
  - [Logging System](#logging-system-documentation)
- [📖 Logging System](#logging-system)
- [🛠️ Development](#compile-and-run-the-project)
- [🧪 Testing](#run-tests)
- [🚀 Deployment](#deployment)
- [📚 Resources](#resources)

---

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## ✨ Project Features

### Core Functionality
👥 **Employee Management API** - CRUD operations for employees  
🔐 **JWT Authentication** - Login with access and refresh tokens  
🔑 **API Key Authentication** - Server-to-server authentication  
📊 **Comprehensive Logging** - Full request/response logging with file storage  
🗄️ **TypeORM Integration** - PostgreSQL database with migrations  
✅ **Input Validation** - DTOs with class-validator  
🔒 **Security** - Password hashing, token management, sensitive data redaction  

## 📚 Documentation

> **📑 [Complete Documentation Index](./DOCUMENTATION_INDEX.md)** - Browse all documentation in one place  
> **📁 [Documentation Structure](./DOCS_STRUCTURE.md)** - Visual overview of all docs and their relationships

### API & Authentication Guides
- 📖 [API Testing Guide](./API_TESTING_GUIDE.md) - How to test the APIs with examples
- 🔐 [Authentication Summary](./AUTHENTICATION_SUMMARY.md) - JWT authentication system details
- 🔑 [Server-to-Server API Guide](./SERVER_TO_SERVER_API_GUIDE.md) - API key authentication for external services
- ⚡ [Quick Reference](./QUICK_REFERENCE.md) - Quick command reference

### Logging System Documentation
- 📊 **[Logging Guide](./LOGGING_GUIDE.md)** - Complete logging system reference (start here!)
- 🚀 [Logging Quick Start](./LOGGING_QUICK_START.md) - Get started with logging in 5 minutes
- 📝 [Log Examples](./LOG_EXAMPLES.md) - Real-world log output examples
- 🏗️ [Logging Architecture](./LOGGING_ARCHITECTURE.md) - System architecture and diagrams
- 📋 [Logging Implementation Summary](./LOGGING_IMPLEMENTATION_SUMMARY.md) - What was implemented and how

## 📖 Logging System

This application includes a **production-ready logging system** that provides:

### Key Features

✅ **Full HTTP logging** - Every request and response is logged  
✅ **Color-coded console output** - Easy-to-read logs with different colors per level  
✅ **File-based logs** - Organized by date and severity level  
✅ **Automatic log rotation** - Old logs cleaned up after 30 days  
✅ **Sensitive data redaction** - Passwords and tokens are automatically hidden  
✅ **Service-level logs** - Important business events logged from services  
✅ **Exception tracking** - All errors captured with stack traces

### Log Directory Structure

Logs are stored in the `logs/` directory with the following structure:
```
logs/
├── 2025-10-23-error.log       # 🔴 Only ERROR logs
├── 2025-10-23-warn.log        # 🟡 Only WARN logs
├── 2025-10-23-info.log        # 🟢 Only INFO logs
├── 2025-10-23-debug.log       # 🔵 Only DEBUG logs
├── 2025-10-23-verbose.log     # 🟣 Only VERBOSE logs
└── 2025-10-23-combined.log    # 📊 All logs combined
```

### 📖 Logging Documentation

For complete logging system information, explore these guides:

| Document | Description | Best For |
|----------|-------------|----------|
| **[Logging Guide](./LOGGING_GUIDE.md)** | Complete reference documentation | Understanding all features |
| [Quick Start](./LOGGING_QUICK_START.md) | Get started quickly | First-time users |
| [Log Examples](./LOG_EXAMPLES.md) | Real log output samples | Seeing what to expect |
| [Architecture](./LOGGING_ARCHITECTURE.md) | System design & flow | Technical deep-dive |
| [Implementation Summary](./LOGGING_IMPLEMENTATION_SUMMARY.md) | What was built | Overview of changes |

**New to logging?** Start with the [Logging Quick Start Guide](./LOGGING_QUICK_START.md) →

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
