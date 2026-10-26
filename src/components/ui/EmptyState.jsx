import Icon from './icons'

// بيظهر لما القسم مفيهوش محتوى (مثلًا مفيش فيديوهات لسه)
export default function EmptyState({ icon = 'images', title = 'لسه مفيش محتوى هنا', text = 'هيتضاف قريبًا.' }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-line px-6 py-14 text-center">
      <span className="mb-4 grid size-14 place-items-center rounded-full bg-brand-soft text-xl text-brand">
        <Icon name={icon} />
      </span>
      <p className="text-lg font-semibold">{title}</p>
      <p className="mt-1 max-w-md text-muted">{text}</p>
    </div>
  )
}
