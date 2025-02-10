export const filterEvents = (events, filters, search) => {
    return events.filter(event => {

        const matchesSearch =
            event.name.toLowerCase().includes(search.toLowerCase()) ||
            event.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
            !filters.category || event.category === filters.category;
        const matchesDate =
            !filters.date ||
            new Date(event.date).toDateString() ===
            new Date(filters.date).toDateString();
        const matchesPrivacy =
            !filters.isPrivate || event.isPrivate === filters.isPrivate;

        return matchesSearch && matchesCategory && matchesDate && matchesPrivacy;
    });
};

export const sortEvents = (events, sortBy) => {
    return events.sort((a, b) => {
        switch (sortBy) {
            case "date":
                return new Date(a.date) - new Date(b.date);
            case "name":
                return a.name.localeCompare(b.name);
            case "popularity":
                return b.attendees.length - a.attendees.length;
            default:
                return 0;
        }
    });

};