let roverInfoStore = Immutable.Map({
    currentTab: 'curiosity',
})
let newStoreImg = Immutable.Map();
let newStoreInfo =Immutable.Map();
let finalState =Immutable.Map();


// add our markup to the page
const root = document.getElementById('root');
const tabs= document.querySelectorAll('.tab');

const updateStore = (roverInfoStore, newState) => {
    if(newState.roverInfo)
        newStoreInfo = roverInfoStore.set("roverInfo", newState.roverInfo)
    if(newState['roverImages'])
        newStoreImg = roverInfoStore.set("roverImages", newState['roverImages'])
    if(newStoreInfo && newStoreImg)
        finalState = roverInfoStore.merge(newStoreImg, newStoreInfo)
    render(root, finalState)
}

const render = async (root, finalState) => {
    root.innerHTML = App(finalState, renderInfo, renderImages)
}

const App = (finalState, renderInfo, renderImages) => {
    const roverInfo = finalState.get('roverInfo')
    const roverImages = finalState.get('roverImages')
    return generateHTML(roverInfo, roverImages, renderInfo, renderImages);
}

// higher order function
const generateHTML = (roverInfo, roverImages, generateInfo, generateImage) => {
    if(!roverInfo) return;
    const infoHTML= generateInfo(roverInfo);
    const imageHTML= generateImage(roverImages);
    return `
        <div>
            <div class="info-container">
                ${infoHTML}
            </div>
            <section class="image-container">
                ${imageHTML}
            </section>
        </div>
    `
}

const fetchData = async (roverInfoStore, currentTab) => {
    await getRoverData(roverInfoStore, currentTab);
    await getRoverImages(roverInfoStore, currentTab);
}

// listening for load event
window.addEventListener('load', async () => {
    init(tabs, roverInfoStore);
    await fetchData(roverInfoStore, "curiosity");

})

const init = async (tabs, roverInfoStore) => {
    tabs.forEach(tab => {
        tab.addEventListener('click',async e => {
            const currentTab = e.target.id;
            await updateStore(roverInfoStore, {currentTab: currentTab});
            activeTab(tabs, currentTab);
            fetchData(roverInfoStore, currentTab);
        })
    });
}

const activeTab = (tabs, currentTab) => {
    tabs.forEach(tab => {
        if(tab.id === currentTab){
            tab.classList.add('active')
        }else{
            tab.classList.remove('active')
        }
    })
}

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information --
const renderInfo = (info) => {
    if(!info) return;
    return `
        <figure>
            <img src="${info.imageUrl}" alt="${info.name}" class="main-rover-img"/>
            <figcaption>An image of ${info.name} rover</figcaption>
        </figure>

        <div class="info">
            <strong>About</strong>
            <p>${info.about}</p>
            <br/>
            <strong>Status</strong>
            <p>${info.status}</p>
            <br/>
            <strong>Launch Date</strong>
            <p>${info.launch_date}</p>
            <br/>
            <strong>Landing Date</strong>
            <p>${info.landing_date}</p>
            <br/>
            <strong>Total Photos</strong>
            <p>${info.total_photos}</p>
            <br/>
        </div>
    `
}
// A pure function that renders images requested from the backend
const renderImages = (images) => {

    let imageHTML=``;
    // Mine: here map() is also a higher order function
    images.slice(0,6).map(image => {
        imageHTML+=`
                    <figure class="image-card">
                        <img src="${image.img_src}" alt="Rover image" class="rover-image"/>
                        <figcaption>
                            <span><b>Earth date:</b> ${image.earth_date}</span>
                        </figcaption>
                    </figure>`
    })
    return imageHTML;
}

// ------------------------------------------------------  API CALLS
const getRoverData = (roverInfoStore, roverName) => {
    fetch(`http://localhost:3000/roverInfo`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({roverName:roverName})
    })
        .then((res) => {
            if (res.ok) {
            return res.json();
            } else {
            throw new Error('Something went wrong');
            }
        })
        .then(roverInfo => updateStore(roverInfoStore, { roverInfo: roverInfo }))
        .catch((error) => {
            console.log(error)
        })
}

const getRoverImages = (roverInfoStore,roverName) => {
    fetch(`http://localhost:3000/fetchImage`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({roverName:roverName})
    })
        .then((res) => {
            if (res.ok) {
            return res.json();
            } else {
            throw new Error('Something went wrong');
            }
        })
        .then(roverImages => updateStore(roverInfoStore, { roverImages: roverImages }))
        .catch((error) => {
            console.log(error)
        })
}