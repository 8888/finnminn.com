# Class Structure: Refactored App.tsx

## Component Hierarchy

```
App
└── AuthProvider
    └── Layout (New wrapper for atmosphere)
        ├── BackgroundEffects (.bg-magic-void, .firefly x12)
        └── Content
            ├── Typography.H1 ("FINNMINN.COM")
            ├── Terminal (title="SYSTEM_LOG")
            │   └── Typography.Body ("Status: ONLINE")
            └── Card (variant="magic" if auth, "default" if not)
                ├── Typography.Body (Contextual message)
                └── Button (Login/Logout)
```

## State Management
- `useAuth`: Consumed from `@finnminn/auth` to determine component variants and messages.
