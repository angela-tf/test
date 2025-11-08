// imports
// const express=require('express');
import express from 'express';
const app=express();
const porto = 3000;
app.use(express.json());

// Imports for oauth2
import dotenv from 'dotenv';
dotenv.config();

//Import to be able to send ewmails 
import nodemailer from 'nodemailer';

app.use(express.urlencoded({
    extended: true
}));


//Sending email to confirm getting tickets

app.post('/email_process',async (req,res)=>{
    
    let nome = req.body.nome;
    let email = req.body.email;
    let numberOfTickets = req.body.numberOfTickets;

    // console.log('MAILGUN_API_KEY exists:', !!process.env.MAILGUN_API_KEY);
    // console.log('MAILGUN_DOMAIN exists:', !!process.env.MAILGUN_DOMAIN);

    // console.log('MAILGUN_API_KEY exists:', !!process.env.BREVO_KEY);
    // console.log('MAILGUN_DOMAIN exists:', !!process.env.BREVO_USER);

    try {
        console.log('Form was successfully validated ');
        

        //Nodemailer - worked for localhost, but doesnt work with render.com
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

        //doesnt work with render.com (gets blocked)
        // const transporter = nodemailer.createTransport({
        //     host: 'smtp-relay.brevo.com',
        //     port: 587,
        //     secure: false,
        //     auth: {
        //         user: process.env.BREVO_USER, 
        //         pass: process.env.BREVO_KEY
        //     }
        // });

        await transporter.sendMail({
            from:`"Event Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reservation Confirmation",
            html: `
                <h2>Hello ${nome},</h2>
                <p>Thank you for your reservation!</p>
                <p><strong>Tickets reserved:</strong> ${numberOfTickets}</p>
                <p>See you soon!</p>`
        });

        res.render('pages/mensagem', {
                        titulo: 'Tickets were sent.', 
                        texto: 'Look at your inbox for the tickets.',
                        buttonTitle:'Homepage',
                        buttonLink:`/tickets.html`
                    });

        }
        catch (error) {
                    console.error('=== EMAIL ERROR ===');
                    console.error('Error message:', error.message);
                    console.error('Error code:', error.code);
                    console.error('Full error:', error);
                    console.error('===================');
                    
                    
                    console.error('Error in submitting the form');
                    res.render('pages/mensagem', {
                        titulo: 'Error in getting tickets', 
                        texto: 'Please try again later',
                        buttonTitle:'Homepage',
                        buttonLink:`/principal`
                    });
                }
})

//listen to port 3000
app.listen(porto, function () {
    console.log('app a ser executado em http://localhost:' + porto);
});