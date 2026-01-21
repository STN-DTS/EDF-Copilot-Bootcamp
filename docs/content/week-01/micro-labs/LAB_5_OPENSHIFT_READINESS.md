# Lab 5 — OpenShift Readiness

## Goal
Ensure your service is OpenShift-deployable by default. This lab focuses on production readiness—health probes, externalized config, and deployment manifests—which are required before any government release gate.

## Timebox
45–60 minutes

## Prerequisites
- Completed Labs 0–4
- Review [Prompt Pack V1](../../../shared/reference-materials/PROMPT_PACK_V1.md)
- Review [Domain Context](../DOMAIN_CONTEXT.md) for business context

## Domain Context
Use the **Order Management** domain from `docs/shared/reference-materials/DOMAIN_CONTEXT.md`. Your deployment should support the service you built in Labs 2–4.

---

## Task

Make your Spring Boot service deployment-ready for OpenShift.

## Deliverables

### 1. Health Endpoints
- Spring Boot Actuator enabled
- Readiness and liveness probes configured

**Suggested Probe Paths:**
- liveness: `/actuator/health/liveness`
- readiness: `/actuator/health/readiness`

### 2. Configuration Externalization
- No hardcoded values for environment-specific config
- Use environment variables or Spring profiles
- Database connection via env vars (e.g., `SPRING_DATASOURCE_URL`)
- API keys/secrets via env vars (placeholders only!)

### 3. Deployment Manifests
Create base deployment artifacts in `/k8s/` folder:
- `deployment.yaml` — Pod spec with probes, resource limits
- `service.yaml` — ClusterIP service definition
- `configmap.yaml` — Non-sensitive configuration
- (Optional) `kustomization.yaml` or Helm chart structure

### 4. Resource Limits
Define reasonable defaults:
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "100m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

---

## Steps

1. Enable Spring Boot Actuator with appropriate endpoint exposure
2. Configure probe endpoints for Kubernetes
3. Externalize all environment-specific configuration
4. Create Kubernetes manifest files in `/k8s/`
5. Validate manifests (use `kubectl apply --dry-run=client`)
6. Document how to deploy to a dev namespace

---

## Success Criteria
- [ ] Actuator health endpoints work (`/actuator/health`)
- [ ] Liveness and readiness probes defined in deployment.yaml
- [ ] Configuration externalized (no hardcoded values)
- [ ] All manifests validate (`kubectl apply --dry-run=client`)
- [ ] Service can start with placeholder env vars
- [ ] README includes deployment instructions

---

## Frontend Note

For frontend developers, this lab focuses on:
- Environment-based API URL configuration
- Production build verification (`npm run build`)
- Static file serving considerations

You may skip the Kubernetes manifest creation if only working on frontend.

---

## Submission (MANDATORY)

### Step 1: Create Your Working Folder
```
/working/{frontend|backend}/{your_name}_{YYYYMMDD_HHMM}/
```
Example: `/working/backend/jsmith_20260122_1400/`

### Step 2: Include Required Files
- Actuator configuration changes
- Kubernetes manifests (`k8s/` folder)
- A `README.md` containing:
  - Your name and date
  - Lab number: **Lab 5**
  - Manifest files created
  - Probe endpoints configured
  - Config externalization approach
  - How to deploy to a dev namespace
  - Verification commands run and results

### Step 3: Open a Pull Request
- Use the PR template at `.github/pull_request_template.md`
- Ensure all checklist items are completed

### Example Folder Structure
```
/working/backend/jsmith_20260122_1400/
├── README.md
├── src/
│   └── main/
│       └── resources/
│           └── application.yaml (updated)
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
```

> 📁 **Reference:** See `/working/backend/example_lab5/` for example submission.

---

## Quick Reflection (2 min)
Before submitting, answer in your README:
- What was surprising about preparing for OpenShift deployment?
- What configuration did you externalize?
- How would this change for a production deployment?
