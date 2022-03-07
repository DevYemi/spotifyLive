import gsap from 'gsap'
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function headerNavAnimations(color) {
    // Animate headerNav bg on scroll
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".PLAYLIST-SECTION-1",
            scroller: ".PLAYLIST",
            start: "200px top",
            end: "20000000000000000px 30px",
            toggleActions: "play none none reverse",
        },
        defaults: {
            duration: .5,
            ease: 'power2.in'
        }
    })

    tl.to('.HEADER-NAV', { backgroundColor: "red" })
        .to('.HEADER-NAV-ICON', { opacity: 1 }, '<')
        .to(".HEADER-NAV-H1", { opacity: 1 }, '<')
}