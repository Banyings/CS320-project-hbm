package org.acme.resource;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

import org.acme.UserName;

@Path("/hello")
public class GreetingResource {
    // default
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return "Hello RESTEasy";
    }

    // create names in te datebase
    @Path("/personalized")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public String personalizedHello(Person person) {
        // Create UserName instance from Person's first and last name
        UserName userName = new UserName(person.getFirst(), person.getLast());
        userName.persist();
        return "Hello " + person.getFirst() + " " + person.getLast() + "! You can now book an appointment";
    }

    // SEE names in the Database
    @GET
    @Path("/names")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserName> getAllNames() {
        return UserName.listAll();
    }

    // GET a specific name from the Database
    @GET
    @Path("/names/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getName(@PathParam("id") Long id) {
        UserName userName = UserName.findById(id);
        if (userName == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(userName).build();
    }

    // Put the First and Last Names in the Database
    @PUT
    @Path("/names/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response getName(@PathParam("id") Long id, UserName updatedName) {
        UserName userName = UserName.findById(id);
        if (userName == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        // Update firstName and lastName fields
        userName.firstName = updatedName.firstName;
        userName.lastName = updatedName.lastName;
        return Response.ok(userName).build();
    }

    // DELETE request to remove a name
    @DELETE
    @Path("/names/{id}")
    @Transactional
    public Response deleteName(@PathParam("id") Long id) {
        UserName userName = UserName.findById(id);
        if (userName == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        userName.delete();
        return Response.noContent().build();
    }

    public static class Person {
        private String first;
        private String last;

        public String getFirst() {
            return first;
        }

        public void setFirst(String first) {
            this.first = first;
        }

        public String getLast() {
            return last;
        }

        public void setLast(String last) {
            this.last = last;
        }
    }
}
