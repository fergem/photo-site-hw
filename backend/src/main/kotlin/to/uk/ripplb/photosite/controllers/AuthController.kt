package to.uk.ripplb.photosite.controllers

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import to.uk.ripplb.photosite.auth.AuthService

@RestController
@RequestMapping("/auth")
class AuthController(val authService: AuthService) {

    @PostMapping("/register")
    fun register(@RequestBody registerRequest: UserRequest): HttpStatus {
        return if (authService.register(registerRequest.username, registerRequest.password)) {
            HttpStatus.CREATED
        } else {
            HttpStatus.BAD_REQUEST
        }
    }

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: UserRequest): Map<String, String> {
        return authService.authenticate(loginRequest.username, loginRequest.password)?.let { mapOf("token" to it) } ?: throw ResponseStatusException(
            HttpStatus.UNAUTHORIZED, "Invalid credentials"
        )
    }

}

data class UserRequest(
    val username: String,
    val password: String
)