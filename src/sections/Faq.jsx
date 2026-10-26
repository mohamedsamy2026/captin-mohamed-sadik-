import { useState } from 'react'
import { getFaqs } from '../services/content'
import { useAsync } from '../hooks/useAsync'
import AsyncContent from '../components/ui/AsyncContent'
import Icon from '../components/ui/icons'
import Section from '../components/ui/Section'

function FaqItem({ item, open, onToggle }) {
  const buttonId = `faq-btn-${item.id}`
  const panelId = `faq-panel-${item.id}`
  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-start text-lg font-semibold"
        >
          <span>{item.q}</span>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
            <Icon name={open ? 'minus' : 'plus'} />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 leading-8 text-muted">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  const query = useAsync(getFaqs)
  const [openId, setOpenId] = useState(null)

  return (
    <Section id="faq" eyebrow="الأسئلة الشائعة" title="أسئلة بتتسأل كتير">
      <AsyncContent
        query={query}
        empty={{ icon: 'check', title: 'لسه مفيش أسئلة هنا', text: 'لو عندك سؤال كلّم الكابتن على واتساب.' }}
      >
        {(faqs) => (
          <div className="mx-auto max-w-3xl border-t border-line">
            {faqs.map((item) => (
              <FaqItem
                key={item.id}
                item={item}
                open={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              />
            ))}
          </div>
        )}
      </AsyncContent>
    </Section>
  )
}
