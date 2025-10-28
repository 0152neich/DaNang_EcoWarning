package com.example.search_service.repository;
import com.example.search_service.domain.entity.Observation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ObservationSearchRepository extends JpaRepository<Observation, Long>, JpaSpecificationExecutor<Observation> {
    // Tương tự, chúng ta sẽ dùng hàm findAll(Specification<Observation> spec, Pageable pageable)
}