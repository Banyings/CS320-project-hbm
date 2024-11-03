package org.acme.exception;

import org.acme.entity.Appointment;
import org.acme.repository.AppointmentRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.util.*;

@ApplicationScoped
public class BookingService {
    @Inject
    AppointmentRepository appointmentRepository;
    
    @PersistenceContext
    EntityManager entityManager;

    // Update service names to match frontend
    private static final Map<String, BigDecimal> SERVICES = new HashMap<>() {{
        put("Shave", new BigDecimal("30.00"));
        put("Haircut", new BigDecimal("60.00"));
        put("Beard_Trim", new BigDecimal("45.00"));
        put("Bird_Trim_and_HairCut", new BigDecimal("25.00"));
    }};

    // Update payment method names to match frontend
    private static final List<String> PAYMENT_METHODS = Arrays.asList(
        "Credit_Card",
        "Debit_Card",
        "PayPal"
    );

    public Map<String, BigDecimal> getServices() {
        return Collections.unmodifiableMap(SERVICES);
    }

    public List<String> getPaymentMethods() {
        return Collections.unmodifiableList(PAYMENT_METHODS);
    }

    @Transactional
    public Appointment createAppointment(Appointment appointment) {
        // Handle case where service name might have spaces
        String serviceKey = appointment.getService().replace(" ", "_");
        BigDecimal price = SERVICES.get(serviceKey);
        if (price == null) {
            // Try without underscores
            price = SERVICES.get(appointment.getService());
        }
        appointment.setPrice(price);
        entityManager.persist(appointment);
        return appointment;
    }

    // Helper method to get service price
    public BigDecimal getServicePrice(String serviceName) {
        return SERVICES.get(serviceName.replace(" ", "_"));
    }
}