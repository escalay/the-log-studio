import { createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import {
  JournalSlugParamSchema,
  CreateJournalSchema,
  UpdateJournalSchema,
  JournalSummarySchema,
  JournalDetailSchema,
  JournalCreatedSchema,
  ErrorSchema,
} from './schemas'

const tags = ['Journal']

export const listJournal = createRoute({
  method: 'get',
  path: '/journal',
  tags,
  summary: 'List all journal posts',
  description:
    'Returns summaries of all journal posts (without content blocks). ' +
    'Use this for index pages and navigation. To get the full post with blocks, use GET /journal/{slug}.',
  responses: {
    200: {
      description: 'Array of journal post summaries. Each includes metadata but no blocks.',
      content: { 'application/json': { schema: z.array(JournalSummarySchema) } },
    },
  },
})

export const createJournal = createRoute({
  method: 'post',
  path: '/journal',
  tags,
  summary: 'Create a journal post',
  description:
    'Creates a new journal post with an ordered array of content blocks. Each block has a type ' +
    '(markdown, component, image, pull-quote) and content string. Component blocks also require a `componentName`. ' +
    'Blocks are stored with a `sortOrder` matching their array index. Returns the created post\'s ID and slug.',
  security: [{ adminSecret: [] }],
  request: {
    body: { content: { 'application/json': { schema: CreateJournalSchema } }, required: true },
  },
  responses: {
    201: {
      description: 'Journal post created. Returns ID and slug (not the full post, for efficiency).',
      content: { 'application/json': { schema: JournalCreatedSchema } },
    },
    400: {
      description: 'Request body failed validation.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    401: {
      description: 'Missing or invalid admin credentials.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

export const getJournal = createRoute({
  method: 'get',
  path: '/journal/{slug}',
  tags,
  summary: 'Get a journal post by slug',
  description:
    'Returns a single journal post with all metadata, timestamps, and content blocks. ' +
    'Blocks are returned sorted by their display order.',
  request: { params: JournalSlugParamSchema },
  responses: {
    200: {
      description: 'Full journal post with content blocks.',
      content: { 'application/json': { schema: JournalDetailSchema } },
    },
    404: {
      description: 'No journal post exists with the given slug.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

export const updateJournal = createRoute({
  method: 'put',
  path: '/journal/{slug}',
  tags,
  summary: 'Update a journal post',
  description:
    'Partially updates a journal post\'s metadata. If `blocks` is provided, it performs a full replacement — ' +
    'all existing blocks are deleted and the new array is inserted with fresh sort orders. ' +
    'Omit `blocks` to leave them unchanged. The `updatedAt` timestamp is automatically set.',
  security: [{ adminSecret: [] }],
  request: {
    params: JournalSlugParamSchema,
    body: { content: { 'application/json': { schema: UpdateJournalSchema } }, required: true },
  },
  responses: {
    200: {
      description: 'Post updated successfully.',
      content: { 'application/json': { schema: z.object({ status: z.literal('updated') }) } },
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
      description: 'No journal post exists with the given slug.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

export const deleteJournal = createRoute({
  method: 'delete',
  path: '/journal/{slug}',
  tags,
  summary: 'Delete a journal post',
  description:
    'Permanently deletes a journal post and all its content blocks (via cascading foreign key). This cannot be undone.',
  security: [{ adminSecret: [] }],
  request: { params: JournalSlugParamSchema },
  responses: {
    200: {
      description: 'Post deleted successfully.',
      content: { 'application/json': { schema: z.object({ status: z.literal('deleted') }) } },
    },
    401: {
      description: 'Missing or invalid admin credentials.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    404: {
      description: 'No journal post exists with the given slug.',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})
