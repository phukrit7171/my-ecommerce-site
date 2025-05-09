const PORT = 4000;
const baseUrl = `http://localhost:${PORT}`;
const apiUrl = `${baseUrl}/api`;

const xhr = new XMLHttpRequest();
xhr.open("GET", `${apiUrl}/subject`, true);
xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        // display subjects in a list
        displaySubjects(data.contactSubject);
        data.contactSubject.forEach(user => {
            console.log(user);
        });
    } else {
        console.error('There was a problem with the fetch operation:', xhr.statusText);
    }
};
xhr.onerror = function () {
    console.error('There was a problem with the fetch operation:', xhr.statusText);
};
xhr.send();

// display subjects in a list
const displaySubjects = (subjects) => {
    const subjectList = document.getElementById('subject-list');
    subjects.forEach(subject => {
        // create a radio for each subject
        const label = document.createElement('label');
        label.setAttribute('for', subject);
        label.textContent = subject;
        subjectList.appendChild(label);
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'subject';
        input.id = subject;
        input.value = subject;
        subjectList.appendChild(input);
        subjectList.appendChild(document.createElement('br'));
    });
}

const submitContact = () => {
    
    const subjectInput = document.querySelector('input[name="subject"]:checked');
    const data = {
        fname: document.getElementById('fname').value,
        lname: document.getElementById('lname').value,
        email: document.getElementById('email').value,
        subject: subjectInput ? subjectInput.value : '',
        message: document.getElementById('message').value
    }
    console.log(data);
}


