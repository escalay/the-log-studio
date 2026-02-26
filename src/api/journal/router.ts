import { OpenAPIHono } from '@hono/zod-openapi'
import { type Env, validationHook } from '../context'
import { adminAuth } from '../auth'
import * as contracts from './contracts'
import * as handlers from './handlers'

export const journalRouter = new OpenAPIHono<Env>({ defaultHook: validationHook })

// Public
journalRouter.openapi(contracts.listJournal, handlers.listJournal)
journalRouter.openapi(contracts.getJournal, handlers.getJournal)

// Protected — inject adminAuth via route middleware
journalRouter.openapi({ ...contracts.createJournal, middleware: [adminAuth] as any }, handlers.createJournal)
journalRouter.openapi({ ...contracts.updateJournal, middleware: [adminAuth] as any }, handlers.updateJournal)
journalRouter.openapi({ ...contracts.deleteJournal, middleware: [adminAuth] as any }, handlers.deleteJournal)
