package org.acme.resource.contact;


import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.model.contact.Contact;
import org.acme.service.contact.ContactService;

@Path("/api/contact")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ContactResource {
    
    @Inject
    ContactService contactService;
    
    @POST
    public Response submitContact(@Valid Contact contact) {
        try {
            contactService.saveContact(contact);
            return Response.ok().entity("Message sent successfully").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                         .entity("Error processing your request")
                         .build();
        }
    }
}