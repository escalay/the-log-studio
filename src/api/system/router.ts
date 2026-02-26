import { OpenAPIHono } from '@hono/zod-openapi'
import { type Env, validationHook } from '../context'
import { adminAuth } from '../auth'
import * as contracts from './contracts'
import * as handlers from './handlers'

export const systemRouter = new OpenAPIHono<Env>({ defaultHook: validationHook })

// Public
systemRouter.openapi(contracts.health, handlers.health)

// Protected — inject adminAuth via route middleware
systemRouter.openapi({ ...contracts.seed, middleware: [adminAuth] as any }, handlers.seed)
