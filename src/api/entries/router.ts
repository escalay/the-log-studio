import { OpenAPIHono } from '@hono/zod-openapi'
import { type Env, validationHook } from '../context'
import { adminAuth } from '../auth'
import * as contracts from './contracts'
import * as handlers from './handlers'

const publicRouter = new OpenAPIHono<Env>({ defaultHook: validationHook })
publicRouter.openapi(contracts.listEntries, handlers.listEntries)
publicRouter.openapi(contracts.getEntry, handlers.getEntry)
publicRouter.openapi(contracts.listUpdates, handlers.listUpdates)

const protectedRouter = new OpenAPIHono<Env>({ defaultHook: validationHook })
protectedRouter.use('*', adminAuth)
protectedRouter.openapi(contracts.createEntry, handlers.createEntry)
protectedRouter.openapi(contracts.updateEntry, handlers.updateEntry)
protectedRouter.openapi(contracts.deleteEntry, handlers.deleteEntry)
protectedRouter.openapi(contracts.appendUpdate, handlers.appendUpdate)
protectedRouter.openapi(contracts.promoteEntry, handlers.promoteEntry)

export const entriesRouter = new OpenAPIHono<Env>()
entriesRouter.route('/', publicRouter)
entriesRouter.route('/', protectedRouter)
