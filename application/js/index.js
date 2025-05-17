document.addEventListener("DOMContentLoaded", function() {
    getNavigation();

    const postsContainer = document.getElementById("posts-container");
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");
    let currentPage = 1;
    let totalPages = 1;

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
    
    async function fetchPosts(page = 1) {
        const jwtRes = await fetch("/api/getJWT");
        const jwtData = await jwtRes.json();

        if (!jwtRes.ok || !jwtData.token) {
            throw new Error("Failed to get JWT");
        }
    
        const res = await fetch(`/api/posts?page=${page}`, {
            headers: {
                "Authorization": jwtData.token
            }
        });
    
        const data = await res.json();
    
        if (!res.ok) {
            throw new Error(data.error || "Error fetching posts");
        }
    
        renderPosts(data.posts);
        currentPage = data.page;
        totalPages = data.totalPages;
        updatePagination();
        
    }
    
    function renderPosts(posts) {
        postsContainer.innerHTML = "";
    
        posts.forEach(post => {
            const tile = document.createElement("div");
            tile.className = "tile";
    
            const title = document.createElement("h2");
            title.textContent = post.name;
            title.addEventListener("click", () => {
                const postName = encodeURIComponent(post.name); // Uzimamo naziv posta kao ključnu riječ
                window.location.href = `/voting/${postName}`; // Usmjerenje na voting s nazivom posta
            });

            const desc = document.createElement("p");
            desc.textContent = post.description;
    
            tile.appendChild(title);
            tile.appendChild(desc);
    
            postsContainer.appendChild(tile);
        });
    }
    
    function updatePagination() {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    }
    
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) fetchPosts(currentPage - 1);
    });
    
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) fetchPosts(currentPage + 1);
    });
    
    fetchPosts();
});

