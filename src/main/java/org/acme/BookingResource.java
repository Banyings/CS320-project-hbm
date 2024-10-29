package org.acme;

// Essential imports for REST endpoints and responses
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

// Model imports
import org.acme.model.Booking;
import org.acme.model.BookingRequest;
import org.acme.model.BookingResponse;
import org.acme.model.ErrorResponse;

// Service import
import org.acme.service.BookingService;

// Validation and transaction imports
import jakarta.validation.Valid;
import jakarta.transaction.Transactional;
import jakarta.inject.Inject;

// Logging import
import org.jboss.logging.Logger;

// Time handling imports
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Path("/api/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookingResource {

    private static final Logger LOG = Logger.getLogger(BookingResource.class);

    @Inject
    BookingService bookingService;

    @POST
    @Transactional
    public Response createBooking(@Valid BookingRequest bookingRequest) {
        try {
            // Validate booking
            bookingService.validateBooking(bookingRequest);

            // Validate time slot
            if (!isTimeSlotAvailable(bookingRequest.getDate(), bookingRequest.getTime())) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ErrorResponse("Selected time slot is not available"))
                        .build();
            }

            // Create and save the booking
            Booking booking = new Booking(
                bookingRequest.getUsername(),
                bookingRequest.getService(),
                bookingRequest.getDate(),
                LocalTime.parse(bookingRequest.getTime()),
                bookingRequest.getPaymentMethod()
            );
            booking.persist();

            // Return success response
            BookingResponse response = new BookingResponse(
                "Almost there! Proceeding to payment...",
                "SUCCESS",
                booking.id
            );
            return Response.ok(response).build();
            
        } catch (IllegalArgumentException e) {
            LOG.error("Validation error", e);
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage()))
                    .build();
        } catch (Exception e) {
            LOG.error("Unexpected error during booking", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Failed to book an appointment. Please contact the site administrator if this error continues."))
                    .build();
        }
    }

    @GET
    public List<Booking> getAllBookings() {
        return Booking.listAll();
    }

    @GET
    @Path("/{username}")
    public Response getBookingsByUsername(@PathParam("username") String username) {
        try {
            List<Booking> bookings = Booking.list("username", username);
            return Response.ok(bookings).build();
        } catch (Exception e) {
            LOG.error("Error retrieving bookings for user: " + username, e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Failed to retrieve bookings. Please try again later."))
                    .build();
        }
    }

    @PUT
    @Path("/{bookingId}")
    @Transactional
    public Response updateBooking(@PathParam("bookingId") Long bookingId, BookingRequest bookingRequest) {
        try {
            Booking booking = Booking.findById(bookingId);
            if (booking == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Booking not found"))
                        .build();
            }

            if (!isTimeSlotAvailable(bookingRequest.getDate(), bookingRequest.getTime(), bookingId)) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ErrorResponse("Selected time slot is not available"))
                        .build();
            }

            booking.service = bookingRequest.getService();
            booking.date = bookingRequest.getDate();
            booking.time = LocalTime.parse(bookingRequest.getTime());
            booking.paymentMethod = bookingRequest.getPaymentMethod();

            return Response.ok(booking).build();
        } catch (Exception e) {
            LOG.error("Error updating booking: " + bookingId, e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Failed to update booking. Please try again later."))
                    .build();
        }
    }

    @DELETE
    @Path("/{bookingId}")
    @Transactional
    public Response cancelBooking(@PathParam("bookingId") Long bookingId) {
        try {
            Booking booking = Booking.findById(bookingId);
            if (booking == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Booking not found"))
                        .build();
            }
            booking.status = "CANCELLED";
            return Response.noContent().build();
        } catch (Exception e) {
            LOG.error("Error canceling booking: " + bookingId, e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Failed to cancel booking. Please try again later."))
                    .build();
        }
    }

    private boolean isTimeSlotAvailable(LocalDate date, String time) {
        return isTimeSlotAvailable(date, time, null);
    }

    private boolean isTimeSlotAvailable(LocalDate date, String time, Long excludeBookingId) {
        try {
            LocalTime bookingTime = LocalTime.parse(time);
            
            // Basic business hours check (8 AM to 6 PM)
            if (bookingTime.isBefore(LocalTime.of(8, 0)) || bookingTime.isAfter(LocalTime.of(18, 0))) {
                return false;
            }

            // Check for existing bookings
            long conflictingBookings;
            if (excludeBookingId != null) {
                conflictingBookings = Booking.count(
                    "date = ?1 and time = ?2 and id != ?3 and status != 'CANCELLED'",
                    date, bookingTime, excludeBookingId
                );
            } else {
                conflictingBookings = Booking.count(
                    "date = ?1 and time = ?2 and status != 'CANCELLED'",
                    date, bookingTime
                );
            }

            return conflictingBookings == 0;
        } catch (Exception e) {
            LOG.error("Error checking time slot availability", e);
            return false;
        }
    }
}