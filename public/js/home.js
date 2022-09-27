const splide1 = new Splide('#splide1', {
    perPage: 3,
    type: 'loop',
    autoplay: 'true',
    breakpoints: {
        640: {
            perPage: 2,
        },
        480: {
            perPage: 1,

        }
    },
})
splide1.mount();

const splide2 = new Splide('#splide2', {
    perPage: 3,
    type: 'loop',
    breakpoints: {
        640: {
            perPage: 2,
        },
        480: {
            perPage: 1,

        }
    },
})
splide2.mount();

const splide3 = new Splide('#splide3', {
    perPage: 3,
    type: 'loop',
    autoplay: 'true',
    breakpoints: {
        640: {
            perPage: 2,
        },
        480: {
            perPage: 1,

        }
    },
})
splide3.mount();