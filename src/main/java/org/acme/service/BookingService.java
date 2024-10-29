package org.acme.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.Valid;
import java.time.LocalTime;
import org.acme.model.BookingRequest;
import org.acme.exception.BookingException;
import org.jboss.logging.Logger;

@ApplicationScoped
public class BookingService {
    
    private static final Logger LOG = Logger.getLogger(BookingService.class);
    private static final String GENERIC_ERROR_MESSAGE = 
        "Failed to book an appointment. Please contact the site administrator if this error continues.";

    public void validateBooking(@Valid BookingRequest booking) {
        try {
            validateBusinessHours(booking.getTime());
            validateService(booking.getService());
            validatePaymentMethod(booking.getPaymentMethod());
        } catch (IllegalArgumentException e) {
            // Rethrow validation errors with specific messages
            throw e;
        } catch (Exception e) {
            // Log the actual error but return generic message
            LOG.error("Booking validation error", e);
            throw new BookingException(GENERIC_ERROR_MESSAGE);
        }
    }

    private void validateBusinessHours(String time) {
        try {
            LocalTime bookingTime = LocalTime.parse(time);
            LocalTime openTime = LocalTime.of(8, 0);
            LocalTime closeTime = LocalTime.of(18, 0);

            if (bookingTime.isBefore(openTime) || bookingTime.isAfter(closeTime)) {
                throw new IllegalArgumentException("Booking time must be between 8 AM and 6 PM");
            }
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw e;
            }
            LOG.error("Error validating business hours", e);
            throw new BookingException(GENERIC_ERROR_MESSAGE);
        }
    }

    private void validateService(String service) {
        try {
            if (!isValidService(service)) {
                throw new IllegalArgumentException("Invalid service selected");
            }
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw e;
            }
            LOG.error("Error validating service", e);
            throw new BookingException(GENERIC_ERROR_MESSAGE);
        }
    }

    private boolean isValidService(String service) {
        if (service == null) {
            throw new IllegalArgumentException("Service cannot be null");
        }
        return service.matches("haircut|shave|beard_trim|beard_trim & haircut");
    }

    private void validatePaymentMethod(String paymentMethod) {
        try {
            if (!isValidPaymentMethod(paymentMethod)) {
                throw new IllegalArgumentException("Invalid payment method selected");
            }
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw e;
            }
            LOG.error("Error validating payment method", e);
            throw new BookingException(GENERIC_ERROR_MESSAGE);
        }
    }

    private boolean isValidPaymentMethod(String paymentMethod) {
        if (paymentMethod == null) {
            throw new IllegalArgumentException("Payment method cannot be null");
        }
        return paymentMethod.matches("credit_card|debit_card|cash|cash_app|paypal|venmo|zelle");
    }
}