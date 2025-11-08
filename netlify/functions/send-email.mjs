// netlify/functions/submit-form.js
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

//info from supabase for connection
const supabase_url = process.env.SUPABASE_URL;
const supabase_key = process.env.SUPABASE_KEY;


export const handler = async (event) => {

  //checking http method
  if(event.httpMethod !== 'POST'){
    return {
        statusCode: 405,
        body: JSON.stringify({error: 'problem with method'})
    }
  }

  //check if the body exists
  if(!event.body){
    return {
        statusCode: 400,
        body: JSON.stringify({error: 'missing body'})
    }
  }

  let parsedBody;

  try{
    parsedBody = JSON.parse(event.body);
  } catch (error){
    console.error('error', error);
    return {
        statusCode: 400,
        body: JSON.stringify({error: 'JSON is incorrect'})
    }
  }

  const {name, email, numberOfTickets} = parsedBody;

  
  try {

    const supabase = createClient(supabase_url, supabase_key);
    
            const { data, error } = await supabase
            .from('ticket_reservations')
            .insert({ name, email, numberOfTickets })
    
            if(error){
                console.error('Error inserting data:', error);
                alert('Error: ' + error.message);
            } else {
                console.log('Inserted data', data);

            }
   
    // sending email with nodemailer
    const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN
            },
        })

        await transporter.sendMail({
            from:`"Event Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reservation Confirmation",
            html: `
                <h2>Hello ${name},</h2>
                <p>Thank you for your reservation!</p>
                <p><strong>Tickets reserved:</strong> ${numberOfTickets}</p>
                <p>See you soon!</p>`
        });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success! Email sent.' })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};