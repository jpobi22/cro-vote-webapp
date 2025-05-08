document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const lblError = document.getElementById("lblError");
        lblError.innerHTML = "";

        const oib = form.querySelector("input[name='oib']").value.trim();
        const password = form.querySelector("input[name='password']").value.trim();

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

        const data = {
            oib,
            password
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json(); 

            if (response.ok && result.success === "Login successful!") {
                window.location.href = "/";
            } else {
                lblError.innerHTML = "Neispravan OIB ili lozinka.";
            }
        } catch (error) {
            console.error('Error:', error);
            lblError.innerHTML = "Greška u komunikaciji sa serverom.";
        }
    });
});
