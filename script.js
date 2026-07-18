var allJobs = [];
var filteredJobs = [];
var currentPage = 1;
var jobsPerPage = 6;
var totalPages = 0;


// card functions
function createCard(job) {
    return`
        <article class="job-card">
            <div class="card-top">
                <div class="company-logo">${job.title.slice(0,2).toUpperCase()}</div>
                <button class="save-btn">Save</button>
            </div>
            <div class="card-body">
                <h3 class="job-title">${job.title}</h3>
                <p class="company-name">Company ${job.userId} · ${job.location}</p>
                <div class="tags">
                    <span class="tag accent"> ${job.type} </span>
                    ${
                        job.skills.map(function (skill) { 
                            return `<span class="tag">${skill}</span>`
                         }).join('')
                    }
                    
                </div>
            </div>
            <div class="card-footer">
                <span class="salary">₹6–9 LPA</span>
                <span class="posted-date">Job #${job.id}</span>
            </div>
        </article>
    `;
}



function renderCards(jobs){
    $('#jobsgrid').renderJob(jobs);
    // Save button toggle
    // When renderCards() runs, it wipes the grid with innerHTML = '' and creates brand new buttons. Those new buttons don't have the 
    // event listener attached — your ('.save-btn') ran only once when the page loaded, before the API cards existed. 
    $('.save-btn').on('click', function(e) {
        e.stopPropagation();
        const saved = $(this).text().trim() === 'Saved';
        if (saved) {
            $(this).text('Save').css({'background': '', 'color': '', 'border-color': ''});
        }else{
            $(this).text('Saved').css({'background': 'var(--color-accent-light)', 'color': 'var(--color-accent)', 'border-color': 'var(--color-accent)'})
        }
    })
}

function getPageJobs(page) {
    var start = (page - 1 ) * jobsPerPage;
    var end = start + jobsPerPage;
    return filteredJobs.slice(start,end);
}

function renderPagination() {
    totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    var pageNumbers = $('#pageNumbers')
    pageNumbers.html('');

    //genrate a page number button 
    function addBtn(i) {
        var btn = `<button class="page-number  ${ i === currentPage ? 'active' : '' }" data-page = "${i}" >${i}</button>` 
        pageNumbers.append(btn);
    }

    function addDots() {
        pageNumbers.append('<span class="page-dots">...</span>');
    }

    // always show page 1
    addBtn(1);

    // dots after 1 if current page is far
    if (currentPage > 3){
        addDots();
    }

    // pages around current page
    for(var i = Math.max(2,currentPage -1 ); i <= Math.min(totalPages - 1, currentPage + 1); i++ ){
        addBtn(i);
    }

    // dots before last if current page is far from end
    if (currentPage < totalPages - 2){
        addDots();
    }

     // always show last page
    if (totalPages > 1) {
        addBtn(totalPages);
    }

    //disable prev button if we are in page 1 
    $('#prevBtn').prop('disabled', currentPage === 1);

    //disable next button if we reach in last page
    $('#nextBtn').prop('disabled', currentPage === totalPages);
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

        totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
        
        var savedPage = localStorage.getItem('currentPage'); // read the currentpage

        currentPage = savedPage ? parseInt(savedPage) : 1

        window.location.hash = 'page=' + currentPage;

        if(currentPage > totalPages){
            currentPage = 1;
        }
        renderCards(getPageJobs(currentPage));
        renderPagination()

        },
        error: function () { 
            console.log('something went wrong');
        }
    });

    //page number logic
    $(document).on('click','.page-number', function () { 
        var page = parseInt($(this).data('page'));
        currentPage = page;
        localStorage.setItem('currentPage',currentPage); // after refershing to remember the last page of before refershing
        window.location.hash = 'page=' + currentPage; // to page number in url
        renderCards(getPageJobs(currentPage));
        renderPagination();
     });

    // previous button
    $('#prevBtn').on('click', function(){
        if(currentPage > 1 ){
            currentPage--;

            localStorage.setItem('currentPage',currentPage); // after refershing to remember the last page of before refershing
            window.location.hash = 'page=' + currentPage;
            renderCards(getPageJobs(currentPage));
            renderPagination();
        }
    });

    //next button
    $('#nextBtn').on('click', function(){
        if(currentPage < totalPages){
            currentPage++;

            localStorage.setItem('currentPage',currentPage); // after refershing to remember the last page of before refershing
            window.location.hash = 'page=' + currentPage;
            renderCards(getPageJobs(currentPage));
            renderPagination();
        }
    })

    //search — runs every time user types
    $('#searchInput').on('input', function() {
        var searchText = $(this).val().toLowerCase();
        var filtered = allJobs.filter(function(job) {
            return job.title && job.title.toLowerCase().includes(searchText);
        });
        filteredJobs = filtered;
        currentPage = 1 ;
        renderCards(getPageJobs(currentPage));
        renderPagination();
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
        currentPage = 1 ;
        renderCards(getPageJobs(currentPage));
        renderPagination();
    });

    // side bar filter 
    $('input[type="checkbox"]').on('change', function() {
        var checkedLocations = [];
        var checkedExperience = []; 
        var checkedSkills = [];

        $('input[type="checkbox"]:checked').each(function() {
            console.log('checkbox changed!');
            
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
        currentPage = 1;

        renderCards(getPageJobs(currentPage));
        renderPagination();
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



//jest functionality
if (typeof module !== 'undefined') {
    module.exports = { createCard };
}