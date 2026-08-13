import { describe, expect, it } from 'vitest'

import { escapeEmailHtml } from './html'

describe('escapeEmailHtml', () => {
  it('escapes markup and attribute delimiters from customer input', () => {
    expect(escapeEmailHtml(`<a href="x">Tom & O'Brien</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;Tom &amp; O&#39;Brien&lt;/a&gt;',
    )
  })

  it('preserves plain text and line breaks', () => {
    expect(escapeEmailHtml('Gate notes\nAccess via side road')).toBe('Gate notes\nAccess via side road')
  })
})
