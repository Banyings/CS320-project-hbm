package org.acme.resource;

import org.acme.entity.Appointment;
import org.acme.entity.PaymentSession;
import org.acme.service.PaymentService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.LocalTime;
import java.math.BigDecimal;

@Path("/api/payment")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PaymentResource {
    @Inject
    PaymentService paymentService;

    @Path("/initialize")
    @POST
    public Response initializePayment(Map<String, Object> request) {
        try {
            // Extract and validate customerEmail
            String customerEmail = (String) request.get("customerEmail");
            if (customerEmail == null || customerEmail.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                             .entity(Map.of("message", "Customer email is required"))
                             .build();
            }

            // Extract and convert appointments
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) request.get("items");
            if (itemsData == null || itemsData.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                             .entity(Map.of("message", "No items provided"))
                             .build();
            }

            List<Appointment> appointments = convertToAppointments(itemsData);

            // Extract and validate totals
            @SuppressWarnings("unchecked")
            Map<String, Object> totals = (Map<String, Object>) request.get("totals");
            if (totals == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                             .entity(Map.of("message", "Totals are required"))
                             .build();
            }

            PaymentSession session = paymentService.createPaymentSession(customerEmail, appointments, totals);
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("sessionId", session.getSessionId());
            responseData.put("amount", session.getTotal());
            responseData.put("customerEmail", session.getCustomerEmail());
            
            return Response.ok(responseData).build();
            
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST)
                         .entity(Map.of("message", e.getMessage()))
                         .build();
        }
    }

    private List<Appointment> convertToAppointments(List<Map<String, Object>> itemsData) {
        List<Appointment> appointments = new ArrayList<>();
        
        for (Map<String, Object> item : itemsData) {
            Appointment appointment = new Appointment();
            
            // Set required fields
            appointment.setEmail((String) item.get("email"));
            appointment.setService((String) item.get("service"));
            
            // Convert and set date
            String dateStr = (String) item.get("date");
            if (dateStr != null) {
                appointment.setDate(LocalDate.parse(dateStr));
            }
            
            // Convert and set time
            String timeStr = (String) item.get("time");
            if (timeStr != null) {
                appointment.setTime(LocalTime.parse(timeStr));
            }
            
            appointment.setPaymentMethod((String) item.get("paymentMethod"));
            
            // Handle price conversion
            Object priceObj = item.get("price");
            if (priceObj != null) {
                if (priceObj instanceof Number) {
                    appointment.setPrice(BigDecimal.valueOf(((Number) priceObj).doubleValue()));
                } else if (priceObj instanceof String) {
                    appointment.setPrice(new BigDecimal((String) priceObj));
                }
            }
            
            appointments.add(appointment);
        }
        
        return appointments;
    }

    @Path("/session/{sessionId}")
    @GET
    public Response getPaymentSession(@PathParam("sessionId") String sessionId) {
        try {
            PaymentSession session = paymentService.getPaymentSession(sessionId);
            if (session == null) {
                return Response.status(Response.Status.NOT_FOUND)
                             .entity(Map.of("message", "Payment session not found"))
                             .build();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", session.getSessionId());
            response.put("amount", session.getTotal());
            response.put("customerEmail", session.getCustomerEmail());
            response.put("status", session.getStatus());
            
            return Response.ok(response).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                         .entity(Map.of("message", e.getMessage()))
                         .build();
        }
    }

    @POST
    public Response processPayment(Map<String, Object> request) {
        try {
            // Validate required fields
            String sessionId = (String) request.get("paymentSessionId");
            if (sessionId == null || sessionId.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                             .entity(Map.of("message", "Payment session ID is required"))
                             .build();
            }

            @SuppressWarnings("unchecked")
            Map<String, String> paymentMethod = (Map<String, String>) request.get("paymentMethod");
            if (paymentMethod == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                             .entity(Map.of("message", "Payment method is required"))
                             .build();
            }

            paymentService.processPayment(sessionId, paymentMethod);
            return Response.ok(Map.of("status", "success")).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST)
                         .entity(Map.of("message", e.getMessage()))
                         .build();
        }
    }
}