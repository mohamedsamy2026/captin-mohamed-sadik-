import { getVideos } from '../services/content'
import { useAsync } from '../hooks/useAsync'
import AsyncContent from '../components/ui/AsyncContent'
import CardCarousel from '../components/ui/CardCarousel'
import Section from '../components/ui/Section'

const PER_VIEW = { base: 1, md: 2, lg: 3 }

function VideoCard({ video }) {
  return (
    <figure className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface">
      <div className="aspect-[4/5] bg-black">
        {/* preload="none": الفيديو مبيتحمّلش غير لما الزائر يضغط تشغيل */}
        <video
          controls
          playsInline
          preload="none"
          poster={video.poster}
          aria-label={video.title}
          className="size-full object-contain"
        >
          <source src={video.src} type="video/mp4" />
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      </div>
      <figcaption className="px-5 py-4 font-semibold">{video.title}</figcaption>
    </figure>
  )
}

export default function Videos() {
  const query = useAsync(getVideos)
  return (
    <Section id="videos" eyebrow="الفيديوهات" title="شوف الكابتن وهو بيدرّب" subtitle="لقطات قصيرة من الحصص.">
      <AsyncContent
        query={query}
        empty={{ icon: 'video', title: 'لسه مفيش فيديوهات', text: 'هتتضاف فيديوهات من الحصص قريبًا.' }}
      >
        {(videos) => (
          <CardCarousel
            label="فيديوهات التدريب"
            items={videos}
            perView={PER_VIEW}
            renderItem={(video) => <VideoCard video={video} />}
          />
        )}
      </AsyncContent>
    </Section>
  )
}
