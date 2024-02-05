/**
 * 
 * 
 *          CANVAS GENERATION
 * 
 * 
 */

class blockCanvas { // canvas builder
	constructor() {
		this.running = false
		this.intervals = []
		this.squares = []
        this.staticOn = false
	}
    setup(canvas, colour) {

        this.factor = Math.min(1.3,Math.max(0.8, document.querySelector('#wrapper').offsetWidth/800))            
        this.width = document.querySelector(canvas).offsetWidth
        this.height = document.querySelector(canvas).offsetHeight
        this.colour = colour
        this.eles = []
        document.querySelectorAll(canvas).forEach((ele) => {
            ele.width = document.querySelector(canvas).offsetWidth
            ele.height = document.querySelector(canvas).offsetHeight
            let tempObj = {
                canvas: ele,
                ctx: ele.getContext('2d'),
                running: true
            }
            this.eles.push(tempObj)
        })

        this.resizeTimer = null
        if(!props.mobile) {
            window.addEventListener('resize', () => {
                clearTimeout(this.resizeTimer)
                if (!this.resizeTimer) {
                    this.onResizeStart()
                }
                this.resizeTimer = setTimeout(() => {
                    this.resizeTimer = null
                    this.onResizeEnd()
                }, 100)
            })
        }
    }  

    onResizeStart() {
        this.clear()
    }
    
    onResizeEnd() {
        this.factor = Math.min(1.3,Math.max(0.8, document.querySelector('#wrapper').offsetWidth/800))            
        this.eles.forEach((co) => {
            co.canvas.width = co.canvas.offsetWidth
            co.canvas.height = co.canvas.offsetHeight
            this.width = co.canvas.offsetWidth
            this.height = co.canvas.offsetHeight
            co.ctx = co.canvas.getContext('2d')
        })
        if(this.staticOn) this.static()
        this.animate()
    }
	randomBetween(min, max) {
		return Math.random() * (max - min) + min;
	}
	randomChance(chancePercentage) { // set chance probability
		const validPercentage = Math.max(0, Math.min(chancePercentage, 100));
		const randomValue = Math.random() * 100;
		const result = randomValue < validPercentage;
		return result;
	}
	drawRec(x, y, w, h, fadeDuration, globalAlpha, movementSpeed, driftDir) {
		let drift = driftDir || [0, 1]
		this.squares.push({
			x,
			y,
			w,
			h,
			fadeDuration,
			globalAlpha,
			movementSpeed,
			drift,
			startTime: performance.now()
		});
	}
    generateEdge(coverage, dir, baseline, custFade, driftDir) {
        
        let order = {};
        let fade = custFade || [2000, 3000]
        let fadeDuration = this.randomBetween(fade[0], fade[1])
        let cover = -20 * this.factor
        while (cover < coverage) {
            const block = this.randomBetween(15, 40) * this.factor
            let sizeH = (this.randomChance(60)) ? Math.max(1, 0.3 + Math.random()) : Math.max(1.5, 1.2 + Math.random())
            sizeH = block * sizeH.toFixed(2) * 1.5
            if (dir === "v") {
                order.x = baseline - (sizeH / 2)
                order.y = cover
                order.xs = sizeH
                order.ys = block
            } else {
                order.x = cover
                order.y = baseline - (sizeH / 2)
                order.xs = block
                order.ys = sizeH
            }
            this.drawRec(order.x, order.y, order.xs, order.ys, fadeDuration, 1.0, 0)
            cover += block;
        }
    }
    generateDecay(coverage, dir, baseline, custFade, addFade, driftDir) {
        let order = {}
        let fade = custFade || [1000, 5000]
        let fade2 = addFade || 2000
        let cover = this.randomBetween(0, 20) * this.factor;
        while (cover < coverage) {
            const size = this.randomBetween(10, 25) * this.factor
            const offset = baseline + this.randomBetween(-50, 50) * this.factor
            const fadeDuration = this.randomBetween(fade[0], fade[1])
            const globalAlpha = this.randomBetween(0.5, 1.0);
            if (dir === "v") {
                order.x = offset
                order.y = cover
                order.xs = size
                order.ys = size
            } else {
                order.x = cover
                order.y = offset
                order.xs = size
                order.ys = size
            }
            const moveSpeed = 3 * Math.random() / 10 * this.factor
            this.drawRec(order.x, order.y, order.xs, order.ys, fadeDuration, globalAlpha, Math.max(0.05, moveSpeed), driftDir)
            const gap = this.randomBetween(10, 80) * this.factor
            cover += size + gap
        }
        cover = this.randomBetween(0, 20) * this.factor;
        while (cover < coverage) {
            const size = this.randomBetween(5, 15) * this.factor
            const offset = baseline + this.randomBetween(-100, 100) * this.factor
            const fadeDuration = this.randomBetween(fade[0] + fade2, fade[1] + fade2)
            const globalAlpha = this.randomBetween(0.3, 0.7);
            if (dir === "v") {
                order.x = offset
                order.y = cover
                order.xs = size
                order.ys = size
            } else {
                order.x = cover
                order.y = offset
                order.xs = size
                order.ys = size
            }
            const moveSpeed = 5 * Math.random() / 10 * this.factor
            this.drawRec(order.x, order.y, order.xs, order.ys, fadeDuration, globalAlpha, Math.max(0.3, moveSpeed), driftDir)
            const gap = this.randomBetween(50, 120) * this.factor
            cover += size + gap
        }
        // clear old
        for (let i = 1; i < this.squares.length; i++) {
            const square = this.squares[i];
            const currentTime = performance.now();
            const elapsed = currentTime - square.startTime;
            const progress = elapsed / square.fadeDuration;
            const opacity = Math.max(1 - progress, 0);
            if (opacity <= 0) {
                this.squares.splice(i, 1);
            }
        }
    }
    static(coverage, dir, baseline, intervalArray, edgeObj, decayObj) {

        let cov = coverage || this.width;
        let base = baseline || 0;
        this.staticOn = true

        if (decayObj === undefined) {
            decayObj = {
                custFade: 0,
                addFade: 0,
                driftDir: 0
            }
        }
        if (edgeObj === undefined) {
            edgeObj = {
                custFade: 0,
                addFade: 0,
                driftDir: 0
            }
        }
        let intervalSet = intervalArray || [1000, 400]
        this.generateEdge(cov, dir, base, edgeObj.custFade, edgeObj.addFade, edgeObj.driftDir)
        let edge = setInterval(() => {
            this.generateEdge(cov, dir, base, edgeObj.custFade, edgeObj.addFade, edgeObj.driftDir)
        }, intervalSet[1])
        this.generateDecay(cov, dir, base, decayObj.custFade, decayObj.addFade, decayObj.driftDir)
        let decay = setInterval(() => {
            this.generateDecay(cov, dir, base, decayObj.custFade, decayObj.addFade, decayObj.driftDir)
        }, intervalSet[0])
        this.intervals.push(edge, decay)
        this.running = true
    }
    start() {
        if (!this.running) {
            this.running = true
            this.animate()
        }
    }
    stop() {
        this.running = false
        for (const intervalId of this.intervals) {
            clearInterval(intervalId);
        }
    }
    clear() {
        this.stop()
        this.squares = []
        setTimeout(() => {
            this.eles.forEach((co) => {
                co.ctx.clearRect(0, 0, co.canvas.width, co.canvas.height);
            })        
        },10);
    }
    animate() {
        const squares = this.squares
        this.eles.forEach((co) => {
            if (co.running) co.ctx.clearRect(0, 0, co.canvas.width, co.canvas.height);
            if (typeof this.preDraw === 'function') {
                this.preDraw(co.canvas, co.ctx)
            }
        })
        for (let i = squares.length - 1; i >= 0; i--) {
            const square = squares[i];
            const currentTime = performance.now();
            const elapsed = currentTime - square.startTime;
            const progress = elapsed / square.fadeDuration;
            const opacity = Math.max(1 - progress, 0);
            if (opacity <= 0) {
                // Remove the square from the array if opacity is zero
                squares.splice(i, 1);
            } else {
                let driftSpeed = (elapsed / 1000 * square.movementSpeed * 150)
                let opacityScale = (driftSpeed > 0) ? 1 / (1 + Math.exp(-(opacity * 5 - 2.5)))  : 1
                this.eles.forEach((co) => {
                    // Draw the square with updated opacity
                    if (co.running) {
                        co.ctx.globalAlpha = square.globalAlpha * opacity;
                        // const pattern = (textureLoaded) ? ctx.createPattern(textureImage, 'repeat') : 
                        const pattern = this.colour
                        co.ctx.fillStyle = pattern

                        co.ctx.fillRect(square.x + driftSpeed * square.drift[0] + (square.w - square.w * opacityScale)/4, square.y + driftSpeed * square.drift[1] - (square.h - square.h * opacityScale)/4, square.w * opacityScale, square.h * opacityScale);
                    }
                })
            }
        }
        this.eles.forEach((co) => {
            if (co.running) {
                co.ctx.globalAlpha = 1; // Reset globalAlpha
                if(typeof this.postDraw === 'function') this.postDraw(co.canvas, co.ctx)
            }
        })
        if (squares.length === 0) this.running = false
        if (this.running) requestAnimationFrame(() => this.animate());
    }
   
}

/**
 * 
 * 
 *          GALLERY
 * 
 * 
 */

class gallery {
	constructor() {
		this.running = false
		this.intervals = null
		this.imgs = []
        this.index = 0
        this.actioning = false
        this.zoomable = false
        this.touchStartX = 0
        this.touchEndX = 0        
	}
    
    setup(imgs, target, zoomable, intv) {
        intv = intv || 8000
        this.zoomable = zoomable || false

        target.classList.add('gallery')

        let left = {
            autoAlpha: 1,
            x: '-40%',
            z: 0,
            scale:0.6,
        }

        let middle = {
            autoAlpha: 1,
            x: '0%',
            z: 1,
            scale:1,
        }

        let right = {
            autoAlpha: 1,
            x: '40%',
            z: 0,
            scale:0.6,
        }
         
        let other = {
            autoAlpha: 0,
            x: '0%',
            z: -2,
            scale:0,
        }

        let wayfinder = document.createElement('div')
        wayfinder.classList.add('gallery-nav')

        imgs.forEach((im, i) => {
            let img = new Image()
            img.src = im
            img.classList.add('vel')
            img.setAttribute('data-gallerypos', i)
            img.addEventListener('click', (event)=> this.clicked(event))


            let div = document.createElement('div')
            div.classList.add('gallery-img')

            target.appendChild(div).appendChild(img)

            let wayNav = document.createElement('div')
            wayNav.classList.add('react-play')
            wayNav.setAttribute('data-gallerypos', i)
            wayNav.addEventListener('click', (event)=> this.navClicked(event))
            wayfinder.appendChild(wayNav)

            if(i === imgs.length-1) {
                gsap.set(div, left)
                gsap.set(img, {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))'})
                img.classList.add('dist25', 'dur1600')
                img.classList.add('react-play','noLight')
            } else if(i === 0) {
                gsap.set(div, middle)
                gsap.set(img, {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))'})
                img.classList.add('dist50', 'dur1600')
                if(this.zoomable) img.classList.add('zoomable')
                wayNav.classList.add('gallery-navOn')
            } else if(i === 1) {
                gsap.set(div, right)
                gsap.set(img, {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))'})
                img.classList.add('dist25', 'dur1600')
                img.classList.add('react-play','noLight')
            } else {
                gsap.set(div, other)
                gsap.set(img, {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))'})
                img.classList.add('dist0', 'dur1600')
            }

        })


      
        target.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
          });
        
        target.addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX;
          });
        
        target.addEventListener('touchend', () => {
            this.handleSwipe();
        });        

        target.appendChild(wayfinder)

        this.interval = intv
        this.imgs = imgs
        this.target = target

        this.moveInterval = setTimeout(()=>{
            this.move(1)
        },intv)

    }

    move(dir,speed) {

        clearTimeout(this.moveInterval)
        speed = speed || 0.5;

        let imgs = this.imgs
        let target = this.target

        let left = {
            autoAlpha: 1,
            x: '-40%',
            z: 0,
            scale:0.6,
        }

        let middle = {
            autoAlpha: 1,
            x: '0%',
            z: 1,
            scale:1,
        }


        let right = {
            autoAlpha: 1,
            x: '40%',
            z: 0,
            scale:0.6,
        }
            
        let other = {
            autoAlpha: 0,
            x: '0%',
            z: -2,
            scale:0,
        }
        
        if(document.hasFocus()) {
            if(dir > 0) this.index++; else this.index--;
            if (this.index < 0) this.index = imgs.length - 1;
            if (this.index > imgs.length - 1) this.index = 0;

            target.querySelectorAll('.gallery-img').forEach((div, i, l)=> {
                const rati = (i - this.index + imgs.length) % imgs.length;
                const img = div.querySelector('img')
                qs(`.gallery-nav div:nth-child(${i+1})`).classList.remove('gallery-navOn')
                if(this.zoomable) div.querySelector('img').classList.remove('zoomable')
                if(rati === imgs.length-1) {
                    gsap.to(div, {...left, duration:speed })
                    gsap.to(img, {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))', duration:Math.max(0.3, speed) })
                    gsap.to(img.dataset, {dist:25, dur:1600, duration: speed })
                    img.classList.add('react-play','noLight')
                } else if(rati === 0) {
                    gsap.to(div, {...middle, duration: speed })
                    gsap.to(img, {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))', duration:Math.max(0.3, speed*0.5) })
                    gsap.to(img.dataset, {dist:50, dur:1600, duration: speed, onComplete: () => {
                        if(this.zoomable) img.classList.add('zoomable')
                        img.classList.remove('react-play')
                    } })
                    qs(`.gallery-nav div:nth-child(${i+1})`).classList.add('gallery-navOn')
                } else if(rati === 1) {
                    gsap.to(div, {...right, duration: speed })
                    gsap.to(img, {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))', duration:Math.max(0.3, speed) })
                    gsap.to(img.dataset, {dist:25, dur:1600, duration: speed })
                    img.classList.add('react-play','noLight')
                } else {
                    gsap.to(div, {...other, duration: speed })
                    gsap.to(img, {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))', duration:Math.max(0.3, speed) })
                    gsap.to(img.dataset, {dist:0, dur:1600, duration: speed })
                }
            })
        }

        this.moveInterval = setTimeout(()=>{
            this.move(1)
        },this.interval)

    }

    clicked(event) {
        if(this.actioning) return;
        let imGalPos = event.target.dataset.gallerypos
        if(imGalPos == this.index) return;

        clearInterval(this.moveRapid)

        if(this.index == this.imgs.length-1) {
            if(imGalPos == 0) this.move(1); else if(imGalPos < this.index) this.move(-1); else this.move(1)
        } else if(this.index === 0) {
            if(imGalPos == this.imgs.length-1) this.move(-1); else if(imGalPos < this.index) this.move(-1); else this.move(1)
        } else {
            if(imGalPos < this.index) this.move(-1); else this.move(1)
        }

    }

    handleSwipe() {
  
        const swipeDistance = this.touchEndX - this.touchStartX;
        if (swipeDistance > 50) {
            this.move(-1)
        } else if (swipeDistance < -50) {
            this.move(1)
        }
      
    }
    
    navClicked(event) {
        if(this.actioning) return;
        let imGalPos = event.target.dataset.gallerypos
        if(imGalPos == this.index) return;
        this.actioning = true;
        let diff = imGalPos - this.index
        let speed = Math.min(0.5, (0.75 / Math.abs(diff))
)
        let iter = 0;
        this.moveRapid = setInterval(()=>{
            if(diff < 0) {
                this.move(-1,speed)
            } else {
                this.move(1,speed)
            }

            iter++;
            if(iter === Math.abs(diff)) { 
                clearInterval(this.moveRapid)
                this.actioning = false;
            }

        },speed + 100)



    }    
}


/*          Dynamic gal         */

class dynamicGallery { // canvas builder
	constructor() {
        this.onScreen = false
        this.hook = null
        this.index = 0
        this.prevIndex = 1
        this.firstRun = true
        this.zOff = -300
        this.yOff = 100
        this.xOff = 0
	}

    setup(ele, hook) {

        this.element = ele
        this.parent = ele.parentElement

        const observer = new IntersectionObserver(this.galOnScreen.bind(this), {
            rootMargin:'0% 0% 0% 0%'
        })

        observer.observe(ele)


        this.imgs = []
        for (var i = 0; i < ele.children.length; i++) {
            this.imgs.push(ele.children[i])
        }
        
        let panel = document.createElement('div')
        panel.classList.add('panel')
    
        this.imgs.forEach((im, i) => {
            let card = document.createElement('div')
            card.classList.add('card')
            card.style.aspectRatio = im.naturalWidth/im.naturalHeight
            card.style.width = (im.naturalWidth >= im.naturalHeight) ? '100%' : 'auto'
            card.style.height = (im.naturalWidth <= im.naturalHeight) ? '100%' : 'auto'
            panel.appendChild(card).appendChild(im)
        })
    
        ele.appendChild(panel)
     


        if(hook !== undefined) {

            this.hook = qsa(hook)

            const observerHook = new IntersectionObserver(this.hookSwitch.bind(this), {
                rootMargin: '-50% 0% -50% 0%'
            });                    

            let tempHook = []
            attributeSetup(hook,['DGi'])            
            this.hook.forEach(element => {
                let array = Array.from(element.classList)
                array.forEach(val => {
                        if(val.indexOf('DGi') > -1 && tempHook.indexOf(`${hook}.${val}`) === -1) tempHook.push(`${hook}.${val}`)  
                })
                observerHook.observe(element);
            });

            this.hookIndex = []
            tempHook.forEach((v,i,a) => {
               this.hookIndex.push(qsa(v))
            })
        }

        const tl = gsap.timeline({
            onComplete: () => {
              this.animating = false;
            }
          })

        let leaving = [
            [{
                x:0,
                y:0,
                rotateX: 0,
                z:0,
                autoAlpha:1,
                duration: 0
            },{
                x:this.xOff*0.5,
                y:'-20%',
                rotateX: 90,
                z:this.zOff*0.5,
                autoAlpha:1,
                duration: 0
            }],
            [{
                x:this.xOff*0.5,
                y:'-20%',
                rotateX: 90,
                z:this.zOff*0.5,
                autoAlpha:1,
                duration: 0
            },{
                x:this.xOff,
                y:this.yOff,
                rotateX: 180,
                z:this.zOff,
                autoAlpha:1,
                duration: 0               
            }]            
        ]        

        let coming = [
            [{
                x:this.xOff,
                y:this.yOff,
                rotateX: 180,
                z:this.zOff,
                autoAlpha:1,
                duration: 0
            },{
                x:this.xOff*0.5,
                y:'20%',
                rotateX: 270,
                z:this.zOff/2,
                autoAlpha:1,
                duration: 0
            }],
            [{
                x:this.xOff*0.5,
                y:'20%',
                rotateX: 270,
                z:this.zOff/2,
                autoAlpha:1,
                duration: 0
            },{
                x:0,
                y:0,
                rotateX: 360,
                z:0,
                autoAlpha:1,
                duration: 0              
            }]            
        ]

        let imz = this.element.querySelectorAll('.card')
        gsap.set(imz, {autoAlpha:0})
        if(this.prevIndex > this.index) {
            leaving.forEach((v,start) => {
                tl.fromTo(imz[this.prevIndex], v[0], v[1], (start == 0) ? 0 : '>')
            })

            coming.forEach((v,start) => {
                tl.fromTo(imz[this.index], v[0], v[1], (start == 0) ? 0 : '>')
            })

        } else {
            leaving.forEach((v,start) => {
                tl.fromTo(imz[this.prevIndex], v[0], v[1], (start == 0) ? 0 : '>')
            })

            coming.forEach((v,start) => {
                tl.fromTo(imz[this.index], v[0], v[1], (start == 0) ? 0 : '>')
            })
        }
        this.prevIndex = 0
    }

    galOnScreen(e, observer) {
        e.forEach(entry => {

            if (entry.isIntersecting) {
                this.onScreen = true
                window.addEventListener('scroll', this.handleScroll.bind(this))
                window.addEventListener('mousemove', this.handleTilt.bind(this));
            } else {
                this.onScreen = false
                window.removeEventListener('scroll', this.handleScroll.bind(this));     
                window.removeEventListener('mousemove', this.handleTilt.bind(this));
            }
        });

    }

    hookSwitch(e, observer) {
        e.forEach((entry) => {
            if (entry.isIntersecting) {
                
                // const entryArray = Array.from(this.hookIndex)
                // const index = entryArray.indexOf(entry.target)
                if(parseInt(entry.target.dataset.dgi) !== this.index) {
                    this.index = parseInt(entry.target.dataset.dgi)
                    this.move()    
                } else if(this.firstRun) {
                    this.firstRun = false
                    gsap.set(this.hookIndex, {background:'none'})
                    gsap.set(this.hookIndex[this.index], {background:'red'})            
                }
                
            }
        })
    }

    positionElements(height) {
        this.height = height
    }

    handleScroll(event) {
        let element = this.parent
        const boundingBox = this.parent.getBoundingClientRect();
        const T = boundingBox.top;
        const H = boundingBox.height;
        const VH = window.innerHeight;
        if(this.height !== H) this.positionElements(H)

        this.percentage = Math.max(0, Math.min(1,(T / (H - VH) * -1))) * 100
    }

    handleTilt(event) {
        const ele = this.element.querySelector('.panel')
        const elementRect = ele.getBoundingClientRect();
        const elementCenterX = elementRect.left + elementRect.width / 2;
        const elementCenterY = elementRect.top + elementRect.height / 2;
  
        const deltaX = event.clientX - elementCenterX;
        const deltaY = event.clientY - elementCenterY;
  
        // tilt max
        const tiltX = Math.max(-30, Math.min(30,-(deltaY / 100))); 
        const tiltY = Math.max(-30, Math.min(30, deltaX / 100));
  
        ele.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;        
    }

    moveShift(dir,speed) {
        if(dir > 0) this.index++; else this.index--;
        if (this.index < 0) this.index = this.imgs.length - 1;
        if (this.index > this.imgs.length - 1) this.index = 0;
        this.move(speed)
    }

    move(speed) {

        gsap.set(this.hookIndex, {background:'none'})
        gsap.set(this.hookIndex[this.index], {background:'red'})

        if(this.animating) {
            clearTimeout(this.moveReturn)
            this.moveReturn = setTimeout(()=> this.move(speed),100)
            console.log('repeating')
            return;
        }
        this.animating = true;
        const tl = gsap.timeline({
            onComplete: () => {
              this.animating = false;
            }
          })

          speed = speed || 0.5;
          let imgs = this.imgs
          let target = qs('.panel')


          let leaving = [
            [{
                x:0,
                y:0,
                rotateX: 0,
                z:0,
                autoAlpha:1,
                duration: speed/2  
            },{
                x:this.xOff*0.5,
                y:'-20%',
                rotateX: 90,
                z:this.zOff*0.5,
                autoAlpha:1,
                duration: speed/2  
            }],
            [{
                x:this.xOff*0.5,
                y:'-20%',
                rotateX: 90,
                z:this.zOff*0.5,
                autoAlpha:1,
                duration: speed/2  
            },{
                x:this.xOff,
                y:this.yOff,
                rotateX: 180,
                z:this.zOff,
                autoAlpha:1,
                duration: speed/2               
            }]            
        ]        

        let coming = [
            [{
                x:this.xOff,
                y:this.yOff,
                rotateX: 180,
                z:this.zOff,
                autoAlpha:1,
                duration: 0
            },{
                x:this.xOff*0.5,
                y:'20%',
                rotateX: 270,
                z:this.zOff/2,
                autoAlpha:1,
                duration: speed/2  
            }],
            [{
                x:this.xOff*0.5,
                y:'20%',
                rotateX: 270,
                z:this.zOff/2,
                autoAlpha:1,
                duration: 0
            },{
                x:0,
                y:0,
                rotateX: 360,
                z:0,
                autoAlpha:1,
                duration: speed/2             
            }]            
        ]


        let imz = this.element.querySelectorAll('.card')
        gsap.set(imz, {autoAlpha:0})
        if(this.prevIndex > this.index) {
            leaving.forEach((v,start) => {
                tl.fromTo(imz[this.prevIndex], v[0], v[1], (start == 0) ? 0 : '>')
            })

            coming.forEach((v,start) => {
                tl.fromTo(imz[this.index], v[0], v[1], (start == 0) ? 0 : '>')
            })

        } else {
            leaving.forEach((v,start) => {
                tl.fromTo(imz[this.prevIndex], v[0], v[1], (start == 0) ? 0 : '>')
            })

            coming.forEach((v,start) => {
                tl.fromTo(imz[this.index], v[0], v[1], (start == 0) ? 0 : '>')
            })
        }

        this.prevIndex = this.index
    
    }
    
}