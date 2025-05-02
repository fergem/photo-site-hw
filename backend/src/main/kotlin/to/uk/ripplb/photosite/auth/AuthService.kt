package to.uk.ripplb.photosite.auth

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType

@Service
class AuthService {

    @Value("\${COGNITO_CLIENT_ID}")
    private val clientId: String? = null

    @Value("\${COGNITO_USER_POOL_ID}")
    private val userPoolId: String? = null

    @Value("\${aws.region}")
    lateinit var region: String


    fun getCognitoClient(): CognitoIdentityProviderClient {
        // Implement the logic to create and return a Cognito client
        // For example, using AWS SDK for Java
        return CognitoIdentityProviderClient.builder()
            .region(Region.of(region))
            .build()
    }

    fun authenticate(username: String, password: String): String? {
        val cognitoClient = getCognitoClient()
        cognitoClient.initiateAuth {
            it.authFlow("USER_PASSWORD_AUTH")
            it.clientId(clientId)

            it.authParameters(mapOf("USERNAME" to username, "PASSWORD" to password))
        }.also { response ->
            return response.authenticationResult()?.idToken()
        }
    }

    fun register(username: String, password: String): Boolean {
        val cognitoClient = getCognitoClient()
        cognitoClient.signUp{
            it.clientId(clientId)
            it.username(username)
            it.password(password)
        }
        cognitoClient.adminConfirmSignUp {
            it.username(username)
            it.userPoolId(userPoolId)
        }
        return true
    }

    fun setSubscribedStatus(username: String, subscribed: Int) {
        getCognitoClient().adminUpdateUserAttributes {
            it.userPoolId(userPoolId)
            it.username(username)
            it.userAttributes(
                listOf(
                    AttributeType.builder()
                        .name("custom:subscribed")
                        .value(subscribed.toString())
                        .build()
                )
            )
        }
    }

}