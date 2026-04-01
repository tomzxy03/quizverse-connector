@GetMapping(ApiDefined.Quiz.QUESTION)
        @Operation(summary = "Get quiz questions", description = "Get quiz questions by quiz id")
        @PreAuthorize("hasAuthority('quiz_VIEW') OR @lobbySecurity.isQuizHost(#quizId, authentication)")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Get quiz questions successfully", content = @Content(schema = @Schema(implementation = DataResDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
        })
        public ResponseEntity<DataResDTO<List<QuizQuestionResDTO>>> get_Questions(@Parameter(description = "Quiz ID") @PathVariable Long quizId) {
            log.info("Get quiz questions");
            try{
                List<QuizQuestionResDTO> quizQuestions = quizService.get_Questions(quizId);
                return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(DataResDTO.ok(quizQuestions));
            }catch (Exception e){
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(DataResDTO.error(AppCode.BAD_REQUEST, e.getMessage()));
            }
        }
public class QuizQuestionResDTO {
    private QuestionResDTO question;
    private List<Long> correctAnswerIds;
}
