# Example Lab 5 Submission — Backend

**Submitter:** Example User  
**Date:** 2026-01-22  
**Lab:** Lab 5 — OpenShift Readiness

---

## What I Did

Made the Order Management service OpenShift-deployable:
1. ✅ Enabled Spring Boot Actuator with health endpoints
2. ✅ Configured liveness and readiness probes
3. ✅ Externalized all configuration to environment variables
4. ✅ Created Kubernetes deployment manifests
5. ✅ Validated manifests with dry-run

---

## Manifest Files Created

| File | Purpose |
|------|---------|
| `k8s/deployment.yaml` | Pod spec with probes, resource limits |
| `k8s/service.yaml` | ClusterIP service definition |
| `k8s/configmap.yaml` | Non-sensitive configuration |
| `k8s/kustomization.yaml` | Kustomize base for environment overlays |

---

## Probe Endpoints Configured

| Probe | Path | Initial Delay | Period |
|-------|------|---------------|--------|
| Liveness | `/actuator/health/liveness` | 30s | 10s |
| Readiness | `/actuator/health/readiness` | 10s | 5s |

---

## Configuration Externalization

| Config | Source | Default |
|--------|--------|---------|
| `SPRING_DATASOURCE_URL` | ConfigMap/Secret | `jdbc:oracle:thin:@localhost:1521/XEPDB1` |
| `SPRING_DATASOURCE_USERNAME` | Secret | `<placeholder>` |
| `SPRING_DATASOURCE_PASSWORD` | Secret | `<placeholder>` |
| `APP_VERSION` | ConfigMap | `1.0.0` |
| `SERVER_PORT` | ConfigMap | `8080` |

---

## How to Deploy to Dev Namespace

```bash
# 1. Create namespace (if not exists)
kubectl create namespace orders-dev

# 2. Apply ConfigMap and Secrets first
kubectl apply -f k8s/configmap.yaml -n orders-dev
kubectl create secret generic orders-db-secret \
  --from-literal=username=<USER> \
  --from-literal=password=<PASS> \
  -n orders-dev

# 3. Apply deployment and service
kubectl apply -k k8s/ -n orders-dev

# 4. Verify pods are running
kubectl get pods -n orders-dev

# 5. Check health endpoint
kubectl port-forward svc/orders-service 8080:8080 -n orders-dev
curl http://localhost:8080/actuator/health
```

---

## Verification Commands Run

```bash
# Validate manifests (dry-run)
kubectl apply -k k8s/ --dry-run=client
# Result: deployment.apps/orders-api configured (dry run)
#         service/orders-service configured (dry run)
#         configmap/orders-config configured (dry run)

# Verify Actuator endpoints locally
./mvnw spring-boot:run
curl http://localhost:8080/actuator/health/liveness
# Result: {"status":"UP"}

curl http://localhost:8080/actuator/health/readiness
# Result: {"status":"UP"}

# Build passes
./mvnw clean package
# Result: BUILD SUCCESS
```

---

## Quick Reflection

- **What was surprising about preparing for OpenShift deployment?**
  The number of environment variables needed for even a simple service.

- **What configuration did you externalize?**
  Database URL, credentials, app version, server port.

- **How would this change for a production deployment?**
  Would add resource limits tuning, HPA, network policies, and proper secrets management.
