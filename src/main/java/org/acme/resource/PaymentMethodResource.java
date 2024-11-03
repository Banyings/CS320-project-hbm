// package org.acme.resource;


// import jakarta.inject.Inject;
// import jakarta.ws.rs.*;
// import jakarta.ws.rs.core.MediaType;
// import jakarta.ws.rs.core.Response;
// import java.util.Map;

// import org.acme.exception.BookingService;

// @Path("/api/payment-methods")
// @Produces(MediaType.APPLICATION_JSON)
// @Consumes(MediaType.APPLICATION_JSON)
// public class PaymentMethodResource {
//     @Inject
//     BookingService bookingService;

//     @GET
//     public Response getPaymentMethods() {
//         try {
//             return Response.ok(bookingService.getPaymentMethods()).build();
//         } catch (Exception e) {
//             e.printStackTrace();
//             return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
//                          .entity(Map.of("message", "Failed to fetch payment methods: " + e.getMessage()))
//                          .build();
//         }
//     }
// }

package org.acme.resource;


import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;

import org.acme.exception.BookingService;

@Path("/api/payment-methods")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PaymentMethodResource {
    @Inject
    BookingService bookingService;

    @GET
    public Response getPaymentMethods() {
        try {
            return Response.ok(bookingService.getPaymentMethods()).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                         .entity(Map.of("message", "Failed to fetch payment methods: " + e.getMessage()))
                         .build();
        }
    }
}