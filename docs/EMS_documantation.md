**EMPLOYEE MANAGEMENT SYSTEM**

_System Architecture & Workflow Documentation_

| **Python 3.10** | **FastAPI** | **PostgreSQL** | **Docker-Ready** | **GitHub Actions CI** |
| --- | --- | --- | --- | --- |

Version 0.1.0 | Apache 2.0 License | March 2026

# **1\. Executive Summary**

## **1.1 Problem Statement**

Modern HR departments rely on spreadsheets or disconnected tools to track employee leave balances and compute payroll adjustments. These manual workflows introduce:

- Calculation errors in leave deductions and overtime pay
- No audit trail - changes are invisible and not timestamped
- Inconsistent business rules applied across employee types (Senior / Junior / Temporary)
- Zero input validation - corrupted data flows downstream unchecked
- No programmatic access - finance and HR tools cannot consume the data

## **1.2 Solution**

The Employee Management System (EMS) is a production-grade Python application that:

- Enforces strict input validation before any computation occurs
- Applies deterministic, type-specific payroll rules using Python Decimal arithmetic (no floating-point drift)
- Persists every run as an auditable row in PostgreSQL with a UTC timestamp
- Exposes both a CLI (for scripts / cron jobs) and a REST API (for integrations)
- Ships with 100% automated linting, type-checking, and unit tests in CI

## **1.3 Business Impact**

| **Impact Area** | Benefit |
| --- | --- |
| **Payroll Accuracy** | Decimal-based math eliminates rounding errors; leave deductions and overtime calculated identically every run |
| **Audit & Compliance** | Every write is timestamped in PostgreSQL; upsert semantics prevent ghost duplicates |
| **Developer Velocity** | Typed domain model + service layer + storage layer; new adapters require zero changes to business logic |
| **Integration Surface** | FastAPI REST endpoints allow any downstream system (HRMS, finance, BI) to consume or push data |
| **Operational Safety** | CI pipeline blocks broken code before it merges; exit codes allow safe shell scripting |

# **2\. System Architecture**

## **2.1 Layered Architecture**

EMS follows a strict four-layer separation of concerns. Each layer depends only on the layer directly below it.

| **Layer** | **Module** | **Responsibility** |
| --- | --- | --- |
| Entry Points | cli/app.py \| api/routes.py | Argument parsing, HTTP handling, user-facing output |
| --- | --- | --- |
| Service | services/employee_service.py | Orchestrates domain construction and persistence |
| --- | --- | --- |
| Domain | domain/employee.py | Business rules, validation, payroll calculations |
| --- | --- | --- |
| Storage | storage/postgres_store.py | PostgreSQL DDL, upsert, connection management |
| --- | --- | --- |

## **2.2 Request Flows**

### **CLI Flow**

\$ employee-cli --name Alice --id EMP001 --type Senior --salary 50000 ...

1\. cli/app.py parses argv via argparse and constructs EmployeeInput

2\. build_employee() in employee_service.py delegates to Employee.\__post_init__ for validation

3\. If validation passes, persist_employee() calls PostgresEmployeeStore.save_employee()

4\. Storage layer creates table (if absent), enforces unique index, runs UPSERT, returns row ID

5\. CLI prints formatted summary and exits with code 0

### **API Flow**

POST /api/v1/employees {JSON payload}

1\. FastAPI deserialises JSON into EmployeePayload (Pydantic validation)

2\. \_build_domain_employee() wraps service call; any ValueError becomes HTTP 400

3\. Dependency injection supplies PostgresEmployeeStore via get_employee_store()

4\. DatabaseStoreError propagates as HTTP 503 to the caller

5\. EmployeeResponse is serialised and returned with the database record_id

## **2.3 Data Model**

| **Column** | **Type** | **Source** |
| --- | --- | --- |
| id  | BIGSERIAL PK | Auto-generated |
| --- | --- | --- |
| empid | VARCHAR(20) UNIQUE | Input - validated 4-20 alphanumeric |
| --- | --- | --- |
| empname | VARCHAR(255) | Input |
| --- | --- | --- |
| emptype | VARCHAR(20) | Input - Senior \| Junior \| Temporary |
| --- | --- | --- |
| salary | NUMERIC(12,2) | Input - max 10,000,000.00 |
| --- | --- | --- |
| available_leaves | INTEGER | Input - max 365 |
| --- | --- | --- |
| leaves_taken | INTEGER | Input - max 31 |
| --- | --- | --- |
| worked_days | INTEGER | Input - max 31 |
| --- | --- | --- |
| extra_hrs_worked | INTEGER | Input - max 300 |
| --- | --- | --- |
| extra_pay | NUMERIC(12,2) | Computed - extra_hrs \* rate |
| --- | --- | --- |
| total_pay | NUMERIC(12,2) | Computed - salary - deduction + extra |
| --- | --- | --- |
| is_eligible | BOOLEAN | Computed - leaves_taken <= available |
| --- | --- | --- |
| created_at | TIMESTAMPTZ | Auto - NOW() on insert/update |
| --- | --- | --- |

# **3\. Domain Logic & Business Rules**

## **3.1 Validation Rules**

All validation fires inside Employee.\__post_init__ before any computation. A ValueError with a descriptive message is raised on the first failure.

| **Field** | **Constraint** | **Error Raised** |
| --- | --- | --- |
| empid | 4-20 alphanumeric only | empid must be 4-20 characters and contain only letters and numbers |
| --- | --- | --- |
| emptype | Senior \| Junior \| Temporary | Invalid employee type |
| --- | --- | --- |
| salary | \>= 0, <= 10,000,000 | salary must be non-negative / <= 10000000.00 |
| --- | --- | --- |
| worked_days | 0 - 31 | worked_days must be >= 0 / <= 31 |
| --- | --- | --- |
| leaves_taken | 0 - 31 | leaves_taken must be >= 0 / <= 31 |
| --- | --- | --- |
| available_leaves | 0 - 365 | available_leaves must be >= 0 / <= 365 |
| --- | --- | --- |
| extra_hrs_worked | 0 - 300 | extra_hrs_worked must be >= 0 / <= 300 |
| --- | --- | --- |

## **3.2 Payroll Calculation**

All arithmetic uses Python's decimal.Decimal to eliminate IEEE 754 floating-point drift.

| **Employee Type** | **Extra Pay Rate / hr** | **Leave Deduction / day** |
| --- | --- | --- |
| Senior | ₹ 300 | ₹ 200 |
| --- | --- | --- |
| Junior | ₹ 200 | ₹ 100 |
| --- | --- | --- |
| Temporary | ₹ 100 | ₹ 50 |
| --- | --- | --- |

**Formula:**

extra_pay = extra_hrs_worked × EXTRA_PAY_RATE\[emptype\]

deduction = leaves_taken × LEAVE_DEDUCTION_RATE\[emptype\]

total_pay = salary - deduction + extra_pay

Example - Senior employee, salary ₹30,000, 2 leaves taken, 10 extra hours:

extra_pay = 10 × 300 = 3,000

deduction = 2 × 200 = 400

total_pay = 30,000 - 400 + 3,000 = 32,600

## **3.3 Key Domain Methods**

| **Method** | **Returns** | **Description** |
| --- | --- | --- |
| getWorkingHours() | int | Returns worked_days as the pay-period working count |
| --- | --- | --- |
| isEligible() | bool | True when leaves_taken <= available_leaves |
| --- | --- | --- |
| ExtraPay() | Decimal | type-specific rate × extra hours worked |
| --- | --- | --- |
| getTotalPay() | Decimal | Full net salary after deductions and extras |
| --- | --- | --- |

# **4\. Component Deep-Dive**

## **4.1 Configuration (config/settings.py)**

- load_environment() calls python-dotenv to load .env into the process environment with override=False - shell variables always win
- DatabaseConfig.from_env() is a frozen dataclass; immutable after construction
- parse_int_env() wraps int() and converts ValueError → ConfigurationError so callers get a typed exception
- EMP_DB_DSN takes priority over individual host/port/name fields when present

## **4.2 Domain Model (domain/employee.py)**

- @dataclass(slots=True) - memory-efficient, prevents accidental attribute creation
- ClassVar constants (EXTRA_PAY_RATE, LEAVE_DEDUCTION_RATE) are shared across instances
- \__post_init__ performs full validation so every Employee instance is guaranteed valid
- \_to_decimal() normalises any numeric-looking input to Decimal quantized at 0.01

## **4.3 Service Layer (services/employee_service.py)**

- EmployeeStore is a Protocol (structural typing) - any class with save_employee(Employee) -> int satisfies it
- build_employee() is a pure function: same EmployeeInput always produces the same Employee
- persist_employee() has an enable_storage flag - set False in tests or preview endpoints
- parse_salary() isolates the string-to-Decimal conversion so it can be tested independently

## **4.4 Storage Layer (storage/postgres_store.py)**

- PostgresEmployeeStore.\_connect() handles both DSN and keyword-argument connection styles
- save_employee() runs three SQL statements in one connection: CREATE TABLE IF NOT EXISTS, duplicate-check query, CREATE UNIQUE INDEX IF NOT EXISTS, then UPSERT
- ON CONFLICT (empid) DO UPDATE ensures idempotent writes - re-running the CLI with the same empid updates rather than inserting
- RETURNING id brings back the auto-generated primary key without a second round-trip
- All psycopg.Error exceptions are wrapped in DatabaseStoreError to keep the caller decoupled from the driver

## **4.5 CLI (cli/app.py)**

- configure_logging() routes INFO/WARNING to stdout and ERROR to stderr - safe for Unix pipe consumption
- MaxLevelFilter ensures WARNING does not bleed into stderr alongside errors
- get_currency_prefix() gracefully falls back from ₹ to Rs. when the terminal encoding cannot represent the symbol
- Four exit codes: 0 success, 1 validation, 2 database, 99 unexpected - enables reliable shell scripting and CI gates

## **4.6 FastAPI Layer (api/)**

- EmployeePayload (Pydantic) provides a first line of type and constraint validation before domain logic runs
- get_employee_store() is a FastAPI dependency - easily overridden in tests via app.dependency_overrides
- POST /api/v1/employees/preview returns computed results without touching the database
- POST /api/v1/employees performs a full upsert and returns record_id for the caller to store
- GET /api/v1/health returns {status: ok} - suitable for load-balancer health probes

# **5\. CI/CD Pipeline & Testing**

## **5.1 GitHub Actions Workflow (.github/workflows/ci.yml)**

Triggered on every push to any branch and every pull request. All steps must pass before a merge is allowed.

| **Step** | **Tool** | **What It Checks** |
| --- | --- | --- |
| 1\. Checkout | actions/checkout@v4 | Fetches full repo history |
| --- | --- | --- |
| 2\. Setup Python | actions/setup-python@v5 | Pins Python 3.10 runtime |
| --- | --- | --- |
| 3\. Install deps | pip install -e .\[dev\] | Installs app + all dev extras |
| --- | --- | --- |
| 4\. Lint | ruff check . | PEP8, import order, unused vars, bugbear |
| --- | --- | --- |
| 5\. Format | black --check . | Enforces 88-char consistent formatting |
| --- | --- | --- |
| 6\. Type-check | mypy src | Full static typing with strict flags |
| --- | --- | --- |
| 7\. Unit tests | pytest -q | All tests under tests/ with summary |
| --- | --- | --- |

## **5.2 Test Suite**

| **Test File** | **Scope** | **Key Patterns** |
| --- | --- | --- |
| test_employee.py | Domain model | Parametrize edge cases; all validation branches; Decimal math precision |
| --- | --- | --- |
| test_employee_service.py | Service layer | Protocol stub (CountingStore); pure function determinism; storage skip flag |
| --- | --- | --- |
| test_app.py | CLI integration | FakeStore injection; capsys for stdout/stderr; all 4 exit codes |
| --- | --- | --- |
| test_api.py | FastAPI routes | dependency_overrides; TestClient; HTTP 400 / 503 error paths |
| --- | --- | --- |
| test_db.py | Config & SQL | monkeypatch env vars; SQL string assertions; defaults verification |
| --- | --- | --- |

## **5.3 Development Commands**

\# Lint

ruff check .

\# Format check

black --check .

\# Type check

mypy src

\# Run tests

pytest -q

# **6\. Deployment & Operations**

## **6.1 Local Setup**

- Create PostgreSQL database:

createdb employee_management

- Copy and populate environment file:

cp .env.example .env

\# edit .env with your credentials

- Install application:

pip install -e .\[dev\]

- Run CLI:

employee-cli --name Alice --id EMP001 --type Senior --salary 50000 \\

\--available_leaves 12 --leaves_taken 2 --extra_hours 10 --worked_days 30

- Run API server:

employee-api

## **6.2 Environment Variables**

| **Variable** | **Default** | **Description** |
| --- | --- | --- |
| EMP_DB_HOST | localhost | PostgreSQL server hostname |
| --- | --- | --- |
| EMP_DB_PORT | 5432 | PostgreSQL port |
| --- | --- | --- |
| EMP_DB_NAME | employee_management | Database name |
| --- | --- | --- |
| EMP_DB_USER | postgres | Database user |
| --- | --- | --- |
| EMP_DB_PASSWORD | postgres | Database password |
| --- | --- | --- |
| EMP_DB_CONNECT_TIMEOUT | 5   | Connection timeout in seconds |
| --- | --- | --- |
| EMP_DB_DSN | (none) | Full DSN string - overrides individual fields |
| --- | --- | --- |

## **6.3 API Endpoints Reference**

| **Method** | **Path** | **Auth** | **Description** |
| --- | --- | --- | --- |
| GET | /   | None | Service status + link map |
| GET | /api/v1/health | None | Liveness probe - {status: ok} |
| POST | /api/v1/employees/preview | None | Compute pay without DB write |
| POST | /api/v1/employees | None | Upsert employee + return record_id |

# **7\. Extension Roadmap**

The layered architecture allows each concern to evolve independently:

## **7.1 Production Hardening**

- Add connection pooling (psycopg Pool or PgBouncer) - swap in PostgresEmployeeStore.\__init__ only
- Add authentication middleware (OAuth2 / API key) to FastAPI router - zero domain changes
- Add Prometheus /metrics endpoint and structured JSON logging (structlog) for observability

## **7.2 Storage Backends**

- Implement EmployeeStore protocol for SQLite, DynamoDB, or any cloud datastore
- EmployeeStore is a Protocol - new adapters are drop-in with no service or domain changes

## **7.3 Feature Additions**

- Bulk import via CSV/XLSX - add a new CLI subcommand feeding the same service layer
- Salary history table - add a second store method; existing upsert logic unchanged
- Multi-currency support - extend DatabaseConfig with a currency_code field and pass it through

## **7.4 Containerisation**

- Dockerfile: FROM python:3.10-slim, COPY src + pyproject.toml, RUN pip install -e .
- docker-compose.yml: services for app + postgres with EMP_DB_\* environment injection
- CI step: docker build + push to ECR, deploy to ECS / Fargate on tag push