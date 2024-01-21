/**
 * 
 * 
 *          SETUP
 * 
 * 
 */

// clean up JS further
// dynamically generate everything that should be on a page (this includes nav)
// group everything by section regardless of it's type unless universal
// group all event listeners together
// grain control setup - off / on
// detech if framefrate has dropped and turn off qualities indicate where to turn it back on 
// universal request animation frame with page specific.
// Rename "custom" to "page" +++
//


// determine CSS per page
// UI altering thang set-up

/*          MAJOR EDITABLE VARIABLES           */

// key contact info
const contactInfo = {
    name: 'Jesse Whitmore',
    tel: '+61 421 907 903',
    email: 'j.whitmore.mail@gmail.com',
    linkdin: 'https://www.linkedin.com/in/jesse-whitmore-998a18133/',
    CV: './contact/cv.pdf'
}

// how those values will be treated
const contactTreatment = {
    name: {type: 'text' },
    tel: {type: 'link', hover:'react-copy', func: ()=> {window.open(`tel:${contactInfo.tel.replace(' ','')}`,'_self')} },
    email: {type: 'link', hover:'react-copy', func: ()=> sendEmail() },
    linkdin: {type: 'link', hover:'react-open', text: 'linkdIn',  trans:true, },
    CV: {type: 'link', hover:'react-open', text: 'CV' }
}

// any property I want universal
const props = { 
    rem: 16,
    city: 'Sydney',
    country: 'Australia',
    GMT: 11
}



/*          GLOBALS           */

// textures for screens
const si = [ 
    'red',
    'lightGreen',
    'blue',
    'orange',
    'pink'
]


// how stuff floats
const bobControls = {
    xMax: 4,
    yMax: 10,
    movement: 1,
    dur: 5
}
// dom ele array
const float = []

// elements that will be pushed by mouse pointer - only valid on desktop
const push = {
    amount: 40,
    from: 400,
    deadzone: 50,
    dur: 3
}
// dom ele array
const pushable = []

// Initialize variables to store current and target positions
const scrollVals = {
    lastScrollTop: window.scrollY || window.pageYOffset,
    lastTimestamp: Date.now(),
    lastScroll:0,
    scrollVelocity: 0,
    refreshing: false
}

/*          ORPHANED VARIABLES           */

// about section timeline
let timeline = gsap.timeline({paused: true})

// array of elements to animate if on screen
let viewportVel = [];
let siLock = false;

// expo decay 
const targetValue = 1,   // Target value to approach
decayRate = 0.9;   // Decay rate, adjust to control the rate of decrease

/*          REDUNDANT CODE          */
let clickables = []
function scrollObservation() {}










/**
 * 
 * 
 *          UNIVERSAL HELPER FUNCTIONS
 * 
 * 
 */

Number.prototype.pad = function(size) { // pad number with 0s
    let num = this.toString()
    while (num.length < size) num = "0" + num
    return num
}

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max)
}

function qs(ele) { // query selector
    return document.querySelector(ele)
}

function qsa(ele) { // query selector all
    return document.querySelectorAll(ele)
}

function randomChance(chancePercentage) { // set chance probability
    const validPercentage = Math.max(0, Math.min(chancePercentage, 100))
    const randomValue = Math.random() * 100
    const result = randomValue < validPercentage
    return result
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

// quickly generate 
function wrapContent(outer, name, element) {
    element = element || 'div'
    let inner = document.createElement(element)
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

function toClipboard(val) {
    // Copy the text inside the text field
    navigator.clipboard.writeText(val);
}

// add the react class to everything
function recursiveChildLoop(element, matchingClass) {
    Array.from(element.children).forEach(child => {
        child.classList.add(matchingClass)
        recursiveChildLoop(child, matchingClass);
    });
}













/**
 * 
 * 
 *          ORPHANED FUNCTIONS
 * 
 * 
 */

// used in scroll
function exponentialDecayWithMax(currentValue, targetValue, decayRate) { // bigger numbers at beggining but not end
    // If currentValue is above targetValue, set it to targetValue
    if (currentValue > targetValue) { return targetValue;
    } else if (currentValue < -targetValue) { return -targetValue; }
    // Calculate the decayed value
    return currentValue + (0 - currentValue) * Math.exp(-decayRate);
}









/**
 * 
 * 
 *          ONLOAD ELEMENTS
 * 
 * 
 */

// get CSS root styles and add to props for use
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

// determine if the user navigated here from within the site for wipe effect
const internalRedirect = document.referrer.includes(window.location.origin)

// determine mobile or desktop for feature used
window.mobileAndTabletCheck = function() { // is mobile or tablet
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
props.mobile = window.mobileAndTabletCheck()


/*      element setup on launch         */

// vars for later use
let mouseEle

// element attachments
const wrapper = qs('#wrapper'), 
blocker = qs('#blocker')

// elements creation
const menuEle = document.createElement('div'), 
techMenuEle = document.createElement('div')

// default setting
techMenuEle.classList.add('techMenu')
techMenuEle.innerHTML = '<span id = "quality" class = "react-play">X</span>'

if(props.mobile) {

    // set-up mobile menu
    menuEle.classList.add('vel','float','dur1000','dist20')
    menuEle.id = 'menu'
    menuEle.innerText = "|||"
    wrapper.appendChild(menuEle)
    qs('#nav').appendChild(techMenuEle)
    
    
} else {
    // set-up mouse
    mouseEle = document.createElement('div')
    mouseEle.id = 'mousePointer'
    wrapper.insertAdjacentElement('afterend', mouseEle);

    // set-up desktop menu
    menuEle.id = 'menuDesktop'
    menuEle.innerHTML = '<div class = "menuScreen screen vel float dur1000 dist20"></div><span  class = "react-play">HOME</span><span  class = "react-play">ABOUT</span><span  class = "react-play">PROJECTS</span><span  class = "react-play">CONTACT</span>'
    wrapper.appendChild(menuEle)
    wrapper.appendChild(techMenuEle)    
}

qsa(`[class*="react"]`).forEach(ele => {
    const classList = Array.from(ele.classList);
    const matchingClass = classList.find(className => className.includes('react'));
    recursiveChildLoop(ele, matchingClass)
})

function animateScreen() {
    /*          Screen related           */
    let siG = 0, 
    autoChangeTimeout = null,
    firstAuto = 1000


    // -------------

    // randomly flicker to new screen texture
    function autoChange() {
        autoChangeTimeout = setTimeout( () => {
            changeScreen(Math.floor(qsa('.screen').length*Math.random()),'autoed');
            firstAuto = 15000;
            autoChange();
        },firstAuto + 5000*Math.random());
    } 


    // -------------

    // change screen semi-randomly flowing out from clicked screen
    function changeScreen(i) {
        if(siLock) return;
        siLock = true;
        if(push.target !== undefined) if(push.target.classList.contains('screenTexture')) qs('#mousePointer').classList = null
        clearTimeout(autoChangeTimeout)
        autoChange()
        siG++;
    
        qsa('.screen').forEach((ele, index) => {
    
            let siN = 0 || ele.dataset.si,
            intN = Math.floor(4*exponentialDecayWithMax(Math.random() * 100, 100, decayRate)/100),
            delay = Math.abs(index - i) * 200 * Math.random();
    
            if(index !== i) {

                for(let n = 0; n <= intN; n++) {
                    setTimeout(() => {
                        ele.querySelector('.screenTexture').style.background = si[((parseInt(siN)+siG) % si.length) - (n % 2)]
                    }, delay);
                    delay += 100 + 200 * Math.random()
                }
            } else {

                ele.querySelector('.screenTexture').style.background = si[(parseInt(siN)+siG) % si.length]
            }
            setTimeout(() => {
                ele.querySelector('.screenTexture').style.background = si[(parseInt(siN)+siG) % si.length]
            }, 1000);
        })
        setTimeout(() => { siLock = false; if(push.target !== undefined)  if(push.target.classList.contains('screenTexture')) qs('#mousePointer').classList = 'react-play'; },1500)
    }

    autoChange()

    // add event listerner to all screen to changeScreen on click
    qsa('.screen').forEach((ele, index) => {
        ele.addEventListener('click', () => changeScreen(index));
    })
}


/*          Resize listener to kill transitions         */
let resizeTimer;
function onResizeStart() {
    document.body.classList.add('no-transition')
    if(typeof uDuringResizer === 'function') uDuringResizer()
}

function onResizeEnd() {
    if(typeof uResizer === 'function') uResizer()
    document.body.classList.remove('no-transition')
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

    if(typeof uResizer === 'function') uResizer()
    
    document.querySelector('#blocker').style.background = "none"
    if(internalRedirect) (props.mobile) ? linkClick.fromClicked('r') : linkClick.fromClicked('t')

}















/**
 * 
 * 
 *          GRAIN SETUP
 * 
 * 
 */

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


function grainTexture(chance) {
    chance = chance || 90
    let state = randomChance(chance)    

    gsap.to(lightGrain, {
        autoAlpha: (state) ? Math.max(0.05,0.15 * Math.random()) : Math.max(0.15,0.3 * Math.random()) ,
        duration:0.6
    })

    if(props.performanceHandling.heavyGrain) {    
        gsap.to(heavyGrain, {
            scaleY: 0.2 * Math.random(),
            autoAlpha: (state) ? 0 : Math.max(0.1,0.2 * Math.random()),
            duration:0.3
        })
    }
  
    if(!state && props.performanceHandling.heavyGrain) gsap.to(heavyGrain, {
        y: (heavyGrain.offsetHeight) * Math.random() - heavyGrain.offsetHeight/2,
        duration:6
    })        
}








/**
 * 
 * 
 *          DATE TIME
 * 
 * 
 */

function dateTimeContact() {

    let lastSecond = new Date().getSeconds()-1

    // -------------

    function setDateWithOffset(gmtOffset) {
        // Get the current local time
        const localDate = new Date();
        const timezoneDiff = localDate.getTimezoneOffset() / 60
    
        // Calculate the UTC time based on the GMT offset
        const utcTime = localDate.getTime()
    
        // Apply the desired GMT offset
        const targetTime = utcTime + ((gmtOffset + timezoneDiff) * 3600000); // 1 hour = 3600000 milliseconds
    
        // Create a new Date object with the adjusted time
        targetDate = new Date(targetTime)
        lastSecond = targetDate.getSeconds()
        targetDate = `${targetDate.getHours().pad(2)}:${targetDate.getMinutes().pad(2)}:${targetDate.getSeconds().pad(2)}${(Math.sign(gmtOffset) === 1) ? '+' : ''}${gmtOffset}GMT`
        
        return targetDate
    }

    // -------------

    setInterval(()=> {
        if(new Date().getSeconds() !== lastSecond) qs('#localTime').innerText = setDateWithOffset(props.GMT);
    },200)    
    qs('#location').innerText = props.city
    qs('#local').style.opacity = 1

}








/**
 * 
 * 
 *          UNIVERSAL CANVAS' SETUP
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











/**
 * 
 * 
 *          ANIMATION HANDLE
 * 
 * 
 */

function floatAnimation(mt) {
    if(mt.onScreen) {
        mt.x += bobControls.movement*mt.movementDirectionX
        mt.y += bobControls.movement*mt.movementDirectionY

        if(Math.abs(mt.x) > bobControls.xMax) mt.movementDirectionX *= -1
        if(Math.abs(mt.y) > bobControls.yMax) mt.movementDirectionY *= -1
        gsap.to(mt.target, {x: mt.x, y: mt.y, duration: bobControls.dur})
    }
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
 *          SCROLL RELATED
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


function scrollVelocity(PN, rf) {
    if (typeof uScroll === 'function') uScroll()

    if(!props.performanceHandling.velocity) return

    const SY = window.scrollY 
    const deltaY = SY - (rf.lastSY || 0) // or used for if rf.lastSY yet to be declared
     // store largest value to remove scroll sub-pixel jitter
    if(Math.abs(rf.deltaY) < Math.abs(deltaY)) rf.deltaY = deltaY
    rf.lastSY = SY

    // run every 100ms to only use largest value and limit gsap.to requests
    if(every(100,PN,'velocityCount')) { // 100 could be set to a variable as performance control

        // animate
        let result = exponentialDecayWithMax(rf.deltaY, targetValue, decayRate);
        result = result.toFixed(2);
        handleVel(result)

        // set false if there no movement in 100ms
        if(rf.deltaY === 0) props.scrolling = false
        rf.deltaY = 0 // reset for next tests

    }
    // unique page scroll function
}


function jumpTo(pos, behavior) {
    let posEle = (pos.toLowerCase() === 'home') ? qs('#header') : qs(`#${pos.toLowerCase()}`)
    if(posEle === null) {
        pos = pos.toLowerCase()
        switch(pos) {
            case 'about':
                linkClick.click((props.mobile) ? 'r' : 't', `${window.location.origin}/portfolio/about.html`)
            break;
            default:
                linkClick.click((props.mobile) ? 'r' : 't', `${window.location.origin}/portfolio/index.html?msg=${pos}`)
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










/**
 * 
 * 
 *          UNIVERSAL INTERACTS
 * 
 * 
 */

// mouse follower distance
function calculateNewPosition(mouseX, mouseY, lastX, lastY) {
    const distance = 150;
  
    // Calculate angle from the current position to the mouse position
    const angle = Math.atan2(mouseY - lastY, mouseX - lastX);
  
    // Calculate new x and y positions
    const newX = mouseX - distance * Math.cos(angle);
    const newY = mouseY - distance * Math.sin(angle);
  
    // Update lastX and lastY for the next calculation
    props.mouse.offX = newX;
    props.mouse.offY = newY;
  
    return { x: newX, y: newY };
}



// calculate pushing element
function pushCalc(ele, x, y, pushFrom, amount, dz) {

    // Calculate the distance from the mouse to the target element
    const rect = ele.getBoundingClientRect();

    const ex = rect.left + rect.width / 2;
    const ey = rect.top + rect.height / 2;
    
    const deltaX = x - ex;
    const deltaY = y - ey;

    // Calculate the distance between the mouse and the element
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    if(distance <= dz) {
        return { x:0, y:0 }  
    }

    // Calculate the scaling factor based on the distance
    const scalingFactor = 1 - Math.min(distance / pushFrom, 1);

    // Calculate the capped distance
    const cappedDistance = scalingFactor * amount;

    // Calculate the angle between the mouse and the element
    const angle = Math.atan2(deltaY, deltaX);

    // Calculate the new position with the capped distance
    const newX = ex - cappedDistance * Math.cos(angle);
    const newY = ey - cappedDistance * Math.sin(angle);
  
    // Update the element's position
    return { x: (newX-ex), y: (newY-ey) }    
}


function mouse(PN, rf) {
    let pm = props.mouse

    // forever update the mouse
    gsap.to(mouseEle, {x: pm.offX, y: pm.offY, duration: 0.1, ease: "power2.inOut" })

    // exit if no mouse
    if(!pm.valid ) return;

    // push elements
    if(every(500, PN, 'push') && props.performanceHandling.pushable) {
        pushable.forEach(val => {
            // get the x y for the element
            let xy = pushCalc(val.target, pm.ev.clientX, pm.ev.clientY, push.from, push.amount, push.deadzone)
            // animate the push
            gsap.to(val.target, { ...xy, duration: push.dur})
        })
    }

    // follow mouse at distance
    if(every(100, PN, 'mouse')) calculateNewPosition(pm.x, pm.y, pm.offX, pm.offY)

    // interactable over mousePointer
    let classList = pm.target.classList
    let arrayClassList = Array.from(classList)
    let interactable = arrayClassList.some(className => className.includes('react'))

    // mousePointer indicator change
    if(interactable && !(classList.contains('screenTexture') && siLock)) {
        const matchingClass = arrayClassList.find(className => className.includes('react'))
        mouseEle.classList = matchingClass
    } else {
        mouseEle.classList = null
    }

    if(props.performanceHandling.highlightEffect) {

        // do highlight on elements    
        let hlh = qsa('.highlightHover')
        if(interactable) {
            // check if this has been run before
            if(pm.lastTarget !== pm.target) {
                hlh.forEach((ele) => {
                    ele.classList.remove('highlightHover')
                })

                // do a check over contact bar
                if(pm.target.parentNode.classList.contains('buttonCells')) { 
                    qs('#buttonText').classList.add('highlightHover')
                    classList.add('highlightHover')
                } else if(pm.target.parentNode.id === "buttonText") {
                    pm.target.parentNode.classList.add('highlightHover')
                    if(!classList.contains('defaultState')) {
                        qs(`#${arrayClassList.find(className => className !== 'highlightHover')}`).classList.add('highlightHover')
                    }
                } else {
                    classList.add('highlightHover')
                }
            }
        // clear all hlh lights if no interactable
        } else if(hlh.length > 0) {
            hlh.forEach((ele) => {
                ele.classList.remove('highlightHover')
            })
        }

    }

    // handle contact click as a hover when on pc
    qsa('.buttonCells div').forEach((ele) => {
        if(ele === pm.target) {
            changeContact(pm.target, 69, Array.from(pm.target.parentNode.children))
        }
    })    


    // check if span and menuDesktop id then apply the movement 
    if(pm.target.nodeName === 'SPAN') {
        if(pm.target.parentElement.id === 'menuDesktop') {

            clearTimeout(props.menuHoverTimeout)
            props.menuHoverTimeout = setTimeout(()=>{
                gsap.to('.menuScreen', {
                    scaleY: 0,
                    ease: "back.in(1.7)",
                    duration: 0.2
                })
                props.menuHover = null
            },1500)

            if(props.menuHover !== pm.target.innerText) {
                props.menuHover = pm.target.innerText

                const bound = pm.target.getBoundingClientRect()
                gsap.to('.menuScreen', {
                    scaleY: 1,
                    ease: "back.out(1.7)",
                    duration: 0.2
                })
                gsap.to('.menuScreen', {
                    left: bound.x,
                    width: bound.width,
                    ease: "back.out(1.4)"
                })
            }
        }
    }    

    // unique mouse 
    if(typeof uMouse === 'function') uMouse()

    // set-up for next loop
    pm.lastTarget = pm.target
    pm.valid = false;
}









/**
 * 
 * 
 *          PERFORMANCE HANDLING
 * 
 * 
 */

props.performanceHandling = {
    dropAmount: 0,

    heavyGrain: true,
    grain: true,
    highlightEffect: true,
    pushable: true,
    projectParallax: true,
    staticCanvas: true,
    velocity: true
}
function performanceHandling(controls) {
    switch(controls.dropAmount) {
        case 20:
            console.log('downgrading: removing heavy grain')
            controls.heavyGrain = false
            heavyGrain.style.display = 'none'
        break;
        case 40:
            console.log('downgrading: removing light grain')
            controls.grain = false;
            lightGrain.style.display = 'none'
        break;
        case 60:
            console.log('downgrading: removing highlight hover')
            controls.highlightEffect = false
        break;
        case 80:
            console.log('downgrading: removing pushable')
            controls.pushable = false
        break;
        case 100:
            console.log('downgrading: removing parallax')
            controls.projectParallax = false
            for (const [key, obj] of Object.entries(props.projectIMG)) {
                obj.im.style.transform = `translateY(0px)`
            }
        break;
        case 120:
            console.log('downgrading: removing static canvas')
            controls.staticCanvas = false;
            staticHorizontal.clear()
        break
        case 140:
            console.log('downgrading: removing velocity')
            controls.velocity = false;
        break;
    }
}











/**
 * 
 * 
 *          EVENTS & UNIVERSAL LOOPS
 * 
 * 
 */

if(props.mobile) {
    // mobile menu
    menuEle.addEventListener('click', () => {
        menuToggle()
    }); 

    // menu open
    function menuToggle() {
        if(!scrollVals.autoScrolling) {
            document.body.classList.toggle('menuOpen')
            qs('#nav').classList.toggle('menuOpen')
            qs('#navCanvas').classList.toggle('menuOpen')

            menuEle.classList.add('highlightHover')
            setTimeout(()=>{
                menuEle.classList.remove('highlightHover')
            },300)

            menuWipe.init()
        }
    }

} else {
    // resize listener on desktop
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

    // desktop menu
    menuEle.addEventListener('click', (ev) => {
        if(ev.target.id !== 'menuDesktop') jumpTo(ev.target.innerText)
    })

    

    // mouse based events - desktop
    props.mouse = {
        x: 0,
        y: 0,
        offX: 0,
        offY: 0
    }
    document.addEventListener('mousemove', event => {
        props.mouse = {
            ...props.mouse,
            ev: event,
            x: event.clientX,
            y: event.clientY + window.scrollY,
            target: event.target,
            valid: true
        }
    })    
}


// handle scroll animations
document.addEventListener('scroll', event => {
    props.scrolling = true;
}); 


// setup tech related
techMenuEle.addEventListener('click', (ev) => {
    if(ev.target !== techMenuEle) console.log('here')
})



// simplify if statements in requestFrame function to only run every x milliseconds with ease
function every(milli, PN, label) {
    label = label+milli || `milli${milli}`
    if(props.requestFrame[label] === undefined) props.requestFrame[label] = 0
    if((PN - props.requestFrame.launchTime) / milli - props.requestFrame[label] > 1) {
        props.requestFrame[label] = Math.floor((PN - props.requestFrame.launchTime) / milli)
        return true;
    } else {
        return false;
    }
}

// launch time
props.requestFrame = {}
props.requestFrame.launchTime = performance.now()

function drawFrame() {
    const F1 = performance.now()
    const rf = props.requestFrame
    const ph = props.performanceHandling
    // ------------------------------------------------------

    if(!props.mobile) mouse(F1, rf)
    
    // set to true when scrolling
    if(props.scrolling) scrollVelocity(F1, rf)

    // run ever 300 milliseconds
    if(every(300,F1) && ph.grain) grainTexture()

    // run float animation
    if(every(500,F1) && !props.scrolling) float.forEach(mt => floatAnimation(mt))

    if(typeof uDrawFrame === 'function') uDrawFrame(F1, rf)


    // ------------------------------------------------------
    const F2 = performance.now()
    const mil = Math.round(F2 - F1) || 1
    const frames = Math.round(1/(mil/1000))
    // if frames below 100 log them
    if(frames < 100) {
        console.log('frame rate: ', frames)
        ph.dropAmount++
        performanceHandling(props.performanceHandling)
    }

    requestAnimationFrame(drawFrame)
} drawFrame()



















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
















    // const scrollY = window.scrollY;
    // // Calculate the velocity of scroll
    // let deltaY = scrollY - zlastScrollY
    // if (Math.abs(deltaY) < 3) deltaY = 0;
    // zvelocity = 0.9 * (deltaY || props.deltaY); // Apply a decay factor
    // props.deltaY = deltaY
    // // Update last scroll position
    // zlastScrollY = scrollY
    // console.log('Velocity:', zvelocity, '| delta', deltaY)
    


    // // If the velocity is not close to zero, continue the animation
    // if (Math.abs(zvelocity) > 0.1) {
    //     // Your custom logic using velocity
    // } else {
    // } 
    
    //   // Calculate the velocity of scroll
    //   const scrollY = window.scrollY;
    //   const deltaY = scrollY - lastScrollY;
    
    //   // Apply a decay factor with weight based on deltaY
    //   if (Math.abs(deltaY) < Math.abs(velocity)) {
    //     // Apply stronger decay if deltaY is less than velocity
    //     velocity = 0.8 * velocity;
    //   } else {
    //     // Apply regular decay if deltaY is greater than velocity
    //     velocity = 0.9 * deltaY;
    //   }
    
    //   // Set velocity to zero if it's below the threshold
    //   if (Math.abs(velocity) < minVelocityThreshold) {
    //     velocity = 0;
    //   }
    
    //   // Your custom logic using velocity
    //   console.log('Velocity:', velocity);
    
    //   // Update last scroll position
    //   lastScrollY = scrollY;



*/
