package to.uk.ripplb.photosite.repositories

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import to.uk.ripplb.photosite.entities.Photo

@Repository
interface PhotoRepository : JpaRepository<Photo, String>