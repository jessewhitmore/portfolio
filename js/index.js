/**
 * 
 * 
 *          SET-UP DEFAULTS FOR HANDLING
 *         
 * 
 * 
 */

const staticHorizontal = new blockCanvas()
function processCanvas() {


    // -------------------------------------

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

} 




// -------------------------------------
// -------------------------------------

function processElements() {

    /*          sizing issues           */


    /*          populate float           */

    qsa('.float').forEach((ele) => {
        let tempObj = {
            target: ele,
            movementDirectionX: (Math.random() < 0.5) ? -1 : 1,
            movementDirectionY: (Math.random() < 0.5) ? -1 : 1,
            x: Math.round(Math.random()*bobControls.xMax*2)-bobControls.xMax,
            y: Math.round(Math.random()*bobControls.yMax*2)-bobControls.yMax,
            onScreen: false
        }
        float.push(tempObj)
    });


    /*          Gen projects            */

    projectManifest.forEach((v,i) => {

        // create and tag - project
        let project = document.createElement('div')
        project.classList.add('project', 'react-open')
        project.setAttribute('data-linkRef',1)

        // create and tag - copy
        let copy = document.createElement('div')
        copy.classList.add('copy')

        // create and tag & attach to parent - title
        let title = document.createElement('div')
        title.classList.add('title')
        title.innerText = v.title        
        copy.appendChild(title)

        // create and tag & attach to parent - desc
        let desc = document.createElement('div')
        desc.classList.add('desc')
        desc.innerText = v.desc
        copy.appendChild(desc)

        // create and tag & attach copy to - closed
        let closed = document.createElement('div')
        closed.classList.add('closed')
        closed.appendChild(copy.cloneNode(true))

        // create, tag, img setup & attach copy to - reveal
        let reveal = document.createElement('div')
        reveal.classList.add('reveal')
        img = new Image();
        img.classList.add('para','dist15')
        img.onerror = function() {
            this.src = './img/test.jpg'
        }
        img.src = `./projects/title-${v.title.toLowerCase().replace(' ','-')}.jpg`;
        reveal.appendChild(img)
        reveal.appendChild(copy)

        // checky hover shade
        let shade = document.createElement('div')
        shade.classList.add('shade')

        // finalise elements and attach to .project node
        project.appendChild(closed)
        project.appendChild(reveal)
        project.appendChild(shade)

        // finalise and attach
        qs('#projects').appendChild(project)
    })
    
    
    /*          Generate contact info           */


    let conInfo = qs('.contactInfo')
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



    /*          Velocity and parallax setup attribute setup           */

    attributeSetup('.vel',['dur','dist'])
    attributeSetup('.para',['dist'])
    attributeSetup('.screen',['si'])
    attributeSetup('.pushable',['amt'])


    /*          screen texture allocation and sub div creation           */

    for(let ele of qsa('.screen')) {
        let siN = 0 || ele.dataset.si;
        wrapContent(ele, 'screenTexture')
        ele.querySelector('.screenTexture').style.background = si[siN]
    } 


    /*          pushable element creation           */
    if(!props.mobile) {
        for(let ele of qsa('.pushable')) {
            wrapContent(ele, 'push')
        }
    }

}






































/**
 * 
 * 
 *          ANIMATION HANDLING
 *          Velocity, parallax, any animation in more than one section
 * 
 * 
 */

function globalAnimationSetups() {

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

    // -------------

    /*          random movement         */

    setInterval(()=>{

        if(!scrollVals.refreshing) {        
            float.forEach((mt) => {
                if(mt.onScreen) {
                    mt.x += bobControls.movement*mt.movementDirectionX
                    mt.y += bobControls.movement*mt.movementDirectionY

                    if(Math.abs(mt.x) > bobControls.xMax) mt.movementDirectionX *= -1
                    if(Math.abs(mt.y) > bobControls.yMax) mt.movementDirectionY *= -1
                    gsap.to(mt.target, {x: mt.x, y: mt.y, duration: bobControls.dur})
                }
            })

            pushable.forEach((mt) => {
                gsap.to(mt.target, {x: mt.xy[0], y: mt.xy[1], duration: push.dur})
            })
        }
    },500)

} 







































/**
 * 
 * 
 *          DATE TIME
 * 
 * 
 */

function dateTimeContact() {

    let location = 'Sydney'
    let GMT = 11
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
        targetDate = `${pad(targetDate.getHours(),2)}:${pad(targetDate.getMinutes(),2)}:${pad(targetDate.getSeconds(),2)}${(Math.sign(gmtOffset) === 1) ? '+' : ''}${gmtOffset}GMT`
        
        return targetDate
    }


    // -------------

    setInterval(()=> {
        if(new Date().getSeconds() !== lastSecond) qs('#localTime').innerText = setDateWithOffset(GMT);
    },200)    
    qs('#location').innerText = location
    qs('#local').style.opacity = 1

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

function customResizer() {
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
                if(tempIndex !== -1) { viewportVel.splice(tempIndex, 1); gsap.set(entry.target, { y:0 }); }
            }
        });
    }


    // -------------

    /*          Project middle mobile interaction           */
    function projectIntersect(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('highlight');
            } else {
                entry.target.classList.remove('highlight');
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
 *          SCROLL RELATED
 * 
 * 
 */

function custScrollAnimation() {
        /*      highlight parallax           */

        qsa('#projects img').forEach((ele)=> {
            let eleBounding = ele.getBoundingClientRect()
            let posM = eleBounding.top + eleBounding.height/2 - window.innerHeight/2
            let speed = posM * (ele.dataset.dist/100)
            ele.style.transform = `translateY(-50%) translate3d(0, ${-speed}px, 0)`
        })


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
            let projChosen = e.querySelector('.title').innerText.toLowerCase().replace(' ', '-');
            linkClick.centerSweep(ev.clientY, `./projects/${projChosen}.html`)
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

function userInteractions() {

    // handle contact hover clicks
    qsa('.buttonCells div').forEach((ele, index, parent) => {
        ele.addEventListener('click', () => changeContact(ele, index, parent))
    })

    // handle page clicks
    qsa('#about .button, .project, #buttonText div, #nav span').forEach((ele) => {
        ele.addEventListener('click', (event) => clickThrough(ele, event))    
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













































/*          Trigger relevant functions          */

processElements()
processCanvas()
intersections()

globalAnimationSetups()
aboutSetup()

userInteractions()
dateTimeContact()
scrollObservation()




// add the react class to everything
function recursiveChildLoop(element, matchingClass) {
    Array.from(element.children).forEach(child => {
        child.classList.add(matchingClass)
        recursiveChildLoop(child, matchingClass);
    });
}

qsa(`[class*="react"]`).forEach(ele => {
    const classList = Array.from(ele.classList);
    const matchingClass = classList.find(className => className.includes('react'));
    recursiveChildLoop(ele, matchingClass)
})
