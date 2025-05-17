document.addEventListener("DOMContentLoaded", function() {
    getNavigation();

    async function getNavigation() {
        try {
            const response = await fetch('/api/navigation');
            const result = await response.json();
    
            if (response.ok && result.navigation) {
                const navElement = document.getElementById("nav");
                navElement.innerHTML = "";
    
                result.navigation.forEach(item => {
                    const link = document.createElement("a");
                    link.href = item.link;
                    link.textContent = item.LinkName;
    
                    if (item.LinkName === "Logout") {
                        link.id = "logout";
                        link.addEventListener("click", async (e) => {
                            e.preventDefault();
    
                            try {
                                const jwtRes = await fetch("/api/getJWT");
                                const jwtData = await jwtRes.json();
    
                                if (jwtRes.ok && jwtData.token) {
                                    const headers = new Headers();
                                    headers.append("Authorization", jwtData.token);
    
                                    const logoutRes = await fetch("/api/logout", {
                                        method: "GET",
                                        headers: headers
                                    });
    
                                    if (logoutRes.redirected) {
                                        window.location.href = logoutRes.url;
                                    } else {
                                        console.error("Logout failed.");
                                    }
                                } else {
                                    console.error("Failed to fetch JWT token.");
                                }
                            } catch (err) {
                                console.error("Logout error:", err);
                            }
                        });
                    }
    
                    navElement.appendChild(link);
                });
            }
        } catch (error) {
            console.error("Error getting navigation:", error);
        }
    }
    
});

document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    
    const jwtRes = await fetch("/api/getJWT");
    const jwtData = await jwtRes.json();

    if (!jwtRes.ok || !jwtData.token) {
        console.error("Failed to get JWT token.");
        return;
    }

    const res = await fetch(`/api/posts/${postId}`, {
        headers: {
            "Authorization": jwtData.token
        }
    });
const postRes = await fetch(`/api/posts/${postId}`, {
    headers: {
        "Authorization": jwtData.token,
        "Accept": "application/json" 
    }
});

    const postData = await res.json();
    if (!res.ok) {
        console.error("Failed to load post data.");
        return;
    }

    const userRoleRes = await fetch("/api/user/role", {
        headers: {
            "Authorization": jwtData.token
        }
    });

    const userRole = await userRoleRes.json();

    // Dynamically generate content based on user role
    const votingMain = document.getElementById("votingMain");
    votingMain.innerHTML = `<h2>${postData.name}</h2><p>${postData.description}</p>`;

    if (userRole === "Admin") {
        votingMain.innerHTML += `<button id="manageVoting">Manage Voting</button>`;
        document.getElementById("manageVoting").addEventListener("click", () => {
            window.location.href = `/manage-voting?postId=${postId}`;
        });
    } else {
        votingMain.innerHTML += `<button id="voteButton">Vote</button>`;
        document.getElementById("voteButton").addEventListener("click", () => {
            window.location.href = `/submit-vote?postId=${postId}`;
        });
    }
});

