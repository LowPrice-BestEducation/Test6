// Check authentication on page load
document.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem("authenticated")) {
        window.location.href = "index.html"; // Redirect to login page if not authenticated
    }
});

// Secure Logout Function
function logout() {
    sessionStorage.removeItem("authenticated"); // Clear session
    window.location.href = "index.html"; // Redirect to login page
}

// Prevent going back to dashboard after logout
window.addEventListener("pageshow", function (event) {
    if (event.persisted || window.performance && window.performance.navigation.type === 2) {
        sessionStorage.removeItem("authenticated"); // Ensure session is cleared
        window.location.href = "index.html"; // Redirect to login page
    }
});




let allMessages = [];
        let isDarkMode = false;

        async function loadChat() {
            try {
                let response = await fetch("year_chat.json");
                let data = await response.json();
                allMessages = data.messages;
                displayMessages(allMessages);
                updateSenderDropdown(); // Update dropdown dynamically
            } catch (error) {
                console.error("Error loading chat:", error);
            }
        }
        

        // Define alternative names
        const nameMapping = {
            "Maha": "Maha",
            "A B H I S H E K G O W D A": "Abhi"
        };

        function displayMessages(messages) {
            let chatBox = document.getElementById("chat-box");
            chatBox.innerHTML = "";

            messages.forEach(msg => {
                let msgDiv = document.createElement("div");
                msgDiv.classList.add("message");

                // Replace sender name with alternative name
                let displayName = nameMapping[msg.sender_name] || msg.sender_name;

                if (msg.sender_name.includes("Maha")) {
                    msgDiv.classList.add("maha");
                } else {
                    msgDiv.classList.add("abhishek");
                }

                let date = new Date(msg.timestamp_ms);
                let timeString = date.toLocaleString();

                msgDiv.innerHTML = `<strong>${displayName}:</strong> ${msg.content} <br><small>${timeString}</small>`;
                chatBox.appendChild(msgDiv);
            });
        }

        function updateSenderDropdown() {
            let senderFilter = document.getElementById("senderFilter");
            
            // Clear previous options except 'All Senders'
            senderFilter.innerHTML = '<option value="all">All Senders</option>';
        
            // Collect unique sender names from the chat data
            let uniqueSenders = new Set(allMessages.map(msg => nameMapping[msg.sender_name] || msg.sender_name));
        
            // Add senders dynamically
            uniqueSenders.forEach(sender => {
                let option = document.createElement("option");
                option.value = sender;
                option.textContent = sender;
                senderFilter.appendChild(option);
            });
        }
        
        function applyFilters() {
            let searchTerm = document.getElementById("searchInput").value.toLowerCase();
            let startDate = document.getElementById("startDate").value;
            let endDate = document.getElementById("endDate").value;
            let senderFilter = document.getElementById("senderFilter").value;
            let sortOrder = document.getElementById("sortOrder").value;
        
            let filteredMessages = allMessages.filter(msg => {
                let messageDate = new Date(msg.timestamp_ms);
                let matchesSearch = searchTerm ? msg.content.toLowerCase().includes(searchTerm) : true;
                
                // Convert sender's actual name to the mapped name
                let mappedSender = nameMapping[msg.sender_name] || msg.sender_name;
                let matchesSender = senderFilter === "all" || mappedSender === senderFilter;
        
                let matchesDate = true;
                if (startDate) {
                    let start = new Date(startDate);
                    matchesDate = matchesDate && messageDate >= start;
                }
                if (endDate) {
                    let end = new Date(endDate);
                    matchesDate = matchesDate && messageDate <= end;
                }
        
                return matchesSearch && matchesSender && matchesDate;
            });
        
            if (sortOrder === "newest") {
                filteredMessages.sort((a, b) => b.timestamp_ms - a.timestamp_ms);
            } else {
                filteredMessages.sort((a, b) => a.timestamp_ms - b.timestamp_ms);
            }
        
            displayMessages(filteredMessages);
        }
        
        

        function resetSearch() {
            document.getElementById("searchInput").value = "";
            document.getElementById("startDate").value = "";
            document.getElementById("endDate").value = "";
            document.getElementById("senderFilter").value = "all";
            document.getElementById("sortOrder").value = "oldest";
            displayMessages(allMessages);
        }

        function toggleDarkMode() {
            let body = document.body;
            let modeButton = document.getElementById("darkModeToggle");
        
            // Toggle dark mode
            body.classList.toggle("dark-mode");
        
            // Check if dark mode is active
            let isDark = body.classList.contains("dark-mode");
        
            // Update button text
            modeButton.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
        }
        
        
        
        function handleThemeChange() {
            let theme = document.getElementById("themeSelect").value;
            let darkColorPicker = document.getElementById("darkColorPicker");
            let videoPicker = document.getElementById("videoPicker");
            let backgroundVideo = document.getElementById("backgroundVideo");
        
            // Check if elements exist before using them
            if (!darkColorPicker || !videoPicker || !backgroundVideo) {
                console.error("One or more elements are missing from the DOM.");
                return;
            }
        
            if (theme === "dark-colors") {
                darkColorPicker.classList.remove("hidden");
                videoPicker.classList.add("hidden");
                backgroundVideo.pause();
                backgroundVideo.classList.remove("show");
            } 
            else if (theme === "background-image") {
                videoPicker.classList.remove("hidden");
                darkColorPicker.classList.add("hidden");
                backgroundVideo.classList.remove("show");
                loadVideoOptions();
            } 
            else {
                darkColorPicker.classList.add("hidden");
                videoPicker.classList.add("hidden");
                backgroundVideo.pause();
                backgroundVideo.classList.remove("show");
                applyTheme(theme);
            }
        }
        
        
        function applyTheme(theme) {
            let backgroundVideo = document.getElementById("backgroundVideo");
        
            if (theme === "default") {
                document.body.style.backgroundColor = "";
                document.body.style.color = "";
                backgroundVideo.pause();
                backgroundVideo.classList.remove("show");
            }
        }
        
        function applyDarkColor(color) {
            document.body.style.backgroundColor = color;
            document.body.style.color = "#ddd";
        }

        function loadVideoOptions() {
            let videoSelect = document.getElementById("videoSelect");
            let videoFiles = ["color_clouds.mp4", "nebula.mp4", "night_stars.mp4"]; // Update with actual filenames
        
            // Clear existing options
            videoSelect.innerHTML = '<option value="">Select Background</option>';
        
            // Add video options
            videoFiles.forEach(video => {
                let option = document.createElement("option");
                option.value = video;
                option.textContent = video;
                videoSelect.appendChild(option);
            });
        }
        
        function applyVideoBackground() {
            let selectedVideo = document.getElementById("videoSelect").value;
            let backgroundVideo = document.getElementById("backgroundVideo");
        
            if (selectedVideo) {
                backgroundVideo.src = selectedVideo;
                backgroundVideo.load();  // Ensure the video is reloaded properly
                
                backgroundVideo.onloadeddata = () => {  // Wait until the video is fully loaded
                    backgroundVideo.classList.add("show");  // Ensure it's visible
                    backgroundVideo.play().catch(error => console.error("Video play error:", error));
                };
            } else {
                backgroundVideo.pause();
                backgroundVideo.classList.remove("show");  // Hide when no video is selected
            }
        }


        function focusSearch() {
            let searchInput = document.getElementById("searchInput");
            searchInput.focus(); // Auto-focus on the search bar
            searchInput.scrollIntoView({ behavior: "smooth" });
        }
        
        function openDateFilter() {
            let startDate = document.getElementById("startDate");
            let endDate = document.getElementById("endDate");
        
            startDate.focus();
            startDate.scrollIntoView({ behavior: "smooth" });
        }
        
        function openSenderFilter() {
            let senderFilter = document.getElementById("senderFilter");
            senderFilter.focus();
            senderFilter.scrollIntoView({ behavior: "smooth" });
        }
        
        function toggleSorting() {
            let sortOrder = document.getElementById("sortOrder");
            sortOrder.value = sortOrder.value === "newest" ? "oldest" : "newest";
            applyFilters();
        }
        
        function toggleThemeSettings() {
            let themeSelect = document.getElementById("themeSelect");
            themeSelect.focus();
            themeSelect.scrollIntoView({ behavior: "smooth" });
        }

        document.addEventListener("DOMContentLoaded", function () {
            const nav = document.querySelector("nav");
            const animation = document.querySelector(".animation");
            const menuItems = document.querySelectorAll("nav a");
        
            function moveIndicator(element) {
                animation.style.width = `${element.offsetWidth}px`;
                animation.style.left = `${element.offsetLeft}px`;
            }
        
            menuItems.forEach((item) => {
                item.addEventListener("mouseenter", function () {
                    moveIndicator(this);
                });
            });
        
            // Reset to Home on page load
            moveIndicator(menuItems[0]);
        });
        
        function showSection(sectionId) {
            // Hide all operation sections
            document.querySelectorAll('.operation-section').forEach(section => {
                section.classList.remove('visible');
            });
        
            // Show the selected section
            let selectedSection = document.getElementById(sectionId);
            if (selectedSection) {
                selectedSection.classList.add('visible');
            }
        }
        
        
  

        loadChat();

        // Disable right-click
    document.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, and Ctrl+U (both uppercase & lowercase)
    document.addEventListener("keydown", function (event) {
        const key = event.key.toLowerCase(); // Convert key to lowercase

        if (
            event.ctrlKey && 
            (event.key === "u" || event.key === "U" || event.key === "s" || event.key === "S") ||
            event.key === "F12" ||
            (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "i" || event.key === "J" || event.key === "j" || event.key === "C" || event.key === "c"))
        ) {
            event.preventDefault();
        }
    });

    if (document.documentElement) {
        Object.defineProperty(document, 'documentElement', {
            get: function () {
                window.location.href = "about:blank";
                return null;
            }
        });
    }

    setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            document.body.innerHTML = "";
            window.location.replace("about:blank");
        }
    }, 1000);
