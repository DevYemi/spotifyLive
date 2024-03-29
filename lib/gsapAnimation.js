import gsap from 'gsap'
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function headerNavAnimations(color, gsapTrigger, gsapScroller) {
    // Animate headerNav bg on scroll
    const headerNavIcons = document.querySelectorAll('.HEADER-NAV-ICON');

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: gsapTrigger,
            scroller: gsapScroller,
            start: "200px top",
            end: "20000000000000000px 30px",
            toggleActions: "play none none reverse",
        },
        defaults: {
            duration: .5,
            ease: 'power2.in'
        }
    })

    tl.to('.HEADER-NAV', { backgroundColor: "#fd0000e0" })
        .to(headerNavIcons, { opacity: 1 }, '<')
        .to(".HEADER-NAV-H1", { opacity: 1 }, '<')

}

export function sidebarAnimation(type, setIsSidebarOpen) {
    const bodyTag = document.getElementsByTagName('body')[0]
    if (bodyTag.offsetWidth >= 768) return
    if (type === 'OPEN') {
        gsap.to('.SIDEBAR', {
            left: 0,
            width: '100%',
            backgroundColor: 'black',
            paddingTop: '3rem',
            duration: .3,
            ease: 'linear',
            onComplete: () => setIsSidebarOpen(true)
        })
    } else {
        gsap.to('.SIDEBAR', {
            left: "-745px",
            duration: .3,
            ease: 'linear',
            onComplete: () => setIsSidebarOpen(false)
        })
    }

}

export function popUpMssgAnimation(setPopMssgType) {
    const popUpDiv = document.querySelector('.POPUP-MESSG');
    const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'power2.inOut' }
    })
    const close = () => {
        tl.to(popUpDiv, { opacity: 0 })
            .to(popUpDiv, { display: 'none', duration: 0, onComplete: () => setPopMssgType(null) })

    }
    const open = () => {
        tl.to(popUpDiv, { display: 'block', duration: 0 })
            .to(popUpDiv, { opacity: 1, onComplete: () => setTimeout(close, 2000) })
    }

    open();

}