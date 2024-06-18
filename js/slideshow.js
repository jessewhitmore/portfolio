class slideInstance {
	constructor() {
        this.index = 0
        this.slides = []
        this.lock = false
    }

    ve(to, name, style, type) {
        type = type || 'div'
        const element = document.createElement(type)
        if(Array.isArray(name)) {
            element.classList.add(...name)
        } else {
            element.classList.add(name)
        }
        if(style !== undefined) {
            for (const [key, value] of Object.entries(style)) {
                element.style[key] = value
            }
        }
        to.appendChild(element)
        return element;
    }

    setup(to, name, ratio, frames, animation) {
        // setup slideshow
        to = to || document.body
        ratio = ratio || 16/9
        const slideshow = this.ve(to, 'slideshow', {position: 'absolute', aspectRatio:ratio, width:'100%', height:'100%' })
        if(name) slideshow.id = name

        this.max = frames.length


        const slidesCont = this.ve(slideshow, 'slides', {
            position:'absolute',
            width:'100%',
            height:'100%',
            overflow:'hidden'
        })
        frames.forEach((v, i) => { 
            const slide = this.ve(slidesCont, 'slide', {
                position: 'absolute',
                width:'100%',
                height:'100%'
            })
            if(animation[i] !== undefined) {
                slide.setAttribute('data-ani',animation[i])
            } else {
                slide.setAttribute('data-ani','left')
            }
            slide.innerHTML = v
            this.slides.push(slide)
            if(i == 0) {
                slide.classList.add('on')
            } else {
                slide.style.visibility = 'hidden'
            }
            
        })

        const controls = this.ve(slideshow, 'controls', {
            position:'absolute',
            width:'100%',
            height:'100%',
            zIndex:2
        })
        const prev = this.ve(controls, 'prev', {
            position:'absolute',
            width:'30px',
            height:'100%',

            left:'-50px'
        })
        prev.innerHTML = '<img src="/assets/icons/menuArrow.svg"/>'
        const next = this.ve(controls, 'next', {
            position:'absolute',
            width:'30px',
            height:'100%',

            right:'-50px'
        })
        next.innerHTML = '<img src="/assets/icons/menuArrow.svg"/>'

        const close = this.ve(controls, 'close')
        const download = this.ve(controls, 'download')
        console.log(this.index)
        prev.addEventListener('click', ()=>{if(this.index > 0) this.move(-1)})
        next.addEventListener('click', ()=>{if(this.index < this.max-1) this.move(1)})

        this.keyboard = window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    if(this.index > 0) this.move(-1)
                break;
                case "ArrowRight":
                    if(this.index < this.max-1) this.move(1)
                break;
            }
        })

    }

    move(move) {
        if(this.lock) return;
        this.lock = true

        const prev = this.slides[this.index]
        const index = this.index += move
        const curr = this.slides[index]

        // get meta
        console.log(prev.dataset.ani)

        // move it
        if(move > 0) {
            this.transitionAnimation(prev.dataset.ani, curr, 'curr', move)
            this.transitionAnimation(prev.dataset.ani, prev, 'prev', move)
        } else {
            this.transitionAnimation(curr.dataset.ani, curr, 'curr', move)
            this.transitionAnimation(curr.dataset.ani, prev, 'prev', move)
        }

    }

    transitionAnimation(type, ele, state, move) {
        type = type || 'left'
        const animate = []
        if(state == 'prev') move *= -1 // inverse if its leaving
        switch(type) {
            case 'left':
                animate.push({
                    x: `${100*move}%`,
                    autoAlpha:1
                }, {
                    x: 0,
                    autoAlpha:1
                })
            break;
            case 'right':
                animate.push({
                    x: `${-100*move}%`,
                    autoAlpha:1
                }, {
                    x: 0,
                    autoAlpha:1
                })
            break;            
            case 'up':
                animate.push({
                    y: `${100*move}%`,
                    autoAlpha:1
                }, {
                    y: 0,
                    autoAlpha:1
                })
            break;
            case 'fade': 
                animate.push({
                    autoAlpha:0,
                }, {
                    autoAlpha:1,
                })
                if(state == 'prev') animate[0].autoAlpha = 1
            break;
            case 'none': 
                animate.push({
                    autoAlpha:1,
                }, {
                    autoAlpha:1,
                })
                if(state == 'prev') animate[0].autoAlpha = 1
            break;            
        }
        
        if(state == 'prev') {
            animate.reverse()
            ele.style.zIndex = 0
            animate[1].onComplete = () => {
                ele.style.visibility = 'hidden'
                this.lock = false
            }            
        } else {
            ele.style.zIndex = 1
        }

        animate[1].duration = 0.5


        gsap.fromTo(ele, ...animate)
    }
}