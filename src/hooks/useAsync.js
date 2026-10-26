import { useCallback, useEffect, useState } from 'react'

// بيشغّل دالة بترجّع Promise (من فولدر services) ويدّيك الحالة: loading / success / error
// ملحوظة: الدالة لازم تكون ثابتة (معرّفة برّه المكوّن).
export function useAsync(fn) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    setState((s) => (s.status === 'loading' ? s : { status: 'loading', data: null, error: null }))
    fn()
      .then((data) => alive && setState({ status: 'success', data, error: null }))
      .catch((error) => alive && setState({ status: 'error', data: null, error }))
    return () => {
      alive = false
    }
  }, [fn, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])
  return { ...state, retry }
}
