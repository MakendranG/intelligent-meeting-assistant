# Deploy on Push Hook

## Description
Automatically deploy the application when changes are pushed to the main branch, ensuring the latest version is always available.

## Trigger
- Git push events to main/master branch
- Only triggers after successful CI/CD pipeline

## Actions
1. Build production bundle
2. Run full test suite
3. Deploy to staging environment
4. Run smoke tests
5. Deploy to production if all tests pass

## Configuration
```json
{
  "name": "deploy-on-push",
  "trigger": {
    "event": "git.push",
    "branch": "main",
    "condition": "ci.success"
  },
  "actions": [
    {
      "type": "command",
      "command": "npm run build"
    },
    {
      "type": "command",
      "command": "npm run test:all"
    },
    {
      "type": "deploy",
      "environment": "staging",
      "healthCheck": true
    },
    {
      "type": "deploy",
      "environment": "production",
      "condition": "staging.success"
    }
  ]
}
```

## Benefits
- Automated deployment pipeline
- Reduces manual deployment errors
- Ensures consistent deployment process
- Faster time to production