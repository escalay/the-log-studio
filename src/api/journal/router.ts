import { OpenAPIHono } from '@hono/zod-openapi'
import { type Env, validationHook } from '../context'
import { adminAuth } from '../auth'
import * as contracts from './contracts'
import * as handlers from './handlers'

const publicRouter = new OpenAPIHono<Env>({ defaultHook: validationHook })
publicRouter.openapi(contracts.listJournal, handlers.listJournal)
publicRouter.openapi(contracts.getJournal, handlers.getJournal)

const protectedRouter = new OpenAPIHono<Env>({ defaultHook: validationHook })
protectedRouter.use('*', adminAuth)
protectedRouter.openapi(contracts.createJournal, handlers.createJournal)
protectedRouter.openapi(contracts.updateJournal, handlers.updateJournal)
protectedRouter.openapi(contracts.deleteJournal, handlers.deleteJournal)

export const journalRouter = new OpenAPIHono<Env>()
journalRouter.route('/', publicRouter)
journalRouter.route('/', protectedRouter)
