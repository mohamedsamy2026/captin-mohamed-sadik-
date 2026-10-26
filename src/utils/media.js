// بيجهّز بيانات الصورة (src + srcSet + الأبعاد) من اسم الملف في public/images/photos
// sizes = [العرض الصغير, العرض الكبير] زي ما هما في أسماء الملفات، و aspect = العرض ÷ الارتفاع
export function photo(name, sizes, aspect) {
  const [small, large] = sizes
  const file = (w) => `/images/photos/${name}-${w}.webp`
  return {
    src: file(large),
    srcSet: `${file(small)} ${small}w, ${file(large)} ${large}w`,
    width: large,
    height: Math.round(large / aspect),
  }
}
