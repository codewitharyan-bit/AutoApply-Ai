import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import useDebounce from './useDebounce'

export default function useLocalSearch({ items, buildSearchText }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef()

  const searchIndex = useMemo(() =>
    items.map(item => ({
      item,
      index: buildSearchText(item).toLowerCase()
    })),
  [items, buildSearchText])

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return searchIndex.filter(s => s.index.includes(q)).map(s => s.item)
  }, [searchIndex, query, items])

  useEffect(() => {
    const p = new URLSearchParams(searchParams)
    const trimmed = debouncedQuery.trim()
    trimmed ? p.set('search', trimmed) : p.delete('search')
    if (p.toString() !== searchParams.toString()) {
      setSearchParams(p, { replace: true })
    }
  }, [debouncedQuery, searchParams])

  useEffect(() => {
    const current = searchParams.get('search') || ''
    if (current !== query) setQuery(current)
  }, [searchParams])

  const clearSearch = useCallback(() => { setQuery('') }, [])

  return { query, setQuery, filteredItems, clearSearch, searchRef }
}
