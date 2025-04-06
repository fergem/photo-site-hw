package to.uk.ripplb.photosite

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class PhotositeApplication

fun main(args: Array<String>) {
	runApplication<PhotositeApplication>(*args)
}
