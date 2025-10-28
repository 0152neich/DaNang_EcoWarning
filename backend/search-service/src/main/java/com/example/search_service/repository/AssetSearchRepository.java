package com.example.search_service.repository;

import com.example.search_service.domain.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetSearchRepository extends JpaRepository<Asset, Long>, JpaSpecificationExecutor<Asset> {
    // JpaSpecificationExecutor sẽ cung cấp cho chúng ta hàm:
    // findAll(Specification<Asset> spec, Pageable pageable)
    // Đây chính là thứ chúng ta cần để tìm kiếm động
}