{
  "endpoint": "POST /auth/logout",
  "request": {
    "body": {
      "refreshToken": "string"
    }
  },
  "controller": "AuthController.logout(RefreshTokenReqDTO)",
  "error_sample": {
    "code": 500,
    "message": "Required request body is missing: public org.springframework.http.ResponseEntity<com.tomzxy.web_quiz.dto.responses.DataResDTO<java.lang.Boolean>> com.tomzxy.web_quiz.controllers.AuthController.logout(com.tomzxy.web_quiz.dto.requests.auth.RefreshTokenReqDTO)",
    "items": null
  }
}

@PostMapping(ApiDefined.Auth.LOGOUT)
    @Operation(summary = "User logout", description = "Revoke refresh token")
    public ResponseEntity<DataResDTO<Boolean>> logout(
            @Valid @RequestBody RefreshTokenReqDTO refreshTokenReqDTO) {

        authService.logout(refreshTokenReqDTO.getRefreshToken());

        return ResponseEntity.ok(DataResDTO.ok(true));
    }

public class RefreshTokenReqDTO {
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}
