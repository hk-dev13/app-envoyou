# Frequently Asked Questions (FAQ)

This page contains answers to the most commonly asked questions about the EnvoyOU API.

## Getting Started

### What is EnvoyOU?

EnvoyOU is a comprehensive API platform that provides user authentication, profile management, and data services for modern web applications. It handles the complex aspects of user management so you can focus on building your application's core features.

### How do I get started?

1. **Sign up** for an account at [envoyou.com](https://envoyou.com)
2. **Verify** your email address
3. **Generate** an API key from your dashboard
4. **Choose** your preferred SDK or use direct HTTP requests
5. **Start** integrating with your application

### What programming languages are supported?

We provide official SDKs for:
- JavaScript/TypeScript
- Python
- Go

Community SDKs are available for:
- PHP
- Ruby
- .NET
- Java

You can also use any HTTP client library with our REST API.

## Authentication

### What's the difference between API keys and JWT tokens?

- **API Keys**: Used for server-to-server communication, machine authentication, and accessing public endpoints
- **JWT Tokens**: Used for user-specific operations, obtained after user authentication, include user identity and permissions

### How long do JWT tokens last?

- **Access Tokens**: 1 hour by default
- **Refresh Tokens**: 30 days by default
- Token expiration times can be configured in your account settings

### Can I use both API keys and JWT tokens?

Yes! Use API keys for general API access and JWT tokens for user-specific operations. Many endpoints accept both types of authentication.

## API Usage

### What are the rate limits?

Rate limits vary by your subscription tier:

| Tier | Requests per Hour | Requests per Minute |
|------|------------------|-------------------|
| Free | 100 | 10 |
| Basic | 1,000 | 100 |
| Pro | 10,000 | 1,000 |
| Enterprise | Custom | Custom |

### How do I handle rate limiting?

1. **Check response headers** for rate limit information
2. **Implement exponential backoff** for retries
3. **Use request queuing** to smooth out traffic
4. **Monitor your usage** through the dashboard
5. **Upgrade your plan** if you need higher limits

### What happens when I exceed rate limits?

You'll receive a `429 Too Many Requests` response with a `Retry-After` header indicating when you can retry. The response includes details about your current limits and when they reset.

## Billing and Pricing

### How does billing work?

- **Free Tier**: 100 requests/hour, no credit card required
- **Paid Tiers**: Monthly subscription based on usage tier
- **Enterprise**: Custom pricing based on your specific needs
- Billing is calculated monthly based on your peak usage

### Can I change my plan anytime?

Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing adjusts accordingly.

### What payment methods are accepted?

We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can arrange for invoicing.

## Security

### Is the API secure?

Yes, we implement multiple layers of security:

- **HTTPS Only**: All API communication is encrypted
- **API Key Authentication**: Secure key-based authentication
- **JWT Tokens**: Signed tokens with expiration
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive validation of all inputs
- **Audit Logging**: Complete logging of all API access

### How do I keep my API keys secure?

- **Never commit API keys** to version control
- **Use environment variables** to store keys
- **Rotate keys regularly** (at least quarterly)
- **Use different keys** for different environments
- **Monitor key usage** through the dashboard

### What should I do if I suspect a security breach?

1. **Immediately rotate** your API keys
2. **Contact support** with details
3. **Review access logs** for suspicious activity
4. **Update all client applications** with new keys

## Integration

### Can I use EnvoyOU with my existing user database?

Yes! You can migrate existing users or keep your current system and use EnvoyOU alongside it. We provide migration tools and detailed guides.

### How do I migrate existing users?

1. **Export user data** from your current system
2. **Use our bulk import API** to create users
3. **Update your application** to use EnvoyOU authentication
4. **Test thoroughly** before going live
5. **Gradually migrate** users to avoid disruption

### What webhooks are available?

We support webhooks for:
- User events (created, updated, deleted)
- Authentication events (login, logout, failed attempts)
- API usage events (rate limits, quota exceeded)
- System events (maintenance, incidents)

## Troubleshooting

### Why am I getting 401 Unauthorized errors?

Common causes:
- **Invalid API key**: Check your key is correct and active
- **Expired JWT token**: Refresh your token
- **Wrong authentication method**: Some endpoints require specific auth types
- **Missing permissions**: Your account may not have access to that endpoint

### Why am I getting 429 Rate Limit errors?

- **High request volume**: You're exceeding your tier's limits
- **Inefficient code**: Making too many requests in a short time
- **Not handling retries**: Previous failed requests may be retrying too quickly

### Why are my requests timing out?

Possible causes:
- **Network issues**: Check your internet connection
- **Large payloads**: Break large requests into smaller chunks
- **Server overload**: Try again later or contact support
- **Incorrect timeout settings**: Adjust your client timeout settings

## Account Management

### How do I reset my password?

1. Go to the login page
2. Click "Forgot Password"
3. Enter your email address
4. Check your email for reset instructions
5. Follow the link to set a new password

### How do I update my account information?

You can update your account details through the dashboard:
- Email address
- Password
- Billing information
- API settings
- Webhook configurations

### How do I delete my account?

Account deletion is permanent and removes all associated data. Contact support to initiate account deletion. This process requires verification and a waiting period.

## Technical Support

### What support options are available?

- **Documentation**: Comprehensive guides and API reference
- **Community Forum**: Get help from other developers
- **Email Support**: Response within 24 hours
- **Priority Support**: Available for paid tiers
- **Phone Support**: Available for enterprise customers

### How do I report a bug?

1. **Check existing issues** in our GitHub repository
2. **Create a new issue** with detailed information:
   - Steps to reproduce
   - Expected vs actual behavior
   - API endpoint and request details
   - Error messages and codes
   - Your environment (SDK version, language, etc.)

### How do I request a new feature?

1. **Check our roadmap** to see if it's already planned
2. **Create a feature request** on GitHub
3. **Provide detailed requirements** and use cases
4. **Engage with the community** to gauge interest

## Compliance and Legal

### Is EnvoyOU GDPR compliant?

Yes, we are fully GDPR compliant. We provide:
- Data processing agreements
- Right to erasure (data deletion)
- Data portability
- Privacy by design principles

### Do you comply with SOC 2?

Yes, we maintain SOC 2 Type II compliance, which covers security, availability, and confidentiality of customer data.

### Where is my data stored?

Data is stored in secure, SOC 2 compliant data centers in the US. Enterprise customers can request specific data residency options.

### What is your data retention policy?

- **User data**: Retained until account deletion or as required by law
- **API logs**: Retained for 90 days for security and debugging
- **Analytics data**: Aggregated and anonymized after 24 months

## Advanced Topics

### Can I use EnvoyOU for single sign-on (SSO)?

Yes! We support SAML and OAuth 2.0 for enterprise SSO integrations. Contact our enterprise team for setup assistance.

### Do you support multi-tenant applications?

Yes, our API is designed to support multi-tenant applications with proper tenant isolation and access controls.

### Can I customize the authentication flow?

Yes, we offer extensive customization options:
- Custom login pages
- Additional user fields
- Custom validation rules
- Integration with third-party identity providers

### What about mobile applications?

Our API works seamlessly with mobile apps. We provide:
- Mobile-optimized SDKs
- Offline token storage
- Biometric authentication support
- Push notification integration

If you don't find your question answered here, please check our [documentation](https://docs.envoyou.com) or contact our support team.