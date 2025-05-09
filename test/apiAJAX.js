
const PORT = 4000;
const baseUrl = `http://localhost:${PORT}`;
const apiUrl = `${baseUrl}/api`;

const xhr = new XMLHttpRequest();
xhr.open("GET", `${apiUrl}/subject`, true);
xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        data.contactSubject.forEach(user => {
            console.log(user);
        });
    } else {
        console.error('There was a problem with the fetch operation:', xhr.statusText);
    }
};
xhr.onerror = function() {
    console.error('There was a problem with the fetch operation:', xhr.statusText);
};
xhr.send();