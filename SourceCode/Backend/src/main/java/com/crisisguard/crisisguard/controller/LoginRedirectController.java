package com.crisisguard.crisisguard.controller;

import com.crisisguard.crisisguard.auth.CheckRole;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class LoginRedirectController {
    CheckRole checkRole;

    public LoginRedirectController(CheckRole checkRole) {
        this.checkRole = checkRole;
    }

    @RequestMapping("/redirect")
    public RedirectView loginRedirect(RedirectAttributes attributes, @AuthenticationPrincipal OAuth2User principal) {
        attributes.addAttribute("email", principal.getAttribute("email"));

        switch (checkRole.getRole(principal)) {
            case "ROLE_USER":
                return new RedirectView("https://crisis-guard-frontend-d4ce1dc3fa0e.herokuapp.com/mapsLogUser");
            case "ROLE_AUTHORITY":
                return new RedirectView("https://crisis-guard-frontend-d4ce1dc3fa0e.herokuapp.com/mapsGove");
            case "ROLE_ORGANIZATION":
                return new RedirectView("https://crisis-guard-frontend-d4ce1dc3fa0e.herokuapp.com/mapsHuma");
            default:
                return new RedirectView("https://crisis-guard-frontend-d4ce1dc3fa0e.herokuapp.com/mapsAnon");
        }
    }

    @RequestMapping("/")
    public RedirectView loginRedirectBaseURL(RedirectAttributes attributes, @AuthenticationPrincipal OAuth2User principal) {
        return loginRedirect(attributes, principal);
    }
}
