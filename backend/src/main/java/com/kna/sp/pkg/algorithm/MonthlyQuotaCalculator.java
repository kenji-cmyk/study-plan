package com.kna.sp.pkg.algorithm;

import com.kna.sp.entity.Subject;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.*;

@Component
public class MonthlyQuotaCalculator {
    public Map<Long, Integer> allocate(List<Subject> subjects, int days, int subjectsPerDay) {
        int totalSlots = Math.multiplyExact(days, subjectsPerDay);
        Map<Long, Integer> quotas = new HashMap<>();
        int minimum = subjects.size() <= totalSlots ? 1 : 0;
        subjects.forEach(subject -> quotas.put(subject.getId(), minimum));
        int unallocated = totalSlots - minimum * subjects.size();

        while (unallocated > 0) {
            List<Subject> eligible = subjects.stream().filter(subject -> quotas.get(subject.getId()) < days).toList();
            if (eligible.isEmpty())
                throw new IllegalArgumentException("Subject capacities cannot fill the requested schedule");
            BigDecimal weightTotal = eligible.stream().map(Subject::getWeight).reduce(BigDecimal.ZERO, BigDecimal::add);
            List<AllocationRemainder> remainders = new ArrayList<>();
            int allocatedThisRound = 0;
            for (Subject subject : eligible) {
                int capacity = days - quotas.get(subject.getId());
                BigDecimal exact = BigDecimal.valueOf(unallocated).multiply(subject.getWeight()).divide(weightTotal, MathContext.DECIMAL128);
                int allocation = Math.min(capacity, exact.intValue());
                if (allocation > 0) {
                    quotas.merge(subject.getId(), allocation, Integer::sum);
                    allocatedThisRound += allocation;
                }
                remainders.add(new AllocationRemainder(subject, exact.remainder(BigDecimal.ONE), capacity - allocation));
            }
            unallocated -= allocatedThisRound;
            if (unallocated == 0) break;
            AllocationRemainder remainder = remainders.stream().filter(item -> item.remainingCapacity() > 0).min(Comparator.comparing(AllocationRemainder::fractionalPart).reversed().thenComparing(item -> item.subject().getId())).orElseThrow(() -> new IllegalArgumentException("Subject capacities cannot fill the requested schedule"));
            quotas.merge(remainder.subject().getId(), 1, Integer::sum);
            unallocated--;
        }
        return Map.copyOf(quotas);
    }

    private record AllocationRemainder(Subject subject, BigDecimal fractionalPart, int remainingCapacity) {
    }
}
