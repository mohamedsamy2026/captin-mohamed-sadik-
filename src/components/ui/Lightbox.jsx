import { useCallback, useEffect, useRef } from "react";
import Icon from "./icons";

// معاينة الصور بحجم كبير: Esc للإغلاق، الأسهم للتنقل، Tab بيفضل جوّه النافذة.
// items: [{ src, srcSet?, alt, caption?, title? }]
export default function Lightbox({ items, index, onClose, onChange }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const item = items[index];
  const many = items.length > 1;

  const go = useCallback(
    (step) => onChange((index + step + items.length) % items.length),
    [index, items.length, onChange],
  );

  // قفل التمرير + رجوع التركيز للعنصر اللي فتح المعاينة
  useEffect(() => {
    const previous = document.activeElement;
    const scrollLock = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = scrollLock;
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      // في الـ RTL: السهم اليمين = السابق، والشمال = التالي
      else if (e.key === "ArrowRight" && many) go(-1);
      else if (e.key === "ArrowLeft" && many) go(1);
      else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll("button");
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, many, onClose]);

  const nav =
    "absolute top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-xl text-white transition-colors hover:bg-white/30";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="معاينة الصورة"
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/90 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="إغلاق المعاينة"
        className="absolute end-4 top-4 z-80 grid size-12 place-items-center rounded-full bg-white/15 text-xl text-white transition-colors hover:bg-white/30"
      >
        <Icon name="close" />
      </button>

      {many && (
        <>
          <button
            type="button"
            aria-label="الصورة السابقة"
            onClick={() => go(1)}
            className={`${nav} end-4 sm:end-8`}
          >
            <Icon name="next" />
          </button>
          <button
            type="button"
            aria-label="الصورة التالية"
            onClick={() => go(-1)}
            className={`${nav} start-4 sm:start-8`}
          >
            <Icon name="prev" />
          </button>
        </>
      )}

      <img
        src={item.src}
        srcSet={item.srcSet}
        sizes="100vw"
        alt={item.alt}
        className="max-h-[78svh] max-w-full rounded-lg object-contain"
      />
      <p className="mt-4 text-center text-white">
        {item.caption || item.title}
        {many && (
          <span className="ms-3 text-sm text-white/70">
            {index + 1} / {items.length}
          </span>
        )}
      </p>
    </div>
  );
}
