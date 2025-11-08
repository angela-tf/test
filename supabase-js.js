import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseURL = 'https://pbwsuzcwkclxpjgxlibi.supabase.co';
const api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBid3N1emN3a2NseHBqZ3hsaWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MTIzNTksImV4cCI6MjA3ODE4ODM1OX0.DT7PHl0vhYGwVyKMcjz05Dalrjorz7eINY-SQt1iNQM';

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


            // Inserting data to database
            const supabase = createClient(supabaseURL, api_key);
    
            const { data, error } = await supabase
            .from('ticket_reservations')
            .insert({ name:userName, email:userEmail, numberOfTickets:userTickets })
    
            if(error){
                console.error('Error inserting data:', error);
                alert('Error: ' + error.message);
            } else {
                console.log('Inserted data', data);
                setTimeout(function(){
                    window.location.href = '/PHP/success_msg.html';
                }, "2000")

            }

    }
    

}) });