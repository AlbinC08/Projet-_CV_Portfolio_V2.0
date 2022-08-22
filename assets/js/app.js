const contact_form = document.querySelector('.contact_form');
let yourname = document.querySelector('#yourname');
let subject = document.querySelector('#subject');
let email = document.querySelector('#email');
let message = document.querySelector('#message')



contact_form.addEventListener('submit',(e)=>{
    e.preventDefault();

    let formData = {
        yourname: yourname.value,
        subject: subject.value,
        email: email.value,
        message: message.value
        
        
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.setRequestHeader('content-type','application/json')
    xhr.onload = function () {
        console.log(xhr.responseText);

        if (xhr.responseText == 'success') {
            alert('Email sent')
            yourname.value = '';
            subject.value = '';
            email.value = '';
            message.value = '';
        }else{
            alert('Something went wrong!')
        }

    }

    xhr.send(JSON.stringify(formData));

})