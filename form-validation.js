
document.addEventListener("DOMContentLoaded", () => {

  let tickets_form = document.getElementById('tickets_form');

// Regex pattern
const emailPattern=/^[\w\.-]+@([\w-]+\.)+[\w-]{2,}$/;

// form validation
tickets_form.addEventListener('submit', async function(event){
    event.preventDefault();

    // Input values to check reauirements
    let userName = document.getElementById('name').value.trim();
    let userEmail = document.getElementById('email').value.trim();
    let userTickets = parseInt(document.getElementById('numberOfTickets').value);


    // Checking if input matches requirements
    let valid = true;

    if(userName === ''){
        console.log('name',userName);
        document.querySelector('.error_name').innerHTML = "<i class='fa-solid fa-triangle-exclamation' style='color: #ff0a0a;'></i>  Please insert your name";
        document.querySelector('.error_name').classList.remove('hidden');
        valid = false;
    } else{
        document.querySelector('.error_name').classList.add('hidden');
    }

    if(userEmail === ''){
        document.querySelector('.error_email').innerHTML = "<i class='fa-solid fa-triangle-exclamation' style='color: #ff0a0a;'></i>  Please insert your email.";
        document.querySelector('.error_email').classList.remove('hidden');
        valid = false;
    } else if(!emailPattern.test(userEmail)){
        document.querySelector('.error_email').innerHTML = "<i class='fa-solid fa-triangle-exclamation' style='color: #ff0a0a;'></i>  Invalid email format. Please enter a valid address such as name@example.com.";
    } else {
        document.querySelector('.error_email').classList.add('hidden');
    }

    if(valid){
        // Adding submission animation - only if valid submission
        let submitBtn = document.getElementById('submit');
        let originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
    
        if(submitBtn){
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
        }

        try{
            const response = await fetch('/.netlify/functions/send-email', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: userName,
                    email: userEmail,
                    numberOfTickets: userTickets
                })
            })
            
            const result = await response.json();

            if(response.ok){
                console.log('success');
                setTimeout(function(){
                    window.location.href = '/success_msg.html';
                }, 2000)
            } else{
                alert('Error', result.error);
            }
        }

        catch(error){
            console.log('Error', error);
            alert('ERROR')
            console.error('Full error object:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            alert('Network error: ' + error.message);
        }
    }
    

}) });