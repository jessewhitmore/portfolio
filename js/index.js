/**
 * 
 * 
 *          SET-UP DEFAULTS FOR HANDLING
 *         
 * 
 * 
 */

// projects manifest -- used to geneterate projects on index only currently
const projectManifest = [
    {
        title: 'DOG System',
        desc: 'PROJECT - TYPE - CODE' 
    }, 
    {
        title: '2021 Roadmap',
        desc: 'PROJECT - TYPE - CODE' 
    }, 
    {
        title: 'New Format: Velocity',
        desc: 'PROJECT - TYPE - CODE' 
    }, 
    {
        title: 'Studio Sliders',
        desc: 'PROJECT - TYPE - CODE' 
    },    
    {
        title: 'Self-Serve Templates',
        desc: 'PROJECT - TYPE - CODE' 
    }, 
    {
        title: 'Client Work Playground',
        desc: 'PROJECT - TYPE - CODE' 
    },
    {
        title: 'Amazon Black Friday',
        desc: 'PROJECT - TYPE - CODE' 
    },
    {
        title: 'Uber',
        desc: 'PROJECT - TYPE - CODE' 
    },
    {
        title: 'Heineken',
        desc: 'PROJECT - TYPE - CODE' 
    },    
    {
        title: 'Kong Skull Island',
        desc: 'PROJECT - TYPE - CODE' 
    },    
    {
        title: 'Design for Fun',
        desc: 'PROJECT - TYPE - CODE' 
    },    
]


// -------------------------------------
// -------------------------------------

function processElements() {

    /*          Gen projects            */

    props.projectIMG = []
    projectManifest.forEach((v,i) => {

        // create and tag - project
        let project = document.createElement('div')
        project.classList.add('project', 'react-open')
        project.setAttribute('data-linkRef',1)
        project.setAttribute('data-project', v.title.toLowerCase().replaceAll(' ','-'))


        // create, tag, img setup & attach copy to - reveal
        let reveal = document.createElement('div')
        reveal.classList.add('reveal')
        img = new Image();
        img.classList.add('para','dist15')
        img.onerror = function() {
            this.src = './img/test.jpg'
        }
        img.src = `./projects/title-${v.title.toLowerCase().replaceAll(' ','-')}.jpg`;
        img.setAttribute('data-projectIndex', i+1)
        reveal.appendChild(img)

        props.projectIMG[`pi${i+1}`] = { im: img, last: 0 }

        // checky hover shade
        let shade = document.createElement('div')
        shade.classList.add('shade')

        // Create an SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const clipPath = path.cloneNode()

        path.setAttribute('fill', `rgb(${props.primaryCol})`)
        path.classList = "SVGblocker";
        path.id = "SVGblocker";

        // clip path
        const def = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const clip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clip.id = `SVGclip${i}`
        clip.classList = "SVGclip"
        svg.appendChild(def).appendChild(clip).appendChild(clipPath)

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('clip-path', `url('#${clip.id}')`)

        var FO = document.createElementNS('http://www.w3.org/2000/svg',"foreignObject")
        let FOele = document.createElement('div')
        batchSet(FOele, 'style', {
            height:'100%', 
            width:'100%', 
            display:'flex', 
            'flex-direction':'column',
            'justify-content':'center',
            'padding-left': 'clamp(2rem, 6.3vw, 7rem)',
            'box-sizing':'border-box'
        })
        let titleNode = document.createElement('span')
        titleNode.classList.add('SVGtitle')
        titleNode.innerText = v.title

        let descNode = document.createElement('span')
        descNode.classList.add('SVGdesc')
        descNode.innerText = v.desc

        FOele.appendChild(titleNode)
        FOele.appendChild(descNode)

        FO.appendChild(FOele)        
        let FOback = FO.cloneNode(true)

        FO.style.color = `rgb(${props.secondaryCol})`
        FOback.style.color = `rgb(${props.primaryCol})`
        FOback.style.textShadow = `0px 0px 9px rgba(${props.secondaryCol},0.6)`

        svg.appendChild(FOback)

        svg.appendChild(path)

        group.appendChild(FO)
        svg.appendChild(group)

        // finalise elements and attach to .project node
        project.appendChild(reveal)
        project.appendChild(svg)
        project.appendChild(shade)

        // finalise and attach
        qs('#projects').appendChild(project)
    })
    projectSVGshape()
    


    /*          parallax setup attribute setup           */

    attributeSetup('.para',['dist'])

    wrapProcessing()

}
































/**
 * 
 * 
 *          INTERSECT OBSERVERS
 * 
 * 
 */

// intersections 
function intersections() {


    function rc(en) { // delete selOff from element
        en.target.classList.remove('selOff')
    } 


    /*          turn on elements on coming into screen           */

    function seloffIntersect(e, observer) { // the seleciton loop
        e.forEach(entry => {
            if (entry.isIntersecting) {

                // turn on screen randomly
                if(entry.target.classList.value.indexOf('screen') > -1) setTimeout( () => { rc(entry) }, 100+Math.random()*400)


                // play the about section flicker
                if(entry.target.classList.value.indexOf('text') > -1) {
                    rc(entry)
                    timeline.play()
                }

                // about copy determine which span is on what line and fade in 
                if(entry.target.classList.value.indexOf('about') > -1) {
                    let spanLine = 0, spanOffset = 0;
                    for(let c = 0; c < entry.target.children.length; c++) {
                        if(spanOffset !== entry.target.children[c].offsetTop) { 
                            spanOffset = entry.target.children[c].offsetTop; 
                            spanLine++;
                        }
                        entry.target.children[c].children[0].style.transitionDelay = `${0.1*spanLine}s`
                    }
                    rc(entry)
                }
                
                // kill observer
                observer.unobserve(entry.target);
            }
        });   
    }    


    // -------------

    /*          velocity animation on intersection with viewport           */

    function velIntersect(e, observer) {
        e.forEach(entry => {
            if (entry.isIntersecting) {
                if(viewportVel.indexOf(entry.target) === -1) viewportVel.push(entry.target);
            } else {
                let tempIndex = viewportVel.indexOf(entry.target)
                if(tempIndex !== -1) { 
                    viewportVel.splice(tempIndex, 1); gsap.set(entry.target, { y:0 }); }
            }
        });
    }


    // -------------

    /*          Project middle mobile interaction           */

    function projectIntersect(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                projectDraw(entry.target)
            } 
        });
    }


    // -------------

    /*          floating element           */
    
    function floatIntersect(e, observer) {
        e.forEach(entry => {
            const matchingIndex = float.findIndex((obj) => obj.target === entry.target);

            if (entry.isIntersecting) {
                float[matchingIndex].onScreen = true
            } else {
                float[matchingIndex].onScreen = false
            }
        });
    }


    // -------------

    /*          Pushable elements           */
    
    function pushableIntersect(e, observer) {
        e.forEach(entry => {
            const matchingIndex = pushable.findIndex((obj) => obj.target === entry.target);

            if (entry.isIntersecting) {
                if(matchingIndex === -1) {
                    let tempObj = {
                        target: entry.target,
                        xy:[0,0],
                    }
                    pushable.push(tempObj)
                }
            } else {
                if(matchingIndex !== -1) pushable.splice(matchingIndex,1)
            }
        });
    }


    // -------------

    /*          canvas           */
    
    function canvasStaticHorizontalIntersect(e, observer) {
        if(!props.performanceHandling.staticCanvas) return;
        let obvObjRunning = false;
        e.forEach(entry => {
            const matchingIndex = staticHorizontal.eles.findIndex((obj) => obj.canvas === entry.target);
            if (entry.isIntersecting) {
                obvObjRunning = true
                staticHorizontal.eles[matchingIndex].running = true
                staticHorizontal.running = obvObjRunning       
                staticHorizontal.animate()
            } else {
                staticHorizontal.eles[matchingIndex].running = false
            }
        });
        staticHorizontal.running = obvObjRunning
    }
    

    
    // -------------

    // setup observers with function, element and options 
    observerConstructor(seloffIntersect, '.selOff', {
        rootMargin: '-3% 0% -3% 0%'
    })
    
    observerConstructor(velIntersect, '.vel', {
        rootMargin: '20% 0% 20% 0%'
    })

    if(props.mobile) observerConstructor(projectIntersect, '.project',  {
        rootMargin: '-50% 0% -50% 0%'
    })

    observerConstructor(floatIntersect, '.float', {
        rootMargin: '0% 0% 0% 0%'
    })
    
    if(!props.mobile) observerConstructor(pushableIntersect, '.push', {
        rootMargin:'0% 0% 0% 0%'
    })

    observerConstructor(canvasStaticHorizontalIntersect, '.staticBlocksH', {
        rootMargin:'0% 0% 0% 0%'
    })
  
}








































/**
 * 
 * 
 *          ABOUT SECTION
 *          flicker and reveal
 * 
 * 
 */

function aboutSetup() {


    /*          split about title           */

    let aboutTitleSplit = qs('#text').innerText.split('')
    let rephrasedTitle = '';
    aboutTitleSplit.forEach(v => {
        rephrasedTitle += `<span class = "selOff text">${v}</span>`
    });
    qs('#text').innerHTML = rephrasedTitle


    /*          split about text            */

    let aboutCopySplit = qs('#aboutTxt').innerText.split(' ');
    let rephrasedCopy = '';
    aboutCopySplit.forEach(v => {
        rephrasedCopy += `<span>${v} <span>${v} </span></span>`
    });
    qs('#aboutTxt').innerHTML = rephrasedCopy



    // -------------

    /*          neons           */

    let neon = qs('#text')
    let breakAt = [], flickerDelay = [], flickerDur = []
    let brokenCell = (randomChance(70)) ? [ Math.floor(neon.children.length*Math.random()) ] : [  Math.floor(neon.children.length*Math.random()),  Math.floor(neon.children.length*Math.random()) ]
    let BflickerTimes = (randomChance(80)) ? 40 + Math.floor(10*Math.random()) : 60 + Math.round(10*Math.random())
    
    let txtSha = '-1px -1px 0 rgba(255,255,255, 0.2), 1px -1px 0 rgba(255,255,255, 0.3), -1px 1px 0 rgba(255,255,255, 0.2), 1px 1px 0 rgba(255,255,255, 0.3), 0 -2px 8px, 0 0 2px, 0 0 5px rgba(255,126,0,0.5), 0 0 15px rgba(255, 68, 68,0.6), 0 0 2px rgba(255,126,0,0.5), 0 2px 3px rgba(0,0,0,0.7)'
    let fOn = { color: 'rgba(255,204,0,1)', textShadow: txtSha }
    let fOff = { color: 'rgba(137,114,42,1)', textShadow: '0 2px 3px rgba(0,0,0,0.7)' } 

    let ts = 7 // scale of flicker speed


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
        breakAt.push(flickerDur.length-1)
    }


    // -------------

    //set up gsap animations using flicker arrays
    for (let c = 0; c < neon.children.length; c++) {

        let breakPos = breakAt[4+(Math.floor(Math.random()*3)-1)]
        for(let tlset = 0; tlset < flickerDelay.length; tlset++) {
            if(tlset >= breakPos && !brokenCell.includes(c)) break;
            if(brokenCell.length > 1 && tlset >= breakAt[Math.round(breakAt.length*0.7)] && c === brokenCell[1]) break;
            let aniObj = {};
            aniObj.delay = flickerDelay[tlset]
            aniObj.duration = flickerDur[tlset]
            Object.assign(aniObj,(tlset%2 !== 0) ? fOn : fOff)
            timeline.to(neon.children[c], aniObj, (tlset > 0) ? '>' : 5+0.4*Math.random())
        }
        // end on always
        let aniObj = {delay:0.1, duration:0.1}
        Object.assign(aniObj, fOn)
        timeline.to(neon.children[c], aniObj, '>')
    }

    // set a scale 
    timeline.timeScale(ts)
}

// kill the project section  
function uDuringResizer() {
    qs('#projects').classList.add('resizeOff')
}

// do resizing for the about sections then run SVG stuff
function uResizer() {
        // Get the parent and child elements
        const parent = qs('#text');
        const child = qsa('#text span');

        // Calculate and set the font size relative to the parent's width
        const parentWidth = parent.offsetWidth;
        let childWidth = 0;
        child.forEach(ele => {
            childWidth += ele.offsetWidth
        })
        
        let fontSizePercentage = 0.2; // Adjust this value based on your design needs


        let exitTrig = 0;
        while(childWidth > parentWidth) {
            let fontSize = parentWidth * fontSizePercentage;
            childWidth = 0;
            child.forEach(ele => {
                childWidth += ele.offsetWidth                
                ele.style.fontSize = fontSize + 'px'
            })
            fontSizePercentage -= 0.01

        }

        while(childWidth < parentWidth) {
            let fontSize = parentWidth * fontSizePercentage;
            childWidth = 0;
            child.forEach(ele => {
                childWidth += ele.offsetWidth                
                ele.style.fontSize = fontSize + 'px'
            })
            fontSizePercentage += 0.01
        } 
        
        while(childWidth > parentWidth) {
            let fontSize = parentWidth * fontSizePercentage;
            childWidth = 0;
            child.forEach(ele => {
                childWidth += ele.offsetWidth                
                ele.style.fontSize = fontSize + 'px'
            })
            fontSizePercentage -= 0.001
        }         


        projectSVGshape()
        qs('#projects').classList.remove('resizeOff')

} 







































/**
 * 
 * 
 *          PROJECTS
 * 
 * 
 */

// resize project on resize
props.performanceCount = 0;
function projectSVGshape() {

    const parent = qs('#projects svg').parentElement
    const w = wrapper.offsetWidth
    const h = parent.offsetHeight + 1
    const remOffset = (window.innerWidth / window.innerHeight > 4/3) ? 12 * props.rem : 7 * props.rem


    qsa('#projects svg').forEach(ele => {

        ele.setAttribute('viewBox', `0 0 ${ w } ${h}`)
        ele.querySelectorAll('path').forEach(path => {
            path.setAttribute('d',`M 0 0 H ${ w } L ${ w + remOffset } ${ h } H 0 z`)
        })

        ele.querySelectorAll('foreignObject').forEach(FO => {
            batchSet(FO, 'setAttribute', {width: w*0.93, height:h})
        })

    })


    let windowHeight = window.innerHeight
    for (const [key, obj] of Object.entries(props.projectIMG)) {
        const parent = obj.im.parentElement.getBoundingClientRect()
        obj.im.style.marginTop = -obj.im.offsetHeight/2 + 'px'

        obj.mid = window.scrollY + parent.top + (parent.height / 2)
        obj.sh = windowHeight / 2
    }

    gsap.set(qsa('.highlight .SVGblocker, .highlight .SVclip'), { x: '0vw' })
    gsap.set(qsa('.highlight .SVGtitle, .highlight .SVGdesc'), { x: 0, scale:1 })    
    projectDraw()
}

function projectParallax() {
    if(!props.performanceHandling.projectParallax) return;
    if(props.projectAnimatable) {
        const cTime = parseInt(Date.now())
        let propjectAnimatable = false;
        let windowY = window.scrollY
        for (const [key, obj] of Object.entries(props.projectIMG)) {
            if(!propjectAnimatable) {
                if(obj.last === null || obj.last + 500 > cTime) {
                    let relativePos = (windowY + obj.sh - obj.mid)
                    let speed = relativePos * (obj.im.dataset.dist/100)
                    obj.im.style.transform = `translateY(${speed}px)`
                    projectAnimatable = true
                }
            }
        }
        props.projectAnimatable = projectAnimatable
    }

}

function projectDraw(target) {

    if(typeof target == 'object') target.classList.add('highlight');
    let xOffset = (window.innerWidth / window.innerHeight < 4/3) ? '-74vw' : '-54vw'
    qsa('#projects .highlight').forEach((ele)=> {
        let img = ele.querySelector('img')
        if(ele == target) {
            gsap.to(ele.querySelectorAll('.SVGblocker, .SVGclip'), {
                x: xOffset
            })

            gsap.to(ele.querySelectorAll('foreignObject div'), {
                x: -(0.08*window.innerWidth).clamp(2.4*props.rem, 17*props.rem),
                scale: 0.85                
            })

            gsap.to(ele.querySelectorAll('g'), {
                opacity: 0.4
            })

            gsap.to(ele.querySelector('.shade'), {
                opacity:0.3
            })

            props.projectAnimatable = true            
            if(props.projectIMG[`pi${img.dataset.projectindex}`].last !== null) props.projectIMG[`pi${img.dataset.projectindex}`].last = null

        } else {
            gsap.to(ele.querySelectorAll('.SVGblocker, .SVGclip'), {
                x: '0vw'
            })
            gsap.to(ele.querySelectorAll('foreignObject div'), {
                x: 0,
                scale:1
            })

            gsap.to(ele.querySelectorAll('g'), {
                opacity: 1
            })

            gsap.to(ele.querySelector('.shade'), {
                opacity:0
            })

            ele.classList.remove('highlight')

            props.projectIMG[`pi${img.dataset.projectindex}`].last = parseInt(Date.now())

        }

        projectParallax()

    })
}
function uMouse() { // draw and animate the projects
    const pm = props.mouse
    if(qs('.highlight') !== null && !pm.target.classList.contains('project')) { 
        projectDraw()
    }
    if(!pm.target.classList.contains('project') || pm.target.classList.contains('highlight')) return;
    projectDraw(pm.target)
}







































/**
 * 
 * 
 *          SCROLL RELATED
 * 
 * 
 */

function uScroll() {
        /*      highlight parallax           */

    projectParallax()

}







































/**
 * 
 * 
 *          USER INTERACTION RELATED
 *          Buttons, hover near, etc.
 * 
 * 
 */
  
function clickThrough(e, ev) {

    let mobSwitch = (props.mobile) ? 'r' : 't', link;
    switch(parseInt(e.dataset.linkref)) {
        case 0: // about page
            link = './about.html'
            linkClick.click(mobSwitch, link)
        break;
        case 1: // project page            
            qsa('.highlight').forEach((ele) => {        ele.classList.remove('highlight')     })
           linkClick.centerSweep(ev.clientY, `./projects/${e.dataset.project}.html`)
        break;
        case 2: // copy phonenumber
            if(props.mobile) {
                window.open(`tel:${contactInfo.tel.replace(' ','')}`,'_self')
            } else {
                toClipboard(contactInfo.tel) 
            }
        break;
        case 3: // copy email & open email client
            toClipboard(contactInfo.email);
            sendEmail()
        break;
        case 4: // open linkedin URL
            linkClick.click(mobSwitch, contactInfo.linkdin)
        break;
        case 5: // open contact page
            gsap.to('.contactInfo', {y:0, duration: 1, ease: "elastic.out(1,0.5)" })
            qsa('#contactPlate, .contactInfo').forEach((ele) => {
                ele.classList.add('contactOpen')
            })            
        break;
        default: // within nav 
        if(!scrollVals.autoScrolling) jumpTo(e.innerText)
        break;
    }
}












































/*          Trigger relevant functions          */

processElements()
intersections()
aboutSetup()
contactSetup()



