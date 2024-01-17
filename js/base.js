/**
 * 
 * 
 *          SETUP
 * 
 * 
 */



// determine CSS per page
// UI altering thang set-up

/*          MAJOR EDITABLE VARIABLES           */

// textures for screens
const si = [ 
    'red',
    'lightGreen',
    'blue',
    'yellow',
    'pink'
]

let contactInfo = {
    name: 'Jesse Whitmore',
    tel: '+614 21 907 903',
    email: 'j.whitmore.mail@gmail.com',
    linkdin: 'https://www.linkedin.com/in/jesse-whitmore-998a18133/',
    CV: './contact/cv.pdf'
}

let contactTreatment = {
    name: {type: 'text' },
    tel: {type: 'link', hover:'react-copy', func: ()=> {window.open(`tel:${contactInfo.tel.replace(' ','')}`,'_self')} },
    email: {type: 'link', hover:'react-copy', func: ()=> sendEmail() },
    linkdin: {type: 'link', hover:'react-open', text: 'linkdIn',  trans:true, },
    CV: {type: 'link', hover:'react-open', text: 'CV' }
}

let bobControls = {
    xMax: 4,
    yMax: 10,
    movement: 1,
    dur: 5
}

let push = {
    amount: 40,
    from: 400,
    deadzone: 50,
    dur: 3,
    x:0,
    y:0
}


/*          GLOBALS           */

let props = { 
    rem: 16
}

 let projectManifest = [
    {
        title: 'test title',
        desc: 'PROJECT - TYPE - CODE' 
    }, 
    {
        title: 'test title',
        desc: 'PROJECT - TYPE - CODE' 
    }, 
    {
        title: 'test title',
        desc: 'PROJECT - TYPE - CODE' 
    }, 
    {
        title: 'test title',
        desc: 'PROJECT - TYPE - CODE' 
    }, 
    {
        title: 'test title',
        desc: 'PROJECT - TYPE - CODE' 
    }
]

let pushable = []
let float = []

let clickables = []

const internalRedirect = document.referrer.includes(window.location.origin)

/*          ORPHANED VARIABLES           */

// about section timeline
let timeline = gsap.timeline({paused: true})

// array of elements to animate if on screen
let viewportVel = [];
let siLock = false;


// expo decay 
const targetValue = 1,   // Target value to approach
decayRate = 0.9;   // Decay rate, adjust to control the rate of decrease
let scrollVelocity = 0


/*          FUNCTIONS           */

const rootStyles = getComputedStyle(document.documentElement);
const root = Array.from(document.styleSheets)
  .filter(
    sheet =>
      sheet.href === null || sheet.href.startsWith(window.location.origin)
  )
  .reduce(
    (acc, sheet) =>
      (acc = [
        ...acc,
        ...Array.from(sheet.cssRules).reduce(
          (def, rule) =>
            (def =
              rule.selectorText === ":root"
                ? [
                    ...def,
                    ...Array.from(rule.style).filter(name =>
                      name.startsWith("--")
                    )
                  ]
                : def),
          []
        )
      ]),
    []
  );

root.forEach((i)=>{
    iSplit = i.split('-')
    iSplit.splice(0,2)
    for(let l=1; l < iSplit.length; l++) {
        iSplit[l] = iSplit[l].charAt(0).toUpperCase() + iSplit[l].slice(1);
    }
    props[iSplit.join('')] = rootStyles.getPropertyValue(i)
})

window.mobileAndTabletCheck = function() { // is mobile or tablet
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
props.mobile = window.mobileAndTabletCheck()

function pad(num, size) { // pad number with 0s
    num = num.toString()
    while (num.length < size) num = "0" + num
    return num
}

function qs(ele) { // query selector
    return document.querySelector(ele)
}

function qsa(ele) { // query selector all
    return document.querySelectorAll(ele)
}

function randomChance(chancePercentage) { // set chance probability
    const validPercentage = Math.max(0, Math.min(chancePercentage, 100));  
    const randomValue = Math.random() * 100;  
    const result = randomValue < validPercentage;  
    return result;
}

function attributeSetup(elements, attributes) { // setup attribute tags from class name. props: elements  to loop through text, array of classes to turn to attr
    for(let ele of qsa(elements)) {
        let defaultVals = Array(attributes.length).fill(0)

        for(val of ele.classList) {
            for(let i = 0; i < attributes.length; i++) {
                if(val.indexOf(attributes[i]) > -1) defaultVals[i] = val.replace(/\D/g,'')
                ele.setAttribute(`data-${attributes[i]}`, defaultVals[i])
            }
        }
    }
}

function exponentialDecayWithMax(currentValue, targetValue, decayRate) { // bigger numbers at beggining but not end
    // If currentValue is above targetValue, set it to targetValue
    if (currentValue > targetValue) { return targetValue;
    } else if (currentValue < -targetValue) { return -targetValue; }
    // Calculate the decayed value
    return currentValue + (0 - currentValue) * Math.exp(-decayRate);
}

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

function wrapContent(outer, name) {
    let inner = document.createElement('div')
    if(name !== null) inner.classList.add(name)
    while (outer.firstChild) {
        inner.appendChild(outer.firstChild);
      }      
    outer.appendChild(inner)
}

function sendEmail() {
    let subject = `let's work together!`;
    let emailBody = `I was on your portfolio and I'd just like to say...`;
    document.location = "mailto:"+contactInfo.email+"?subject="+subject+"&body="+emailBody;
}

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
        for (const intervalId of this.intervals) {
            clearInterval(intervalId);
        }
    }
    clear() {
        this.stop()
        this.squares = []
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
                        
                        co.ctx.fillRect(square.x + driftSpeed * square.drift[0], square.y + driftSpeed * square.drift[1], square.w * opacityScale, square.h * opacityScale);
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
 *          SCROLL RELATED
 * 
 * 
 */

// Initialize variables to store current and target positions
const scrollVals = {
    lastScrollTop: window.scrollY || window.pageYOffset,
    lastTimestamp: Date.now(),
    lastScroll:0,
    scrollVelocity: 0,
    refreshing: false
}

function scrollObservation() {


    /*          Animation on refresh rate       */

    function updateNavPosition() {


        /*          Velocity calculation and animation          */

        scrollVals.refreshing = true;
        const currentScrollTop = window.scrollY || window.pageYOffset,
        currentTimestamp = Date.now(),
        decayFactor = 0.90; // Adjust to control the decay rate

        // -------------

        // calculate velocity and handle the animation
        setTimeout(() => {
            const deltaTime = currentTimestamp - scrollVals.lastTimestamp;
            const deltaScroll = currentScrollTop - scrollVals.lastScrollTop;
        
            // Calculate velocity (pixels per millisecond)
            scrollVelocity = deltaScroll / deltaTime;
            scrollVelocity *= decayFactor;

            // ensure real numbers only possible
            if(!isNaN(scrollVelocity)) scrollVals.scrollVelocity = scrollVelocity;

            // Simulate the exponential decay with maximum
            let result = exponentialDecayWithMax(scrollVals.scrollVelocity, targetValue, decayRate);
            result = result.toFixed(2);
            handleVel(result)

            // Update the last scroll position and timestamp
            scrollVals.lastScrollTop = currentScrollTop;
            scrollVals.lastTimestamp = currentTimestamp;
        },100)


        // -------------

        /*  Custom function for all pages */

        if (typeof customScroll === 'function') customScroll()

        // -------------

        //reset elements to standard pos when scrolling stops else rerun
        if(scrollVals.scrollVelocity === 0) {
            scrollVals.scrollVelocity = 0
            setTimeout(()=>{
                handleVel(0)
            },200)

            scrollVals.refreshing = false
        } else {
            requestAnimationFrame(updateNavPosition)
        }

    
    }  


    // -------------

    // Function to be called when the user scrolls
    function handleScroll() {

        if(!scrollVals.refreshing) updateNavPosition();
    }
    document.addEventListener('scroll', handleScroll); 

}


/**
 * 
 * 
 *          INTERSECT OBSERVERS
 * 
 * 
 */

// default observer construct
function observerConstructor(fc, ele, opt) {
    // Create an Intersection Observer with the callback function and options
    const observer = new IntersectionObserver(fc, opt);
      
    // Start observing each element
    qsa(ele).forEach((element,i) => {
      observer.observe(element);
    });        
}


/**
 * 
 * 
 *          ANIMATION HANDLING
 *          Velocity, parallax, any animation in more than one section
 * 
 * 
 */

function handleVel(result) {
    viewportVel.forEach(v => {
        let dur = parseInt(v.dataset.dur) || 0
        let dist = (dur === 0) ? 0 : parseInt(v.dataset.dist) || 0
        gsap.to(v, {y: dist*-result, duration: dur/1000})
    });

}



let lightGrain = document.createElement('div')
lightGrain.id = 'lightGrain'
lightGrain.classList.add('fullScreen')
lightGrain.style.opacity = 0.1
lightGrain.style.mixBlendMode = 'color-burn'

let heavyGrain = document.createElement('div')
heavyGrain.id = 'heavyGrain'
heavyGrain.classList.add('fullScreen')
heavyGrain.style.opacity = 0.0
heavyGrain.style.mixBlendMode = 'hard-light'  

let blocker = qs('#blocker')
blocker.insertAdjacentElement('afterend', heavyGrain);
blocker.insertAdjacentElement('afterend', lightGrain);


grained('#lightGrain', {
  "animate": true,
  "patternWidth": 100,
  "patternHeight": 300,
  "grainOpacity": 1,
  "grainDensity": 1.5,
  "grainWidth": 1,
  "grainHeight": 1
})

grained('#heavyGrain', {
  "animate": true,
  "patternWidth": 20,
  "patternHeight": 500,
  "grainOpacity": 1,
  "grainDensity": 1.89,
  "grainWidth": 5.37,
  "grainHeight": 3.28
})

// grain fade and animation
setInterval(()=> {
  let state = randomChance(90)
  gsap.to(lightGrain, {
      opacity: (state) ? Math.max(0.05,0.15 * Math.random()) : Math.max(0.15,0.3 * Math.random()) ,
      duration:0.6
  })
  gsap.to(heavyGrain, {
      scaleY: 0.2 * Math.random(),
      opacity: (state) ? 0 : Math.max(0.1,0.2 * Math.random()),
      duration:0.3
  })

  if(!state) gsap.to(heavyGrain, {
      y: (heavyGrain.offsetHeight) * Math.random() - heavyGrain.offsetHeight/2,
      duration:6
  })    

},300)    



/**
 * 
 * 
 *          UNIVERSAL CANVAS
 * 
 * 
 */

const linkClick = new blockCanvas()
linkClick.setup('.linkClickCanvas','rgba(40,40,40,1)')

let wipeDir = []

linkClick.click = function(dir,link, postMessage, dur) {
    if(dir === 'r') wipeDir = [this.height, 'v', [-1,0]]; else  wipeDir = [this.width, 'h',  [0,1]]
    let moveVal = { value: (wipeDir[0] === this.width) ? this.height : 0 };
    dur = dur || 0.5;


    let lc = { 
        top:0,
        width:'100%',
        height:'100%',
        'transform-origin':'bottom left',
    }

    if(dir === 'r') { 
        lc.scaleX = 0
        lc.scaleY = 1

        gsap.set('.linkClick', lc)
        gsap.to('.linkClick', {
            scaleX:1,
            duration: dur,
            ease: "power1.inOut"
        })    

    } else {
        lc.scaleX = 1
        lc.scaleY = 0

        gsap.set('.linkClick', lc)
        gsap.to('.linkClick', {
            scaleY:1,
            duration: dur,
            ease: "power1.inOut"
        })           
    }

    gsap.to(moveVal, {
        value: (wipeDir[0] === this.height) ? this.width : 0,
        duration: dur,         // Duration of the animation in seconds
        ease: "power1.inOut", // Easing function (you can choose other easing functions)
        onUpdate: () => {
            this.generateEdge(wipeDir[0], wipeDir[1], moveVal.value, [20,70]) 
            this.generateDecay(wipeDir[0], wipeDir[1], moveVal.value [50,200],300,wipeDir[2])
            this.start()
        },
        onComplete: () => {
            if(typeof link === 'function') {
                link()
            } else {
                if(postMessage !== undefined) link += `?msg=${postMessage.toLowerCase()}`
                window.open(link,"_self")
            }
        }
    })
}

linkClick.centerSweep = function(pos, link, dur) {
    let moveVal = { value: pos };
    dur = dur || 0.5;

    gsap.set('.linkClick', {
        top: pos,
        height: '100%',
        width: '100%',
        y: '-50%',
        'transform-origin':'center',
        scaleX: 1,
        scaleY: 0
    })

    gsap.to('.linkClick', {
        scaleY:2.2,
        duration: dur * 2,
        ease: "power1.inOut"
    })

    gsap.to(moveVal, {
    value: this.height * 1.1 + pos,
    duration: dur * 2,         // Duration of the animation in seconds
    ease: "power1.inOut", // Easing function (you can choose other easing functions)
    onUpdate: () => {
        this.generateEdge(this.width, 'h', pos*2 + moveVal.value*-1, [20,70]) 
        this.generateDecay(this.width, 'h', pos*2 + moveVal.value*-1, [50,200],300,[-1,0])

        this.generateEdge(this.width, 'h', moveVal.value, [20,70]) 
        this.generateDecay(this.width, 'h', moveVal.value, [50,200],300,[1,0])
        this.start()
    },
    onComplete: () => {
        if(typeof link === 'function') {
            link()
        } else {
            window.open(link,"_self")
        }
      }
    })
}

linkClick.fromClicked = function(dir, dur) {
    if(dir === 'r') wipeDir = [this.height, 'v', [-1,0]]; else  wipeDir = [this.width, 'h',  [0,1]]
    let moveVal = { value: (wipeDir[0] === this.width) ? this.height : 0 };
    dur = dur || 0.5;


    gsap.to(moveVal, {
        value: (wipeDir[0] === this.height) ? this.width : 0, // Ending value
        duration: 0.5,         // Duration of the animation in seconds
        ease: "power1.inOut", // Easing function (you can choose other easing functions)
        onUpdate: () => {
            this.generateEdge(wipeDir[0], wipeDir[1], moveVal.value, [20,70]) 
            this.generateDecay(wipeDir[0], wipeDir[1], moveVal.value, [50,200],300,wipeDir[2])
            this.start()
        }
    })
    
    let lc = {
        top:0,
        width: '100%',
        height: '100%',
        'transform-origin':'top right'
    }

    if(wipeDir[0] === this.height) { 

        gsap.set('.linkClick', lc)        
        gsap.to('.linkClick', {
            scaleX:0,
            duration:0.5,
            ease: "power1.inOut"
        }) 

    } else {

        gsap.set('.linkClick', lc)
        gsap.to('.linkClick', {
            scaleY:0,
            duration:0.5,
            ease: "power1.inOut"
        })
         
    } 
}

// -------------------------------------------------------
let menuWipe;
if(props.mobile) {
    menuWipe = new blockCanvas()
    let propPCsplit = props.primaryCol.split(',')
    propPCsplit.forEach((v) => { v = v-10 })
    menuWipe.setup('.menuWipe',`rgba(${propPCsplit},1)`)

    menuWipe.travelVal = menuWipe.width
    menuWipe.init = function() {
        let path, dir;
        if(this.open === 0) { 
            this.open = this.width;
            dir = 1
            path = 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
        } else {
            this.open = 0
            dir = -1
            path = 'polygon(0% 0, 100% 0, 100% 100%, 0% 100%)'
        }
        let myVariable = { value: this.travelVal };

        gsap.to('#nav', {
            'clip-path' : path,
            duration:0.5,
            ease: "power1.inOut"
        })

        gsap.to(myVariable, {
            value: this.open,          // Ending value
            duration: 0.5,         // Duration of the animation in seconds
            ease: "power1.inOut", // Easing function (you can choose other easing functions)
            onUpdate: () => {
                this.generateEdge(this.height, 'v', myVariable.value, [20,70]) 
                this.generateDecay(this.height, 'v', myVariable.value, [50,200],300,[dir,0])
                this.start()
                this.travelVal = myVariable.value
            }
        })
    }
}


window.onload = function() {


    const url = new URL(window.location.href);

    // Get the search parameters
    const searchParams = url.searchParams;
    searchParams.forEach((v,k) => {
        switch(k) {
            case 'msg':
                jumpTo(v,'instant')
            break;
        }
    })

    if(typeof customResizer === 'function') customResizer()
    
    document.querySelector('#blocker').style.background = "none"
    if(internalRedirect) (props.mobile) ? linkClick.fromClicked('r') : linkClick.fromClicked('t')

    
}


/**
 * 
 * 
 *          UNIVERSAL INTERACTS
 * 
 * 
 */

function mouseOver(ev) {
    
    /*          mouse follower          */
    const mouseX = ev.clientX;
    const mouseY = ev.clientY;

    setTimeout(()=>{
        qs('#mousePointer').style.display = 'block';

        let mOffset = 150

        const mouseYoffset = mouseY + window.scrollY

        let dX = mouseX - push.x;
        let dY = mouseYoffset - push.y;

        // Calculate the distance between the mouse and the element
        const dist = Math.sqrt(dX ** 2 + dY ** 2);

        if(dist >= mOffset) {
            push.x = mouseX
            push.y = mouseYoffset
        }

    },300)

    /*          mouse push          */
    pushable.forEach((val) => {

            // Calculate the distance from the mouse to the target element
            const rect = val.target.getBoundingClientRect();
            const elementX = rect.left + rect.width / 2;
            const elementY = rect.top + rect.height / 2;
            const deltaX = mouseX - elementX;
            const deltaY = mouseY - elementY;

            // Calculate the distance between the mouse and the element
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
            if(distance <= push.deadzone) {
                val.xy = [0,0]
                return;
            }

            // Calculate the scaling factor based on the distance
            const scalingFactor = 1 - Math.min(distance / push.from, 1);

            // Calculate the capped distance
            const cappedDistance = scalingFactor * push.amount;

            // Calculate the angle between the mouse and the element
            const angle = Math.atan2(deltaY, deltaX);

            // Calculate the new position with the capped distance
            const newX = elementX - cappedDistance * Math.cos(angle);
            const newY = elementY - cappedDistance * Math.sin(angle);
          
            // Update the element's position
            val.xy = [newX-elementX, newY-elementY]
    })

    let interactable = Array.from(ev.target.classList).some(className => className.includes('react'))

    if(interactable && !(ev.target.classList.contains('screenTexture') && siLock)) {
        const classList = Array.from(ev.target.classList)
        const matchingClass = classList.find(className => className.includes('react'))
        qs('#mousePointer').classList = matchingClass
    } else {
        qs('#mousePointer').classList = null
    }

    let hlh = qsa('.highlightHover')
    if(interactable) {
        if(push.target !== ev.target) {
            hlh.forEach((ele) => {
                ele.classList.remove('highlightHover')
            })

            if(ev.target.parentNode.classList.contains('buttonCells')) { 
                qs('#buttonText').classList.add('highlightHover')
                ev.target.classList.add('highlightHover')
            } else if(ev.target.parentNode.id === "buttonText") {
                ev.target.parentNode.classList.add('highlightHover')
                if(!ev.target.classList.contains('defaultState')) {
                    qs(`#${Array.from(ev.target.classList).find(className => className !== 'highlightHover')}`).classList.add('highlightHover')
                }
            } else {
                ev.target.classList.add('highlightHover')
            }
            
        }
    } else if(hlh.length > 0) {
        hlh.forEach((ele) => {
            ele.classList.remove('highlightHover')
        })
    }   

    qsa('.buttonCells div').forEach((ele) => {
        if(ele === ev.target) {
            changeContact(ev.target, 69, Array.from(ev.target.parentNode.children))
        }
    })

    push.target = ev.target
    if(typeof customMouse === 'function') customMouse()
}

// menu open
function menuToggle() {
    if(!scrollVals.autoScrolling) {
        document.body.classList.toggle('menuOpen')
        qs('#nav').classList.toggle('menuOpen')
        qs('#navCanvas').classList.toggle('menuOpen')

        qs('#menu').classList.add('highlightHover')
        setTimeout(()=>{
            qs('#menu').classList.remove('highlightHover')
        },300)

        menuWipe.init()
    }
}

if(!props.mobile) {
    function mousePointer() {
        gsap.to('#mousePointer', {x: push.x, y:push.y, duration: 0.1, ease: "power2.inOut" })
        requestAnimationFrame(mousePointer)
    } 
    mousePointer()
    document.addEventListener('mousemove', (event) => mouseOver(event))
}

// click to open menu
if(props.mobile) {

    qs('#menu').addEventListener('click', () => {
        menuToggle()
    });
} else {
    qs('#menu').style.display = 'none'
    qs('#menuDesktop').style.display = 'flex'
    qs('#menuDesktop').addEventListener('click', (ev) => {
        if(ev.target.id !== 'menuDesktop') jumpTo(ev.target.innerText)
    });    
}

function jumpTo(pos, behavior) {
    let posEle = (pos.toLowerCase() === 'home') ? qs('#header') : qs(`#${pos.toLowerCase()}`)
    if(posEle === null) {
        pos = pos.toLowerCase()
        switch(pos) {
            case 'about':
                linkClick.click((props.mobile) ? 'r' : 't', `${window.location.origin}/about.html`)
            break;
            default:
                linkClick.click((props.mobile) ? 'r' : 't', `${window.location.origin}/index.html?msg=${pos}`)
        }
        return
    }
    behavior = behavior || 'smooth'

    let eleTop = posEle.getBoundingClientRect().top
    let distance = eleTop + document.documentElement.scrollTop
    if(eleTop < 10 && eleTop > -10 ) {
        if(props.mobile && document.body.classList.contains('menuOpen')) menuToggle()
    } else {
        scrollVals.autoScrolling = true
        scrollVals.scrollingTimer = null;
        function afterScrollAnimation() {
            clearTimeout(scrollVals.scrollingTimer);
            scrollVals.scrollingTimer = setTimeout(function() {
                scrollVals.autoScrolling = false
                if(props.mobile && document.body.classList.contains('menuOpen')) menuToggle()
                window.removeEventListener('scroll', afterScrollAnimation);
            }, 250);
        }

        window.addEventListener('scroll', afterScrollAnimation)
        window.scrollTo({top: distance, behavior});
    }
}


function toClipboard(val) {
    // Copy the text inside the text field
    navigator.clipboard.writeText(val);
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
            wayNav.setAttribute('data-gallerypos', i)
            wayNav.addEventListener('click', (event)=> this.navClicked(event))
            wayfinder.appendChild(wayNav)

            if(i === imgs.length-1) {
                gsap.set(div, left)
                gsap.set(img, {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))'})
                img.classList.add('dist25', 'dur1600')
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
            } else {
                gsap.set(div, other)
                gsap.set(img, {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))'})
                img.classList.add('dist0', 'dur1600')
            }

        })

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
                let rati = (i - this.index + imgs.length) % imgs.length;
                
                qs(`.gallery-nav div:nth-child(${i+1})`).classList.remove('gallery-navOn')
                if(this.zoomable) div.querySelector('img').classList.remove('zoomable')
                if(rati === imgs.length-1) {
                    gsap.to(div, {...left, duration:speed })
                    gsap.to(div.querySelector('img'), {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))', duration:Math.max(0.3, speed) })
                    gsap.to(div.querySelector('img').dataset, {dist:25, dur:1600, duration: speed })
                } else if(rati === 0) {
                    gsap.to(div, {...middle, duration: speed })
                    gsap.to(div.querySelector('img'), {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))', duration:Math.max(0.3, speed*0.5) })
                    gsap.to(div.querySelector('img').dataset, {dist:50, dur:1600, duration: speed, onComplete: () => {
                        if(this.zoomable) div.querySelector('img').classList.add('zoomable')
                    } })
                    qs(`.gallery-nav div:nth-child(${i+1})`).classList.add('gallery-navOn')
                } else if(rati === 1) {
                    gsap.to(div, {...right, duration: speed })
                    gsap.to(div.querySelector('img'), {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))', duration:Math.max(0.3, speed) })
                    gsap.to(div.querySelector('img').dataset, {dist:25, dur:1600, duration: speed })
                } else {
                    gsap.to(div, {...other, duration: speed })
                    gsap.to(div.querySelector('img'), {'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))', duration:Math.max(0.3, speed) })
                    gsap.to(div.querySelector('img').dataset, {dist:0, dur:1600, duration: speed })
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


function generateScreen(parent, col) {

    let div = document.createElement('div')
    div.classList.add('screen','selOff','float','vel','dur800','dist50','pushable')
    let text = document.createElement('span')
    text.innerText = parent.innerText
    parent.innerText = ''

    col = col || props.primaryCol
    gsap.set(text, {
        position:'relative',
        textShadow: `0 0 4px rgba(${col}, 0.6)`

    })

    parent.appendChild(div)
    parent.appendChild(text)

    let leftOffset = randomChance(70) ? 1 * props.rem * Math.random() : 3 * props.rem * Math.random();
    gsap.set(div, {
        width:`clamp(${6 + 1 * Math.random()}rem, 10vw, ${10 + 3 * Math.random()}rem)`,
        marginBottom: 'clamp(1rem, 4vw, 2.5rem)',
        left: -2 * props.rem + leftOffset,
        bottom:2.5 * props.rem * Math.random(),
        aspectRatio: 1.8 + 0.3 * Math.random() 
    })
    
}

/*          Resize listener to kill transitions         */
let resizeTimer;
function onResizeStart() {
    document.body.classList.add('no-transition')
    if(typeof customDuringResizer === 'function') customDuringResizer()
}

function onResizeEnd() {
    if(typeof customResizer === 'function') customResizer()
    document.body.classList.remove('no-transition')
}

if(!props.mobile) {
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer)
        if (!resizeTimer) {
            onResizeStart()
        }
        resizeTimer = setTimeout(function() {
            resizeTimer = null
            onResizeEnd()
        }, 200)
    })
}











/*

PRE LOAD INTERESTING CODE




function preloadResources() {
    // Preload HTML page
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'your-secondary-page.html', true);
    xhr.send();

    // Preload images
    var images = ['image1.jpg', 'image2.png', 'image3.gif']; // Add your image URLs
    for (var i = 0; i < images.length; i++) {
        var img = new Image();
        img.src = images[i];
    }
}

// Call the function to preload resources
preloadResources();

// Add an event listener to trigger the animation and open the page
document.getElementById('yourButtonId').addEventListener('click', function() {
    // Your animation logic here

    // After the animation, open the secondary page
    window.open('your-secondary-page.html', '_blank');
});







<?php
$directory = 'path/to/your/images'; // Replace with the actual path

// Get all files in the directory
$files = scandir($directory);

// Filter out non-image files (adjust as needed)
$imageFiles = array_filter($files, function($file) {
    return preg_match('/\.(jpg|jpeg|png|gif)$/i', $file);
});

// Create an array of image URLs
$imageUrls = array_map(function($file) use ($directory) {
    return $directory . '/' . $file;
}, $imageFiles);

// Output as JSON
header('Content-Type: application/json');
echo json_encode($imageUrls);
?>




function preloadImages() {
    // Make an AJAX request to get image URLs
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'get_images.php', true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            // Parse the JSON response
            var imageUrls = JSON.parse(xhr.responseText);

            // Preload images
            for (var i = 0; i < imageUrls.length; i++) {
                var img = new Image();
                img.src = imageUrls[i];
            }
        }
    };

    xhr.send();
}

// Call the function to preload images
preloadImages();


*/