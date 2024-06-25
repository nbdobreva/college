package college.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
   public class CORSConfig {

       @Bean
       public CorsFilter CORSFilter() {
           UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
           CorsConfiguration config = new CorsConfiguration();
           config.setAllowCredentials(true);
           config.addAllowedOrigin("http://localhost:3000");
           config.addAllowedHeader("*");
           config.addAllowedMethod("*");
           source.registerCorsConfiguration("/**", config);
           return new CorsFilter(source);
       }
   }