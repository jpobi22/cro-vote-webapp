document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    
    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const lblError = document.getElementById("lblError");

        const oib = form.querySelector("input[name='oib']").value;
        const name = form.querySelector("input[name='name']").value;
        const surname = form.querySelector("input[name='surname']").value;
        const address = form.querySelector("input[name='address']").value;
        const phone = form.querySelector("input[name='phone']").value;
        const email = form.querySelector("input[name='email']").value;
        const password = form.querySelector("input[name='password']").value;

        const data = {
            oib,
            name,
            surname,
            address,
            phone,
            email,
            password
        };

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.href = "/login";
            } else {
                lblError.innerHTML = "Došlo je do pogreške!";
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
