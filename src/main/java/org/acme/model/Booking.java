package org.acme.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Booking extends PanacheEntity {
    public String username;  // Changed from UserName entity to String
    public String service;
    public LocalDate date;
    public LocalTime time;
    public String paymentMethod;
    public String status = "PENDING"; // PENDING, CONFIRMED, CANCELLED

    // Default constructor required by JPA
    public Booking() {
    }

    public Booking(String username, String service, LocalDate date, LocalTime time, String paymentMethod) {
        this.username = username;
        this.service = service;
        this.date = date;
        this.time = time;
        this.paymentMethod = paymentMethod;
    }
}