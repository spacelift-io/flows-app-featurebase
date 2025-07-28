# Featurebase App for Flows

For general app development guidance, see @../CLAUDE.md

## Overview

The Featurebase app is a comprehensive integration that enables Flows to interact with Featurebase's feature request and product feedback platform. It demonstrates advanced patterns for webhook-driven apps, robust API integration, and systematic code organization.

## Architecture

### App Structure

```text
featurebase/
├── main.ts                    # App definition with webhook routing
├── types.ts                   # Comprehensive TypeScript interfaces
├── security.ts                # Webhook signature verification
├── blocks/                    # Block implementations organized by domain
│   ├── webhooks/              # Event subscription blocks
│   ├── posts/                 # Post management actions
│   ├── comments/              # Comment management actions
│   ├── changelogs/            # Changelog management actions
│   ├── roles/                 # User role management
│   ├── admins/                # Admin operations
│   ├── boards/                # Board configuration
│   ├── customFields/          # Custom field management
│   ├── surveys/               # Survey operations
│   └── identifyUsers/         # User identification and management
├── utils/                     # Shared utilities
│   ├── apiHelpers.ts          # API client and helpers
│   ├── webhookHandlers.ts     # Webhook block factory
│   ├── eventSchemas.ts        # Event schema definitions
│   ├── mappers.ts             # Data transformation utilities
│   └── objectUtils.ts         # General object utilities
├── schemas/                   # JSON schema definitions
│   └── common.ts              # Shared output schemas
└── jsonschema/                # Featurebase-specific schemas
    └── jsonschema.ts          # Import from platform schemas
```

### Key Architectural Patterns

#### 1. Webhook-Driven Event System

The app uses a centralized webhook handler in `main.ts` that:

- Validates webhook signatures using cryptographic verification
- Routes events to appropriate subscription blocks based on topic
- Uses service discovery to find active subscription blocks
- Handles graceful degradation when no subscribers exist

```typescript
// Centralized webhook routing pattern
const EVENT_CONFIG: Record<FeaturebaseTopicType, EventConfig> = {
  "post.created": {
    blockTypeId: "postCreatedSubscription",
    validate: createWebhookValidator("post.created", "post"),
  },
  // ... other event types
};
```

#### 2. Factory Pattern for Webhook Blocks

Webhook subscription blocks are created using a factory pattern in `webhookHandlers.ts`:

```typescript
export const commentCreatedSubscription = createWebhookSubscriptionBlock(
  "Comment Created",
  "Receives events when a new comment is created in Featurebase",
  "comment.created",
  "comment.created",
  buildCommentEventPayload,
  commentCreatedEventSchema,
);
```

This pattern ensures:

- Consistent webhook block structure
- Standardized event handling
- Reduced code duplication
- Easy addition of new webhook types

#### 3. Domain-Driven Block Organization

Blocks are organized by business domain (posts, comments, changelogs, etc.) with each domain having:

- `index.ts` - Exports all blocks for the domain
- Individual files for each operation (create, update, delete, list, get)
- Consistent naming patterns and categories

#### 4. Type-Safe API Integration

The app demonstrates comprehensive TypeScript usage:

- Strong typing for all API parameters and responses
- Interface definitions in `types.ts` covering the entire Featurebase API
- Type-safe webhook payload validation
- Generic error handling with proper type assertions

## Key Components

### Security (`security.ts`)

Implements webhook signature verification using:

- HMAC-SHA256 cryptographic validation
- Timestamp verification to prevent replay attacks
- Graceful error handling for invalid signatures

### API Client (`utils/apiHelpers.ts`)

Provides:

- Centralized HTTP client with error handling
- Type-safe parameter validation
- Consistent error reporting
- Support for different content types (JSON, form data)

### Schema Management (`schemas/common.ts`)

Centralizes:

- Output schema definitions to reduce duplication
- Standard pagination schemas
- Success/error response patterns
- Reusable component schemas

## Implementation Patterns

### 1. Consistent Block Structure

All action blocks follow a standard pattern:

```typescript
export const someActionBlock: AppBlock = {
  name: "Display Name",
  description: "What this block does",
  category: "Domain Category",

  inputs: {
    default: {
      name: "Input Name",
      description: "Input description",
      config: {
        // Input configuration schema
      },
      onEvent: async (input: EventInput) => {
        // 1. Extract and validate parameters
        // 2. Create API configuration
        // 3. Make API call with error handling
        // 4. Emit results
      },
    },
  },

  outputs: {
    default: {
      name: "Output Name",
      description: "Output description",
      default: true,
      type: buildSomeOutputSchema() as any,
    },
  },
};
```

### 2. Error Handling Pattern

The app uses consistent error handling:

```typescript
try {
  const result = await apiCall(params);
  await events.emit({
    success: true,
    data: result,
    // ... other fields
  });
} catch (error) {
  await events.emit({
    success: false,
    error: error instanceof Error ? error.message : String(error),
    // ... other fields
  });
}
```

### 3. Configuration Utilities

The `objectUtils.ts` provides utilities for:

- Creating API configurations from app config
- Parameter validation and cleaning
- Type-safe object manipulation

### 4. Schema Builder Functions

Output schemas are built using factory functions:

```typescript
export const buildListPostsOutput = () => ({
  type: "object" as const,
  properties: {
    success: successField,
    posts: {
      type: "array" as const,
      items: postSchema,
    },
    pagination: paginationSchema,
  },
  required: ["success"],
});
```

## Best Practices Demonstrated

### 1. TypeScript Excellence

- Comprehensive interface definitions
- Proper generic usage
- Type assertion patterns (`as any` for schema compatibility)
- Event input typing with `EventInput`

### 2. Code Organization

- Domain separation with clear boundaries
- Consistent file naming conventions
- Barrel exports via `index.ts` files
- Utility separation and reuse

### 3. API Integration

- Centralized configuration management
- Consistent error handling across all endpoints
- Type-safe parameter passing
- Proper HTTP method usage

### 4. Webhook Security

- Cryptographic signature verification
- Timestamp validation for replay protection
- Graceful handling of malformed requests
- Secure error messaging (no sensitive data leaks)

### 5. Event System Design

- Consistent output schemas across all blocks
- Proper event lineage with parent/child relationships
- Echo support for request-response patterns
- Standardized success/error reporting

## Integration Patterns

### Service Discovery Pattern

The webhook handler uses Flows' service discovery to find active subscription blocks:

```typescript
const listOutput = await blocks.list({
  typeIds: [config.blockTypeId],
});

await messaging.sendToBlocks({
  body: { headers: request.headers, payload: payload },
  blockIds: listOutput.blocks.map((block) => block.id),
});
```

### Configuration Injection Pattern

API configuration is consistently created from app config:

```typescript
const apiConfig = createApiConfig(input.app.config);
const result = await someApiCall(apiConfig, params);
```

## Extension Guidelines

### Adding New Webhook Types

1. Add event type to `FeaturebaseTopicType` in `types.ts`
2. Create schema in `eventSchemas.ts`
3. Add to `EVENT_CONFIG` in `main.ts`
4. Create subscription block using the factory pattern

### Adding New Action Blocks

1. Create interface for parameters in `types.ts`
2. Add API helper function in `apiHelpers.ts`
3. Create output schema builder in `schemas/common.ts`
4. Implement block following the standard pattern
5. Export from domain `index.ts`
6. Import and register in `main.ts`

### Adding New Domains

1. Create new directory under `blocks/`
2. Create `index.ts` for exports
3. Follow existing naming patterns
4. Add appropriate categories for block grouping

## Testing Considerations

The app structure facilitates testing by:

- Separating pure functions (utilities, validators)
- Centralizing API configuration
- Using dependency injection patterns
- Providing clear error boundaries

## Performance Optimizations

- Lazy loading of block definitions
- Efficient webhook routing with early validation
- Minimal payload transformation
- Optimized schema definitions for fast validation

## Security Considerations

- Webhook signature validation prevents tampering
- No sensitive data in error messages
- Proper input validation and sanitization
- API key security through configuration patterns

This architecture serves as a model for building robust, scalable Flows apps that integrate with external APIs while maintaining excellent developer experience and operational reliability.
