# ADR-001: Authentication Strategy

**Status:** Accepted  
**Date:** [Date]  
**Deciders:** [Tech Lead, Architect, Security Lead]

---

## Context

The Order Management System needs to authenticate users before allowing access to order operations. We need to decide on an authentication approach that integrates with the enterprise environment while supporting our technical requirements.

### Forces

- **Enterprise Integration:** Organization uses Microsoft Entra ID (formerly Azure AD) for SSO
- **Security Requirements:** Must support MFA, session management, token refresh
- **Developer Experience:** Should be simple to implement and test
- **Frontend Architecture:** React Router v7 with server-side loaders/actions
- **Backend Architecture:** Spring Boot with stateless API design
- **OpenShift Deployment:** Containers should remain stateless for scaling

---

## Decision

**We will use OAuth 2.0 / OpenID Connect with Microsoft Entra ID as the identity provider.**

### Key Aspects

1. **Protocol:** OAuth 2.0 with PKCE flow for browser-based authentication
2. **Token Type:** JWT (JSON Web Tokens) for access tokens
3. **Token Location:** `Authorization: Bearer <token>` header for API calls
4. **Session Management:** Stateless - tokens validated on each request
5. **Token Refresh:** Handled by frontend using refresh token flow
6. **Backend Validation:** Spring Security validates JWT signature, issuer, audience

---

## Options Considered

### Option 1: OAuth 2.0 / OIDC with Entra ID (Selected)

**Pros:**
- Integrates with existing enterprise SSO
- Industry standard protocol
- Supports MFA out of the box
- Stateless design fits container scaling
- Well-supported by Spring Security

**Cons:**
- Token management complexity in frontend
- Token size may impact request overhead
- Requires understanding of OAuth flows

### Option 2: SAML 2.0

**Pros:**
- Also integrates with Entra ID
- Mature, widely adopted in enterprise

**Cons:**
- XML-based, more complex to implement
- Less suited for SPAs and REST APIs
- Typically session-based, less stateless-friendly

### Option 3: Custom Session-Based Authentication

**Pros:**
- Full control over authentication flow
- Simple to understand

**Cons:**
- Requires session storage (Redis)
- Conflicts with stateless container design
- Re-invents solved problems
- Security risk of custom implementation

---

## Consequences

### Positive

- ✅ Single sign-on with enterprise systems
- ✅ MFA handled by identity provider
- ✅ Stateless design enables horizontal scaling
- ✅ Industry-standard security
- ✅ Spring Security provides robust implementation

### Negative

- ⚠️ Token refresh logic needed in frontend
- ⚠️ Testing requires mock OIDC provider or test tokens
- ⚠️ Token expiration handling adds complexity

### Risks

| Risk | Mitigation |
|------|------------|
| Token theft | Short expiration (15 min), secure storage, HTTPS only |
| Token size | Keep claims minimal, avoid large custom claims |
| IdP outage | Graceful error handling, offline token validation |

---

## Implementation Notes

### Backend Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/api/v1/**").authenticated()
            )
            .build();
    }
}
```

### Frontend Configuration

```typescript
// lib/auth.ts
export async function getAccessToken(): Promise<string> {
  // MSAL.js handles token acquisition and refresh
  const response = await msalInstance.acquireTokenSilent(tokenRequest);
  return response.accessToken;
}
```

---

## Related Decisions

- [ADR-002: Error Handling](./002-error-handling.md) - How auth errors are returned
- [ADR-003: API Versioning](./003-api-versioning.md) - Auth applies to versioned endpoints

---

## References

- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html)
- [Spring Security OAuth 2.0 Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
