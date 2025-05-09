const ajax = async (config) => {
    const request = await fetch(config.url, {
        method: config.method,
        headers: {
            'Content-Type': 'application/json',
            "Accept": 'application/json',
        },
        body: JSON.stringify(config.body)
    });
    if (!request.ok) {
        throw new Error(`HTTP error! status: ${request.status}`);
    }
}

const submitContact = () => {
    const data = {
        fname: document.getElementById('fname').value,
        lname: document.getElementById('lname').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    }
}