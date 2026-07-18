export function getPageJobs(page,filteredJobs, jobsPerPage) {
    const start = (page - 1 ) * jobsPerPage;
    const end = start + jobsPerPage;
    return filteredJobs.slice(start,end);
}

export function renderPagination(currentPage, totalPages) {
    
    const pageNumbers = $('#pageNumbers')
    pageNumbers.html('');

    //genrate a page number button 
    function addBtn(i) {
        const btn = `<button class="page-number ${ i === currentPage ? 'active' : '' }" data-page = "${i}" >${i}</button>` 
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
    for(let i = Math.max(2,currentPage -1 ); i <= Math.min(totalPages - 1, currentPage + 1); i++ ){
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