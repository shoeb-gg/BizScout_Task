# 🚀 BizScout Billing Tracker

> A **scalable** and **robust** billing system with async job processing for usage tracking and report generation

---

## 🛠️ Local Development Setup

### Quick Start with Docker 🐳

```bash
# Build the container
docker build -t billing-tracker .

# Run the application
docker run -p 6009:6009 billing-tracker
```

🎉 **That's it!** Your application will be running on `http://localhost:6009`

---

## 🏗️ Architecture Overview

### System Design Philosophy

Our billing tracker follows a **microservice-ready** architecture with clear separation of concerns:

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   NestJS API    │───▶│  PostgreSQL  │    │   Redis Store   │
│   (REST Layer)  │    │  (Supabase)  │    │  (BullMQ Jobs)  │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │                                           │
         ▼                                           ▼
┌─────────────────┐                        ┌─────────────────┐
│ Usage Tracking  │                        │  Job Processing │
│   & Billing     │                        │   (2 Workers)   │
└─────────────────┘                        └─────────────────┘
                                                    │
                                                    ▼
                                          ┌─────────────────┐
                                          │  PDF Generator  │
                                          │  (Puppeteer)    │
                                          └─────────────────┘
```

### 🎯 Core Components

- **🌐 NestJS Backend**: Scalable server framework with SOLID principles
- **🗄️ Prisma ORM**: Type-safe database operations
- **🐘 Supabase**: PostgreSQL database with real-time capabilities
- **⚡ BullMQ**: Redis-based job queue for async processing
- **🔧 Redis**: Key-value store for job metadata
- **📄 Puppeteer**: PDF generation for usage reports
- **🧪 Jest**: Industry-standard unit testing

---

## 💡 Technology Choices & Reasoning

| Technology            | Why We Chose It                                         |
| --------------------- | ------------------------------------------------------- |
| **NestJS**            | 🎯 Mature, scalable framework enabling SOLID principles |
| **Prisma + Supabase** | 🚀 Simple, performant relational database operations    |
| **BullMQ**            | ⚡ Best-in-class job queue with Redis backing           |
| **Puppeteer**         | 📊 Mature, reliable PDF generation                      |
| **Jest**              | ✅ Industry standard for unit testing                   |
| **Class Validator**   | 🛡️ Robust input validation                              |

---

## 📊 Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        bigint id PK
        datetime created_at
        datetime updated_at
        string email
        string password
        string name
        role user_role
    }

    USAGE {
        bigint id PK
        datetime created_at
        int quantity
        event_type event
        bigint user_id FK
    }

    USER ||--o{ USAGE : "has many"
```

### 📋 Schema Details

**Users Table:**

- Primary entity for billing
- Role-based access (admin, manager, customer, provider)
- Timestamped for audit trails

**Usage Table:**

- Tracks API calls, VM uptime, CPU time, data storage
- Linked to users for billing calculations
- Indexed for fast queries

---

## 🔄 Data Flow Architecture

```mermaid
graph TD
    A[Client Request] --> B[NestJS Controller]
    B --> C[Usage Service]
    C --> D[Prisma ORM]
    D --> E[Supabase DB]

    F[Report Request] --> G[Report Controller]
    G --> H[BullMQ Producer]
    H --> I[Redis Queue]
    I --> J[BullMQ Consumer]
    J --> K[PDF Generator]
    K --> L[Local File Storage]

    style A fill:#e1f5fe
    style F fill:#e8f5e8
    style I fill:#fff3e0
    style L fill:#fce4ec
```

---

## 📚 API Documentation

### 🔗 Available Endpoints

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| `POST` | `/api/v1/usage/`                | Create usage record   |
| `GET`  | `/api/v1/usage/:id`             | Get usage by ID       |
| `POST` | `/api/v1/reports/:userId`       | Generate usage report |
| `GET`  | `/api/v1/reports/status/:jobId` | Check job status      |
| `GET`  | `/api/v1/health`                | Health check          |

### 📋 Example Requests

#### Create Usage Record

```json
POST /api/v1/usage/
{
    "quantity": 500000,
    "event": "api_calls",
    "user_id": 1
}
```

#### Generate Report

```json
POST /api/v1/reports/1
// Returns: { "jobId": "23", "status": "queued" }
```

#### Check Job Status

```json
GET /api/v1/reports/status/23
// Returns: { "status": "completed", "fileUrl": "/reports/user-1-report.pdf" }
```

**📎 Complete Postman Collection:** [Available in repository]

---

## ⚡ Async Workflow Design

### 🔄 Job Processing Pipeline

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Database
    participant BullMQ
    participant Worker
    participant FileSystem

    Client->>API: POST /reports/:userId
    API->>Database: Fetch user usage data
    Database-->>API: Return usage records
    API->>BullMQ: Queue report generation job
    BullMQ-->>API: Return job ID
    API-->>Client: Return job ID & status

    BullMQ->>Worker: Process job (2 concurrent)
    Worker->>FileSystem: Generate PDF report
    Worker->>BullMQ: Mark job as completed

    Client->>API: GET /status/:jobId
    API->>BullMQ: Check job status
    BullMQ-->>API: Return status
    API-->>Client: Return job status & file URL
```

### 🎯 Job Types

1. **📊 Report Generation Jobs**

   - Fetch monthly usage data
   - Calculate billing amounts
   - Generate PDF reports
   - Store files locally

2. **⚙️ Processing Configuration**
   - **Concurrency**: 2 workers
   - **Queue Storage**: Redis
   - **Job Persistence**: Metadata stored in Redis

---

## ⚖️ Assumptions & Trade-offs

### 🔐 Security Considerations

- ⚠️ **No comprehensive authentication** implemented
- 🔄 **Trade-off**: Rapid development vs production security
- 💡 **Mitigation**: Planned for future iterations

### 🌐 Infrastructure Limitations

- 📊 **Free tier resources** (Render, Supabase)
- ⚡ **Trade-off**: Cost efficiency vs production scalability
- 🎯 **Impact**: Limited concurrent connections and storage

### 📁 File Storage

- 💾 **Local file storage** for PDF reports
- 🔄 **Trade-off**: Simplicity vs distributed storage
- 📈 **Scaling concern**: File management across instances

---

## 🚀 Future Improvements

### 🔒 Security Enhancements

- [ ] JWT-based authentication
- [ ] Role-based access control (RBAC)
- [ ] API rate limiting
- [ ] Input sanitization improvements

### 🏗️ Architecture Evolution

- [ ] **Microservices decomposition**
  - User service
  - Billing service
  - Report service
- [ ] **Event-driven architecture**
  - Event sourcing for usage tracking
  - CQRS for read/write optimization

### 📊 Scaling Strategies

- [ ] **Horizontal scaling**
  - Multiple worker instances
  - Load balancer integration
- [ ] **Database optimization**
  - Read replicas
  - Connection pooling
  - Query optimization

### 📈 Feature Roadmap

- [ ] **Enhanced reporting**
  - Real-time dashboards
  - Custom date ranges
  - Export formats (Excel, CSV)
- [ ] **Advanced billing**
  - Multiple pricing tiers
  - Usage quotas and alerts
  - Automated invoicing

---

## 🧪 Testing Strategy

### 🎯 Core Component Focus: **Billing Calculation Logic**

Our testing strategy prioritizes the most critical component - ensuring users are billed correctly.

#### 📊 Tiered Billing System Tests

```typescript
// Example: Testing tiered API call pricing
describe('Billing Calculation', () => {
  it('should apply correct tier pr
```
