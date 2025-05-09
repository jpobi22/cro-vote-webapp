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
                    navElement.appendChild(link);
                });
            }
        } catch (error) {
            console.error("Error getting navigation:", error);
        }
    }
    
});

