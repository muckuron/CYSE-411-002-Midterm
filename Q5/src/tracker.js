// ============================================================
//  CYSE 411 – Mid-Term Exam V2  |  Q5 Starter File
//  Incident Tracker Application


//  Application State

const ACCEPTED_SEVERITIES = ["low", "medium", "high", "critical"];
const ACCEPTED_FILTERS    = ["all", "low", "medium", "high", "critical"];

// Current filter selection (set during state load, used on save)
let currentFilter = "all";



//  Q5.C  Dashboard State – Load
//  Reads the last selected filter from localStorage.
//  VULNERABILITY: JSON.parse is called without a try/catch.
//  The stored filter value is used without checking whether
//  it belongs to the accepted list.


function loadDashboardState() {
    const raw   = localStorage.getItem("dashboardState");
    const state = JSON.parse(raw);             // No try/catch
    currentFilter = state.filter;              // No enum validation
    applyFilter(currentFilter);
}


//  Q5.C  Dashboard State – Save
//  Writes the selected filter back to localStorage after a fetch.
//  VULNERABILITY: The raw value from the DOM input is written
//  directly to localStorage without validating it against the
//  accepted list.

function saveDashboardState() {
    const filterInput = document.getElementById("filter-select");
    try {
        if (ACCEPTED_FILTERS.includes(filterInput.value))
        {
            const filter = filterInput.value;
        }
         
    } catch (error) {
        console.error("Error parsing dashboard state:", error);
        filter = "all";
    }
   
    localStorage.setItem("dashboardState", JSON.stringify({ filter: filter }));
    currentFilter = filter;
}



//  Q5.A  Fetch Incidents
//  Retrieves open incidents from the REST API.
//  VULNERABILITY 1: fetch() is called but NOT awaited.
//    'res' holds a Promise, not a Response object.
//  VULNERABILITY 2: response.ok is never checked, so
//    HTTP 401 / 500 error bodies are processed as valid data.
//  VULNERABILITY 3: No try/catch – a network failure will
//    crash the function with an unhandled rejection.


async function fetchIncidents() {
    try {
        const res  = await fetch("/api/incidents");
        const data = await res.json();           
        if (res.ok != true) {
            throw('HTTP error: ' + res.status);
        }
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
    
}



//  Q5.B  Render Incidents
//  Builds the incident list in the dashboard.
//  VULNERABILITY 1: Incident data (title, severity) is inserted
//    via innerHTML – a stored XSS risk if the API returns
//    attacker-controlled content.
//  VULNERABILITY 2: No validation of the incidents array or
//    individual incident fields before rendering.


function renderIncidents(incidents) {
    const container = document.getElementById("incident-list");
    container.textContent = "";                  // Clear previous results

    incidents.forEach(function (incident) 
    {
        const item = document.createElement("li");
        if (typeof incident.title === "string" && incident.title.length() > 0 && ACCEPTED_SEVERITIES.includes(incident.severity)) 
        {
            item.textContent =
                "<strong>" + incident.title + "</strong>" +
                " <%= span class='severity severity-" + incident.severity + "'>" +
                incident.severity + "</span %=>";
            container.appendChild(item);
        } 
        else
        {
            console.error("Invalid incident data:", incident);
        }
    });
}



//  Filter Helper (provided – do not modify)
//  Hides/shows rendered items based on selected severity.


function applyFilter(filter) {
    const items = document.querySelectorAll("#incident-list li");
    items.forEach(function (item) {
        const badge = item.querySelector(".severity");
        if (!badge) return;
        const sev = badge.textContent.trim();
        item.style.display = (filter === "all" || sev === filter) ? "" : "none";
    });
    currentFilter = filter;
}



//  Application Bootstrap
//  Runs when the page finishes loading.


document.addEventListener("DOMContentLoaded", async function () {

    // Q5.C – Load saved filter state
    loadDashboardState();

    // Q5.A – Fetch incident data from the API
    const incidents = await fetchIncidents();

    // Q5.B – Render the incidents
    renderIncidents(incidents);

    // Filter select change handler
    document.getElementById("filter-select").addEventListener("change", function () {
        applyFilter(this.value);
        // Q5.C – Save the new filter choice
        saveDashboardState();
    });

});
