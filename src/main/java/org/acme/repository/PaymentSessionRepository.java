package org.acme.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.acme.entity.PaymentSession;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@ApplicationScoped
public class PaymentSessionRepository implements PanacheRepository<PaymentSession> {
    @PersistenceContext
    EntityManager entityManager;

    public PaymentSession findBySessionId(String sessionId) {
        return find("sessionId", sessionId).firstResult();
    }

    public void persist(PaymentSession session) {
        entityManager.persist(session);
    }
}