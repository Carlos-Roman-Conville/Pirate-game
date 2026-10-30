// The browser adapters use bundler JSON imports. Supply their attributes only in
// this Node entry point; no build, dependency or edits to the alignment code needed.
import { registerHooks } from 'node:module'
registerHooks({ load(url, context, nextLoad) {
  return nextLoad(url, url.endsWith('.json')
    ? { ...context, importAttributes: { ...context.importAttributes, type: 'json' } } : context)
} })
const { runSettlement, printSettlement } = await import('./settlement.ts')
printSettlement(runSettlement())
