package org.acme.resource;

import org.acme.entity.Appointment;
import org.acme.service.CartService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Map;

@Path("/api/cart")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CartResource {
    @Inject
    CartService cartService;

    @POST
    public Response calculateCart(Map<String, List<Appointment>> request) {
        List<Appointment> items = request.get("items");
        Map<String, Object> totals = cartService.calculateTotals(items);
        
        return Response.ok(Map.of(
            "items", items,
            "totals", totals
        )).build();
    }

    @DELETE
    public Response clearCart() {
        return Response.ok().build();
    }

    @PUT
    public Response updateCart(Map<String, List<Appointment>> request) {
        List<Appointment> items = request.get("items");
        Map<String, Object> totals = cartService.calculateTotals(items);
        
        return Response.ok(Map.of(
            "items", items,
            "totals", totals
        )).build();
    }
}