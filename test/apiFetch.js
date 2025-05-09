const PORT = 4000;
const baseUrl = `http://localhost:${PORT}`;
const apiUrl = `${baseUrl}/api`;

fetch(`${apiUrl}/subject`).then((response) => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}).then((data) => {
    data.contactSubject.forEach((user) => {
        console.log(user);
    });
}).catch((error) => {
    console.error('There was a problem with the fetch operation:', error);
});
