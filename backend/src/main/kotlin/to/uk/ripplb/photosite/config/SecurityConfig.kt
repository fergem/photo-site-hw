package to.uk.ripplb.photosite.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource


@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun corsConfigurationSource(): UrlBasedCorsConfigurationSource {
        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**", CorsConfiguration().apply {
                // Use patterns if you need credentials with wildcard:
                allowedOriginPatterns = listOf("*")
                allowCredentials = true
                allowedMethods = listOf("GET","POST","PUT","DELETE","OPTIONS")
                allowedHeaders = listOf("*")
            })
        }
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }                                  // disable CSRF :contentReference[oaicite:7]{index=7}
            .cors { it.configurationSource(corsConfigurationSource()) } // apply our CORS bean :contentReference[oaicite:8]{index=8}
            .sessionManagement {                                     // stateless JWT API
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authorizeHttpRequests { auth ->                         // open /auth, secure the rest
                auth.requestMatchers("/auth/**").permitAll()
                    .anyRequest().authenticated()
            }
            .securityMatcher("/photos/**")
            .oauth2ResourceServer { oauth2 ->                        // JWT validation filter
                oauth2.jwt()
            }

        return http.build()
    }
}
