import gsap from 'gsap'
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function headerNavAnimations(color) {
    // Animate headerNav bg on scroll
    gsap.to('.HEADER-NAV', {
        scrollTrigger: {
            trigger: ".PLAYLIST-SECTION-1",
            scroller: ".PLAYLIST",
            start: "200px top",
            end: "2000px 30px",
            toggleActions: "play none none reverse",
        },
        backgroundColor: "red",
        duration: .5,
        ease: 'power2.in'
    })
}