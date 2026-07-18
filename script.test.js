// const { test } = require('picomatch');
var { createCard } = require('./script');
// const { default: expect } = require('expect');

test('createCard returns an article element', function() {
    var job = { id: 1, userId: 1, title: 'Frontend Developer', type: 'Full-time',skills:[] };
    var result = createCard(job);
    expect(result).toContain('<article');
});

test('allJobs should have 6 items after slice', function() {
    var fakeData = [
        { id: 1, userId: 1, title: 'Frontend Developer' },
        { id: 2, userId: 1, title: 'UI Developer' },
        { id: 3, userId: 2, title: 'Web Developer' },
        { id: 4, userId: 2, title: 'CSS Developer' },
        { id: 5, userId: 3, title: 'JS Developer' },
        { id: 6, userId: 3, title: 'React Developer' },
        { id: 7, userId: 4, title: 'Extra Job' },
    ];
    var result = fakeData.slice(0, 6);
    expect(result.length).toBe(6);
});

test('createCard contains the job title', function() {
    var job = { id: 1, userId: 1, title: 'Frontend Developer', type: 'Full-time',skills:[] };
    var result = createCard(job);
    expect(result).toContain('Frontend Developer');
});

test('createCard contains the job type', function() {
    var job = { id: 1, userId: 1, title: 'Frontend Developer', type: 'Full-time',skills:[] };
    var result = createCard(job);
    expect(result).toContain('Full-time');
});

test('filter returns only matching job type', function() {
    var jobs = [
        { id: 1, title: 'Frontend Developer', type: 'Full-time', skills:[] },
        { id: 2, title: 'UI Developer', type: 'Remote' , skills:[]},
        { id: 3, title: 'Web Developer', type: 'Full-time' , skills:[]},
    ];
    var filtered = jobs.filter(function(job) {
        return job.type === 'Full-time';
    });
    expect(filtered.length).toBe(2);
});

//aside filter test cases

test('createcard contains job location', function(){
    var job ={ 
        id : 1,
        title : 'Frontend Developer', 
        type:'Full-time' ,
        location : 'Mumbai',
        exerience :'Mid level',
        skills:['HTML5', 'CSS3']
    };
    var result = createCard(job);
    expect(result).toContain('HTML5');
});