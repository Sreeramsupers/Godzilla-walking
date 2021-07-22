window.onload = () => {

    let povMoving, // is true when the point-of-view is currently moving
        walkDir = 1; // 1 for walking right, -1 for walking left

    // set initial states
    gsap.timeline()
        .set('#scrollDist', { width: '750%', height: '100%' }) // width defines how far we'll scroll
        .set('#container', { position: 'fixed', width: 4100, height: 3000, transformOrigin: '0 0', left: window.innerWidth / 2, top: window.innerHeight / 2 + 100 })
        .set('.seq', { xPercent: -75, yPercent: -11 })
        .set('#mouth', { x: 35, y: -240 })

        // position items + txt in the scene
        .set('#bg', { left: 100, top: 1000 }) // pushed off the edges of the container, so nothing gets cropped

        .set('.breakable', { xPercent: -50, yPercent: -100, draggable: false, cursor: 'pointer' })
        .set('#tower', { x: 2400, y: 1750 })
        .set('.towerTxt', { x: 2320, y: 1380 })

        .set('#pagoda', { x: 2000, y: 1702 })
        .set('.pagodaTxt', { x: 1900, y: 1533 })

        .set('#hut', { x: 1496, y: 1860 })
        .set('.hutTxt', { x: 1440, y: 1665 })

        .set('#homes', { x: 1308, y: 1923 })
        .set('.homesTxt', { x: 1210, y: 1806 })

        .set('#gates', { x: 2730, y: 1584 })
        .set('.gatesTxt', { x: 2660, y: 1404 })

        .set('.endTxt', { x: 3300, y: 1500 })

        .to('#container', { opacity: 1, ease: 'power1.inOut', duration: 1 }, 0.3) // fade in the scene


    // re-center the container if window changes size
    window.onresize = () => gsap.set('#container', { left: window.innerWidth / 2, top: window.innerHeight / 2 + 100 });



    // make clouds
    const cloudPos = [[180, 960], [420, 990], [970, 860], [999, 655], [1280, 508], [1555, 555], [1722, 479], [1860, 240], [2000, 400], [2350, 310], [2680, 380], [2800, 290], [3100, 280], [3300, 210], [3600, 310]]

    for (let i = 0; i < cloudPos.length; i++) {
        const cloud = document.createElement("div");

        gsap.set(cloud, {
            attr: { class: 'cloud' },
            width: 440,
            height: 120,
            scale: 0.3 + 0.5 * Math.random(),
            left: cloudPos[i][0],
            top: cloudPos[i][1],
            xPercent: -50,
            yPercent: -100,
            backgroundImage: 'url(https://assets.codepen.io/721952/clouds.png)',
            backgroundPosition: '0 -' + (i % 15 * 120) + 'px'
        });

        document.getElementById('bg').append(cloud);
    }


    // make debris
    for (let i = 0; i < 15; i++) {
        const bit = document.createElement("div");

        gsap.set(bit, {
            attr: { class: 'debris' },
            width: 70,
            height: 70,
            scale: 0,
            backgroundImage: 'url(https://assets.codepen.io/721952/debris.png)',
            backgroundPosition: '-' + (i % 15 * 70) + 'px 0'
        });

        document.getElementById('container').append(bit);
    }


    // make godzilla title characters
    for (let i = 0; i <= 7; i++) {
        const char = document.createElement("div");

        gsap.set(char, {
            attr: { class: 'titleChar' },
            width: 564,
            height: 345,
            backgroundImage: 'url(https://assets.codepen.io/721952/godzillaChars.png)',
            backgroundPosition: '0 -' + (i * 345) + 'px',
            zIndex: () => (i > 5) ? 7 - i : 0 // last 2 characters sit behind the rest
        });

        document.getElementById('godzillaTitle').append(char);
    }



    // timeline w/ scrollTrigger for playing and reversing the intro text
    gsap.timeline({
        scrollTrigger: {
            trigger: '#scrollDist',
            horizontal: true,
            start: 300,
            end: 301, // define 'end' so the reverse toggle action knows where to trigger
            toggleActions: "play none reverse none" // onEnter, onLeave, onEnterBack, onLeaveBack – in that order
        }
    })
        .to('.titleChar', { duration: 0.6, scale: 0, stagger: 0.1, ease: 'expo.in' }, 0)
        .to('.preTitle, .blurb', { duration: 0.4, opacity: 0, ease: 'power1.inOut', stagger: 0.3 }, 0)
        .to('.intro', { duration: 0.1, autoAlpha: 0 }, '-=0.1') // at the very end, set autoAlpha:0 so #intro doesn't block interactivity in #container



    // timeline w/ scrollTrigger for moving kaiju along path + displaying breakable objects' labels
    gsap.timeline({
        defaults: { ease: 'none', duration: 0.1 },
        scrollTrigger: {
            trigger: '#scrollDist',
            horizontal: true,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            onUpdate: (s) => walkDir = s.direction
        }
    })
        .to('.kaiju', { duration: 10, motionPath: { path: '.walkPath', alignOrigin: [0.5, 0.5], autoRotate: true }, immediateRender: true }, 0)
        .from('.kaiju', { duration: 2, scale: 0.7 }, 0)
        .to('.kaiju', { duration: 2, scale: 0.5 }, 8)

        .from('.homesTxt', { opacity: 0, yPercent: 75, yoyo: true, repeat: 1, repeatDelay: 1 }, 2)
        .from('.hutTxt', { opacity: 0, yPercent: 75, yoyo: true, repeat: 1, repeatDelay: 1 }, 3)
        .from('.pagodaTxt', { opacity: 0, yPercent: 75, yoyo: true, repeat: 1, repeatDelay: 1 }, 4.3)
        .from('.towerTxt', { opacity: 0, yPercent: 75, yoyo: true, repeat: 1, repeatDelay: 1.1 }, 5.7)
        .from('.gatesTxt', { opacity: 0, yPercent: 75, yoyo: true, repeat: 1, repeatDelay: 1 }, 6.8)
        .from('.endTxt', { opacity: 0, yPercent: 75, ease: 'power1' }, 9.3)


    // move container to follow kaiju
    let walkSeq = gsap.fromTo('.walk', { y: 0 }, { y: -1890, ease: 'steps(7)', duration: 0.7 })

    gsap.ticker.add(() => {
        // tween container position
        gsap.to('#container', { duration: 0.5, ease: 'sine', x: -gsap.getProperty('.kaiju', 'x'), y: -gsap.getProperty('.kaiju', 'y') })

        // update flag for walking loop
        povMoving = Math.abs(gsap.getProperty('#container', 'x') + gsap.getProperty('.kaiju', 'x')) > 5 // true when x difference is more than 5

        // trigger walking sequence
        if (povMoving && !gsap.isTweening('.walk')) walkSeq.play(0);

        // flip godzilla when scrolling upward
        gsap.set('#mouth', { transformOrigin: '-35px 0', scaleX: walkDir })
        gsap.set('.walk', { transformOrigin: '275px 0', scaleX: walkDir })
        gsap.set('.seq', { xPercent: (walkDir == 1) ? -75 : -25 })
    });



    // Dust and scratches
    for (let i = 0; i < 8; i++) {
        let d = document.createElement('div');
        document.getElementsByClassName('dust')[0].appendChild(d);
        gsap.set(d, {
            attr: { class: 'd' },
            width: 30,
            height: 30,
            backgroundImage: 'url(https://assets.codepen.io/721952/filmDust.png)',
            backgroundPosition: '0 -' + (8 % i) * 30 + 'px'
        });
    }

    function dustLoop() {
        gsap.timeline({ onComplete: dustLoop })
            .set('.d', {
                x: () => window.innerWidth * Math.random(),
                y: () => window.innerHeight * Math.random(),
                rotation: () => 360 * Math.random(),
                scale: () => Math.random(),
                opacity: () => Math.random()
            }, 0.07)
    }
    dustLoop();



    // Easter eggs
    window.onclick = (e) => {

        // open mouth if stopped + mouth isn't already open
        if (!gsap.isTweening('.walk') && !gsap.isTweening('#mouth')) {
            gsap.to('#mouth', { opacity: 1, duration: 0.1, ease: 'expo', yoyo: true, repeat: 1, repeatDelay: 0.3 })
        }

        // breakable stuff
        if (e.target.classList.contains('breakable')) {

            const t = e.target;

            gsap.timeline()
                .set('.debris', { scale: 0.5, x: -40, y: -35, left: gsap.getProperty(e.target, 'x'), top: gsap.getProperty(e.target, 'y') }, 0)

                .to('.debris', { x: () => -150 + Math.random() * 300, duration: 1 }, 0)
                .to('.debris', { y: () => -200 * Math.random() - 150, duration: 0.5, yoyo: true, repeat: 1 }, 0)
                .to('.debris', { scale: 0, duration: 0.5, ease: 'power3.in', delay: () => 0.2 * Math.random() }, 0.3)

                .to([t, '.' + t.id + 'Txt'], { autoAlpha: 0, ease: 'expo.in', duration: 0.1 }, 0) //hide original object
        }
    }

}