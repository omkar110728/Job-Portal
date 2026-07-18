// card functions
export function createCard(job) {
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

// Save button toggle
// When renderCards() runs, it wipes the grid with innerHTML = '' and creates brand new buttons. Those new buttons don't have the 
// event listener attached — your ('.save-btn') ran only once when the page loaded, before the API cards existed.  
//we return outside function becoz we will use dynamically and Attach once to parent and Automatically works for new elements and Faster and cleaner
$(document).ready(function () { 
    $('#jobsgrid').on('click', '.save-btn', function(e) {
        e.stopPropagation();
        const saved = $(this).text().trim() === 'Saved';
        if (saved) {
            $(this).text('Save').css({'background': '', 'color': '', 'border-color': ''});
        }else{
            $(this).text('Saved').css({'background': 'var(--color-accent-light)', 'color': 'var(--color-accent)', 'border-color': 'var(--color-accent)'})
        }
    });
})

export function renderCards(jobs){
    const $el = $('#jobsgrid');
    $el.html('');
    jobs.forEach(job => $el.append(createCard(job)));
    
}

