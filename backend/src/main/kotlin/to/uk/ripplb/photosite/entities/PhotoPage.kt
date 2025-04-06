package to.uk.ripplb.photosite.entities

import org.springframework.data.domain.Page

class PhotoPage(
    pageObject: Page<Photo>,
    val total: Long = pageObject.totalElements,
    val page: Int = pageObject.number,
    val limit: Int = pageObject.size,
    val data: List<Photo> = pageObject.content,
)