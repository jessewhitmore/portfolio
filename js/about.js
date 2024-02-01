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

    /*          generateScreens to titles           */
    
    generateScreen(qs('.secHeader'))    

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
contactSetup()



