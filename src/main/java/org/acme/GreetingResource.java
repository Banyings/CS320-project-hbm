// package org.acme;

// import jakarta.transaction.Transactional;
// import jakarta.ws.rs.GET;
// import jakarta.ws.rs.POST;
// import jakarta.ws.rs.Path;
// import jakarta.ws.rs.PathParam;
// import jakarta.ws.rs.Produces;
// import jakarta.ws.rs.core.MediaType;

// @Path("/hello")
// public class GreetingResource {

//     @GET
//     @Produces(MediaType.TEXT_PLAIN)
//     public String hello() {
//         return "Hello RESTEasy";
//     }

//     @Path("/personalized/{name}")
//     @POST
//     @Produces(MediaType.TEXT_PLAIN)
//     @Transactional
//     public String personalizedHello(@PathParam("name") String name) {
//         UserName userName = new UserName(name);
//         userName.persist();
//         return "Hello " + name + "! Your name has been stored in the database.";
//     }


//     @Path("/personalized")
//     @POST
//     @Produces(MediaType.TEXT_PLAIN)
//     public String personalizedHelloPost(Person p) {
//         return "Hello " + p.getFirst() + " " + p.getLast();
//     }

//     public static class Person {
//         private String first;
//         private String last;

//         public String getFirst() {
//             return first;
//         }

//         public void setFirst(String first) {
//             this.first = first;
//         }

//         public String getLast() {
//             return last;
//         }

//         public void setLast(String last) {
//             this.last = last;
//         }
//     }
// }

package org.acme;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/hello")
public class GreetingResource {
    //default 
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return "Hello RESTEasy";
    }
    //create names in te datebase
    @Path("/personalized/{name}")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Transactional
    public String personalizedHello(@PathParam("name") String name) {
        UserName userName = new UserName(name);
        userName.persist();
        return "Hello " + name + "! Your name has been stored in the database.";
    }
    //Frontend post
    @Path("/personalized")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    public String personalizedHelloPost(Person p) {
        return "Hello " + p.getFirst() + " " + p.getLast();
    }

    // GET request to retrieve all names
    @GET
    @Path("/names")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserName> getAllNames() {
        return UserName.listAll();
    }

    // GET request to retrieve a specific name
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

    // PUT request to update a name
    @PUT
    @Path("/names/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updateName(@PathParam("id") Long id, UserName updatedName) {
        UserName userName = UserName.findById(id);
        if (userName == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        userName.name = updatedName.name; // Directly update the name field
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