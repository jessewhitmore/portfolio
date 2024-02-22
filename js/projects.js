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
    

    qsa('.gals').forEach(v => {
        let imgs = []
        let caption = []
        v.querySelectorAll('img').forEach(i => {
            imgs.push(i.src)
            if(i.alt.length > 0) { caption.push(i.alt) } else { caption.push(null) }
        })
        const gal = new gallery()
        v.innerHTML = '';
        gal.setup(imgs, v, caption)
    })



    /*          pushable element creation           */

    if(!props.mobile) {
        for(let ele of qsa('.pushable')) {
            wrapContent(ele, 'push')
        }
    }



    let url = window.location.pathname.split('/').pop().split('.')[0].replaceAll('_',' ')

    if(url == 'new format velocity') url = 'new format: velocity'

    const projectIndex =  projectManifest.findIndex(obj => obj.title.toLowerCase() === url);
    const prevProjectIndex = (projectIndex === 0) ? projectManifest.length-1 : projectIndex - 1
    const nextProjectIndex = (projectIndex === projectManifest.length-1) ? 0 : projectIndex + 1

    document.querySelector(':root').style.setProperty('--prev-project', `'${projectManifest[prevProjectIndex].title}'`)
    document.querySelector(':root').style.setProperty('--next-project', `'${projectManifest[nextProjectIndex].title}'`)
  
    qs('#projectNavigator .previous').addEventListener('click', ev => {
        linkClick.centerSweep(ev.clientY, `./${projectManifest[prevProjectIndex].title.toLowerCase().replaceAll(':','').replaceAll(' ','_')}.html`)
    })

    qs('#projectNavigator .next').addEventListener('click', ev => {
        linkClick.centerSweep(ev.clientY, `./${projectManifest[nextProjectIndex].title.toLowerCase().replaceAll(':','').replaceAll(' ','_')}.html`)
    })    
    
    wrapProcessing()


    let buttonShaS = 7; // Adjust this variable as needed
    let buttonSha = `-${0.0625 / buttonShaS}em -${0.0625 / buttonShaS}em 0 rgba(255,255,255, 0.2),
                  ${0.0625 / buttonShaS}em -${0.0625 / buttonShaS}em 0 rgba(255,255,255, 0.3),
                  -${0.0625 / buttonShaS}em ${0.0625 / buttonShaS}em 0 rgba(255,255,255, 0.2),
                  ${0.0625 / buttonShaS}em ${0.0625 / buttonShaS}em 0 rgba(255,255,255, 0.3),
                  0 -${0.125 / buttonShaS}em ${1.2 / buttonShaS}em,
                  0 0 ${0.125 / buttonShaS}em,
                  0 0 ${0.3125 / buttonShaS}em rgba(255,126,0,0.5),
                  0 0 ${5.9375 / buttonShaS}em rgba(255, 68, 68,0.6),
                  0 0 ${0.125 / buttonShaS}em rgba(255,126,0,0.5),
                  0 ${0.125 / buttonShaS}em ${0.1875 / buttonShaS}em rgba(0,0,0,0.7)`;    
    qsa('#projectNavigator .button').forEach(v => {
        v.style.boxShadow = buttonSha
    })


    qsa('.col > div').forEach(v => {
        if(v.children[0].classList.contains('subHeader')) {
            v.parentElement.style.marginTop = '2.5em'
        }
    })

    
    props.parallax =  qsa('.para')
    const windowHeight = window.innerHeight
    props.parallax.forEach(obj => {
        
        const aspect = obj.naturalWidth / obj.naturalHeight

        const tA = 1700 * aspect
        obj.style.minWidth = tA+'px'



        obj.style.marginTop = -obj.offsetHeight/2 + 'px'  
        
        const parent = obj.parentElement.getBoundingClientRect()   
        const mid = window.scrollY + parent.top + (parent.height / 2)
        const halfHeight = window.innerHeight / 2

        const relativePos = (window.scrollY + halfHeight - mid)
        const speed = relativePos * (obj.dataset.dist/100)
        obj.style.position = "absolute"
        obj.style.left = "50%"
        obj.style.transform = `translateX(-50%) translateY(${speed}px)`
        
    })




}


function parallax() {

    props.parallax.forEach(obj => {
        const parent = obj.parentElement.getBoundingClientRect()   
        const mid = window.scrollY + parent.top + (parent.height / 2)
        const halfHeight = window.innerHeight / 2

        const relativePos = (window.scrollY + halfHeight - mid)
        const speed = relativePos * (obj.dataset.dist/100)
        obj.style.transform = `translateX(-50%) translateY(${speed}px)`
    })

}

function uLoaded() {

    setTimeout(()=>{
        qsa('iframe').forEach(v => {

            v.src = v.dataset.src
    
            batchSet(v, 'style', {
                width:'100%',
                height:'auto',
                aspectRatio: v.getAttribute('width')/v.getAttribute('height'),
                padding: '0.25em 0 0.75em'
            })
    
            v.removeAttribute('height')
            v.removeAttribute('width')
    
        })
    },500)

}



function uDuringResizer() {
    qs('#headerImage img').style.opacity = 0;

}

function uResizer() {
    const windowHeight = window.innerHeight
    qs('#headerImage img').style.opacity = 1;

    props.parallax.forEach(obj => {
        obj.style.marginTop = -obj.offsetHeight/2 + 'px'  
        
        const parent = obj.parentElement.getBoundingClientRect()   
        const mid = window.scrollY + parent.top + (parent.height / 2)
        const halfHeight = window.innerHeight / 2

        const relativePos = (window.scrollY + halfHeight - mid)
        const speed = relativePos * (obj.dataset.dist/100)
        obj.style.transform = `translateX(-50%) translateY(${speed}px)`
        
    })

}


function uScroll() {
    parallax()
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










































/*          Trigger relevant functions          */

processElements()
intersections()
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

// let DGtracking = new dynamicGallery()
// DGtracking.setup(qs('.galleryTest'), '.DGhook1')

// let DGtracking2 = new dynamicGallery()
// DGtracking2.setup(qs('.galleryTest2'), '.DGhook2', 'right')
