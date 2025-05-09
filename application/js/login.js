document.addEventListener("DOMContentLoaded", function() {
    getNavigation();
    
    const form = document.querySelector("form");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const lblError = document.getElementById("lblError");
        lblError.innerHTML = "";

        const oib = form.querySelector("input[name='oib']").value.trim();
        const password = form.querySelector("input[name='password']").value.trim();

        const lockInfo = JSON.parse(localStorage.getItem("loginLock"));
        const now = Date.now();

        if (lockInfo && lockInfo.count >= 3 && now < lockInfo.unlockTime) {
            const minutes = Math.ceil((lockInfo.unlockTime - now) / 60000);
            lblError.innerHTML = `Previše pokušaja. Pokušaj ponovno za ${minutes} min.`;
            return;
        }

        function validateOIB(oib) {
            if (!/^\d{11}$/.test(oib)) return false;

            let a = 10;
            for (let i = 0; i < 10; i++) {
                a = (parseInt(oib[i], 10) + a) % 10;
                if (a === 0) a = 10;
                a = (a * 2) % 11;
            }
            let controlDigit = (11 - a) % 10;
            return controlDigit === parseInt(oib[10], 10);
        }

        if (!validateOIB(oib)) {
            lblError.innerHTML = "OIB nije valjan.";
            return;
        }

        if (password.length < 6) {
            lblError.innerHTML = "Lozinka mora imati najmanje 6 znakova.";
            return;
        }

        const data = { oib, password };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success === "Login successful!") {
                localStorage.removeItem("loginLock");
                window.location.href = "/";
            } else {
                lblError.innerHTML = "Neispravan OIB ili lozinka.";

                let attempts = lockInfo || { count: 0, unlockTime: 0 };
                attempts.count += 1;

                if (attempts.count >= 3) {
                    attempts.unlockTime = now + 30 * 60 * 1000;
                }

                localStorage.setItem("loginLock", JSON.stringify(attempts));
            }
        } catch (error) {
            console.error('Error:', error);
            lblError.innerHTML = "Greška u komunikaciji sa serverom.";
        }
    });

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

