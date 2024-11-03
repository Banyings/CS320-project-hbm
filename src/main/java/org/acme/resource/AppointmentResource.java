package org.acme.resource;

import org.acme.entity.Appointment;
import org.acme.exception.BookingService;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/appointments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AppointmentResource {
    @Inject
    BookingService bookingService;

    @POST
    public Response createAppointment(Appointment appointment) {
        Appointment createdAppointment = bookingService.createAppointment(appointment);
        return Response.ok(createdAppointment).build();
    }
}