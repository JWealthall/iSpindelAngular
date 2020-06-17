using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace iSpindelAngular
{
    public class RequestResponseLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _logPath;

        public RequestResponseLoggingMiddleware(RequestDelegate next, string logPath)
        {
            _next = next;
            _logPath = logPath;
        }

        public async Task Invoke(HttpContext context)
        {
            var  sb = new StringBuilder(2000);
            sb.AppendLine("Remote Address: " + context.Connection.RemoteIpAddress);
            sb.AppendLine(context.Request.Method + " " + context.Request.Path);
            try
            {
                foreach (var key in context.Request.Headers.Keys)
                    sb.AppendLine(key + ": " + context.Request.Headers[key]);
            }
            catch (Exception)
            {
                // ignore error
            }

            //First, get the incoming request
            var request = await FormatRequest(context.Request);
            sb.AppendLine(request);

            dynamic uniqueid = Guid.NewGuid().ToString();
            var logPath = string.IsNullOrEmpty(_logPath) ? "\\Logs" : _logPath;
            var logfile = string.Format(logPath + "\\Request_{0}_{1}.txt", DateTime.Now.ToString("yyyyMMdd_hhmmss"), uniqueid);
            await using (var f = new StreamWriter(logfile, true))
            {
                f.Write(sb);
            }

            //Copy a pointer to the original response body stream
            var originalBodyStream = context.Response.Body;

            //Create a new memory stream...
            using (var responseBody = new MemoryStream())
            {
                //...and use that for the temporary response body
                context.Response.Body = responseBody;

                //Continue down the Middleware pipeline, eventually returning to this class
                await _next(context);

                //Format the response from the server
                var response = await FormatResponse(context.Response);

                //TODO: Save log to chosen datastore
                await using (var f = new StreamWriter(logfile, true))
                {
                    f.Write(response);
                }

                //Copy the contents of the new memory stream (which contains the response) to the original stream, which is then returned to the client.
                await responseBody.CopyToAsync(originalBodyStream);
            }
        }

        private async Task<string> FormatRequest(HttpRequest request)
        {
            var body = request.Body;

            //This line allows us to set the reader for the request back at the beginning of its stream.
            //request.EnableRewind();
            request.EnableBuffering();

            //We now need to read the request stream.  First, we create a new byte[] with the same length as the request stream...
            var buffer = new byte[Convert.ToInt32(request.ContentLength)];

            //...Then we copy the entire request stream into the new buffer.
            await request.Body.ReadAsync(buffer, 0, buffer.Length);

            //We convert the byte[] into a string using UTF8 encoding...
            var bodyAsText = Encoding.UTF8.GetString(buffer);

            ////..and finally, assign the read body back to the request body, which is allowed because of EnableRewind()
            //request.Body = body;

            request.Body.Position = 0;

            return $"{request.Scheme} {request.Host}{request.Path} {request.QueryString} {bodyAsText}";
        }

        private async Task<string> FormatResponse(HttpResponse response)
        {
            //We need to read the response stream from the beginning...
            response.Body.Seek(0, SeekOrigin.Begin);

            //...and copy it into a string
            string text = await new StreamReader(response.Body).ReadToEndAsync();

            //We need to reset the reader for the response so that the client can read it.
            response.Body.Seek(0, SeekOrigin.Begin);

            //Return the string for the response, including the status code (e.g. 200, 404, 401, etc.)
            return $"{response.StatusCode}: {text}";
        }
    }
}
