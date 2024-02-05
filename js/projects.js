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
    
    const gal = new gallery()    
    let imz = ['../img/test.jpg', '../img/test.jpg', '../img/test.jpg', '../img/test.jpg', '../img/test.jpg', '../img/test.jpg', '../img/test.jpg', '../img/test.jpg', '../img/test.jpg', '../img/test.jpg']
//    gal.setup(imz, qs('#gal'), true)

    /*          sizing issues           */
    qs('#buttonText').style.width = qs('#buttonText .defaultState').clientWidth+'px'


    /*          generateScreens to titles           */

//    generateScreen(qs('.secHeader'))


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
    

    /*          Velocity and parallax setup attribute setup           */



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
intersections()


userInteractions()
contactSetup()





/* SVG generation

        // Create an SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', clickedSpecs.width);
        svg.setAttribute('height', clickedSpecs.height);
  
        // Create a rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', clickedSpecs.width);
        rect.setAttribute('height', clickedSpecs.height);
        rect.setAttribute('stroke', 'black');
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('fill', 'transparent');
  
        const rect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect2.setAttribute('width', clickedSpecs.width);
        rect2.setAttribute('height', clickedSpecs.height);
        rect2.setAttribute('transform-origin', `${clickedSpecs.width/2} ${clickedSpecs.height/2}`)
        rect2.setAttribute('stroke', 'black');
        rect2.setAttribute('stroke-width', '2');
        rect2.setAttribute('transform','scale(-1,-1) rotate(180)')
        rect2.setAttribute('fill', 'transparent');
  

        // Append the rectangle to the SVG
        svg.appendChild(rect);
        svg.appendChild(rect2);
  
        // Append the SVG to the body
        div.appendChild(svg);
  
        // Get the length of the rectangle's perimeter
        const rectLength = rect.getTotalLength();
  
        // Set the stroke-dasharray and stroke-dashoffset properties to create a dashed line
        rect.style.strokeDasharray = rectLength;
        rect.style.strokeDashoffset = rectLength;
        rect2.style.strokeDasharray = rectLength;
        rect2.style.strokeDashoffset = rectLength;
    
        // Add the animation
        rect.style.animation = 'strokeFillLeft 1s forwards';
        rect2.style.animation = 'strokeFillLeft 1s forwards';
  
        // Remove the SVG element after the animation is complete
        // setTimeout(() => {
        //   document.body.removeChild(svg);
        // }, 1000);    





function zoomable(event, target) {


    let = zoomLayer = document.createElement('div')
    zoomLayer.classList.add('zoomLayer')
    
    let img = new Image()
    img.src = target.src

    let div = document.createElement('div')
    
    let bounding = target.getBoundingClientRect()
    let clickedSpecs = {
        x: bounding.left - props.rem/2,
        y: bounding.top - props.rem/2,
        width: bounding.width + props.rem,
        height: bounding.height + props.rem,
    }


    gsap.set(div, clickedSpecs)

    zoomLayer.appendChild(div).appendChild(img)
    qs('.linkClick').insertAdjacentElement('beforebegin', zoomLayer);





//    qs('#nav').insertAdjacentElement('beforebegin', zoomLayer);
    gsap.to(zoomLayer, {'backdrop-filter':'blur(5px)', background:`rgba(${props.secondaryCol}, 0.2)`, duration: 1})
    gsap.to(div, {x:0, y:0, width:'100%', height:'100%', duration: 0.8, delay:0.2})


}




const container = document.querySelector('#wrapper');

container.addEventListener('click', function(event) {
  if (event.target.classList.contains('zoomable')) {

    zoomable(event, event.target)
    
  }
});

*/

let DGtracking = new dynamicGallery()
DGtracking.setup(qs('.galleryTest'), '.DGhook1')

