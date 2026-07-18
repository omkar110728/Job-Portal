import { renderCards } from "./render.js";
import { getPageJobs, renderPagination } from "./pagination.js";

var allJobs = [];
var filteredJobs = [];
var currentPage = 1;
var jobsPerPage = 6;
var totalPages = 0;


// This single function replaces all repeated calls to renderCards() and renderPagination() in your click, search, and filter events.
function updateUI(shouldRestPage = false) {
    // Recalculate total pages based on filteredJobs
    totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    
    if(shouldRestPage){
        currentPage = 1 ;
    }

    // ensure currentpage is valid 
    if(currentPage > totalPages)
    {
        currentPage = 1;
    }

    if(filteredJobs.length === 0 )
    {
        document.querySelector('jobs-grid').innerHTML = "No Jobs found"
    }

    // render card from current page 
    renderCards(getPageJobs(currentPage, filteredJobs , jobsPerPage));

    //render pagination
    renderPagination(currentPage , totalPages);

    //update url hash for page state
    window.location.hash = 'page=' + currentPage;

    //save currentpage in localstorage
    localStorage.setItem('currentPage',currentPage); // after refershing to remember the last page of before refershing
}

// render or add cards automatically from api data  
if (typeof $ !== 'undefined'){
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/posts",
        method:'get',
        success: function (data) {
            allJobs = data.map(function(job,index){
            var types = ['Full-time','Part-time','Contract','Remote']
            var locations  = ['Mumbai', 'Remote', 'Bangalore', 'Pune', 'Hyderabad'];
            var experience = ['Entry level', 'Mid level', 'Senior', 'Lead'];    
            var skillsPool = ['HTML5','CSS3','JavaScript','jQuery','CMS','React','XHTML'];

            job.type = types[index % types.length];
            job.location = locations[index % locations.length];
            job.experience = experience[index % experience.length];
            job.skills = skillsPool.slice(index % 4 , (index % 4) + 3);

            return job;
        });

        filteredJobs = allJobs;
        // totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
        var savedPage = localStorage.getItem('currentPage'); // read the currentpage
        var hashpage = parseInt(window.location.hash.split('=')[1]);
        currentPage = hashpage || currentPage || 1;
        updateUI(false);

        },
        error: function () { 
            console.log('something went wrong');
        }
    });

    //page number logic
    $(document).on('click','.page-number', function () { 
        var page = parseInt($(this).data('page'));
        currentPage = page;
        updateUI(false);
     });

    // previous button
    $('#prevBtn').on('click', function(){
        if(currentPage > 1 ){
            currentPage--;
            updateUI(false)
        }
    });

    //next button
    $('#nextBtn').on('click', function(){
        if(currentPage < totalPages){
            currentPage++;
            updateUI(false);
        }
    })

    //search — runs every time user types
    $('#searchInput').on('input', function() {
        var searchText = $(this).val().toLowerCase();
        var filtered = allJobs.filter(function(job) {
            return job.title && job.title.toLowerCase().includes(searchText);
        });
        filteredJobs = filtered;
        updateUI(true)
    })
    

    // Filter job type toggle (active state)
    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        var selectedType = $(this).text().trim();
    
        if(selectedType === 'All'){
            filteredJobs = allJobs;
        }
        else{
            filteredJobs = allJobs.filter(function (job) { 
                return job.type === selectedType;
             })
        }
        // currentPage = 1 ;
       
        updateUI(true)
    });

    // side bar filter 
    $('input[type="checkbox"]').on('change', function() {
        var checkedLocations = [];
        var checkedExperience = []; 
        var checkedSkills = [];

        $('input[type="checkbox"]:checked').each(function() {
            
            
            var filter = $(this).data('filter');
            var value = $(this).data('value');

            if (filter === 'location') {
                checkedLocations.push(value);
            }

            if (filter === 'experience') {
                checkedExperience.push(value);
            }

            if (filter === 'skills') {
                checkedSkills.push(value);
            }
        });

        var filtered = allJobs.filter(function(job) { 
            var locationMatch = checkedLocations.length === 0 || checkedLocations.includes(job.location);
            var experienceMatch = checkedExperience.length === 0 || checkedExperience.includes(job.experience);

            var skillMatch = checkedSkills.length === 0 || checkedSkills.some(function (skill) { 
                return job.skills.includes(skill);
            });
            return locationMatch && experienceMatch && skillMatch;
        })
        filteredJobs = filtered;
        // true → reset currentPage to 1
        // currentPage = 1;
        updateUI(true);// true → reset currentPage to 1
    })

    //plugins
    $.fn.renderJob = function(jobs) {
        var $el = this;
        $el.html('');

        if (Array.isArray(jobs)){
            jobs.forEach(function (job) { 
                $el.append(createCard(job))    
            })
        }
        else{
            $el.append(createCard(jobs))
        }
        return this;
    }
}


//we can change the page using url
window.addEventListener('hashchange', function(){
    // Get the current URL hash
    var hash = window.location.hash;
    // Extract the number after
    var page = parseInt(hash.split('=')[1]);

    if(page){
        currentPage = page; // update the current state
    }
    updateUI(false); // Re-render cards and pagination without resetting page to 1
    
})

window.scrollTo({
    top: 0 , 
    bhavior: 'smooth',
})