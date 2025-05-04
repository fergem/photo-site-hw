package to.uk.ripplb.photosite.controllers

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.sns.SnsClient
import software.amazon.awssdk.services.sns.model.SubscribeRequest
import to.uk.ripplb.photosite.auth.AuthService

@RestController
@RequestMapping("/subscribe")
class SubscribeController(val authService: AuthService) {

    @Value("\${aws.sns.arn}")
    lateinit var topicArn : String

    @Value("\${aws.region}")
    lateinit var region: String

    fun getSnsClient(): SnsClient {
        return SnsClient.builder()
            .region(Region.of(region))
            .build()
    }

    data class SubscriptionData(val value: Boolean)

    @GetMapping
    fun getSubscribedStatus(principal: JwtAuthenticationToken): SubscriptionData {
        val subscribedValue = principal.token.claims["custom:subscribed"]?.toString() ?: "0"
        return SubscriptionData(subscribedValue == "1")
    }

    @PostMapping
    fun setSubscription(
        principal: JwtAuthenticationToken,
        @RequestBody body: SubscriptionData
    ): ResponseEntity<Void> {
        val username = principal.token.claims["email"]?.toString()
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        if (body.value) {
            getSnsClient().subscribe(
                SubscribeRequest.builder()
                    .protocol("email")
                    .endpoint(username)
                    .topicArn(topicArn)
                    .build()
            )
        }
        authService.setSubscribedStatus(username, if (body.value) 1 else 0)
        return ResponseEntity.ok().build()
    }

}
