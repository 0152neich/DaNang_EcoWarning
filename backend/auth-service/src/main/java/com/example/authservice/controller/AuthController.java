package com.example.authservice.controller;

import com.example.authservice.base.RestApiV1;
import com.example.authservice.base.RestData;
import com.example.authservice.base.VsResponseUtil;
import com.example.authservice.domain.dto.request.ForgotPasswordRequest;
import com.example.authservice.domain.dto.request.RegisterUserRequest;
import com.example.authservice.domain.dto.request.ResetPasswordRequest;
import com.example.authservice.domain.dto.request.SignInRequest;
import com.example.authservice.domain.dto.response.TokenResponse;
import com.example.authservice.domain.entity.User;
import com.example.authservice.service.AuthService;
import com.example.authservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestApiV1
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Authentication APIs")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new user account")
    public ResponseEntity<RestData<?>> register(@Valid @RequestBody RegisterUserRequest request) {
        userService.register(request);
        return VsResponseUtil.success(HttpStatus.CREATED, "Đăng ký tài khoản thành công");
    }

    @PostMapping("/otp-sign-in")
    @Operation(summary = "Sign in with OTP", description = "Authenticate user and send OTP to email")
    public ResponseEntity<RestData<?>> otpSignIn(@Valid @RequestBody SignInRequest request) {
        TokenResponse tokenResponse = authService.getOtpSignIn(request);
        return VsResponseUtil.success(tokenResponse);
    }

    @PostMapping("/verify-sign-in/{otp}")
    @Operation(summary = "Verify OTP for sign in", description = "Verify OTP and return access token")
    public ResponseEntity<RestData<?>> verifySignIn(
            @PathVariable String otp,
            @AuthenticationPrincipal User user
    ) {
        TokenResponse tokenResponse = authService.verifyOtpSignIn(otp, user);
        return VsResponseUtil.success(tokenResponse);
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot password", description = "Send OTP to email for password reset")
    public ResponseEntity<RestData<?>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.getOtpForgotPassword(request.getEmail());
        return VsResponseUtil.success("Mã OTP đã được gửi đến email của bạn");
    }

    @PostMapping("/verify-forgot-password/{otp}")
    @Operation(summary = "Verify OTP for forgot password", description = "Verify OTP for password reset")
    public ResponseEntity<RestData<?>> verifyForgotPassword(
            @PathVariable String otp,
            @RequestParam String email
    ) {
        authService.verifyOtpForgotPassword(otp, email);
        return VsResponseUtil.success("Xác thực OTP thành công, vui lòng đặt mật khẩu mới");
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Reset password after OTP verification")
    public ResponseEntity<RestData<?>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.changePasswordNoAuth(request.getNewPassword(), request.getEmail());
        return VsResponseUtil.success("Đặt lại mật khẩu thành công");
    }

    @PostMapping("/token")
    @Operation(summary = "Get user info from token", description = "Return current user information")
    public ResponseEntity<RestData<?>> getTokenInfo(@AuthenticationPrincipal User user) {
        return VsResponseUtil.success(user);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Logout and invalidate tokens")
    public ResponseEntity<RestData<?>> logout(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String refreshToken
    ) {
        String accessToken = authHeader.substring(7); // Remove "Bearer " prefix
        authService.logout(accessToken, refreshToken);
        return VsResponseUtil.success("Đăng xuất thành công");
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh access token", description = "Generate new access token using refresh token")
    public ResponseEntity<RestData<?>> refreshToken(@RequestParam String refreshToken) {
        // TODO: Implement refresh token logic
        return VsResponseUtil.success("Làm mới token thành công");
    }
}
