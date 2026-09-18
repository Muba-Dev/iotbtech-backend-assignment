# IOTBTECH 2026: Backend Assignment
## Classes 31–33 (Node.js · Express · TypeScript · Middleware)
**Due: Last Day of Phase 4 | Format: Public GitHub Repo (link submission)**

---

## INSTRUCTIONS

This assignment has **TWO PARTS**:

1. **Part 1 — Theory & Guided Practice** — written answers to conceptual/predict-the-output questions.
2. **Part 2 — Mini Project: "Products Inventory CLI → API"** — a single project built in three phases that ties Class 31 (Node CLI + streams), Class 32 (Express + three-layer structure), and Class 33 (middleware + error handling) into one pipeline.

**You must also complete the "Know Your Confusion" self-check (Part 3)** on your own — it is not submitted, but the blurring points in it are exactly where you will lose marks.

### Submission (READ CAREFULLY)

1. **Create a repository** in **your personal GitHub account** called exactly: `iotbtech-backend-assignment` (public).
2. Put **everything** in that repo:
   - `THEORY.md` — your written answers to Part 1 (one file, headings per class)
   - `mini-project/` — the full mini project (Phase A, B, C)
   - `README.md` — what the project is, how to run it, and your one-line takeaway per class
3. **Submit using your GitHub link** via the submission form. **The form will be shared on the last day.**
4. No link = no submission = no marks. Double-check your repo is **public** before submitting (otherwise your link 404s for the instructor).

> **CRITICAL**: Theory questions ask *why* and *predict* — they require *your* reasoning. AI cannot answer "why does a stream use less memory than a Buffer?" with anything that shows *you* understand it. Answers copied from an AI will read as generic and get low marks. Write in your own voice.

---

# PART 1: THEORY & GUIDED PRACTICE
## Answer each question in your own words. Be specific. Where asked, show the exact expected output.

---

## CLASS 31: Node.js Runtime, Buffer, Streams & Bun

**1. (Predict)** You run this command:

```bash
node app.js --port 8080 --host localhost
```

And `app.js` contains only:

```javascript
console.log(process.argv);
console.log(process.argv.slice(2));
```

Write the **exact** output of both lines. Then explain in one sentence why the two outputs differ — what do indices `0`, `1`, and `2+` of `process.argv` represent?

**2. (Explain)** Why do you almost always write `process.argv.slice(2)` and never `process.argv` directly in a real CLI tool? What happens the day someone runs your script from a different folder or with a wrapper like `bun run app.js`?

**3. (Explain)** Run this in Node:

```javascript
console.log(Buffer.from("مرحبا").length);
console.log(Buffer.from("hello").length);
console.log("مرحبا".length);
```

Write the three outputs. Then explain **why** the first two numbers are different from each other, and why the third line gives a different number from the first. Use the words "bytes" and "characters" correctly.

**4. (Reasoning)** You must process a **5 GB** log file on a machine with **8 GB** of RAM.

```javascript
// ❌ Bad
const data = readFileSync("huge.log", "utf8");
```

Explain, step by step, why this approach will crash the machine — and state precisely where the file *goes* in memory. Then explain how `createReadStream` avoids the problem even though it reads the *same* file.

**5. (Compare)** In your own words, what is the practical difference between `readable.pipe(writable)` and `pipeline(readable, writable)`? Invent one failure scenario where `pipe()` leaves a problem behind and `pipeline()` does not.

**6. (Predict)** 

```javascript
const buf = Buffer.from("Node.js");
console.log(buf.toString("hex"));
console.log(buf.toString("base64"));
```

Write the two expected outputs. Check by running it. If yours was wrong, write down the correct values **and** what you misunderstood.

**7. (Explain)** "Streams keep memory flat." What does "flat" mean here? Contrast the memory profile of the *bucket* approach vs the *pipe* approach for a growing file (10,000 rows → 10,000,000 rows). Which one becomes flat, and which one grows linearly?

**8. (Compare)** Give **three** concrete things Bun does out of the box that plain Node does not. For each, say whether you'd reach for Bun or Node on a real team project today, and why.

---

## CLASS 32: Express & TypeScript

**9. (Predict)** A file contains these routes **in this exact order**:

```typescript
app.use(express.json());

app.get("/api/products/:id", (req, res) => {
  res.json({ hit: "by-id", id: req.params.id });
});

app.get("/api/products/featured", (req, res) => {
  res.json({ hit: "featured" });
});

app.use("/api/products", (req, res) => {
  res.json({ hit: "fallback" });
});
```

You send these three requests:

```
GET /api/products/featured
GET /api/products/42
GET /api/products/unknown-handled-elsewhere?category=toys  (just the path: /api/products)
```

What does each request respond with, and **why**? Mention route order and express's "first matching route wins" rule in your answer.

**10. (Explain)** In `app.get("/api/products/:id", handler)`, what type is `req.params.id`? Write the exact expression you'd use to get it as a **number**, and explain why Express does not convert it for you.

**11. (Explain)** Routes, controllers, services — one sentence each about the *job* of each layer. Then answer: your company decides to switch from storing products in a plain array to reading them from a CSV at boot. **Which single file do you edit, and why only that one?** (Name the file pattern, e.g. `product.service.ts`.)

**12. (Explain)** A student POSTs JSON to their server with curl:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Headphones","price":99}'
```

In the handler they do `console.log(req.body)` and it prints `undefined`. Their `package.json` is correct, the server runs, and the route exists. What is the **one missing line**, where must it go, and why does the route handler see `undefined` without it?

**13. (Reasoning)** Explain the "prefix" behavior of this line:

```typescript
app.use("/api/products", productRouter);
```

`productRouter` contains `router.get("/", ...)` and `router.get("/:id", ...)`. List the **two full URLs** those routes actually respond to. What would a `router.get("/top")` inside the same router respond to?

**14. (Choose)** For each action, pick the most correct status code and **justify** it in one line: (a) a successful `POST` creating a product, (b) a request for a product id that doesn't exist, (c) a `POST` missing a required `name` field, (d) an unexpected crash inside a route handler, (e) a successful `GET` returning a list.

---

## CLASS 33: Middleware & Error Handling

**15. (Predict)** A server registers this, top to bottom:

```typescript
app.use((req, res, next) => {
  console.log("M1 in");
  next();
  console.log("M1 out");
});

app.use(express.json());

app.use((req, res, next) => {
  console.log("M2", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  console.log("handler starts");
  res.send("ok");
  console.log("handler ends");
});
```

A `GET /` arrives. Write the **exact console output, in order**, including the `M1 out` line. Then explain *when* `M1 out` runs relative to the handler, and why.

**16. (Explain)** A middleware forgets to call `next()` AND never calls `res.send()`. What does the client see? What does your terminal see? Why can't Express automatically guess the middleware is "done"?

**17. (Explain)** These two look almost identical:

```typescript
// A
app.use((req, res, next) => { /* ... */ });

// B
app.use((err, req, res, next) => { /* ... */ });
```

Why does Express treat B as an *error handler* but A as normal middleware, and how does it decide? What happens if you "clean up" B to `(err, req, res)`?

**18. (Compare)** Explain the difference between `next()` and `next(err)`. In a pipeline of `[logger, json, routes, errorHandler]`, trace what happens to the request with (a) `next()` and (b) `next(err)` in the middle of the routes. Which one skips the remaining regular middleware?

**19. (Explain)** This middleware logs every request to a file:

```typescript
export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.url} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
}
```

The log line is written **after** `res.send()` runs in the handler, even though `next()` is called before the handler runs. Explain the mechanism (`res.on("finish")`, event-driven, what fires later and why).

**20. (Explain)** Express 4 vs Express 5: a route handler is `async` and `await findProduct(id)` rejects (throws). What happens in Express 4 by default, and what happens in Express 5? What are the **two** patterns you'd use to fix it in Express 4? How do you check which version you have installed?

**21. (Reasoning)** A 404 catch-all handler and a global error handler both live at the bottom of `index.ts`. In your own words: what's the difference between "no route matched" (404) and "the handler crashed" (500)? Why must the 404 handler come **before** the error handler? What would happen if you swapped them?

---

# PART 2: MINI PROJECT — "Products Inventory CLI → API"

## Project overview

One repo, three phases — each phase *feeds* the next:

```
Phase A (CLI)  ── generates ──►  products.csv          (10,000 rows)
                      │
                      ▼
Phase B (API)  ── imported by ──►  src/services/product.service.ts
                      │
                      ▼
Phase C (API)  ── wrapped with ──►  logger · auth guard · 404 · error handler
```

Repo structure (build exactly this):

```
iotbtech-backend-assignment/
├── THEORY.md
├── README.md
└── mini-project/
    ├── package.json
    ├── tsconfig.json
    ├── .gitignore            ← node_modules/, dist/, logs/
    ├── scripts/
    │   ├── generate.ts        ── Phase A
    │   └── aggregate.ts       ── Phase A
    ├── data/
    │   └── (generated products.csv lives here — tell git to keep it or ignore it, your call)
    └── src/
        ├── index.ts            ── Phase B + C (boot, mount, pipeline)
        ├── middleware/
        │   ├── requestLogger.ts
        │   ├── requireApiKey.ts
        │   ├── notFoundHandler.ts
        │   └── errorHandler.ts
        ├── routes/
        │   └── product.routes.ts
        ├── controllers/
        │   └── product.controller.ts
        ├── services/
        │   └── product.service.ts
        └── utils/
            └── logger.ts
        (optional) src/utils/loadProducts.ts   — if you split CSV loading out
```

---

## PHASE A — Node CLI Scripts (Class 31)

### A1. `scripts/generate.ts` — Generate the CSV

- Reads `process.env.ROWS` and defaults to `10_000` if unset (`process.env.ROWS ?? "10000"`).
- Generates an inventory CSV with header: `id,name,category,price,stock`
- Realistic-ish data: pick **6 categories** (e.g. `electronics, clothing, books, home, toys, food`), product names per category (`electronics-1`, ...), prices with decimals, stock integers 0–500.
- Writes to `data/products.csv`.
- Logs to **stdout** something like `Generated 10000 rows -> data/products.csv`.

Migrate to ESM-safe run: `npx tsx scripts/generate.ts` or `bun scripts/generate.ts`.

### A2. `scripts/aggregate.ts` — Aggregate with streams (the core of Phase A)

**Must use a stream** (`createReadStream` + `readline`) — no `readFileSync` — so it would work on a file way too big for RAM.

- Skips the header line.
- For each line, computes `total = price * stock`.
- Accumulates:
  - **total inventory value per category** (log each: `electronics → $1,234.56`)
  - **grand total** across everything
  - **row count**
- Uses `process.env.OUTFile` defaulting to `data/category-summary.csv`, and writes **each category's total** to that file with `createWriteStream`.
- Logs grand total, row count, and runtime in `ms` to stdout.

Verify together: `npx tsx scripts/generate.ts && npx tsx scripts/aggregate.ts` — outputs must be consistent.

> **The test that proves you understood streams:** regenerate with `ROWS=1000000` and compare. Phase A must keep running fine; a `readFileSync` version would hum. If you finish early, run `ROWS=1000000` and log `process.memoryUsage().heapUsed` at the end under both approaches — write what you observe in your README.

### ⭐ Stretch (extra credit)

- Run `bun scripts/aggregate.ts` and `npx tsx scripts/aggregate.ts`, log both timings in README, comment on which was faster.
- Add a third script `scripts/copy.ts` using `pipeline()` that copies `data/products.csv` to `data/products-backup.csv` and verifies sizes match.

---

## PHASE B — Express API, three layers (Class 32)

### B1. Scaffold (recreate your Class 32 setup, don't copy-paste without understanding)

```bash
npm init -y
npm install express
npm install -D typescript tsx @types/express @types/node
```

- Add `"type": "module"` to `package.json` (top level, sibling of `"scripts"`).
- Copy the known-good `tsconfig.json` from class notes (target `ES2022`, module `NodeNext`, `strict: true`, `esModuleInterop: true`).
- Scripts: `dev` = `tsx watch src/index.ts`, `build` = `tsc`, `start` = `node dist/index.js`.

### B2. Service layer — `src/services/product.service.ts`

- Interface `Product { id: number; name: string; category: string; price: number; stock: number }`.
- Loads the products **from `data/products.csv` at boot** (read the file, split lines, map to `Product[]`, assign sequential ids from `1`). Hint: `readFileSync` + `split("\n")` is fine here — the file is small comparatively — but you may also stream it if you want the extra credit.
- `let nextId` starts at the loaded count `+ 1` so new products don't collide.
- Functions: `findAllProducts()`, `findProductById(id)`, `createProduct(data)`, `updateProduct(id, data)`, `deleteProduct(id)`. Update/delete return `null` (or a sentinel) when the id doesn't exist, so the controller can decide the 404.

### B3. Controller layer — `src/controllers/product.controller.ts`

Thin. Read `req`, call the service, respond.

- `getAllProducts(req, res)` — support a `category` query filter: `GET /api/products?category=electronics`.
- `getProductById(req, res)` — 404 JSON `{ "error": "Product not found" }` if missing; else 200 with the product.
- `createProduct(req, res)` — validate `name` and `price` are present and `price` is a number; 400 `{ "error": "name and price are required" }` otherwise; else 201 with the created product.
- `updateProduct(req, res)` — 404 if id missing; else 200 with the updated product.
- `deleteProduct(req, res)` — 404 if id missing; else 200 `{ "deleted": true, "id": <id> }`.

### B4. Routes — `src/routes/product.routes.ts`

- `router.get("/", getAllProducts)`
- `router.get("/:id", getProductById)`
- `router.post("/", createProduct)`
- `router.put("/:id", updateProduct)`
- `router.delete("/:id", deleteProduct)`
- `export default router`

### B5. Entry point — `src/index.ts`

```typescript
const app = express();
app.use(express.json());
app.use("/api/products", productRouter);
// ...listen with process.env.PORT ?? 3000
```

### B6. Verify with curl

```bash
npm run dev
curl http://localhost:3000/api/products                 # list (should show ~10,000 loaded)
curl http://localhost:3000/api/products/42              # one product or 404
curl "http://localhost:3000/api/products?category=books" # filtered
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"name":"Keyboard","category":"electronics","price":59,"stock":200}'
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"price":5}'          # → 400
curl -X PUT http://localhost:3000/api/products/99999 -H "Content-Type: application/json" -d '{"name":"X"}'    # → 404
curl -X DELETE http://localhost:3000/api/products/42    # check the id disappears on next GET
```

---

## PHASE C — Middleware & Error Handling (Class 33)

Wire onto Phase B. **Order is the grade** — register exactly like this in `src/index.ts`:

```typescript
app.use(requestLogger);          // 1st — log EVERY request (method, url, status, ms)
app.use(express.json());         // 2nd — parse bodies
app.use("/api/products", router);// routes
app.use(notFoundHandler);        // 404 — nothing matched
app.use(errorHandler);           // LAST — anything that broke
```

### C1. `src/utils/logger.ts` — Winston

- `npm install winston`
- Level `info`, `format.timestamp()`, custom `printf` template: `{timestamp} [{LEVEL}] {message}`
- Two transports: **Console** + **File** `logs/app.log`
- Export `logger`. Add `logs/` to `.gitignore`.

### C2. `src/middleware/requestLogger.ts`

- `(req, res, next)` — capture `start = Date.now()`, attach `res.on("finish", ...)`, log `\`${req.method} ${req.url} ${res.statusCode} ${Date.now() - start}ms\``, call `next()`.

### C3. `src/middleware/requireApiKey.ts`

- `(req, res, next)` — if `req.headers["x-api-key"]` is missing → 401 `{ error: "Missing API key" }` and **`return`**; else `next()`.
- Apply **only to the write routes** (POST/PUT/DELETE), e.g.:
  ```typescript
  router.post("/", requireApiKey, createProduct);
  router.put("/:id", requireApiKey, updateProduct);
  router.delete("/:id", requireApiKey, deleteProduct);
  ```

### C4. `src/middleware/notFoundHandler.ts`

- `app.use((_req, res) => res.status(404).json({ error: "Not Found" }))`

### C5. `src/middleware/errorHandler.ts`

- **Exactly 4 params**: `(err, _req, res, _next)`.
- `console.error(err.stack)` (fail loud) then `res.status(500).json({ error: "Internal Server Error", message: err.message })` (fail clean).
- Registered **last**.

### C6. Prove it works (add these to verify)

- Add `app.get("/boom", (req, res) => { throw new Error("Kaboom!"); })` → must return **clean JSON**, not a stack trace, and `/boom` must still appear in the log.
- Run all of these, then `cat logs/app.log` — every line present, in order:

```bash
curl http://localhost:3000/
curl http://localhost:3000/api/products                  # logged
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"name":"X","price":1}'         # → 401 (no key!)
curl -X POST http://localhost:3000/api/products -H "x-api-key: secret" -H "Content-Type: application/json" -d '{"name":"X","price":1}'   # → 201
curl http://localhost:3000/nope                          # → 404 via notFoundHandler
curl http://localhost:3000/boom                          # → clean 500 JSON, logged
```

### ⭐ Stretch (extra credit)

- **Request-id middleware**: attach `crypto.randomUUID()` to `req`, set header `x-request-id`, include it in the log line. Grep the file for one id.
- **JSON file logs**: JSON format for the file transport, pretty text for console (mixing both formats).
- **Async failure**: a `GET /async-boom` async route that rejects under Express 4; make it land in the error handler (`asyncHandler` or try/catch + `next(err)`). Note which Express version you have (`npm ls express`) in your README.

---

# PART 3: BLURRING POINTS — "Know Your Confusion"
## Self-check reference. Read it. Prove each one by writing the tiny snippet that demonstrates it.

| # | Pitfall | Class | Correct mental model | Quick fix |
|---|---------|-------|----------------------|-----------|
| 1 | `import` fails with "Cannot use import statement outside a module" | 32 | Node defaults to CommonJS; ESM must be opted in | Add `"type": "module"` to `package.json` |
| 2 | Your CLI reads the wrong args | 31 | `argv[0]` = node path, `argv[1]` = script path; your args start at index 2 | Always `process.argv.slice(2)` |
| 3 | `Buffer.from("مرحبا").length` surprises you | 31 | `.length` is **bytes**, not characters; UTF-8 uses up to 4 bytes/char | Always decode with the right encoding before reasoning about text |
| 4 | Script crashes on a big file | 31 | `readFileSync` loads the *whole file* into RAM at once | `createReadStream` + `readline` |
| 5 | `pipe()` vs `pipeline()` | 31 | `pipe` leaks the source stream on error; `pipeline` cleans up | Prefer `pipeline()` |
| 6 | `req.body` is `undefined` | 32 | Nobody parsed the body — `express.json()` middleware was never called | `app.use(express.json())` **before** routes |
| 7 | `req.params.id` behaves like text | 32 | URL path segments are always strings | `Number(req.params.id)` when you need a number |
| 8 | Route never fires / wrong handler fires | 32 | Express runs the **first** matching route, top to bottom | Order specific routes first; wildcards/fallbacks last |
| 9 | Shared middleware "doesn't run" | 33 | Middleware only applies to things registered **after** it | Shared middleware at the top, before all routes |
| 10 | Browser spinner never stops | 33 | Middleware forgot `next()` AND never responded | Always `next()` unless you're intentionally ending the request |
| 11 | Error handler silently doesn't catch | 33 | Express counts params: 1–3 = normal middleware; **exactly 4 = error handler** | Keep `(err, req, res, next)` |
| 12 | Errors leak as HTML/stack traces | 33 | Error handler registered before routes, never reached | Register it **last**, after everything |
| 13 | Auth guard bypassed | 33 | Missing `return` after `res.status(401).json(...)` falls through to `next()` | Always `return` after ending a response in a guard |
| 14 | `next(err)` behavior | 33 | `next()` = continue normal chain; `next(err)` = emergency brake straight to error handler | Use `next(err)` only for errors |
| 15 | Async error "vanishes" | 33 | Express 4 doesn't catch async rejections; Express 5 does | Express 4: `try/catch + next(err)` or `asyncHandler`. Check with `npm ls express` |
| 16 | Logger's line appears late | 33 | `res.on("finish")` fires after response sent — event-driven, not immediate | Attach the listener, then `next()` |
| 17 | "Which layer do I edit?" | 32 | Routes = URLs, Controllers = transport, Services = logic/data | Data/storage changes → `*.service.ts` only |
| 18 | `process.env.PORT` undefined | 32/33 | You must fall back, or the platform's port overrides the hard-coded 3000 | `const PORT = process.env.PORT ?? 3000` |

---

# PART 4: GRADING RUBRIC

| Section | Points |
|---------|--------|
| **Part 1 — Theory** (correct reasoning, specific answers, exact predictions) | 40 |
| **Phase A — CLI** (generates CSV via env var, aggregates via streams, writes summary, no `readFileSync`) | 15 |
| **Phase B — Express API** (three layers, CRUD complete, 404s, 400 validation, query filter) | 25 |
| **Phase C — Middleware** (Winston file+console, auth guard with `return`, 404 + error handler, golden pipeline order, values verified in log) | 20 |
| ⭐ **Stretch** (Bun/1M-row comparison, request-id, async-error, `pipeline` copy) | up to +15 bonus |
| **Total** | **100** |

Deductions: repo not public (−10), no `THEORY.md` (−10), missing `README.md` (−5), `logs/` or `node_modules/` committed with real log output (−5 per).

---

# ─── INSTRUCTOR ANSWER KEY ───────────────────────
## For the instructor only. Do not paste this section into the student-facing file.

### Part 1 — expected answers

1. Line 1: `[ 'node', '/path/to/app.js', '--port', '8080', '--host', 'localhost' ]` (exact paths vary). Line 2: `[ '--port', '8080', '--host', 'localhost' ]`. `argv[0]` = node executable, `argv[1]` = script path, `2+` = real args.
2. Slice(2) gives just your CLI args regardless of how/where node is invoked (`node app.js`, `bun app.js`, absolute vs relative path all shift indices 0–1).
3. `10`, `5`, `5`. "مرحبا" = 5 chars but each is 2 bytes in UTF-8 → 10 bytes. `"مرحبا".length` (a JS string) counts UTF-16 code units = 5.
4. Read path must allocate ~5 GB in RAM, plus the `split("\n")` copy of every line → OOM on 8 GB machine. Stream reads bounded chunks, discards each chunk after processing → memory stays flat/constant.
5. `pipe()` has no error cleanup: if destination fails mid-copy, source isn't destroyed (file descriptors leak). `pipeline()` destroys the streams on error and propagates to an awaitable promise.
6. `4e6f64652e6a73` and `Tm9kZS5qcw==`.
7. "Flat" = constant memory regardless of input size: bucket grows linearly (O(file size)); pipe processes one chunk at a time so memory stays at chunk size (flat).
8. Bun: runs `.ts` directly (no build step), super fast installs (`bun install` binary lockfile), built-in bundler + test runner. Judgement question — any justified answer. Node remains default for enterprise ecosystem maturity.

9. `GET /api/products/featured` → `{ hit: "featured" }` (registered before `/:id`; order wins). `GET /api/products/42` → `{ hit: "by-id", id: "42" }`. `GET /api/products` → `{ hit: "fallback" }` via the mounted router `app.use` (router `GET /` not defined here, so `app.use("/api/products", ...)` fallback catches it — actually with the given `app.use("/api/products", (req,res)=>...)` the router's `GET "/"` would ALSO exist as a route inside a real setup; the teaching point is order + first-match-wins). Note: in the literal snippet there is no `productRouter` — the `app.use("/api/products", handler)` acts as fallback for `/api/products` after `/` matches nothing. Any answer showing awareness that specific routes must precede catches and that first match wins is correct.
10. `req.params.id` is `string`. Convert with `Number(req.params.id)`. Express leaves URL segments as text because path segments are always textual on the wire.
11. Routes = map URL→controller; controller = transport (parse req, call service, respond); service = data + business rules. Storage change → `product.service.ts` only (data lives in service layer).
12. Missing `app.use(express.json())`. Must be before routes. Without it no middleware parses the body; `req.body` stays `undefined`.
13. Mount prefix `/api/products`: `router.get("/")` → `GET /api/products`; `router.get("/:id")` → `GET /api/products/:id`; `router.get("/top")` → `GET /api/products/top`.
14. (a) 201 Created — resource created; (b) 404 Not Found; (c) 400 Bad Request — malformed/incomplete input; (d) 500 Internal Server Error; (e) 200 OK.

15. Exact order:
   ```
   M1 in
   M2 GET /
   handler starts
   handler ends
   M1 out
   ```
   `M1 out` runs AFTER the handler because `next()` resumes after the downstream chain completes; the code after `next()` runs when control unwinds back.
16. Client sees an endless spinner/hang; terminal shows the earlier logs then silence. Express can't guess intent — middleware ending a request (auth reject) must be allowed, so it never auto-calls `next()`.
17. Express inspects the function's declared param count (`fn.length`): 4 → error handler middleware; fewer → normal. Trimming to 3 silently demotes it to normal middleware and it stops catching errors.
18. (a) `next()` continues to the next regular middleware. (b) `next(err)` skips all remaining regular middleware and jumps to the first 4-param error handler. Error path skips e.g. `express.json` down-stream routes.
19. The middleware attaches a "finish" event listener to `res` and calls `next()`. The listener fires later, when the response has actually been sent (event loop). So the log line is written after `res.send()` completes — end-to-end duration.
20. Express 4: the async rejection is unhandled — Express doesn't auto-forward, often logged as unhandled rejection. Express 5: auto-catches and forwards to error handler. Express 4 fixes: wrap in `try/catch` + `next(err)`, or wrap with `asyncHandler`. Check `npm ls express`.
21. 404 = matched nothing (a route/fallback case, not an error), 500 = handler crashed. 404 handler before error handler so "no route" cases are answered as 404 before any real error can be mislabeled 500. Swapped: unknown paths would hit the error handler first and (with no error) fall through to... the 404 last is fine, but the convention and correct ordering is 404 first then 500 handler; if the error handler is placed before the 404 handler it still functions if written correctly, but the golden-pipeline order (routes → 404 → error) is the normalized, canonical one — and a naive swap places error handler before 404 so unknown routes return the error handler's fallback (500) incorrectly.

### Phase A — sample code (concise)

`scripts/generate.ts`:
```typescript
import { writeFileSync } from "node:fs";
import { mkdirSync } from "node:fs";

const ROWS = Number(process.env.ROWS ?? "10000");
const categories = ["electronics", "clothing", "books", "home", "toys", "food"];
mkdirSync("data", { recursive: true });

const lines = ["id,name,category,price,stock"];
for (let i = 1; i <= ROWS; i++) {
  const category = categories[i % categories.length];
  const name = `${category}-${i}`;
  const price = ((i * 137) % 10000) / 100;
  const stock = (i * 7) % 500;
  lines.push(`${i},${name},${category},${price.toFixed(2)},${stock}`);
}
writeFileSync("data/products.csv", lines.join("\n"));
console.log(`Generated ${ROWS} rows -> data/products.csv`);
```

`scripts/aggregate.ts`:
```typescript
import { createReadStream, createWriteStream } from "node:fs";
import { createInterface } from "node:readline";

const start = performance.now();
const byCategory = new Map<string, number>();
let grandTotal = 0, count = 0, first = true;

const rl = createInterface({ input: createReadStream("data/products.csv"), crlfDelay: Infinity });
for await (const line of rl) {
  if (first) { first = false; continue; }
  const [, name, category, price, stock] = line.split(",");
  const total = Number(price) * Number(stock);
  byCategory.set(category, (byCategory.get(category) ?? 0) + total);
  grandTotal += total; count++;
}

const out = createWriteStream(process.env.OUT_FILE ?? "data/category-summary.csv");
out.write("category,total\n");
for (const [cat, total] of byCategory) {
  console.log(`${cat} → $${total.toFixed(2)}`);
  out.write(`${cat},${total.toFixed(2)}\n`);
}
out.end();
console.log(`Rows: ${count}`);
console.log(`Grand total: $${grandTotal.toFixed(2)}`);
console.log(`Took ${(performance.now() - start).toFixed(1)} ms`);
```

### Phase B+C — key snippets

`src/services/product.service.ts` core:
```typescript
export interface Product { id: number; name: string; category: string; price: number; stock: number; }
let products: Product[] = loadProducts();      // read data/products.csv at boot
let nextId = products.length + 1;
export function findProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}
export function updateProduct(id: number, data: Partial<Product>): Product | null {
  const product = products.find((p) => p.id === id);
  if (!product) return null;
  Object.assign(product, data);
  return product;
}
export function deleteProduct(id: number): boolean {
  const before = products.length;
  products = products.filter((p) => p.id !== id);
  return products.length < before;
}
```

`src/index.ts` (golden pipeline — this order is expected):
```typescript
const app = express();
app.use(requestLogger);
app.use(express.json());
app.use("/api/products", productRouter);
app.use(notFoundHandler);
app.use(errorHandler);
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`API on :${PORT}`));
```

Common bugs to look for when grading:
- `"type": "module"` missing → import error in every file.
- `express.json()` after the router → `req.body` undefined.
- Middleware registered after routes → no logs for those routes.
- Error handler 3 params → silently demoted, `/boom` leaks stack trace.
- `requireApiKey` missing `return` after 401 → everything passes.
- `req.params.id` compared as number without `Number(...)` → 404s on valid ids.
- `logs/` or `node_modules/` committed despite `.gitignore` (deduct).
- Theory answers copy-pasted/vague (deduct; expect specific expected-output strings, e.g. question 1 and 6).