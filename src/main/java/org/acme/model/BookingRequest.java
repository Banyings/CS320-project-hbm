// package org.acme.model;

// import jakarta.validation.constraints.Email;
// import jakarta.validation.constraints.FutureOrPresent;
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Pattern;
// import java.time.LocalDate;

// public class BookingRequest {
//     @NotBlank(message = "Email is required")
//     @Email(message = "Please enter a valid email address")
//     private String username;

//     @NotBlank(message = "Service is required")
//     private String service;

//     @FutureOrPresent(message = "Date must be today or in the future")
//     private LocalDate date;

//     @Pattern(regexp = "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Invalid time format")
//     private String time;

//     @NotBlank(message = "Payment method is required")
//     private String paymentMethod;

//     // Getters
//     public String getUsername() {
//         return username;
//     }

//     public String getService() {
//         return service;
//     }

//     public LocalDate getDate() {
//         return date;
//     }

//     public String getTime() {
//         return time;
//     }

//     public String getPaymentMethod() {
//         return paymentMethod;
//     }

//     // Setters
//     public void setUsername(String username) {
//         this.username = username;
//     }

//     public void setService(String service) {
//         this.service = service;
//     }

//     public void setDate(LocalDate date) {
//         this.date = date;
//     }

//     public void setTime(String time) {
//         this.time = time;
//     }

//     public void setPaymentMethod(String paymentMethod) {
//         this.paymentMethod = paymentMethod;
//     }

//     // Optional: Add toString() method for logging/debugging
//     @Override
//     public String toString() {
//         return "BookingRequest{" +
//                 "username='" + username + '\'' +
//                 ", service='" + service + '\'' +
//                 ", date=" + date +
//                 ", time='" + time + '\'' +
//                 ", paymentMethod='" + paymentMethod + '\'' +
//                 '}';
//     }
// }

package org.acme.model;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BookingRequest {
    @NotNull
    private String username;  // Changed from userId to username
    @NotNull
    private String service;
    @NotNull
    private LocalDate date;
    @NotNull
    private String time;
    @NotNull
    private String paymentMethod;

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
