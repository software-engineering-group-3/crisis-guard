package com.crisisguard.crisisguard.auth;

import com.crisisguard.crisisguard.repository.UserRepository;
import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

@Component
public class CheckRole {
    UserRepository userRepository;

    public CheckRole(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean isUser(OAuth2User principal) {
        var role = getRole(principal);

        return role.equals("ROLE_USER") || role.equals("ROLE_AUTHORITY") || role.equals("ROLE_ORGANIZATION");
    }

    public boolean isAuthority(OAuth2User principal) {
        var role = getRole(principal);

        return role.equals("ROLE_AUTHORITY") || role.equals("ROLE_ORGANIZATION");
    }

    public boolean isOrganization(OAuth2User principal) {
        var role = getRole(principal);

        return role.equals("ROLE_ORGANIZATION");
    }

    public String getRole(OAuth2User principal) {
        return userRepository.getUserRole(principal.getAttribute("email"));
    }
}
