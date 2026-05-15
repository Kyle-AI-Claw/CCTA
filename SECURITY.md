# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in CCTA, please report it responsibly:

1. **Do NOT** create a public issue/PR
2. Email us at [your-security-email@example.com] with:
   - Vulnerability description
   - Steps to reproduce
   - Suggested fix
3. We aim to respond within 48 hours
4. Responsible disclosure timeline: 7-14 days for public disclosure

## Security Features

CCTA includes the following security measures:

- ✅ JWT-based authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Input validation with Zod
- ✅ CSRF protection
- ✅ Rate limiting on API endpoints
- ✅ Secure headers via helmet
- ✅ Environment variable secrets (never commit .env)
- ✅ SQL injection prevention via Prisma ORM
- ✅ XSS protection via React CSP

## Best Practices

- Never commit `.env` files or sensitive credentials
- Use strong passwords and secure JWT secrets
- Keep dependencies updated (`npm update`)
- Review PRs before merging
- Run security audits regularly
