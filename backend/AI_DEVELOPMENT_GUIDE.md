# Backend Development Guide - PROJECT_9

## Project Architecture Overview

This backend follows a **layered MVC architecture** with clear separation of concerns:
- **Routes** → **Controllers** → **Services** → **Database/External APIs**

---

## 📁 Directory Structure Rules

```
backend/
├── src/
│   ├── server.js              # Express app entry point
│   ├── config/                # Configuration files (env, clients)
│   ├── controllers/           # HTTP request handlers
│   │   └── client/            # Client-facing controllers
│   ├── services/              # Business logic layer
│   │   └── client/            # Client-facing services
│   ├── routes/                # Route definitions
│   │   └── client/            # Client-facing routes
│   └── middlewares/           # Express middlewares
└── utils/                     # Shared utilities (NOT in src/)
    ├── http.js                # HTTP status codes
    ├── ApiError.js            # Standard error class
    └── ApiResponse.js         # Standard response class
```

---

## 🔗 Import Path Rules

### CRITICAL: Utils folder is at backend/utils (NOT src/utils)

**From controllers (src/controllers/client/):**
```javascript
import HTTP_STATUS from "../../../utils/http.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
```

**From services (src/services/client/):**
```javascript
import HTTP_STATUS from "../../../utils/http.js";
import { ApiError } from "../../../utils/ApiError.js";
```

**From config (src/config/):**
```javascript
import HTTP_STATUS from "../../utils/http.js";
import { ApiError } from "../../utils/ApiError.js";
```

**Service imports in controllers:**
```javascript
import authService from "../../services/client/auth.service.js";
```

**Config imports in services:**
```javascript
import supabase from "../../config/supabaseClient.js";
```

**Always include `.js` extension in imports (ES Modules requirement)**

---

## 🚦 HTTP Status Code Rules

### MANDATORY: Always use HTTP_STATUS constants from utils/http.js

**Never use magic numbers:**
```javascript
// ❌ WRONG
res.status(200).json(...)
res.status(401).json(...)

// ✅ CORRECT
res.status(HTTP_STATUS.OK).json(...)
res.status(HTTP_STATUS.UNAUTHORIZED).json(...)
```

### Available Status Codes:
- **Success**: `OK` (200), `CREATED` (201), `ACCEPTED` (202), `NO_CONTENT` (204)
- **Client Errors**: `BAD_REQUEST` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `UNPROCESSABLE_ENTITY` (422), `TOO_MANY_REQUESTS` (429)
- **Server Errors**: `INTERNAL_SERVER_ERROR` (500), `SERVICE_UNAVAILABLE` (503)

---

## 🎯 Response Format Standards

### Success Response
```javascript
return res
  .status(HTTP_STATUS.OK)
  .json(new ApiResponse(HTTP_STATUS.OK, data, "Success message"));
```

**ApiResponse structure:**
```javascript
{
  statusCode: 200,
  data: { /* actual data */ },
  message: "Success message",
  success: true  // auto-calculated (statusCode < 400)
}
```

### Error Response
```javascript
return res
  .status(HTTP_STATUS.BAD_REQUEST)
  .json(new ApiError(HTTP_STATUS.BAD_REQUEST, "Error message"));
```

**ApiError structure:**
```javascript
{
  statusCode: 400,
  data: null,
  message: "Error message",
  success: false,
  errors: []  // optional array for validation errors
}
```

---

## 🎮 Controller Pattern Rules

Controllers handle HTTP layer concerns only:

### Structure:
```javascript
import serviceModule from "../../services/client/service.service.js";
import HTTP_STATUS from "../../../utils/http.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

const controllerFunction = async (req, res) => {
  try {
    // 1. Extract and validate request data
    const { param1, param2 } = req.body;
    
    // 2. Validate required fields
    if (!param1 || !param2) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(new ApiError(HTTP_STATUS.BAD_REQUEST, "Validation message"));
    }
    
    // 3. Additional validations (regex, comparison, etc.)
    if (condition) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .json(new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, "Error"));
    }
    
    // 4. Call service layer
    const data = await serviceModule.functionName(param1, param2);
    
    // 5. Return success response
    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, data, "Success message"));
      
  } catch (error) {
    // 6. Handle service layer errors
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        error.message || "Fallback error message"
      ));
  }
};

export default {
  controllerFunction,
  // ... other functions
};
```

### Controller Responsibilities:
- ✅ Extract request data (body, params, query, headers)
- ✅ Validate input format and required fields
- ✅ Call service layer functions
- ✅ Format and send HTTP responses
- ❌ NO business logic
- ❌ NO database/API calls directly

---

## ⚙️ Service Pattern Rules

Services contain business logic and external interactions:

### Structure:
```javascript
import supabase from "../../config/supabaseClient.js";
import HTTP_STATUS from "../../../utils/http.js";
import { ApiError } from "../../../utils/ApiError.js";

const serviceFunction = async (param1, param2) => {
  // 1. Optional: Additional validation
  if (!param1 || !param2) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Validation error");
  }
  
  // 2. Business logic and external calls
  const { data, error } = await supabase.auth.someMethod({
    param1,
    param2,
  });
  
  // 3. Handle errors
  if (error) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, error.message || "Error");
  }
  
  // 4. Additional validation of response
  if (!data?.someField) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Custom error");
  }
  
  // 5. Return clean data object
  return {
    field1: data.field1,
    field2: data.field2,
  };
};

export default {
  serviceFunction,
  // ... other functions
};
```

### Service Responsibilities:
- ✅ Business logic implementation
- ✅ Database/API calls (via Supabase)
- ✅ Data transformation
- ✅ Throw ApiError for failures
- ❌ NO HTTP responses (res.json, res.status)
- ❌ NO request object manipulation

---

## 🛣️ Route Pattern Rules

Routes connect HTTP endpoints to controllers:

### Structure:
```javascript
import express from "express";
import controllerModule from "../../controllers/client/controller.controller.js";

const router = express.Router();

// Define routes with HTTP methods
router.post("/endpoint", controllerModule.functionName);
router.get("/endpoint/:id", controllerModule.anotherFunction);
router.put("/endpoint/:id", controllerModule.updateFunction);
router.delete("/endpoint/:id", controllerModule.deleteFunction);

export default router;
```

### Route Registration in server.js:
```javascript
import express from 'express';
import './config/env.js';
import authRoutes from './routes/client/auth.routes.js';

const app = express();
const baseUrl = "/api/v1";

app.use(express.json());

// Mount routes BEFORE catch-all routes
app.use(`${baseUrl}/auth`, authRoutes);

// Catch-all or root route goes LAST
app.get('/', (req, res) => {
  res.send("API_NAME");
});
```

**⚠️ Route Order Matters**: Specific routes must be registered before generic routes (like `/`)

---

## 🔐 Validation Rules

### Input Validation in Controllers:

1. **Required Fields Check:**
```javascript
if (!field1 || !field2 || !field3) {
  return res
    .status(HTTP_STATUS.BAD_REQUEST)
    .json(new ApiError(HTTP_STATUS.BAD_REQUEST, "All fields are required"));
}
```

2. **Password Strength (Use for authentication):**
```javascript
// Requires: 1 uppercase, 1 lowercase, 1 number, 1 special char, min 8 chars
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (!passwordRegex.test(password)) {
  return res
    .status(HTTP_STATUS.BAD_REQUEST)
    .json(new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ));
}
```

3. **Field Comparison:**
```javascript
if (password !== confirm_password) {
  return res
    .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
    .json(new ApiError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      "Passwords do not match"
    ));
}
```

4. **Email Validation (if needed):**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res
    .status(HTTP_STATUS.BAD_REQUEST)
    .json(new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid email format"));
}
```

---

## 🏗️ Configuration Pattern Rules

### Environment Variables (config/env.js):
```javascript
import { config } from "dotenv";

config();

const port = process.env.PORT;

if (!port) {
  throw new Error("PORT is not defined in environment variables");
}

if (isNaN(port)) {
  throw new Error("PORT must be a number");
}

export const PORT = Number(port);
```

### External Client Setup (config/supabaseClient.js):
```javascript
import { createClient } from "@supabase/supabase-js";
import HTTP_STATUS from "../../utils/http.js";
import { ApiError } from "../../utils/ApiError.js";

const { SUPABASE_URL, SUPABASE_PUBLISHABLE } = process.env;

// Validate environment variables
if (!SUPABASE_URL) {
  throw new ApiError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    "SUPABASE_URL is not defined in environment variables"
  );
}

if (!SUPABASE_PUBLISHABLE) {
  throw new ApiError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    "SUPABASE_PUBLISHABLE is not defined in environment variables"
  );
}

// Create and export client
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE);

export default supabase;
```

---

## 📛 Naming Conventions

### Files:
- Controllers: `resource.controller.js` (e.g., `auth.controller.js`)
- Services: `resource.service.js` (e.g., `auth.service.js`)
- Routes: `resource.routes.js` (e.g., `auth.routes.js`)
- Config: `descriptive.js` (e.g., `supabaseClient.js`, `env.js`)
- Utils: `PascalCase.js` for classes (e.g., `ApiError.js`), `camelCase.js` for constants (e.g., `http.js`)

### Variables:
- Constants: `UPPER_SNAKE_CASE` (e.g., `HTTP_STATUS`, `SUPABASE_URL`)
- Functions: `camelCase` (e.g., `login`, `register`, `getUserById`)
- Classes: `PascalCase` (e.g., `ApiError`, `ApiResponse`)
- Route groups: `camelCase` (e.g., `authRoutes`, `userRoutes`)

### Functions:
- Controllers: Match route action (e.g., `login`, `register`, `getUser`, `updateProfile`)
- Services: Match business action (e.g., `authenticateUser`, `createUser`, `fetchUserData`)

---

## 🔄 Error Handling Flow

```
Service Layer (throw ApiError)
        ↓
Controller catch block
        ↓
Return error response with appropriate status
        ↓
Client receives standardized error format
```

### In Services:
```javascript
throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Error message");
```

### In Controllers:
```javascript
catch (error) {
  return res
    .status(HTTP_STATUS.APPROPRIATE_CODE)
    .json(new ApiError(
      HTTP_STATUS.APPROPRIATE_CODE,
      error.message || "Fallback message"
    ));
}
```

---

## 📦 Module System

**Type:** ES Modules (`"type": "module"` in package.json)

**Rules:**
- Always use `import/export` syntax (not `require/module.exports`)
- Always include `.js` file extensions in imports
- Use `export default` for main export, named exports for utilities

---

## 🚀 Server Setup Pattern

```javascript
import express from 'express';
import './config/env.js';  // Load env vars first
import routeModule from './routes/client/route.routes.js';

const app = express();

// Middleware
app.use(express.json());

// Routes (specific to general order)
app.use('/api/v1/resource', routeModule);

// Root/catch-all routes LAST
app.get('/', (req, res) => {
  res.send("API_NAME");
});

// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log("Server is running on:", PORT);
});
```

---

## ✅ Quick Checklist for New Features

When adding a new feature, follow this order:

1. **Create Service** (`src/services/client/feature.service.js`)
   - Import supabase, HTTP_STATUS, ApiError
   - Implement business logic
   - Throw ApiError on failures
   - Return clean data objects

2. **Create Controller** (`src/controllers/client/feature.controller.js`)
   - Import service, HTTP_STATUS, ApiError, ApiResponse
   - Extract request data
   - Validate inputs
   - Call service functions
   - Return ApiResponse or ApiError

3. **Create Routes** (`src/routes/client/feature.routes.js`)
   - Import express and controller
   - Define routes with appropriate HTTP methods
   - Export router

4. **Register Routes** (in `src/server.js`)
   - Import route module
   - Mount with `app.use('/api/v1/resource', routeModule)`
   - Place BEFORE catch-all routes

5. **Test**
   - Verify import paths are correct
   - Test all endpoints
   - Validate error handling

---

## 🎯 Summary: Golden Rules

1. **Utils are at `backend/utils/`** (not in src/)
2. **Always use `HTTP_STATUS` constants** (never magic numbers)
3. **Always use `ApiError` and `ApiResponse` classes**
4. **Controllers handle HTTP, Services handle logic**
5. **Services throw errors, Controllers catch and respond**
6. **Include `.js` extensions in all imports**
7. **Validate in controllers, implement in services**
8. **Register specific routes before generic ones**
9. **Export default objects with named functions**
10. **Follow consistent naming conventions**
11. **Do not use emojis in the codebase or documentation.**

---

**When in doubt, reference existing `auth.controller.js` and `auth.service.js` as templates.**
