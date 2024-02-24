/**
 * 
 * 
 *          SETUP
 * 
 * 
 */

// add icons to tech menu - x
// change from CSS hover to mouseOver for main menu - x
// Dynamic gal for example of work at PXYZ - x
// flickering icon in tab - x
// CV open tab rather than replace -x
// get to bottom of flicker issue by youtube iframes  - x
// random chance of flicker for buttons - x
// turn flicker into a callable function - x
// Gallery padding and sizing fix - 
// about animation revision - x
// address sweep issues caused by phones
// multi-browser analysis
// dist calc on mobile vs PC for projects - x
// trigger animation on point for BHT - x
// 



/*          MAJOR EDITABLE VARIABLES           */

// key contact info
const contactInfo = {
    name: 'Jesse Whitmore',
    tel: '+61 421 907 903',
    email: 'j.whitmore.mail@gmail.com',
    linkdin: 'https://www.linkedin.com/in/jesse-whitmore-998a18133/',
    CV: '/CV-Jesse-Whitmore.pdf'
}

// how those values will be treated
const contactTreatment = {
    name: {type: 'text' },
    tel: {type: 'link', hover:'react-copy', func: ()=> {window.open(`tel:${contactInfo.tel.replace(' ','')}`,'_self')} },
    email: {type: 'link', hover:'react-copy', func: ()=> sendEmail() },
    linkdin: {type: 'link', hover:'react-open', text: 'linkdIn',  trans:true, },
    CV: {type: 'link', hover:'react-open', text: 'CV', func: ()=> {window.open(contactInfo.CV,'_blank')} }
}

// any property I want universal
const props = { 
    rem: 16,
    loaded: false,
    city: 'Sydney',
    country: 'Australia',
    GMT: 11
}

// projects manifest -- used to geneterate projects on index only currently
const projectManifest = [
    {
        title: 'New Format: Velocity',
        desc: 'PROJECT - CODE - UI/UX - DESIGN' 
    },     
    {
        title: 'DOG System',
        desc: 'UI/UX - DESIGN - PROJECT' 
    }, 
    {
        title: '2021 Roadmap',
        desc: 'PROJECT - LEADERSHIP' 
    }, 
    {
        title: 'Studio Sliders',
        desc: 'PROJECT - UI/UX' 
    },    
    {
        title: 'Self-Serve Templates',
        desc: 'UI/UX - DESIGN' 
    }, 
    {
        title: 'Client Work Playground',
        desc: 'CODE - DESIGN' 
    },
    {
        title: 'Amazon Black Friday',
        desc: 'PROJECT - CODE' 
    },
    {
        title: 'Uber',
        desc: 'PROJECT - CODE' 
    },
    {
        title: 'Heineken',
        desc: 'PROJECT' 
    },    
    {
        title: 'Kong Skull Island',
        desc: 'PROJECT' 
    },    
    {
        title: 'Design for Fun',
        desc: 'DESIGN' 
    },    
]

/*          GLOBALS           */

// textures for screens
const si = [ 
    'url(/assets/screens/yellow.jpg)', // yellow - '#fee440',
    'url(/assets/screens/cyan.jpg)', // cyan - '#70e4ef',
    'url(/assets/screens/green.jpg)', // green - '#61f849',
    'url(/assets/screens/magenta.jpg)', // magenta - '#ff36ab',
    'url(/assets/screens/red.jpg)', // red - '#fb0102',
    'url(/assets/screens/blue.jpg)', // blue - '#0301fc',   
]

const siV = [
    '/assets/screens/blue.mp4',
    '/assets/screens/cyan.mp4',
    '/assets/screens/black.mp4',
    '/assets/screens/blue.mp4',
    '/assets/screens/cyan.mp4',
    '/assets/screens/black.mp4',
]

const siC = [ 
    '#fee440',
    '#70e4ef',
    '#61f849',
    '#ff36ab',
    '#fb0102',
    '#0301fc',   
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

// bht
const bht = {
    visible: null,
    scenes:{},
    trigger:{}
}

let screens = []

/*          ORPHANED VARIABLES           */

// about section timeline
let timeline = gsap.timeline({paused: true})

// array of elements to animate if on screen
let viewportVel = [];
let siLock = false;

/*          REDUNDANT CODE          */









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
function wrapContent(outer, name, element, id) {
    element = element || 'div'
    let inner = document.createElement(element)
    if(name !== undefined) inner.classList.add(name)
    if(id !== undefined) inner.id = id
    while (outer.firstChild) {
        inner.appendChild(outer.firstChild);
    }
    outer.appendChild(inner)
}

// default observer construct
function observerConstructor(fc, ele, opt) {
    // Create an Intersection Observer with the callback function and options
    const observer = new IntersectionObserver(fc, opt);
      
    // Start observing each element
    qsa(ele).forEach((element,i) => {
      observer.observe(element);
    });        
}

function menuBuilder(content, id, parent, react, state) {
    react = react || undefined
    state = state || undefined

    let ele = document.createElement('span')
    ele.id = id
    ele.innerText = content
    let classList = ele.classList
    const matchingChild = wrapper.querySelector(`#${id.split('-').pop()}`)
    if(react) {
        classList.add(react)
    } else {
        if(matchingChild) classList.add('react-play'); else classList.add('react-open')
    }
    if(state) { 
        ele.setAttribute('data-states',state)
        classList.add('state0')
    }
    parent.appendChild(ele)
}


function sendEmail() {
    let subject = `let's work together!`;
    let emailBody = `I was on your portfolio and I'd just like to say...`;
    document.location = "mailto:"+contactInfo.email+"?subject="+subject+"&body="+emailBody;
}

function toClipboard(val) {
    console.log(val)
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

function batchSet(ele, type, obj) {
    const entries = Object.entries(obj);

    if(type == "style") {
        entries.forEach(val => {
            ele[type][val[0]] = val[1]
        })
    } else {
        entries.forEach(val => {
            ele[type](val[0],val[1])
        })
    }
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

let techMenuContent = [
    { content: '', id: 'quality-physics', react: 'react-play', state: 3 }, // Physics 1. pushable, 2. proejct para, 3. velocity
    { content: '', id: 'quality-canvas', react: 'react-play', state: 1 }, // Canvas 1. turn off canvas
    { content: '', id: 'quality-post', react: 'react-play', state: 3 }, // post processing 1. heavy off, 2. light off. 3. highlight effects off.

]
techMenuContent.forEach(v =>  menuBuilder(v.content, v.id, techMenuEle, v.react, v.state))

techMenuEle.querySelectorAll('span').forEach(v=> {
    const ele = document.createElement('div')
    v.appendChild(ele)
})


let menuSize = 5; // Adjust this variable as needed
let menuSha = `-${0.0625 / menuSize}em -${0.0625 / menuSize}em 0 rgba(255,255,255, 0.2),
              ${0.0625 / menuSize}em -${0.0625 / menuSize}em 0 rgba(255,255,255, 0.3),
              -${0.0625 / menuSize}em ${0.0625 / menuSize}em 0 rgba(255,255,255, 0.2),
              ${0.0625 / menuSize}em ${0.0625 / menuSize}em 0 rgba(255,255,255, 0.3),
              0 -${0.125 / menuSize}em ${1.2 / menuSize}em,
              0 0 ${0.125 / menuSize}em,
              0 0 ${0.3125 / menuSize}em rgba(255,126,0,0.5),
              0 0 ${5.9375 / menuSize}em rgba(255, 68, 68,0.6),
              0 0 ${0.125 / menuSize}em rgba(255,126,0,0.5),
              0 ${0.125 / menuSize}em ${0.1875 / menuSize}em rgba(0,0,0,0.7)`;    

if(props.mobile) {

    // set-up mobile menu
    menuEle.style.boxShadow = menuSha

    menuEle.classList.add('vel','dur1000','dist20')
    menuEle.id = 'menu'
    menuEle.innerText = "|||"
    wrapper.appendChild(menuEle)
    qs('#nav').appendChild(techMenuEle)
    
    
} else {
    // set-up mouse
    mouseEle = document.createElement('div')
    mouseEle.id = 'mousePointer'

    mouseEleInner = document.createElement('div')
    mouseEle.appendChild(mouseEleInner)

    wrapper.insertAdjacentElement('afterend', mouseEle);

    // set-up desktop menu
    menuEle.id = 'menuDesktop'

    let hoverScreen = document.createElement('div')
    hoverScreen.classList.add('menuScreen','vel','dur1000','dist20')
    hoverScreen.style.boxShadow = menuSha
    menuEle.appendChild(hoverScreen)
    let MenuContent = [
        { content: 'HOME', id: 'menu-header' },
        { content: 'ABOUT', id: 'menu-about' },
        { content: 'PROJECTS', id: 'menu-projects' },
        { content: 'CONTACT', id: 'menu-contact' }
    ]
    MenuContent.forEach(v =>  menuBuilder(v.content, v.id, menuEle))

    wrapper.appendChild(menuEle)
    wrapper.appendChild(techMenuEle)    
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
 *          UNIVERSAL CANVAS' SETUP
 * 
 * 
 */

const linkClick = new blockCanvas()
linkClick.setup('.linkClickCanvas','rgba(40,40,40,1)')

let wipeDir = []

linkClick.click = function(dir,link, postMessage, dur) {
    if(linkClick.run !== undefined) return;
    linkClick.run = true;
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
            setTimeout(() => {
                gsap.set('.linkClick', {
                    scaleX: 0,
                    scaleY: 0
                })
            },500) 
        }
    })
}

linkClick.centerSweep = function(pos, link, dur) {
    let moveVal = { value: pos };
    dur = dur || 0.5;


    gsap.set('.linkClick', {
        top: pos+10,
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
        setTimeout(() => {
            gsap.set('.linkClick', {
                scaleX: 0,
                scaleY: 0
            })
        },500) 
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



// -------------------------------------

const staticHorizontal = new blockCanvas()
staticHorizontal.setup('.staticBlocksH',`rgba(${props.primaryCol
},1)`)
staticHorizontal.postDraw = function(c, ctx) {
    let col = this.colour
    let h = 50
    const grd = ctx.createLinearGradient(0, h, 0, 0);
    let alpha0 = col.split(',')
    alpha0[3] = '0)'
    alpha0.join(',')
    grd.addColorStop(0, alpha0);
    grd.addColorStop(1, col);
    
    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.width, h);
}
staticHorizontal.static()

/**
 * 
 * 
 *          QUICK SETUP
 * 
 * 
 */

function wrapProcessing() {
    /*          attribute set-up            */

    attributeSetup('.vel',['dur','dist'])
    attributeSetup('.screen',['si'])
    attributeSetup('.pushable',['amt'])
    attributeSetup('.para',['dist'])

    // Function to load and inject SVG
    function loadSVG(ele, dir) {
    // Fetch the SVG content

    const url = '/assets/icons/arrow.svg'

    fetch(url)
        .then(response => response.text())
        .then(svgData => {
        // Create a new div element
        const div = document.createElement('div');
        
        // Set the inner HTML of the div to the SVG content
        div.innerHTML = svgData;

        // Get the first child of the div (the SVG element)
        const svgElement = div.firstChild;

        const arrow = ele.innerText.split(dir)
        arrow.splice(1,0,svgData)
        const joined = arrow.join('')
        ele.innerHTML = joined

        // Get the computed style of the element
        const col = window.getComputedStyle(ele).getPropertyValue('color');

        ele.querySelector('polygon').setAttribute('fill',col)

        if(dir =='<') ele.querySelector('svg').style.transform = 'rotate(180deg)'


        })
        .catch(error => console.error('Error loading SVG:', error));
    }


    // Call the loadSVG function with the URL and target element
    qsa('.button').forEach(e => {
        if(e.innerText.indexOf('>') > -1) loadSVG(e, '>')
        if(e.innerText.indexOf('<') > -1) loadSVG(e, '<')
    })


    /*          screen texture allocation and sub div creation           */
    qsa('.screen').forEach(v => processScreens(v))

    // generate the screens
    if(qsa('.screen').length > 0) animateScreen()


    /*          populate float           */    

    qsa('.float').forEach((ele) => {
       wrapContent(ele, 'floated')
        let tempObj = {
            target: ele.querySelector('.floated'),
            movementDirectionX: (Math.random() < 0.5) ? -1 : 1,
            movementDirectionY: (Math.random() < 0.5) ? -1 : 1,
            x: Math.round(Math.random()*bobControls.xMax*2)-bobControls.xMax,
            y: Math.round(Math.random()*bobControls.yMax*2)-bobControls.yMax,
            onScreen: false
        }
        float.push(tempObj)
    });    



    

    /*          pushable element creation           */

    if(!props.mobile) {
        for(let ele of qsa('.pushable')) {
            wrapContent(ele, 'push')
        }
    }



    // sub-add react to all child elements
    qsa(`[class*="react"]`).forEach(ele => {
        const classList = Array.from(ele.classList);
        const matchingClass = classList.find(className => className.includes('react'));
        recursiveChildLoop(ele, matchingClass)
    })

    // kill draggable for elements
    qsa('img').forEach(ele => ele.setAttribute('draggable', false))

    // if bold text make for bigger spacing
    qsa('.boldText').forEach(v => v.parentElement.classList.add('seperate'))


    // if there is any bht elements allow to animate
    if(qsa('.bht').length > 0) {
        attributeSetup('.bht',['track'])
        qsa('.bht').forEach((v,i) => {
            v.style.height =v.dataset.track+'vh'
            bht.scenes[`scene${i}`] = {
                target: v
            }

    
            function bhtIntersect(e, observer) {
                bht.visible = null
                e.forEach(entry => {
                    if (entry.isIntersecting) {
                        const foundChildKey = 
                        bht.visible = Object.keys(bht.scenes).find(childKey => {
                            const subpropertyValue = bht.scenes[childKey].target;
                            if(subpropertyValue === entry.target) return `scene${childKey}`;
                          });
                    } 
                });

            }

            observerConstructor(bhtIntersect, '.bht', {
                rootMargin:'50% 0% 50% 0%'
            })            
        })

        bht.scrubbing = function() {
            if(bht.visible == null) return;
            const boundingBox = bht.scenes[bht.visible].target.getBoundingClientRect();
            const T = boundingBox.top;
            const H = boundingBox.height;
            const VH = window.innerHeight;
            let percentage = Math.max(0, Math.min(1,(T / (H - VH) * -1)))
            let length = bht.scenes[bht.visible].timeline._tDur
            bht.scenes[bht.visible].timeline.seek(length*percentage)



            Object.keys(bht.scenes[bht.visible].timeline.labels).forEach(key => {
                if(bht.scenes[bht.visible].timeline.labels[key] > length*percentage) {
                    if( !bht.trigger[bht.visible][key].triggered ) {
                        bht.trigger[bht.visible][key].triggered = true
                        bht.trigger[bht.visible][key].run()
                    }
               } else {
                bht.trigger[bht.visible][key].triggered = false;
               }
            })



        }
    }

    jankFlicker()
}


function jankFlicker() {

    let index = -1;
    const link = document.querySelector('link[rel="icon"]')

    if(link.href == null || props.mobile) return;
    function hrefLoop() {
        index++;
        link.href = (index%2 == 0) ? "assets/icons/icon.png" : "assets/icons/icon2.png";
        let flip = (index%2 !== 0) ? 200 : (randomChance(20)) ? Math.random() * 5000 : Math.random() * 600 + 300
        setTimeout(hrefLoop, flip)
    } hrefLoop()


}


/**
 * 
 * 
 *          SCREENS
 * 
 * 
 */

// generate screen on text
function generateScreen(parent, col) {

    let div = document.createElement('div')
    div.classList.add('screen','selOff','float','vel','dur800','dist20','pushable')
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

    let leftOffset = randomChance(70) ? 1 * Math.random() : 2 * Math.random();
    gsap.set(div, {
        width:`clamp(${text.offsetHeight/props.rem + 0.2 * props.rem * Math.random()}rem, 10vw, ${text.offsetHeight*1.5/props.rem + 0.4 * props.rem * Math.random()}rem)`,
        bottom: `${0.2 + 0.4 * Math.random()}em`,
        left: `${-1.2 + leftOffset}em`,
        aspectRatio: 1.8 + 0.3 * Math.random() 
    })
}

// handle flicker and dips for screens
function screenLoop(obj) {
    let op = Math.random()
    let dur = 0.2 + Math.random()

    gsap.to(obj[1], {
        opacity: 0.15 + (0.1 - op * 0.1),
        duration: dur, 
    })

    gsap.to(obj[0], {
        opacity: op * 0.35, 
        onCompleteParams: [obj],
        duration: dur, 
        onComplete: screenLoop
    })


}

// process screen and craete subelements
function processScreens(ele) {
    let siN = ele.dataset.si || 0;

    wrapContent(ele, 'generatedScreen')
    generatedScreen = ele.querySelector('.generatedScreen')

    wrapContent(generatedScreen, 'screenTexture')
    screenTexture = ele.querySelector('.screenTexture')
    screenTexture.style.overflow =  'hidden'

    let fallbackELE = document.createElement('div')
    batchSet(fallbackELE, 'style', {
        background: (randomChance(50)) ? 'url(/assets/screens/bars.gif)' :  'url(/assets/screens/static.gif)',
        backgroundSize: 'cover'
    })
    
    // create the RGB banding
    let rgb = document.createElement('div')
    rgb.classList.add('rgb')

    // create the gradient dip
    let grade = document.createElement('div')
    grade.classList.add('screenGrad')

    // create the glow effect
    let screenGlow = document.createElement('div')
    screenGlow.classList.add('screenGlow')

    // send to animate
    screenLoop([screenGlow,grade])

    // create the videos and set-up to play if video is attached
    let screenVid = document.createElement('video')
    screenVid.muted = true
    screenVid.autoplay = true
    screenVid.loop = true
    batchSet(screenVid, 'style', {
        position: 'absolute',
        width: `${120 + parseInt(Math.random()*120)}%`,
        height: 'auto'
    })

    let backVid = screenVid.cloneNode(true)
    backVid.muted = true

    backVid.classList.add('backV')
    screenVid.classList.add('frontV')

    // attach everything
    screenTexture.appendChild(fallbackELE)
    screenTexture.appendChild(backVid)
    screenTexture.appendChild(screenVid)
    screenTexture.appendChild(grade)
    screenTexture.appendChild(rgb)
    generatedScreen.appendChild(screenGlow)
    let tempObj = {
        target: ele,
        onScreen: false
    }
    screens.push(tempObj)
}



// place the timeline outside of the change 
function animateScreen() {
    /*          Screen related           */

    let siG = 0;
    let autoChangeTimeout = null;

    // -------------

    // randomly flicker to new screen texture


    function autoChange(T) {
        autoChangeTimeout = setTimeout( () => {
            changeScreen(Math.floor(qsa('.screen').length*Math.random()),'autoed');
            autoChange(15000);
        },T + 5000*Math.random());
    } autoChange(2500)

    // -------------
    
    
    function videoIntersect(e, observer) {
        e.forEach(entry => {
            const matchingIndex = screens.findIndex((obj) => obj.target === entry.target);

            if (entry.isIntersecting) {
                entry.target.querySelector((((siG % 2)==0)?'.frontV':'.backV')).play()
                screens[matchingIndex].onScreen = true
            } else {
                entry.target.querySelectorAll('video').forEach(v => v.pause())
                screens[matchingIndex].onScreen = false
                    
            }
        });
    }

    
    observerConstructor(videoIntersect, '.screen', {
        rootMargin: '10% 0% 10% 0%'
    })    

    function videoSet(ele) {
        let frontV = ele.querySelector('.frontV')
        let backV = ele.querySelector('.backV')
        let siN = parseInt(ele.dataset.si) + siG || siG

        if(siG % 2 > 0) {
            gsap.set(frontV, {autoAlpha:0})
            frontV.src = siV[(siN+1) % si.length]
            frontV.load()
            frontV.currentTime = 5 * Math.random()
            frontV.pause()
        } else {
            gsap.set(frontV, {autoAlpha:1})
            backV.src = siV[(siN+1) % si.length]
            backV.load()
            frontV.currentTime = 5 * Math.random()
            backV.pause()
        }        
    }

    function flickerScreens(ele, index, i) {
        let toggle = siG % 2
        let intN = 2 + Math.floor(Math.random() * 3)
        let delay = Math.abs(index - i) * 200 * Math.random()/1000

        let frontV = ele.querySelector('.frontV')
        let video = ele.querySelectorAll('video')

        if(screens[index].onScreen) {
            const tl = gsap.timeline({onComplete: () => {
                setTimeout(()=> videoSet(ele),200)
            }})
    
            video.forEach(v => v.play());
    
    
            for(let n = 0; n <= intN; n++) {
                let op = (n%2 == 0) ? 1 : 0
                tl.to(frontV, {
                    autoAlpha: Math.abs(op - toggle),
                    duration: 0.01,
                    delay: ((n == 0) ? delay : 0) + (100 + 300 * Math.random())/1000
                },'>')           
            }            

        } else {
            videoSet(ele)
        }

    }

    // change screen semi-randomly flowing out from clicked screen
    function changeScreen(i) {
        if(siLock) return;
        siLock = true;
        if(props.mouse.target !== undefined) if(props.mouse.target.classList.contains('generatedScreen')) mouseEle.classList = null
        clearTimeout(autoChangeTimeout)
        autoChange()
        siG++;
    
        screens.forEach((ele, index) => flickerScreens(ele.target, index, i ))

        setTimeout(()=>{
            siLock = false; 
            if(props.mouse.target !== undefined) if(props.mouse.target.classList.contains('generatedScreen')) mouseEle.classList = 'react-play'
        },1500)
    } 
    
    
    // add event listerner to all screen to changeScreen on click
    qsa('.screen').forEach((ele, index) => {
        ele.addEventListener('click', () => changeScreen(index));
    })

}



























/**
 * 
 * 
 *          CONTACT SECTION 
 * 
 * 
 */

// --------------------------------------------------------------

gsap.set(qs('#buttonText'), {width:'unset'})

function changeContact(e, i, p) {
    if(props.contactLock === undefined) props.contactLock = false
    if(i !== 69) {
        props.contactLock = true;
        setTimeout(()=> {
            props.contactLock = false;
        },700)
    } else if(i === 69 && props.contactLock ) return;

    switch(i) {
        case 0: // telephone
            toClipboard(contactInfo.tel) 
        break;
        case 1: // email
            toClipboard(contactInfo.email);
        break;
        case 2: // linkedin
            linkClick.click((props.mobile) ? 'r' : 't', contactInfo.linkdin)
        break;
    }

    if(props.conButton == undefined) props.conButton = qs('#buttonText')
    if(props.conLastState == undefined) props.conLastState = qs('#buttonText .defaultState')
    let chosenFace = qs(`#buttonText .${e.id}`)

    gsap.fromTo(props.conButton, {width: props.conLastState.clientWidth }, {width: chosenFace.clientWidth, duration:0.2, onComplete: ()=>{
        props.conButton.style.width = 'unset'
    }})
    props.conLastState = chosenFace

    props.conButton.classList.remove('default-state')
    p.forEach((ele) => {
        if(e === ele) {
            ele.classList.add('onElement')
        } else {
            ele.classList.remove('onElement')
        }
        props.conButton.classList.remove(ele.id+'-state')
    });


    props.conButton.classList.add(e.id+'-state')

    clearTimeout(props.contactReturn)
    props.contactReturn = setTimeout(()=> {
        let chosenFace = qs('#buttonText .defaultState')
        gsap.fromTo(props.conButton, {width: props.conLastState.clientWidth }, {width: chosenFace.clientWidth, duration:0.2, onComplete: ()=>{
            props.conButton.style.width = 'unset'
        }})
        props.conLastState = chosenFace        
        p.forEach((ele) => {
            props.conButton.classList.remove(ele.id+'-state')
        })

        props.conButton.classList.add('default-state')

    },4000)

}

function contactSetup() {

    let lastSecond = new Date().getSeconds()-1

    // -------------------------------------------

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

    // -------------------------------------------

    setInterval(()=> {
        if(new Date().getSeconds() !== lastSecond) qs('#localTime').innerText = setDateWithOffset(props.GMT);
    },200)    
    qs('#location').innerText = props.city
    qs('#local').style.opacity = 1


    // -------------------------------------------
    
    /*          Generate contact info           */
    


    if(getCountry().toLowerCase() == props.country.toLowerCase()) {
        let modifiedNumber = contactInfo.tel.split(' ')
        modifiedNumber[0] = '0'
        contactInfo.tel = modifiedNumber.join(' ').replace(' ','')
    }

    let conInfo = qs('.contactInfo')
    qs('.telButton').innerText = contactInfo.tel
    const keys = Object.keys(contactInfo);
    keys.forEach((key,i) => {
        let infoSpan = document.createElement('span')
        if(contactTreatment[key].hover !== undefined) infoSpan.classList.add((contactTreatment[key].hover))
        
        switch(contactTreatment[key].type) {
            case 'link':
                infoSpan.innerText = (contactTreatment[key].text) ? contactTreatment[key].text : contactInfo[key]
                infoSpan.setAttribute('data-cikey', key)               
            break;
            default:
                infoSpan.innerText = contactInfo[key]
        }
        
        if(i > 0) { let hr = document.createElement('div'); conInfo.appendChild(hr) }
        conInfo.appendChild(infoSpan)

    });    
    qsa('.contactInfo span').forEach((ele) => {
        
        ele.addEventListener('click', (ev)=> {
            let key = ev.target.dataset.cikey
            if(key === undefined) return
            if(contactTreatment[key].trans) {
                linkClick.click((props.mobile) ? 'r' : 't', contactInfo[key]);
            } else {
                if(contactTreatment[key].func) contactTreatment[key].func(); else window.open(contactInfo[key], '_self')
            }
        })
    })

    // handle contact hover clicks
    qsa('.buttonCells div').forEach((ele, index, parent) => {
        ele.addEventListener('click', () => changeContact(ele, index, parent))
    })

    qs('#contactPlate').addEventListener('click', (event) => {
        if(event.target.id === 'contactPlate') {
            gsap.killTweensOf('.contactInfo')
            gsap.to('.contactInfo', {y:window.innerHeight/2 + qs('.contactInfo').offsetHeight/2, duration: 0.3, ease: "back.in(1.4)", onComplete: ()=>{
                qs('.contactInfo').style.transform = 'translateY(calc(50vh + 50%))'
            } })
            qsa('#contactPlate, .contactInfo').forEach((ele) => {
                ele.classList.remove('contactOpen')
            })
        }
    })
    
}

function contactClickthrough(e) {
    let mobSwitch = (props.mobile) ? 'r' : 't'

    switch(e) {
        case 0: // copy phonenumber
        if(props.mobile) {
            window.open(`tel:${contactInfo.tel.replace(' ','')}`,'_self')
        } else {
            toClipboard(contactInfo.tel) 
        }
        break;
        case 1: // copy email & open email client
        toClipboard(contactInfo.email);
        sendEmail()
        break;
        case 2: // open linkedin URL
        linkClick.click(mobSwitch, contactInfo.linkdin)
        break;
        default: // open contact page
        gsap.to('.contactInfo', {y:0, duration: 1, ease: "elastic.out(1,0.5)" })
        qsa('#contactPlate, .contactInfo').forEach((ele) => {
            ele.classList.add('contactOpen')
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

function flickerObj(ele, em, type) {
    type = type || 'boxShadow';
    const timeline = gsap.timeline()



    /*          neons           */

    let neon = ele
    let flickerDelay = [], flickerDur = []
    let BflickerTimes = (randomChance(80)) ? 40 + Math.floor(10*Math.random()) : 60 + Math.round(10*Math.random())

    let parentEM = em || 27; // Adjust this variable as needed
    txtSha = `-${0.0625 / parentEM}em -${0.0625 / parentEM}em 0 rgba(255,255,255, 0.2),
                  ${0.0625 / parentEM}em -${0.0625 / parentEM}em 0 rgba(255,255,255, 0.3),
                  -${0.0625 / parentEM}em ${0.0625 / parentEM}em 0 rgba(255,255,255, 0.2),
                  ${0.0625 / parentEM}em ${0.0625 / parentEM}em 0 rgba(255,255,255, 0.3),
                  0 -${0.125 / parentEM}em ${1.2 / parentEM}em,
                  0 0 ${0.125 / parentEM}em,
                  0 0 ${0.3125 / parentEM}em rgba(255,126,0,0.5),
                  0 0 ${5.9375 / parentEM}em rgba(255, 68, 68,0.6),
                  0 0 ${0.125 / parentEM}em rgba(255,126,0,0.5),
                  0 ${0.125 / parentEM}em ${0.1875 / parentEM}em rgba(0,0,0,0.7)`;    
//    let txtSha = '-1px -1px 0 rgba(255,255,255, 0.2), 1px -1px 0 rgba(255,255,255, 0.3), -1px 1px 0 rgba(255,255,255, 0.2), 1px 1px 0 rgba(255,255,255, 0.3), 0 -2px 8px, 0 0 2px, 0 0 5px rgba(255,126,0,0.5), 0 0 15px rgba(255, 68, 68,0.6), 0 0 2px rgba(255,126,0,0.5), 0 2px 3px rgba(0,0,0,0.7)'
    let fOn = (type == 'boxShadow') ? { background: 'rgba(255,204,0,1)', boxShadow: txtSha } : { color: 'rgba(255,204,0,1)', textShadow: txtSha }
    let fOff = (type == 'boxShadow') ? { background: 'rgba(137,114,42,1)', boxShadow: '0 2px 3px rgba(0,0,0,0.7)' } : { color: 'rgba(137,114,42,1)', textShadow: '0 2px 3px rgba(0,0,0,0.7)' }

    let ts = 7 // scale of flicker speed

    // --
    // -------------

    // set-up flicker delays
    for(let lonF = 0; lonF < BflickerTimes; lonF++) {
        // determine and push the big flicker delay and duration
        let longFlick = Math.ceil(5 * Math.random())
        flickerDelay.push(longFlick)
        let duration = (randomChance(70)) ? 1 : Math.ceil(3*Math.random())
        flickerDur.push(duration/10)

        // determine and push the small flicker delay and duration
        let SflickerTimes = (randomChance(70)) ? 1 + Math.floor(3*Math.random())  : 2 + Math.floor(6*Math.random())
        if(SflickerTimes % 2 === 0) SflickerTimes++;
        for(let shoF = 0; shoF < SflickerTimes; shoF++) {
            let shortFlick = (randomChance(60)) ? 1 : 2 + Math.floor(2*Math.random())
            flickerDelay.push(shortFlick/10)
            duration = ((randomChance(70)) ? 1 : Math.ceil(3*Math.random()))/10 
            flickerDur.push(duration/10)
        }

        // determine the points in which large flickers exist 
    }


    // -------------

    //set up gsap animations using flicker arrays

        for(let tlset = 0; tlset < flickerDelay.length; tlset++) {
            let aniObj = {};
            aniObj.delay = flickerDelay[tlset]
            aniObj.duration = flickerDur[tlset]
            Object.assign(aniObj,(tlset%2 !== 0) ? fOn : fOff)
            timeline.to(neon, aniObj, (tlset > 0) ? '>' : 5+0.4*Math.random())
        }
        // end on always
        let aniObj = {delay:0.1, duration:0.1}
        Object.assign(aniObj, fOn)
        timeline.to(neon, aniObj, '>')
    


    timeline.timeScale(ts)
    timeline.play()

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
        let result = exponentialDecayWithMax(rf.deltaY, 1, 0.9);
        result = result.toFixed(2);
        handleVel(result)

        // set false if there no movement in 100ms
        if(rf.deltaY === 0) props.scrolling = false
        rf.deltaY = 0 // reset for next tests

    }
}


function jumpTo(pos, behavior) {
    

    behavior = behavior || 'smooth'

    let eleTop = pos.getBoundingClientRect().top
    let distance = eleTop + document.documentElement.scrollTop
    if(pos.id == 'about' && document.documentElement.scrollTop < eleTop) distance += pos.parentElement.getBoundingClientRect().height - pos.getBoundingClientRect().height
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



    const tiltX = Math.max(-30, Math.min(30,(newY - ey ))); 
    const tiltY = Math.max(-30, Math.min(30, -(newX - ex )));


    return { x: (newX-ex), y: (newY-ey) } //, rotateX: `${(tiltX)}deg`, rotateY: `${(tiltY)}deg` }

}


function mouse(PN, rf) {
    let pm = props.mouse

    // forever update the mouse
    gsap.to(mouseEle, {x: pm.offX, y: pm.offY, duration: 0.1, ease: "power2.inOut" })

    // follow mouse at distance
    if(every(100, PN, 'mouse')) calculateNewPosition(pm.x, pm.y, pm.offX, pm.offY)

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


    // interactable over mousePointer
    if(pm.target.classList !== undefined) {
        let classList = pm.target.classList
        let arrayClassList = Array.from(classList)
        let interactable = arrayClassList.some(className => className.includes('react'))

        // mousePointer indicator change
        if(interactable && !(classList.contains('generatedScreen') && siLock)) {
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
                gsap.to(menuEle.children, {
                    color: `rgb(${props.secondaryCol})`,
                    duration:0.2
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

                gsap.to(menuEle.children, {
                    color: `rgb(${props.secondaryCol})`,
                    duration:0.2
                })                   
                gsap.to(pm.target, {
                    color: `rgb(${props.primaryCol})`,
                    duration:0.2
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

function navHandling(e) {
    e = e.toLowerCase()
    const path = window.location.pathname.replace('/','').split('.html')[0]
    const site = window.location.origin

    let posEle = qs(`#${e}`)
    switch(path) {
        case '':
        case 'index':
            if(e === 'home') posEle = qs('#wrapper')
        break;
        case 'about':
            if(e === 'about') posEle = qs('#wrapper')
        break;
    }

    if(posEle === null) {
        if(e === 'about') {
            linkClick.click((props.mobile) ? 'r' : 't', `${window.location.origin}/about.html`)
        } else {
            linkClick.click((props.mobile) ? 'r' : 't', `${window.location.origin}/index.html?msg=${e}`)
        }
    } else {
        jumpTo(posEle)
    }
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
            qs('#quailty-post').classList = "react-play state1"
        break;
        case 40:
            console.log('downgrading: removing light grain')
            controls.grain = false;
            lightGrain.style.display = 'none'
            qs('#quailty-post').classList = "react-play state2"
        break;
        case 60:
            console.log('downgrading: removing highlight hover')
            controls.highlightEffect = false
            qs('#quailty-post').classList = "react-play state3"
        break;
        case 80:
            console.log('downgrading: removing pushable')
            controls.pushable = false
            qs('#quailty-physics').classList = "react-play state1"
        break;
        case 100:
            console.log('downgrading: removing parallax')
            controls.projectParallax = false
            for (const [key, obj] of Object.entries(props.projectIMG)) {
                obj.im.style.transform = `translateY(0px)`
            }
            qs('#quailty-physics').classList = "react-play state2"
        break;
        case 120:
            console.log('downgrading: removing static canvas')
            controls.staticCanvas = false;
            staticHorizontal.clear()
            qs('#quailty-canvas').classList = "react-play state1"
        break
        case 140:
            console.log('downgrading: removing velocity')
            controls.velocity = false;
            qs('#quailty-physics').classList = "react-play state3"
        break;
    }
}

function manualPerformance(e) {

    const classList = Array.from(e.classList);
    const matchingClass = classList.find(className => className.includes('state'));
    let stripped = parseInt(matchingClass.replace('state',''))
    stripped++;
    if(stripped > parseInt(e.dataset.states)) stripped = 0;
    e.classList.remove(matchingClass)
    e.classList.add(`state${stripped}`)

    let ph = props.performanceHandling

    switch(e.id) {
        case 'quality-post':
            if(stripped > 2) {
                ph.highlightEffect = false
                ph.grain = false
                ph.heavyGrain = false

            } else if(stripped > 1) {
                ph.highlightEffect = true
                ph.grain = false
                ph.heavyGrain = false
                lightGrain.style.display = 'none'                
            } else if(stripped > 0) {
                ph.highlightEffect = true
                ph.grain = true
                ph.heavyGrain = false
                heavyGrain.style.display = 'none'
            } else {
                ph.highlightEffect = true
                ph.grain = true
                ph.heavyGrain = true
                heavyGrain.style.display = 'block'
                lightGrain.style.display = 'block'
            }
        break;
        case 'quality-physics':
            if(stripped > 2) {
                ph.velocity = false
                ph.projectParallax = false
                ph.pushable = false
            } else if(stripped > 1) {
                ph.velocity = true
                ph.projectParallax = false
                ph.pushable = false
                for (const [key, obj] of Object.entries(props.projectIMG)) {
                    obj.im.style.transform = `translateY(0px)`
                }                
            } else if(stripped > 0) {
                ph.velocity = true
                ph.projectParallax = true
                ph.pushable = false
            } else {
                ph.velocity = true
                ph.projectParallax = true
                ph.pushable = true
            }
        break;
        case 'quality-canvas':
            if(stripped > 0) {
                ph.staticCanvas = false
                staticHorizontal.clear()                
            } else {
                ph.staticCanvas = true
                staticHorizontal.static()
                staticHorizontal.animate()

                // Function to check if an element is on the screen
                const isElementOnScreen = (element) => {
                    const observer = new IntersectionObserver(([entry]) => {
                    if (entry.isIntersecting) {
                        if (entry.isIntersecting) {
                            staticHorizontal.eles.forEach(co => {
                                co.running = (co.canvas == element)
                            })
                        }                    
                    }
                    observer.disconnect()
                    });
                    observer.observe(element);
                };
                qsa('.staticBlocksH').forEach(target => isElementOnScreen(target))
            }            
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

    // nav clickthrough handling
    qs('#nav .copy').addEventListener('click', (ev) => {
        navHandling(ev.target.innerText)
    })


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
        if(ev.target.id !== 'menuDesktop') navHandling(ev.target.innerText)
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
            jy: event.clientY,
            target: event.target,
            valid: true
        }
    })    
}


// handle scroll animations
document.addEventListener('scroll', event => {
    if(!props.mobile) props.mouse.y = props.mouse.jy + window.scrollY
    props.scrolling = true;
}); 


// setup tech related
techMenuEle.addEventListener('click', ev => {
    if(ev.target !== techMenuEle) manualPerformance(ev.target)
})

qsa('#buttonText div').forEach((ele, i) => {
    ele.addEventListener('click', ev => {
        contactClickthrough(i)
    })
})




// simplify if statements in requestFrame function to only run every x milliseconds with ease
function every(milli, PN, label) {
    label = label+milli || `milli${milli}`
    if(props.requestFrame[label] === undefined) props.requestFrame[label] = 0
    if((PN - props.requestFrame.launchTime) / milli - props.requestFrame[label] > 1) {
        props.requestFrame[label] = Math.floor((PN - props.requestFrame.launchTime) / milli)
        return true;
    } 
    return false;
    
}

// launch time
props.requestFrame = {}
props.requestFrame.launchTime = performance.now()

function drawFrame() {
    const F1 = performance.now()
    const rf = props.requestFrame
    let ph = props.performanceHandling
    // ------------------------------------------------------

    if(!props.mobile) mouse(F1, rf)
    
    // set to true when scrolling
    if(props.scrolling) scrollVelocity(F1, rf)
    if(props.scrolling && every(25,F1) && bht.scrubbing !== undefined) { bht.scrubbing() }
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















function load() {
    const url = new URL(window.location.href);

    // Get the search parameters
    const searchParams = url.searchParams;

    searchParams.forEach((v,k) => {
        switch(k) {
            case 'msg':
                let j = (qs(`#${v}`) === null) ? qs('#wrapper') : qs(`#${v}`)
                jumpTo(j,'instant')
            break;
        }
    })

    if(typeof uResizer === 'function') uResizer()
    

    if(internalRedirect) {
        (props.mobile) ? linkClick.fromClicked('r') : linkClick.fromClicked('t')
        setTimeout(()=>{if(typeof uResizer === 'function') uLoaded()},300)
        props.loaded = true
    } else {

        gsap.set(document.querySelector('.linkClick'), {scaleX:0, scaleY:0})

        if(typeof uResizer === 'function') uLoaded()
        props.loaded = true
    }

    document.querySelector('#blocker').style.background = "none"




}

window.onload = function() {
    console.log('onload')
    load()
}

window.addEventListener('popstate', (event) => {
    console.log('popstate')
    load()
});

window.addEventListener("hashchange", function(e) {
    console.log('hashchange')
    if(e.oldURL.length > e.newURL.length) load()
});

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
