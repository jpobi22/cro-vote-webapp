document.addEventListener("DOMContentLoaded", function() {
    getNavigation();
    getProfileData();

    async function getProfileData() {
        try {

            const jwtRes = await fetch("/api/getJWT");
            const jwtData = await jwtRes.json();

            if (jwtRes.ok && jwtData.token) {
                const headers = new Headers();
                headers.append("Authorization", jwtData.token);

                const res = await fetch("/api/current-user", {
                    method: "GET",
                    headers: headers
                });

                const data = await res.json();
    
                if (res.ok) {
                    document.getElementById("profile-oib").textContent = data.oib;
                    document.getElementById("profile-name").textContent = data.name;
                    document.getElementById("profile-surname").textContent = data.surname;
                    document.getElementById("profile-email").textContent = data.email;
                    document.getElementById("profile-type").textContent = data.type;
                } else {
                    console.error("Failed to load profile.");
                }
            } else {
                console.error("Failed to fetch JWT token.");
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
        }
    }

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

