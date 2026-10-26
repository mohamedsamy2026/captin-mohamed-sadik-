import About from '../sections/About'
import Certificates from '../sections/Certificates'
import Contact from '../sections/Contact'
import Faq from '../sections/Faq'
import Gallery from '../sections/Gallery'
import Hero from '../sections/Hero'
import Method from '../sections/Method'
import Services from '../sections/Services'
import Videos from '../sections/Videos'

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Method />
      <Gallery />
      <Videos />
      <Certificates />
      <Faq />
      <Contact />
    </>
  )
}
