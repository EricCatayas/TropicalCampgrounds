// const Campground = require('../../models/campgrounds');  XX

var searchInput = document.querySelector('#searchInput');
var displayItemsUL = document.querySelector('#displaySearchItemsUl');
searchInput.addEventListener('input', function() {
    // confirmed
    displaySearchCampgrounds(this.value);
});

function displaySearchCampgrounds(title){
    displayItemsUL.innerHTML = "";    
    title = title.toLowerCase();
    if(title){
        if(campgrounds.some(item => item.title.toLowerCase().includes(title))){   // "If some item .. condition"
            campgrounds.forEach((campground, index) => {
                if (campground.title.toLowerCase().includes(title)) {
                    const newLi = document.createElement('li');          // Do not chain
                    newLi.classList.add("list-group-item","d-flex", "justify-content-between", "align-items-star");
                    const headingDiv = document.createElement('div');
                    headingDiv.classList.add("ms-2", "me-auto");
                    headingDiv.innerHTML = `<div class="fw-bold">${campground.title}</div> Location: ${campground.location}`;

                    newLi.appendChild(headingDiv);
                    displayItemsUL.appendChild(newLi);
                } 
            });
        } else {
            const newLi = document.createElement('li');
            newLi.className = "list-group-item d-flex justify-content-between align-items-star";
            const headingDiv = document.createElement('div');
            headingDiv.classList.add("ms-2", "me-auto");
            headingDiv.innerHTML = "<p>No campground was found</p>";

            newLi.appendChild(headingDiv);
            displayItemsUL.appendChild(newLi);
        }
    } else {
        displayItemsUL.innerHTML = ""; 
    }
}
    
        
    
    // <li class="list-group-item d-flex justify-content-between align-items-start">
    //     <div class="ms-2 me-auto">
    //         <div class="fw-bold">`${campgrounds.title}`</div>
    //         `Location: ${campgrounds.location}`
    //     </div>
    // </li>