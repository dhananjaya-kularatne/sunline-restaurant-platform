package com.sunline.sunline_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class DiagnosticController {
    @GetMapping("/test")
    public String test() {
        return "Backend is reachable and changes are applied";
    }
}
