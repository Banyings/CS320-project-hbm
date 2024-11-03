package org.acme.resource;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;
import java.math.BigDecimal;
import org.acme.exception.BookingService;

@Path("/api")
public class ServiceResource {
    @Inject
    BookingService bookingService;

    @GET
    @Path("/services")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getServices() {
        try {
            Map<String, BigDecimal> services = bookingService.getServices();
            Map<String, String> formattedServices = new HashMap<>();
            
            // Format prices as strings
            services.forEach((key, value) -> 
                formattedServices.put(key, value.toString())
            );
            
            return Response.ok(formattedServices).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                         .entity(Map.of("error", "Failed to fetch services"))
                         .build();
        }
    }

    @GET
    @Path("/payment-methods")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPaymentMethods() {
        try {
            return Response.ok(bookingService.getPaymentMethods()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                         .entity(Map.of("error", "Failed to fetch payment methods"))
                         .build();
        }
    }
}