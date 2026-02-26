import { OpenAPIHono } from '@hono/zod-openapi'
import { type Env, validationHook } from '../context'
import { adminAuth } from '../auth'
import * as contracts from './contracts'
import * as handlers from './handlers'

export const entriesRouter = new OpenAPIHono<Env>({ defaultHook: validationHook })

// Public
entriesRouter.openapi(contracts.listEntries, handlers.listEntries)
entriesRouter.openapi(contracts.getEntry, handlers.getEntry)
entriesRouter.openapi(contracts.listUpdates, handlers.listUpdates)

// Protected — inject adminAuth via route middleware
entriesRouter.openapi({ ...contracts.createEntry, middleware: [adminAuth] as any }, handlers.createEntry)
entriesRouter.openapi({ ...contracts.updateEntry, middleware: [adminAuth] as any }, handlers.updateEntry)
entriesRouter.openapi({ ...contracts.deleteEntry, middleware: [adminAuth] as any }, handlers.deleteEntry)
entriesRouter.openapi({ ...contracts.appendUpdate, middleware: [adminAuth] as any }, handlers.appendUpdate)
entriesRouter.openapi({ ...contracts.promoteEntry, middleware: [adminAuth] as any }, handlers.promoteEntry)
