package to.uk.ripplb.photosite.controllers

import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.server.ResponseStatusException
import to.uk.ripplb.photosite.entities.PhotoPage
import to.uk.ripplb.photosite.repositories.PhotoRepository
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import to.uk.ripplb.photosite.entities.Photo
import java.util.UUID

@RestController
@RequestMapping("/photos")
class PhotoController(val photoRepository: PhotoRepository) {

    @Value("\${photos.bucket}")
    lateinit var bucket: String

    @Value("\${aws.region}")
    lateinit var region: String

    private fun getS3Client(): S3Client {
        return S3Client.builder()
            .region(Region.of(region))
            .build()
    }

    @PostMapping
    fun upload(@RequestParam name: String, @RequestParam file: MultipartFile) {
        val s3 = getS3Client()
        val id = UUID.randomUUID().toString()
        val key = "$id.${file.originalFilename?.split(".")?.last() ?: "jpg"}"
        val request = PutObjectRequest.builder()
            .bucket(bucket)
            .key(key)
            .build()
        s3.putObject(request, RequestBody.fromInputStream(file.inputStream, file.size))
        val photo = Photo(id, name, "https://$bucket.s3.$region.amazonaws.com/$key")
        photoRepository.save(photo)
    }

    @GetMapping("/{id}")
    fun getPhotoById(@PathVariable("id") id: String): Photo {
        return photoRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Photo not found") }
    }

    @GetMapping
    fun getAllPhotos(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") limit: Int,
        @RequestParam(defaultValue = "name") sortBy: String
    ): PhotoPage {
        val pageable = PageRequest.of(page, limit, Sort.by(sortBy))
        return PhotoPage(photoRepository.findAll(pageable))
    }

    @DeleteMapping("/{id}")
    fun deletePhoto(@PathVariable("id") id: String) {
        val s3 = getS3Client()
        val request = DeleteObjectRequest.builder().bucket(bucket).key(id).build()
        s3.deleteObject(request)
        photoRepository.deleteById(id)
    }

}