package to.uk.ripplb.photosite.entities

import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.time.LocalDateTime

@Entity
class Photo(
    @Id
    val id: String,
    val name: String,
    val url: String?,
    val uploadDate: LocalDateTime = LocalDateTime.now(),
    val numberOfPeople: Int = -1,
)