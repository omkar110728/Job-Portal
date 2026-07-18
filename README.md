# Workly — Job Board

A dynamic job board website built as a learning project to practice frontend development skills.

## Live Demo
Open `job.html` with Live Server in VS Code

## Features
- Fetch real data from API using jQuery $.ajax
- Live search — filters cards as you type
- Filter by job type (Full-time, Part-time, Contract, Remote)
- Sidebar filters by location, experience and skills
- Pagination with numbered pages
- Remembers current page on refresh using localStorage and URL hash
- Unit tested with Jest

## Tech Stack
- HTML5 — semantic markup
- CSS3 — responsive grid, CSS variables
- JavaScript — array methods, DOM manipulation
- jQuery — $.ajax, event delegation, $.fn plugin
- Jest — unit testing

## Project Structure
- job.html        → main HTML file
- job.css         → all styles
- main.js         → fetch, events, updateUI
- render.js       → createCard, renderCards
- pagination.js   → getPageJobs, renderPagination
- script.test.js  → Jest unit tests

## Dependencies

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| Jest | ^30.3.0 | Unit testing |

### CDN Dependencies (no install needed)
| Package | Version | Purpose |
|---------|---------|---------|
| jQuery | 3.7.1 | DOM manipulation, AJAX, events |
| Google Fonts | — | Syne + DM Sans typography |

## How to Run
1. Clone this repository
2. Open in VS Code
3. Right click `job.html` → Open with Live Server

## How to Run Tests
1. Open terminal in VS Code
2. Run `npm install`
3. Run `npm test`

## Author
Omkar