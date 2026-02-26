import { createRoute } from '@hono/zod-openapi'
import {
  EntryIdParamSchema,
  EntryQuerySchema,
  CreateEntrySchema,
  UpdateEntrySchema,
  AppendUpdateSchema,
  PromoteSchema,
  EntryResponseSchema,
  UpdateLogResponseSchema,
  ErrorSchema,
} from './schemas'
import { z } from '@hono/zod-openapi'

const tags = ['Entries']

export const listEntries = createRoute({
  method: 'get',
  path: '/entries',
  tags,
  summary: 'List all entries',
  description:
    'Returns all entries in the collection, optionally filtered by maturity level or tag. ' +
    'Each entry includes its full update log. Tag filtering is case-sensitive and matches exact values. ' +
    'Level filtering maps to the Escalay pipeline: 0 = Lab Note, 1 = Experiment, 2 = Project, 3 = Product.',
  request: { query: EntryQuerySchema },
  responses: {
    200: {
      description: 'Array of entries with their update logs. Returns empty array if no entries match.',
      content: { 'application/json': { schema: z.array(EntryResponseSchema) } },
    },
  },
})

export const createEntry = createRoute({
  method: 'post',
  path: '/entries',
  tags,
  summary: 'Create a new entry',
  description:
    'Creates a new entry in the collection. If no ID is provided, one is auto-generated from the type prefix ' +
    'and a base-36 timestamp (e.g. `note-mm3abc`). You can optionally include initial update log entries ' +
    'which are inserted atomically alongside the entry. Returns the full created entry with all updates.',
  security: [{ adminSecret: [] }],
  request: {
    body: { content: { 'application/json': { schema: CreateEntrySchema } }, required: true },
  },
  responses: {
    201: {
      description: 'Entry created successfully. Returns the full entry with all update logs.',
      content: { 'application/json': { schema: EntryResponseSchema } },
    },
    400: {
      description: 'Request body failed validation. Check `error.fieldErrors` for per-field details.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    401: {
      description: 'Missing or invalid `x-admin-secret` header / `admin_token` cookie.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

export const getEntry = createRoute({
  method: 'get',
  path: '/entries/{id}',
  tags,
  summary: 'Get a single entry',
  description:
    'Returns a single entry by its ID, including the full markdown content and all update log entries.',
  request: { params: EntryIdParamSchema },
  responses: {
    200: {
      description: 'Entry found. Includes all update logs.',
      content: { 'application/json': { schema: EntryResponseSchema } },
    },
    404: {
      description: 'No entry exists with the given ID.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

export const updateEntry = createRoute({
  method: 'put',
  path: '/entries/{id}',
  tags,
  summary: 'Update an entry',
  description:
    'Partially updates an entry. Only fields present in the request body are changed — omitted fields ' +
    'are left untouched. The `updatedAt` timestamp is automatically set to now. ' +
    'For level changes, prefer `POST /entries/{id}/promote` which auto-logs the transition.',
  security: [{ adminSecret: [] }],
  request: {
    params: EntryIdParamSchema,
    body: { content: { 'application/json': { schema: UpdateEntrySchema } }, required: true },
  },
  responses: {
    200: {
      description: 'Entry updated. Returns the full entry with all update logs.',
      content: { 'application/json': { schema: EntryResponseSchema } },
    },
    400: {
      description: 'Request body failed validation.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    401: {
      description: 'Missing or invalid admin credentials.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    404: {
      description: 'No entry exists with the given ID.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

export const deleteEntry = createRoute({
  method: 'delete',
  path: '/entries/{id}',
  tags,
  summary: 'Delete an entry',
  description:
    'Permanently deletes an entry and all its associated update logs (via cascading foreign key). This cannot be undone.',
  security: [{ adminSecret: [] }],
  request: { params: EntryIdParamSchema },
  responses: {
    200: {
      description: 'Entry deleted successfully.',
      content: { 'application/json': { schema: z.object({ status: z.literal('deleted') }) } },
    },
    401: {
      description: 'Missing or invalid admin credentials.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    404: {
      description: 'No entry exists with the given ID.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

export const listUpdates = createRoute({
  method: 'get',
  path: '/entries/{id}/updates',
  tags,
  summary: 'List update logs for an entry',
  description:
    'Returns the chronological update log for an entry. Each log has a date, optional version, ' +
    'a type (init/chore/feat/fix/release), and a human-readable description.',
  request: { params: EntryIdParamSchema },
  responses: {
    200: {
      description: 'Array of update log entries in insertion order.',
      content: { 'application/json': { schema: UpdateLogResponseSchema } },
    },
    404: {
      description: 'No entry exists with the given ID.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

export const appendUpdate = createRoute({
  method: 'post',
  path: '/entries/{id}/updates',
  tags,
  summary: 'Append an update log entry',
  description:
    'Appends a new update log to an entry\'s timeline and bumps the entry\'s `updatedAt` timestamp. ' +
    'If `date` is omitted, today\'s date (YYYY-MM-DD) is used. Returns all update logs for the entry ' +
    '(including the newly appended one).',
  security: [{ adminSecret: [] }],
  request: {
    params: EntryIdParamSchema,
    body: { content: { 'application/json': { schema: AppendUpdateSchema } }, required: true },
  },
  responses: {
    201: {
      description: 'Update appended. Returns all update logs for the entry.',
      content: { 'application/json': { schema: UpdateLogResponseSchema } },
    },
    401: {
      description: 'Missing or invalid admin credentials.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    404: {
      description: 'No entry exists with the given ID.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

export const promoteEntry = createRoute({
  method: 'post',
  path: '/entries/{id}/promote',
  tags,
  summary: 'Promote or demote an entry',
  description:
    'Changes an entry\'s maturity level in the Escalay pipeline. The entry\'s `type` is automatically ' +
    'updated to match the level name (0=note, 1=experiment, 2=project, 3=product). ' +
    'A `release` update log is auto-appended describing the transition (e.g. "Promoted from L0 Lab Note to L1 Experiment."). ' +
    'Returns 400 if the entry is already at the target level.',
  security: [{ adminSecret: [] }],
  request: {
    params: EntryIdParamSchema,
    body: { content: { 'application/json': { schema: PromoteSchema } }, required: true },
  },
  responses: {
    200: {
      description: 'Entry promoted/demoted. Returns the full entry with the new level and auto-generated update log.',
      content: { 'application/json': { schema: EntryResponseSchema } },
    },
    400: {
      description: 'Entry is already at the target level, or validation error.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    401: {
      description: 'Missing or invalid admin credentials.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    404: {
      description: 'No entry exists with the given ID.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})
