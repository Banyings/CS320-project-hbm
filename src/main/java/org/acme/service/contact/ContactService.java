package org.acme.service.contact;


import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.acme.model.contact.Contact;

@ApplicationScoped
public class ContactService {
    
    @Inject
    Mailer mailer;
    
    @Transactional
    public void saveContact(Contact contact) {
        // Save to database
        contact.persist();
        
        // Send email notification
        sendEmailNotification(contact);
    }
    
    private void sendEmailNotification(Contact contact) {
        mailer.send(Mail.withText(
            "banyingelahyppo@gmail.com",
            "New Contact Form Submission",
            String.format("""
                New contact form submission:
                
                Name: %s
                Email: %s
                Message: %s
                """,
                contact.getName(),
                contact.getEmail(),
                contact.getMessage())
        ));
    }
}