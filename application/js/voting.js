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
        "Authorization": jwtData.token,
        "Accept": "application/json"
    }
});


    const postData = await res.json();
    if (!res.ok) {
        console.error("Failed to load post data.");
        return;
    }

   
    const votingMain = document.getElementById("votingMain");
    votingMain.innerHTML = `<h2>${postData.name}</h2><p>${postData.description}</p>`;

  
    const choicesRes = await fetch(`/api/choices?postId=${postId}`, {
        headers: {
            "Authorization": jwtData.token,
            "Accept": "application/json"
        }
    });

    const choicesData = await choicesRes.json();
    if (!choicesRes.ok) {
        console.error("Failed to load choices.");
        return;
    }

  
    const form = document.createElement("form");
    choicesData.choices.forEach(choice => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "choice";
        input.value = choice.id;

        label.appendChild(input);
        label.appendChild(document.createTextNode(choice.name));
        form.appendChild(label);
        form.appendChild(document.createElement("br"));
    });

    const voteButton = document.createElement("button");
    voteButton.textContent = "Submit Vote";
    form.appendChild(voteButton);
    
   form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedChoice = form.querySelector('input[name="choice"]:checked');
    if (!selectedChoice) {
        alert("Please select a choice before submitting.");
        return;
    }

    try {
        // 🔁 REFRESH JWT token prije svakog slanja
        const jwtRes = await fetch("/api/getJWT");
        const jwtData = await jwtRes.json();

        if (!jwtRes.ok || !jwtData.token) {
            console.error("Neuspjelo dohvaćanje JWT tokena.");
            alert("Došlo je do greške. Pokušajte ponovno.");
            return;
        }

        const voteRes = await fetch(`/api/submit-vote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwtData.token
            },
            body: JSON.stringify({
                postId: postData.id,
                choiceId: selectedChoice.value
            })
        });

        if (voteRes.ok) {
            alert("Uspješno ste glasali!");
        } else if (voteRes.status === 409) {
            alert("Već ste glasali za ovaj post.");
        } else {
            const err = await voteRes.json();
            console.error("Greška pri glasanju:", err);
            alert("Došlo je do greške pri glasanju.");
        }

    } catch (error) {
        console.error("Pogreška tijekom slanja glasa:", error);
        alert("Greška prilikom slanja glasa.");
    }
});



    votingMain.appendChild(form);
});


