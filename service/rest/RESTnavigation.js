class RESTnavigation {
    static navigations = {
        admin: [
            { LinkName: "Home", link: "/" },
            { LinkName: "Voting", link: "/voting" },
            { LinkName: "Admino", link: "/admin" },
            { LinkName: "About us", link: "/about-us" },
            { LinkName: "Privacy policy", link: "/privacy-policy" },
            { LinkName: "Logout", link: "/api/logout" }
        ],
        voter: [
            { LinkName: "Home", link: "/" },
            { LinkName: "Voting", link: "/voting" },
            { LinkName: "About us", link: "/about-us" },
            { LinkName: "Privacy policy", link: "/privacy-policy" },
            { LinkName: "Logout", link: "/api/logout" }
        ],
        guest: [
            { LinkName: "Login", link: "/login" },
            { LinkName: "About us", link: "/about-us" },
            { LinkName: "Privacy policy", link: "/privacy-policy" }
        ]
    };

    async getNavigaciju(req, res) {
        try {
            const type = req.session?.user?.type;
            let navigation;

            if (type == "Admin") {
                navigation = RESTnavigation.navigations.admin;
            } else if (type == "Voter") {
                navigation = RESTnavigation.navigations.voter;
            } else {
                navigation = RESTnavigation.navigations.guest;
            }

            res.status(200).json({ navigation });
        } catch (error) {
            console.error("Error getting navigation:", error);
            res.status(500).json({ Error: "Internal server error." });
        }
    }
}

module.exports = RESTnavigation;
