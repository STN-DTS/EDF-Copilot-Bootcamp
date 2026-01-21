# Example Lab 5 Submission — Frontend

**Submitter:** Example User  
**Date:** 2026-01-22  
**Lab:** Lab 5 — OpenShift Readiness

---

## What I Did

Made the Order Management frontend deployment-ready:
1. ✅ Configured environment-based API URL
2. ✅ Verified production build works
3. ✅ Created nginx configuration for static serving
4. ✅ Documented deployment approach

---

## Configuration Externalization

| Config | Source | Default |
|--------|--------|---------|
| `VITE_API_BASE_URL` | Build-time env | `http://localhost:8080` |

---

## Production Build Verification

```bash
# Build for production
npm run build
# Result: dist/ folder created, 245kb gzipped

# Preview production build locally
npm run preview
# Result: Serving at http://localhost:4173

# Test API URL injection
VITE_API_BASE_URL=https://api.example.com npm run build
grep -r "api.example.com" dist/
# Result: Found in bundled JS
```

---

## Deployment Approach

Frontend is served as static files via nginx container. The API URL is injected at build time via `VITE_API_BASE_URL`.

For runtime configuration (if needed), use the `env.js` pattern:
1. Create `/env.js` served by nginx
2. Load in `index.html` before app bundle
3. Access via `window.__ENV__`

---

## Quick Reflection

- **What was surprising about preparing for deployment?**
  The difference between build-time and runtime environment variables.

- **What configuration did you externalize?**
  API base URL (build-time), could add feature flags (runtime).

- **How would this change for production?**
  Would add CDN caching headers, CSP headers, and runtime config injection.
