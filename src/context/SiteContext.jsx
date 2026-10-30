import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { site as staticSite } from '../data/site'
import { getContactInfo } from '../services/content'
import { buildWhatsappLink } from '../utils/whatsapp'
import { toTel } from '../utils/phone'

const SiteContext = createContext(null)

// بيحمّل بيانات التواصل مرة واحدة ويوزّعها: أي تغيير من الداشبورد بيظهر في كل مكان.
export function SiteProvider({ children }) {
  const [info, setInfo] = useState(null)

  useEffect(() => {
    let alive = true
    getContactInfo()
      .then((data) => alive && setInfo(data))
      .catch((err) => console.error('تعذّر تحميل بيانات التواصل:', err))
    return () => {
      alive = false
    }
  }, [])

  const value = useMemo(() => {
    const whatsapp = info?.whatsapp ?? staticSite.whatsapp
    const phoneDisplay = info?.phone ?? staticSite.phoneDisplay
    return {
      ...staticSite,
      whatsapp,
      phoneDisplay,
      phone: toTel(phoneDisplay),
      location: info?.location ?? staticSite.location,
      socials: info?.socials ?? staticSite.socials.map((s) => ({ id: s.id, icon: s.id, label: s.label, href: s.href })),
      whatsappLink: (message = '') => buildWhatsappLink(whatsapp, message),
    }
  }, [info])

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite لازم يتستخدم جوّه SiteProvider')
  return ctx
}
