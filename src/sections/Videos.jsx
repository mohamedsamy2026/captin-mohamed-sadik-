import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { useState } from "react";
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { getVideos } from "../services/content";
import { useAsync } from "../hooks/useAsync";
import AsyncContent from "../components/ui/AsyncContent";
import CardCarousel from "../components/ui/CardCarousel";
import Section from "../components/ui/Section";

const PER_VIEW = { base: 1, md: 2, lg: 3 };

// الكارت الشغّال حاليًا؛ لما كارت جديد يشتغل بنرجّع القديم لصورة
let resetPrev = null;

function VideoCard({ video }) {
  const [active, setActive] = useState(false);

  const start = () => {
    if (resetPrev && resetPrev !== setActive) resetPrev(false);
    resetPrev = setActive;
    setActive(true);
  };

  return (
    <figure className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-surface">
      {/* swiper-no-swiping بس وقت التشغيل، عشان السحب يشتغل على باقي الكروت */}
      <div
        className={`relative h-[320px] w-full bg-black sm:h-[360px] ${
          active ? "swiper-no-swiping" : ""
        }`}
        dir="ltr"
      >
        {active ? (
          <MediaPlayer
            title={video.title}
            src={{ src: video.src, type: "video/mp4" }}
            playsInline
            autoPlay
            className="!aspect-auto h-full w-full"
          >
            <MediaProvider>
              <Poster
                className="vds-poster"
                src={video.poster}
                alt={video.title}
              />
            </MediaProvider>
            <DefaultVideoLayout icons={defaultLayoutIcons} />
          </MediaPlayer>
        ) : (
          <button
            type="button"
            onClick={start}
            aria-label={`تشغيل: ${video.title}`}
            className="group absolute inset-0 size-full"
          >
            <img
              src={video.poster}
              alt={video.title}
              loading="lazy"
              draggable={false}
              className="size-full object-cover"
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-16 place-items-center rounded-full bg-black/60 text-white transition-transform group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="size-7 fill-current">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="px-5 py-4 font-sans2 text-lg">
        {video.title}
      </figcaption>
    </figure>
  );
}

export default function Videos() {
  const query = useAsync(getVideos);
  return (
    <Section
      id="videos"
      eyebrow="الفيديوهات"
      title="شوف الكابتن وهو بيدرّب"
      subtitle="لقطات قصيرة من الحصص."
    >
      <AsyncContent
        query={query}
        empty={{
          icon: "video",
          title: "لسه مفيش فيديوهات",
          text: "هتتضاف فيديوهات من الحصص قريبًا.",
        }}
      >
        {(videos) => (
          <CardCarousel
            label="فيديوهات التدريب"
            items={videos}
            perView={PER_VIEW}
            autoplay={false}
            renderItem={(video) => <VideoCard video={video} />}
          />
        )}
      </AsyncContent>
    </Section>
  );
}
