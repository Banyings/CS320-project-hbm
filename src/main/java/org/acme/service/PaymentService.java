package org.acme.service;

import org.acme.entity.Appointment;
import org.acme.entity.PaymentSession;
import org.acme.repository.PaymentSessionRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
public class PaymentService {
    @Inject
    PaymentSessionRepository paymentSessionRepository;

    @PersistenceContext
    EntityManager entityManager;

    @Transactional
    public PaymentSession createPaymentSession(String customerEmail, List<Appointment> appointments, Map<String, Object> totals) {
        try {
            PaymentSession session = new PaymentSession();
            session.setSessionId(UUID.randomUUID().toString());
            session.setCustomerEmail(customerEmail);
            
            // Convert totals
            session.setAmount(convertToDecimal(totals.get("subtotal")));
            session.setTax(convertToDecimal(totals.get("tax")));
            session.setServiceFee(convertToDecimal(totals.get("serviceFee")));
            session.setTotal(convertToDecimal(totals.get("total")));
            session.setStatus("PENDING");

            // Save session first
            entityManager.persist(session);

            // Then save appointments
            for (Appointment appointment : appointments) {
                appointment.setPaymentSession(session);
                entityManager.persist(appointment);
            }

            entityManager.flush();
            return session;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create payment session: " + e.getMessage());
        }
    }

    private BigDecimal convertToDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        if (value instanceof BigDecimal) return (BigDecimal) value;
        if (value instanceof Number) return BigDecimal.valueOf(((Number) value).doubleValue());
        try {
            return new BigDecimal(value.toString());
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    public PaymentSession getPaymentSession(String sessionId) {
        return paymentSessionRepository.findBySessionId(sessionId);
    }

    @Transactional
    public void processPayment(String sessionId, Map<String, String> paymentDetails) {
        PaymentSession session = getPaymentSession(sessionId);
        if (session != null) {
            session.setStatus("COMPLETED");
            entityManager.merge(session);
        }
    }
}