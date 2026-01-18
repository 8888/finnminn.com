package necrobloom.functions

import com.microsoft.azure.functions.*
import com.microsoft.azure.functions.annotation.*
import java.util.Optional

class Ping {
    @FunctionName("Ping")
    fun run(
        @HttpTrigger(
            name = "req",
            methods = [HttpMethod.GET],
            authLevel = AuthorizationLevel.ANONYMOUS
        ) request: HttpRequestMessage<Optional<String>>,
        context: ExecutionContext
    ): HttpResponseMessage {
        context.logger.info("NecroBloom Ping Triggered.")
        return request.createResponseBuilder(HttpStatus.OK)
            .body("Vitality stable. NecroBloom is online.")
            .header("Content-Type", "text/plain")
            .build()
    }
}
