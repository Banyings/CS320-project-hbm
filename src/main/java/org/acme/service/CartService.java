package org.acme.service;

import org.acme.entity.Appointment;

import jakarta.enterprise.context.ApplicationScoped;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class CartService {
    public Map<String, Object> calculateTotals(List<Appointment> appointments) {
        BigDecimal subtotal = appointments.stream()
            .map(Appointment::getPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal tax = subtotal.multiply(new BigDecimal("0.08"));
        BigDecimal serviceFee = new BigDecimal("5.00");
        BigDecimal total = subtotal.add(tax).add(serviceFee);

        Map<String, Object> totals = new HashMap<>();
        totals.put("subtotal", subtotal);
        totals.put("tax", tax);
        totals.put("serviceFee", serviceFee);
        totals.put("total", total);

        return totals;
    }
}