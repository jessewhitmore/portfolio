/**
 * 
 * 
 *          SET-UP DEFAULTS FOR HANDLING
 *         
 * 
 * 
 */


// -------------------------------------
// -------------------------------------

function processElements() {

    /*          Gen projects            */

    props.projectIMG = []
    projectManifest.forEach((v,i) => {

        let titleDashed = v.title.toLowerCase().replaceAll(' ','-').replaceAll(':','')

        // create and tag - project
        let project = document.createElement('div')
        project.classList.add('project', 'react-open')


        // create, tag, img setup & attach copy to - reveal
        let reveal = document.createElement('div')
        reveal.classList.add('reveal')
        img = new Image();
        img.classList.add('para','dist50')
        img.onerror = function() {
            this.src = './img/test.jpg'
        }

        img.src = `/projects/${titleDashed}/title.jpg`;
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
        FO.setAttribute('transform-origin','0 50%')

        let FOele = document.createElement('div')
        batchSet(FOele, 'style', {
            height:'100%', 
            width:'100%', 
            display:'flex', 
            'flex-direction':'column',
            'justify-content':'center',
            'padding-left':'clamp(2rem, 6.3vw, 7rem)',
            'box-sizing':'border-box',
            'font-size':'clamp(1rem, 6.3vw, 3.5rem)'
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

        // attach event
        project.addEventListener('click', ev => {
            linkClick.centerSweep(ev.clientY, `./projects/${titleDashed}.html`)
        })

        // finalise and attach
        qs('#projects').appendChild(project)
    })
    projectSVGshape()
    

    /*          typical wrapping and setups           */




    if(!props.mobile) {
        
//         props.floatOn = false;
//         props.introTL = gsap.timeline({
//             paused: true,
//             onComplete: ()=> {props.floatOn = true}
//         })


//         props.introTL.from('.bg', {
//             scale:1.8,
//             duration:0.3,
//         },0)
        
//         props.introTL.from('#desktopNamePlate', {
//             ease: "power2.out",
//             z:-600,
//             duration:0.3,
//         },0)




//         props.introTL.from(qsa('.sh1')[0], {
//             ease: "back.out(3)",
//             scaleY:0,
//             duration:0.25,
//             delay: 0.35
//         },0)


//         props.introTL.from(qsa('.sh1')[1], {
//             ease: "back.out(3)",
//             scaleY:0,
//             duration:0.25,
//             delay: 0.4
//         },0)

//         props.introTL.from(qsa('.sh1')[2], {
//             ease: "back.out(3)",
//             scaleY:0,
//             duration:0.25,
//             delay: 0.5
//         },0)


//         props.introTL.from(qsa('.sh1')[3], {
//             ease: "back.out(3)",
//             scaleY:0,
//             duration:0.25,
//             delay: 0.3
//         },0)
        

//         props.introTL.from(qsa('.sh1')[4], {
//             ease: "back.out(3)",
//             scaleY:0,
//             duration:0.25,
//             delay: 0.25
//         },0)        



//         props.introTL.from('#desktopFigure', {
//             ease: "power2.out",
//             z:200,
//         //    filter:'blur(5px)',
//             duration:0.3,
//         },0)

   

//         props.introTL.from(qsa('.sh2')[0], {
//             ease: "power2.out",
//             z:300,
//  //           filter:'blur(6px)',
//             duration:0.4,
//         },0)

//         props.introTL.from(qsa('.sh2')[1], {
//             ease: "power2.out",
//             z:300,
// //            filter:'blur(6px)',
//             duration:0.15,
//         },0)

//         props.introTL.from(qsa('.sh2')[2], {
//             ease: "power2.out",
//             z:400,
// //            filter:'blur(9px)',
//             duration:0.5,
//         },0)        

//         props.introTL.from(qsa('.sh2')[3], {
//             ease: "power2.out",
//             z:400,
// //            filter:'blur(9px)',
//             duration:0.4,
// //            delay: 0.5
//         },0)

//         props.introTL.timeScale(0.8)
    }


    wrapProcessing()


    let s1bht = gsap.timeline({paused:true})

    s1bht.from(qs('#multidis').parentElement,{
        opacity:0,
        x:-1000, 
        duration:10
    },0)

    s1bht.from('#multidissub1 span',{
        opacity:0,
        x:100,
        stagger: 3.3,
        duration:10
    },'>')

    s1bht.to('#multidissub1 span',{
        opacity:0,
        x:100,
        delay: 20,
        duration:10
    },'>')

    s1bht.from(qs('#multidissub2').parentElement,{
        opacity:0,
        x:100,
        duration:10
    },'>')

    s1bht.from('#multidissub2 .button',{
        scaleY:0,
        duration:10
    },'>')

    bht.scenes.scene0.timeline = s1bht;
}


function uLoaded() {
    if(!props.mobile) props.introTL.play()
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
            const matchingIndex = float.findIndex((obj) => obj.target === entry.target)
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

    observerConstructor(projectIntersect, '.project',  {
        rootMargin: '-50% 0% -50% 0%'
    })

    observerConstructor(floatIntersect, '.floated', {
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
let txtSha = null
function aboutSetup() {

    /*          split about title           */

    let aboutTitleSplit = qs('#nameTop').innerText.split('')
    let rephrasedTitle = '';
    aboutTitleSplit.forEach(v => {
        rephrasedTitle += `<span class = "selOff text">${v}</span>`
    });
    qs('#nameTop').innerHTML = rephrasedTitle


    /*          split about text            */

    let aboutCopySplit = qs('#aboutTxt').innerText.split(' ');
    let rephrasedCopy = '';
    aboutCopySplit.forEach(v => {
        rephrasedCopy += `<span>${v} <span>${v} </span></span>`
    });
    qs('#aboutTxt').innerHTML = rephrasedCopy



    // -------------

    /*          neons           */

    let neon = qs('#nameTop')
    let breakAt = [], flickerDelay = [], flickerDur = []
    let brokenCell = (randomChance(70)) ? [ Math.floor(neon.children.length*Math.random()) ] : [  Math.floor(neon.children.length*Math.random()),  Math.floor(neon.children.length*Math.random()) ]
    let BflickerTimes = (randomChance(80)) ? 40 + Math.floor(10*Math.random()) : 60 + Math.round(10*Math.random())

    let parentEM = 27; // Adjust this variable as needed
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
    let fOn = { color: 'rgba(255,204,0,1)', textShadow: txtSha }
    let fOff = { color: 'rgba(137,114,42,1)', textShadow: '0 2px 3px rgba(0,0,0,0.7)' } 

    let ts = 7 // scale of flicker speed

    // -------------

    parentEM = 6
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
    qs('#newabout .button').style.boxShadow = txtSha


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

    let odd = qsa('#subTop span:nth-child(odd)')
    let even = qsa('#subTop span:nth-child(even)')

    timeline.from(odd, {
        y:30,
        autoAlpha: 0,
        duration: 3,
        stagger: 2
    },9)

    timeline.from(even, {
        autoAlpha: 0,
        duration: 3,
        stagger: 2
    },10)

    timeline.timeScale(ts)
    timeline.play()



    // -------------

    /*          about click handler           */

    qs('#about .button').addEventListener('click', ev => {
        linkClick.click((props.mobile) ? 'r' : 't', `${window.location.origin}/about.html`)        
    })

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
            gsap.to(ele.querySelectorAll('foreignObject'), {
                x: (-0.025*window.innerWidth).clamp(-2.5*props.rem, -0.1*props.rem),
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
            gsap.to(ele.querySelectorAll('foreignObject'), {
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











































/*          Trigger relevant functions          */

processElements()
intersections()
aboutSetup()
contactSetup()



