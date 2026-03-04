import { useState } from "react";
import { Link } from "react-router-dom";

const qaData = [
  {
    category: "Node.js & Express.js",
    color: "#4ADE80",
    questions: [
      {
        q: "What is the Node.js event loop and how does it enable non-blocking I/O?",
        a: "Node.js runs on a single thread but handles concurrency via the event loop backed by libuv. When an async operation (DB query, file read, HTTP request) is initiated, Node offloads it and continues executing other code. When the async operation finishes, its callback is pushed into the event queue. The event loop picks it up once the call stack is empty. Phases in order: timers (setTimeout/setInterval) → pending I/O callbacks → idle/prepare → poll (wait for I/O) → check (setImmediate) → close callbacks. This makes Node ideal for I/O-heavy applications like REST APIs."
      },
      {
        q: "What is middleware in Express.js? How do you write and chain custom middleware?",
        a: "Middleware is a function with signature (req, res, next). It can read/modify req and res, terminate the cycle with res.json(), or call next() to pass to the next middleware. Custom example: const authMiddleware = (req, res, next) => { if (!req.headers.authorization) return res.status(401).json({ error: 'Unauthorized' }); next(); }; app.use('/api', authMiddleware). Order matters — middleware runs in declaration order. Error-handling middleware has 4 args: (err, req, res, next). Common uses: authentication, logging, request parsing (express.json()), rate limiting, CORS."
      },
      {
        q: "How do you structure a production-grade Node.js + Express project?",
        a: "Layer-based or feature-based separation: src/routes/ (route definitions), src/controllers/ (thin request handlers that parse req/res), src/services/ (business logic — no framework knowledge here), src/repositories/ (database access — only Prisma/SQL), src/middlewares/, src/validators/ (Zod/Joi schemas), src/utils/, src/config/ (env config). Key principle: services must not import Express or Prisma directly — they receive and return plain objects. This makes unit testing easy without spinning up a server or DB. Always validate input at the controller level before it reaches services."
      },
      {
        q: "How do you handle errors centrally in an Express application?",
        a: "Define a custom AppError class: class AppError extends Error { constructor(message, statusCode) { super(message); this.statusCode = statusCode; } }. Throw it in services: throw new AppError('User not found', 404). Wrap async routes with a HOC: const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next). Register a global error handler at the end: app.use((err, req, res, next) => { const status = err.statusCode || 500; res.status(status).json({ success: false, message: err.message }); }). Distinguish between operational errors (expected — 404, 401) and programmer errors (bugs that should crash the process in production for a clean restart via a process manager like PM2)."
      },
      {
        q: "Explain the difference between process.nextTick(), setImmediate(), and setTimeout(fn, 0).",
        a: "process.nextTick() fires after the current operation completes but before the event loop moves to the next phase — highest priority. Promise microtasks (.then/.catch) also fire before the next phase. setImmediate() runs in the 'check' phase, after I/O events are processed. setTimeout(fn, 0) runs in the 'timers' phase — after a minimum delay (~1ms). Execution order: nextTick → Promise microtasks → setImmediate/setTimeout (latter two can vary outside I/O callbacks). Use nextTick for deferring work after current operation, setImmediate for post-I/O callbacks."
      },
      {
        q: "What are Node.js streams and when would you use them in a backend application?",
        a: "Streams process data in chunks rather than loading everything into memory. Four types: Readable (fs.createReadStream, HTTP request body), Writable (fs.createWriteStream, HTTP response), Duplex (both — TCP sockets), Transform (modify data mid-stream — zlib compression, encryption). Real use cases: (1) Serving large CSV/Excel exports: fs.createReadStream('file.csv').pipe(res) streams without memory spike. (2) Processing file uploads without buffering to disk. (3) Streaming DB query results with Prisma cursor or pg QueryStream. (4) Log processing. Streams prevent Out of Memory errors for large payloads and reduce Time To First Byte (TTFB)."
      },
      {
        q: "How do you implement rate limiting in an Express API and why is it critical?",
        a: "Rate limiting protects against abuse, brute-force, and DoS. Use express-rate-limit: const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { error: 'Too many requests' } }); app.use('/api', limiter). For distributed environments (multiple server instances), store counter in Redis using rate-limit-redis — otherwise each instance has its own counter and limits are bypassed. Apply stricter limits to sensitive routes: auth endpoints (5 attempts/15 min), password reset, OTP. Also implement IP-based blocking for repeated violations using a Redis-backed blocklist middleware."
      },
      {
        q: "What is the difference between authentication and authorization? How do you implement JWT auth in Node.js?",
        a: "Authentication = who you are (identity). Authorization = what you're allowed to do (permissions). JWT flow: (1) User logs in → server verifies credentials → signs JWT: jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' }). (2) Separate refresh token (longer-lived, stored in httpOnly cookie or DB) for obtaining new access tokens. (3) Client sends access token in Authorization: Bearer <token> header. (4) Auth middleware: const decoded = jwt.verify(token, process.env.JWT_SECRET) — extracts user info. (5) Role-based auth middleware: const requireAdmin = (req, res, next) => req.user.role !== 'ADMIN' ? res.status(403).json({ error: 'Forbidden' }) : next(). Short access token TTL + refresh token rotation = good security posture."
      },
    ]
  },
  {
    category: "TypeScript",
    color: "#60A5FA",
    questions: [
      {
        q: "What are the key advantages of TypeScript in a backend Node.js project?",
        a: "Static typing catches errors at compile time, not runtime. Benefits: (1) Type safety — wrong argument types, undefined property access, and missing return values are caught before deployment. (2) IDE intelligence — full autocompletion, inline docs, safe refactoring across files. (3) Interfaces/types document API contracts for team collaboration. (4) Generics enable type-safe reusable utilities. (5) Enums prevent magic strings. (6) tsconfig strict mode eliminates entire bug categories. In backend development, TypeScript is especially valuable for DB model shapes, request/response DTOs, and service function contracts. Zero runtime cost — TypeScript compiles away."
      },
      {
        q: "What is the difference between 'interface' and 'type'? When do you use each?",
        a: "Interfaces define object shapes and support extends and declaration merging (adding properties from separate files — useful for augmenting library types). Types are more powerful: they can represent unions (string | number), intersections (&), tuples, mapped types, and conditional types. Rule of thumb: use interface for object/class contracts and public APIs where extension is expected; use type for everything else — unions, function signatures, utility transformations. Example: interface UserEntity { id: number; email: string; } (DB model) vs type CreateUserDto = Omit<UserEntity, 'id'>. Both compile away with no runtime cost."
      },
      {
        q: "How do generics work in TypeScript? Give a practical backend example.",
        a: "Generics parameterize types, making code reusable while preserving safety. Basic example: function findById<T>(id: number, list: T[]): T | undefined { return list.find((item: any) => item.id === id); }. Practical API response wrapper: interface ApiResponse<T> { success: boolean; data: T; message?: string; } — used as ApiResponse<User[]> or ApiResponse<Order>. Generic repository pattern: interface Repository<T, CreateDto> { findById(id: number): Promise<T | null>; create(dto: CreateDto): Promise<T>; deleteById(id: number): Promise<void>; } — lets you implement UserRepository<User, CreateUserDto> without repeating method signatures. Eliminates 'any' while keeping code reusable."
      },
      {
        q: "What are TypeScript utility types and which ones do you use most in backend development?",
        a: "Most used: Partial<T> — all fields optional (PATCH request body where only changed fields are sent). Required<T> — all fields required (before DB insert). Pick<T, K> — only specified fields: Pick<User, 'id' | 'email'> for response shaping. Omit<T, K> — exclude fields: Omit<User, 'password'> to strip sensitive data. Readonly<T> — immutable (config objects). Record<K, V> — key-value maps: Record<string, number> for metrics. ReturnType<typeof fn> — infer function return type. NonNullable<T> — removes null/undefined. Parameters<typeof fn> — extracts parameter types. These eliminate redundant type definitions and keep types in sync with their source."
      },
      {
        q: "How do you handle environment variables in a TypeScript project with type safety and validation?",
        a: "Create a src/config/env.ts that validates at startup: import { z } from 'zod'; const envSchema = z.object({ DATABASE_URL: z.string().url(), JWT_SECRET: z.string().min(32), PORT: z.coerce.number().default(3000), NODE_ENV: z.enum(['development', 'production', 'test']), REDIS_URL: z.string().optional() }); export const env = envSchema.parse(process.env). If validation fails (e.g., missing DATABASE_URL), the app throws immediately at startup with a clear error — not cryptically at runtime when the DB is first accessed. Import env from this module everywhere instead of process.env directly. This gives full TypeScript autocomplete on all env variables."
      },
      {
        q: "How do you write clean async error handling in TypeScript without repetitive try-catch?",
        a: "Pattern 1 — Result type (Go-style): type Result<T> = { data: T; error: null } | { data: null; error: Error }; async function safeRun<T>(fn: () => Promise<T>): Promise<Result<T>> { try { return { data: await fn(), error: null }; } catch (err) { return { data: null, error: err as Error }; } }. Usage: const { data: user, error } = await safeRun(() => prisma.user.findUnique({ where: { id } })); if (error) return next(error). Pattern 2 — asyncHandler HOC for Express: const wrap = (fn: RequestHandler): RequestHandler => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next). Apply to every async route handler — eliminates all try-catch boilerplate."
      },
      {
        q: "What are TypeScript decorators and where are they used in backend frameworks?",
        a: "Decorators annotate classes, methods, properties, or parameters to add metadata or modify behavior. Require experimentalDecorators: true in tsconfig. Used heavily in NestJS: @Controller('/users') marks a routing class, @Get('/:id') maps HTTP method to a method, @Body() extracts request body, @Injectable() enables dependency injection, @IsEmail() + @IsNotEmpty() from class-validator validate DTO fields. Prisma itself does NOT use decorators — its type safety comes from generated types based on schema.prisma. While ZOOM IT's stack (Express + Prisma) doesn't rely heavily on decorators, understanding them matters if the team migrates to NestJS for service decomposition."
      },
    ]
  },
  {
    category: "Prisma ORM",
    color: "#C084FC",
    questions: [
      {
        q: "What is Prisma ORM and how does it differ from TypeORM or Sequelize? Why is it important for this role?",
        a: "Prisma is a next-generation ORM with a schema-first approach — you define models in schema.prisma, and Prisma generates a fully type-safe client. Key differences: (1) Prisma's generated client gives compile-time guarantees — selecting a non-existent field causes a TypeScript error. TypeORM uses decorators; Sequelize uses JS class models with weaker typing. (2) Prisma Migrate generates reviewable SQL migration files committed to Git. (3) Prisma Studio provides a GUI for DB exploration. (4) $queryRaw escape hatch for complex SQL when ORM queries aren't sufficient. ZOOM IT lists Prisma ORM with 1-2+ years experience as MANDATORY — it's the primary data layer, so deep mastery is non-negotiable."
      },
      {
        q: "Walk me through Prisma schema definition with a real-world multi-table example.",
        a: "schema.prisma example — SaaS with tenants, users, and projects: model Tenant { id Int @id @default(autoincrement()); name String; users User[]; projects Project[]; createdAt DateTime @default(now()); } model User { id Int @id @default(autoincrement()); email String @unique; name String?; role Role @default(MEMBER); tenantId Int; tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade); projects Project[] @relation('ProjectMembers'); } model Project { id Int @id @default(autoincrement()); title String; tenantId Int; tenant Tenant @relation(fields: [tenantId], references: [id]); members User[] @relation('ProjectMembers'); } enum Role { ADMIN MEMBER VIEWER }. The enum integrates with TypeScript automatically. @relation with onDelete: Cascade handles FK cleanup."
      },
      {
        q: "How do Prisma migrations work in a team environment? Walk me through the complete workflow.",
        a: "Workflow: (1) Edit schema.prisma — add field or model. (2) Run npx prisma migrate dev --name add_project_status — Prisma diffs schema vs DB, generates SQL in prisma/migrations/20240101_add_project_status/, and applies to dev DB. (3) Commit both schema.prisma and the migrations/ folder to Git — reviewed in PRs just like code. (4) Teammates run npx prisma migrate dev — applies pending migrations to their local DB automatically. (5) In CI/CD pipeline, run npx prisma migrate deploy — no interaction, applies all pending migrations to staging/prod. Never manually edit generated SQL migration files — if you need custom SQL, use Prisma's migration customization. To undo in dev: npx prisma migrate reset (drops and rebuilds from scratch)."
      },
      {
        q: "What is the N+1 query problem in Prisma? How do you detect and fix it?",
        a: "N+1 happens when you fetch N records and then query each relation separately — N+1 total DB queries. Bad: const users = await prisma.user.findMany(); for (const u of users) { const posts = await prisma.post.findMany({ where: { authorId: u.id } }); }. Fix with include: const users = await prisma.user.findMany({ include: { posts: { select: { id: true, title: true } } } }) — ONE query with a JOIN. Detection: enable Prisma query logging in development: const prisma = new PrismaClient({ log: ['query'] }) — watch for repeated similar queries in console. For very complex reporting queries requiring multiple JOINs, aggregations, or window functions, use $queryRaw for full SQL control: const result = await prisma.$queryRaw`SELECT u.name, COUNT(p.id) as post_count FROM users u LEFT JOIN posts p ON p.author_id = u.id GROUP BY u.id`."
      },
      {
        q: "How do you use Prisma transactions? Explain both types with examples.",
        a: "Transactions ensure all-or-nothing execution. Type 1 — Sequential (batch): const [user, wallet] = await prisma.$transaction([prisma.user.create({ data: {...} }), prisma.wallet.create({ data: {...} })]) — all succeed or none, but later operations can't reference results of earlier ones. Type 2 — Interactive: await prisma.$transaction(async (tx) => { const user = await tx.user.create({ data: { email: 'x@y.com' } }); await tx.profile.create({ data: { userId: user.id, bio: '' } }); await tx.onboarding.create({ data: { userId: user.id, step: 1 } }); }) — later steps can use earlier results. Use transactions for: user signup (user + profile + wallet), financial transfers (debit A, credit B), any multi-step operation where partial failure leaves inconsistent state. Set a timeout: prisma.$transaction([...], { timeout: 10000 })."
      },
      {
        q: "How do you implement efficient pagination in Prisma for large datasets?",
        a: "Offset pagination (simple): const items = await prisma.post.findMany({ skip: (page-1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }); const total = await prisma.post.count({ where: filter }); return { data: items, total, page, pageCount: Math.ceil(total/pageSize) }. Works well up to ~10k records but degrades on large datasets (DB must skip many rows). Cursor-based pagination (scalable): const items = await prisma.post.findMany({ take: pageSize, skip: cursor ? 1 : 0, cursor: cursor ? { id: cursor } : undefined, orderBy: { id: 'asc' } }); const nextCursor = items[items.length-1]?.id. O(log n) regardless of offset size — ideal for feeds, infinite scroll, and large tables. Return nextCursor in the response; client sends it back as a query param."
      },
      {
        q: "How do you handle seeding in Prisma and ensure it's idempotent and safe to run repeatedly?",
        a: "Create prisma/seed.ts. Register in package.json: { 'prisma': { 'seed': 'ts-node prisma/seed.ts' } }. Run with: npx prisma db seed. Idempotent seeding with upsert: await prisma.role.upsert({ where: { name: 'ADMIN' }, update: {}, create: { name: 'ADMIN', permissions: ['read', 'write', 'delete'] } }). Always call prisma.$disconnect() in finally block. Seeding order: (1) Lookup/config data first (roles, categories, settings), (2) Test users with hashed passwords (use bcrypt), (3) Sample content in correct FK order. In CI: combine with npx prisma migrate reset --force for a clean, reproducible test environment. Never use createMany without checking existence first — use upsertMany workaround or check-then-create."
      },
      {
        q: "How do you use Prisma's select vs include and what are the performance implications?",
        a: "include fetches the main model with ALL default fields PLUS related models: prisma.user.findMany({ include: { posts: true } }) — all user columns + posts array. select specifies EXACTLY which fields to return, replacing the default: prisma.user.findMany({ select: { id: true, email: true, posts: { select: { title: true } } } }) — returns only id and email, plus posts with only title. Cannot use include and select at the same level — nest select inside include for relations. Performance tip: on list endpoints, always use select to omit heavy text columns, sensitive fields (password hash), and internal timestamps you don't need. On a table with 30 columns, selecting 5 can reduce data transfer by 80% and noticeably improve response times at scale."
      },
    ]
  },
  {
    category: "PostgreSQL",
    color: "#38BDF8",
    questions: [
      {
        q: "What types of indexes does PostgreSQL support and when do you use each?",
        a: "B-tree (default) — equality and range queries on most types: WHERE email = ? or WHERE age BETWEEN 20 AND 30. Hash — equality-only, slightly faster than B-tree for = but no range support. GIN (Generalized Inverted Index) — full-text search (tsvector), JSONB @> containment, array operators. GiST — geometric/geographic data, range types, nearest-neighbor. BRIN (Block Range Index) — very large append-only tables with naturally ordered data (timestamps, serial IDs); tiny index, approximate. Partial index — indexes only a subset: CREATE INDEX idx ON orders(user_id) WHERE status = 'PENDING'. Composite index — multi-column; leftmost column rule applies. Expression index — CREATE INDEX ON users(LOWER(email)) for case-insensitive lookups. Wrong or missing indexes are usually the first cause of slow APIs."
      },
      {
        q: "How do you identify and optimize a slow PostgreSQL query step by step?",
        a: "Step 1: EXPLAIN ANALYZE <query> — shows actual execution plan with row counts and timing. Look for: Seq Scan on large tables (missing index), high cost, nested loops with large rows, sort without index. Step 2: Add appropriate index based on the bottleneck. Step 3: Rewrite subqueries as JOINs when possible. Step 4: Use pg_stat_statements extension to identify top queries by total_time across all traffic — not just one-off slow queries. Step 5: Check for table bloat — pg_stat_user_tables shows dead tuple count — run VACUUM ANALYZE if high. Step 6: For repeated complex aggregations, use a materialized view: CREATE MATERIALIZED VIEW sales_summary AS SELECT ... — REFRESH MATERIALIZED VIEW on schedule. Step 7: Consider caching frequent expensive reads in Redis with a short TTL."
      },
      {
        q: "What is MVCC in PostgreSQL and how does it affect concurrent reads and writes?",
        a: "MVCC (Multi-Version Concurrency Control) means PostgreSQL keeps multiple versions of rows. When a row is updated, the old version is retained until no transaction needs it. Readers always see a consistent snapshot of the database at their transaction's start time — reads never block writes, writes never block reads. This is PostgreSQL's key concurrency advantage. The downside: dead tuples accumulate and must be cleaned by VACUUM (runs automatically via autovacuum, but may need tuning under high write load). Isolation levels: Read Committed (default — sees committed data per-query), Repeatable Read (consistent snapshot for entire transaction), Serializable (strictest — prevents all anomalies including phantom reads, uses predicate locking)."
      },
      {
        q: "Explain CTEs and recursive CTEs with practical examples.",
        a: "CTEs are temporary named result sets defined with WITH that exist only for the query duration. They improve readability and allow self-reference. Standard: WITH active_users AS (SELECT id, name FROM users WHERE active = true), user_revenue AS (SELECT user_id, SUM(amount) as total FROM orders GROUP BY user_id) SELECT u.name, COALESCE(r.total, 0) FROM active_users u LEFT JOIN user_revenue r ON u.id = r.user_id ORDER BY r.total DESC. Recursive CTE for hierarchical data (org chart, category tree): WITH RECURSIVE org AS (SELECT id, name, manager_id, 0 as depth FROM employees WHERE id = 1 UNION ALL SELECT e.id, e.name, e.manager_id, o.depth + 1 FROM employees e JOIN org o ON o.id = e.manager_id) SELECT * FROM org ORDER BY depth. In PostgreSQL 12+, CTEs are inlined by default; use MATERIALIZED to force separate evaluation."
      },
      {
        q: "What is ACID and how does PostgreSQL guarantee each property?",
        a: "Atomicity — all ops in a transaction commit or all roll back. Guaranteed by WAL (Write-Ahead Log): changes written to WAL before data files. On crash mid-transaction, WAL replay on restart rolls back the incomplete transaction. Consistency — constraints (NOT NULL, UNIQUE, FK, CHECK) enforce valid state transitions at commit time. Isolation — MVCC ensures each transaction sees a consistent snapshot without blocking. Durability — WAL is fsynced to disk before a COMMIT acknowledgment is returned. Even on power failure, committed data is recoverable from WAL. PostgreSQL is fully ACID compliant — critical for financial, billing, and user data. This is the primary reason PostgreSQL is chosen over eventually-consistent NoSQL for core business data."
      },
      {
        q: "How does PostgreSQL full-text search work and how do you make it production-ready?",
        a: "Core types: tsvector (preprocessed indexed document) and tsquery (search query). Basic: SELECT * FROM articles WHERE to_tsvector('english', title || ' ' || body) @@ plainto_tsquery('english', 'nodejs backend'). Production: (1) Add a stored generated column: ALTER TABLE articles ADD COLUMN tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,''))) STORED. (2) GIN index: CREATE INDEX articles_fts_idx ON articles USING GIN(tsv). (3) Query: WHERE tsv @@ plainto_tsquery('english', $1). (4) Relevance ranking: ORDER BY ts_rank(tsv, plainto_tsquery('english', $1)) DESC. For typo tolerance: pg_trgm extension with similarity() and GIN trgm index. For multi-language: pass language dynamically. FTS is far faster than LIKE '%keyword%' and supports stemming and stop words."
      },
      {
        q: "What is connection pooling in PostgreSQL and how do you configure it properly for Node.js?",
        a: "Each PostgreSQL connection is a forked OS process consuming ~5-10MB RAM. Without pooling, a new connection per request collapses under load. pg Pool maintains reusable connections: const pool = new Pool({ connectionString: env.DATABASE_URL, max: 20, idleTimeoutMillis: 30000, connectionTimeoutMillis: 5000 }). Prisma has built-in pooling via connection_limit in the connection string: postgresql://...?connection_limit=10. For serverless or many-instance deployments (Railway, ECS, serverless functions): use PgBouncer or Prisma Accelerate as an external connection pooler — multiplexes thousands of short-lived app connections into a small number of actual PostgreSQL connections. Set pool size based on: PostgreSQL max_connections (default 100), available RAM (each conn ~10MB), and expected concurrency."
      },
      {
        q: "What are PostgreSQL window functions and how do they differ from GROUP BY?",
        a: "Window functions compute values across rows related to the current row WITHOUT collapsing them (unlike GROUP BY). Syntax: fn() OVER (PARTITION BY col ORDER BY col). Common functions: ROW_NUMBER() — sequential row number in partition (get latest record per user without subquery). RANK() / DENSE_RANK() — rank with/without gaps. LAG(col, n) / LEAD(col, n) — access previous/next row's value (compare current vs previous period). SUM() OVER (PARTITION BY user_id ORDER BY date) — running total per user. NTILE(4) — quartiles. Example — latest order per user: SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn FROM orders) t WHERE rn = 1. Far more readable and faster than correlated subqueries."
      },
    ]
  },
  {
    category: "MongoDB & Mongoose",
    color: "#FB923C",
    questions: [
      {
        q: "When would you choose MongoDB over PostgreSQL for a use case in a PERN stack app?",
        a: "Choose MongoDB when: (1) Schema is flexible or evolving — product catalogs with varying attributes per category, (2) Data is hierarchical and read together — embedding related data in one document beats multiple JOINs, (3) High write throughput for semi-structured data — logs, events, telemetry, audit trails, (4) Need horizontal sharding for massive scale. Stick with PostgreSQL when: ACID transactions across multiple entities are required, data is relational, complex analytical queries are needed, or correctness is critical (financial, medical). In a PERN stack, you'd use PostgreSQL as the primary DB for core business data and MongoDB for auxiliary flexible/unstructured data (e.g., user activity logs, AI conversation history, notification payloads)."
      },
      {
        q: "What is Mongoose and what does it add over the native MongoDB driver?",
        a: "Mongoose is an ODM (Object Document Mapper) that adds structure to MongoDB. Additions: (1) Schema definition — enforces types, defaults, required constraints on otherwise schema-less collections. (2) Validation — built-in (min, max, match, enum) and custom validators with error messages. (3) Middleware/hooks — pre('save') for password hashing, post('find') for audit logging. (4) Population — replaces ObjectId references with actual documents: Post.find().populate('author', 'name email'). (5) Virtual fields — computed props not stored in DB: fullName = firstName + ' ' + lastName. (6) Query API — chainable and readable: User.find({ active: true }).select('name email').sort('-createdAt').limit(10). Native driver is faster for raw bulk ops; Mongoose shines for complex application models."
      },
      {
        q: "Explain the difference between Mongoose's populate() and MongoDB's $lookup aggregation.",
        a: "populate() is Mongoose-level — fetches the referenced document with a second DB query: const post = await Post.findById(id).populate('author', 'name email'). Makes 2 round trips (one for post, one for author). $lookup is MongoDB's server-side JOIN in the aggregation pipeline, runs in one query: db.posts.aggregate([{ $match: { _id: postId } }, { $lookup: { from: 'users', localField: 'authorId', foreignField: '_id', as: 'author' } }, { $unwind: '$author' }]). $lookup is more performant for large datasets and supports complex join conditions (pipeline-style in MongoDB 5+). Use populate() for developer convenience on simple cases; use $lookup for performance-critical paths, analytics, or joining multiple collections."
      },
      {
        q: "What MongoDB aggregation pipeline stages do you use most? Give real examples.",
        a: "$match — filter documents early to reduce pipeline work: { $match: { status: 'active', createdAt: { $gte: last30Days } } }. $group — aggregate with _id as group key: { $group: { _id: '$category', count: { $sum: 1 }, totalRevenue: { $sum: '$amount' } } }. $lookup — JOIN from another collection. $project — reshape output, add computed fields: { $project: { fullName: { $concat: ['$firstName', ' ', '$lastName'] }, _id: 0 } }. $unwind — deconstruct arrays (one doc per element). $sort — sort results. $facet — parallel pipelines for faceted search (get both filtered results and category counts in one query). $bucket — group into ranges (price buckets, age groups). $addFields — add fields without removing existing. Tip: always put $match first to reduce documents, then $sort before $limit."
      },
      {
        q: "How do you design a MongoDB schema for a multi-tenant SaaS application?",
        a: "Three strategies: (1) Database-per-tenant — separate DB per tenant. Best isolation, easy per-tenant backup, but expensive (connection overhead, operational complexity at scale). (2) Collection-per-tenant — separate collection per tenant in the same DB: users_tenant123. Good for medium scale, harder to query across tenants, schema changes need per-collection updates. (3) Shared collection + tenantId field — every document has a tenantId field: { _id, tenantId, ...data }. Create compound indexes: { tenantId: 1, email: 1 } for user lookup. This scales best and is most maintainable. Always validate tenantId at the middleware/service layer — never trust user-provided tenantId from request body. Use Mongoose discriminators for models that share a base schema but vary per tenant type."
      },
    ]
  },
  {
    category: "React & Next.js & Redux",
    color: "#34D399",
    questions: [
      {
        q: "What are React hooks and which ones do you use most in a production frontend?",
        a: "Hooks let functional components use state and lifecycle features. Most used: useState — local component state. useEffect — side effects (data fetching, subscriptions, timers) with cleanup function. useRef — access DOM nodes or persist values across renders without re-renders. useMemo — memoize expensive computed values: const sorted = useMemo(() => [...data].sort(fn), [data]). useCallback — memoize callbacks to prevent child re-renders: const handleSubmit = useCallback(() => {...}, [deps]). useContext — consume context without prop drilling. useReducer — complex state with multiple sub-values, local Redux-like pattern. Custom hooks — extract reusable stateful logic: useAuth(), useDebounce(value, 300), usePagination(). Key rule: only call hooks at the top level, never inside conditionals or loops."
      },
      {
        q: "What is Redux Toolkit (RTK) and how does it simplify Redux?",
        a: "RTK is the official opinionated Redux toolset that eliminates boilerplate. Plain Redux required separate files for action types, action creators, and reducers, plus manual immutability. RTK provides: createSlice() — defines reducer + action creators together using Immer (write mutating-style code that produces immutable updates): const counterSlice = createSlice({ name: 'counter', initialState: { value: 0 }, reducers: { increment: state => { state.value += 1 } } }); export const { increment } = counterSlice.actions. configureStore() — sets up Redux DevTools and thunk middleware automatically. createAsyncThunk() — handles async action lifecycle (pending/fulfilled/rejected states) cleanly. RTK Query — eliminates manual fetch + loading state management entirely. RTK makes Redux the right choice for complex shared state without the boilerplate pain."
      },
      {
        q: "What is RTK Query and how does it differ from useEffect-based data fetching?",
        a: "RTK Query is a powerful data fetching and caching layer built into Redux Toolkit. Define an API: const api = createApi({ reducerPath: 'api', baseQuery: fetchBaseQuery({ baseUrl: '/api', prepareHeaders: (headers, { getState }) => { headers.set('authorization', `Bearer ${getState().auth.token}`); return headers; } }), endpoints: builder => ({ getUsers: builder.query({ query: () => '/users', providesTags: ['User'] }), createUser: builder.mutation({ query: body => ({ url: '/users', method: 'POST', body }), invalidatesTags: ['User'] }) }) }). Usage: const { data, isLoading, error } = useGetUsersQuery(). Automatic: caching (no duplicate requests), cache invalidation after mutations, loading/error/success states, polling, optimistic updates, request deduplication. vs useEffect: manual loading/error/data state, manual deduplication, manual invalidation — all error-prone and verbose."
      },
      {
        q: "What is the difference between Next.js App Router and Pages Router? Which patterns should a backend-focused developer know?",
        a: "Pages Router (legacy): pages/ directory, getServerSideProps/getStaticProps for server-side data fetching, _app.tsx for global layout. App Router (Next.js 13+, current standard): app/ directory, React Server Components (RSC) by default — render on server, fetch data directly (no useEffect), can access DB or call internal services, reduce JS bundle sent to client. 'use client' directive opts a component into being a Client Component (needed for interactivity, useState, browser APIs). Nested Layouts — app/layout.tsx wraps child pages with persistent UI. Server Actions — functions marked 'use server' that run on the server, callable from client components or forms. Route Groups — (folder) organizes routes without affecting URL. For a backend-focused role: understand Server Components for reducing client JS, Server Actions as an alternative to REST for form mutations, and when to use each."
      },
      {
        q: "How do you optimize React application performance in a production app?",
        a: "Component level: React.memo() — wrap to skip re-render if props are shallowly equal. useMemo — memoize expensive calculations. useCallback — stable function references for child component props. Avoid anonymous functions in JSX render (new reference every render triggers child re-render). Key lists with stable unique IDs, not array indexes. State: keep state as low as possible in the tree — lifting too high causes unnecessary re-renders up the tree. Code splitting: React.lazy + Suspense for route-level splitting. Next.js dynamic(): dynamic(() => import('./HeavyComponent'), { ssr: false }). Images: Next.js <Image> component handles lazy loading, WebP conversion, and responsive sizes automatically. Virtualization: react-window or TanStack Virtual for rendering only visible rows in large lists (1000+ items). Bundle analysis: next build + @next/bundle-analyzer to find large dependencies."
      },
    ]
  },
  {
    category: "Git & DevOps / CI/CD",
    color: "#F472B6",
    questions: [
      {
        q: "Describe your Git branching strategy and commit conventions for a team project.",
        a: "Git Flow variant: main (production, protected) → develop (integration) → feature/xxx (individual work). Workflow: branch from develop → feature/add-user-auth. Commit frequently with atomic messages following Conventional Commits: feat(auth): add JWT refresh token rotation. fix(api): handle expired token 401 correctly. chore: upgrade prisma to 5.10. Open PR to develop → review → squash merge. Hotfixes: branch from main → fix → merge to main AND develop. Release: merge develop → main → tag v1.2.0. Branch protection: require PRs, require 1+ approvals, require CI passing (type check + tests) before merge, prohibit force push to main. This ensures every production change is reviewed and tested. Semantic versioning for API releases: MAJOR.MINOR.PATCH."
      },
      {
        q: "What is CI/CD and how would you set up a pipeline for a Node.js + PostgreSQL + Prisma project?",
        a: "CI (Continuous Integration) runs automated checks on every push/PR. CD (Continuous Deployment) auto-deploys passing builds. GitHub Actions pipeline: Trigger on push to main/develop and on PRs. Jobs: (1) Lint & type-check — npm ci, tsc --noEmit, eslint. (2) Test — spin up postgres:15 service container, set DATABASE_URL, run npx prisma migrate deploy, run jest --coverage. (3) Deploy (main only) — build Docker image, push to ECR, SSH to server and run docker-compose pull && docker-compose up -d. Prisma migrate deploy runs as a pre-deploy step in the pipeline, not inside the container CMD (avoids running migrations on every replica startup in multi-instance setups). Fail fast: lint before running slower tests. Set secrets in GitHub Actions secrets (DATABASE_URL, JWT_SECRET, etc.)."
      },
      {
        q: "How do you manage secrets and environment variables across dev, staging, and production?",
        a: "Never commit secrets to Git (.gitignore for .env files). Local dev: .env file loaded by dotenv. Staging/Production: (1) Cloud secret manager — AWS Secrets Manager or GCP Secret Manager — fetch at startup, rotate without redeployment. (2) Platform env vars — Railway, Render — set in dashboard, injected at runtime. (3) GitHub Actions secrets for CI/CD. Validation: Zod env schema at startup (fail fast if required vars missing). Never log secrets — mask in error handlers, avoid logging req.headers in production. Separate secrets per environment: dev/staging/prod have different DB URLs, JWT secrets, API keys. JWT secret rotation: maintain PREVIOUS_JWT_SECRET for a rotation window (verify with either, sign new tokens with current) to avoid logging out all users simultaneously."
      },
      {
        q: "How do you containerize a Node.js + Prisma application with Docker?",
        a: "Multi-stage Dockerfile: Stage 1 (builder): FROM node:20-alpine as builder. WORKDIR /app. COPY package*.json ./. RUN npm ci. COPY . . RUN npx prisma generate && npx tsc. Stage 2 (production): FROM node:20-alpine. WORKDIR /app. COPY --from=builder /app/dist ./dist. COPY --from=builder /app/node_modules ./node_modules. COPY prisma ./prisma. RUN npx prisma generate. EXPOSE 3000. CMD ['node', 'dist/server.js']. Key: do NOT run npx prisma migrate deploy inside CMD — run it as a separate step in CI/CD pipeline before starting new containers (avoids running migrations on every replica in a multi-instance deployment). docker-compose.yml for local dev: app service + postgres service + redis service with named volumes for DB persistence. Health check: HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1."
      },
      {
        q: "How do you work effectively in a Linux/Unix environment for backend development?",
        a: "Essential skills: Navigation — ls -la, find /app -name '*.ts', grep -r 'pattern' ./src. Process management — ps aux | grep node, kill -9 PID, systemctl status app. Networking — curl -X POST -H 'Content-Type: application/json' -d '{...}' http://localhost:3000/api/users (API testing), netstat -tulpn | grep 3000 (check what's listening), lsof -i :3000. Log inspection — tail -f logs/app.log, grep 'ERROR' app.log | wc -l. SSH — ssh-keygen -t ed25519, ssh user@server, scp file.txt user@server:/path. Environment — export NODE_ENV=production, .bashrc/.zshrc for persistent vars. Node version — nvm use 20. Cron — crontab -e for scheduled tasks. Permissions — chmod 755, chown user:group. Background processes — node server.js > app.log 2>&1 & and disown."
      },
    ]
  },
  {
    category: "System Design & Architecture",
    color: "#FBBF24",
    questions: [
      {
        q: "How would you design a scalable REST API for a SaaS product from scratch?",
        a: "Architecture layers: Client → Load Balancer → API Gateway (rate limiting, auth, request logging) → Stateless App Servers (horizontal scaling) → Cache Layer (Redis) → Primary PostgreSQL + Read Replicas → Object Storage (S3 for files). API design standards: versioned endpoints (/api/v1/), resource-based URLs, correct HTTP methods (GET/POST/PUT/PATCH/DELETE) and status codes, cursor-based pagination for lists, consistent JSON envelope { success, data, message, pagination }. Security: JWT access tokens (15min) + refresh tokens (30d, stored httpOnly cookie), HTTPS only, helmet.js headers, input validation via Zod, SQL injection protection via parameterized queries (Prisma handles this). Performance: Redis cache for expensive reads (user profiles, configs), async background jobs for non-critical work (emails, notifications via BullMQ), database read replicas for heavy read workloads."
      },
      {
        q: "What is caching and how would you implement Redis caching in a production Node.js backend?",
        a: "Redis is an in-memory key-value store ideal for: session storage, rate limiting counters, API response caching, pub/sub messaging, and job queues. Implementation with ioredis: const redis = new Redis(env.REDIS_URL). Cache-aside pattern: async function getUserById(id: number) { const key = `user:${id}`; const cached = await redis.get(key); if (cached) return JSON.parse(cached) as User; const user = await prisma.user.findUniqueOrThrow({ where: { id }, select: { id: true, email: true, name: true } }); await redis.setex(key, 300, JSON.stringify(user)); // 300s TTL return user; }. Cache invalidation on update: await redis.del(`user:${id}`). For lists: use short TTLs (30-60s) or tag-based invalidation. For distributed locking (prevent race conditions): redis.set(key, 1, 'EX', 10, 'NX') — only one process acquires the lock. Cache stampede prevention: use a mutex or background refresh pattern."
      },
      {
        q: "What is the difference between monolith and microservices? When do you choose each?",
        a: "Monolith: single codebase and deployment unit. Pros: simpler to develop, test, debug, and deploy initially; no network overhead between features; ACID transactions across features are trivial; single deployment. Cons: scales as a unit (can't scale just the bottleneck service), deployment risk increases as codebase grows, single language/framework for everything. Microservices: features split into independently deployable services communicating via REST or message queues. Pros: independent scaling, independent deployment, fault isolation (one service failing doesn't crash everything), technology flexibility per service. Cons: distributed system complexity (network failures, distributed tracing, eventual consistency, service discovery), operational overhead (multiple deployments, monitoring, APIs between services), harder local development. Recommendation for ZOOM IT context: start with a well-structured monolith with clear service boundaries in code — extract microservices only when you have real scaling needs or separate team ownership requirements. Premature microservices is a classic engineering mistake."
      },
      {
        q: "How do you implement background job processing in a Node.js application?",
        a: "Use BullMQ with Redis as the job queue backend. Setup: const emailQueue = new Queue('email', { connection: redisConnection }). Add jobs: await emailQueue.add('welcome-email', { userId, email }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, delay: 0 }). Process in worker: const worker = new Worker('email', async job => { if (job.name === 'welcome-email') { await sendWelcomeEmail(job.data.email); } }, { connection: redisConnection, concurrency: 5 }). Worker event handlers: worker.on('failed', (job, err) => logger.error('Job failed', { jobId: job?.id, err })). Use BullMQ Board UI for monitoring queues. Common use cases: email/SMS sending, PDF generation, report building, image processing, webhook delivery, AI inference requests, scheduled recurring tasks (Bull's cron-like repeat option). Run workers as separate processes — don't run them in the main API process."
      },
      {
        q: "How would you approach building an AI-integrated backend at ZOOM IT?",
        a: "The job post explicitly mentions AI-integrated applications as a plus. Architecture: API → AI Service Layer → OpenAI/Anthropic API. Key patterns: (1) Streaming responses — use SSE (Server-Sent Events) or WebSockets to stream tokens as they're generated: res.setHeader('Content-Type', 'text/event-stream'); stream each chunk via res.write(`data: ${JSON.stringify({chunk})}\n\n`). Don't wait for full completion — users see output in real-time. (2) Token cost control — estimate token count before calling (tiktoken library), implement per-user token budgets tracked in PostgreSQL, cache identical prompts in Redis. (3) Rate limit compliance — OpenAI has per-minute token limits; use BullMQ for queue-based processing with controlled concurrency. (4) Structured outputs — use OpenAI function calling or JSON mode for machine-readable responses. (5) Observability — log every AI call: model, tokens used, latency, user ID, cost estimate. (6) Fallback handling — graceful degradation when AI service is unavailable."
      },
    ]
  },
  {
    category: "Behavioral & Culture Fit",
    color: "#A78BFA",
    questions: [
      {
        q: "Tell me about yourself and why you're applying for this backend-focused PERN role at ZOOM IT.",
        a: "Use Present-Past-Future structure. Present: 'I'm a backend-focused full stack developer with strong experience in Node.js, TypeScript, Prisma ORM, and PostgreSQL — the core of this role. I've spent the last [X] years building RESTful APIs, designing schemas, and optimizing query performance.' Past: mention 1-2 specific projects demonstrating backend depth — e.g., 'I built a multi-tenant SaaS API with Prisma and PostgreSQL handling 100k+ records, implemented cursor-based pagination, and used Redis caching to bring response times under 100ms.' Highlight Prisma specifically since it's mandatory. Future: why ZOOM IT — the PERN stack alignment, the engineering-focused collaborative culture, the AI integration angle, and growth in scalable system architecture. Show you've read the post: mention the mandatory Prisma requirement, the 5-day work week (Sat–Thu), and the Bosila, Mohammadpur location works for you."
      },
      {
        q: "Describe the most technically challenging backend problem you solved. Walk me through it.",
        a: "Use STAR: Situation (project context), Task (what the specific problem was — e.g., API latency spiking to 2 seconds under moderate load), Action (systematic investigation: profiled with clinic.js, found multiple N+1 Prisma queries in a nested include chain, identified missing composite index on (user_id, status) via EXPLAIN ANALYZE, rewrote queries using select to fetch only needed fields, added index, added Redis caching with 60s TTL for the hot endpoint), Result (latency dropped from 2000ms to 120ms at the same load). Key elements: demonstrate systematic debugging rather than guessing, specific tools used (EXPLAIN ANALYZE, Prisma query logging, profiling tools), and a measurable outcome. If you lack a dramatic example, describe a challenging schema design decision and the tradeoffs considered — this also demonstrates seniority."
      },
      {
        q: "How do you approach code reviews — both giving and receiving feedback?",
        a: "Giving feedback: Be specific and explain the 'why' — not 'this is wrong' but 'this Prisma query will produce N+1 on large datasets — here's the fix with include.' Use 'nit:' prefix for minor style preferences you won't block on. Acknowledge good work — 'smart use of cursor-based pagination here.' Ask questions rather than dictate: 'I'm curious why you chose X — would Y cause an issue I'm not seeing?' Frame security or correctness issues clearly without being harsh: 'This doesn't sanitize the input — a user could pass an object here and crash the handler.' Receiving: Don't take it personally — your code is reviewed, not you. If you disagree, respond with reasoning and data, not defensiveness. Say 'good catch' genuinely when they find a real bug. Both roles: the goal is shipping correct, maintainable code — not winning arguments or demonstrating superiority."
      },
      {
        q: "How do you manage your productivity and deep work as a backend engineer?",
        a: "Protect large blocks of uninterrupted time for complex backend work — schema design, query optimization, and system design require sustained focus that can't be done in 15-minute fragments. I use time-blocking: mornings for deep coding (no meetings before 11am ideally), afternoons for collaboration (code reviews, PR feedback, discussions). For context switching: maintain a short notepad of what I was doing and next steps before switching tasks — reduces the re-orientation cost when returning. Task management: break epics into concrete, estimated sub-tasks before starting — 'implement user auth' is not a task; 'write POST /auth/login endpoint with JWT generation and refresh token DB storage' is. Daily standup habit: 15-min morning review of what's blocking progress vs. what's on track. For ZOOM IT's 10AM-6:30PM schedule: I can deliver focused output in those hours consistently — I don't conflate hours worked with output quality."
      },
      {
        q: "How do you handle technical debt and balance speed vs. code quality in a fast-paced team?",
        a: "Technical debt is inevitable — the problem is invisible debt. My approach: (1) Make debt explicit — when taking a shortcut due to deadline, add a code comment with //TODO: <why this is a shortcut and what the proper solution is> and create a ticket immediately. Invisible debt silently compounds. (2) Distinguish types: sloppy code (always bad), necessary shortcuts (acceptable with tracking), and architectural debt (requires scheduled time to fix). (3) Advocate for refactoring budget — 15-20% of sprint capacity for debt reduction. (4) Never skip tests on core business logic — auth, payments, data migrations — even under deadline pressure. (5) On greenfield code: build the right abstraction the first time (service/repository separation, proper error handling) — it takes 20% more time now but avoids months of painful retrofitting later. Communicate tradeoffs clearly: 'I can ship this in 2 days with these shortcuts, or in 3 days cleanly — here's what we risk with the shortcuts.'"
      },
      {
        q: "Where do you want to be as a backend engineer in 2-3 years?",
        a: "Be specific and connect to the role's trajectory: 'In 2-3 years, I want to be confidently designing distributed backend systems and making architectural decisions — not just implementing features. Specifically: (1) Deepen PostgreSQL expertise — query planner internals, table partitioning, streaming replication setup. (2) Learn distributed system patterns — event sourcing, CQRS, saga pattern for distributed transactions across services. (3) Get hands-on with cloud infrastructure — AWS ECS/RDS/ElastiCache or GCP equivalents. (4) Build real production experience with AI-integrated backends — the intersection of LLM APIs and backend engineering is where the industry is heading, and the job post's mention of AI-powered applications excites me. I see this role at ZOOM IT as a strong accelerator — working on scalable PERN stack systems in an engineering-focused environment will compress years of learning into months.'"
      },
      {
        q: "How do you handle working in an Agile environment when requirements change mid-sprint?",
        a: "Acknowledge it's normal. My approach: (1) Surface impact immediately — before silently accepting a scope change, assess: Does this change the DB schema? The API contract? Something already consumed by a client? Raise these dependencies in standup: 'Adding this changes the users table schema — I need to know if the mobile team has already deployed code relying on the current shape.' (2) Communicate tradeoffs, don't absorb silently — 'Adding this mid-sprint means X is delayed 2 days — should I deprioritize Y or flag for next sprint?' (3) Build for change — service/repository separation, no hardcoded business logic in controllers, small composable functions. Code that's structured well is easy to modify without breaking things. (4) Time-box investigation — spend 30 min scoping a new requirement before estimating. Never estimate in the moment under pressure. The skill is adaptability WITH communication — the failure mode is silently over-committing and missing deadlines."
      },
    ]
  }
];

const totalQ = qaData.reduce((acc, c) => acc + c.questions.length, 0);

export default function ZoomItQA() {
  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const toggle = (ci, qi) => {
    const key = `${ci}-${qi}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    const all = {};
    qaData.forEach((cat, ci) => cat.questions.forEach((_, qi) => { all[`${ci}-${qi}`] = true; }));
    setOpenItems(all);
  };

  const collapseAll = () => setOpenItems({});

  const allCategories = ["All", ...qaData.map(c => c.category)];

  const filtered = qaData
    .filter(c => activeCategory === "All" || c.category === activeCategory)
    .map(c => ({
      ...c,
      questions: c.questions.filter(item =>
        !search ||
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
      )
    }))
    .filter(c => c.questions.length > 0);

  const visibleCount = filtered.reduce((acc, c) => acc + c.questions.length, 0);
  const openCount = Object.values(openItems).filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "#07070F", fontFamily: "'IBM Plex Mono','Courier New',monospace", color: "#E2E2F0" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(160deg,#0C0C1C 0%,#07070F 100%)", borderBottom:"1px solid #0F0F20", padding:"44px 24px 36px", textAlign:"center" }}>
        <div style={{ maxWidth:740, margin:"0 auto" }}>
          <div className="flex gap-5">
            <Link to="/krazyit-question">
              <div
                className="badge"
                style={{
                  background: "#00D9FF15",
                  color: "#00D9FF",
                  border: "1px solid #00D9FF30",
                  marginBottom: 20,
                }}
              >
                <span>◉</span> KrazyIT · Full Stack Developer
              </div>
            </Link>

            <Link to="/zoomit-question">
              <div
                className="badge"
                style={{
                  color: "#4ADE80",
                  marginBottom: 20,
                  background: "#4ADE8012",
                  border: "1px solid #4ADE8028",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    background: "#4ADE80",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                />
                ZOOM IT · Backend-Focused Full Stack Engineer (PERN)
              </div>
            </Link>
          </div>

          <h1 className="hero-title" style={{ marginBottom:14 }}>
            Interview<br/><span style={{ color:"#4ADE80" }}>Q&A</span> Prep Kit
          </h1>

          <p style={{ color:"#36365A", fontSize:12, lineHeight:1.7, maxWidth:480, margin:"0 auto 28px" }}>
            {totalQ} curated Q&As for the ZOOM IT PERN Stack role. Node.js · TypeScript · Prisma (Mandatory) · PostgreSQL · MongoDB · React · Next.js · Redux · System Design.
          </p>

          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:24 }}>
            {[
              { v: totalQ, l: "Questions", c: "#4ADE80" },
              { v: qaData.length, l: "Categories", c: "#60A5FA" },
              { v: "35k", l: "BDT Salary", c: "#C084FC" },
              { v: "1–2", l: "Yrs Exp", c: "#FB923C" },
              { v: "5-day", l: "Work Week", c: "#FBBF24" },
            ].map(s => (
              <div key={s.l} className="stat-box">
                <div style={{ fontSize:19, fontWeight:700, color:s.c, fontFamily:"Syne,sans-serif" }}>{s.v}</div>
                <div style={{ fontSize:10, color:"#30304A", marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap" }}>
            {["📍 Bosila, Mohammadpur", "🕙 10AM – 6:30PM", "⚠️ Prisma ORM — MANDATORY", "🛠 PERN Stack", "💻 Onsite Only"].map(t => (
              <span key={t} style={{ fontSize:10, color:"#2E2E48", padding:"3px 10px", background:"#0B0B1A", border:"1px solid #111120", borderRadius:99 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Filter + Controls */}
      <div style={{ borderBottom:"1px solid #0F0F20", padding:"12px 20px", display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
          {allCategories.map(cat => {
            const catData = qaData.find(c => c.category === cat);
            const color = catData?.color || "#E2E2F0";
            const isActive = activeCategory === cat;
            return (
              <button key={cat} className="pill" onClick={() => setActiveCategory(cat)}
                style={{ background: isActive ? `${color}15` : "transparent", color: isActive ? color : "#30304A", borderColor: isActive ? `${color}35` : "#111120" }}>
                {cat}
              </button>
            );
          })}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <input className="search-input" placeholder="🔍 Search questions..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="act-btn" onClick={expandAll}>Expand All</button>
          <button className="act-btn" onClick={collapseAll}>Collapse</button>
        </div>
      </div>

      {/* Count */}
      <div style={{ padding:"8px 20px", borderBottom:"1px solid #0A0A18", display:"flex", gap:14 }}>
        <span style={{ fontSize:10, color:"#252540" }}>Showing <span style={{ color:"#5050A0" }}>{visibleCount}</span> of {totalQ} questions</span>
        {openCount > 0 && <span style={{ fontSize:10, color:"#252540" }}><span style={{ color:"#5050A0" }}>{openCount}</span> open</span>}
      </div>

      {/* Q&A Content */}
      <div style={{ maxWidth:840, margin:"0 auto", padding:"28px 20px 80px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 0", color:"#252540", fontSize:13 }}>
            No questions match your search.
          </div>
        )}

        {filtered.map(category => {
          const realCatIdx = qaData.findIndex(c => c.category === category.category);
          return (
            <div key={category.category} style={{ marginBottom:34 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:3, height:16, background:category.color, borderRadius:2, flexShrink:0 }} />
                <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:12, fontWeight:700, color:category.color, letterSpacing:"0.07em", textTransform:"uppercase" }}>
                  {category.category}
                </h2>
                <div style={{ flex:1, height:1, background:"#0F0F20" }} />
                <span style={{ fontSize:10, color:"#1E1E30", flexShrink:0 }}>{category.questions.length}q</span>
              </div>

              {category.questions.map((item, qIdx) => {
                const realQIdx = qaData[realCatIdx].questions.findIndex(q => q.q === item.q);
                const key = `${realCatIdx}-${realQIdx}`;
                const isOpen = !!openItems[key];
                return (
                  <div key={qIdx} className="qa-card" style={{ borderColor: isOpen ? `${category.color}22` : undefined }}>
                    <button className="qa-btn" onClick={() => toggle(realCatIdx, realQIdx)}
                      style={{ background: isOpen ? "#090914" : undefined }}>
                      <svg className={`chevron ${isOpen ? "open" : ""}`} viewBox="0 0 24 24" fill="none"
                        stroke={isOpen ? category.color : "#252540"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      <span style={{ color: isOpen ? "#C0C0E0" : "#6060A0" }}>{item.q}</span>
                    </button>

                    {isOpen && (
                      <div className="qa-answer">
                        <div style={{ borderLeft:`2px solid ${category.color}35`, paddingLeft:14, marginTop:2 }}>
                          {item.a}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ marginTop:48, padding:"18px 22px", background:"#0A0A16", border:"1px solid #0F0F20", borderRadius:8, textAlign:"center" }}>
          <div style={{ fontSize:10, color:"#1E1E30", marginBottom:6, letterSpacing:"0.1em", textTransform:"uppercase" }}>Apply to ZOOM IT</div>
          <div style={{ fontSize:12, color:"#4ADE80" }}>Bosila, Mohammadpur, Dhaka · Onsite</div>
          <div style={{ fontSize:10, color:"#1E1E30", marginTop:6 }}>Sat–Thu · 10:00 AM – 6:30 PM · Up to 35,000 BDT · 1 Vacancy</div>
        </div>
      </div>
    </div>
  );
}