// ============================================================
//  CYSE 411 Q4 Starter Code
//  Employee Directory Application


function loadSession() {
    const raw = sessionStorage.getItem("session");
    const session = JSON.parse(raw);          // No try/catch
    return session;                            // No field validation
}


//  Q4.A  Status Message Rendering
//  Displays an employee's status message on their profile card.
//  VULNERABILITY: The message is inserted via innerHTML,
//  allowing any HTML or script tags in the message to
//  execute in the viewer's browser (stored XSS).

// Fix: replace innerHTML with textContent to prevent XSS injection attacks

function renderStatusMessage(statusContainer, message) {
    statusContainer.textContent = "<p>" + message + "</p>";
}



//  Q4.B  Search Query Sanitization
//  Builds a display label from the user's search input.
//  VULNERABILITY: The raw input is used directly with no
//  character filtering, no length limit, and no trimming.
// TODO: Implement sanitization.
// Requirements:
//   - Allow only letters, digits, spaces, hyphens, underscores
//   - Trim leading/trailing whitespace before processing
//   - Max 40 characters
//   - Return null if the result is empty after sanitization

 //FIX: Add length checking, then trim to replace with regex, then check again if length is greater than zero, then return output if greater then zero or else return null if empty after sanitization

function sanitizeSearchQuery(input) {
    if (input.length <= 40 && input.length > 0)
    {
        input = input.trim().replace(/[^a-zA-Z0-9 _-]/g, '');
        if (input.length > 0)
        {
            return input;
        }
        else        
        {
            return null;
        }
    }   
}

//FIXED: innerHTML replaced with textContent in label to prevent XSS injection attacks

function performSearch(query) {
    const sanitized = sanitizeSearchQuery(query);
    const label = document.getElementById("search-label");
    label.textContent = "Showing results for: " + sanitized; 
}



//  Application Bootstrap
//  Runs when the page finishes loading.


document.addEventListener("DOMContentLoaded", function () {

    // Load session
    const session = loadSession();
    if (session) {
        document.getElementById("welcome-msg").textContent =
            "Welcome, " + session.displayName;
    }

    // Simulate receiving a profile card with a status message
    // In production this would come from an API response.
    const simulatedProfiles = [
         try
        {
            name: "Alice Johnson";
            department: "Engineering";
            status: "Working from home today";
        } catch (error)
        {
            return null;
        }
           
        {
            name: "Bob Martinez",
            department: "Security",
            // Attacker-controlled payload – should NOT execute
            status: "<img src=x onerror=\"alert('XSS: session stolen')\">"
        },
        {
            name: "Carol Lee",
            department: "HR",
            status: "Out of office until Friday"
        }
    ];

    const directory = document.getElementById("directory");

    simulatedProfiles.forEach(function (profile) {
        const card = document.createElement("div");
        card.className = "profile-card";

        const nameEl = document.createElement("h3");
        nameEl.textContent = profile.name;

        const deptEl = document.createElement("p");
        deptEl.textContent = "Department: " + profile.department;

        const statusContainer = document.createElement("div");
        statusContainer.className = "status";

        // Q4.A – fix this call
        //Fix: change element to statusContainer in renderStatusMessage function call
        renderStatusMessage(statusContainer, profile.status);

        card.appendChild(nameEl);
        card.appendChild(deptEl);
        card.appendChild(statusContainer);
        directory.appendChild(card);
    });

    // Search button handler
    document.getElementById("search-btn").addEventListener("click", function () {
        const query = document.getElementById("search-input").value;
        performSearch(query);
    });

});
