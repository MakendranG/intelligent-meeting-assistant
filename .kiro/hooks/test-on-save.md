# Test on Save Hook

## Description
Automatically run tests when TypeScript files are saved to ensure code quality and catch issues early in development.

## Trigger
- File save events for `*.ts` and `*.js` files
- Excludes test files to prevent infinite loops

## Actions
1. Run TypeScript compilation check
2. Execute relevant unit tests
3. Run linting on changed files
4. Display results in Kiro's output panel

## Configuration
```json
{
  "name": "test-on-save",
  "trigger": {
    "event": "file.save",
    "pattern": "src/**/*.{ts,js}",
    "exclude": "**/*.test.{ts,js}"
  },
  "actions": [
    {
      "type": "command",
      "command": "npm run check"
    },
    {
      "type": "command", 
      "command": "npm test -- --related"
    },
    {
      "type": "command",
      "command": "npm run lint -- --fix"
    }
  ]
}
```

## Benefits
- Immediate feedback on code changes
- Prevents broken code from being committed
- Maintains consistent code quality
- Reduces debugging time