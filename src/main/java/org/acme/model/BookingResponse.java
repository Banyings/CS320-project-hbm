// src/main/java/org/acme/model/BookingResponse.java
package org.acme.model;

public class BookingResponse {
    private String message;
    private String status;
    private Long bookingId;

    public BookingResponse() {
    }

    public BookingResponse(String message, String status, Long bookingId) {
        this.message = message;
        this.status = status;
        this.bookingId = bookingId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }
}