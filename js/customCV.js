async function genPDF() { 

    // setup library for PDF manip
    const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib

    // Fetch an existing PDF document
    const url = '/test/blankCV.pdf'
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    pdfDoc.registerFontkit(fontkit)       
    // Get the first page of the document
    const pages = pdfDoc.getPages()

    // prepare dom pages and selected text for generation
    custCV.pages = []
    custCV.selectedText = []
    
    // push up the selected options
    qs('.custCV').querySelectorAll('.selected').forEach(v => {
        custCV.selectedText.push(custCV.qualities[parseInt(v.dataset.qindex)][1])

    })


    // set-up and generate pages for dom
    const cvPage = document.createElement('div')
    batchSet(cvPage, 'style', {
        position:'fixed',
        top:'0',
        left:'100%',    
        height:'842px',
        width:'595px',
        aspectRatio:custCV.A4ratio,
        backgroundColor: 'red',
        backgroundSize:'contain'
    })
    cvPage.classList.add('CVcanvas')

    for(let i = 0; i < pages.length; i++) {
        const DOMpage = cvPage.cloneNode()
        DOMpage.style.backgroundImage = `url(test/cv${i+1}.png)`
        document.body.appendChild(DOMpage)
        custCV.pages.push(DOMpage)
    }

//    custCV.pages[1].style.left = "600px"
    // setup styles to use
    custCV.styles = {
        subheadline: Object.assign(document.createElement('div'), { className: 'subheadline' }),
        body: Object.assign(document.createElement('div'), { className: 'bodtext' }),
        bodyReturn: Object.assign(document.createElement('div'), { className: 'bodytextReturn' })
    }

    
    // Bespoke CV segmented application and lazy attach
    const p1zone = document.createElement('div')

    batchSet(p1zone, 'style', {
        background:'lime',
        opacity:0.6,
        position:'absolute',
        top:'51.9%',
        left:'8%',
        width:'57.4%',
        height:'37.5%',
    })

    const p2zone = p1zone.cloneNode()
    batchSet(p2zone, 'style', {
        top:'8.2%',
        height:'81.3%'
    })
    custCV.pages[0].appendChild(p1zone)
    custCV.pages[1].appendChild(p2zone)



    // testing top area print
    const box = document.createElement('div')
    batchSet(box, 'style', {
        position:'relative',
        top:'25.4%',
        left:'8%',
        width:'57%',
        height:'64.2%',
    })
    custCV.pages[0].appendChild(box)
    const body = document.createElement('span')
    body.classList.add('bodytext')
    const bodyReturn = document.createElement('span')
    bodyReturn.classList.add('bodytextReturn')
    const subheadline = document.createElement('span')
    subheadline.classList.add('subheadline')
    subheadline.innerText = 'Professional Profile'
    body.innerText = `I am solution-focused with a proven track record of driving key business objectives. My expertise lies in taking problems and engineering best-in-class holistic solutions. This approach has led to a multi-faceted background in product, design, development, and leadership, as I do whatever it takes to reach my solutions.` 
    const body2 = body.cloneNode()
    body2.innerText = `I am equally at home optimising code or deep-diving data, as I am advocating for process or procedural strategic change. Whether on the frontlines or in planning, I thrive in problem-solving. Recently returning from a year-long global journey – from the jungles of Laos to the deserts of Rajasthan – I am recharged and excited to contribute my expertise to the next exciting project.`
    box.appendChild(subheadline)
    box.appendChild(body)
    box.appendChild(body2)
    const relSkill = document.createElement('span')
    relSkill.classList.add('subheadline')
    relSkill.innerText = 'Relevant Skills'
    box.appendChild(relSkill)    
    // testing top area print





    // create a block of text off a string and append it to the correct parent
    function appendBlock(parent, ele, txt) {
        const block = ele.cloneNode()
        block.innerHTML = txt
        parent.appendChild(block)
        const styles = scanStyle(block)
        splitBlock(block, styles)
        setTimeout(()=>unifyLines(block),500)
    }

    function scanStyle(block) {
        const styles = []
        block.querySelectorAll('*').forEach(e => {
            const tempObj = {
                style: e.classList.value, 
                txt: e.innerText, 
                complied: e.innerText.replaceAll(' ','')+'',
                spans: []
            }
            styles.push(tempObj)
        })
        return styles;
    }

    // split each each word into a span and apply the correct class
    function splitBlock(block, styles) {
        split = block.innerText.split(' ')
        split.forEach((text,i) => {
            let appliedClass = 'none'
            split[i] = `<span class = '${appliedClass}'>${text}</span>&nbsp;`            
        })
        block.innerHTML = split.join('')
        block.querySelectorAll('span').forEach(e => {
            styles.forEach(v => {
                if(v.complied.indexOf(e.innerHTML) == 0) {
                    v.spans.push(e)
                    v.complied = v.complied.replace(e.innerHTML,'')
                    if(v.complied.length == 0) {
                        v.spans.forEach(span => span.classList.add(v.style))
                    }
                } else {
                    v.complied = v.txt.replaceAll(' ','')+''
                    v.spans = []
                }
            })            
        })
    }

    // determine what should be joined, check if it has the same class, and is on the same line then join the spans
    function unifyLines(block) {

        let joinBlob = []
        let newStructure = ''
        let prev = null
        if(block.querySelectorAll('span').length === 1) return; 
        block.querySelectorAll('span').forEach((e,i,a) => {
            if(prev !== null) {
                const prevBB = prev.getBoundingClientRect()
                const eBB = e.getBoundingClientRect()
                if(prevBB.top == eBB.top && prev.classList.value == e.classList.value && i !== a.length-1) {
                    joinBlob.push(e)
                    prev = e
                } else {
                    if(i == a.length-1 && prevBB.top !== eBB.top) {
                        joinBlob = []
                        joinBlob.push(e)
                    } else if(i == a.length-1) {
                        joinBlob.push(e)
                    }
                    let newString = ''
                    const classlist = joinBlob[0].classList
                    joinBlob.forEach(t => {
                        newString += t.innerHTML + ' '
                    })
                    newStructure += `<span class='${classlist}'>${newString}</span>`
                    joinBlob = []
                    if(i !== a.length-1) {
                        newStructure += '&nbsp;'
                        joinBlob.push(e)
                    }
                    prev = e
                }
            } else {
                joinBlob.push(e)
                prev = e
            }
        })
        block.innerHTML = newStructure
    }

    // append and make
    custCV.selectedText.forEach(v=>{
        appendBlock(p1zone, body, v)
        const lastChild = p1zone.children[p1zone.children.length-1]
        const pBB = p1zone.getBoundingClientRect()
        const vBB = lastChild.getBoundingClientRect()

        if(pBB.bottom < vBB.bottom) {
            p2zone.appendChild(lastChild)
        }
    })





    appendBlock(p2zone, subheadline, 'Work Experience')
    p2zone.children[p2zone.children.length - 1].style.marginBottom = '4px'
    const CVtl = new Image()
    CVtl.src = 'test/cvTimeline.png'
    batchSet(CVtl, 'style', {
        float:'left',
        marginTop:'1%',
        marginLeft:'1%',
        paddingRight:'2%',
        height:'27%',
        width:'auto'
    })
    p2zone.appendChild(CVtl)
    appendBlock(p2zone, bodyReturn, '<span class = "bodyBold">PLAYGROUND XYZ — 2019 - 2023</span>')
    appendBlock(p2zone, bodyReturn, 'Product Manger // Head of Design')
    appendBlock(p2zone, bodyReturn, 'APAC Design Lead')
    appendBlock(p2zone, body, 'Creative Technologist')

    appendBlock(p2zone, bodyReturn, '<span class = "bodyBold">JCDecaux Australia — 2015 - 2019</span>')
    appendBlock(p2zone, bodyReturn, 'Creative Solutions Head Digital Project Manager')
    appendBlock(p2zone, bodyReturn, 'Creative Solutions Project Manager')
    appendBlock(p2zone, body, 'Graphic Designer')

    appendBlock(p2zone, bodyReturn, '<span class = "bodyBold">ANZ Wealth Division — 2012 - 2015</span>')
    appendBlock(p2zone, bodyReturn, 'Snr. Second lvl Data Quality Support Specialist')
    appendBlock(p2zone, bodyReturn, 'Second lvl Data Quality Support Specialist')
    appendBlock(p2zone, body, 'Customer Support Specialist')

    appendBlock(p2zone, subheadline, 'Education')
    appendBlock(p2zone, bodyReturn, 'University of Wollongong — Graphic Design & New Media Arts')
    appendBlock(p2zone, body, 'Double Bachelor Degree in Graphic Design & New Media Arts')
    appendBlock(p2zone, body, 'Cert IV in Small Business Management')

    cvPageBB = cvPage.getBoundingClientRect()

    

  /// -------------------------------------------------   
    
    async function modifyPDF() {
        custCV.fonts = {}

        const bespokeURL = 'https://assets.playground.xyz/JWhitmore/e6e57092_BespokeSerif-Regular.ttf'
        const bespokeByte = await fetch(bespokeURL).then(res => res.arrayBuffer())
        custCV.fonts.Bespoke = await pdfDoc.embedFont(bespokeByte)
        
        const bespokeBoldURL = 'https://assets.playground.xyz/JWhitmore/bb290cd8_BespokeSerif-Bold.ttf'
        const bespokeBoldByte = await fetch(bespokeBoldURL).then(res => res.arrayBuffer())
        custCV.fonts.BespokeBold = await pdfDoc.embedFont(bespokeBoldByte)

        const butlerBlackURL = 'https://assets.playground.xyz/JWhitmore/a95fe014_Butler_Black.ttf'
        const butlerBlackByte = await fetch(butlerBlackURL).then(res => res.arrayBuffer())
        custCV.fonts.ButlerBlack = await pdfDoc.embedFont(butlerBlackByte)        

        custCV.imgs = []
        for (const img of qsa('.CVcanvas img')) {
            const imgURL = img.src
            const imgType = img.src.split('.').reverse()[0]
        
            const imgBytes = await fetch(imgURL).then((res) => res.arrayBuffer())
            const imgEmbed = await pdfDoc[(imgType == 'png') ? 'embedPng' : 'embedJpg'](imgBytes)
            custCV.imgs.push(imgEmbed);
        }    

        // Draw a string of text diagonally across the first page
        custCV.pages.forEach((page, pageIndex) => {
            const { width, height } = pages[pageIndex].getSize()
            const pBB = page.getBoundingClientRect()

            page.querySelectorAll('span span').forEach(v=>{
                const csv = getComputedStyle(v)
                const font = csv.fontFamily.split(',')[0]
                const colVal = csv.color.match(/\d+/g).map(Number);
                const vBB = v.getBoundingClientRect()
                pages[pageIndex].drawText(v.innerText, {
                    x: width*((vBB.left - pBB.left)/pBB.width),
                    y: height*((pBB.bottom - vBB.bottom)/pBB.height)+parseInt(csv.fontSize)/2,
                    size:parseInt(csv.fontSize),
                    font: custCV.fonts[font],
                    color: rgb(colVal[0]/255, colVal[1]/255, colVal[2]/255)
                })
            })

            page.querySelectorAll('img').forEach((img, i) => {
                const imgBB = img.getBoundingClientRect();            
                const imgDim = custCV.imgs[i].scale(img.clientHeight/img.naturalHeight)

                pages[pageIndex].drawImage(custCV.imgs[i], {
                    x: width*((imgBB.left - pBB.left)/pBB.width),
                    y: height*((pBB.bottom - imgBB.bottom)/pBB.height),
                    width: imgDim.width,
                    height: imgDim.height
                })
            })

        })
    

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save()

        download(pdfBytes, "JWhitmore-CV.pdf", "application/pdf");

    }
    setTimeout(modifyPDF,1000)
}