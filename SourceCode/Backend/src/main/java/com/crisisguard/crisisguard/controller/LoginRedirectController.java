package com.crisisguard.crisisguard.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class LoginRedirectController {
    @RequestMapping("/redirect")
    public RedirectView loginRedirect(RedirectAttributes attributes, @AuthenticationPrincipal OAuth2User principal) {
        attributes.addAttribute("email", principal.getAttribute("email"));

        return new RedirectView("https://crisis-guard-frontend-d4ce1dc3fa0e.herokuapp.com/maps");
    }
}
