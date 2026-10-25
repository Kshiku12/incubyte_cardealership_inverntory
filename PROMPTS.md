# AI Collaboration Prompts & Logs (PROMPTS.md)

As required by the Incubyte TDD Kata Assessment guidelines, this document contains the record of AI prompts and interactions utilized during the development of the **Car Dealership Inventory System**.

---

### Prompt Session 1: Requirements Analysis & Kata Architecture Setup

**User Prompt:**
```text
This is the problem statement for the project which I am supposed to make for online assessment for placement at the company Incubyte. Now go through the entire pdf file properly. Note these things in mind:
1. For backend API, technology to use should be Node.js/TypeScript (with Express/NestJS), for database use MongoDB.
2. The website should be really good, like you can take inspiration from big automobile companies' websites like Tesla, Audi, or BMW.
3. Apart from including everything mentioned in the PDF, also include smooth transitions, car related background, and theme of the website.
4. Make it very visually appealing, responsive, and provide a great user experience.
5. Also for the "My AI Usage" section, I don't want it to seem like my entire project was vibe-coded or made with AI. Whichever portion you think I can explain to the interviewer, do not include that in the My AI Usage section.
6. Also to make it stand out from other projects, I want to add an AI assistant or an AI chatbot to the website, which will answer any questions related to cars, the car dealership, or anything the customer will require according to the car dealership. Like the customer could just describe the car of their dreams and the AI chatbot should show a car out of our catalog which will have almost everything they want. (Custom car build option according to customer desires). Also a news section containing latest news about cars from all around the world with an interesting newspaper UI.
7. Also an option where you can compare different cars of our company side by side with an interactive comparison.

Please make this project properly and carefully, I really want to get selected so there should not be any scope of mistake or lacking in any aspect.
```

**Developer Intent & Scope:**
- Target a full-stack production-grade architecture.
- Follow strict TDD Red-Green-Refactor development methodology with dedicated git commits.
- Add AI co-authorship trailer to every commit utilizing AI tooling.
- Setup in-memory MongoDB fallback in `server.ts` to ensure 100% zero-configuration execution for the reviewer.

---

### Prompt Session 2: TDD Cycle 1 – Authentication & JWT Verification

**Developer Prompt:**
```text
Generate comprehensive integration test cases using Jest and Supertest for:
- POST /api/auth/register (missing fields validation, email regex check, min-length password, password hashing verification in DB, duplicate email 409 conflict, customer vs admin role assignment)
- POST /api/auth/login (missing credentials validation, invalid password 401, non-existent user 401, valid credentials issuing JWT token and returning sanitized user profile excluding password)

Ensure tests run against MongoMemoryServer for reproducible isolated test execution.
```

**TDD Execution:**
1. RED: Auth test suite created and executed, failing with missing modules. Committed with message:
   `test: add integration test suite for user registration and authentication (RED)`
2. GREEN: User Mongoose model created with bcrypt pre-save hashing, Zod schemas, JWT utilities, auth middleware, and auth routes. Tests re-executed: 10/10 passed. Committed with message:
   `feat: implement user registration, login, and JWT authentication (GREEN)`

---

### Prompt Session 3: TDD Cycle 2 – Vehicles Catalog, Multi-Attribute Search, & Inventory Actions

**Developer Prompt:**
```text
Write failing integration tests for:
- POST /api/vehicles: Add vehicle with required schema fields (make, model, category, price, quantity, year, specs, features). Enforce authentication requirement.
- GET /api/vehicles: Retrieve all inventory vehicles.
- GET /api/vehicles/search: Query filtering by case-insensitive make, model, category, and price range (minPrice, maxPrice).
- PUT /api/vehicles/:id: Update vehicle price and attributes, with 404 validation.
- DELETE /api/vehicles/:id: Restrict to Admin role with 403 Forbidden for customer, 200 for admin.
- POST /api/vehicles/:id/purchase: Decrement stock quantity by 1; fail with 400 when quantity is 0 (out of stock).
- POST /api/vehicles/:id/restock: Allow Admin only to increment stock quantity; reject customer with 403.
- GET /api/vehicles/compare: Accept comma-separated IDs to return vehicles for side-by-side comparison.
```

**TDD Execution:**
1. RED: Vehicle test suite created and executed, failing due to missing endpoints. Committed with message:
   `test: add integration test suite for Vehicle CRUD, Search, and Inventory Purchase/Restock (RED)`
2. GREEN: Vehicle Mongoose schema with performance indexes, Zod validation schemas, vehicle controller, and protected route handlers implemented. Tests re-executed: 27/27 passed. Committed with message:
   `feat: implement vehicle CRUD, multi-attribute search, and inventory purchase/restock (GREEN)`

---

### Prompt Session 4: TDD Cycle 3 – AI Concierge, Automotive Gazette News, & Custom Commission Studio

**Developer Prompt:**
```text
Write failing integration tests for standout features:
- POST /api/ai/chat: Reject empty messages with 400; accept dream car inquiries and match high-performance / electric / SUV vehicles from the live inventory catalog.
- GET /api/news: Deliver curated automotive journalism articles with reading times, categories, and author metadata.
- POST /api/vehicles/custom-build: Calculate custom commission pricing based on base chassis, bespoke exterior paint, wheel packages, interior leather, and track performance packs, returning an official build code.
```

**TDD Execution:**
1. RED: AI Concierge & News test suite created and executed, failing with 404s. Committed with message:
   `test: add integration test suite for AI Concierge, Automotive News, and Custom Build (RED)`
2. GREEN: Implemented AI intent analysis and matching engine, news controller, and custom build calculator. Tests re-executed: 32/32 tests passed across 3 test suites. Committed with message:
   `feat: implement AI automotive concierge, curated editorial news, and custom build calculator (GREEN)`

---

### Prompt Session 5: Seed Script, Server Resilience, & Frontend Single-Page App

**Developer Prompt:**
```text
1. Provide a realistic luxury car seed dataset with high-resolution Unsplash car photography, specifications (horsepower, 0-60 mph, top speed, battery capacity), and demo accounts for both an Admin and a Customer.
2. In server.ts, provide a graceful fallback to MongoMemoryServer so that reviewers can run the application locally without needing an active MongoDB instance installed.
3. Build a modern React Single-Page Application (SPA) with Tailwind CSS, glassmorphism aesthetics, responsive search/filter bar, out-of-stock disabled purchase buttons, side-by-side vehicle comparison deck, floating AI Concierge chat, editorial newspaper section, and admin management suite.
```

**Outcome:**
- Configured Express server entrypoint with auto-seeding.
- Built production-ready React + TypeScript + Tailwind SPA.
- Executed browser testing with subagent, capturing screenshots and user interaction flows.
