import { OpenAPIHono } from '@hono/zod-openapi'
import { type Env, validationHook } from '../context'
import { adminAuth } from '../auth'
import * as contracts from './contracts'
import * as handlers from './handlers'

const publicRouter = new OpenAPIHono<Env>({ defaultHook: validationHook })
publicRouter.openapi(contracts.health, handlers.health)

const protectedRouter = new OpenAPIHono<Env>({ defaultHook: validationHook })
protectedRouter.use('*', adminAuth)
protectedRouter.openapi(contracts.seed, handlers.seed)

export const systemRouter = new OpenAPIHono<Env>()
systemRouter.route('/', publicRouter)
systemRouter.route('/', protectedRouter)
